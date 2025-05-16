import express, { Request, Response } from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3002;

const getConnection = () => {
  // Create the connection to database
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "PhotoBook",
    password: "vincent1",
    port: 3306,
  });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Users type definition
interface Users {
  ID: number;
  username: string;
  created: Date;
  lastUpdated: Date;
}

// Photo type definition
interface Photo {
  ID: number;
  URL: string;
  lat: number;
  lng: number;
  created: Date;
  lastUpdated: Date;
  userID: number;
}

// GET /todos - return all todos
app.get("/users", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  getConnection()
    .then((connection) => {
      return connection.query("Select * from Users;");
    })
    .then(([results, fields]) => {
      res.send(results);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

app.options("/users", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

// POST /users - add a new user
app.post("/users", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  // try {
  //   const {username} =
  //     req.body;
  //   if (!username) {
  //     res.status(400).json({
  //       error: "Username is required.",
  //     });
  //     return;
  //   }
  //   const newUser: Users = {
  //     username
  //   };
  //   users.push(newTodo);
  //   res.status(201).json(newTodo);
  // } catch (err) {
  //   res.status(400).json({
  //     error:
  //       "Invalid request body. Expected: Summary, Author, Description, ImageURL, category, and Completed",
  //   });
  // }
});

app.get("/users/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  getConnection()
    .then((connection) => {
      return connection.execute("Select * from Users where ID = ?;", [
        req.params.id,
      ]);
    })
    .then(([results, fields]) => {
      res.send(results);
    })
    .catch((err) => {
      console.error(err);
    });
});

// POST /todos/:id/completed - update only the completed field of a todo
app.post("/todos/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  // const { id } = req.params;
  // const { completed } = req.body;
  // const todo = todos.find((t) => t.id === id);
  // if (!todo) {
  //   res.status(404).json({ error: "Todo not found." });
  //   return;
  // }
  // if (typeof completed !== "boolean") {
  //   res.status(400).json({ error: "Completed (boolean) is required." });
  //   return;
  // }
  // todo.completed = completed;
  // res.json(todo);
});

// DELETE /todos/:id - delete a todo by its unique id
app.delete("/todos/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  // const { id } = req.params;
  // const idx = todos.findIndex((todo) => todo.id === id);
  // if (idx === -1) {
  //   res.status(404).json({ error: "Todo not found." });
  //   return;
  // }
  // const deleted = todos.splice(idx, 1)[0];
  // res.json(deleted);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
