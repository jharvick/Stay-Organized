document.addEventListener('DOMContentLoaded', function () {
    const userSelect = document.getElementById('userSelect');
    const categorySelect = document.getElementById('categorySelect');
    const newTodoForm = document.getElementById('newTodoForm');

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

    function fetchCategories() {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select category';
        categorySelect.appendChild(defaultOption);

        fetch('http://localhost:8083/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error(error));
    }

    newTodoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const todoData = {
            userid: parseInt(userSelect.value),
            category: categorySelect.value,
            description: newTodoForm.querySelector('#description').value,
            deadline: newTodoForm.querySelector('#deadline').value,
            priority: newTodoForm.querySelector('#priority').value,
            completed: false
        };

        fetch('http://localhost:8083/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        })
        .then(response => {
            if (response.ok) {
                // Dim the form
                newTodoForm.classList.add('dimmed');
        
                // Show the success message
                const successMessage = document.getElementById('successMessage');
                successMessage.style.display = 'block';
        
                // Optionally, you can reset the form after a delay
                setTimeout(() => {
                    newTodoForm.reset();
                    successMessage.style.display = 'none';
                    newTodoForm.classList.remove('dimmed');
                }, 5000); // Adjust the delay as needed (in milliseconds)
            } else {
                alert('Failed to create todo');
            }
        })        
             
        .catch(error => console.error(error));
    });


    fetchUsers();
    fetchCategories();
});