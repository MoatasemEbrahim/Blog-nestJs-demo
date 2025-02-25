import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/shared/interfaces/user.interface";
import { UsersRepository } from "./users.repository";
import { getResponseMessage } from "../../shared/constants/messages.constant";
import { Role, RoleType } from "../../shared/interfaces/role.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  getProfile(user: User) {
    const myUser = user;
    delete myUser.password;
    return myUser;
  }

  async getAllUsers(user: User): Promise<User[]> {
    try {
      const users = await this.userRepo.find({});
      return users.filter((it) => it.id !== user.id);
    } catch (error) {
      throw error;
    }
  }

  async getUsersCount(): Promise<number> {
    try {
      const users = await this.userRepo.find({});
      return users.length;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(userId: number, role: string) {
    try {
      const hasRole: RoleType | null = Role[role];
      if (!hasRole)
        throw new BadRequestException(getResponseMessage("INVALID_ROLE"));

      try {
        await this.userRepo.update(userId, {
          role: hasRole,
        });
        return hasRole;
      } catch (e) {
        throw new BadRequestException(getResponseMessage("INVALID_USER_ID"));
      }
    } catch (error) {
      throw error;
    }
  }


  async createAdminUser() {
    const password = await bcrypt.hash('test', 10);
    return this.userRepo.create({
      username: 'test',
      password,
      email: "fake@gmail.com",
      role: Role.ADMIN,
    });
  }
}
