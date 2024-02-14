import express from "express"
import bodyParser from "body-parser"
import { PrismaClient } from "@prisma/client"
import cors from "cors"

const app = express()
const port = process.env.PORT || 3002

const prisma = new PrismaClient()

app.use(cors())
app.use(bodyParser.json())

// TODO: Separar en archivos. Por favor. POR FAVOR.

// Routes

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).send("Error fetching users")
  }
})

// GET a user by ID
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    })
    if (!user) {
      res.status(404).send("User not found")
    } else {
      res.json(user)
    }
  } catch (error) {
    res.status(500).send("Error fetching user")
  }
})

// POST a new user
app.post("/users", async (req, res) => {
  const { name } = req.body
  try {
    const user = await prisma.user.create({
      data: { name },
    })
    res.json(user)
  } catch (error) {
    res.status(500).send("Error creating user")
  }
})

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (error) {
    res.status(500).send("Error fetching tasks")
  }
})

// GET a task by ID
app.get("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    })
    if (!task) {
      res.status(404).send("Task not found")
    } else {
      res.json(task)
    }
  } catch (error) {
    res.status(500).send("Error fetching task")
  }
})

// DELETE a task by ID
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const deletedTask = await prisma.task.delete({
      where: { id },
    })
    if (!deletedTask) {
      res.status(404).json({ error: "Task not found" })
    }
    res.json({ message: "Task deleted successfully", task: deletedTask })
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" })
  }
})

// PATCH Task

app.put("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10)
  const { done } = req.body
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { done },
    })
    res.json(updatedTask)
  } catch (error) {
    res.status(500).send("Error updating task")
  }
})

// POST a new task
app.post("/tasks", async (req, res) => {
  const { userId, title, content, done } = req.body
  try {
    const task = await prisma.task.create({
      data: {
        userId,
        title,
        content,
        done,
      },
    })
    res.json(task)
  } catch (error) {
    res.status(500).send("Error editing task")
  }
})

app.listen(port, () => {
  console.debug(`Server listening on port ${port}`)
})
