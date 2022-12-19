const express = require('express');
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();

//when using heroku
// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config({path:'./config/config.env'});
// }

require('dotenv').config({path:'./config/config.env'});

//using middleware
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb", extended:true}));
app.use(cookieParser());

//importing routes
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

//using routes
app.use('/api/v1', postRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', chatRoute);
app.use('/api/v1', messageRoute);

// deployment
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

module.exports = app;