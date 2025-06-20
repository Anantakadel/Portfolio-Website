
// Theme Management
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const body = document.body;

// Initialize theme
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.add("dark-theme");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
}

// Update theme icon
function updateThemeIcon(isDark) {
  const icon = themeToggleBtn.querySelector("i");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-theme");
  updateThemeIcon(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
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

function animateSkills() {
  skillItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible && !item.classList.contains("animate")) {
      item.classList.add("animate");
      const level = item.getAttribute("data-level");
      if (level) {
        item.style.setProperty("--skill-level", level + "%");
      }
    }
  });
}

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

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();
  
  // Validation
  if (!name || name.length < 2) {
    showNotification("Please enter a valid name (at least 2 characters)", "error");
    return;
  }
  
  if (!validateEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }
  
  if (!message || message.length < 10) {
    showNotification("Please enter a message (at least 10 characters)", "error");
    return;
  }
  
  // Simulate form submission
  const submitButton = contactForm.querySelector(".submit-button");
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    showNotification("Thank you! Your message has been sent successfully.", "success");
    contactForm.reset();
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }, 2000);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
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

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events if needed
const debouncedScrollHandler = debounce(() => {
  // Additional scroll handling if needed
}, 100);

window.addEventListener("scroll", debouncedScrollHandler);
