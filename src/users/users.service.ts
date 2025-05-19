import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/Schemas/role.schema';
import {
  IUser,
  PARENT_ROLE,
  STUDENT_ROLE,
  TEACHER_ROLE,
} from 'src/types/global.constanst';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private RoleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, role, qualification, specialization, children, parent } =
      createUserDto;
    const { password } = createUserDto;
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);

    const isExist = await this.UserModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`email ${email} nay da ton tai`);
    }

    const checkedRole = await this.RoleModel.findOne({ _id: role });
    switch (checkedRole?.name) {
      case TEACHER_ROLE:
        if (!qualification || !specialization) {
          throw new BadRequestException(
            'Giáo viên cần có qualification và specialization',
          );
        }
        break;
      case STUDENT_ROLE:
        if (!parent) {
          throw new BadRequestException('hoc vien cần có parent');
        }
        break;
      case PARENT_ROLE:
        if (!children) {
          throw new BadRequestException('Phụ huynh cần có children');
        }
        break;
    }

    const newUser = await this.UserModel.create({
      ...createUserDto,
      role: role ?? 'USER',
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

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * +limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.UserModel.find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById({ _id: id })
      .populate({ path: 'role', select: { name: 1, _id: 1 } })
      .populate({ path: 'children', select: { name: 1, _id: 1 } })
      .populate({ path: 'parent', select: { name: 1, _id: 1 } })
      .select('-password');
    return user;
  }

  findOneByUsername = async (username: string) => {
    return this.UserModel.findOne({ email: username }).populate({
      path: 'role',
      select: { name: 1 },
    });
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
