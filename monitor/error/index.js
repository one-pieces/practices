// 真心捕获不到啊亲～！
try{
  setTimeout(function(){
    // throw Error("unexpected operation happen...")
    a.p()
  }, 1000)
} catch(e){
  console.log(e)
}

window.onerror = function(message, source, lineno, colno, error) {
  console.log('ddd', message, source, lineno, colno, error, error.stack)
}
