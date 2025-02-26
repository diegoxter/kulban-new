import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());

app.use(express.static("/dist"));

app.listen();
