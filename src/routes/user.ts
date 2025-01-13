import { plainToClass } from "class-transformer";
import Router from "koa-router";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UpdateUserDto } from "../dtos/user/update-user.dto";
import { authorizationMiddleware, getUsernameInToken } from "../middleware/aws-cognite";
import { authenticateUser, getUserByName, getUsers, updateUser } from "../services/user_service";

const router = new Router();

router.get("/users", authorizationMiddleware(["admin"]), async (ctx) => {
  try {
    ctx.status = 200;
    ctx.body = await getUsers();
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
});

router.post("/auth", async (ctx) => {
  try {
    const body = plainToClass(CreateUserDto, ctx.request.body);

    const result = await authenticateUser(body);

    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Erro ao criar usuário! ${error}`;
  }
});

router.get("/me", authorizationMiddleware(["admin","user"]), async (ctx) => {
  try {
    const token = ctx.headers['authorization']?.split(' ')[1];

    const username = await getUsernameInToken(token);

    ctx.status = 200;
    ctx.body = await getUserByName(username)
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
});

export default router;

router.post("/edit-account", authorizationMiddleware(["admin","user"]), async (ctx) => {
  try {
    const body = plainToClass(UpdateUserDto, ctx.request.body);

    const result = await updateUser(body)

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error;
  }
})