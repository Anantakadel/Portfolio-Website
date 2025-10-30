
// Enhanced Theme Management
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const body = document.body;
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Set theme function
function setTheme(isDark) {
  if (isDark) {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    updateThemeIcon(true);
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    updateThemeIcon(false);
    localStorage.setItem("theme", "light");
  }
}

// Update theme icon
function updateThemeIcon(isDark) {
  const icon = themeToggleBtn.querySelector("i");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

// Initialize theme
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = prefersDarkScheme.matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    setTheme(true);
  } else {
    setTheme(false);
  }
}

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
  const isDark = !body.classList.contains("dark-theme");
  setTheme(isDark);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener("change", (e) => {
  // Only update if user hasn't set a preference
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches);
  }
});

// Add scroll event for header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile Navigation
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking nav links
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Skill Animation
const skillItems = document.querySelectorAll(".skill-item");

// Intersection Observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item = entry.target;
      item.classList.add("animate");
      const level = item.getAttribute("data-level");
      if (level) {
        item.style.setProperty("--skill-level", level + "%");
      }
      skillObserver.unobserve(item);
    }
  });
}, observerOptions);

skillItems.forEach(item => {
  skillObserver.observe(item);
});

// Contact Form
const contactForm = document.getElementById("contactForm");
const notification = document.getElementById("notification");

function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `show ${type}`;
  
  setTimeout(() => {
    notification.classList.remove("show");
  }, 4000);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Real-time validation for input fields
const nameInput = contactForm.querySelector('input[name="name"]');
const emailInput = contactForm.querySelector('input[name="email"]');
const messageInput = contactForm.querySelector('textarea[name="message"]');

// Add validation feedback elements
function createFeedbackElement(input) {
  const feedback = document.createElement('div');
  feedback.className = 'validation-feedback';
  input.parentNode.appendChild(feedback);
  return feedback;
}

const nameFeedback = createFeedbackElement(nameInput);
const emailFeedback = createFeedbackElement(emailInput);
const messageFeedback = createFeedbackElement(messageInput);

// Real-time validation functions
nameInput.addEventListener('blur', () => {
  const name = nameInput.value.trim();
  if (!name || name.length < 2) {
    nameFeedback.textContent = 'Name must be at least 2 characters';
    nameFeedback.classList.add('invalid');
    nameInput.classList.add('invalid-input');
  } else {
    nameFeedback.textContent = '';
    nameFeedback.classList.remove('invalid');
    nameInput.classList.remove('invalid-input');
  }
});

emailInput.addEventListener('blur', () => {
  const email = emailInput.value.trim();
  if (!validateEmail(email)) {
    emailFeedback.textContent = 'Please enter a valid email address';
    emailFeedback.classList.add('invalid');
    emailInput.classList.add('invalid-input');
  } else {
    emailFeedback.textContent = '';
    emailFeedback.classList.remove('invalid');
    emailInput.classList.remove('invalid-input');
  }
});

messageInput.addEventListener('blur', () => {
  const message = messageInput.value.trim();
  if (!message || message.length < 10) {
    messageFeedback.textContent = 'Message must be at least 10 characters';
    messageFeedback.classList.add('invalid');
    messageInput.classList.add('invalid-input');
  } else {
    messageFeedback.textContent = '';
    messageFeedback.classList.remove('invalid');
    messageInput.classList.remove('invalid-input');
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();
  
  // Validation
  let isValid = true;
  
  if (!name || name.length < 2) {
    nameFeedback.textContent = 'Name must be at least 2 characters';
    nameFeedback.classList.add('invalid');
    nameInput.classList.add('invalid-input');
    isValid = false;
  }
  
  if (!validateEmail(email)) {
    emailFeedback.textContent = 'Please enter a valid email address';
    emailFeedback.classList.add('invalid');
    emailInput.classList.add('invalid-input');
    isValid = false;
  }
  
  if (!message || message.length < 10) {
    messageFeedback.textContent = 'Message must be at least 10 characters';
    messageFeedback.classList.add('invalid');
    messageInput.classList.add('invalid-input');
    isValid = false;
  }
  
  if (!isValid) {
    showNotification("Please fix the errors in the form", "error");
    return;
  }
  
  // Form submission
  const submitButton = contactForm.querySelector(".submit-button");
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  submitButton.disabled = true;
  
  // Send data using fetch API (commented out for now)
  /* 
  fetch('https://formspree.io/f/your-form-id', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showNotification("Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
    } else {
      showNotification("Oops! There was a problem sending your message.", "error");
    }
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  })
  .catch(error => {
    showNotification("Network error. Please try again later.", "error");
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  });
  */
  
  // Simulate API call (for demo purposes)
  setTimeout(() => {
    showNotification("Thank you! Your message has been sent successfully.", "success");
    contactForm.reset();
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Clear validation feedback
    nameFeedback.textContent = '';
    emailFeedback.textContent = '';
    messageFeedback.textContent = '';
    nameInput.classList.remove('invalid-input');
    emailInput.classList.remove('invalid-input');
    messageInput.classList.remove('invalid-input');
  }, 2000);
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      if (document.querySelector('.nav-menu').classList.contains('active')) {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');
      }
      
      // Smooth scroll with offset for fixed header
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    navbar.style.transform = "translateY(-100%)";
  } else {
    // Scrolling up
    navbar.style.transform = "translateY(0)";
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", initializeTheme);

// Handle keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Add loading state management
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// End of script
