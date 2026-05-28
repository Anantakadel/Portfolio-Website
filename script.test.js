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
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserver;

// Ensure document has required elements for script.js to initialize without crashing
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
    <button class="submit-button"></button>
  </form>
  <div id="notification"></div>
  <div class="navbar"></div>
`;

const { validateEmail } = require('./script.js');

describe('validateEmail', () => {
  it('should return true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    expect(validateEmail('123@numbers.com')).toBe(true);
  });

  it('should return false for emails missing @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('should return false for emails missing domain part after @', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('should return false for emails missing domain extension', () => {
    expect(validateEmail('test@example')).toBe(false);
    expect(validateEmail('test@example.')).toBe(false);
  });

  it('should return false for emails with spaces', () => {
    expect(validateEmail('test @example.com')).toBe(false);
    expect(validateEmail('test@ example.com')).toBe(false);
    expect(validateEmail('test@example .com')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
