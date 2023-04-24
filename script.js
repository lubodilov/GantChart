const todoList = document.getElementById('todo-list');
		const wbsInput = document.getElementById('wbs-input');
		const taskInput = document.getElementById('task-input');
		//const durationInput = document.getElementById('duration-input');
		const startInput = document.getElementById('start-input');
		const finishInput = document.getElementById('finish-input');
		const addTodoButton = document.getElementById('add-todo');

    //let selectedTaskIndex = null;
		let todos = [];
    let taskvisMap = new Map();


		function addTodo() {

      const startDate = new Date(startInput.value);
      const dayNumber = getDayOfYear(startDate);
      const finishDate = new Date(finishInput.value);
      const durationInMilliseconds = finishDate - startDate;
      const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));

      const todo = {
          wbs: wbsInput.value,
          taskName: taskInput.value,
          duration: durationInDays,
          start: startInput.value,
          finish: finishInput.value
      };
  
      todos.push(todo);
  
      // Add the taskduration row here
      const taskduration = document.querySelector('.taskduration');
      const taskdurationRow = document.createElement('div');
      taskdurationRow.style.height = '4.14rem';
      taskduration.appendChild(taskdurationRow);
  
      // Create the taskvis div and assign the event listeners for dragging
      const taskvis = document.createElement('div');
      taskvis.textContent = ``;
      taskvis.style.backgroundColor = 'black';
      taskvis.style.height = '70%';
      taskvis.style.width = `${3.645 * durationInDays / 7}rem`; 
      taskvis.style.position = 'relative';
      taskvis.style.left = `${(dayNumber) * 3.645 / 7}rem`;
      taskvis.style.cursor = 'pointer';
      const leftTriangle = createTriangle('left');
      const rightTriangle = createTriangle('right');
      taskvis.appendChild(leftTriangle);
      taskvis.appendChild(rightTriangle);
      taskdurationRow.appendChild(taskvis);
  
      taskvis.addEventListener('mousedown', handleMouseDown);
      taskvis.addEventListener('mousemove', handleMouseMove);
      taskvis.addEventListener('mouseup', handleMouseUp);

      taskvisMap.set(todos.length - 1, {
      taskvis: taskvis,
      taskdurationRow: taskdurationRow
      });


			renderTodos();
			resetInputs();

		}

    function createTriangle(direction) {
      const triangle = document.createElement('div');
      triangle.style.width = '0';
      triangle.style.height = '0';
      triangle.style.borderStyle = 'solid';
      triangle.style.borderWidth = direction === 'left' ? '1.47rem 0.87rem 1.47rem 0' : '1.47rem 0 1.47rem 0.87rem';
      triangle.style.borderColor = direction === 'left' ? 'transparent white transparent transparent' : 'transparent transparent transparent white';
      triangle.style.position = 'absolute';
      triangle.style.top = '50%';
      triangle.style.transform = 'translateY(-50%)';
      triangle.style[direction] = '0';
      return triangle;
    }
    

    let isMouseDown = false;
    let offsetX;
    let currentDraggable;

    function handleMouseDown(event) {
      isMouseDown = true;
      offsetX = event.clientX - event.target.getBoundingClientRect().left;
      currentDraggable = event.target;
      //event.target.setPointerCapture(event.pointerId);
    }
  
    function handleMouseUp(event) {
      if (isMouseDown && currentDraggable) {
        const containerRect = currentDraggable.parentElement.getBoundingClientRect();
        const draggableRect = currentDraggable.getBoundingClientRect();
        const newDistancePx = draggableRect.left - containerRect.left;
        const newDistanceRem = pxToRem(newDistancePx);
    
        const distDays = newDistanceRem / (3.645 / 7);
    
        // Find the index of the task corresponding to the currentDraggable element
        const taskIndex = Array.from(taskvisMap.keys()).find(
          (key) => taskvisMap.get(key).taskvis === currentDraggable
        );
    
        if (taskIndex === undefined) {
          console.error('Unable to find task index for the currentDraggable element:', currentDraggable);
          return;
        }
    
        const task = todos[taskIndex];
        const newStartDate = new Date(task.start);
        const dayNumber = getDayOfYear(newStartDate);
        const dist = (dayNumber + 0);
        newStartDate.setDate(newStartDate.getDate() - (dist - distDays));
    
        const newFinishDate = new Date(task.finish);
        newFinishDate.setDate(newFinishDate.getDate() - (dist - distDays));
        
        // Check if the task is a subtask
        if (task.wbs.includes('.')) {
          const parentWbs = task.wbs.split('.').slice(0, -1).join('.');
          const parentTask = todos.find((t) => t.wbs === parentWbs);
    
          if (newStartDate < new Date(parentTask.start)) {
            alert("The start date of a subtask can't be before the start of its parent task.");
            //parentTask.start = newStartDate.toISOString().split('T')[0];
            //parentTask.finish = newFinishDate.toISOString().split('T')[0];
            isMouseDown = false;
            currentDraggable = null;
            return;
          }
        }
    
        task.start = newStartDate.toISOString().split('T')[0];
        task.finish = newFinishDate.toISOString().split('T')[0];
    
        // Re-render the table with the updated task data
        renderTodos();
    
        isMouseDown = false;
        currentDraggable = null;
      }
    }  

    function pxToRem(pixels) {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return pixels / rootFontSize;
    }

    function handleMouseMove(event) {
      if (isMouseDown && currentDraggable) {
          const containerRect = currentDraggable.parentElement.parentElement.getBoundingClientRect();
          let newX = event.clientX - offsetX;
  
          // Keep the div inside the container horizontally
          newX = Math.max(newX, containerRect.left);
          newX = Math.min(newX, containerRect.right - currentDraggable.clientWidth);
  
          currentDraggable.style.left = newX - containerRect.left + 'px';
      }
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

				const startCell = document.createElement('td');
				startCell.innerText = todo.start;
				row.appendChild(startCell);

				const finishCell = document.createElement('td');
				finishCell.innerText = todo.finish;
				row.appendChild(finishCell);

        const durationCell = document.createElement('td');
				durationCell.innerText = todo.duration;
				row.appendChild(durationCell);

				const actionCell = document.createElement('td');

				const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
          const elementsToRemove = taskvisMap.get(index);
          if (elementsToRemove) {
            elementsToRemove.taskvis.remove();
            elementsToRemove.taskdurationRow.remove();
            taskvisMap.delete(index);
          }

          // Update the todos array and re-render
          todos.splice(index, 1);
          renderTodos();
        });
        actionCell.appendChild(deleteButton);

				row.appendChild(actionCell);

        row.addEventListener('click', () => {
          // Deselect the previously selected task if any
          if (selectedTaskIndex !== null) {
            todoList.children[selectedTaskIndex].classList.remove('selected');
          }
          if (todo.wbs.includes('.')) {
            // Toggle the selection of the current subtask
            if (selectedSubtasks.includes(index)) {
              selectedSubtasks = selectedSubtasks.filter((i) => i !== index);
              row.classList.remove('subselected');
            } else {
              selectedSubtasks.push(index);
              row.classList.add('subselected');
            }
        
            // Limit the number of selected subtasks to 2
            if (selectedSubtasks.length > 2) {
              const firstSelectedIndex = selectedSubtasks.shift();
              todoList.children[firstSelectedIndex].classList.remove('subselected');
            }
          }
    
          // Select the current task and highlight the row
          selectedTaskIndex = index;
          row.classList.add('selected');
        });
				todoList.appendChild(row);
			});
		}
		function resetInputs() {
			wbsInput.value = '';
			taskInput.value = '';
			//durationInput.value = '';
			startInput.value = '';
			finishInput.value = '';
		}

		addTodoButton.addEventListener('click', addTodo);

    const addSubtaskButton = document.getElementById('add-subtask');
    addSubtaskButton.addEventListener('click', addSubtask);

    let selectedTaskIndex = null;

    function addSubtaskDurationRow(parentTaskDurationRow, subtask) {
      const subtaskDurationRow = document.createElement('div');
      subtaskDurationRow.style.height = '4.14rem';
      parentTaskDurationRow.parentElement.insertBefore(subtaskDurationRow, parentTaskDurationRow.nextSibling);
    
      const startDate = new Date(subtask.start);
      const dayNumber = getDayOfYear(startDate);
      const finishDate = new Date(subtask.finish);
      const durationInMilliseconds = finishDate - startDate;
      const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));

      const subtaskVis = document.createElement('div');
      subtaskVis.textContent = '';
      subtaskVis.style.backgroundColor = 'blue';
      subtaskVis.style.height = '70%';
      subtaskVis.style.width = `${3.645 * durationInDays / 7}rem`; // Calculate the width based on the subtask duration
      subtaskVis.style.position = 'relative';
      subtaskVis.style.left = `${(dayNumber) * 3.645 / 7}rem`;
      subtaskVis.style.cursor = 'pointer';
      subtaskDurationRow.appendChild(subtaskVis);
    
      subtaskVis.addEventListener('mousedown', handleMouseDown);
      subtaskVis.addEventListener('mousemove', handleMouseMove);
      subtaskVis.addEventListener('mouseup', handleMouseUp);
    
      // Return the subtask's taskvis and taskdurationRow
      return {
        taskvis: subtaskVis,
        taskdurationRow: subtaskDurationRow,
      };
    }
    
    const subStartInput = document.getElementById('sub-start-input');
    const subFinishInput = document.getElementById('sub-finish-input');
    const subTaskInput = document.getElementById('subtask-input');

    function addSubtask() {
      if (selectedTaskIndex === null) {
        alert('Please select a task before adding a subtask.');
        return;
      }
    
      const parentTask = todos[selectedTaskIndex];
      const parentTaskStartDate = new Date(parentTask.start);
      const subTaskStartDate = new Date(subStartInput.value);
    
      if (subTaskStartDate < parentTaskStartDate) {
        alert("Subtask start date cannot be before its parent task's start date.");
        return;
      }

      const parentTaskFinishDate = new Date(parentTask.finish);
      const subTaskFinishDate = new Date(subFinishInput.value);

      if (subTaskFinishDate > parentTaskFinishDate) {
        alert("Subtask finish date cannot be after its parent task's finish date.");
        return;
      }


      const taskVisData = taskvisMap.get(selectedTaskIndex);
    
      if (!taskVisData) {
        console.error('Unable to find task duration row for the selected task index:', selectedTaskIndex);
        return;
      }
    
      const parentTaskDurationRow = taskVisData.taskdurationRow;
      const durationInMilliseconds = subTaskFinishDate - subTaskStartDate;
      const durationInDays = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
    
      const subtask = {
        wbs: parentTask.wbs + '.1', 
        taskName: subTaskInput.value, 
        duration: durationInDays, 
        start: subStartInput.value, 
        finish: subFinishInput.value 
      };
    
      // Add the subtask to the todos array
      todos.splice(selectedTaskIndex + 1, 0, subtask);
    
      // Add the subtask duration row
      const subtaskVisData = addSubtaskDurationRow(parentTaskDurationRow, subtask);
    
      // Update the taskvisMap for the newly added subtask and subsequent tasks
      for (let i = selectedTaskIndex + 1; i < todos.length; i++) {
        const oldTaskVisData = taskvisMap.get(i);
        if (oldTaskVisData) {
          taskvisMap.set(i + 1, oldTaskVisData);
        }
      }
    
      // Add the subtask's taskvis data to the taskvisMap
      taskvisMap.set(selectedTaskIndex + 1, subtaskVisData);
    
      // Re-render the table with the updated task data
      renderTodos();
    }

    let selectedSubtasks = [];

    function mergeSubtasks() {
      if (selectedSubtasks.length !== 2) {
        alert('Please select exactly two subtasks to merge.');
        return;
      }
    
      const firstSubtask = todos[selectedSubtasks[0]];
      const secondSubtask = todos[selectedSubtasks[1]];
    
      // Update the start date of the second subtask
      const newStartDate = new Date(firstSubtask.finish);
      newStartDate.setDate(newStartDate.getDate() + 1);
      secondSubtask.start = newStartDate.toISOString().split('T')[0];

      const newFinishDate = new Date(secondSubtask.start);
      newFinishDate.setDate(newFinishDate.getDate() + secondSubtask.duration - 1);
      secondSubtask.finish = newFinishDate.toISOString().split('T')[0];
    
      const secondSubtaskVisData = taskvisMap.get(selectedSubtasks[1]);
      if (secondSubtaskVisData) {
        const dayNumber = getDayOfYear(new Date(secondSubtask.start));
        secondSubtaskVisData.taskvis.style.left = `${(dayNumber) * 3.645 / 7}rem`;
      } else {
        console.error('Unable to find taskvis data for the second subtask index:', selectedSubtasks[1]);
      }
      
      // Re-render the table with the updated task data
      renderTodos();
    
      // Deselect the subtasks and clear the selectedSubtasks array
      selectedSubtasks.forEach((index) => {
        todoList.children[index].classList.remove('selected');
      });
      selectedSubtasks = [];
    }

    const mergeButton = document.getElementById('mergeButton');
    mergeButton.addEventListener('click', mergeSubtasks);

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

    //monthDiv.width = `${16.45}rem`;
    monthDiv.textContent = month;

    monthsDiv.appendChild(monthDiv);
});

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const weekNumber = Math.ceil((dayOffset + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber;
}

function getDayOfYear(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOffset = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
  const dayNumber = Math.floor(dayOffset) + 1;
  return dayNumber;
}

const date = new Date();

