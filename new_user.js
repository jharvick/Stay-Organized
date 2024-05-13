document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

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
            .then(response => response.json())
            .then(response => {
                if (response.available) {
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
                        // Show the success message
                        successMessage.style.display = 'block';
                        registerForm.classList.add('dimmed'); // Add dimmed class to form

                        // Optionally, reset the form and hide the success message after a delay
                        setTimeout(() => {
                            registerForm.reset();
                            successMessage.style.display = 'none';
                            registerForm.classList.remove('dimmed'); // Remove dimmed class from form
                        }, 5000); // Adjust the delay as needed (in milliseconds)
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