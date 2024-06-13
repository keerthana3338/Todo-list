// script.js

document.addEventListener('DOMContentLoaded', loadTasks);
document.querySelector('#task-form').addEventListener('submit', addTask);
document.querySelector('#task-list').addEventListener('click', modifyTask);

function addTask(e) {
    e.preventDefault();
    const taskInput = document.querySelector('#task-input').value;
    if (taskInput === '') return;

    const task = { text: taskInput, completed: false };
    addTaskToDOM(task);
    storeTaskInLocalStorage(task);

    document.querySelector('#task-form').reset();
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.classList.toggle('completed', task.completed);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit');
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    li.appendChild(deleteBtn);

    document.querySelector('#task-list').appendChild(li);
}

function modifyTask(e) {
    const target = e.target;

    if (target.tagName === 'BUTTON') {
        const li = target.parentElement;

        if (target.classList.contains('edit')) {
            editTask(li);
        } else {
            const taskText = li.childNodes[0].nodeValue;
            deleteTaskFromLocalStorage(taskText);
            li.remove();
        }
    } else if (target.tagName === 'LI') {
        const taskText = target.childNodes[0].nodeValue;
        target.classList.toggle('completed');
        updateTaskInLocalStorage(taskText, target.classList.contains('completed'));
    }
}

function editTask(li) {
    const taskText = li.childNodes[0].nodeValue;
    const newText = prompt('Edit task:', taskText);
    if (newText === null || newText.trim() === '') return;

    updateTaskInLocalStorage(taskText, false, newText.trim());
    li.childNodes[0].nodeValue = newText.trim();
}

function storeTaskInLocalStorage(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(addTaskToDOM);
}

function deleteTaskFromLocalStorage(taskText) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskText, completed, newText = null) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = completed;
            if (newText !== null) task.text = newText;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
