const DOUBLE_CLICK = 2;
const KEYDOWN_ESCAPE = "Escape";
const KEYDOWN_ENTER = "Enter";
const COUNT_OF_TODO_ON_PAGE = 5;
const CURRENT_PAGE = 1;
const INDEX_OF_ALL_TAB = 0;
const INDEX_OF_ACTIVE_TAB = 1;
const INDEX_OF_COMPLETED_TAB = 2;

const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
const checkAll = document.querySelector('#checkAll');
const deleteAllChecked = document.querySelector('#deleteAll');
const tabButtons = document.querySelectorAll('#tabGroups .tablinks');
const tabulation = document.querySelector("#tabGroups");
const paginationList = document.querySelector('#paginationList');

let todos = [];
let filterType = 'all';

const handleClick = (event) => {
    const itemKey = event.target.parentElement.dataset.id;
    if(event.target.type === 'submit') {
        todos = todos.filter(todo => todo.id !== parseInt(itemKey));
    }
    if(event.target.type === 'checkbox') {
        todos.forEach(todo => {
            if (todo.id === parseInt(itemKey)) {
                todo.isCompleted = event.target.checked;
            }
        });
    }
    if (event.detail === DOUBLE_CLICK && event.target.tagName === "SPAN") {
        event.target.previousElementSibling.hidden = false;
        event.srcElement.hidden = true;
    }
    countTodo();
    renderTodo();
}

const saveTodoText = (event, itemKey) => {
    todos.forEach(todo => {
        if (todo.id === parseInt(itemKey)) {
            todo.text = event.target.value;
        }
    });
}

const handleKeydownClick = (event) => {
    if (event.key === KEYDOWN_ESCAPE) {
        renderTodo();
    }
    if (event.key === KEYDOWN_ENTER) {
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
    countTodo();
    renderTodo();
}

const handleDeleteAllCheckedTodo = () => {
    checkAll.checked = false;
    todos = todos.filter(todo => !todo.isCompleted);
    countTodo();
    renderTodo(todos);
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
    countTodo();
}

const addTodoByEnter = (event) => {
    if (event.key === KEYDOWN_ENTER) {
        addTodo();
    }
}

const countTodo = () => {
    let all = todos.length;
    let completed = todos.filter(todo => todo.isCompleted).length;
    let active = all - completed;

    tabButtons[INDEX_OF_ALL_TAB].textContent = `All(${all})`;
    tabButtons[INDEX_OF_ACTIVE_TAB].textContent = `Active(${active})`;
    tabButtons[INDEX_OF_COMPLETED_TAB].textContent = `Completed(${completed})`;
}

const openTab = () => {
    if (filterType === 'active') {
        return todos.filter(todo => !todo.isCompleted);
    }
    if (filterType === 'completed') {
        return todos.filter(todo => todo.isCompleted);
    }
    return todos;
}

const sliceTodos = (event) => {
    console.log(event.target.id);
    let index = (event.target.id - 1) * COUNT_OF_TODO_ON_PAGE;
    return todos.slice(index, index + 5);
}

const createPaginationButtons = () => {
    let listPages = '';
    countOfPages = Math.ceil(todos.length / COUNT_OF_TODO_ON_PAGE);
    for(let i = 1; i <= countOfPages; i++) {
        listPages += `<button id="${i}" class="tablinks">${i}</button>`;
    }
    paginationList.innerHTML = listPages;
}

const renderTodo = () => {
    let filterTodo = openTab();
    let listItems = '';

    filterTodo.forEach(todo => {
        listItems += `<li data-id="${todo.id}" class="list-group-item">
        <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} /> 
        <input value="${todo.text}" hidden/>
        <span>${todo.text}</span>
        <button class="delete-todo"> delete </button>
        </li>`;
    });
    
    todoList.innerHTML = listItems;

    createPaginationButtons();
    handleConfirmIsAllChechk();
}

const switchFilterType = (event) => {
    filterType = event.target.id;
    renderTodo();
}

todoInput.addEventListener('keydown', addTodoByEnter);
addTodoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', handleClick);
todoList.addEventListener('keydown', handleKeydownClick);
todoList.addEventListener('blur', handleBlur, true);
checkAll.addEventListener('click', handleCheckAllTodo);
deleteAllChecked.addEventListener('click', handleDeleteAllCheckedTodo);
tabulation.addEventListener('click', switchFilterType);
paginationList.addEventListener('click', sliceTodos);