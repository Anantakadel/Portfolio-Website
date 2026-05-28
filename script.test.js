/**
 * @jest-environment jsdom
 */

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

document.body.innerHTML = `
  <button id="theme-toggle-btn"></button>
  <header class="header"></header>
  <div class="hamburger"></div>
  <div class="nav-menu"></div>
  <form id="contactForm">
    <input name="name" />
    <input name="email" />
    <input name="subject" />
    <textarea name="message"></textarea>
    <button class="submit-button"></button>
  </form>
  <div id="notification"></div>
  <div class="navbar"></div>
`;

// Make showNotification available globally so tests can call it
const fs = require('fs');
const path = require('path');
const scriptContent = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');

// Inject the script into the current context and expose showNotification globally
eval(scriptContent + '\nwindow.showNotification = showNotification;');

describe('showNotification', () => {
  let notification;

  beforeEach(() => {
    jest.useFakeTimers();
    notification = document.getElementById("notification");
    // Reset state before each test
    notification.textContent = '';
    notification.className = '';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows a success notification with default type', () => {
    window.showNotification('Success message');
    expect(notification.textContent).toBe('Success message');
    expect(notification.className).toBe('show success');

    jest.advanceTimersByTime(3999);
    expect(notification.classList.contains('show')).toBe(true);

    jest.advanceTimersByTime(1);
    expect(notification.classList.contains('show')).toBe(false);
  });

  it('shows an error notification when type is provided', () => {
    window.showNotification('Error message', 'error');
    expect(notification.textContent).toBe('Error message');
    expect(notification.className).toBe('show error');

    jest.advanceTimersByTime(4000);
    expect(notification.classList.contains('show')).toBe(false);
  });
});
