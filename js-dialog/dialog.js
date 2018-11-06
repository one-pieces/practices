(function () {
  const style = `
    <style>
      .mask {
        /*display: none;*/
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 3000;
        background: #000;
        opacity: .5;
        top:0;
        left:0;
      }
      .dialog {
        /*display: none;*/
        width: 30%;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 3001;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        box-sizing: border-box;
      }
      .dialog .dialog__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 20px 20px 10px;
        margin-bottom: 10px;
      }
      .dialog .dialog__close {
        cursor: pointer;
        color: #909399;
      }
      .dialog .dialog__content {
        padding: 30px 20px;
        color: #606266;
        font-size: 16px;
      }
      .dialog .dialog__footer {
        padding: 10px  20px 20px;
        text-align: right;
        box-sizing: border-box;
      }
      .dialog__btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
      }
      .confirm-btn {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        margin-right: 15px;
      }
    </style>
  `
  const template = `
    <!--遮罩层-->
    <div class="mask" id="mask"></div>
    <!--弹出框盒子-->
    <div class="dialog" id="dialogBox">
      <div class="dialog__header">
        <div class="dialog__title" id="dialogTitle" style="font-size: 20px;"></div>
        <div class="dialog__close" id="dialogClose">X</div>
      </div>
      <div class="dialog__content" id="dialogContent"></div>
      <div class="dialog__footer">
        <button class="dialog__btn confirm-btn" id="confirmBtn"></button>
        <button class="dialog__btn cancel-btn" id="cancelBtn"></button>
      </div>
    </div>
  `

  class Dialog {
    constructor(options) {
      const defaultOptions = {
        type: 'confirm', // alert, confirm
        title: '',
        content: '',
        confirmBtnText: '确定',
        cancelBtnText: '取消',
        onClose: () => {},
        onConfirm: () => {},
        onCancel: () => {},
      }
      this.options = Object.assign(defaultOptions, options)
      document.body.innerHTML += style + template

      this.mask$ = document.getElementById('mask')
      this.dialogBox$ = document.getElementById('dialogBox')
      this.dialogClose$ = document.getElementById('dialogClose')
      this.dialogContent$ = document.getElementById('dialogContent')
      this.dialogTitle$ = document.getElementById('dialogTitle')
      this.confirmBtn$ = document.getElementById('confirmBtn')
      this.cancelBtn$ = document.getElementById('cancelBtn')

      this.mask$.addEventListener('click', () => {
        this.close()
      })
      this.dialogClose$.addEventListener('click', () => {
        this.close()
      })
      this.cancelBtn$.addEventListener('click', () => {
        this.close()
        this.options.onCancel()
      })
      this.confirmBtn$.addEventListener('click', () => {
        this.options.onConfirm()
      })
      this.setContent()
      this.setTitle()
      this.setConfirmBtnText()
      this.setCancelBtnText()
    }

    open() {
      this.mask$.style.display = 'block'
      this.dialogBox$.style.display = 'block'
      return this
    }

    close() {
      this.mask$.style.display = 'none'
      this.dialogBox$.style.display = 'none'
      this.options.onClose()
      return this
    }

    setContent(content = this.options.content) {
      this.dialogContent$.innerHTML = content
      return this
    }

    setTitle(title = this.options.title) {
      this.dialogTitle$.innerHTML = title
      return this
    }

    setConfirmBtnText(text = this.options.confirmBtnText) {
      this.confirmBtn$.innerHTML = text
      return this
    }

    setCancelBtnText(text = this.options.cancelBtnText) {
      this.cancelBtn$.innerHTML = text
      return this
    }
  }

  window.Dialog = Dialog
})()
