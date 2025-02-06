import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";

import { SignInDto } from "./dtos/signin.dto";

import * as bcrypt from "bcrypt";
import { SignUpDto } from "./dtos/signup.dto";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { ConfigService } from "@nestjs/config";
import { Configs } from "../../configuration";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService<Configs>
  ) {}

  async signUp(userDto: SignUpDto) {
    try {
      const usersExist = await this.userRepository.findByEmailOrUsername(
        userDto.email,
        userDto.username
      );
      if (usersExist.length > 0)
        throw new BadRequestException("Email or username already exist");

      const newUser = {
        ...userDto,
      };

      newUser.password = await bcrypt.hash(newUser.password, 10);

      const user = await this.userRepository.create(newUser);

      return this.jwtSignUserId(user.id);
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: SignInDto) {
    try {
      const userExist = await this.userRepository.findOneByUsername(
        user.username
      );
      if (!userExist) throw new UnauthorizedException("invalid credentials");

      const passwordIsMatch = await bcrypt.compare(
        user.password,
        userExist.password
      );
      if (!passwordIsMatch)
        throw new UnauthorizedException("invalid credentials");

      return this.jwtSignUserId(userExist.id);
    } catch (error) {
      throw error;
    }
  }

  private jwtSignUserId(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get("JWT_SECRET"),
      }
    );
  }
}
