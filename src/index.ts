import express, { Request, Response } from "express";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import cors from "cors";
import { error } from "console";

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

const corsOptions = {
  origin: "*", // Allow all origins (not recommended for production)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authorization headers
};

getConnection().then((connection) => {
  app.use(cors(corsOptions));

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

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello!");
  });

  // GET /users - return all users
  app.get("/users", (req: Request, res: Response) => {
    connection
      .query("Select * from Users;")
      .then(([results, fields]) => {
        res.send(results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // GET /users/id - return user by id
  app.get("/users/:id", (req: Request, res: Response) => {
    connection
      .execute("Select * from Users where ID = ?;", [req.params.id])
      .then(([results, fields]) => {
        res.send(results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // POST /users - add a new user
  app.post("/users", (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }
    connection
      .query("SELECT * FROM Users WHERE username = ?;", [username])
      .then(([result]) => {
        // RowDataPacket when running a SELECT
        if ((result as RowDataPacket[]).length != 0) {
          res.status(400).json({ error: "Username must be unique." });
          return;
        }
        return connection.execute("INSERT INTO Users (username) VALUES (?);", [
          username,
        ]);
      })
      .then(() => {
        res.status(200).json({ message: "User sucessfully added" });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // DELETE /user/id - delete a user by id
  app.delete("/users/:id", (req: Request, res: Response) => {
    connection
      .execute("DELETE from Users where ID = ?;", [req.params.id])
      .then(([result]) => {
        // ResultSetHeader when DELETE
        if ((result as ResultSetHeader).affectedRows != 1) {
          res.status(400).json({ error: "User not found." });
          return;
        }
        res.status(200).json({ message: "User sucessfully removed" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
      });
  });

  // GET /photos/userId - return all photos for a user
  app.get("/users/:id/photos", (req: Request, res: Response) => {
    connection
      .execute("Select * from Photos where userID = ?;", [req.params.id])
      .then(([results, fields]) => {
        res.send(results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // GET /photos/id - return photo by id
  app.get("/photos/:id", (req: Request, res: Response) => {
    connection
      .execute("Select * from Photos where userID = ? LIMIT 1;", [
        req.params.id,
      ])
      .then(([results, fields]) => {
        res.send(results);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // POST /photos - add a photo to photos

  app.post("/photos/:id", (req: Request, res: Response) => {
    const { URL, lat, lng } = req.body;
    if (!URL || !lat || !lng) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }
    // getConnection()
    //   .then(async (connection) => {
    //     const [result]: any = connection.query(
    //       "SELECT 1 FROM Users WHERE ID = ?;",
    //       [req.params.id]
    //     );
    //     if (result.length != 1) {
    //       res.status(400).json({ error: "User not found." });
    //       return;
    //     }
    //     return connection.execute(
    //       "INSERT INTO Photos (URL, lat, lng, userID) VALUES (?, ?, ?, ?);",
    //       [URL, lat, lng, req.params.id]
    //     );
    //   })
    connection
      .query("SELECT * FROM Users WHERE ID = ?;", [req.params.id])
      .then(([result]) => {
        if ((result as RowDataPacket[]).length != 1) {
          res.status(400).json({ error: "User not found." });
          return;
        }
        return connection.execute(
          "INSERT INTO Photos (URL, lat, lng, userID) VALUES (?, ?, ?, ?);",
          [URL, lat, lng, req.params.id]
        );
      })
      .then(() => {
        res.status(200).json({ message: "Photo sucessfully added" });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  // DELETE /photos/id - delete a photo by id
  app.delete("/photos/:id", (req: Request, res: Response) => {
    connection
      .execute("DELETE from Photos where ID = ?;", [req.params.id])
      .then(([result]) => {
        // ResultSetHeader when DELETE
        if ((result as ResultSetHeader).affectedRows != 1) {
          res.status(400).json({ error: "Photo not found." });
          return;
        }
        res.status(200).json({ message: "Photo sucessfully removed" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
      });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

export { app };
