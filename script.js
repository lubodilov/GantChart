const todoList = document.getElementById('todo-list');
		const wbsInput = document.getElementById('wbs-input');
		const taskInput = document.getElementById('task-input');
		const durationInput = document.getElementById('duration-input');
		const startInput = document.getElementById('start-input');
		const finishInput = document.getElementById('finish-input');
		const addTodoButton = document.getElementById('add-todo');

		let todos = [];

		function addTodo() {
			const todo = {
				wbs: wbsInput.value,
				taskName: taskInput.value,
				duration: durationInput.value,
				start: startInput.value,
				finish: finishInput.value
			};

			todos.push(todo);

      const taskduration = document.querySelector('.taskduration');
      const taskdurationRow = document.createElement('div');
      taskdurationRow.textContent = `1`;
      taskdurationRow.dataset.index = todos.length - 1; // Add a custom data attribute
      taskduration.appendChild(taskdurationRow);

			renderTodos();
			resetInputs();

		}

		function renderTodos() {
			todoList.innerHTML = '';

			todos.forEach((todo, index) => {
				const row = document.createElement('tr');

				const wbsCell = document.createElement('td');
				wbsCell.innerText = todo.wbs;
				row.appendChild(wbsCell);

				const taskCell = document.createElement('td');
				taskCell.innerText = todo.taskName;
				row.appendChild(taskCell);

				const durationCell = document.createElement('td');
				durationCell.innerText = todo.duration;
				row.appendChild(durationCell);

				const startCell = document.createElement('td');
				startCell.innerText = todo.start;
				row.appendChild(startCell);

				const finishCell = document.createElement('td');
				finishCell.innerText = todo.finish;
				row.appendChild(finishCell);

				const actionCell = document.createElement('td');

				const deleteButton = document.createElement('button');
				deleteButton.innerText = 'Delete';
				deleteButton.addEventListener('click', () => {
					todos.splice(index, 1);
          const taskdurationRowToDelete = document.querySelector(`.taskduration div[data-index="${index}"]`);
          if (taskdurationRowToDelete) {
              taskdurationRowToDelete.remove();
          }
					renderTodos();
          
				});
				actionCell.appendChild(deleteButton);

				row.appendChild(actionCell);

				todoList.appendChild(row);
			});
		}

		function resetInputs() {
			wbsInput.value = '';
			taskInput.value = '';
			durationInput.value = '';
			startInput.value = '';
			finishInput.value = '';
		}

		addTodoButton.addEventListener('click', addTodo);


    const weeksDiv = document.querySelector('.weeks');

for (let i = 1; i <= 52; i++) {
   
    const weekDiv = document.createElement('div');
    
    weekDiv.id = `w${i}`;

    weekDiv.setAttribute('name', `w${i}`);
    
    weekDiv.textContent = `w${i}`;

    weeksDiv.appendChild(weekDiv);
}

const monthsDiv = document.querySelector('.months');

// Array of month names
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

monthNames.forEach((month, index) => {

    const monthDiv = document.createElement('div');
    
    monthDiv.id = `month${index + 1}`;
    monthDiv.setAttribute('name', month);
    
    monthDiv.textContent = month;

    monthsDiv.appendChild(monthDiv);
});

const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();


  for(let i = 0; i < n; i++) {
  const child = document.createElement('div');
  child.classList.add('child');
  parent.appendChild(child);
}
  
  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
