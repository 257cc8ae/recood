//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
function startRecording() {
	console.log("recordButton clicked");
	var constraints = { audio: true, video: false }
	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false
	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
		audioContext = new AudioContext();
		document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input, { numChannels: 1 })
		rec.record()
		console.log("Recording started");
	}).catch(function (err) {
		recordButton.disabled = false;
		stopButton.disabled = true;
		pauseButton.disabled = true
	});
	document.querySelector(".modal").style.display = "block";
	document.querySelector(".time").setAttribute("p","yes");
}
function pauseRecording() {
	if (rec.recording) {
		rec.stop();
		pauseButton.innerHTML = `<i class="icon-pause">`;
		document.querySelector(".time").setAttribute("p","no");
		mic(false)
	} else {
		rec.record()
		pauseButton.innerHTML = `<i class="icon-pause">`;
		document.querySelector(".time").setAttribute("p","yes")
		mic(true)
	}
}
function stopRecording() {
	console.log("stopButton clicked");
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;
	pauseButton.innerHTML = `<i class="icon-pause">`;
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(createDownloadLink);
	document.querySelector(".modal").style.display = "none";
	document.querySelector(".time").setAttribute("n","0")
	document.querySelector(".time").setAttribute("p","no")
	mic(true)
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var num = document.querySelectorAll(".audio_result_card").length;
	var card = document.createElement("div");
	var filename = new Date().toISOString();
	card.setAttribute("class","audio_result_card")
	card.setAttribute("id",`audio_result_card${num}`);
	document.getElementById("result").appendChild(card);
	var card = document.getElementById(`audio_result_card${num}`);
	var name = document.createElement("p");
	name.innerText=filename+".wav";
	name.setAttribute("class","filename");
	card.appendChild(name);
	afaudio(`audio_result_card${num}`,url,"100%");
	var link = document.createElement("a")
	link.href = url;
	link.download = filename + ".wav";
	link.innerHTML = "DOWNLOAD";
	link.setAttribute("class","downloadlink ripple")
	card.appendChild(link)
}
function counttime(){
	var time = document.querySelector(".time");
	if(time.getAttribute("p") === "yes"){
		time.innerHTML = toHms(Number(time.getAttribute("n")) + 1)
		time.setAttribute("n",String(Number(time.getAttribute("n")) + 1))
	}
}
function mic(s){
	if(s === true){
		document.querySelector(".volume-viewer-volume").style.display="block";
		document.getElementById("vv").setAttribute("class","volume-viewer");
	}else if(s === false){
		document.querySelector(".volume-viewer-volume").style.display="none";
		document.getElementById("vv").setAttribute("class","volume-viewer-false");
	}
}
setInterval(counttime,1000);