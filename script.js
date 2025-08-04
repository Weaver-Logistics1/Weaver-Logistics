// Generate a 16-character unique code
function generateLoginCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Form validation
function validateForm(name, email, phone) {
    let isValid = true;
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('phoneError').textContent = '';

    if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        isValid = false;
    }
    if (!/^\+?\d{10,}$/.test(phone)) {
        document.getElementById('phoneError').textContent = 'Invalid phone number (minimum 10 digits)';
        isValid = false;
    }
    return isValid;
}

// Session validity check
function checkSessionValidity() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (!userData) {
        alert('Session expired or not found. Please log in again.');
        window.location.href = 'index.html';
        return;
    }

    const currentTime = Date.now();
    if (currentTime > userData.expiryTime) {
        sessionStorage.removeItem('userData');
        alert('Session expired. Please log in again.');
        window.location.href = 'index.html';
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const codeForm = document.getElementById('codeForm');
    const userInfoDiv = document.getElementById('userInfo');

    // Form submission for user data
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!validateForm(name, email, phone)) return;

            document.getElementById('submitBtn').disabled = true;
            document.getElementById('loader').style.display = 'block';

            const loginCode = generateLoginCode(); //  generate code here
            const expiryTime = Date.now() + (15 * 60 * 1000); // 15 minutes

            const userData = { name, email, phone, loginCode, expiryTime };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            // Show code and start countdown
            document.getElementById('codeDisplay').style.display = 'block';
            document.getElementById('loginCode').textContent = loginCode;
            document.getElementById('userForm').style.display = 'none';

            let countdown = 5;
            document.getElementById('countdown').textContent = countdown;
            const timer = setInterval(() => {
                countdown--;
                document.getElementById('countdown').textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(timer);
                    window.location.href = 'profile.html';
                }
            }, 1000);

            // Copy code button
            document.getElementById('copyCodeBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(loginCode).then(() => {
                    alert('Code copied to clipboard!');
                });
            });
        });
    }

    // Handle code verification
    if (codeForm) {
        codeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredCode = document.getElementById('codeInput').value.trim().toUpperCase();
            const userData = JSON.parse(sessionStorage.getItem('userData'));

            document.getElementById('verifyBtn').disabled = true;
            document.getElementById('loader').style.display = 'block';

            setTimeout(() => {
                if (userData && userData.loginCode === enteredCode) {
                    window.location.href = 'login.html';
                } else {
                    document.getElementById('codeError').textContent = 'Invalid code. Please try again.';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('verifyBtn').disabled = false;
                }
            }, 1000);
        });
    }

    // Display user info
    if (userInfoDiv) {
        checkSessionValidity(); // validate session immediately on profile view

        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData) {
            userInfoDiv.innerHTML = `
                <p><strong>Name:</strong> ${userData.name}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Phone:</strong> ${userData.phone}</p>
            `;
        } else {
            userInfoDiv.innerHTML = '<p>No user data found.</p>';
        }

        // Clear data button
        document.getElementById('clearDataBtn').addEventListener('click', () => {
            sessionStorage.removeItem('userData');
            alert('Data cleared successfully!');
            window.location.href = 'index.html';
        });
    }
});
