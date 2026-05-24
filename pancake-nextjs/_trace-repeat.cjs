const orig = String.prototype.repeat;
String.prototype.repeat = function repeat(count) {
  if (count < 0) {
    console.error('NEGATIVE_REPEAT', count);
    console.error(new Error().stack);
  }
  return orig.call(this, count);
};

process.argv = ['node', 'next', 'build'];
require('next/dist/bin/next');
