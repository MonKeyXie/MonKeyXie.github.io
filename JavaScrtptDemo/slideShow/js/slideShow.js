window.onload = function () {
	var container = document.getElementById('container');
	var list = document.getElementById('list');
	var buttons = document.getElementById('buttons').getElementsByTagName(
		'span');
	var prev = document.getElementById('prev'); 
	var next = document.getElementById('next'); 
	var index = 1;
	var animated = false; //动画是否在进行。是则不执行
	var timer;

	//小圆点样式变化
	function showButton() {
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].className == 'on'){
				buttons[i].className = '';
				break;
			}
		}
		buttons[index-1].className = 'on';
	}
	//图片切换
	function animate(offset) {
		var newLeft = parseInt(list.style.left) + offset;
		var time = 600; //位移总时间
		var interval = 10; //多久移动一次
		var speed = offset/(time/interval);//每次位移量

		function go() {			//向左移动时 && left是不是>目标值 ->做位移
			if ( (speed < 0 && parseInt(list.style.left) > newLeft) || (speed > 0 && parseInt(list.style.left) < newLeft)) {
				animated = true;
				list.style.left = parseInt(list.style.left) + speed + 'px';
				setTimeout(go, interval);//不断递归不断执行go实现滑动动画
			}
			else {
					animated = false;
					list.style.left = newLeft + 'px';
					if (newLeft > -600){
						list.style.left = -3000 + 'px';
					}
					if (newLeft < -3000){
						list.style.left = -600 + 'px';
					}
			}
		}
		go();
	}

	//定时器
	function play() 
	{
		timer = setInterval(function () {
			next.onclick();
		},3000);
	}
	function stop()
	{
		clearInterval(timer);
	}

	//点击箭头切换	
	next.onclick = function () {
		if(!animated){ //如果不在切换中，则执行切换，在切换中则不切换
			if( index >= 5 ){
				index = 1 ;
			}else{
				index = index + 1;
			}
			showButton();
			animate(-600);
		}
	}
	prev.onclick = function () {
		if(!animated){ 
			if( index <= 1 ){
				index = 5 ;
			}else{
				index = index - 1;
			}
			showButton();
			animate(600);
		}
	}
	//点击小按钮切换
	for (var i = 0;i < buttons.length; i++){
		buttons[i].onclick = function (){
			if(this.className == 'on'){
				return;//退出函数
			}
			var myIndex = parseInt(this.getAttribute('index'));//获取自定义属性index
			var offset = -600 * (myIndex - index); //每次点击圆点的偏移量
			animate(offset);
			index = myIndex;
			showButton();
		}
	}
	//鼠标移进停止动画
	container.onmouseover = stop; //不是stop()
	container.onmouseout = play;

	play();
}