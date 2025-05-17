import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email } = createUserDto;
    const { password } = createUserDto;
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);

    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`email ${email} nay da ton tai`);
    }
    const newUser = await this.UserModel.create({
      ...createUserDto,
      role: createUserDto.role ?? 'USER',
      password: hashPassword,
      createdBy: {
        _id: user?._id,
        email: user?.email,
      },
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  async register(RegisterUserDto: RegisterUserDto) {
    const { email } = RegisterUserDto;
    const { password } = RegisterUserDto;
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);

    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`email ${email} nay da ton tai`);
    }
    const user = await this.UserModel.create({
      ...RegisterUserDto,
      role: RegisterUserDto.role ?? 'USER',
      password: hashPassword,
    });

    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    return this.UserModel.find({ _id: id }).select('-password');
  }

  findOneByUsername = async (username: string) => {
    return await this.UserModel.findOne({ email: username });
  };

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async updateRefreshToken(refresh_token: string, _id: string) {
    return await this.UserModel.updateOne(
      { _id },
      {
        refreshToken: refresh_token,
      },
    );
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken });
  };

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.UserModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.UserModel.softDelete({ _id: id });
  }
}
