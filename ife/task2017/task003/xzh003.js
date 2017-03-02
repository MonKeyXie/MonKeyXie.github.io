//若页面未加载完触发addEventListener事件会导致其失效
window.onload=function(){

//阻止页面右击默认弹出菜单行为
document.oncontextmenu = function(){
    return false;
}
const menuCont  = document.querySelector(".menu-container");
const menuItems = document.querySelector(".menu-items");
const menuItem  = document.querySelectorAll(".menu-items>li");

//为右键添加菜单事件
menuCont.addEventListener("contextmenu",showRightMenu,false);

//定义右键菜单事件
function showRightMenu(event){
    e = event|| window.event;
    menuItems.style.display="block";

    //获取鼠标右键点击时的绝对位置
    var menuLeft = e.layerX;
    var menuTop = e.layerY;


    //获取网页可见区域宽高
    var viewWidth  = window.innerWidth;
    var viewHeight = window.innerHeight;

    //判断鼠标点击时是否在边界值
    if((viewHeight- e.clientY)>76){
        if((viewWidth- e.clientX)>170){
            menuItems.style.top=menuTop+"px";
            menuItems.style.left=menuLeft+"px";
        }else {
            menuItems.style.top=menuTop+"px";
            menuItems.style.left=menuLeft-170+"px";
        }
    }else{
        if((viewWidth- e.clientX)>170){
            menuItems.style.top=menuTop-76+"px";
            menuItems.style.left=menuLeft+"px";
        }else{
            menuItems.style.top=menuTop-76+"px";
            menuItems.style.left=menuLeft-170+"px";
        }
    }
}

//点击非自定义菜单区域时，隐藏自定义菜单
document.addEventListener("click",()=>menuItems.style.display="none",false);

//点击自定义菜单条目时，弹出菜单条目名称
menuItem.forEach(item=>item.addEventListener("click",()=>alert("您点击的是:"+item.innerHTML),false));
}