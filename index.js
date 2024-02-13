
const newTask = document.getElementById('newTask')

newTask.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveTask(newTask.value)
    newTask.value = ''

    // Cuatrada maxima. No hacer esto en casa

    setInterval(() => {
      location.reload()
    },3000)
  }
})

const saveTask = (task) => {
  fetch('http://localhost:3002/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: task, content: 'prueba', userId: 1 })
  })
}


fetch('http://localhost:3002/tasks')
  .then(response => response.json())
  .then(tasks => {
    const taskList = document.getElementById('taskList')
    const noTask = document.getElementById('noTask')

    noTask.style.display = tasks.length === 0 ? 'block' : 'none'

    console.log(tasks)

    tasks.forEach(task => {
      const taskCover = document.createElement('a');
      taskCover.classList.add('dark:bg-white', 'dark:bg-opacity-10', 'p-4', 'rounded-3xl', 'cursor-pointer', 'overflow-hidden', 'sm:hover:bg-opacity-10', 'dark:md:hover:bg-opacity-20', 'transition', 'duration-500', 'ease-in-out');
      taskCover.href = '';

      const article = document.createElement('article')
      article.classList.add('md:items-center', 'space-x-4')

      const roundDiv = document.createElement('div')
      roundDiv.classList.add('round')

      const infoDiv = document.createElement('div')
      infoDiv.classList.add('p-2', 'items-center')

      const title = document.createElement('h1')
      title.classList.add('text-2xl')
      title.textContent = task.title

      const content = document.createElement('h2')
      content.classList.add('text-gray-400')
      content.textContent = task.content

      infoDiv.id = task.id


      infoDiv.appendChild(title)
      infoDiv.appendChild(content)
      article.appendChild(roundDiv)
      article.appendChild(infoDiv)
      taskCover.appendChild(article)
      taskList.appendChild(taskCover)

      infoDiv.addEventListener('click', () => {
        removeTask(task.id)
      })

    })
  })
  .catch(error => console.error('Error al obtener las tareas:', error))

const removeTask = (id) => {
  fetch(`http://localhost:3002/tasks/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    const taskCover = document.getElementById(`task-${id}`);
    if (taskCover) {
      taskCover.remove()
    }
  })
  .catch(error => console.error('Error deleting task:', error))
}

