let tasks = [];
let currentPage = 1;
let tasksPerPage = 10;
let editingIndex = -1; // Menyimpan index task yang sedang di-edit

// Fungsi utama untuk load data dari localStorage saat halaman dibuka
window.onload = function() {
    loadFromLocalStorage();
    renderTasks();
};

document.getElementById("add-task-btn").addEventListener("click", addTask);
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
document.getElementById("save-btn").addEventListener("click", saveToFile);
document.getElementById("load-btn").addEventListener("click", loadFromFile);
document.getElementById("file-input").addEventListener("change", handleFileSelect);
document.getElementById("search-task").addEventListener("input", searchTasks);

function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskValue = taskInput.value.trim();

    if (taskValue !== "") {
        if (editingIndex === -1) {
            const newTask = {
                name: taskValue,
                completed: false
            };
            tasks.push(newTask);
        } else {
            tasks[editingIndex].name = taskValue;
            editingIndex = -1; // Reset edit index setelah selesai mengedit
        }
        taskInput.value = "";
        saveToLocalStorage(); // Simpan ke localStorage setelah task ditambahkan
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    const start = (currentPage - 1) * tasksPerPage;
    const end = start + tasksPerPage;
    const paginatedTasks = tasks.slice(start, end);

    paginatedTasks.forEach((task, index) => {
        const tr = document.createElement("tr");

        // Nomor otomatis
        const tdNo = document.createElement("td");
        tdNo.textContent = start + index + 1;
        tr.appendChild(tdNo);

        // Nama task
        const tdTask = document.createElement("td");
        tdTask.textContent = task.name;
        tr.appendChild(tdTask);

        // Status task (checkbox)
        const tdStatus = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Event ketika checkbox diubah
        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                tasks.splice(start + index, 1); // Menghapus task saat di ceklis
                saveToLocalStorage(); // Simpan perubahan ke localStorage
                renderTasks(); // Render ulang task list
            } else {
                task.completed = checkbox.checked;
                saveToLocalStorage(); // Simpan perubahan ke localStorage
            }
        });
        tdStatus.appendChild(checkbox);
        tr.appendChild(tdStatus);

        // Tombol aksi (edit dan hapus)
        const tdAction = document.createElement("td");

        // Tombol Edit
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", function() {
            document.getElementById("new-task").value = task.name;
            editingIndex = start + index; // Simpan index untuk diedit
        });
        tdAction.appendChild(editBtn);

        // Tombol Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", function() {
            tasks.splice(start + index, 1);
            saveToLocalStorage(); // Simpan perubahan ke localStorage
            renderTasks();
        });
        tdAction.appendChild(deleteBtn);

        tr.appendChild(tdAction);
        taskList.appendChild(tr);
    });

    // Update jumlah item
    document.getElementById("task-count").textContent = `Total items: ${tasks.length}`;

    // Update pagination
    document.getElementById("page-number").textContent = currentPage;
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage * tasksPerPage >= tasks.length;
}

function searchTasks() {
    const searchInput = document.getElementById("search-task").value.toLowerCase();
    tasks = tasks.filter(task => task.name.toLowerCase().includes(searchInput));
    renderTasks();
}

// Simpan ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load dari localStorage
function loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Simpan ke file JSON
function saveToFile() {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Muat dari file JSON
function loadFromFile() {
    document.getElementById('file-input').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            tasks = JSON.parse(e.target.result);
            saveToLocalStorage(); // Simpan ke localStorage setelah load dari file
            renderTasks();
        };
        reader.readAsText(file);
    }
}
