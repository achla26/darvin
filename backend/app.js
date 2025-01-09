import  express  from "express"; 
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from './routes/user.route.js';
import projectRouter from './routes/project.router.js';
import aiRouter from './routes/ai.router.js';
import cookieParser from "cookie-parser";

const app = express();

connectDB();

app.use(cors());
app.use(cookieParser());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))



// routes declaration
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/projects" , projectRouter);
app.use("/api/v1/ai" , aiRouter);

app.get("/" , (req , res)=>{
    res.send("hello")
});

export default app;