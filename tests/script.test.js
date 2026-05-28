const fs = require('fs');
const path = require('path');

describe('Contact Form', () => {
  let html;

  beforeAll(() => {
    html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

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

    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    global.fetch = jest.fn();

    // Clear modules cache so script.js runs again
    jest.resetModules();
    require('../script.js');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows default error message when fetch returns ok=false and invalid JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => { throw new Error('Invalid JSON'); }
    });

    const contactForm = document.getElementById('contactForm');

    // Fill out the form
    contactForm.querySelector('input[name="name"]').value = 'John Doe';
    contactForm.querySelector('input[name="email"]').value = 'john@example.com';
    contactForm.querySelector('input[name="subject"]').value = 'Test Subject';
    contactForm.querySelector('textarea[name="message"]').value = 'This is a test message that is long enough.';

    // Submit the form
    const submitEvent = new Event('submit', { cancelable: true });
    contactForm.dispatchEvent(submitEvent);

    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    const notification = document.getElementById('notification');
    expect(notification.textContent).toBe('Oops! There was a problem sending your message.');
    expect(notification.classList.contains('show')).toBe(true);
    expect(notification.classList.contains('error')).toBe(true);
  });

  it('shows API error message when fetch returns ok=false and valid JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Custom API Error' })
    });

    const contactForm = document.getElementById('contactForm');

    // Fill out the form
    contactForm.querySelector('input[name="name"]').value = 'John Doe';
    contactForm.querySelector('input[name="email"]').value = 'john@example.com';
    contactForm.querySelector('input[name="subject"]').value = 'Test Subject';
    contactForm.querySelector('textarea[name="message"]').value = 'This is a test message that is long enough.';

    // Submit the form
    const submitEvent = new Event('submit', { cancelable: true });
    contactForm.dispatchEvent(submitEvent);

    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    const notification = document.getElementById('notification');
    expect(notification.textContent).toBe('Custom API Error');
    expect(notification.classList.contains('show')).toBe(true);
    expect(notification.classList.contains('error')).toBe(true);
  });


  it('shows success message when fetch returns ok=true', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const contactForm = document.getElementById('contactForm');

    // Fill out the form
    contactForm.querySelector('input[name="name"]').value = 'John Doe';
    contactForm.querySelector('input[name="email"]').value = 'john@example.com';
    contactForm.querySelector('input[name="subject"]').value = 'Test Subject';
    contactForm.querySelector('textarea[name="message"]').value = 'This is a test message that is long enough.';

    // Submit the form
    const submitEvent = new Event('submit', { cancelable: true });
    contactForm.dispatchEvent(submitEvent);

    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    const notification = document.getElementById('notification');
    expect(notification.textContent).toBe('Thank you! Your message has been sent successfully.');
    expect(notification.classList.contains('show')).toBe(true);
    expect(notification.classList.contains('success')).toBe(true);
  });
});
