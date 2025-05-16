import express, { Request, Response } from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3002;

const getConnection = () => {
  // Create the connection to database
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "photoBookDB",
    password: "vincent1",
    port: 3306,
  });
};



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Users type definition
interface Users{
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

// In-memory todos array
const users: Users[] = [];
const phots: Photo[] = [];


// GET /todos - return all todos
app.get("/todos", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  getConnection()
  .then((conn) => conn.query("SELECT * FROM `Todos`;"))
  .then(([rows, fields]) => {
    // rows contains the result of the query
    // fields contains information about the returned results, such as column types
    console.log(rows); // rows contains the result of the query
    console.log(fields); // fields contains information about the returned results, such as column types
    res.json(rows);
  })
  .catch((err: any) => {
    console.error(err);
    res.status(500).send("Error connecting to the database");
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Todos!");
});

app.options("/todos", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

// POST /todos - add a new todo
app.post("/todos", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  try {
    const { summary, author, description, imageUrl, category, completed } =
      req.body;
    if (!summary || !author || typeof completed !== "boolean") {
      res.status(400).json({
        error: "Summary, author, and completed (boolean) are required.",
      });
      return;
    }
    const newTodo: Todo = {
      id: randomUUID(),
      summary,
      author,
      description,
      imageUrl,
      category,
      completed,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({
      error:
        "Invalid request body. Expected: Summary, Author, Description, ImageURL, category, and Completed",
    });
  }
});

app.options("/todos/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

// POST /todos/:id/completed - update only the completed field of a todo
app.post("/todos/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  const { id } = req.params;
  const { completed } = req.body;
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    res.status(404).json({ error: "Todo not found." });
    return;
  }
  if (typeof completed !== "boolean") {
    res.status(400).json({ error: "Completed (boolean) is required." });
    return;
  }
  todo.completed = completed;
  res.json(todo);
});

// DELETE /todos/:id - delete a todo by its unique id
app.delete("/todos/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  const { id } = req.params;
  const idx = todos.findIndex((todo) => todo.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Todo not found." });
    return;
  }
  const deleted = todos.splice(idx, 1)[0];
  res.json(deleted);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app, todos };
