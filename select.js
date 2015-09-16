var m = require('mithril')
var extend = require('lodash/object/extend')
var map = require('lodash/collection/map')
var sortBy = require('lodash/collection/sortBy')


/**
 * Select Component Namespace
 * @namespace Select
 */

/**
 * @typedef {Object} Select.Option
 * @property {String} display
 * @property {*} value
 */

/**
 * Configuration object used to set up Select Component.
 * @typedef {Object} Select.SelectConfig
 * @property {String} label - Sets the label value of the property being changed.
 * @property {Select.Option[]} options - Collection of Options to select from.
 * @property {Select.Option} initialSelectedOption - The option in the options list that will start selected.
 * @property {Select.SelectConfig~isEqual} isEqual - Callback that handles equality.
 * @property {Select.SelectConfig~sortBy} sortBy - Callback that handles which property should be used to sort the options.
 * @property {Boolean} [sortByDescending=false] - Will reverse the options sorted by {@link Select.SelectConfig~sortBy}.
 * @property {Select.SelectConfig~onSelect} [onSelect] - Callback to notify that the Option Selected has changed.
 */

/**
 * Used to determine if the selected option is the same as the other option.
 * @callback Select.SelectConfig~isEqual
 * @param {Select.Option} Selected Option.
 * @param {Select.Option} Other Option to compare.
 * @returns {Boolean}
 */

/**
 * Will be called on each Option for the property to sort by.
 * @callback Select.SelectConfig~sortBy
 * @param {Select.Option} Current option in loop.
 * @returns {String|Number} value to use for sorting.
 */

/**
 * Callback used to notify of Changes in the Selected Option.
 * @callback Select.SelectConfig~onSelect
 * @param {Select.Option} Option that has just been selected.
 */

/**
 * Default Configuration for Select Component
 * @constant {Select.SelectConfig}
 * @default
 */
var defaultSelectConfig = {
  label: '',
  options: [],
  initialSelectedOption: undefined,
  isEqual: function(optionA, optionB) {
    return (!optionA || !optionB) ? false : optionA.display === optionB.display
  },
  sortBy: function(option) {
    return option.display
  },
  sortByDescending: false,
  onSelect: function(){}
}
/**
 * @class
 */
var SelectViewModel = (function() {
  /**
   * Builds Select.SelectViewModel Object and fills config with defaults if not specified
   * @param {Select.SelectConfig} [config]
   * @constructor
   */
  function SelectViewModel(config) {
    config = config || {}
    config = extend({}, defaultSelectConfig, config)
    this.label = config.label
    this.options = m.prop(config.options)
    this.selectedOption = m.prop(config.initialSelectedOption)
    this.isEqual = config.isEqual
    this.sortBy = config.sortBy
    this.reverse = config.sortByDescending
    this.onSelect = config.onSelect
    this.isShowingDropDown = m.prop(false)

    if (!config.initialSelectedOption) {
      // if config isn't set -> pull the first option
      config.initialSelectedOption = config.options.length > 0 ?
        this.sortOptions(config.options)[0]
        : defaultSelectConfig.initialSelectedOption
      // notify listener that the initial option has been selected
      this.selectOption(config.initialSelectedOption)
    }
  }
  SelectViewModel.prototype.selectOption = function(option) {
    this.isShowingDropDown(false)
    if (!this.isEqual(this.selectedOption(), option)) {
      this.selectedOption(option)
      this.onSelect(option.value)
    }
  }
  SelectViewModel.prototype.sortOptions = function(options) {
    var ascendingOrder = sortBy(options, this.sortBy)
    return this.reverse ? ascendingOrder.reverse() : ascendingOrder
  }
  SelectViewModel.prototype.renderOption = function(option) {
    return m('li',
      { onclick: this.selectOption.bind(this, option) },
      m('span.control-indicator' +
        (this.isEqual(this.selectedOption(), option) ? '.selected' : '')
      ),
      option.display
    )
  }
  return SelectViewModel
})()

var Select = {
  vm: SelectViewModel,
  /**
   * @param {Select.SelectConfig} [config] - configuration of the Select View Model
   */
  controller: function(config) {
    this.vm = new SelectViewModel(config)
  },
  view: function(ctrl) {
    return m('.dropdown', { onmouseleave: ctrl.vm.isShowingDropDown.bind(ctrl.vm, false) },
      [
        m('label.selection',
          ctrl.vm.options().length > 1 ?
          { onclick: ctrl.vm.isShowingDropDown.bind(ctrl.vm, !ctrl.vm.isShowingDropDown()) }
          :
          undefined,
          m('h6.title.bold', ctrl.vm.label),
          ctrl.vm.options().length > 1 ?
          // if there is more than one option
          m('',
            ctrl.vm.selectedOption().display,
            m('.caret')
          )
          :
          ctrl.vm.options().length === 1 ?
          // if there is only one option
          m('', ctrl.vm.options()[0].display)
          :
          // if there are no options
          m('', 'none')
        ),
        ctrl.vm.options().length > 1 && ctrl.vm.isShowingDropDown() ?
        m('.options-container',
          m('ul.options',
            map(ctrl.vm.sortOptions.call(ctrl.vm, ctrl.vm.options()), ctrl.vm.renderOption.bind(ctrl.vm))
          )
        )
        :
        ''
      ]
    )
  }
}
module.exports = Select