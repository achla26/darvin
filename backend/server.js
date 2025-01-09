import 'dotenv/config';
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import Project from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
import http from "http";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : "*"
    }
});

io.use(async (socket , next) => {
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

        const projectId = socket.handshake.query.projectId;

        if(!projectId) next(new Error('Project Id is required'));

        if(!(mongoose.Types.ObjectId.isValid(projectId))) next(new Error('Invalid Project Id'));
        
        socket.project = await Project.findById(projectId);

        if(!token) next( new Error('Authentication Error'));
 
        const decoded = await jwt.verify(token , process.env.JWT_SECRET);

        if(!decoded) next(new Error('Authentication Error'));
        
        socket.userId = decoded.id;
        next();
    }catch(err){
        next(err);
    }
});

io.on("connection" , (socket) =>{
    socket.roomId = socket.project._id.toString();
    console.log("a user connected");

    socket.join(socket.roomId);

    socket.on("project-message" , async (data)=>{
        const message = await data.message;

        if (message.startsWith("@ai")) { 
            const prompt = await message.replace("@ai", "").trim();
            const response = await generateResult(prompt);

            io.to(socket.roomId).emit("project-message", {
                message: `${response}`,
                sender:{
                    _id: "ai",
                    email: "AI"
                },
                createdAt: new Date()
            });
        }  
        
        socket.broadcast.to(socket.roomId).emit("project-message" , data);
    });

    socket.on("disconnect" , ()=>{
        socket.leave(socket.roomId);
        console.log("a user disconnected");
    });
})

server.listen(port , ()=>{
    console.log(`Server is running on ${port}`)
});