describe('script.js tests', () => {
  beforeAll(() => {
    // Mock IntersectionObserver
    class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserver, writable: true });

    // Mock scrollTo
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <button id="theme-toggle-btn"></button>
      <header class="header"></header>
      <div class="hamburger"></div>
      <div class="nav-menu">
        <a href="#about" class="nav-link">About</a>
      </div>
      <form id="contactForm">
        <input name="name" />
        <input name="email" />
        <input name="subject" />
        <textarea name="message"></textarea>
        <button class="submit-button">Submit</button>
      </form>
      <div id="notification"></div>
      <div class="skill-item" data-level="80"></div>
      <nav class="navbar"></nav>
      <section id="about"></section>
    `;

    // Reset localStorage
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('validateEmail correctly validates emails', () => {
    const { validateEmail } = require('./script.js');
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });

  test('setTheme changes classes and localStorage', () => {
    const { setTheme } = require('./script.js');

    // Set dark theme
    setTheme(true);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('dark');

    // Set light theme
    setTheme(false);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(window.localStorage.getItem('theme')).toBe('light');
  });

  test('initializeTheme defaults to light theme when no preference', () => {
    const { initializeTheme } = require('./script.js');
    initializeTheme();
    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  test('initializeTheme uses saved theme', () => {
    window.localStorage.setItem('theme', 'dark');
    const { initializeTheme } = require('./script.js');
    initializeTheme();
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  test('showNotification displays message and sets class', () => {
    jest.useFakeTimers();
    const { showNotification } = require('./script.js');
    const notification = document.getElementById('notification');

    showNotification('Test message', 'success');
    expect(notification.textContent).toBe('Test message');
    expect(notification.className).toBe('show success');

    jest.runAllTimers();
    expect(notification.classList.contains('show')).toBe(false);

    jest.useRealTimers();
  });
});
