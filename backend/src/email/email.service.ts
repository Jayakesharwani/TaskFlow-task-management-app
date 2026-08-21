import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const host =
      this.configService.get<string>('EMAIL_HOST');

    const port =
      this.configService.get<number>('EMAIL_PORT');

    const user =
      this.configService.get<string>('EMAIL_USER');

    const password =
      this.configService.get<string>('EMAIL_PASSWORD');

    if (!host || !port || !user || !password) {
      throw new Error(
        'Email environment variables are not configured correctly.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
    });

    console.log('Email service configured successfully');
  }

  async sendTaskCreatedEmail(
    email: string,
    taskTitle: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:
          this.configService.get<string>(
            'EMAIL_FROM',
          ) || this.configService.get<string>(
            'EMAIL_USER',
          ),

        to: email,

        subject: 'Task Created - TaskFlow',

        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Task Created Successfully</h2>

            <p>Your task has been successfully created in TaskFlow.</p>

            <p>
              <strong>Task:</strong>
              ${taskTitle}
            </p>

            <p>
              You can log in to TaskFlow to view and manage your task.
            </p>

            <hr />

            <p style="color: #666;">
              This is an automated email from TaskFlow.
            </p>
          </div>
        `,
      });

      console.log(
        `Task creation email sent to ${email}`,
      );
    } catch (error) {
      console.error(
        'Failed to send task creation email:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to send task creation email',
      );
    }
  }

  async sendTaskCompletedEmail(
    email: string,
    taskTitle: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:
          this.configService.get<string>(
            'EMAIL_FROM',
          ) || this.configService.get<string>(
            'EMAIL_USER',
          ),

        to: email,

        subject: 'Task Completed - TaskFlow',

        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Task Completed 🎉</h2>

            <p>
              Your task has been marked as completed.
            </p>

            <p>
              <strong>Task:</strong>
              ${taskTitle}
            </p>

            <p>
              Great job!
            </p>

            <hr />

            <p style="color: #666;">
              This is an automated email from TaskFlow.
            </p>
          </div>
        `,
      });

      console.log(
        `Task completion email sent to ${email}`,
      );
    } catch (error) {
      console.error(
        'Failed to send task completion email:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to send task completion email',
      );
    }
  }
}