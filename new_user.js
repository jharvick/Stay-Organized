document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const username = usernameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            passwordError.textContent = 'Passwords do not match';
            return;
        } else {
            passwordError.textContent = '';
        }

        fetch(`http://localhost:8083/api/username_available/${username}`)
            .then(response => response.json()) // parse the response as JSON
            .then(response => {
                if (response.available) { // check the 'available' property of the response
                    usernameError.textContent = '';
                    const userData = {
                        name: name,
                        username: username,
                        password: password
                    };

                    fetch('http://localhost:8083/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            if (response.status === 403) {
                                throw new Error('Username is already in use');
                            } else {
                                throw new Error('Failed to register user');
                            }
                        }
                        return response.json();
                    })
                    .then(user => {
                        alert('User registered successfully');
                        registerForm.reset();
                    })
                    .catch(error => {
                        usernameError.textContent = error.message;
                    });
                } else {
                    usernameError.textContent = 'Username is not available';
                }
            })
            .catch(error => {
                usernameError.textContent = error.message;
            });
    });
});