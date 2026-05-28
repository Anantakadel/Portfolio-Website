const test = require('node:test');
const assert = require('node:assert');
const { validateEmail } = require('./script.js');

test('validateEmail - happy paths', (t) => {
  assert.strictEqual(validateEmail('test@example.com'), true);
  assert.strictEqual(validateEmail('user.name+tag+sorting@example.com'), true);
  assert.strictEqual(validateEmail('x@example.com'), true);
  assert.strictEqual(validateEmail('example-indeed@strange-example.com'), true);
  assert.strictEqual(validateEmail('admin@mailserver1'), false); // The regex requires a dot
  assert.strictEqual(validateEmail('example@s.example'), true);
  assert.strictEqual(validateEmail('" "@example.org'), false); // Spaces aren't allowed by regex
});

test('validateEmail - edge cases and missing parts', (t) => {
  assert.strictEqual(validateEmail(''), false); // Empty string
  assert.strictEqual(validateEmail('a'.repeat(255) + '@example.com'), true); // Very long local part
  assert.strictEqual(validateEmail('test@' + 'a'.repeat(255) + '.com'), true); // Very long domain part
  assert.strictEqual(validateEmail('plainaddress'), false); // Missing @ and domain
  assert.strictEqual(validateEmail('#@%^%#$@#$@#.com'), false); // Multiple @
  assert.strictEqual(validateEmail('@example.com'), false); // Missing local part
  assert.strictEqual(validateEmail('Joe Smith <email@example.com>'), false); // Contains spaces and brackets
  assert.strictEqual(validateEmail('email.example.com'), false); // Missing @
  assert.strictEqual(validateEmail('email@example@example.com'), false); // Two @ symbols
  assert.strictEqual(validateEmail('.email@example.com'), true); // Valid per regex
  assert.strictEqual(validateEmail('email.@example.com'), true); // Valid per regex
  assert.strictEqual(validateEmail('email..email@example.com'), true); // Valid per regex
  assert.strictEqual(validateEmail('email@example.com (Joe Smith)'), false); // Spaces
  assert.strictEqual(validateEmail('email@example'), false); // Missing dot in domain
  assert.strictEqual(validateEmail('email@-example.com'), true); // Valid per regex
  assert.strictEqual(validateEmail('email@111.222.333.44444'), true); // IP/Valid per regex
  assert.strictEqual(validateEmail('email@example..com'), true); // Valid per regex
  assert.strictEqual(validateEmail('Abc..123@example.com'), true); // Valid per regex
});

test('validateEmail - invalid inputs', (t) => {
  // Though validateEmail assumes string input, we should check behaviour with non-strings if possible
  // Since it calls emailRegex.test(email), it coerces to string implicitly.
  // null becomes "null", undefined becomes "undefined". Neither have '@' and '.'
  assert.strictEqual(validateEmail(null), false);
  assert.strictEqual(validateEmail(undefined), false);
  assert.strictEqual(validateEmail(12345), false);
});
