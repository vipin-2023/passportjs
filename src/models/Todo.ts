import mongoose, { Schema } from "mongoose";

export interface ITodo extends Document{
    title:string,
    ownerId:string,
    isDone:boolean,
}

const TodoSchema:Schema=new mongoose.Schema({
    title:{type:String,require:true},
    ownerId:{type:mongoose.Schema.ObjectId,ref:"User"},
    isDone:{type:Boolean,default:false}

},{timestamps:true});

const Todo=mongoose.model<ITodo>("Todo",TodoSchema);

export default Todo;