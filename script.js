document.getElementById('floatingAddTaskBtn').addEventListener('click', function() {
    document.getElementById('addTaskDialog').style.display = 'block';
    document.getElementById('taskName').focus();
});

document.getElementById('addTaskCancelBtn').addEventListener('click', function() {
    document.getElementById('addTaskDialog').style.display = 'none';
});

document.getElementById('taskName').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('taskTime').focus();
    }
});

document.getElementById('taskTime').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTaskFromDialog();
    }
});

document.getElementById('addTaskConfirmBtn').addEventListener('click', addTaskFromDialog);

function addTaskFromDialog() {
    let taskName = document.getElementById('taskName').value;
    let taskTime = document.getElementById('taskTime').value;

    if (taskName && taskTime) {
        let taskId = Date.now();
        let initiatedTime = new Date().toLocaleTimeString();
        addTask(taskId, taskName, initiatedTime, taskTime);
        document.getElementById('addTaskDialog').style.display = 'none';
        document.getElementById('taskName').value = '';
        document.getElementById('taskTime').value = '';
    } else {
        alert('Please enter a valid task and time.');
    }
}

function addTask(taskId, taskName, initiatedTime, taskTime) {
    let li = document.createElement('li');
    li.setAttribute('data-id', taskId);
    li.innerHTML = `
        <div class="task-details">
            <h2 class="task-title">${taskName}</h2>
            <span class="task-time">Initiated: ${initiatedTime} | Est: ${taskTime} mins</span>
        </div>
        <div class="actions">
            <button class="complete">✔️</button>
            <button class="remove">❌</button>
        </div>
    `;

    li.querySelector('.complete').onclick = function() {
        completeTask(taskId, taskName, initiatedTime);
    };

    li.querySelector('.remove').onclick = function() {
        this.parentElement.parentElement.remove();
    };

    let initiatedList = document.getElementById('initiatedList');
    li.querySelector('.task-details').prepend(getTaskSerialNumberElement(initiatedList.childElementCount + 1));
    initiatedList.appendChild(li);
    updateTaskSerialNumbers(initiatedList);
}

function completeTask(taskId, taskName, initiatedTime) {
    let completedTime = new Date().toLocaleTimeString();
    let li = document.createElement('li');
    li.innerHTML = `
        <div class="task-details">
            <h2 class="task-title">${taskName}</h2>
            <span class="task-time">Initiated: ${initiatedTime} | Completed at: ${completedTime}</span>
        </div>
        <div class="actions">
            <button class="delete">🗑️</button>
        </div>
    `;

    li.querySelector('.delete').onclick = function() {
        this.parentElement.parentElement.remove();
    };

    let completedList = document.getElementById('completedList');
    li.querySelector('.task-details').prepend(getTaskSerialNumberElement(completedList.childElementCount + 1));
    completedList.appendChild(li);
    updateTaskSerialNumbers(completedList);
    document.querySelector(`[data-id="${taskId}"]`).remove();
    updateTaskSerialNumbers(document.getElementById('initiatedList'));
}

document.getElementById('searchBtn').addEventListener('click', searchTasks);
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchTasks();
    }
});

function searchTasks() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    let tasks = document.querySelectorAll('#initiatedList li, #completedList li');

    tasks.forEach(task => {
        let taskName = task.querySelector('.task-title').innerText.toLowerCase();
        if (taskName.includes(searchValue)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function getTaskSerialNumberElement(number) {
    let serialNumberElement = document.createElement('span');
    serialNumberElement.textContent = `${number}. `;
    serialNumberElement.style.fontWeight = 'bold';
    return serialNumberElement;
}

function updateTaskSerialNumbers(list) {
    Array.from(list.children).forEach((li, index) => {
        li.querySelector('.task-details span').textContent = `${index + 1}. `;
    });
}
