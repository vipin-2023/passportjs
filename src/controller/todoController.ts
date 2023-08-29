import { NextFunction, Request, Response } from "express";

import Todo from "../models/Todo";
import Joi from "joi";

const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    userId: Joi.string().required(),
  });
  const schema = Joi.object({
    page: Joi.number(),
  });
  const { error: idError, value: idData } = idSchema.validate({
    userId: req.params.userId,
  });
  if (idError) {
    return res.status(400).json({ error: "error in userId params" });
  }

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ error: "Invalid quary parameters" });
  }
  const perPage: number = 5;
  const page: number = value.page || 1;

  try {
    const todos = await Todo.find({ownerId:idData.userId})
      .sort({ _id: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    const totalCount = await Todo.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);
    res.json({ todos, totalPages });
  } catch (error) {
    next(error);
  }
};

const searchTodos = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    userId: Joi.string().required(),
  });

  const schema = Joi.object({
    page: Joi.number(),
    search: Joi.string(),
  });
  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({ error: "Invalid quary parameters" });
  }
  const { error: idError, value: idData } = idSchema.validate({
    userId: req.params.userId,
  });
  if (idError) {
    return res.status(400).json({ error: "error in userId params" });
  }
  const perPage: number = 6;
  const page: number = value.page || 1;
  const search: string = value.search || " ";

  try {
    const searchedTodos = await Todo.find({ownerId:idData.userId,
      title: { $regex: search, $options: "i" },
    })
      .sort({ _id: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalCount = await Todo.countDocuments({
      title: { $regex: search, $options: "i" },
    });
    const totalPages = Math.ceil(totalCount / perPage);
    res.json({ searchedTodos, totalPages });
  } catch (error) {
    next(error);
  }
};

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  
  const idSchema = Joi.object({
    todoId: Joi.string().required(),
  });
  const Schema = Joi.object({
    userId: Joi.string().required(),
  });
  try {
    const { error:todoError, value:todoValue } = idSchema.validate({ todoId: req.params.todoId});
    if (todoError) {
      return res.status(400).json({ error: "Invalid todoId" });
    }
    const { error, value } = Schema.validate({ userId: req.params.userId});
    if (error) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const todo = await Todo.findOne({_id:todoValue.todoId,ownerId:value.userId});
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

const createTodos = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    userId: Joi.string().required(),
  });
  const schema = Joi.object({
    title: Joi.string().required(),
    isDone: Joi.boolean(),
  });
  try {
    const { error: idError, value: idData } = idSchema.validate({
      userId: req.params.userId,
    });
    if (idError) {
      return res.status(400).json({ error: "error in userId params" });
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newTodo = new Todo({
      title: value.title,
      ownerId:idData.userId,
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
    todoId: Joi.string().required(),
  });
  const Schema = Joi.object({
    userId: Joi.string().required(),
  });
  const updateSchema = Joi.object({
    title: Joi.string(),
    isDone: Joi.boolean(),
  });
  try {
    const { error: idError, value: idData } = idSchema.validate({
      todoId: req.params.todoId,
    });
    if (idError) {
      return res.status(400).json({ error: "error in todoId params" });
    }
    const { error, value } = Schema.validate({ userId: req.params.userId});
    if (error) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const { error: updateError, value: updateValue } = updateSchema.validate(
      req.body
    );

    if (updateError) {
      return res.status(400).json({ error: "error in update data" });
    }

    const todo = await Todo.findOneAndUpdate({_id:idData.todoId,ownerId:value.userId}, updateValue, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ messsage: "update successfull" });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const idSchema = Joi.object({
    todoId: Joi.string().required(),
  });
  const Schema = Joi.object({
    userId: Joi.string().required(),
  });
  try {
    const { error, value } = idSchema.validate({ todoId: req.params.todoId });

    if (error) {
      return res.status(400).json({ error: "no valid todoId passed " });
    }
    const { error:userError, value:userValue } = Schema.validate({ userId: req.params.userId});
    if (userError) {
      return res.status(400).json({ error: "Invalid useerId" });
    }
    const deleteTodo = await Todo.findOneAndDelete({_id:value.todoId,ownerId:userValue.userId});

    if (!deleteTodo) {
      return res.status(404).json({ error: "Todo not found " });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export { getTodos, createTodos, getTodo, updateTodo, deleteTodo, searchTodos };
