import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { TaskQueryDto } from './dto/task-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  // =====================================================
  // CREATE TASK + FILE UPLOAD
  // =====================================================

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per file
      },
    }),
  )
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('========== CREATE TASK ==========');
    console.log('USER:', request.user);
    console.log('BODY:', createTaskDto);
    console.log('FILES:', files);
    console.log('=================================');

    return this.tasksService.create(
      request.user.userId,
      createTaskDto,
      files || [],
    );
  }

  // =====================================================
  // GET ALL TASKS
  // =====================================================

  @Get(':id/weather')
getWeather(
  @Req() request: AuthenticatedRequest,
  @Param('id') taskId: string,
) {
  return this.tasksService.getWeather(
    request.user.userId,
    taskId,
  );
}


  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: TaskQueryDto,
  ) {
    return this.tasksService.findAll(
      request.user.userId,
      query,
    );
  }

  // =====================================================
  // GET SINGLE TASK
  // =====================================================

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.findOne(
      request.user.userId,
      taskId,
    );
  }

  // =====================================================
  // UPDATE TASK
  // =====================================================

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      request.user.userId,
      taskId,
      updateTaskDto,
    );
  }

  // =====================================================
  // DELETE TASK
  // =====================================================

  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.remove(
      request.user.userId,
      taskId,
    );
  }
}