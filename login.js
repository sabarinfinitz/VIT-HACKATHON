document.addEventListener('DOMContentLoaded', () => {
    const loginSubmit = document.getElementById('login-submit');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.querySelector('.close');
    const modalTitle = document.getElementById('modal-title');

    const showModal = (title, message) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = "block";
    };

    const hideModal = () => {
        modal.style.display = "none";
    };

    loginSubmit.addEventListener("click", (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Trigger modal pop-up immediately
        showModal("Logging In", "Please wait while we process your login...");

        // Simulate an async login operation with a timeout
        setTimeout(() => {
            // Simulate login success
            if (email === "user@example.com" && password === "password") {
                showModal("Login Successful", "Redirecting...");
                setTimeout(() => {
                    window.location.href = "grand.html";
                }, 2000);
            } else {
                showModal("Login Failed", "Invalid email or password.");
            }
        }, 2000);
    });

    closeModal.addEventListener('click', () => {
        hideModal();
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            hideModal();
        }
    };
});
