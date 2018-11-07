(function () {
  'use strict';

  const style = `
    <style name="op-alert">
      .op-alert {
        display: flex;
        z-index: 4000;
        padding: 15px 15px 15px 20px;
        min-width: 380px;
        box-sizing: border-box;
        border: 1px solid #ebeef5;
        position: fixed;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        transition: opcation .3s, transform .4s;
        align-items: center;
        border-radius: 4px;
        overflow: hidden;
        font-size: 14px;
      }
      .op-alert--success {
        background: #f0f9eb;
        color: #67c23a;
        border-color: #e1f3d8;
      }
      .op-alert--info {
        background-color: #edf2fc;
        color: #909399;
        border-color: #ebeef5;
      }
      .op-alert--warning {
        background-color: #fdf6ec;
        color: #e6a23c;
        border-color: #faecd8;
      }
      .op-alert--error {
        background-color: #fef0f0;
        color: #f56c6c;
        border-color: #fde2e2;
      }
      .op-alert__closebtn {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #c0c4cc;
      }
    </style>
  `
  const template = `
    <div class="op-alert" id="op-alert">
      <div class="op-alert__content" id="op-alert-content"></div>
      <i class="op-alert__closebtn el-icon-close" id="op-alert-close">X</i>
    </div>
  `
  class Alert {
    constructor(options) {
      const defaultOptions = {
        type: 'info', // success/warning/info/error
        content: '',
        duration: 3000
      }
      this._options = Object.assign(defaultOptions, options)

      this._timeout = null

      this._mount()

      this[this._options.type]()
    }

    _mount() {
      if (!document.head.querySelector('style[name="op-alert"]')) {
        document.head.innerHTML += style
      }
      // 用innerHTML会导致执行这行代码之前元素的绑定事件失效，
      // 所以使用DOMParser，或使用createContextualFragment
      // const parser = new DOMParser()
      // const doc = parser.parseFromString(template, 'text/html')
      // document.body.appendChild(doc.body)
      this.$el = document.createRange().createContextualFragment(template)

      this.opAlert$ = this.$el.getElementById('op-alert')
      this.opAlertContent$ = this.$el.getElementById('op-alert-content')
      this.opAlertClose$ = this.$el.getElementById('op-alert-close')

      this.opAlertClose$.addEventListener('click', () => {
        this._close()
      })
      this.setContent()
    }

    _show() {
      document.body.appendChild(this.opAlert$)
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      if (this._options.duration <= 0) {
        return this
      }
      this._timeout = setTimeout(() => {
        this._close()
        clearTimeout(this._timeout)
      }, this._options.duration)
      return this
    }

    _close() {
      document.body.removeChild(this.opAlert$)
      return this
    }

    setContent(content = this._options.content) {
      this.opAlertContent$.innerHTML = content
      return this
    }

    success() {
      this.opAlert$.classList.add('op-alert--success')
      this._show()
    }

    warning() {
      this.opAlert$.classList.add('op-alert--warning')
      this._show()
    }

    info() {
      this.opAlert$.classList.add('op-alert--info')
      this._show()
    }

    error() {
      this.opAlert$.classList.add('op-alert--error')
      this._show()
    }
  }


  window.AlertClass = Alert
})()
