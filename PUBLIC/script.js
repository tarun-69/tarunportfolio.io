// public/script.js

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const uploadForm = document.getElementById('uploadForm');

    // Contact Form Submission
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Contact form response:', data);
                // You can handle the server response as needed (e.g., show a success message)
            })
            .catch(error => console.error('Error:', error));
    });

    // File Upload Form Submission
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(uploadForm);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('File upload response:', data);
                // You can handle the server response as needed (e.g., show a success message)
            })
            .catch(error => {
                console.error('Error:', error);
                // You can handle the error as needed (e.g., show an error message)
            });
    });
});
