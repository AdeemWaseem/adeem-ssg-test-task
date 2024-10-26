import { Injectable } from '@nestjs/common';
import { DBService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DBService) {}

  async getUsers() {
    const sql = this.dbService.sql;

    return sql`
      SELECT
        *
      FROM
        users;
    `;
  }
}
