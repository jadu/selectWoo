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

    // Add a container for accessible selection summary
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

    // ISSUE this doesn't fire when the last selection of a multi select WITH a placeholder is removed.

    var existingAriaDescribedby = this.$element.attr('aria-describedby');
    var updatedAriaDescribedby;

    // Empty the summary of previously selected options
    this.$selectionSummary.empty();

    // Update accessible selection summary with selections
    for (var d = 0; d < data.length; d++) {
      var selection = data[d];
      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      if ('string' === typeof formatted) {
        formatted = formatted.trim();
      } 

      // Update selection summary (used for aria-describedby on search input)
      this.$selectionSummary.append(formatted + ',');
    }

    // Remove trailing comma if no element aria-describedby
    if (typeof existingAriaDescribedby === 'undefined') {
      this.$selectionSummary.text(this.$selectionSummary.text().replace(/,$/, ''));
    }

    // Update search field with selection summary aria-describedby
    if (typeof existingAriaDescribedby !== 'undefined') {
      updatedAriaDescribedby = this.$selectionSummary.attr('id') + ' ' + existingAriaDescribedby;
    } else {
      updatedAriaDescribedby = this.$selectionSummary.attr('id')
    }
    this.$search.attr('aria-describedby', updatedAriaDescribedby);


    return decorated.call(this, data);
  }

  return A11yMulti;
});
