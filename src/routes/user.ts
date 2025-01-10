import { plainToClass } from "class-transformer";
import Router from "koa-router";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { createUser, getUsers } from "../services/user_service";

const router = new Router();

router.prefix("/users");

router.get("", async (ctx) => {
  try {
    ctx.status = 200;
    ctx.body = await getUsers();
  } catch (error) {
    console.log(error);
  }
});

router.post("", async (ctx) => {
  try {
    const body = plainToClass(CreateUserDto, ctx.request.body);

    const result = await createUser(body);

    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = `Erro ao criar usuário! ${error}`;
  }
});

export default router;
