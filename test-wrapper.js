const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><button id="theme-toggle-btn"></button><form id="contactForm"><input name="name"><input name="email"><textarea name="message"></textarea><input name="subject"><button class="submit-button"></button></form><div id="notification"></div><div class="hamburger"></div><div class="nav-menu"></div><header class="header"></header><nav class="navbar"></nav></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.FormData = dom.window.FormData;
dom.window.matchMedia = () => ({
  matches: false,
  addEventListener: () => {}
});

require('./script.test.js');
