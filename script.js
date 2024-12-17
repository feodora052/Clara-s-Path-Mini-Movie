
const videoPlayer = document.getElementById('video-player');
const hotspotOverlay = document.getElementById('hotspot-overlay');
const playPauseBtn = document.getElementById('play-pause');
const timelineSlider = document.getElementById('timeline-slider');
const timestampDisplay = document.getElementById('timestamp-display');

const videoList = ["videos/Start_Scene.mp4","videos/Scene_2.mp4","videos/Scene_3.mp4","videos/Scene_4.mp4","videos/Scene_5.mp4","videos/Scene_6 Call Nina.mp4","videos/Scene_7.mp4","videos/Scene_8.mp4","videos/Scene_9 Painting.mp4","videos/Scene_10.mp4","videos/Scene_11.mp4","videos/Scene_12.mp4","videos/Scene_13.mp4","videos/Scene_14.mp4","videos/Scene_15.mp4"];
const hotspotsByVideo = {"videos/Start_Scene.mp4":[{"x":1584.6742677389263,"y":46.51341851001294,"width":306.51339801526615,"height":67.4329490234765,"text":"Scene 2","externalLink":"","videoLink":"videos/Scene_2.mp4","time":8.908292,"startTime":6,"endTime":17}],"videos/Scene_2.mp4":[{"x":1606.130205599995,"y":15.862078044796355,"width":321.83906791602953,"height":134.86589804695296,"text":"Scene 3","externalLink":"","videoLink":"videos/Scene_3.mp4","time":1.914693,"startTime":1,"endTime":16}],"videos/Scene_3.mp4":[{"x":1609.1953395801477,"y":52.64368660305626,"width":275.8620582137394,"height":91.95402139564976,"text":"Scene 4","externalLink":"","videoLink":"videos/Scene_4.mp4","time":3.609118,"startTime":2,"endTime":15}],"videos/Scene_4.mp4":[{"x":1563.2183298778577,"y":25.05748018436133,"width":340.2298717969454,"height":128.73562995390967,"text":"Scene 5","externalLink":"","videoLink":"videos/Scene_5.mp4","time":0.633997,"startTime":0,"endTime":10}],"videos/Scene_5.mp4":[{"x":128.7356271664118,"y":460.30651479043684,"width":594.6359921496164,"height":140.99616613999626,"text":"Scene 6 Call Nina","externalLink":"","videoLink":"videos/Scene_6 Call Nina.mp4","time":2.731694,"startTime":1,"endTime":7},{"x":1094.2528309145002,"y":454.17624669739354,"width":717.241351355723,"height":159.38697041912627,"text":"Scene 9 Painting","externalLink":"","videoLink":"videos/Scene_9 Painting.mp4","time":2.731694,"startTime":1,"endTime":7}],"videos/Scene_6 Call Nina.mp4":[{"x":1642.911813361827,"y":37.318016370447964,"width":220.6896465709915,"height":110.34482567477971,"text":"Scene 7","externalLink":"","videoLink":"videos/Scene_7.mp4","time":11.218146,"startTime":8,"endTime":20}],"videos/Scene_7.mp4":[{"x":1563.2183298778577,"y":46.51341851001294,"width":331.0344698564875,"height":98.08428948869309,"text":"Scene 8","externalLink":"","videoLink":"videos/Scene_8.mp4","time":1.90374,"startTime":0,"endTime":4}],"videos/Scene_8.mp4":[{"x":1520.3064541557203,"y":46.51341851001294,"width":395.4022834396935,"height":125.67049590738799,"text":"Start Again","externalLink":"","videoLink":"videos/Start_Scene.mp4","time":5.564155,"startTime":2,"endTime":24}],"videos/Scene_9 Painting.mp4":[{"x":1627.5861434610636,"y":25.05748018436133,"width":272.7969242335869,"height":98.08428948869306,"text":"Scene 10","externalLink":"","videoLink":"videos/Scene_10.mp4","time":2.570557,"startTime":1,"endTime":7}],"videos/Scene_10.mp4":[{"x":1621.455875500758,"y":21.99234613783967,"width":260.53638831297644,"height":113.40995972130138,"text":"Scene 11","externalLink":"","videoLink":"videos/Scene_11.mp4","time":2.228148,"startTime":1,"endTime":13}],"videos/Scene_11.mp4":[{"x":1649.0420813221322,"y":37.318016370447964,"width":205.36397667022834,"height":85.82375330260643,"text":"Scene 12","externalLink":"","videoLink":"videos/Scene_12.mp4","time":3.491449,"startTime":2,"endTime":11}],"videos/Scene_12.mp4":[{"x":1642.911813361827,"y":28.12261423088299,"width":232.95018249160216,"height":107.27969162825806,"text":"Scene 13","externalLink":"","videoLink":"videos/Scene_13.mp4","time":0.704851,"startTime":0,"endTime":10}],"videos/Scene_13.mp4":[{"x":1627.5861434610636,"y":28.12261423088299,"width":214.55937861068628,"height":98.08428948869307,"text":"Scene 14","externalLink":"","videoLink":"videos/Scene_14.mp4","time":1.348264,"startTime":1,"endTime":13}],"videos/Scene_14.mp4":[{"x":1655.1723492824376,"y":25.05748018436133,"width":211.49424463053356,"height":95.01915544217141,"text":"Scene 15","externalLink":"","videoLink":"videos/Scene_15.mp4","time":2.254757,"startTime":0,"endTime":16}],"videos/Scene_15.mp4":[{"x":1554.0229279373996,"y":25.05748018436133,"width":392.3371494595408,"height":95.01915544217141,"text":"Play Again","externalLink":"","videoLink":"videos/Start_Scene.mp4","time":5.283443,"startTime":2,"endTime":30}]};
const videoOptions = {};

