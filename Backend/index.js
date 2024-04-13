const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const ConnectToMongo = require('./Database');
dotenv.config();
const app = express();
const port = process.env.PORT;

const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});
app.use(bodyParser.json({limit:"10mb"}))
app.use(cors());
app.use(express.json());

ConnectToMongo();
let users = [];
//Realtime Routes
io.on('connection', (socket) => {
    // console.log("New User Connected", socket.id);
    socket.on("addUser",(userId)=>{
        const isUserExist = users.find(user=>user.userId===userId);
        if(!isUserExist){
            const user = {userId:userId,socketId:socket.id};
            users.push(user);
            io.emit("getUsers",users);
        }
    })
    socket.on('send-message', (data) => {
        const existUser = users.find(user => user.userId === data.receiverId);
        if (existUser) {
            console.log("User Exist",existUser.socketId);
            io.to(existUser.socketId).emit("getMessage", data);
        }
    })

    socket.on('getMessages', async (data) => {
        console.log(data);
    })

    socket.on('disconnect', () => {
        // console.log("User Disconnected", socket.id);
        users = users.filter(user => user.socketId !== socket.id);
    })
})


app.post('/', (req, res) => {
    res.json("Server running");  
})
app.use("/api/user",require('./Routes/User'));
app.use("/api/conversation",require("./Routes/Conversation"))
app.use("/api/groups",require("./Routes/Groups"))

server.listen(port,()=>{
    console.log(`Server Running on port ${port}`)
})