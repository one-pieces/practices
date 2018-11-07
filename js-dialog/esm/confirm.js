'use strict';

const style = `
    <style name="op-confirm">
      .mask {
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

export class Confirm {
  constructor(options) {
    const defaultOptions = {
      title: '',
      content: '',
      confirmBtnText: '确定',
      cancelBtnText: '取消',
      onClose: () => {},
      onConfirm: () => {},
      onCancel: () => {},
    }
    this.options = Object.assign(defaultOptions, options)
    if (!document.head.querySelector('style[name="op-confirm"]')) {
      document.head.innerHTML += style
    }
    this.$el = document.createRange().createContextualFragment(template)

    this.mask$ = this.$el.getElementById('mask')
    this.dialogBox$ = this.$el.getElementById('dialogBox')
    this.dialogClose$ = this.$el.getElementById('dialogClose')
    this.dialogContent$ = this.$el.getElementById('dialogContent')
    this.dialogTitle$ = this.$el.getElementById('dialogTitle')
    this.confirmBtn$ = this.$el.getElementById('confirmBtn')
    this.cancelBtn$ = this.$el.getElementById('cancelBtn')

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
    this.open()
  }

  open() {
    // 因为this.$el为fragment, appendChild会直接将fragment清空，所以这里不直接用$el
    document.body.appendChild(this.mask$)
    document.body.appendChild(this.dialogBox$)
    return this
  }

  close() {
    document.body.removeChild(this.mask$)
    document.body.removeChild(this.dialogBox$)
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
