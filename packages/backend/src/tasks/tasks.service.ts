import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';

@Injectable()
export class TasksService {
  constructor(private readonly dbService: DBService) {}

  async getTasks() {
    const sql = this.dbService.sql;

    return sql`
      SELECT
        t.id,
        t.task_name,
        t.description,
        t.created_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',
              u.id,
              'username',
              u.username,
              'full_name',
              u.full_name,
              'email',
              u.email
            )
          ) FILTER (
            WHERE
              u.id IS NOT NULL
          ),
          '[]'
        ) AS shared_with
      FROM
        tasks t
        LEFT JOIN tasks_users tu ON t.id = tu.task_id
        LEFT JOIN users u ON tu.user_id = u.id
      GROUP BY
        t.id
      ORDER BY
        t.created_at DESC;
    `;
  }

  async createTask(taskData: {
    task_name: string;
    description: string;
    shared_with: number[];
  }) {
    const sql = this.dbService.sql;

    // Create the task and get the ID
    const [task] = await sql`
      INSERT INTO
        tasks (task_name, description)
      VALUES
        (
          ${taskData.task_name},
          ${taskData.description}
        )
      RETURNING
        *;
    `;

    // Insert task-user associations into the join table
    if (taskData.shared_with && taskData.shared_with.length > 0) {
      const values = taskData.shared_with
        .map((userId) => `(${task.id}, ${userId})`)
        .join(', ');
      await sql.unsafe(
        `INSERT INTO tasks_users (task_id, user_id) VALUES ${values};`,
      );
    }

    return { message: 'Task created successfully', task };
  }

  async deleteTask(taskId: number) {
    const sql = this.dbService.sql;

    // The following is not needed if ON DELETE CASCADE is applied
    await sql`
      DELETE FROM tasks_users
      WHERE
        task_id = ${taskId};
    `;

    return sql`
      DELETE FROM tasks
      WHERE
        id = ${taskId}
      RETURNING
        *;
    `;
  }

  async updateTask(
    taskId: number,
    taskData: {
      task_name?: string;
      description?: string;
      shared_with?: number[];
    },
  ) {
    const sql = this.dbService.sql;

    // Update task details
    await sql`
      UPDATE tasks
      SET
        task_name = COALESCE(${taskData.task_name}, task_name),
        description = COALESCE(${taskData.description}, description)
      WHERE
        id = ${taskId};
    `;

    // Update shared_with associations if provided
    if (taskData.shared_with) {
      // Clear existing associations for the task
      await sql`
        DELETE FROM tasks_users
        WHERE
          task_id = ${taskId};
      `;

      // Add new associations
      if (taskData.shared_with.length > 0) {
        const values = taskData.shared_with
          .map((userId) => `(${taskId}, ${userId})`)
          .join(', ');
        await sql.unsafe(
          `INSERT INTO tasks_users (task_id, user_id) VALUES ${values};`,
        );
      }
    }

    return { message: 'Task updated successfully' };
  }
}
