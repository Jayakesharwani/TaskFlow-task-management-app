import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EmailService } from '../email/email.service';
import { WeatherService } from '../weather/weather.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly weatherService: WeatherService,
  ) {}

  // =====================================================
  // CREATE TASK
  // =====================================================

  async create(
    userId: string,
    createTaskDto: CreateTaskDto,
    files: Express.Multer.File[] = [],
  ) {
    const { dueDate, ...taskData } = createTaskDto;

    // 1. Get logged-in user's email
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Upload files to Cloudinary
    const uploadedFiles: {
      fileName: string;
      fileUrl: string;
      publicId: string;
      mimeType: string;
      size: number;
    }[] = [];

    for (const file of files) {
      console.log(
        'Uploading file to Cloudinary:',
        file.originalname,
      );

      const result =
        await this.cloudinaryService.uploadFile(file);

      uploadedFiles.push({
        fileName: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        mimeType: file.mimetype,
        size: file.size,
      });
    }

    // 3. Create task + attachments
    const task = await this.prisma.task.create({
      data: {
        ...taskData,

        dueDate: dueDate
          ? new Date(dueDate)
          : undefined,

        userId,

        attachments: {
          create: uploadedFiles,
        },
      },

      include: {
        attachments: true,
      },
    });

    // 4. Send task-created confirmation email
    try {
      await this.emailService.sendTaskCreatedEmail(
        user.email,
        task.title,
      );
    } catch (error) {
      console.error(
        'Task created, but confirmation email failed:',
        error,
      );
    }

    // 5. Return created task
    return task;
  }

  // =====================================================
  // FIND ALL TASKS
  // =====================================================

  async findAll(
    userId: string,
    query: TaskQueryDto,
  ) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: any = {
      userId,
    };

    // Status filter
    if (status) {
      where.status = status;
    }

    // Priority filter
    if (priority) {
      where.priority = priority;
    }

    // Search filter
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Due-date range filter
    if (startDate || endDate) {
      where.dueDate = {};

      if (startDate) {
        where.dueDate.gte = new Date(startDate);
      }

      if (endDate) {
        where.dueDate.lte = new Date(endDate);
      }
    }

    // Allowed sorting fields
    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'dueDate',
      'title',
      'priority',
      'status',
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const safeSortOrder =
      sortOrder === 'asc' ? 'asc' : 'desc';

    // Pagination
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,

        include: {
          attachments: true,
        },

        orderBy: {
          [safeSortBy]: safeSortOrder,
        },

        skip,
        take: limit,
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tasks,

      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // =====================================================
  // FIND ONE TASK
  // =====================================================

  async findOne(
    userId: string,
    taskId: string,
  ) {
    const task =
      await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
        },

        include: {
          attachments: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    return task;
  }

  // =====================================================
  // UPDATE TASK
  // =====================================================

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    // 1. Verify task belongs to logged-in user
    const existingTask =
      await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
        },
      });

    if (!existingTask) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    // 2. Get user's email
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          email: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    // 3. Prepare update data
    const {
      dueDate,
      ...taskData
    } = updateTaskDto;

    const data: any = {
      ...taskData,
    };

    // 4. Handle due date
    if (dueDate !== undefined) {
      data.dueDate = dueDate
        ? new Date(dueDate)
        : null;
    }

    // 5. Handle COMPLETED status
    const isBeingCompleted =
      updateTaskDto.status === 'COMPLETED' &&
      existingTask.status !== 'COMPLETED';

    if (isBeingCompleted) {
      data.completedAt = new Date();
    }

    if (
      updateTaskDto.status &&
      updateTaskDto.status !== 'COMPLETED'
    ) {
      data.completedAt = null;
    }

    // 6. Update task
    const updatedTask =
      await this.prisma.task.update({
        where: {
          id: taskId,
        },

        data,

        include: {
          attachments: true,
        },
      });

    // 7. Send completion email
    if (isBeingCompleted) {
      try {
        await this.emailService.sendTaskCompletedEmail(
          user.email,
          updatedTask.title,
        );
      } catch (error) {
        console.error(
          'Task completed, but completion email failed:',
          error,
        );
      }
    }

    return updatedTask;
  }

  // =====================================================
  // DELETE TASK
  // =====================================================

  async remove(
    userId: string,
    taskId: string,
  ) {
    // 1. Verify ownership
    const existingTask =
      await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
        },
      });

    if (!existingTask) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    // 2. Delete task
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    // 3. Response
    return {
      message: 'Task deleted successfully',
    };
  }

  // =====================================================
  // GET TASK WEATHER
  // =====================================================

  async getWeather(
    userId: string,
    taskId: string,
  ) {
    // 1. Find task and verify ownership
    const task =
      await this.prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
        },

        select: {
          id: true,
          title: true,
          location: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    // 2. Check location
    if (!task.location) {
      throw new NotFoundException(
        'This task does not have a location',
      );
    }

    // 3. Get current weather
    const weather =
      await this.weatherService.getCurrentWeather(
        task.location,
      );

    // 4. Return weather information
    return {
      taskId: task.id,
      taskTitle: task.title,
      location: task.location,
      weather,
    };
  }
}