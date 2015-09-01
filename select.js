var m = require('mithril')
var _ = require('lodash')

var ClientSelectViewModel = (function() {
  function ClientSelectViewModel(config) {
    config = config || {}
    config.getClients = config.getClients || function(){return []}
    config.initialSelectedClient = config.initialSelectedClient || undefined
    this.onClientSelect = config.onClientSelect || function(){}
    this.clients = m.prop(config.getClients())
    this.selectedClient = m.prop(config.initialSelectedClient)
    this.isShowingDropDown = m.prop(false)
  }
  ClientSelectViewModel.prototype.selectClient = function(client) {
    this.selectedClient(client)
    this.isShowingDropDown(false)
    this.onClientSelect(client)
  }
  ClientSelectViewModel.prototype.getSuggestedClients = function(clients, selectedClient) {
    return _.sortBy(_.filter(clients, function(client) {
      return client.id() !== selectedClient.id()
    }), function(client) {
      return client.name()
    })
  }
  return ClientSelectViewModel
})()

var ClientSelect = {
  vm: ClientSelectViewModel,
  controller: function(config) {
    this.vm = new ClientSelectViewModel(config)
  },
  view: function(ctrl) {
    return m('.control', [
      m('label', 'Client'),
      ctrl.vm.clients().length > 1 ?
      m('.client-select', { onmouseleave: ctrl.vm.isShowingDropDown.bind(ctrl.vm, false) },
        m('.selected-client', { onclick: ctrl.vm.isShowingDropDown.bind(ctrl.vm, !ctrl.vm.isShowingDropDown()) },
          [
            ctrl.vm.selectedClient().name(),
            m('.dropdown-caret')
          ]
        ),
        ctrl.vm.isShowingDropDown()
        ?
        m('.dropdown',
          m('.list',
            _.map(ctrl.vm.getSuggestedClients(ctrl.vm.clients(), ctrl.vm.selectedClient()),
              function(client) {
                return m('.item',
                  { onclick: ctrl.vm.selectClient.bind(ctrl.vm, client) },
                  client.name()
                )
              }
            )
          )
        )
        :
        ''
      )
      :
      ctrl.vm.clients().length === 1 ?
      m('.client', ctrl.vm.clients()[0].name())
      :
      m('.client', 'none')
    ])
  }
}
module.exports = ClientSelect
