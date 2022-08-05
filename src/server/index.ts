import express from "express";
import { expressjwt } from "express-jwt";
import { api } from "./api";

const app = express();
app.use(
  expressjwt({
    secret: process.env["JWT_SECRET"] || "my secret",
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
);
app.use(api);

app.listen(3002, () => console.log("Server started"));
