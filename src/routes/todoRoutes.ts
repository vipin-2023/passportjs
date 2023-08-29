import express from "express";
import {createTodos, deleteTodo, getTodo, getTodos, searchTodos, updateTodo} from "../controller/todoController";
import authenticateJwtMiddleware from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/:userId",authenticateJwtMiddleware,getTodos);
router.get("/:userId/searchTodos",authenticateJwtMiddleware,searchTodos);
router.post("/:userId",authenticateJwtMiddleware,createTodos);
router.get("/:userId/:todoId",authenticateJwtMiddleware,getTodo);
router.put("/:userId/:todoId",authenticateJwtMiddleware,updateTodo);
router.delete("/:userId/:todoId",authenticateJwtMiddleware,deleteTodo);

export default router;