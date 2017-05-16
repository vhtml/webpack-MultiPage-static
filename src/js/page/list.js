// 引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/list.less')

var html = ''
for (var i = 0; i < 5; i++) {
  html += '<li>列表' + (i + 1) + '</li>'
}
/* eslint-disable no-undef */
$('#list').html(html)
