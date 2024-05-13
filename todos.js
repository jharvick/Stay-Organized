document.addEventListener('DOMContentLoaded', function () {
    const userSelect = document.getElementById('userSelect');
    const todoList = document.getElementById('todoList');

    function fetchUsers() {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select settler';
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

                // Fetch the userId from the URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('userId');

                // If we're navigating back from the todo details page, select the user in the dropdown and fetch their todos
                if (sessionStorage.getItem('navigatingBack') === 'true') {
                    userSelect.value = userId;
                    fetchTodos(userId);
                    sessionStorage.removeItem('navigatingBack'); // Remove the navigatingBack flag
                }
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
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">${todo.category}</h5>
                                <p class="card-text">Deadline: ${todo.deadline}</p>
                                <p class="card-text">${todo.completed ? '&#10004;' : '&#10008;'}</p>
                                <div>
                                    <a href="todo_details.html?userId=${userId}&id=${todo.id}" class="card-link">See Details</a>
                                <div>
                            </div>
                        </div>
                    `;
                    todoList.appendChild(card);
            
                    // if (!todo.completed) {
                    //     const button = document.createElement('button');
                    //     button.classList.add('btn', 'btn-primary');
                    //     button.textContent = 'Complete ToDo';
                    //     button.addEventListener('click', () => completeTodo(todo.id));
                    //     card.querySelector('.card-body').appendChild(button);
                    // }
                });
            })
            .catch(error => console.error(error));
    }

    // function completeTodo(todoId) {
    //     fetch(`http://localhost:8083/api/todos/${todoId}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ completed: true })
    //     })
    //     .then(response => {
    //         if (response.ok) {
    //             const userId = userSelect.value;
    //             fetchTodos(userId);
    //         } else {
    //             console.error('Failed to complete ToDo');
    //         }
    //     })
    //     .catch(error => console.error(error));
    // }

    fetchUsers();
});