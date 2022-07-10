const mongoose = require('mongoose');

const uri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : "mongodb://localhost:27017/socialmediademo";

exports.connectDatabase = ()=>{
    mongoose.connect(uri)
    .then(con=>{
        console.log(`Database connected Host : ${con.connection.host}`);
    })
    .catch(err=>{
        console.log(`Error on database connection\n${err} `);
    });
}