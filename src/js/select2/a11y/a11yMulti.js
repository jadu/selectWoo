define([
  '../utils'
], function (Utils) {
  function A11yMulti (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  A11yMulti.prototype.update = function (decorated, data) {
    console.log("MULTI UPDATE!", data)

    // a11y code here...

    // Keep this
    return decorated.call(this, data);
  };

  return A11yMulti;
});
