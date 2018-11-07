(function () {
  'use strict';

  const Alert = function(options) {
    if (typeof options === 'string') {
      options = {
        content: options
      }
    }
    return new AlertClass(options)
  }
  const types = ['success', 'warning', 'info', 'error']
  types.forEach(type => {
    Alert[type] = options => {
      if (typeof options === 'string') {
        options = {
          content: options
        }
      }
      options.type = type
      return Alert(options)
    }
  })

  const Confirm = function(options) {
    if (typeof options === 'string') {
      options = {
        content: options
      }
    }
    return new ConfirmClass(options)
  }

  class Dialog {
    constructor() {
      this.alert = Alert
      this.confirm = Confirm
    }
  }

  window.Dialog = Dialog
})()
