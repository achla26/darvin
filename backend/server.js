import 'dotenv/config';
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import Project from './models/project.model.js';

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

    socket.on("project-message" , (data)=>{
        console.log(data); 
        socket.broadcast.to(socket.roomId).emit("project-message" , data);
    })
})

server.listen(port , ()=>{
    console.log(`Server is running on ${port}`)
});