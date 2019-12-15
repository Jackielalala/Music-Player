function $(selector){
    return document.querySelector(selector);
}

function getAjaxData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/music.json',true);
    xhr.send();
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
            getMusicList(JSON.parse(xhr.responseText));
        }else{
            console.log('error');
        }
    }     
}
getAjaxData();

var audio = new Audio();
audio.volume = 0.02;
var musicList;
var index;

function getMusicList(obj){
    musicList = obj;
    index = 0;
    pickUp(0);
    console.log(musicList);
    playMusic();
    forwardMusic();
    backwardMusic();

}
function pickUp(Index){
    audio.src = musicList[Index].url;
    $('body').style.backgroundImage = 'url('+ musicList[Index].backgroundImg + ')';
    $('.musicBox').style.backgroundImage = 'url(' + musicList[Index].cover + ')';
    $('.song').innerText = musicList[Index].name;
    $('.singer').innerText = musicList[Index].singer;
    console.log(Index);
}

function playMusic(){ 
    $('.musicplay').onclick = function(){
        if($('.musicplay').classList.contains('icon-play')){
            this.classList.toggle('icon-play');
            this.classList.toggle('icon-pause');
            audio.play();
        }else if($('.musicplay').classList.contains('icon-pause')){  
            this.classList.toggle('icon-play');
            this.classList.toggle('icon-pause');
            audio.pause();    
        }   
    }
}

function forwardMusic(){
    $('.icon-forward').onclick = function(){
        pickUp((musicList.length+(++index))%musicList.length);
        audio.autoplay = true;
        if($('.musicplay').classList.contains('icon-play')){
            $('.musicplay').classList.toggle('icon-play');
            $('.musicplay').classList.toggle('icon-pause');
        }
    }
}

function backwardMusic(){
    $('.icon-backward').onclick = function(){
        pickUp((musicList.length+(--index))%musicList.length);
        audio.autoplay = true;
        if($('.musicplay').classList.contains('icon-play')){
            $('.musicplay').classList.toggle('icon-play');
            $('.musicplay').classList.toggle('icon-pause');
        }
    }
}

audio.ontimeupdate=function(){
    var min = Math.floor(audio.currentTime/60);
    var sec = (Math.floor(audio.currentTime) - min*60) >= 10 ? (Math.floor(audio.currentTime) - min*60) : '0'+ (Math.floor(audio.currentTime) - min*60);
    setTimeout(function(){
        $('.time').innerText = min + ':' + sec;
        var numstr = (/\d{3,}/g.exec(getComputedStyle($('.progress')).width))[0]
        //正则去除getComputedStyle获取的数据的尾部字符
        var widthNum = Number(numstr);
        //$('progress')的长度值
   
        $('.currentProgress').style.width = (audio.currentTime/audio.duration) * widthNum + 'px';
        //切记style属性下的width属性也是尾部有’px'单位的字符串
        console.log($('.currentProgress').style.width)
    },1000);

}

$('.progress').onclick = function(e){
    audio.currentTime = e.offsetX / Number((/\d{3,}/g.exec(getComputedStyle($('.progress')).width))[0]) * audio.duration;
    $('.currentProgress').style.width = e.offsetX + 'px';//鼠标点击后音乐跳转到指定时间点上去
}

audio.onended = function(){
    $('.musicplay').classList.toggle('icon-play');
    $('.musicplay').classList.toggle('icon-pause');
}

