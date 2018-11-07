(function () {
  const style = `
    <link rel="stylesheet" href="https://unpkg.com/element-ui@2.4.9/lib/theme-chalk/index.css">
    <style>
      .op-alert {
        display: none;
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
    <div class="op-alert op-alert--success" id="op-alert">
      <div class="op-alert__content">
        恭喜你，这是一条成功消息
      </div>
      <i class="op-alert__closebtn el-icon-close"></i>
    </div>
  `
  class Alert {
    constructor(options) {
      const defaultOptions = {
        title: '',
        content: '',
        center: false,
        duration: 3000
      }
      this._options = Object.assign(defaultOptions, options)
      document.head.innerHTML += style
      // 用innerHTML会导致执行这行代码之前元素的绑定事件失效，
      // 所以使用DOMParser，或使用createContextualFragment
      const parser = new DOMParser()
      const doc = parser.parseFromString(template, 'text/html')
      document.body.appendChild(doc.body)
      // const doc = document.createRange().createContextualFragment(template)
      // document.body.appendChild(doc)

      this.opAlert$ = document.getElementById('op-alert')
    }

    show() {
      this.opAlert$.style.display = 'flex'
      setTimeout(() => {
        this.close()
      }, this._options.duration)
      return this
    }

    close() {
      this.opAlert$.style.display = 'none'
      return this
    }
  }

  window.Alert = Alert
})()