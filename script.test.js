const test = require('node:test');
const assert = require('node:assert');

// Mock DOM environment to allow script.js to load without errors
global.window = {
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  addEventListener: () => {},
  scrollY: 0,
  pageYOffset: 0,
  scrollTo: () => {}
};

const mockElement = {
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
  querySelector: function() { return mockElement; },
  querySelectorAll: () => [],
  style: { setProperty: () => {}, transform: '' },
  parentNode: { appendChild: () => {} },
  contains: () => false,
  getAttribute: () => null,
  innerHTML: '',
  textContent: '',
  getBoundingClientRect: () => ({ top: 0 })
};

global.document = {
  body: mockElement,
  getElementById: function() { return mockElement; },
  querySelector: function() { return mockElement; },
  querySelectorAll: function() { return [mockElement]; },
  addEventListener: () => {},
  createElement: function() { return mockElement; },
  documentElement: { scrollTop: 0 }
};

global.localStorage = { getItem: () => null, setItem: () => {} };
global.IntersectionObserver = class { observe() {} unobserve() {} };
global.FormData = class { get() { return ''; } };
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });

// Require the functions to test
const { validateEmail } = require('./script.js');

test('validateEmail functionality', async (t) => {
  await t.test('returns true for valid email formats', () => {
    assert.strictEqual(validateEmail('test@example.com'), true);
    assert.strictEqual(validateEmail('user.name+tag@example.co.uk'), true);
    assert.strictEqual(validateEmail('a@b.cd'), true);
  });

  await t.test('returns false for missing @ symbol', () => {
    assert.strictEqual(validateEmail('testexample.com'), false);
  });

  await t.test('returns false for missing domain part', () => {
    assert.strictEqual(validateEmail('test@'), false);
    assert.strictEqual(validateEmail('test@.com'), false);
  });

  await t.test('returns false for missing username part', () => {
    assert.strictEqual(validateEmail('@example.com'), false);
  });

  await t.test('returns false for spaces in email', () => {
    assert.strictEqual(validateEmail('test @example.com'), false);
    assert.strictEqual(validateEmail('test@ example.com'), false);
    assert.strictEqual(validateEmail('te st@example.com'), false);
  });
});
