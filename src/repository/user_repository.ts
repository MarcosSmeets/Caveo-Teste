import AppDataSource from "../../data-source";
import { User } from "../entity/user";

export const getAllUsers = async (): Promise<User[]> => {
  const repository = AppDataSource.getRepository(User);
  return await repository.find();
};

export const createNewUser = async (user: User): Promise<User> => {
  const repository = AppDataSource.getRepository(User);
  return await repository.save(user);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOne({ where: { email } });

  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOne({ where: { id } });

  return user;
};

export const updateUserData = async (user: User): Promise<User> => {
  const repository = AppDataSource.getRepository(User);
  return await repository.save(user);
};
