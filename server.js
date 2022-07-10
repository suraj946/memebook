const app = require('./app');
const { connectDatabase } = require('./config/database');
const cloudinary = require('cloudinary');

connectDatabase();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port : ${process.env.PORT}`);
});

const io =  require("socket.io")(server, {
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection", (socket)=>{
    console.log("Connected to socket.io");
    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("User joined room "+room);
    });

    socket.on("typing", (room)=>socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived)=>{
        let chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users is undefined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    });
    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})