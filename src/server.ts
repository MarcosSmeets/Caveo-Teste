import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import Router from "koa-router";
import cors from "koa2-cors";

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 3000;

app.use(bodyParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger());
app.use(router.routes());

router.get("/", async (ctx) => {
  try {
    ctx.body = {
      status: "success",
      message: "hello, world!",
    };
  } catch (error) {
    console.log(error);
  }
});

const server = app
  .listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);
  })
  .on("error", (err) => {
    console.log(err);
  });

export default server;
