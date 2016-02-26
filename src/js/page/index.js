//引入css
require("../../css/lib/reset.css");
require("../../css/common/global.css");
require("../../css/common/grid.css");
require("../../css/page/index.less");


var oP = document.createElement('p');
oP.className = 'text';
oP.innerHTML = '这是由js生成的一句话。';
document.querySelector('.g-bd').appendChild(oP);

//增加事件
$('.btn').click(function() {
	require.ensure(['../components/dialog/index.js'], function(require) {
		var Dialog = require('../components/dialog/index.js');
		new Dialog();
	});
});