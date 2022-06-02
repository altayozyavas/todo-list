// Define all UI variable
const todoList = document.querySelector('.list-group');
const form = document.querySelector('#form');
const todoInput = document.querySelector('#todo');
const clearBtn = document.querySelector('#clearBtn');
const search = document.querySelector('#search');
const statusButtons = document.querySelector('.status');
const itemsList = document.getElementsByClassName("list-group-item");

// Load all event listners
allEventListners();

// Functions of all event listners
function allEventListners() {
    // Add todo event
    form.addEventListener('submit', addTodo);
    // Remove and complete todo event
    todoList.addEventListener('click', removeTodo);
    // Clear or remove all todos
    clearBtn.addEventListener('click', clearTodoList);
    // Search todo event
    search.addEventListener('keyup', searchTodo);
    // Added active tab function
    statusButtons.addEventListener('click', activeTab);
    //save checkbox states
    todoList.addEventListener("click", saveCheckboxState);

}

let todos = [];

function addToLocalStorageAsArr(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
    const reference = localStorage.getItem(key);
    if (reference) {
      todos = JSON.parse(reference);
      return todos;
    }
}

function restoreTodos(todoArr) {
    constClassNames = getFromLocalStorage("checkboxStatesInOrder");
    if (todoArr != undefined) {
        for (let i = 0; i < todoArr.length; i++) {
            createListItem(todoArr[i], constClassNames[i]);
        }
    }
}

restoreTodos(getFromLocalStorage('todos'));

function createListItem(todoValue = todoInput.value, className = 'list-group-item') {
        // Create li element
        const li = document.createElement('li');
        // Add class
        li.className = className;
        // Add complete and remove icon
        li.innerHTML = `<i class="far fa-square done-icon"></i>
                        <i class="far fa-check-square done-icon"></i>`;
        // Create span element
        const span = document.createElement('span');
        // Add class
        span.className = 'todo-text';
        // Create text node and append to span
        span.appendChild(document.createTextNode(todoValue));
        // Append span to li
        li.appendChild(span);
        // Append li to ul (todoList)
        todoList.appendChild(li);
        //Change order of elements
        li.innerHTML += `<i class="far fa-trash-alt"></i>`;
}
  
// Add todo item function
function addTodo(e) {
    if (todoInput.value !== '') {
        let currentTodos = getFromLocalStorage('todos');
        if (currentTodos == undefined) {
            currentTodos = "";
        }
        if (currentTodos.includes(todoInput.value)) {
            alert(`You already have "${todoInput.value}" in your shopping list`);
        } else {
            todos.push(todoInput.value);
            addToLocalStorageAsArr("todos", todos);
            createListItem();
        }
        // Clear input
        todoInput.value = '';
    } else {
        alert('Please add todo');
    }
    e.preventDefault();
}

function saveCheckboxState() {
    let checkboxState = [];
    for (i = 0; i < itemsList.length; i++) {
        checkboxState.push(itemsList[i].className)
    }
    localStorage.setItem("checkboxStatesInOrder", "");
    addToLocalStorageAsArr("checkboxStatesInOrder", checkboxState);
}

// todoList.addEventListener("click", saveCheckboxState);

// Remove and complete todo item function
function removeTodo(e) {
    if (e.target.classList.contains('fa-trash-alt')) {
        if (confirm('Are you sure')) {
            const itemName = e.target.parentElement.innerText.split(" ").join("");
            let storage = getFromLocalStorage('todos');
            const storageResult = storage.filter(item => {
                return item != itemName;
            })
            localStorage.setItem("todos", "");
            addToLocalStorageAsArr("todos", storageResult);
            e.target.parentElement.remove();
        }
    }
    // Complete todo
    if (e.target.classList.contains('todo-text')) {
        e.target.parentElement.classList.toggle('done');
    }
    if (e.target.classList.contains('done-icon')) {
        e.target.parentElement.classList.toggle('done');
    }
}

// Clear or remove all todos function
function clearTodoList() {
    todoList.innerHTML = '';
    localStorage.setItem("todos", "");
}

// Search todo function
function searchTodo(e) {
    const text = e.target.value.toLowerCase();
    const allItem = document.querySelectorAll('.list-group-item');
    for (let task of allItem) {
        const item = task.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    };
}

//Add active tab function
function activeTab(e) {
    if (e.target.parentElement.classList.contains('status')) {
        allStatusButtons = statusButtons.children;
        for (const btn of allStatusButtons) {
            btn.classList.remove('btn-outline-secondary');
        }
        e.target.classList.add('btn-outline-secondary');
        const selection = e.target.textContent.toLowerCase();
        const allItem = document.querySelectorAll('.list-group-item');
        if (selection == "all") {
            for (let task of allItem) {
                task.style.display = 'inline-block';
            };
        } else if (selection == "active") {
            for (let task of allItem) {
                if (!task.classList.contains('done')) {
                    task.style.display = 'inline-block';
                } else {
                    task.style.display = 'none';
                }
            };
        } else {
            for (let task of allItem) {
                if (task.classList.contains('done')) {
                    task.style.display = 'inline-block';
                } else {
                    task.style.display = 'none';
                }
            };
        }
    }
}

