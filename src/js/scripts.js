// Create variables for our page elements
const form = document.querySelector('form');
const ul = document.querySelector('ul');
const clearAllButton = document.querySelector('button');
const input = document.getElementById('item');
// Let's create an empty array and set up a localStorage key called "items".
let itemsArray = localStorage.getItem('items')
  ? JSON.parse(localStorage.getItem('items'))
  : [];
// We'll use JSON.stringify() to convert the data array to a string aslocalStorage only supports strings as values
localStorage.setItem('items', JSON.stringify(itemsArray));
// We'll use JSON.parse() to convert the contents of localStorage back into something we can work with later in the data variable.
const data = JSON.parse(localStorage.getItem('items'));

// Add a class to our clearAllButton
clearAllButton.className = 'clear-all';
form.className = 'todo-form';

// We'll create a function to handle our progress bar.
/**
 * We'll create a function to display a progress bar.
 * We'll check how many current tasks there are and how many have been completed to get our percentage.
 */
const percentage = () => {
  const totalTasks = document.querySelectorAll('li').length;
  const totalCompletedTasks = document.querySelectorAll('li .completed').length;
  const progress = Math.floor((totalCompletedTasks / totalTasks) * 100);

  if (totalTasks > 0) {
    document.getElementById('task-progress').innerHTML = `${progress}%`;
    document.getElementById('task-progress').style.width = `${progress}%`;
  } else {
    document.getElementById('task-progress').innerHTML = '';
    document.getElementById('task-progress').style.width = '0%';
  }
};
percentage();

/**
 * Build out our li elemnet for each of our tasks.
 * Each li will need a checkbox, the inputted text and a delete button
 * Appends the list item to the ul.
 * We'll also run the percentage function again to update the frontend.
 */
const liMaker = (text) => {
  // create our variables
  const li = document.createElement('li');
  const deleteTaskButton = document.createElement('button');
  const checkbox = document.createElement('input');
  const labelContainer = document.createElement('label');
  const label = document.createElement('label');
  const labelText = document.createElement('span');

  li.setAttribute('draggable', 'true');
  li.className = 'draggable';
  ul.className = 'dropzone';

  // Add classes and attributes
  li.setAttribute('draggable', 'true');
  li.className = 'draggable';
  ul.className = 'dropzone';
  labelContainer.className = 'container';
  label.className = 'newcheckmark';
  deleteTaskButton.className = 'delete';
  deleteTaskButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
  labelText.textContent = text;

  // Create an event listener to remove individual tasks.
  function removeTaskLi(e) {
    e.target.closest('li').remove();
    percentage();
  }
  deleteTaskButton.addEventListener('click', removeTaskLi);
  // create our checkboxes and add unique ID
  for (let i = 0; i < itemsArray.length; i += 1) {
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.value = 'value';
    checkbox.id = `todo${i}`;
    label.htmlFor = `todo${i}`;
    li.id = `${i}`;
  }
  // Add an event listener to toggle our completed class
  function completedTodo() {
    this.parentNode.classList.toggle('completed');
    percentage();
  }
  checkbox.addEventListener('click', completedTodo);
  // Build our li
  ul.appendChild(li);
  li.appendChild(labelContainer);
  labelContainer.appendChild(checkbox);
  labelContainer.appendChild(label);
  labelContainer.appendChild(labelText);
  labelContainer.appendChild(deleteTaskButton);

  // Build in draggable lists
  const draggables = document.querySelectorAll('.draggable');
  const containers = document.querySelectorAll('.dropzone');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
      // console.log('drag start');
      draggable.classList.add('dragging');
    });
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });
  function getDragAfterElement(container, y) {
    // console.log('fired');
    const draggableElements = [
      ...container.querySelectorAll('.draggable:not(.dragging)'),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  containers.forEach((container) => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      // console.log('drag over');
      // console.log('afterElement');
      const draggable = document.querySelector('.dragging');
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
  /* */
};

/**
 * Create a task to listen for a submit event.
 * As we're not sending data to the server we'll use the e.preventDefault()
 * e.preventDefault() stops the form from doing the default submit action.
 */
function addTask(e) {
  e.preventDefault();

  // We'll push any new input value into the array, then set the localStorage to the new, updated value.
  itemsArray.push(input.value);
  localStorage.setItem('items', JSON.stringify(itemsArray));
  // Lets call the liMaker() function. This will create the item with the text of the input value and append it to the DOM.
  liMaker(input.value);
  // Lets set the input value to an empty string so we don't have to remove the last item entered manually.
  input.value = '';
}
form.addEventListener('submit', addTask);

/**
 * We'll loop through our items which has all the existing localStorage data in a form JavaScript can understand.
 * We'll run the liMaker() again to show display all the existing stored information on the front end every time the app is opened.
 */

data.forEach((item) => {
  liMaker(item);
});

/**
 * Add an event listener to our 'clearAllButton' button that will clear all data from localStorage and remove every child from the ul.
 * We'll run the percentage function again to update the frontend.
 */
function removeAllTasks() {
  localStorage.clear();
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  itemsArray = [];
  percentage();
}
clearAllButton.addEventListener('click', removeAllTasks);

/**
 * We'll create a function to get the current date.
 * We'll display the current date on the frontend.
 */
function beDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const date = currentDate.getDate();
  const weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';

  const months = new Array(12);
  months[0] = 'January';
  months[1] = 'February';
  months[2] = 'March';
  months[3] = 'April';
  months[4] = 'May';
  months[5] = 'June';
  months[6] = 'July';
  months[7] = 'August';
  months[8] = 'September';
  months[9] = 'October';
  months[10] = 'November';
  months[11] = 'December';

  const displayWeekday = weekday[currentDate.getDay()];
  const displayMonth = months[currentDate.getMonth()];
  const formatted = `${displayWeekday}, ${displayMonth} ${date} ${year}`;
  document.getElementById('display-date').innerHTML = formatted;
}
beDate();
/**
 * We'll create a function to get the current time.
 * We'll add a extra '0' to numbers less than 10 so 2 digets are always displayed on the frontend.
 * We'll set an interval around the function so the time updates in the browser every minute.
 */
function beCurrentTime() {
  const d = new Date();
  const x = document.getElementById('display-time');
  const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  // const s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  x.innerHTML = `${h}:${m}`;
}
beCurrentTime();

setInterval(function beTimeInterval1() {
  beCurrentTime();
}, 1000);
