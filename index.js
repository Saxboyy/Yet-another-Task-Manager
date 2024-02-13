const newTask = document.getElementById('newTask')
const descriptionInput = document.getElementById('description')
const dueDateInput = document.getElementById('dueDate')
const newTaskLabel = document.getElementById('newTaskLabel')
const descriptionLabel = document.getElementById('descriptionLabel')
const dueDateLabel = document.getElementById('dueDateLabel')

newTask.addEventListener('click', () => {
  descriptionInput.classList.remove('hidden')
  dueDateInput.classList.remove('hidden')
  newTaskLabel.classList.remove('hidden')
  descriptionLabel.classList.remove('hidden')
  dueDateLabel.classList.remove('hidden')
})

newTask.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    event.preventDefault()
    saveTask(newTask.value, descriptionInput.value, dueDateInput.value)
    newTask.value = ''
    descriptionInput.value = ''
    dueDateInput.value = ''
    descriptionInput.classList.add('hidden')
    dueDateInput.classList.add('hidden')
    newTaskLabel.classList.add('hidden')
    descriptionLabel.classList.add('hidden')
    dueDateLabel.classList.add('hidden')
  }
})

const saveTask = (task, description, dueDate) => {
  const randomPriority = Math.floor(Math.random() * 3) + 1 // Random priority between 1 and 3
  const currentDate = new Date().toISOString() // Current date

  fetch('http://localhost:3002/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: task, content: description, userId: 1, priority: randomPriority, createdAt: currentDate, dueDate: dueDate })
  })
}

fetch('http://localhost:3002/tasks')
  .then(response => response.json())
  .then(tasks => {
    const taskList = document.getElementById('taskList')
    const noTask = document.getElementById('noTask')

    tasks.sort((a, b) => b.id - a.id)

    noTask.style.display = tasks.length === 0 ? 'block' : 'none'

    tasks.forEach(task => {
      const taskCover = document.createElement('div')
      taskCover.classList.add('bg-gray-800', 'p-4', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-700', 'transition', 'duration-300', 'ease-in-out')

      const article = document.createElement('article')
      article.classList.add('flex', 'items-center')

      const infoDiv = document.createElement('div')
      infoDiv.classList.add('flex-1', 'ml-4')

      const title = document.createElement('h1')
      title.classList.add('text-xl', 'font-semibold')
      title.textContent = task.title

      const content = document.createElement('p')
      content.classList.add('text-gray-400', 'text-sm', 'mt-1')
      content.textContent = task.content

      const priorityBadge = document.createElement('span')
      priorityBadge.classList.add('bg-blue-500', 'text-white', 'text-xs', 'px-2', 'py-1', 'rounded-full', 'font-semibold', 'ml-auto')
      priorityBadge.textContent = `Priority: ${task.priority}`

      infoDiv.appendChild(title)
      infoDiv.appendChild(content)
      article.appendChild(infoDiv)
      article.appendChild(priorityBadge)
      taskCover.appendChild(article)
      taskList.appendChild(taskCover)

      taskCover.addEventListener('click', () => {
        removeTask(task.id)
      })

    })
  })
  .catch(error => console.error('Error fetching tasks:', error))

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
      throw new Error(data.error)
    }
    const taskCover = document.getElementById(`task-${id}`)
    if (taskCover) {
      taskCover.remove()
    }
  })
  .catch(error => console.error('Error deleting task:', error))
}
