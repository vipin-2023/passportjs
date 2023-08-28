import express from "express";
import {createTodos, deleteTodo, getTodo, getTodos, searchTodos, updateTodo} from "../controller/todoController";
import authenticateJwtMiddleware from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/",authenticateJwtMiddleware,getTodos);
router.get("/searchTodos",authenticateJwtMiddleware,searchTodos);
router.post("/",authenticateJwtMiddleware,createTodos);
router.get("/:id",authenticateJwtMiddleware,getTodo);
router.put("/:id",authenticateJwtMiddleware,updateTodo);
router.delete("/:id",authenticateJwtMiddleware,deleteTodo);

export default router;