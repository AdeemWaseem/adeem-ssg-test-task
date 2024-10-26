import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DBService } from '../db/db.service'; // Adjust import path if necessary
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DBService) {}

  async login(loginDto: LoginDto) {
    const sql = this.dbService.sql;

    const [user] = await sql`
      SELECT
        id,
        username,
        full_name
      FROM
        users
      WHERE
        username = ${loginDto.username}
        AND password = ${loginDto.password}
      LIMIT
        1;
    `;

    if (!user) {
      // throw new UnauthorizedException('Invalid credentials');
      return { message: 'Invalid credentials', data: {} };
    }

    // Update `isLogin` to true for the logged-in user
    await sql`
      UPDATE users
      SET
        isLogin = TRUE
      WHERE
        id = ${user.id};
    `;

    // Return login success message with user details
    return { message: 'Login successful', data: { ...user, isLogin: true } };
  }

  async logout(userId: string) {
    const sql = this.dbService.sql;

    // Update `isLogin` to false for the logged-out user
    await sql`
      UPDATE users
      SET
        isLogin = FALSE
      WHERE
        id = ${userId};
    `;

    return { message: 'Logout successful' };
  }
}
