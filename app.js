const DOUBLE_CLICK = 2;
const KEYDOWN_ESCAPE = "Escape";
const KEYDOWN_ENTER = "Enter";
const COUNT_OF_TODO_ON_PAGE = 5;
const INDEX_OF_ALL_TAB = 0;
const INDEX_OF_ACTIVE_TAB = 1;
const INDEX_OF_COMPLETED_TAB = 2;

const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
const checkAll = document.querySelector('#checkAll');
const deleteAllChecked = document.querySelector('#deleteAll');
const tabButtons = document.querySelectorAll('#tabGroups .tab-links');
const tabulation = document.querySelector("#tabGroups");
const paginationList = document.querySelector('#paginationList');

let todos = [];
let filterType = 'all';
let currentPage = 1;

const handleClick = (event) => {
    const itemKey = event.target.parentElement.dataset.id;
    if(event.target.type === 'submit') {
        todos = todos.filter(todo => todo.id !== parseInt(itemKey));
        returnBack();
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
    if (event.detail === DOUBLE_CLICK && event.target.tagName === "SPAN") {
        event.target.previousElementSibling.hidden = false;
        event.srcElement.hidden = true;
    }
    countTodo();
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

const handleConfirmIsAllCheck = () => {
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
    const todoTextWithoutSpaces = todoText.replace(/^\s+|\s+$/g, "");
    if (todoTextWithoutSpaces) {
        const todo = {
            id: Date.now(),
            text: todoTextWithoutSpaces,
            isCompleted: false
        };
        todos.push(todo);
        renderTodo();
        todoInput.value = '';
    }
    countTodo();
    filterType = 'all';
    sliceTodos();
    pushFront();
    renderTodo();
}

const addTodoByEnter = (event) => {
    if (event.key === KEYDOWN_ENTER) {
        addTodo();
    }
}

const saveTodoText = (event, itemKey) => {
    todos.forEach(todo => {
        if (todo.id === parseInt(itemKey)) {
            todo.text = event.target.value.replace(/^\s+|\s+$/g, "");
        }
    });
}

const returnBack = () => {
    let currentTodo = openTab();
    let countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
    if(currentPage > countOfPages && currentPage > 1) {
        currentPage -= 1;
        renderTodo();
    }
}

const pushFront = () => {
    let currentTodo = openTab();
    let countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
    if(currentPage < countOfPages) {
        currentPage += 1;
        renderTodo();
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
    tabButtons[INDEX_OF_ALL_TAB].style.backgroundColor = "black";
    tabButtons[INDEX_OF_ACTIVE_TAB].style.backgroundColor = "black";
    tabButtons[INDEX_OF_COMPLETED_TAB].style.backgroundColor = "black";

    if (filterType === 'active') {
        tabButtons[INDEX_OF_ACTIVE_TAB].style.backgroundColor = "red";
        return todos.filter(todo => !todo.isCompleted);
    }
    if (filterType === 'completed') {
        tabButtons[INDEX_OF_COMPLETED_TAB].style.backgroundColor = "red";
        return todos.filter(todo => todo.isCompleted);
    }

    tabButtons[INDEX_OF_ALL_TAB].style.backgroundColor = "red";
    return todos;
}

const sliceTodos = () => {
    let filterTodo = openTab();
    let end = currentPage * COUNT_OF_TODO_ON_PAGE;
    let start = end - COUNT_OF_TODO_ON_PAGE;
    return filterTodo.slice(start, end);
}

const createPaginationButtons = () => {
    let listPages = '';
    let currentTodo = openTab();
    let countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
    for(let i = 1; i <= countOfPages; i++) {
        listPages += `<button id="${i}" class="tab-links-pagination ${currentPage === i ? 'active' : '' }" 
        style="border-radius: 50%; width: 50px; height: 50px; margin: 0 5px 25px;">${i}</button>`;
    }
    paginationList.innerHTML = listPages;
}

const generateContent = (event) => {
    if (event.target.tagName === "BUTTON") {
        currentPage = parseInt(event.target.id);
        renderTodo();
    }
}

const renderTodo = () => {
    let listItems = '';
    let todosForRender = sliceTodos();

    todosForRender.forEach(todo => {
        listItems += `<li data-id="${todo.id}" class="list-group-item" 
            style="display: flex; align-items: center; flex: 1; word-wrap: break-word; width: 550px">
            <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} />
            <input class="text-on-todo-hidden" value="${todo.text}" hidden/>
            <span class="text-on-todo">${todo.text}</span>
            <button class="delete-todo">✗</button>
            </li>`;
    });

    todoList.innerHTML = listItems;

    createPaginationButtons();
    handleConfirmIsAllCheck();
    returnBack();
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
paginationList.addEventListener('click', generateContent);