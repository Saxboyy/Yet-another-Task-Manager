const newTask = document.getElementById("newTask")
const descriptionInput = document.getElementById("description")
const dueDateInput = document.getElementById("dueDate")
const newTaskLabel = document.getElementById("newTaskLabel")
const descriptionLabel = document.getElementById("descriptionLabel")
const dueDateLabel = document.getElementById("dueDateLabel")

newTask.addEventListener("click", showLabelsAndInputs)

const inputIds = ["newTask", "description", "dueDate"]

inputIds.forEach((id) => {
  const input = document.getElementById(id)

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      saveTask(newTask.value, descriptionInput.value, dueDateInput.value)
      clearInputs()
      hideLabelsAndInputs()
    }
  })
})

// function StatusCheck() {
//   !fetchAndRenderTasks
//     ? (StatusTask.innerHTML = "Desconectads")
//     : (StatusTask.innerHTML = "Conectado")
// }

// Hay muchas formas de llevar esto acabo. Esta probablemente sea la mas cutre de todas.

// TODO: Refactorizar esto

function showLabelsAndInputs() {
  descriptionInput.classList.remove("hidden")
  dueDateInput.classList.remove("hidden")
  newTaskLabel.classList.remove("hidden")
  descriptionLabel.classList.remove("hidden")
  dueDateLabel.classList.remove("hidden")
}

function hideLabelsAndInputs() {
  descriptionInput.classList.add("hidden")
  dueDateInput.classList.add("hidden")
  newTaskLabel.classList.add("hidden")
  descriptionLabel.classList.add("hidden")
  dueDateLabel.classList.add("hidden")
}

function clearInputs() {
  newTask.value = ""
  descriptionInput.value = ""
  dueDateInput.value = ""
}

function createTaskElement(task) {
  const taskCover = document.createElement("div")
  const priorityBadge = document.createElement("span")
  const doneList = document.getElementById("doneList")

  priorityBadge.classList.add(
    "animate-pulse",
    "bg-blue-500",
    "text-white",
    "text-xs",
    "px-2",
    "py-1",
    "rounded-full",
    "font-semibold",
    "ml-auto",
    "invisible",
    "sm:visible"
  )

  // Move done task to doneTasks section

  if (task.done) {
    taskCover.classList.add(
      "bg-gray-700",
      "p-4",
      "rounded-lg",
      "cursor-pointer",
      "hover:bg-gray-700",
      "transition",
      "duration-300",
      "ease-in-out"
    )
    priorityBadge.textContent = `Done`
  } else {
    taskCover.classList.add(
      "bg-gray-800",
      "p-4",
      "rounded-lg",
      "cursor-pointer",
      "hover:bg-gray-700",
      "transition",
      "duration-300",
      "ease-in-out"
    )
    priorityBadge.textContent = `Priority: ${task.priority}`
  }

  const article = document.createElement("article")
  article.classList.add("flex", "items-center")
  const infoDiv = document.createElement("div")
  infoDiv.classList.add("flex-1", "ml-4", "cursos-none")
  const title = document.createElement("h1")
  title.classList.add("text-xl", "font-semibold")
  title.textContent = task.title
  const content = document.createElement("p")
  content.classList.add("text-gray-400", "text-sm", "mt-1")
  content.textContent = task.content

  const deleteButton = document.createElement("button")
  deleteButton.classList.add(
    "bg-red-700",
    "text-white",
    "text-xs",
    "px-2",
    "py-1",
    "rounded-full",
    "font-semibold",
    "ml-auto"
  )

  deleteButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>'

  deleteButton.addEventListener("click", () => removeTask(task.id))
  article.appendChild(deleteButton)

  infoDiv.appendChild(title)
  infoDiv.appendChild(content)
  article.appendChild(infoDiv)
  article.appendChild(priorityBadge)
  taskCover.appendChild(article)
  doneList.appendChild(taskCover)

  taskCover.addEventListener("click", () => doneTask(task.id, task.done))

  return taskCover
}

function renderTaskList(tasks) {
  const taskList = document.getElementById("taskList")
  const noTask = document.getElementById("noTask")

  tasks.sort((a, b) => b.id - a.id) && tasks.sort((a, b) => a.done - b.done)

  noTask.style.display = tasks.length === 0 ? "block" : "none"

  tasks.forEach((task) => {
    const taskElement = createTaskElement(task)
    taskList.appendChild(taskElement)
  })
}

function fetchAndRenderTasks() {
  fetch("http://localhost:3002/tasks")
    .then((response) => response.json())
    .then((tasks) => renderTaskList(tasks))
    .catch((error) => console.error("Error fetching tasks:", error))
}

const removeTask = (id) => {
  fetch(`http://localhost:3002/tasks/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      if (data.error) {
        throw new Error(data.error)
      }
      const taskCover = document.getElementById(`task-${id}`)
      if (taskCover) {
        taskCover.remove()
      }
    })
    .catch((error) => console.error("Error deleting task:", error))
}

const saveTask = (task, description, dueDate) => {
  const randomPriority = Math.floor(Math.random() * 3) + 1
  const currentDate = new Date().toISOString()

  fetch("http://localhost:3002/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: task,
      content: description,
      userId: 1,
      priority: randomPriority,
      createdAt: currentDate,
      dueDate: dueDate,
    }),
  })
}

const doneTask = (id, currentStatus) => {
  const newStatus = !currentStatus

  fetch(`http://localhost:3002/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done: newStatus }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      // Cuatrada maxima otra vez xd.
      location.reload()
    })
    .catch((error) => console.error("Error toggling task status:", error))
}

fetchAndRenderTasks()
