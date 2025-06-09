import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authorizeRoles } from "./middleware/AuthorizeRole.js";
import { responseHandler } from "./middleware/ResponseHandler.js";
import morgan from "morgan";
import passport from "passport";
import("./passport.js");

dotenv.config();

import userRouter from "./routes/User.js";
import adminRouter from "./routes/Admin.js";
import errorHandling from "./middleware/errorHandling.js";
import authRouter from "./routes/auth.js";

const app = express();

const port = process.env.PORT;
const db = process.env.MONGO_URI;
// allow all API calls coming from the frontend to get to the server
app.use(
  cors({
    origin: process.env.ORIGIN.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const morganFormat = ":method :url :status:";

// connect to database
mongoose
  .connect(db, {})
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error.message}`);
  });

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
        };
        console.log(JSON.stringify(logObject));
      },
    },
  })
);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// clears the session cookie after 1 hr of inactivity
app.use((req, res, next) => {
  if (req.session.cookie.expires < Date.now()) {
    req.session.destroy((err) => {
      if (err) {
        console.log(`Error destroying session: ${err.message}`);
      } else {
        res.clearCookie("session");
        res.redirect("/login");
      }
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (req.user) {
    // Apply different roles for different base routes
    if (req.path.startsWith("/students")) {
      return authorizeRoles("student", "admin")(req, res, next);
    }
    if (req.path.startsWith("/sponsors")) {
      return authorizeRoles("sponsor", "admin")(req, res, next);
    }
    if (req.path.startsWith("/volunteers")) {
      return authorizeRoles("volunteer", "admin")(req, res, next);
    }
    if (req.path.startsWith("/schools")) {
      return authorizeRoles("school", "admin")(req, res, next);
    }
    if (req.path.startsWith("/donors")) {
      return authorizeRoles("donor", "admin")(req, res, next);
    }
    if (req.path.startsWith("/admins")) {
      return authorizeRoles("admin", "admin")(req, res, next);
    }
  }
  next();
});

app.options("*", cors());

app.use("/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
  res.send("Running");
});

app.get("/protected", (req, res) => {
  res.send("Hello");
});

app.use(errorHandling);
app.use(responseHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
