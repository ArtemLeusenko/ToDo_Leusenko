const DOUBLE_CLICK = 2;
const KEYDOWN_ESCAPE = 'Escape';
const KEYDOWN_ENTER = 'Enter';
const COUNT_OF_TODO_ON_PAGE = 5;

const todoInput = document.querySelector('#todo-input');
const addTodoBtn = document.querySelector('#add-todo');
const todoList = document.querySelector('#todo-list');
const checkAll = document.querySelector('#check-all');
const deleteAllChecked = document.querySelector('#delete-all');
const tabButtons = document.querySelectorAll('#tab-groups .tab-links');
const tabulation = document.querySelector('#tab-groups');
const paginationList = document.querySelector('#pagination-list');

let todos = [];
let filterType = 'all';
let currentPage = 1;

const escapeHTML = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')
  .replace(/\s{2,}/g, ' ');
const setColor = () => {
  tabButtons.forEach((button) => {
    button.classList.remove('active-colored');
    if (button.id === filterType) {
      button.classList.add('active-colored');
    }
  });
};

const openTab = () => {
  if (filterType === 'active') {
    return todos.filter((todo) => !todo.isCompleted);
  }
  if (filterType === 'completed') {
    return todos.filter((todo) => todo.isCompleted);
  }

  return todos;
};

const sliceTodos = () => {
  const filterTodo = openTab();
  const end = currentPage * COUNT_OF_TODO_ON_PAGE;
  const start = end - COUNT_OF_TODO_ON_PAGE;
  return filterTodo.slice(start, end);
};

const createPaginationButtons = () => {
  let listPages = '';
  const currentTodo = openTab();
  const countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
  for (let i = 1; i <= countOfPages; i += 1) {
    listPages += `
    <button id="${i}" class="tab-links-pagination ${currentPage === i ? 'active' : ''}">${i}</button>`;
  }
  paginationList.innerHTML = listPages;
};

const countTodo = () => {
  const all = todos.length;
  const completed = todos.filter((todo) => todo.isCompleted).length;
  const active = all - completed;

  tabButtons[0].textContent = `All(${all})`;
  tabButtons[1].textContent = `Active(${active})`;
  tabButtons[2].textContent = `Completed(${completed})`;
};

const handleConfirmIsAllCheck = () => {
  checkAll.checked = todos.length ? todos.every((todo) => todo.isCompleted) : false;
};

const renderTodo = () => {
  countTodo();
  returnBack();
  let listItems = '';
  const todosForRender = sliceTodos();

  todosForRender.forEach((todo) => {
    listItems += `
    <li data-id="${todo.id}" class="list-group-item" >
      <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} />
      <input class="text-on-todo-hidden" maxlength="250" value="${todo.text}" hidden/>
      <span class="text-on-todo">${todo.text}</span>
      <button class="delete-todo">✗</button>
    </li>`;
  });
  todoList.innerHTML = listItems;

  createPaginationButtons();
  handleConfirmIsAllCheck();
};

const returnBack = () => {
  const currentTodo = openTab();
  const countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
  if (currentPage > countOfPages && currentPage > 1) {
    currentPage -= 1;
    renderTodo();
  }
};

const pushFront = () => {
  const currentTodo = openTab();
  const countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
  if (currentPage < countOfPages) {
    currentPage += 1;
    renderTodo();
  }
};

const addTodo = () => {
  const todoText = todoInput.value.trim();
  const todoTextWithoutSpaces = escapeHTML(todoText.replace(/^\s+|\s+$/g, ''));
  if (todoTextWithoutSpaces) {
    const todo = {
      id: Date.now(),
      text: todoTextWithoutSpaces,
      isCompleted: false,
    };
    todos.push(todo);
    todoInput.value = '';
    countTodo();
    filterType = 'all';
    const currentTodo = openTab();
    const countOfPages = Math.ceil(currentTodo.length / COUNT_OF_TODO_ON_PAGE);
    currentPage = countOfPages;
    sliceTodos();
    pushFront();
    renderTodo();
    setColor();
  }
};

const addTodoByEnter = (event) => {
  if (event.key === KEYDOWN_ENTER) {
    addTodo();
  }
};

const saveTodoText = (event, itemKey) => {
  const todoTextWithoutSpaces = escapeHTML(event.target.value.replace(/^\s+|\s+$/g, ''));
  todos.forEach((todo) => {
    if (todo.id === Number(itemKey) && todoTextWithoutSpaces) {
      todo.text = todoTextWithoutSpaces;
    }
  });
  renderTodo();
};

const handleClick = (event) => {
  const itemKey = event.target.parentElement.dataset.id;
  if (event.target.type === 'submit') {
    todos = todos.filter((todo) => todo.id !== Number(itemKey));
    renderTodo();
  }
  if (event.target.type === 'checkbox') {
    todos.forEach((todo) => {
      if (todo.id === Number(itemKey)) {
        todo.isCompleted = event.target.checked;
      }
    });
    renderTodo();
  }
  if (event.detail === DOUBLE_CLICK && event.target.tagName === 'SPAN') {
    const textElement = event.target.previousElementSibling;
    textElement.hidden = false;
    event.target.hidden = true;
    textElement.focus();
  }
  countTodo();
};

const handleCheckAllTodo = (event) => {
  todos.forEach((todo) => {
    todo.isCompleted = event.target.checked;
  });
  renderTodo();
};

const handleDeleteAllCheckedTodo = () => {
  checkAll.checked = false;
  todos = todos.filter((todo) => !todo.isCompleted);
  renderTodo();
};

const handleBlur = (event) => {
  const itemKey = event.target.parentElement.dataset.id;
  if (event.sourceCapabilities) {
    saveTodoText(event, itemKey);
  }
};

const handleKeydownClick = (event) => {
  if (event.key === KEYDOWN_ESCAPE) {
    renderTodo();
  }
  const itemKey = event.target.parentElement.dataset.id;
  if (event.key === KEYDOWN_ENTER) {
    saveTodoText(event, itemKey);
  }
};

const generateContent = (event) => {
  if (event.target.tagName === 'BUTTON') {
    currentPage = Number(event.target.id);
    renderTodo();
  }
};

const switchFilterType = (event) => {
  if (event.target.tagName === 'BUTTON') {
    filterType = event.target.id;
    renderTodo();
    setColor();
  }
};

todoInput.addEventListener('keydown', addTodoByEnter);
addTodoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', handleClick);
todoList.addEventListener('keydown', handleKeydownClick);
todoList.addEventListener('blur', handleBlur, true);
checkAll.addEventListener('click', handleCheckAllTodo);
deleteAllChecked.addEventListener('click', handleDeleteAllCheckedTodo);
tabulation.addEventListener('click', switchFilterType);
paginationList.addEventListener('click', generateContent);
