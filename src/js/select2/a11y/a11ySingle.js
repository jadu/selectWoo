define([
  '../utils'
], function (Utils) {
  function A11ySingle (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  A11ySingle.prototype.update = function (decorated, data) {
    console.log("SINGLE UPDATE!", data)

    // a11y code here...

    // Keep this
    return decorated.call(this, data);
  };

  return A11ySingle;
});
