define([
  '../utils'
], function (Utils) {
  function A11ySingle (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  A11ySingle.prototype.update = function (decorated, data) {
    console.log("SINGLE UPDATE!", data)

    // If orginal select had aria-describedby, add to select2-selection
    if (this.$element.attr('aria-describedby') != null) {
      this.$selection.attr('aria-describedby', this.$element.attr('aria-describedby'));
    }
    // the above isn't working for single selects with no placeholder...

    return decorated.call(this, data);
  };

  return A11ySingle;
});
