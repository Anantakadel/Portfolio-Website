// Project Links Enhancement
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.href;
        window.open(url, '_blank', 'noopener,noreferrer');
    });
});

// Contact Form Handler
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const subject = "Portfolio Contact Form";
    const body = `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nMessage: ${formData.get('message')}`;
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=anantakadel01@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
    form.reset();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.borderColor = type === 'success' ? 'var(--neon-green)' : 'var(--neon-cyan)';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Contact options click handlers
document.querySelectorAll('.contact-option').forEach(option => {
    option.addEventListener('click', () => {
        const link = option.getAttribute('onclick');
        if (link) {
            eval(link);
        }
    });
});