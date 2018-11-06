(function () {
  const template = `
    <!--遮罩层-->
    <div class="black" id="mask"></div>
    <!--弹出框盒子-->
    <div class="dialog" id="dialogBox">
      <span style="display: inline-block;">活动收费</span><span class="dialog_close" style="display: inline-block;padding-left: 470px;border-bottom: 1px solid #eee;">X</span>
      <h3 class="dialog_title">活动收费</h3>
      <div class="dialog_content">此活动需要收取报名费100元</div>
    </div>
  `

  function createDocumentFragment() {
    return document.createRange().createContextualFragment(template);
  }

  function Dialog(options) {
    var fragContainer = document.createDocumentFragment();
    fragContainer.appendChild(createDocumentFragment());

    this.mask$ = fragContainer.getElementById('mask')
    this.dialogBox$ = fragContainer.getElementById('dialogBox')
  }

  Dialog.prototype.open = function() {
    this.mask$.style.display = 'block'
    this.dialogBox$.style.display = 'block'
  }

  Dialog.prototype.close = function() {
    this.mask$.style.display = 'none'
    this.dialogBox$.style.display = 'none'
  }

  window.Dialog = Dialog
})()