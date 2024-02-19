const newTask = document.getElementById("newTask")
const descriptionInput = document.getElementById("description")
const dueDateInput = document.getElementById("dueDate")
const newTaskLabel = document.getElementById("newTaskLabel")
const descriptionLabel = document.getElementById("descriptionLabel")
const dueDateLabel = document.getElementById("dueDateLabel")
const statusAPI = document.getElementById("statusAPI")
const svgConnected =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-squircle"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9"/></svg>'
const svgDisconnected =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-squircle"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9"/></svg>'
const api_URL = "http://localhost:3002/"
let status

const priority = {
  1: "Low",
  2: "Medium",
  3: "High",
}

newTask.addEventListener("click", showLabelsAndInputs)

const inputIds = ["newTask", "description", "dueDate"]

inputIds.forEach((id) => {
  const input = document.getElementById(id)

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && input.value !== "") {
      event.preventDefault()
      saveTask(newTask.value, descriptionInput.value, dueDateInput.value)
      clearInputs()
      hideLabelsAndInputs()
    }
  })
})

// Hay muchas formas de llevar esto acabo. Esta probablemente sea la mas cutre de todas.

// TODO: Refactorizar esto

function toggleVisibility(elements, action) {
  elements.forEach((element) => {
    if (action === "show") {
      element.classList.remove("hidden")
    } else if (action === "hide") {
      element.classList.add("hidden")
    }
  })
}

function showLabelsAndInputs() {
  toggleVisibility(
    [
      descriptionInput,
      dueDateInput,
      priorityInput,
      newTaskLabel,
      descriptionLabel,
      dueDateLabel,
      priorityLabel,
      btnSubmit,
    ],
    "show"
  )
}

function hideLabelsAndInputs() {
  toggleVisibility(
    [
      descriptionInput,
      dueDateInput,
      priorityInput,
      newTaskLabel,
      descriptionLabel,
      dueDateLabel,
      priorityLabel,
      btnSubmit,
    ],
    "hide"
  )
}

function clearInputs() {
  newTask.value = ""
  descriptionInput.value = ""
  dueDateInput.value = ""
}

function createTaskElement(task) {
  const taskAll = document.createElement("div")
  const taskCover = document.createElement("div")
  const priorityBadge = document.createElement("span")
  // const doneList = document.getElementById("doneList")

  taskAll.classList.add(
    "flex",
    "flex-col",
    "sm:flex-row",
    "items-center",
    "bg-red-200"
  )

  priorityBadge.classList.add(
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
    // TODO: cambiar

    priorityBadge.textContent = `${priority[1]}`
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

    "hover:bg-red-600",
    "transition",
    "duration-300",
    "text-white",
    "text-xs",
    "px-2",
    "py-1",
    "rounded-full",
    "font-semibold",
    "ml-auto",
    "hidden"
  )

  // TODO: Cambiar logica. Solo aparece cuando se le hace hover.

  deleteButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>'

  deleteButton.addEventListener("click", () => removeTask(task.id))
  taskAll.appendChild(taskCover)
  taskCover.appendChild(deleteButton)
  infoDiv.appendChild(title)
  infoDiv.appendChild(content)
  article.appendChild(infoDiv)
  article.appendChild(priorityBadge)
  taskCover.appendChild(article)
  doneList.appendChild(taskCover)

  taskCover.addEventListener("click", () => {
    taskCover.classList.toggle(task.done ? "bg-gray-700" : "bg-gray-800")
    taskCover.classList.toggle(task.done ? "bg-gray-800" : "bg-gray-700")
    doneTask(task.id, task.done)
    infoDiv.appendChild(taskCover)
  })

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

async function fetchAndRenderTasks() {
  const response = await fetch(api_URL + "tasks")

  if (!response.ok) {
    return false
  }

  renderTaskList(await response.json())
  return true
}

async function removeTask(id) {
  const response = await fetch(api_URL + "tasks/" + id, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  const data = await response.json()

  if (data) {
    const taskCover = document.getElementById(`task-${id}`)
    taskCover?.remove()
    location.reload()
  }
}

async function saveTask(task, description, dueDate) {
  const randomPriority = Math.floor(Math.random() * 3) + 1
  const currentDate = new Date().toISOString()

  try {
    const response = await fetch(api_URL + "tasks", {
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
    clearInputs()
    hideLabelsAndInputs()
  } catch (error) {
    console.error("Error:", error)
  }
}

const doneTask = (id, currentStatus) => {
  const newStatus = !currentStatus

  fetch("http://localhost:3002/tasks/" + id, {
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
    })
    .catch((error) => console.error("Error toggling task status:", error))
}

async function main() {
  statusAPI.innerHTML = status ? svgConnected : svgDisconnected
  status = await fetchAndRenderTasks()
  statusAPI.innerHTML = status ? svgConnected : svgDisconnected
}

main()
