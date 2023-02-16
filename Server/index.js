const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require("./routes/userRoute")
const messageRoutes = require('./routes/messageRoute')
const { Server } = require('socket.io')
const http = require("http");


const app = express()
require('dotenv').config()

app.use(cors());
app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/message", messageRoutes)

mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Connected to Mongo Successfully");
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data) => {
        const sendUserScoket = onlineUsers.get(data.to);
        if(sendUserScoket) {
            socket.to(sendUserScoket).emit("msg-recieve", data.message);
        }
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})