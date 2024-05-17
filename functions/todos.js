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

                // If we're navigating back from the todo details page we automatically populate the user select
                if (sessionStorage.getItem('navigatingBack') === 'true') { // Check if the navigatingBack flag is set to true
                    userSelect.value = userId; // Set the value of the user select to the userId from the URL parameters
                    fetchTodos(userId); // Fetch the todos for the selected user
                    sessionStorage.removeItem('navigatingBack'); // Remove the navigatingBack flag from sessionStorage
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
                todos.forEach((todo, index) => {
                    setTimeout(() => {
                        const card = document.createElement('div');
                        card.classList.add('col-md-4', 'mb-4', 'fade-in');
                        card.innerHTML = `
                            <div class="card text-center">
                                <div class="card-body">
                                    <h5 class="card-title">${todo.category}</h5>
                                    <p class="card-text">Deadline: ${todo.deadline}</p>
                                    <p class="card-text">${todo.completed ? '<span style="font-size: 30px;">&#10004;</span>' : '<span style="font-size: 30px; color: red;">&#10008;</span>'}</p>
                                    <div>
                                        <a href="todo_details.html?userId=${userId}&id=${todo.id}" class="card-link" style="color: #39ff14; text-decoration: underline;">See Details</a>
                                    <div>
                                </div>
                            </div>
                        `;
                        todoList.appendChild(card);
                    }, index * 100); // Delay each card by 100ms
                });
            })
            .catch(error => console.error(error));
    }
    fetchUsers();
});

