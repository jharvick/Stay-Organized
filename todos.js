document.addEventListener('DOMContentLoaded', function () {
    const userSelect = document.getElementById('userSelect');
    const todoList = document.getElementById('todoList');

    function fetchUsers() {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select user';
        userSelect.appendChild(defaultOption);

        fetch('http://localhost:8083/api/users')
            .then(response => response.json())
            .then(users => {
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.name;
                    userSelect.appendChild(option);
                });
            })
            .catch(error => console.error(error));
    }

    userSelect.addEventListener('change', function () {
        const userId = userSelect.value;
        fetchTodos(userId);
    });

    function fetchTodos(userId) {
        fetch(`http://localhost:8083/api/todos/byuser/${userId}`)
            .then(response => response.json())
            .then(todos => {
                todoList.innerHTML = '';
                todos.forEach(todo => {
                    const card = document.createElement('div');
                    card.classList.add('col-md-4', 'mb-4');
                    card.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${todo.category}</h5>
                                <p class="card-text">${todo.description}</p>
                                <p class="card-text">Deadline: ${todo.deadline}</p>
                                <p class="card-text">Priority: ${todo.priority}</p>
                                <p class="card-text">${todo.completed ? '&#10004;' : '&#10008;'}</p>
                            </div>
                        </div>
                    `;
                    todoList.appendChild(card);
                });
            })
            .catch(error => console.error(error));
    }

    fetchUsers();
});