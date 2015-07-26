'use strict';

/**
 * Summarizes two floats.
 *
 * @method summator
 * @param {number} val1   The first component
 * @param {number} val2   The second component
 * @return {number}
 */
function summator(val1, val2) {
  var first = parseFloat(val1, 10);
  var second = parseFloat(val2, 10);

  return first + second;
}

window.summator = summator;