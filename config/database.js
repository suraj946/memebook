const mongoose = require('mongoose');

exports.connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(con=>{
        console.log(`Database connected Host : ${con.connection.host}`);
    })
    .catch(err=>{
        console.log(`Error on database connection\n${err} `);
    });
}