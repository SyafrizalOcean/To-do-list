let currentPage = 1;
let tasksPerPage = 10; // 10 tugas per halaman
let tasks = [];

document.getElementById("add-task-btn").addEventListener("click", function() {
    addTask();
    renderTasks();
});

document.getElementById("search-task").addEventListener("input", function() {
    renderTasks();
});

document.getElementById("prev-btn").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        renderTasks();
    }
});

document.getElementById("next-btn").addEventListener("click", function() {
    if (currentPage * tasksPerPage < tasks.length) {
        currentPage++;
        renderTasks();
    }
});

function addTask() {
    const taskInput = document.getElementById("new-task");
    if (taskInput.value.trim() !== "") {
        tasks.push({
            name: taskInput.value,
            completed: false
        });
        taskInput.value = "";
    }
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const searchValue = document.getElementById("search-task").value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchValue));

    const start = (currentPage - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    const paginatedTasks = filteredTasks.slice(start, end);

    paginatedTasks.forEach((task, index) => {
        const tr = document.createElement("tr");

        // Number column (auto increment)
        const tdNo = document.createElement("td");
        tdNo.textContent = start + index + 1;
        tr.appendChild(tdNo);

        // Task name column
        const tdTask = document.createElement("td");
        tdTask.textContent = task.name;
        tr.appendChild(tdTask);

        // Status column (checkbox)
        const tdStatus = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
        });
        tdStatus.appendChild(checkbox);
        tr.appendChild(tdStatus);

        // Action column (Edit & Delete)
        const tdAction = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = function() {
            editTask(tdTask, editBtn, task);
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function() {
            tasks.splice(tasks.indexOf(task), 1);
            renderTasks();
        };
        tdAction.appendChild(editBtn);
        tdAction.appendChild(deleteBtn);
        tr.appendChild(tdAction);

        taskList.appendChild(tr);
    });

    // Update task count
    document.getElementById("task-count").textContent = `Total items: ${filteredTasks.length}`;

    // Update pagination controls
    document.getElementById("page-number").textContent = currentPage;
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage * tasksPerPage >= filteredTasks.length;
}

function editTask(tdTask, editBtn, task) {
    const originalTask = tdTask.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalTask;

    tdTask.textContent = "";
    tdTask.appendChild(input);

    editBtn.textContent = "Save";
    editBtn.onclick = function() {
        if (input.value.trim() !== "") {
            task.name = input.value;
            tdTask.textContent = task.name;
            editBtn.textContent = "Edit";
            editBtn.onclick = function() {
                editTask(tdTask, editBtn, task);
            };
        }
    };
}
