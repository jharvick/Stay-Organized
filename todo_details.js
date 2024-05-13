document.addEventListener('DOMContentLoaded', function () {
    const todoDetails = document.getElementById('todoDetails');
    const backButton = document.getElementById('goBackBtn');

    // Function to fetch and display ToDo details
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
                // Clear existing content
                todoDetails.innerHTML = '';

                // Create card for ToDo details
                const card = document.createElement('div');
                card.classList.add('card', 'col-md-4', 'mb-4');
                card.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${todo.category}</h5>
                        <p class="card-text">${todo.description}</p>
                        <p class="card-text">Deadline: ${todo.deadline}</p>
                        <p class="card-text">Priority: ${todo.priority}</p>
                        <p class="card-text">${todo.completed ? '&#10004;' : '&#10008;'}</p>
                    </div>
                `;

                // Add complete button if ToDo is not completed
                if (!todo.completed) {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-primary');
                    button.textContent = 'Complete ToDo';
                    button.addEventListener('click', () => completeTodo(todoId)); // Pass todoId here
                    card.querySelector('.card-body').appendChild(button);
                }

                // Append card to the todoDetails container
                todoDetails.appendChild(card);
            })
            .catch(error => console.error(error));
    }

    // Function to mark ToDo as completed
    function completeTodo(todoId) { // Accept todoId as a parameter
        fetch(`http://localhost:8083/api/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: true })
        })
        .then(response => {
            if (response.ok) {
                fetchTodoDetails(); // Refresh details after completion
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


    // Initial call to fetch and display ToDo details
    fetchTodoDetails();
});

