function toHms(t) {
    var hms = "";
    var h = t / 3600 | 0;
    var m = t % 3600 / 60 | 0;
    var s = t % 60;
    if(String(s).length === 1 && m === 0){
        var s = "0"+s
    }
    if (h != 0) {
        hms = h + ":" + padZero(m) + ":" + padZero(s);
    } else if (m != 0) {
        hms = m + ":" + padZero(s);
    } else {
        hms = "0:"+s;
    }

    return hms;

    function padZero(v) {
        if (v < 10) {
            return "0" + v;
        } else {
            return v;
        }
    }
}
function afaudio(element,file, width) {
    var ele = document.getElementById(element);
    var num = document.querySelectorAll(".audio_main").length;
    var audio_main = document.createElement("div");
    audio_main.setAttribute("id", `audio_main${num}`);
    audio_main.setAttribute("class", "audio_main")
    audio_main.setAttribute("style", `width:${width}`)
    ele.appendChild(audio_main)
    var audio_main = document.getElementById(`audio_main${num}`)
    var audio_tag = document.createElement("audio");
    audio_tag.src = file;
    audio_tag.setAttribute("id", `audio_tag${num}`);
    audio_main.appendChild(audio_tag);
    var audio_tag = document.getElementById(`audio_tag${num}`);
    var seekbar = document.createElement("div");
    seekbar.setAttribute("class", "audio_seekbar");
    seekbar.setAttribute("id", `audio_seekbar${num}`);
    audio_main.appendChild(seekbar)
    var seekbar = document.getElementById(`audio_seekbar${num}`)
    var seekbar_active = document.createElement("div");
    seekbar_active.setAttribute("id", `seekbar_active${num}`)
    seekbar_active.setAttribute("class", `seekbar_active`)
    seekbar.appendChild(seekbar_active);
    seekbar.addEventListener("click", function (e) {
        var seek = e.offsetX / seekbar.clientWidth;
        document.getElementById(`seekbar_active${num}`).style.width = `${seek * 100}%`;
        audio_tag.currentTime = audio_tag.duration * seek;
    });
    var controls = document.createElement("div");
    controls.setAttribute("id",`controls${num}`);
    controls.setAttribute("class","controls");
    audio_main.appendChild(controls)
    var controls = document.getElementById(`controls${num}`)
    var playbtn = document.createElement("button");
    playbtn.setAttribute("class", "playbtn")
    playbtn.setAttribute("id", `playbtn${num}`)
    playbtn.innerHTML = "<i class='icon-play'></i>";
    controls.appendChild(playbtn)
    document.getElementById(`playbtn${num}`).onclick = function () {
        if (audio_tag.paused === true) {
            audio_tag.play();
            playbtn.innerHTML = "<i class='icon-pause'></i>";
        } else if (audio_tag.paused == false) {
            audio_tag.pause();
            playbtn.innerHTML = "<i class='icon-play'></i>";
        }
    }
    var timearea = document.createElement("span");
    timearea.setAttribute("class", `timearea`);
    timearea.setAttribute("id", `timearea${num}`);
    timearea.innerText = "0:00";
    controls.appendChild(timearea);
    var volumearea = document.createElement("div");
    volumearea.setAttribute("class","volumearea");
    volumearea.setAttribute("id",`volumearea${num}`);
    controls.appendChild(volumearea);
    var volumearea = document.getElementById(`volumearea${num}`)
    
    var volumebar = document.createElement("div");
    volumebar.setAttribute("id",`volumebar${num}`);
    volumebar.setAttribute("class",`volumebar`);
    volumearea.appendChild(volumebar);
    var volumebtn = document.createElement("button");
    volumebtn.setAttribute("class",`volumebtn`);
    volumebtn.setAttribute("id",`volumebtn${num}`);
    volumebtn.innerHTML="<i class='icon-volume_max'></i>";
    volumebtn.onclick = function(){
        if(audio_tag.volume == 0){
            audio_tag.volume = 1;
            volumebtn.innerHTML="<i class='icon-volume_max'></i>";
            document.getElementById(`volume_active${num}`).style.width = `100%`;
        }else if(audio_tag.volume > 0){
            audio_tag.volume = 0;
            volumebtn.innerHTML="<i class='icon-volume_off'></i>";
            document.getElementById(`volume_active${num}`).style.width = `0%`;
        }
    }
    volumearea.appendChild(volumebtn)
    var volume_active= document.createElement("div");
    volume_active.setAttribute("id",`volume_active${num}`);
    volume_active.setAttribute("class","volume_active");
    volume_active.style.width = `${audio_tag.volume * 100}%`;
    var volumebar = document.getElementById(`volumebar${num}`);
    volumebar.appendChild(volume_active);
    volumebar.addEventListener("click", function (e) {
        var seek = e.offsetX / volumebar.clientWidth;
        document.getElementById(`volume_active${num}`).style.width = `${seek * 100}%`;
        audio_tag.volume = seek;
        if(seek === 0){
            volumebtn.innerHTML="<i class='icon-volume_mute'></i>";
        }else if(seek < 0.4){
            volumebtn.innerHTML="<i class='icon-volume_min'></i>";
        }else if(seek > 0.4){
            volumebtn.innerHTML="<i class='icon-volume_max'></i>";
        }
    });
    var seekfun = "audio_tag.addEventListener('timeupdate', function () { var width = audio_tag.currentTime / audio_tag.duration * 100; document.getElementById(`seekbar_active${num}`).style.width = `${width}%`;document.getElementById(`timearea${num}`).innerText = `${toHms(Math.floor(audio_tag.currentTime))}/${toHms(Math.floor(audio_tag.duration))}` });"
    eval(seekfun);
}