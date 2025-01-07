import 'dotenv/config';
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import http from "http";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server);

io.use((socket , next) => {
    try{
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

        if(!token) next( new Error('Authentication Error'));
 
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        if(!decoded) next(new Error('Authentication Error'));
        
        socket.userId = decoded.id;
    }catch(err){
        next(err);
    }
});

io.on("connection" , (server) =>{
    console.log("a user connected");
})

server.listen(port , ()=>{
    console.log(`Server is running on ${port}`)
});