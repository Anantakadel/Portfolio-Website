const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');

// Set up the DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <button id="theme-toggle-btn"></button>
  <div class="header"></div>
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
</body>
</html>
`, { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  _data: {},
  setItem: function(id, val) { return this._data[id] = String(val); },
  getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : null; },
  removeItem: function(id) { return delete this._data[id]; },
  clear: function() { return this._data = {}; }
};

global.FormData = dom.window.FormData;

// Mock window.matchMedia
global.window.matchMedia = global.window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {}
  };
};

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback, options) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Now require the script so it can execute in the mocked DOM
const { setTheme } = require('./script.js');

test('setTheme correctly sets dark theme', () => {
  // Setup
  document.body.className = '';
  localStorage.clear();

  // Execute
  setTheme(true);

  // Verify
  assert.strictEqual(document.body.classList.contains('dark-theme'), true);
  assert.strictEqual(document.body.classList.contains('light-theme'), false);
  assert.strictEqual(localStorage.getItem('theme'), 'dark');
});

test('setTheme correctly sets light theme', () => {
  // Setup
  document.body.className = 'dark-theme';
  localStorage.setItem('theme', 'dark');

  // Execute
  setTheme(false);

  // Verify
  assert.strictEqual(document.body.classList.contains('dark-theme'), false);
  assert.strictEqual(document.body.classList.contains('light-theme'), true);
  assert.strictEqual(localStorage.getItem('theme'), 'light');
});
