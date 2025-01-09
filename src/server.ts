import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import cors from "koa2-cors";
import AppDataSource from "../data-source";
import config from "./config";
import user from "./routes/user";

const app = new Koa();
const PORT = config.port || 3000;

app.use(bodyParser());
app.use(
  cors({
    origin: "*",
  })
);
app.use(logger());
app.use(user.routes());

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco de dados:", err);
  });

export default app;
