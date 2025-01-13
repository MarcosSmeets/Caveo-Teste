import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UpdateUserDto } from "../dtos/user/update-user.dto";
import { User } from "../entity/user";
import { generateToken, signupCognito } from "../middleware/aws-cognite";
import {
  createNewUser,
  getAllUsers,
  getByUsername,
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

  const cognito = await signupCognito(user.name, user.email, userDto.password);
  // await addToGroup(userDto.name, userDto.role, cognito.UserSub);

  return newUser;
};

export const getUser = async (id: string): Promise<User | null> => {
  const user = await getUserById(id);

  if (!user) throw new Error("User not found!");

  return user;
};

export const updateUser = async (userDto: UpdateUserDto): Promise<User> => {
  const user = await getUserById(userDto.userId);

  if (!user) throw new Error("User not found!");

  if (user.role == "user") {
    if (user.id != userDto.userId) {
      throw new Error("cant change other users info!");
    }
    user.name = userDto.name;
    user.isOnboarded = true;
    user.updatedAt = new Date();
  } else if (user.role == "admin") {
    user.name = userDto.name;
    user.role = userDto.role;
    user.updatedAt = new Date();
  }

  const updatedUser = await updateUserData(user);

  console.log(updateUser);

  return updatedUser;
};

export const getUserEmail = async (email: string): Promise<User | null> => {
  return getUserByEmail(email);
};

export const authenticateUser = async (dto: CreateUserDto): Promise<String> => {
  const user = await getUserByEmail(dto.email);

  let token;

  if (!user) {
    const newUser = await createUser(dto);
    // token = await generateToken(dto.name, dto.password);
  }

  token = await generateToken(dto.name, dto.password);

  return token;
};

export const getUserByName = async (username: string): Promise<User | null> => {
  return await getByUsername(username);
};
