import { io } from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (projectId) => {

    socketInstance = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
        auth: {
            token: localStorage.getItem('token')
        }, 
        query:{
            projectId
        }
    });

    return socketInstance;

}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}