import { CreateUserDto } from "../dtos/user/create-user.dto";
import { User } from "../entity/user";
import {
  createNewUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUserData,
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

export const getUser = async (id: string): Promise<User | null> => {
  const user = await getUserById(id);

  if (!user) throw new Error("User not found!");

  return user;
};

export const updateUser = async (
  id: string,
  userDto: CreateUserDto
): Promise<User> => {
  const user = await getUserById(id);

  if (!user) throw new Error("User not found!");

  user.name = userDto.name;
  user.email = userDto.email;
  user.role = userDto.role;
  user.updatedAt = new Date();

  const updatedUser = await updateUserData(user);

  return updatedUser;
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  return getUserByEmail(email);
};

export const authenticateUser = async (emil: string): Promise<String> => {
  const user = await getUserByEmail(emil);

  if (!user) throw new Error("User not found!");

  const token = "token";

  return token;
};
