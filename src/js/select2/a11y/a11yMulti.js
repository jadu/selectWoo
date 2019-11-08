define([
  '../utils'
], function (Utils) {
  function A11yMulti (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  A11yMulti.prototype.bind = function (decorated, container, $container) {
    console.log("MULTI BIND!")

    console.log(decorated);
    console.log(container);
    console.log($container);

    // a11y code here...

    var selectionSummaryId = container.id + '-summary';
    this.$selectionSummary = $('<span id="'+ selectionSummaryId +'" class="select2-selections"></span>');
    $container.append(this.$selectionSummary);

    // If orginal select had aria-describedby, add to select2 search
    if (this.$element.attr('aria-describedby') != null) {
      this.$search.attr('aria-describedby', this.$element.attr('aria-describedby'));
    }

    return decorated.call(this, container);
  };

  A11yMulti.prototype.update = function (decorated, data) {
    console.log("MULTI UPDATE!")

    // issue this doesn't fire when the last selection of a multi select WITH a placeholder is removed.

    console.log(data);

    return decorated.call(this, data);
  }

  return A11yMulti;
});
