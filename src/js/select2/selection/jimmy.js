define([
  '../utils'
], function (Utils) {
  function Jimmy (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Jimmy.prototype.update = function (decorated, data) {
    console.log("JIMMY UPDATE!", data)
    return decorated.call(this, data);
  };

  return Jimmy;
});
