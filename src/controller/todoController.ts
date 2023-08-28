import { NextFunction, Request, Response } from "express";

import Todo from "../models/Todo";
import Joi from "joi";

const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await Todo.find().exec();
    res.json({ todos });
  } catch (error) {
    next(error);
  }
};

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    id: Joi.string().required(),
  });

  try {
    const { error, value } = idSchema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const todo = await Todo.findById(value.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

const createTodos = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    isDone: Joi.boolean(),
  });
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newTodo = new Todo({
      title: value.title,
      isDone: value.isDone,
    });
    await newTodo.save();
    res.json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    id: Joi.string().required(),
  });
  const updateSchema = Joi.object({
    title: Joi.string(),
    isDone: Joi.boolean(),
  });
  try {
    const { error: idError, value: idData } = idSchema.validate({ id: req.params.id });
    if (idError) {
      return res.status(400).json({ error: "error in id params" });
    }
    
    const { error: updateError, value: updateValue } = updateSchema.validate(
      req.body
    );
    
    if (updateError) {
      return res.status(400).json({ error: "error in update data" });
    }

    const todo = await Todo.findByIdAndUpdate(idData.id, updateValue, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({messsage:"update successfull"})
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    id: Joi.string().length(24).hex().required(),
  });

  try {
    const { error, value } = idSchema.validate({ id: req.params.id });

    if (error) {
      return res.status(400).json({ error: "no valid id passed " });
    }

    const deleteTodo = await Todo.findByIdAndDelete(value.id);

    if (!deleteTodo) {
      return res.status(404).json({ error: "Todo not found " });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export { getTodos, createTodos, getTodo, updateTodo, deleteTodo };
