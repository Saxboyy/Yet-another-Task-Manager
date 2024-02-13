import express from 'express'
import bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3002

const prisma = new PrismaClient()

app.use(cors())
app.use(bodyParser.json())

// TODO: Separar en archivos. Por favor. POR FAVOR.

// Routes

// GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching users')
  }
})

// GET a user by ID
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { tasks: true }
    })
    if (!user) {
      res.status(404).send('User not found')
    } else {
      res.json(user)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user')
  }
})

// POST a new user
app.post('/users', async (req, res) => {
  const { name } = req.body
  try {
    const user = await prisma.user.create({
      data: { name }
    })
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating user')
  }
})

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching tasks')
  }
})

// GET a task by ID
app.get('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const task = await prisma.task.findUnique({
      where: { id }
    })
    if (!task) {
      res.status(404).send('Task not found')
    } else {
      res.json(task)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching task')
  }
})

// DELETE a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const deletedTask = await prisma.task.delete({
      where: { id }
    });
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task: deletedTask })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Error deleting task' })
  }
});


// POST a new task
app.post('/tasks', async (req, res) => {
  const { userId, title, content, done } = req.body
  try {
    const task = await prisma.task.create({
      data: {
        userId,
        title,
        content,
        done
      }
    })
    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error editing task')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

