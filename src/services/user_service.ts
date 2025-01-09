import { CreateUserDto } from "../dtos/user/create-user.dto";
import { User } from "../entity/user";
import {
  createNewUser,
  getAllUsers,
  getUserByEmail,
} from "../repository/user_repository";

export const getUsers = async (): Promise<User[]> => {
  return getAllUsers();
};

export const createUser = async (userDto: CreateUserDto): Promise<User> => {
  const checkIfUser = await getUserByEmail(userDto.email);
  if (checkIfUser) throw new Error("User already exists!");

  const user = new User();
  user.name = userDto.name;
  user.email = userDto.email;
  user.role = userDto.role;
  user.isOnboarded = false;
  user.createdAt = new Date();
  user.updatedAt = new Date();

  const newUser = await createNewUser(user);

  return newUser;
};
