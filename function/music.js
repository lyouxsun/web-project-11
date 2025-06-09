let music = document.getElementById('music');
let audio = document.getElementById('bgMusic');
audio.volume = 0.2;
let srcArr = ['../images/mute.png', '../images/volume.png']
let index = 0;
music.addEventListener('click', function() {
    index = 1 - index;
    music.src = srcArr[index];
    if (index)
        audio.play();
    else
        audio.pause();
});