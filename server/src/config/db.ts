import mongoose from "mongoose";
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URL || 'mongodb://localhost/mydb';;

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true   
} as any).catch((error)=>{
    console.error('Mongoose connection error:', error);
})

const db = mongoose.connection;

db.once('open',()=>{
    console.log("Connected to Mongodb")
});

export default db;