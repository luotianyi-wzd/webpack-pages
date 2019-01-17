import './index/index.less'

var h = document.getElementsByTagName('h1')[0]
var date = new Date()
h.onclick=function () {
   h.style.color = '#'+(Math.random()*0xffffff<<0).toString(16)
}
h.style.color = '#'+(Math.random()*0xffffff<<0).toString(16)
h.innerHTML = String(date.getFullYear()) + String(date.getMonth() + 1 < 10 ? '0' +1 : date.getMonth() + 1) + String(date.getDate()
)