//const endTime = new Date(2017,7,3,21,08,08);//截止时间（date 月份是从0开始）
const endTime = new Date()
//endTime.setTime( endTime.getTime() + 3600*1000 ) //(距离当前的时间+1h)
var curShowTimeSeconds = 0;//每一秒变化

var balls = [];	//用来添加所有掉落的小球
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){

	WINDOW_WIDTH = document.documentElement.clientWidth
	WINDOW_HEIGHT = document.documentElement.clientHeight

	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10) //占屏幕的十分之一(再取整)
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1

	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5)

	//获取cavans变量和绘图上下文环境	
	var canvas = document.getElementById('canvas')
	var context = canvas.getContext('2d')

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getcurrenShowTimeSenconds() //计算倒计时时间
	
	setInterval(
		function(){
			render( context );	//渲染
			update();	//对当前数据进行调整更新
		}
		,
		50 //设置帧率，一秒=1000毫秒，帧率:1000/50=20
		);
}

////计算倒计时时间的函数(以秒的形式返回)
//function getcurrenShowTimeSenconds() {
//	var curTime = new Date();	//获取当前时间
//	//截止时间毫秒数 - 当前时间毫秒数
//	var ret = endTime.getTime() - curTime.getTime()
//	ret = Math.round(ret/1000)	//转换成‘秒’再转换成整数
//	return ret >=0 ? ret : 0 ;	//小于0说明倒计时到了返回0
//}
 
//改写成时钟效果
function getcurrenShowTimeSenconds() {
	var curTime = new Date();
	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();

	return ret;
}

function update(){
	//下一次显示时间
	var nextShowTimeSeconds = getcurrenShowTimeSenconds();

	var nextHours = parseInt( nextShowTimeSeconds/3600);
	var nextMinutes = parseInt( (nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60

	var curHours = parseInt( curShowTimeSeconds/3600);
	var curMinutes = parseInt( (curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60
	//下一次显示时间和当前时间不同，则页面上改变当前时间、生成掉落的小球
	if( nextSeconds != curSeconds){
		//增加小球
		if( parseInt(curHours/10) != parseInt(nextHours/10)){
			addBalls ( MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10))
		}
		if( parseInt(curHours%10) != parseInt(nextHours%10)){
			addBalls ( MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10))
		}

		if( parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
			addBalls ( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curHours/10))
		}
		if( parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
			addBalls ( MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10))
		}

		if( parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
			addBalls ( MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curHours/10))
		}
		if( parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
			addBalls ( MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10))
		}

		curShowTimeSeconds = nextShowTimeSeconds;//然后再调用render()函数就会更新时间
	}
	var chsColor = document.getElementById('canvas')
	chsColor.style.background = "rgb("+nextHours+","+nextMinutes+","+nextSeconds+")"
	//小球运动函数
	updateBalls();
}

//对所有小球进行更新操作
function updateBalls(){
	//时刻改变小球的位置
	for( var i=0; i<balls.length;i++){

		balls[i].x += balls[i].vx;  //小球x坐标(中心坐标)加上x轴上的速度值(动态)
		balls[i].y += balls[i].vy;
		//注意vy一直在影响小球在y轴上的运动(balls[i].y的值)
		balls[i].vy += balls[i].g;  //y轴的速度值受g重力加速度的影响而变化
		//小球是否触底 碰撞检测
		if( balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = - balls[i].vy*0.60; //回弹，0.75是空气摩擦系数
		}
	}

	//将超出画面外的小球从Balls[]数组中删除
	var cnt = 0  //记录多少个小球还保留在画布中
	for (var i = 0; i < balls.length; i++) 
		//在左边缘和右边缘以内
		if( balls[i].x + RADIUS >0 && balls[i].x - RADIUS < WINDOW_WIDTH)
			balls[cnt++] = balls[i]	//cnt记录的是留在画面中的小球。因为不是所有小球都在画面中，所以i>=cnt.
									//当小球还在画布中，那么就把它挤到balls数组的前面，保留下来，这样到最后
									//0~cnt-1(因为cnt最后还是自己++了一次，所以要减1)都是在画布中的小球，cnt到balls.length-1是画布外的小球
	
	while ( balls.length > Math.min(300,cnt) ){
		balls.pop();
	}
	
}

//随机生成小球的函数
function addBalls( x, y, num ){

	for(var i=0; i<digit[num].length; i++)  
		for(var j=0; j<digit[num][i].length; j++)	
			if(digit[num][i][j] == 1){ 
				var aBall ={
					x:x+j*2*(RADIUS+1),
					y:y+i*2*(RADIUS+1),
					g:1.5+Math.random(), //小球加速度为1.5+0~1间的随机数
					vx:Math.pow( -1,Math.ceil(Math.random()*1000) )*4, //x坐标的速度值：-1的(0~1间的随机数*1000取整)次方，结果是-1or1再*4,随机左右跳
					vy:-5, //y坐标的速度值：小球产生时向上抛-5
					color:colors[ Math.floor( Math.random()*colors.length)] //向下取整随机出0~10不包括10的随机数
				}

				balls.push( aBall ) //将随机生成的小球添加进数组
			}
}

function render( cxt ){//绘制时钟，倒计时存储的具体数字
	//clearRect()对整个矩形空间内的图像进行刷新，防止canvas原先画的图和当前画的图叠加在一起
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt( curShowTimeSeconds/3600);
	var minutes = parseInt( (curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60

	//调用rederDigit函数开始绘制
	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt)//参数表示：绘制数字的x坐标，绘制数字的y坐标，具体绘制那个数字,上下文绘图环境
	renderDigit( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10),cxt)
	renderDigit( MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10,cxt)
	renderDigit( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP , parseInt(minutes/10) , cxt)
	renderDigit( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10),cxt)
	renderDigit( MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10,cxt)
	renderDigit( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP , parseInt(seconds/10) , cxt)
	renderDigit( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10),cxt)
	
	//对掉落小球的数组进行遍历，再对每个小球进行具体绘制
	for( var i=0; i<balls.length; i++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath()
		cxt.arc( balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true)
		cxt.closePath()

		cxt.fill() //
	}
}
//绘制数字的函数
function renderDigit(x,y,num,cxt){

	cxt.fillStyle = "rgb(0,102,153)";

	for(var i=0; i<digit[num].length; i++)  //数字的行数（高度）
		for(var j=0; j<digit[num][i].length; j++)	//数字每行有几个小圆（每个1代表一个小圆）
			if(digit[num][i][j] == 1){ //如果数值为1，则绘制一个圆
				cxt.beginPath()
				//每个圆绘制的位置，忘记可以看慕课笔记
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI)
				cxt.closePath()
				cxt.fill()
			}
}