let currentVideoPath = null;
let originalVideoWidth = 0;
let originalVideoHeight = 0;

function initializePlayer() {
    currentVideoPath = videoList[0];
    loadVideo(currentVideoPath);
    updateControls();
    window.addEventListener('resize', handleResize);
}

function loadVideo(filePath) {
    currentVideoPath = filePath;
    videoPlayer.src = filePath;
    videoPlayer.style.display = 'block';

    videoPlayer.onloadedmetadata = function() {
        originalVideoWidth = videoPlayer.videoWidth;
        originalVideoHeight = videoPlayer.videoHeight;
        renderHotspots();
    };

    const options = videoOptions[filePath] || {};
    videoPlayer.loop = options.loop || false;

    updateTimestamp();
    videoPlayer.currentTime = 0;
    timelineSlider.value = 0;

    videoPlayer.play();
}

function renderHotspots() {
    hotspotOverlay.innerHTML = '';
    if (currentVideoPath && hotspotsByVideo[currentVideoPath]) {
        const videoRect = videoPlayer.getBoundingClientRect();
        const scaleX = videoRect.width / originalVideoWidth;
        const scaleY = videoRect.height / originalVideoHeight;

        hotspotsByVideo[currentVideoPath].forEach((hotspot, index) => {
            const hotspotElement = document.createElement('div');
            hotspotElement.className = 'hotspot';
            hotspotElement.style.left = `${hotspot.x * scaleX}px`;
            hotspotElement.style.top = `${hotspot.y * scaleY}px`;
            hotspotElement.style.width = `${hotspot.width * scaleX}px`;
            hotspotElement.style.height = `${hotspot.height * scaleY}px`;
            hotspotElement.dataset.index = index;
            hotspotElement.addEventListener('click', handleHotspotClick);
            
            hotspotOverlay.appendChild(hotspotElement);
        });
    }
    updateHotspotVisibility();
}

function handleHotspotClick(event) {
    event.stopPropagation();
    const index = parseInt(event.target.dataset.index);
    const hotspot = hotspotsByVideo[currentVideoPath][index];
    
    if (hotspot.videoLink) {
        loadVideo(hotspot.videoLink);
    } else if (hotspot.externalLink) {
        window.open(hotspot.externalLink, '_blank');
    } else {
        alert(hotspot.text);
    }
}

function updateControls() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('timeupdate', updateTimelineSlider);
    videoPlayer.addEventListener('loadedmetadata', updateTimestamp);
    timelineSlider.addEventListener('input', seekVideo);
    videoPlayer.addEventListener('ended', handleVideoEnd);
}

function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function updateTimelineSlider() {
    const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    timelineSlider.value = percentage;
    updateTimestamp();
    updateHotspotVisibility();
}

function seekVideo() {
    const time = (timelineSlider.value / 100) * videoPlayer.duration;
    videoPlayer.currentTime = time;
    updateTimestamp();
    updateHotspotVisibility();
}

function updateTimestamp() {
    const currentTime = formatTime(videoPlayer.currentTime);
    const duration = formatTime(videoPlayer.duration);
    timestampDisplay.textContent = `${currentTime} / ${duration}`;
}

function handleVideoEnd() {
    const options = videoOptions[currentVideoPath] || {};
    if (options.loop) {
        videoPlayer.currentTime = 0;
        videoPlayer.play();
    } else if (options.playNext) {
        loadVideo(options.playNext);
    }
}

function formatTime(timeInSeconds) {
    if (!timeInSeconds || isNaN(timeInSeconds)) {
        return "00:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function handleResize() {
    if (videoPlayer.videoWidth > 0) {
        renderHotspots();
    }
}

function updateHotspotVisibility() {
    const currentTime = videoPlayer.currentTime;
    if (currentVideoPath && hotspotsByVideo[currentVideoPath]) {
        hotspotsByVideo[currentVideoPath].forEach((hotspot, index) => {
            const hotspotElement = hotspotOverlay.querySelector(`[data-index="${index}"]`);
            if (hotspotElement) {
                const isVisible = currentTime >= hotspot.startTime && currentTime <= hotspot.endTime;
                hotspotElement.style.display = isVisible ? 'block' : 'none';
            }
        });
    }
}

videoPlayer.addEventListener('timeupdate', updateHotspotVisibility);

initializePlayer();
    