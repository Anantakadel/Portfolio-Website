describe('showNotification', () => {
  let showNotification;
  let notification;

  beforeEach(() => {
    // Set up DOM structure needed by script.js
    document.body.innerHTML = `
      <div id="theme-toggle-btn"></div>
      <div class="header"></div>
      <div class="hamburger"></div>
      <div class="nav-menu"></div>
      <form id="contactForm">
        <input name="name" />
        <input name="email" />
        <textarea name="message"></textarea>
        <input name="subject" />
      </form>
      <div id="notification"></div>
    `;

    // Mock matchMedia before requiring script.js
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

    // Mock IntersectionObserver
    class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    window.IntersectionObserver = IntersectionObserver;

    // Reset module registry so that script.js is loaded afresh
    jest.resetModules();

    // It's important to query the element *after* requiring the script
    // but the script caches the notification element at module level
    const script = require('./script.js');
    showNotification = script.showNotification;

    notification = document.getElementById('notification');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should show notification with default type', () => {
    jest.useFakeTimers();

    showNotification('Test message');

    expect(notification.textContent).toBe('Test message');
    expect(notification.className).toBe('show success');

    jest.runAllTimers();
    expect(notification.classList.contains('show')).toBe(false);
  });

  it('should show notification with specific type (e.g. error)', () => {
    jest.useFakeTimers();

    showNotification('Error message', 'error');

    expect(notification.textContent).toBe('Error message');
    expect(notification.className).toBe('show error');

    // Just before 4000ms, it should still have the show class
    jest.advanceTimersByTime(3999);
    expect(notification.classList.contains('show')).toBe(true);

    // At 4000ms, the show class should be removed
    jest.advanceTimersByTime(1);
    expect(notification.classList.contains('show')).toBe(false);
  });
});
