import express from "express";

import router from "../routes/index.js";
import NotFoundError from "../exceptions/notfound-error.js";

import "dotenv/config";
import ErrorHandler from "../middlewares/error.js";

const app = express();

const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(router);

app.use((req, _res, next) => {
  next(new NotFoundError("Endpoint not found"));
});

app.use(ErrorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, host, () => {
    console.log(`server running http://${host}:${port}`);
  });
}

export default app;
