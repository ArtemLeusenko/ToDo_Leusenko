const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
const checkAll = document.querySelector('#checkAll');
const deleteAllCheckedTodoBtn = document.querySelector('#deleteAll');

let todos = [];

const handleClick = (event) => {
    const itemKey = event.target.parentElement.dataset.id;
    if(event.target.type === 'submit') {
        todos = todos.filter(todo => todo.id !== parseInt(itemKey));
        renderTodo();
    }
    if(event.target.type === 'checkbox') {
        todos.forEach(todo => {
            if (todo.id === parseInt(itemKey)) {
                todo.isCompleted = event.target.checked;
            }
        });
        renderTodo();
    }
    if (event.detail === 2 && event.target.tagName === "SPAN") {
        event.target.previousElementSibling.hidden = false;
        event.srcElement.hidden = true;
    }
}

const saveTodoText = (event, itemKey) => {
    todos.forEach(todo => {
        if (todo.id === parseInt(itemKey)) {
            todo.text = event.target.value;
        }
    });
}

const handleKeydownClick = (event) => {
    if (event.key === "Escape") {
        renderTodo();
    }
    if (event.key === "Enter") {
        const itemKey = event.target.parentElement.dataset.id;
        saveTodoText(event, itemKey);
        renderTodo();
    }
}

const handleBlur = (event) => {
    const itemKey = event.target.parentElement.dataset.id;
    if(event.sourceCapabilities) {
        saveTodoText(event, itemKey);
        renderTodo();
    }
}

const handleConfirmIsAllChechk = () => {
    checkAll.checked = todos.length ? todos.every((todo) => todo.isCompleted) : false;
}

const handleCheckAllTodo = (event) => {
    todos.forEach(todo => {
        todo.isCompleted = event.target.checked;
        });
    renderTodo();
}

const handleDeleteAllCheckedTodo = () => {
    checkAll.checked = false;
    todos = todos.filter(todo => !todo.isCompleted);
    renderTodo();
}

const addTodo = () => {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            isCompleted: false
        };
        todos.push(todo);
        renderTodo();
        todoInput.value = '';
    }
}

const addTodoByEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTodo();
    }
}

const renderTodo = () => {
    listItems = '';
    todos.forEach(todo => {
        listItems += `<li data-id="${todo.id}" class="list-group-item">
        <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} /> 
        <input value="${todo.text}" hidden/>
        <span>${todo.text}</span>
        <button class="delete-todo"> delete </button>
        </li>`;
    });
    todoList.innerHTML = listItems;

    handleConfirmIsAllChechk();
}

todoInput.addEventListener('keydown', addTodoByEnter);
addTodoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', handleClick);
todoList.addEventListener('keydown', handleKeydownClick);
todoList.addEventListener('blur', handleBlur, true);
checkAll.addEventListener('click', handleCheckAllTodo);
deleteAllCheckedTodoBtn.addEventListener('click', handleDeleteAllCheckedTodo);