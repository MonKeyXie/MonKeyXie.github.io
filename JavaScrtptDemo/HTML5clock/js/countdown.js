//const endTime = new Date(2017,7,3,21,08,08);//��ֹʱ�䣨date �·��Ǵ�0��ʼ��
const endTime = new Date()
//endTime.setTime( endTime.getTime() + 3600*1000 ) //(���뵱ǰ��ʱ��+1h)
var curShowTimeSeconds = 0;//ÿһ��仯

var balls = [];	//����������е����С��
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){

	WINDOW_WIDTH = document.documentElement.clientWidth
	WINDOW_HEIGHT = document.documentElement.clientHeight

	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10) //ռ��Ļ��ʮ��֮һ(��ȡ��)
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1

	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5)

	//��ȡcavans�����ͻ�ͼ�����Ļ���	
	var canvas = document.getElementById('canvas')
	var context = canvas.getContext('2d')

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	curShowTimeSeconds = getcurrenShowTimeSenconds() //���㵹��ʱʱ��
	
	setInterval(
		function(){
			render( context );	//��Ⱦ
			update();	//�Ե�ǰ���ݽ��е�������
		}
		,
		50 //����֡�ʣ�һ��=1000���룬֡��:1000/50=20
		);
}

////���㵹��ʱʱ��ĺ���(�������ʽ����)
//function getcurrenShowTimeSenconds() {
//	var curTime = new Date();	//��ȡ��ǰʱ��
//	//��ֹʱ������� - ��ǰʱ�������
//	var ret = endTime.getTime() - curTime.getTime()
//	ret = Math.round(ret/1000)	//ת���ɡ��롯��ת��������
//	return ret >=0 ? ret : 0 ;	//С��0˵������ʱ���˷���0
//}
 
//��д��ʱ��Ч��
function getcurrenShowTimeSenconds() {
	var curTime = new Date();
	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();

	return ret;
}

function update(){
	//��һ����ʾʱ��
	var nextShowTimeSeconds = getcurrenShowTimeSenconds();

	var nextHours = parseInt( nextShowTimeSeconds/3600);
	var nextMinutes = parseInt( (nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60

	var curHours = parseInt( curShowTimeSeconds/3600);
	var curMinutes = parseInt( (curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60
	//��һ����ʾʱ��͵�ǰʱ�䲻ͬ����ҳ���ϸı䵱ǰʱ�䡢���ɵ����С��
	if( nextSeconds != curSeconds){
		//����С��
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

		curShowTimeSeconds = nextShowTimeSeconds;//Ȼ���ٵ���render()�����ͻ����ʱ��
	}
	var chsColor = document.getElementById('canvas')
	chsColor.style.background = "rgb("+nextHours+","+nextMinutes+","+nextSeconds+")"
	//С���˶�����
	updateBalls();
}

//������С����и��²���
function updateBalls(){
	//ʱ�̸ı�С���λ��
	for( var i=0; i<balls.length;i++){

		balls[i].x += balls[i].vx;  //С��x����(��������)����x���ϵ��ٶ�ֵ(��̬)
		balls[i].y += balls[i].vy;
		//ע��vyһֱ��Ӱ��С����y���ϵ��˶�(balls[i].y��ֵ)
		balls[i].vy += balls[i].g;  //y����ٶ�ֵ��g�������ٶȵ�Ӱ����仯
		//С���Ƿ񴥵� ��ײ���
		if( balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			balls[i].vy = - balls[i].vy*0.60; //�ص���0.75�ǿ���Ħ��ϵ��
		}
	}

	//�������������С���Balls[]������ɾ��
	var cnt = 0  //��¼���ٸ�С�򻹱����ڻ�����
	for (var i = 0; i < balls.length; i++) 
		//�����Ե���ұ�Ե����
		if( balls[i].x + RADIUS >0 && balls[i].x - RADIUS < WINDOW_WIDTH)
			balls[cnt++] = balls[i]	//cnt��¼�������ڻ����е�С����Ϊ��������С���ڻ����У�����i>=cnt.
									//��С���ڻ����У���ô�Ͱ�������balls�����ǰ�棬�������������������
									//0~cnt-1(��Ϊcnt������Լ�++��һ�Σ�����Ҫ��1)�����ڻ����е�С��cnt��balls.length-1�ǻ������С��
	
	while ( balls.length > Math.min(300,cnt) ){
		balls.pop();
	}
	
}

//�������С��ĺ���
function addBalls( x, y, num ){

	for(var i=0; i<digit[num].length; i++)  
		for(var j=0; j<digit[num][i].length; j++)	
			if(digit[num][i][j] == 1){ 
				var aBall ={
					x:x+j*2*(RADIUS+1),
					y:y+i*2*(RADIUS+1),
					g:1.5+Math.random(), //С����ٶ�Ϊ1.5+0~1��������
					vx:Math.pow( -1,Math.ceil(Math.random()*1000) )*4, //x������ٶ�ֵ��-1��(0~1��������*1000ȡ��)�η��������-1or1��*4,���������
					vy:-5, //y������ٶ�ֵ��С�����ʱ������-5
					color:colors[ Math.floor( Math.random()*colors.length)] //����ȡ�������0~10������10�������
				}

				balls.push( aBall ) //��������ɵ�С����ӽ�����
			}
}

function render( cxt ){//����ʱ�ӣ�����ʱ�洢�ľ�������
	//clearRect()���������οռ��ڵ�ͼ�����ˢ�£���ֹcanvasԭ�Ȼ���ͼ�͵�ǰ����ͼ������һ��
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

	var hours = parseInt( curShowTimeSeconds/3600);
	var minutes = parseInt( (curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60

	//����rederDigit������ʼ����
	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt)//������ʾ���������ֵ�x���꣬�������ֵ�y���꣬��������Ǹ�����,�����Ļ�ͼ����
	renderDigit( MARGIN_LEFT+15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10),cxt)
	renderDigit( MARGIN_LEFT+30*(RADIUS+1), MARGIN_TOP, 10,cxt)
	renderDigit( MARGIN_LEFT+39*(RADIUS+1), MARGIN_TOP , parseInt(minutes/10) , cxt)
	renderDigit( MARGIN_LEFT+54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10),cxt)
	renderDigit( MARGIN_LEFT+69*(RADIUS+1), MARGIN_TOP, 10,cxt)
	renderDigit( MARGIN_LEFT+78*(RADIUS+1), MARGIN_TOP , parseInt(seconds/10) , cxt)
	renderDigit( MARGIN_LEFT+93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10),cxt)
	
	//�Ե���С���������б������ٶ�ÿ��С����о������
	for( var i=0; i<balls.length; i++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath()
		cxt.arc( balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI, true)
		cxt.closePath()

		cxt.fill() //
	}
}
//�������ֵĺ���
function renderDigit(x,y,num,cxt){

	cxt.fillStyle = "rgb(0,102,153)";

	for(var i=0; i<digit[num].length; i++)  //���ֵ��������߶ȣ�
		for(var j=0; j<digit[num][i].length; j++)	//����ÿ���м���СԲ��ÿ��1����һ��СԲ��
			if(digit[num][i][j] == 1){ //�����ֵΪ1�������һ��Բ
				cxt.beginPath()
				//ÿ��Բ���Ƶ�λ�ã����ǿ��Կ�Ľ�αʼ�
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI)
				cxt.closePath()
				cxt.fill()
			}
}