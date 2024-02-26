const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
const checkAll = document.querySelector('#checkAll');
const deleteAllCheckedTodoBtn = document.querySelector('#deleteAll');

let todos = [];

const handleClick = (event) => {
    const itemKey = event.target.parentElement.dataset.id;
    if(event.target.type == 'submit') {
        todos = todos.filter(todo => todo.id !== parseInt(itemKey));
        renderTodos();
    }
    if(event.target.type == 'checkbox') {
        todos.forEach(todo => {
            if (todo.id === parseInt(itemKey)) {
                todo.isCompleted = event.target.checked;
            }
        });
        renderTodos();
    }
}

const handleConfirmIsAllChechk = () => {
    checkAll.checked = todos.length ? todos.every((todo) => todo.isCompleted) : false;
}

const handleCheckAllTodo = (event) => {
    todos.forEach(todo => {
        todo.isCompleted = event.target.checked;
        });
    renderTodos();
}

const handleDeleteAllCheckedTodo = () => {
    console.log( checkAll.checked);
    checkAll.checked = false;
    todos = todos.filter(todo => !todo.isCompleted);
    renderTodos();
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
        renderTodos();
        todoInput.value = '';
    }
}

const addTodoByEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTodo();
    }
}

const renderTodos = () => {
    listItems = '';
    todos.forEach(todo => {
        listItems += `<li data-id="${todo.id}" class="list-group-item">
        <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} /> 
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
checkAll.addEventListener('click', handleCheckAllTodo);
deleteAllCheckedTodoBtn.addEventListener('click', handleDeleteAllCheckedTodo);