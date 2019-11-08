define([
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');
    $selection.html(
      '<ul class="select2-selection__rendered" ' +
      'aria-live="polite" ' +
      'aria-relevant="additions removals" ' +
      'aria-atomic="true"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    // Add a container for our accessible selection summary
    var selectionSummaryId = container.id + '-summary';
    this.$selectionSummary = $('<span id="'+ selectionSummaryId +'" class="select2-selections"></span>');
    $container.append(this.$selectionSummary);

    // If orginal select had aria-describedby, add to select2 search
    if (this.$element.attr('aria-describedby') != null) {
      this.$search.attr('aria-describedby', this.$element.attr('aria-describedby'));

      // need to deal with things alrady selected on load
    }

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );

    this.$selection.on('keydown', function (evt) {
      // If user starts typing an alphanumeric key on the keyboard,
      // open if not opened.
      if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
        container.open();
      }
    });

    // Focus on the search field when the container
    // is focused instead of the main container.
    container.on( 'focus', function(){
      self.focusOnSearch();
    });
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" ' +
        'role="presentation" ' +
        'aria-hidden="true">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  /**
   * Focus on the search field instead of the main multiselect container.
   */
  MultipleSelection.prototype.focusOnSearch = function() {
    var self = this;

    if ('undefined' !== typeof self.$search) {
      // Needs 1 ms delay because of other 1 ms setTimeouts when rendering.
      setTimeout(function(){
        // Prevent the dropdown opening again when focused from this.
        // This gets reset automatically when focus is triggered.
        self._keyUpPrevented = true;

        self.$search.focus();
      }, 1);
    }
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    // ISSUE - this doesn't fire for the last item when it's removed
    // by either X on tag or deselect, so the 
    // summary still contains the final selection option.

    // Empty the summary of previously selected options
    this.$selectionSummary.empty();

    var $selections = [];
    var existingAriaDescribedby = this.$element.attr('aria-describedby');
    var updatedAriaDescribedby;

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);
      if ('string' === typeof formatted) {
        formatted = formatted.trim();
      }

      $selection.append(formatted);
      $selection.prop('title', selection.title || selection.text);

      $selection.data('data', selection);

      $selections.push($selection);

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

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});
