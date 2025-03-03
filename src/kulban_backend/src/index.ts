import express, { Request } from "express";

let db = {
  hello: "",
};

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(express.json());

app.get("/db", (req, res) => {
  res.json(db);
});

// eslint-disable-next-line
app.post('/db/update', (req: Request<any, any, typeof db>, res) => {
  db = req.body;

  res.json(db);
});

app.listen();
