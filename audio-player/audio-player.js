document.addEventListener('DOMContentLoaded', function(){ 
    let audioPlayer = document.querySelector(".js-audio-player");
    let audio = new Audio(audioPlayer.dataset.song);

    let imageAudioPlayer = document.querySelector(".js-audio-player-image");
    let titleAudioPlayer = document.querySelector(".js-audio-player-title");
    let peopleAudioPlayer = document.querySelector(".js-audio-player-people");
    let progressBar = document.querySelector(".js-audio-player-progress");
    let timeLength = document.querySelector(".js-audio-player-time-length");
    let volumeInput = document.querySelector('.js-audio-player-valume-change');
    let timeline = document.querySelector(".js-audio-player-timeline");
    let newMusics = document.querySelectorAll(".js-audio-player-new-music");
    let currentTime = document.querySelector(".js-audio-player-time-current");

    //let btn
    let openPlayListBtn = document.querySelector(".js-audio-player-burger");
    let rewindBtnNext = document.querySelector(".js-audio-player-next");
    let rewindBtnPrev = document.querySelector(".js-audio-player-prev");
    let closePlayerBtn = document.querySelector(".js-audio-player-close");
    let playBtn = document.querySelector(".js-audio-player-play");
    let muteBtn = document.querySelector(".js-audio-player-mute");

    //let playlist
    let closePlayListBtn = document.querySelector(".js-playlist-close");
    let playList = document.querySelector(".js-playlist");

    //toggle between playing and pausing on button click
    playBtn.addEventListener("click", function(){
        timeLength.textContent = getTimeCodeFromNum(audio.duration)
        startOrStopMusic();
    });
    
    //set song duration
    audio.addEventListener("loadeddata", function(){
            audio.volume = 0.1;
        },
        false
    );

    //click on timeline to skip around
    timeline.addEventListener("click", function(e) {
        let timelineWidth = window.getComputedStyle(timeline).width;
        let timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
    });

    //Rewind
    const REWIND_SECOND = 15;
    rewindBtnNext.addEventListener("click", function(e){
        var timeToSeek = audio.currentTime + REWIND_SECOND;
        if(timeToSeek < audio.duration){
            currentTime.textContent = getTimeCodeFromNum(timeToSeek);
            audio.currentTime = timeToSeek;
        } else {
            timeToSeek = audio.duration - 1;
            currentTime.textContent = getTimeCodeFromNum(timeToSeek);
            audio.currentTime = timeToSeek;
        }
    });
    rewindBtnPrev.addEventListener("click", function(e){
        var timeToSeek = audio.currentTime - REWIND_SECOND;
        if(timeToSeek > 0){
            currentTime.textContent = getTimeCodeFromNum(timeToSeek);
            audio.currentTime = timeToSeek;
        } else {
            timeToSeek = 0;
            currentTime.textContent = getTimeCodeFromNum(timeToSeek);
            audio.currentTime = timeToSeek;
        }
    });

    //check audio percentage and update time accordingly
    let intervalProgressBar;
    function startTrackProgressAudio(){
        intervalProgressBar = setInterval(function(){
            if (!audio.paused) {
                playBtn.classList.add("active");
            } else {
                playBtn.classList.remove("active");
            }
        }, 500);
    }
    setInterval(function(){
        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
        currentTime.textContent = getTimeCodeFromNum(audio.currentTime);
    }, 300);

    function stopTrackProgressAudio(){
        clearInterval(intervalProgressBar);
    }

    //volume change
    volumeInput.addEventListener("input", function(){
        audio.volume = this.value;
        var value = (this.value-this.min)/(this.max-this.min)*100
        this.style.background = 'linear-gradient(to right, #004ea8 0%, #004ea8 ' + value + '%, #B9D9EB ' + value + '%, #B9D9EB 100%)'
    });

    //mute audio
    muteBtn.addEventListener("click", function() {
        audio.muted = !audio.muted;
        if (audio.muted) {
            muteBtn.classList.add("muted");
            audio.volume = 0;
            volumeInput.value = 0;
        } else {
            muteBtn.classList.remove("muted");
            audio.volume = 0.1;
            volumeInput.value = 0.1;
        }
    });

    //close audioPlayer
    closePlayerBtn.addEventListener("click", function() {
        document.querySelectorAll('.js-audio-player-new-music').forEach(function(item){
            item.classList.remove('active');
        });

        audioPlayer.classList.remove('active');
        audio.pause();
    });

    //on new music
    newMusics.forEach(function(newMusic) {
        newMusic.addEventListener("click", function() {
            document.querySelectorAll('.js-audio-player-new-music').forEach(function(item){
                item.classList.remove('active');
            });
            this.classList.add('active');

            let data = this.dataset;
            imageAudioPlayer.src = data.img;
            titleAudioPlayer.innerText = data.title;
            peopleAudioPlayer.innerText = data.people;
            newMusicStart(data.song);
        });
    });

    openPlayListBtn.addEventListener("click", function() {
        playList.classList.add('active');
    });
    closePlayListBtn.addEventListener("click", function() {
        playList.classList.remove('active');
    });

    function newMusicStart(song){
        audio.pause();
        audio = new Audio(song);
        startOrStopMusic();
        setTimeout(function(){
            timeLength.textContent = getTimeCodeFromNum(audio.duration);
        }, 1000);
    }    

    function startOrStopMusic() {
        audioPlayer.classList.add('active');
        if (audio.paused) {
            playBtn.classList.add("active");
            audio.play();
            startTrackProgressAudio();
        } else {
            playBtn.classList.remove("active");
            audio.pause();
            stopTrackProgressAudio();
        }
    }

    function getTimeCodeFromNum(num) {
        var seconds = parseInt(num);
        var minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        var hours = parseInt(minutes / 60);
        minutes -= hours * 60;
    
        if (hours === 0) {
            return minutes +':'+ String(seconds % 60).padStart(2, 0);
        }
        return String(hours).padStart(2, 0)+':'+ minutes+':'+String(seconds % 60).padStart(2, 0);
    }

});

