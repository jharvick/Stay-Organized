document.addEventListener('DOMContentLoaded', function () {
    const todoDetails = document.getElementById('todoDetails');
    const backButton = document.getElementById('goBackBtn');

    function fetchTodoDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const todoId = urlParams.get('id');

        if (!todoId) {
            console.error('Todo ID not provided.');
            return;
        }

        fetch(`http://localhost:8083/api/todos/${todoId}`)
            .then(response => response.json())
            .then(todo => {
                todoDetails.innerHTML = '';

                const card = document.createElement('div');
                card.classList.add('card', 'col-md-4', 'mb-4');
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${todo.category}</h5>
                        <p class="card-text">${todo.description}</p>
                        <p class="card-text">Deadline: ${todo.deadline}</p>
                        <p class="card-text">Priority: ${todo.priority}</p>
                        <p class="card-text">${todo.completed ? '<span style="font-size: 30px;">&#10004;</span>' : '<span style="font-size: 30px; color: red;">&#10008;</span>'}</p>
                    </div>
                `;

                if (!todo.completed) {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-primary');
                    button.textContent = 'Complete ToDo';
                    button.addEventListener('click', () => completeTodo(todoId));
                    card.querySelector('.card-body').appendChild(button);
                }


                todoDetails.appendChild(card);
            })
            .catch(error => console.error(error));
    }

    function completeTodo(todoId) { 
        fetch(`http://localhost:8083/api/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        })
        .then(response => {
            if (response.ok) {
                fetchTodoDetails();
            } else {
                console.error('Failed to complete ToDo');
            }
        })
        .catch(error => console.error(error));
    }

    // Event listener for back button
    backButton.addEventListener('click', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        console.log("User ID:", userId); // Log the userId
        sessionStorage.setItem('navigatingBack', 'true'); // Set the navigatingBack flag
        window.location.href = `todos.html?userId=${userId}`; // Navigate back to todos.html with userId
    });

    fetchTodoDetails();
});