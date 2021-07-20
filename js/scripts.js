"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Create variables for our page elements
var taskForm = document.querySelector('form');
var ul = document.querySelector('ul');
var clearAllButton = document.querySelector('button');
var input = document.getElementById('item'); // Let's create an empty array and set up a localStorage key called "items".

var itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []; // We'll use JSON.stringify() to convert the data array to a string aslocalStorage only supports strings as values

localStorage.setItem('items', JSON.stringify(itemsArray)); // We'll use JSON.parse() to convert the contents of localStorage back into something we can work with later in the data variable.

var data = JSON.parse(localStorage.getItem('items')); // Add a class to our clearAllButton

clearAllButton.className = 'clear-all';
taskForm.className = 'todo-form'; // We'll create a function to handle our progress bar.

/**
 * We'll create a function to display a progress bar.
 * We'll check how many current tasks there are and how many have been completed to get our percentage.
 */

var percentage = function percentage() {
  var totalTasks = document.querySelectorAll('li').length;
  var totalCompletedTasks = document.querySelectorAll('li .completed').length;
  var progress = Math.floor(totalCompletedTasks / totalTasks * 100);

  if (totalTasks > 0) {
    document.getElementById('task-progress').innerHTML = "".concat(progress, "%");
    document.getElementById('task-progress').style.width = "".concat(progress, "%");
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

var taskLi = function taskLi(text) {
  // create our variables
  var li = document.createElement('li');
  var deleteTaskButton = document.createElement('button');
  var checkbox = document.createElement('input');
  var labelContainer = document.createElement('label');
  var label = document.createElement('label');
  var labelText = document.createElement('span');
  li.setAttribute('draggable', 'true');
  li.className = 'draggable';
  ul.className = 'dropzone'; // Add classes and attributes

  li.setAttribute('draggable', 'true');
  li.className = 'draggable';
  ul.className = 'dropzone';
  labelContainer.className = 'container';
  label.className = 'newcheckmark';
  deleteTaskButton.className = 'delete';
  deleteTaskButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
  labelText.textContent = text; // Create an event listener to remove individual tasks.

  function removeTaskLi(e) {
    e.target.closest('li').remove();
    percentage();
  }

  deleteTaskButton.addEventListener('click', removeTaskLi); // create our checkboxes and add unique ID

  for (var i = 0; i < itemsArray.length; i += 1) {
    checkbox.type = 'checkbox';
    checkbox.name = 'todo';
    checkbox.value = 'value';
    checkbox.id = "todo".concat(i);
    label.htmlFor = "todo".concat(i);
    li.id = "".concat(i);
  } // Add an event listener to toggle our completed class


  function completedTodo() {
    this.parentNode.classList.toggle('completed');
    percentage();
  }

  checkbox.addEventListener('click', completedTodo); // Build our li

  ul.appendChild(li);
  li.appendChild(labelContainer);
  labelContainer.appendChild(checkbox);
  labelContainer.appendChild(label);
  labelContainer.appendChild(labelText);
  labelContainer.appendChild(deleteTaskButton); // Build in draggable lists

  var draggables = document.querySelectorAll('.draggable');
  var containers = document.querySelectorAll('.dropzone');
  draggables.forEach(function (draggable) {
    draggable.addEventListener('dragstart', function () {
      // console.log('drag start');
      draggable.classList.add('dragging');
    });
    draggable.addEventListener('dragend', function () {
      draggable.classList.remove('dragging');
    });
  });

  function getDragAfterElement(container, y) {
    // console.log('fired');
    var draggableElements = _toConsumableArray(container.querySelectorAll('.draggable:not(.dragging)'));

    return draggableElements.reduce(function (closest, child) {
      var box = child.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child
        };
      } else {
        return closest;
      }
    }, {
      offset: Number.NEGATIVE_INFINITY
    }).element;
  }

  containers.forEach(function (container) {
    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      var afterElement = getDragAfterElement(container, e.clientY); // console.log('drag over');
      // console.log('afterElement');

      var draggable = document.querySelector('.dragging');

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
  e.preventDefault(); // We'll push any new input value into the array, then set the localStorage to the new, updated value.

  itemsArray.push(input.value);
  localStorage.setItem('items', JSON.stringify(itemsArray)); // Lets call the taskLi() function. This will create the item with the text of the input value and append it to the DOM.

  taskLi(input.value); // Lets set the input value to an empty string so we don't have to remove the last item entered manually.

  input.value = '';
}

taskForm.addEventListener('submit', addTask);
/**
 * We'll loop through our items which has all the existing localStorage data in a form JavaScript can understand.
 * We'll run the taskLi() again to show display all the existing stored information on the front end every time the app is opened.
 */

data.forEach(function (item) {
  taskLi(item);
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
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var date = currentDate.getDate();
  var weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';
  var months = new Array(12);
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
  var displayWeekday = weekday[currentDate.getDay()];
  var displayMonth = months[currentDate.getMonth()];
  var formattedDay = "".concat(displayWeekday);
  var formattedDate = "".concat(displayMonth, " ").concat(date, " ").concat(year);
  document.getElementById('display-day').innerHTML = formattedDay;
  document.getElementById('display-date').innerHTML = formattedDate;
}

beDate();
/**
 * We'll create a function to get the current time.
 * We'll add a extra '0' to numbers less than 10 so 2 digets are always displayed on the frontend.
 * We'll set an interval around the function so the time updates in the browser every minute.
 */

function beCurrentTime() {
  var d = new Date();
  var x = document.getElementById('display-time');
  var h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); // const s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  x.innerHTML = "".concat(h, ":").concat(m);
}

beCurrentTime();
setInterval(function beTimeInterval1() {
  beCurrentTime();
}, 1000);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdHMuanMiXSwibmFtZXMiOlsidGFza0Zvcm0iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJ1bCIsImNsZWFyQWxsQnV0dG9uIiwiaW5wdXQiLCJnZXRFbGVtZW50QnlJZCIsIml0ZW1zQXJyYXkiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImRhdGEiLCJjbGFzc05hbWUiLCJwZXJjZW50YWdlIiwidG90YWxUYXNrcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCJ0b3RhbENvbXBsZXRlZFRhc2tzIiwicHJvZ3Jlc3MiLCJNYXRoIiwiZmxvb3IiLCJpbm5lckhUTUwiLCJzdHlsZSIsIndpZHRoIiwidGFza0xpIiwidGV4dCIsImxpIiwiY3JlYXRlRWxlbWVudCIsImRlbGV0ZVRhc2tCdXR0b24iLCJjaGVja2JveCIsImxhYmVsQ29udGFpbmVyIiwibGFiZWwiLCJsYWJlbFRleHQiLCJzZXRBdHRyaWJ1dGUiLCJ0ZXh0Q29udGVudCIsInJlbW92ZVRhc2tMaSIsImUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicmVtb3ZlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImkiLCJ0eXBlIiwibmFtZSIsInZhbHVlIiwiaWQiLCJodG1sRm9yIiwiY29tcGxldGVkVG9kbyIsInBhcmVudE5vZGUiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJhcHBlbmRDaGlsZCIsImRyYWdnYWJsZXMiLCJjb250YWluZXJzIiwiZm9yRWFjaCIsImRyYWdnYWJsZSIsImFkZCIsImdldERyYWdBZnRlckVsZW1lbnQiLCJjb250YWluZXIiLCJ5IiwiZHJhZ2dhYmxlRWxlbWVudHMiLCJyZWR1Y2UiLCJjaGlsZCIsImJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm9mZnNldCIsInRvcCIsImhlaWdodCIsImVsZW1lbnQiLCJOdW1iZXIiLCJORUdBVElWRV9JTkZJTklUWSIsInByZXZlbnREZWZhdWx0IiwiYWZ0ZXJFbGVtZW50IiwiY2xpZW50WSIsImluc2VydEJlZm9yZSIsImFkZFRhc2siLCJwdXNoIiwiaXRlbSIsInJlbW92ZUFsbFRhc2tzIiwiY2xlYXIiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJiZURhdGUiLCJjdXJyZW50RGF0ZSIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJkYXRlIiwiZ2V0RGF0ZSIsIndlZWtkYXkiLCJBcnJheSIsIm1vbnRocyIsImRpc3BsYXlXZWVrZGF5IiwiZ2V0RGF5IiwiZGlzcGxheU1vbnRoIiwiZ2V0TW9udGgiLCJmb3JtYXR0ZWREYXkiLCJmb3JtYXR0ZWREYXRlIiwiYmVDdXJyZW50VGltZSIsImQiLCJ4IiwiaCIsImdldEhvdXJzIiwibSIsImdldE1pbnV0ZXMiLCJzZXRJbnRlcnZhbCIsImJlVGltZUludGVydmFsMSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLElBQU1BLFFBQVEsR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE1BQXZCLENBQWpCO0FBQ0EsSUFBTUMsRUFBRSxHQUFHRixRQUFRLENBQUNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWDtBQUNBLElBQU1FLGNBQWMsR0FBR0gsUUFBUSxDQUFDQyxhQUFULENBQXVCLFFBQXZCLENBQXZCO0FBQ0EsSUFBTUcsS0FBSyxHQUFHSixRQUFRLENBQUNLLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBZCxDLENBQ0E7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUIsT0FBckIsSUFDYkMsSUFBSSxDQUFDQyxLQUFMLENBQVdILFlBQVksQ0FBQ0MsT0FBYixDQUFxQixPQUFyQixDQUFYLENBRGEsR0FFYixFQUZKLEMsQ0FHQTs7QUFDQUQsWUFBWSxDQUFDSSxPQUFiLENBQXFCLE9BQXJCLEVBQThCRixJQUFJLENBQUNHLFNBQUwsQ0FBZU4sVUFBZixDQUE5QixFLENBQ0E7O0FBQ0EsSUFBTU8sSUFBSSxHQUFHSixJQUFJLENBQUNDLEtBQUwsQ0FB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QXVDa0IsU0FBdkMsR0FBbUQyRSxZQUFuRDtBQUNBbEcsRUFBQUEsUUFBUSxDQUFDSyxjQUFULENBQXdCLGNBQXhCLEVBQXdDa0IsU0FBeEMsR0FBb0Q0RSxhQUFwRDtBQUNEOztBQUNEZixNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxTQUFTZ0IsYUFBVCxHQUF5QjtBQUN2QixNQUFNQyxDQUFDLEdBQUcsSUFBSWYsSUFBSixFQUFWO0FBQ0EsTUFBTWdCLENBQUMsR0FBR3RHLFFBQVEsQ0FBQ0ssY0FBVCxDQUF3QixjQUF4QixDQUFWO0FBQ0EsTUFBTWtHLENBQUMsR0FBRyxDQUFDRixDQUFDLENBQUNHLFFBQUYsS0FBZSxFQUFmLEdBQW9CLEdBQXBCLEdBQTBCLEVBQTNCLElBQWlDSCxDQUFDLENBQUNHLFFBQUYsRUFBM0M7QUFDQSxNQUFNQyxDQUFDLEdBQUcsQ0FBQ0osQ0FBQyxDQUFDSyxVQUFGLEtBQWlCLEVBQWpCLEdBQXNCLEdBQXRCLEdBQTRCLEVBQTdCLElBQW1DTCxDQUFDLENBQUNLLFVBQUYsRUFBN0MsQ0FKdUIsQ0FLdkI7O0FBQ0FKLEVBQUFBLENBQUMsQ0FBQy9FLFNBQUYsYUFBaUJnRixDQUFqQixjQUFzQkUsQ0FBdEI7QUFDRDs7QUFDREwsYUFBYTtBQUViTyxXQUFXLENBQUMsU0FBU0MsZUFBVCxHQUEyQjtBQUNyQ1IsRUFBQUEsYUFBYTtBQUNkLENBRlUsRUFFUixJQUZRLENBQVgiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDcmVhdGUgdmFyaWFibGVzIGZvciBvdXIgcGFnZSBlbGVtZW50c1xuY29uc3QgdGFza0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5jb25zdCB1bCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG5jb25zdCBjbGVhckFsbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbScpO1xuLy8gTGV0J3MgY3JlYXRlIGFuIGVtcHR5IGFycmF5IGFuZCBzZXQgdXAgYSBsb2NhbFN0b3JhZ2Uga2V5IGNhbGxlZCBcIml0ZW1zXCIuXG5sZXQgaXRlbXNBcnJheSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpdGVtcycpXG4gID8gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaXRlbXMnKSlcbiAgOiBbXTtcbi8vIFdlJ2xsIHVzZSBKU09OLnN0cmluZ2lmeSgpIHRvIGNvbnZlcnQgdGhlIGRhdGEgYXJyYXkgdG8gYSBzdHJpbmcgYXNsb2NhbFN0b3JhZ2Ugb25seSBzdXBwb3J0cyBzdHJpbmdzIGFzIHZhbHVlc1xubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2l0ZW1zJywgSlNPTi5zdHJpbmdpZnkoaXRlbXNBcnJheSkpO1xuLy8gV2UnbGwgdXNlIEpTT04ucGFyc2UoKSB0byBjb252ZXJ0IHRoZSBjb250ZW50cyBvZiBsb2NhbFN0b3JhZ2UgYmFjayBpbnRvIHNvbWV0aGluZyB3ZSBjYW4gd29yayB3aXRoIGxhdGVyIGluIHRoZSBkYXRhIHZhcmlhYmxlLlxuY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2l0ZW1zJykpO1xuXG4vLyBBZGQgYSBjbGFzcyB0byBvdXIgY2xlYXJBbGxCdXR0b25cbmNsZWFyQWxsQnV0dG9uLmNsYXNzTmFtZSA9ICdjbGVhci1hbGwnO1xudGFza0Zvcm0uY2xhc3NOYW1lID0gJ3RvZG8tZm9ybSc7XG5cbi8vIFdlJ2xsIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGhhbmRsZSBvdXIgcHJvZ3Jlc3MgYmFyLlxuLyoqXG4gKiBXZSdsbCBjcmVhdGUgYSBmdW5jdGlvbiB0byBkaXNwbGF5IGEgcHJvZ3Jlc3MgYmFyLlxuICogV2UnbGwgY2hlY2sgaG93IG1hbnkgY3VycmVudCB0YXNrcyB0aGVyZSBhcmUgYW5kIGhvdyBtYW55IGhhdmUgYmVlbiBjb21wbGV0ZWQgdG8gZ2V0IG91ciBwZXJjZW50YWdlLlxuICovXG5jb25zdCBwZXJjZW50YWdlID0gKCkgPT4ge1xuICBjb25zdCB0b3RhbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGg7XG4gIGNvbnN0IHRvdGFsQ29tcGxldGVkVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaSAuY29tcGxldGVkJykubGVuZ3RoO1xuICBjb25zdCBwcm9ncmVzcyA9IE1hdGguZmxvb3IoKHRvdGFsQ29tcGxldGVkVGFza3MgLyB0b3RhbFRhc2tzKSAqIDEwMCk7XG5cbiAgaWYgKHRvdGFsVGFza3MgPiAwKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stcHJvZ3Jlc3MnKS5pbm5lckhUTUwgPSBgJHtwcm9ncmVzc30lYDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1wcm9ncmVzcycpLnN0eWxlLndpZHRoID0gYCR7cHJvZ3Jlc3N9JWA7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stcHJvZ3Jlc3MnKS5pbm5lckhUTUwgPSAnJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1wcm9ncmVzcycpLnN0eWxlLndpZHRoID0gJzAlJztcbiAgfVxufTtcbnBlcmNlbnRhZ2UoKTtcblxuLyoqXG4gKiBCdWlsZCBvdXQgb3VyIGxpIGVsZW1uZXQgZm9yIGVhY2ggb2Ygb3VyIHRhc2tzLlxuICogRWFjaCBsaSB3aWxsIG5lZWQgYSBjaGVja2JveCwgdGhlIGlucHV0dGVkIHRleHQgYW5kIGEgZGVsZXRlIGJ1dHRvblxuICogQXBwZW5kcyB0aGUgbGlzdCBpdGVtIHRvIHRoZSB1bC5cbiAqIFdlJ2xsIGFsc28gcnVuIHRoZSBwZXJjZW50YWdlIGZ1bmN0aW9uIGFnYWluIHRvIHVwZGF0ZSB0aGUgZnJvbnRlbmQuXG4gKi9cbmNvbnN0IHRhc2tMaSA9ICh0ZXh0KSA9PiB7XG4gIC8vIGNyZWF0ZSBvdXIgdmFyaWFibGVzXG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgZGVsZXRlVGFza0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGxhYmVsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBsYWJlbFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgbGkuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCAndHJ1ZScpO1xuICBsaS5jbGFzc05hbWUgPSAnZHJhZ2dhYmxlJztcbiAgdWwuY2xhc3NOYW1lID0gJ2Ryb3B6b25lJztcblxuICAvLyBBZGQgY2xhc3NlcyBhbmQgYXR0cmlidXRlc1xuICBsaS5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICd0cnVlJyk7XG4gIGxpLmNsYXNzTmFtZSA9ICdkcmFnZ2FibGUnO1xuICB1bC5jbGFzc05hbWUgPSAnZHJvcHpvbmUnO1xuICBsYWJlbENvbnRhaW5lci5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcbiAgbGFiZWwuY2xhc3NOYW1lID0gJ25ld2NoZWNrbWFyayc7XG4gIGRlbGV0ZVRhc2tCdXR0b24uY2xhc3NOYW1lID0gJ2RlbGV0ZSc7XG4gIGRlbGV0ZVRhc2tCdXR0b24uaW5uZXJIVE1MID0gJzxpb24taWNvbiBuYW1lPVwidHJhc2hcIj48L2lvbi1pY29uPic7XG4gIGxhYmVsVGV4dC50ZXh0Q29udGVudCA9IHRleHQ7XG5cbiAgLy8gQ3JlYXRlIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHJlbW92ZSBpbmRpdmlkdWFsIHRhc2tzLlxuICBmdW5jdGlvbiByZW1vdmVUYXNrTGkoZSkge1xuICAgIGUudGFyZ2V0LmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XG4gICAgcGVyY2VudGFnZSgpO1xuICB9XG4gIGRlbGV0ZVRhc2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVUYXNrTGkpO1xuICAvLyBjcmVhdGUgb3VyIGNoZWNrYm94ZXMgYW5kIGFkZCB1bmlxdWUgSURcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtc0FycmF5Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgY2hlY2tib3gubmFtZSA9ICd0b2RvJztcbiAgICBjaGVja2JveC52YWx1ZSA9ICd2YWx1ZSc7XG4gICAgY2hlY2tib3guaWQgPSBgdG9kbyR7aX1gO1xuICAgIGxhYmVsLmh0bWxGb3IgPSBgdG9kbyR7aX1gO1xuICAgIGxpLmlkID0gYCR7aX1gO1xuICB9XG4gIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byB0b2dnbGUgb3VyIGNvbXBsZXRlZCBjbGFzc1xuICBmdW5jdGlvbiBjb21wbGV0ZWRUb2RvKCkge1xuICAgIHRoaXMucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdjb21wbGV0ZWQnKTtcbiAgICBwZXJjZW50YWdlKCk7XG4gIH1cbiAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb21wbGV0ZWRUb2RvKTtcbiAgLy8gQnVpbGQgb3VyIGxpXG4gIHVsLmFwcGVuZENoaWxkKGxpKTtcbiAgbGkuYXBwZW5kQ2hpbGQobGFiZWxDb250YWluZXIpO1xuICBsYWJlbENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gIGxhYmVsQ29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgbGFiZWxDb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxUZXh0KTtcbiAgbGFiZWxDb250YWluZXIuYXBwZW5kQ2hpbGQoZGVsZXRlVGFza0J1dHRvbik7XG5cbiAgLy8gQnVpbGQgaW4gZHJhZ2dhYmxlIGxpc3RzXG4gIGNvbnN0IGRyYWdnYWJsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJhZ2dhYmxlJyk7XG4gIGNvbnN0IGNvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcHpvbmUnKTtcblxuICBkcmFnZ2FibGVzLmZvckVhY2goKGRyYWdnYWJsZSkgPT4ge1xuICAgIGRyYWdnYWJsZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCAoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZHJhZyBzdGFydCcpO1xuICAgICAgZHJhZ2dhYmxlLmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG4gICAgfSk7XG4gICAgZHJhZ2dhYmxlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICBkcmFnZ2FibGUuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dpbmcnKTtcbiAgICB9KTtcbiAgfSk7XG4gIGZ1bmN0aW9uIGdldERyYWdBZnRlckVsZW1lbnQoY29udGFpbmVyLCB5KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2ZpcmVkJyk7XG4gICAgY29uc3QgZHJhZ2dhYmxlRWxlbWVudHMgPSBbXG4gICAgICAuLi5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmRyYWdnYWJsZTpub3QoLmRyYWdnaW5nKScpLFxuICAgIF07XG5cbiAgICByZXR1cm4gZHJhZ2dhYmxlRWxlbWVudHMucmVkdWNlKFxuICAgICAgKGNsb3Nlc3QsIGNoaWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IGJveCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB5IC0gYm94LnRvcCAtIGJveC5oZWlnaHQgLyAyO1xuICAgICAgICBpZiAob2Zmc2V0IDwgMCAmJiBvZmZzZXQgPiBjbG9zZXN0Lm9mZnNldCkge1xuICAgICAgICAgIHJldHVybiB7IG9mZnNldDogb2Zmc2V0LCBlbGVtZW50OiBjaGlsZCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjbG9zZXN0O1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyBvZmZzZXQ6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSB9XG4gICAgKS5lbGVtZW50O1xuICB9XG5cbiAgY29udGFpbmVycy5mb3JFYWNoKChjb250YWluZXIpID0+IHtcbiAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgYWZ0ZXJFbGVtZW50ID0gZ2V0RHJhZ0FmdGVyRWxlbWVudChjb250YWluZXIsIGUuY2xpZW50WSk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnZHJhZyBvdmVyJyk7XG4gICAgICAvLyBjb25zb2xlLmxvZygnYWZ0ZXJFbGVtZW50Jyk7XG4gICAgICBjb25zdCBkcmFnZ2FibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZ2dpbmcnKTtcbiAgICAgIGlmIChhZnRlckVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZHJhZ2dhYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZHJhZ2dhYmxlLCBhZnRlckVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgLyogKi9cbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgdGFzayB0byBsaXN0ZW4gZm9yIGEgc3VibWl0IGV2ZW50LlxuICogQXMgd2UncmUgbm90IHNlbmRpbmcgZGF0YSB0byB0aGUgc2VydmVyIHdlJ2xsIHVzZSB0aGUgZS5wcmV2ZW50RGVmYXVsdCgpXG4gKiBlLnByZXZlbnREZWZhdWx0KCkgc3RvcHMgdGhlIGZvcm0gZnJvbSBkb2luZyB0aGUgZGVmYXVsdCBzdWJtaXQgYWN0aW9uLlxuICovXG5mdW5jdGlvbiBhZGRUYXNrKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIC8vIFdlJ2xsIHB1c2ggYW55IG5ldyBpbnB1dCB2YWx1ZSBpbnRvIHRoZSBhcnJheSwgdGhlbiBzZXQgdGhlIGxvY2FsU3RvcmFnZSB0byB0aGUgbmV3LCB1cGRhdGVkIHZhbHVlLlxuICBpdGVtc0FycmF5LnB1c2goaW5wdXQudmFsdWUpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaXRlbXMnLCBKU09OLnN0cmluZ2lmeShpdGVtc0FycmF5KSk7XG4gIC8vIExldHMgY2FsbCB0aGUgdGFza0xpKCkgZnVuY3Rpb24uIFRoaXMgd2lsbCBjcmVhdGUgdGhlIGl0ZW0gd2l0aCB0aGUgdGV4dCBvZiB0aGUgaW5wdXQgdmFsdWUgYW5kIGFwcGVuZCBpdCB0byB0aGUgRE9NLlxuICB0YXNrTGkoaW5wdXQudmFsdWUpO1xuICAvLyBMZXRzIHNldCB0aGUgaW5wdXQgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nIHNvIHdlIGRvbid0IGhhdmUgdG8gcmVtb3ZlIHRoZSBsYXN0IGl0ZW0gZW50ZXJlZCBtYW51YWxseS5cbiAgaW5wdXQudmFsdWUgPSAnJztcbn1cbnRhc2tGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFkZFRhc2spO1xuXG4vKipcbiAqIFdlJ2xsIGxvb3AgdGhyb3VnaCBvdXIgaXRlbXMgd2hpY2ggaGFzIGFsbCB0aGUgZXhpc3RpbmcgbG9jYWxTdG9yYWdlIGRhdGEgaW4gYSBmb3JtIEphdmFTY3JpcHQgY2FuIHVuZGVyc3RhbmQuXG4gKiBXZSdsbCBydW4gdGhlIHRhc2tMaSgpIGFnYWluIHRvIHNob3cgZGlzcGxheSBhbGwgdGhlIGV4aXN0aW5nIHN0b3JlZCBpbmZvcm1hdGlvbiBvbiB0aGUgZnJvbnQgZW5kIGV2ZXJ5IHRpbWUgdGhlIGFwcCBpcyBvcGVuZWQuXG4gKi9cblxuZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gIHRhc2tMaShpdGVtKTtcbn0pO1xuXG4vKipcbiAqIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBvdXIgJ2NsZWFyQWxsQnV0dG9uJyBidXR0b24gdGhhdCB3aWxsIGNsZWFyIGFsbCBkYXRhIGZyb20gbG9jYWxTdG9yYWdlIGFuZCByZW1vdmUgZXZlcnkgY2hpbGQgZnJvbSB0aGUgdWwuXG4gKiBXZSdsbCBydW4gdGhlIHBlcmNlbnRhZ2UgZnVuY3Rpb24gYWdhaW4gdG8gdXBkYXRlIHRoZSBmcm9udGVuZC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQWxsVGFza3MoKSB7XG4gIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB3aGlsZSAodWwuZmlyc3RDaGlsZCkge1xuICAgIHVsLnJlbW92ZUNoaWxkKHVsLmZpcnN0Q2hpbGQpO1xuICB9XG4gIGl0ZW1zQXJyYXkgPSBbXTtcbiAgcGVyY2VudGFnZSgpO1xufVxuY2xlYXJBbGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVBbGxUYXNrcyk7XG5cbi8qKlxuICogV2UnbGwgY3JlYXRlIGEgZnVuY3Rpb24gdG8gZ2V0IHRoZSBjdXJyZW50IGRhdGUuXG4gKiBXZSdsbCBkaXNwbGF5IHRoZSBjdXJyZW50IGRhdGUgb24gdGhlIGZyb250ZW5kLlxuICovXG5mdW5jdGlvbiBiZURhdGUoKSB7XG4gIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgY29uc3QgeWVhciA9IGN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCk7XG4gIGNvbnN0IGRhdGUgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XG4gIGNvbnN0IHdlZWtkYXkgPSBuZXcgQXJyYXkoNyk7XG4gIHdlZWtkYXlbMF0gPSAnU3VuZGF5JztcbiAgd2Vla2RheVsxXSA9ICdNb25kYXknO1xuICB3ZWVrZGF5WzJdID0gJ1R1ZXNkYXknO1xuICB3ZWVrZGF5WzNdID0gJ1dlZG5lc2RheSc7XG4gIHdlZWtkYXlbNF0gPSAnVGh1cnNkYXknO1xuICB3ZWVrZGF5WzVdID0gJ0ZyaWRheSc7XG4gIHdlZWtkYXlbNl0gPSAnU2F0dXJkYXknO1xuXG4gIGNvbnN0IG1vbnRocyA9IG5ldyBBcnJheSgxMik7XG4gIG1vbnRoc1swXSA9ICdKYW51YXJ5JztcbiAgbW9udGhzWzFdID0gJ0ZlYnJ1YXJ5JztcbiAgbW9udGhzWzJdID0gJ01hcmNoJztcbiAgbW9udGhzWzNdID0gJ0FwcmlsJztcbiAgbW9udGhzWzRdID0gJ01heSc7XG4gIG1vbnRoc1s1XSA9ICdKdW5lJztcbiAgbW9udGhzWzZdID0gJ0p1bHknO1xuICBtb250aHNbN10gPSAnQXVndXN0JztcbiAgbW9udGhzWzhdID0gJ1NlcHRlbWJlcic7XG4gIG1vbnRoc1s5XSA9ICdPY3RvYmVyJztcbiAgbW9udGhzWzEwXSA9ICdOb3ZlbWJlcic7XG4gIG1vbnRoc1sxMV0gPSAnRGVjZW1iZXInO1xuXG4gIGNvbnN0IGRpc3BsYXlXZWVrZGF5ID0gd2Vla2RheVtjdXJyZW50RGF0ZS5nZXREYXkoKV07XG4gIGNvbnN0IGRpc3BsYXlNb250aCA9IG1vbnRoc1tjdXJyZW50RGF0ZS5nZXRNb250aCgpXTtcbiAgY29uc3QgZm9ybWF0dGVkRGF5ID0gYCR7ZGlzcGxheVdlZWtkYXl9YDtcbiAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGAke2Rpc3BsYXlNb250aH0gJHtkYXRlfSAke3llYXJ9YDtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc3BsYXktZGF5JykuaW5uZXJIVE1MID0gZm9ybWF0dGVkRGF5O1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzcGxheS1kYXRlJykuaW5uZXJIVE1MID0gZm9ybWF0dGVkRGF0ZTtcbn1cbmJlRGF0ZSgpO1xuLyoqXG4gKiBXZSdsbCBjcmVhdGUgYSBmdW5jdGlvbiB0byBnZXQgdGhlIGN1cnJlbnQgdGltZS5cbiAqIFdlJ2xsIGFkZCBhIGV4dHJhICcwJyB0byBudW1iZXJzIGxlc3MgdGhhbiAxMCBzbyAyIGRpZ2V0cyBhcmUgYWx3YXlzIGRpc3BsYXllZCBvbiB0aGUgZnJvbnRlbmQuXG4gKiBXZSdsbCBzZXQgYW4gaW50ZXJ2YWwgYXJvdW5kIHRoZSBmdW5jdGlvbiBzbyB0aGUgdGltZSB1cGRhdGVzIGluIHRoZSBicm93c2VyIGV2ZXJ5IG1pbnV0ZS5cbiAqL1xuZnVuY3Rpb24gYmVDdXJyZW50VGltZSgpIHtcbiAgY29uc3QgZCA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzcGxheS10aW1lJyk7XG4gIGNvbnN0IGggPSAoZC5nZXRIb3VycygpIDwgMTAgPyAnMCcgOiAnJykgKyBkLmdldEhvdXJzKCk7XG4gIGNvbnN0IG0gPSAoZC5nZXRNaW51dGVzKCkgPCAxMCA/ICcwJyA6ICcnKSArIGQuZ2V0TWludXRlcygpO1xuICAvLyBjb25zdCBzID0gKGQuZ2V0U2Vjb25kcygpIDwgMTAgPyAnMCcgOiAnJykgKyBkLmdldFNlY29uZHMoKTtcbiAgeC5pbm5lckhUTUwgPSBgJHtofToke219YDtcbn1cbmJlQ3VycmVudFRpbWUoKTtcblxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gYmVUaW1lSW50ZXJ2YWwxKCkge1xuICBiZUN1cnJlbnRUaW1lKCk7XG59LCAxMDAwKTtcbiJdLCJmaWxlIjoic2NyaXB0cy5qcyJ9
