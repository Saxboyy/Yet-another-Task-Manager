import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// Sembrame esta xd.

const users = [
  {name: 'Juan'},
  {name: 'María'},
  {name: 'Pedro'},
];

const tasks = [
  {
    title: 'Tarea 1',
    content: 'Descripción de la tarea 1',
    done: false,
    userId: 1,
  },
  {
    title: 'Tarea 2',
    content: 'Descripción de la tarea 2',
    done: true,
    userId: 2,
  },
  {
    title: 'Tarea 3',
    content: 'Descripción de la tarea 3',
    done: false,
    userId: 3,
  },
];

const tasksC = await prisma.task.create({
  data: {
    title: 'Tarea 3',
    content: 'Descripción de la tarea 3',
    done: false,
    userId: 3,
  },
});


