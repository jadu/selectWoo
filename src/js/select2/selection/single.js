define([
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';
    var label = this.options.get('label');
    var placeholder = this.options.get('placeholder');

    // If a label is passed via options,
    // set aria label on select2-container for screen readers
    if (label) {
      this.container.$container.attr('aria-label', label);
    }

    this.$selection.find('.select2-selection__rendered')
      .attr('id', id)
      .attr('role', 'textbox')
      .attr('aria-readonly', 'true');

    // role="textbox" require a text label (not needed when no placeholder is present as first option is selected)
    if (placeholder) {
      this.$selection.find('.select2-selection__rendered').attr('aria-label', placeholder);
    }

    // If element is disabled, 
    // add aria-disabled to rendered element for screen readers
    if (this.container.$element.attr('disabled')) {
      this.$selection.find('.select2-selection__rendered')
        .attr('aria-disabled', 'true');
    }

    // This makes single selects work in screen readers.
    // ARIA 1.1 states combobox should also have aria-controls and aria-owns.
    this.$selection.attr('role', 'combobox');
    this.$selection.attr('aria-controls', id);
    this.$selection.attr('aria-owns', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('keydown', function (evt) {
      // If user starts typing an alphanumeric key on the keyboard,
      // open if not opened.
      if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
        container.open();
      }
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.trigger('focus');
      }
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);
    
    // Update aria-label with selected option
    $rendered.attr('aria-label', selection.title || selection.text);
  };

  return SingleSelection;
});
