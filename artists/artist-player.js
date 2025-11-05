// Common JavaScript for all artist pages
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    
    // if (!isLoggedIn) {
    //     window.location.href = '../vibefy_login.html';
    //     return;
    // }

    const menuSearchBtn = document.getElementById('menuSearchBtn');
    const navbarSearchInput = document.getElementById('navbarSearchInput');
    
    if (menuSearchBtn && navbarSearchInput) {
        menuSearchBtn.addEventListener('click', function() {
            navbarSearchInput.focus();
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userName');
        window.location.href = '../vibefy_login.html';
    });
    
    // Create Playlist Modal
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const playlistModal = document.getElementById('playlistModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const playlistNameInput = document.getElementById('playlistName');
    const playlistDescriptionInput = document.getElementById('playlistDescription');
    
    createPlaylistBtn.addEventListener('click', function() {
        playlistModal.classList.add('active');
        playlistNameInput.focus();
    });
    
    cancelBtn.addEventListener('click', function() {
        playlistModal.classList.remove('active');
        playlistNameInput.value = '';
        playlistDescriptionInput.value = '';
    });
    
    playlistModal.addEventListener('click', function(e) {
        if (e.target === playlistModal) {
            playlistModal.classList.remove('active');
            playlistNameInput.value = '';
            playlistDescriptionInput.value = '';
        }
    });
    
    submitBtn.addEventListener('click', function() {
        const playlistName = playlistNameInput.value.trim();
        
        if (playlistName) {
            const scrollContainer = document.querySelector('.scroll-container');
            const newPlaylist = document.createElement('p');
            newPlaylist.textContent = playlistName;
            scrollContainer.appendChild(newPlaylist);
            
            playlistModal.classList.remove('active');
            playlistNameInput.value = '';
            playlistDescriptionInput.value = '';
        }
    });
    
    playlistNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
        }
    });
    
    // Audio Player Functionality
    const audioPlayer = document.getElementById('audioPlayer');
    const songItems = document.querySelectorAll('.song-item');
    let currentSongItem = null;
    let songsArray = Array.from(songItems);
    let currentSongIndex = -1;
    
    const playerAlbumArt = document.getElementById('playerAlbumArt');
    const playerTrackName = document.getElementById('playerTrackName');
    const playerArtistName = document.getElementById('playerArtistName');
    const playerPlayBtn = document.getElementById('playerPlayBtn');
    const playerPrevBtn = document.getElementById('playerPrevBtn');
    const playerNextBtn = document.getElementById('playerNextBtn');
    const playerCurrentTime = document.getElementById('playerCurrentTime');
    const playerTotalTime = document.getElementById('playerTotalTime');
    const playerProgressBar = document.getElementById('playerProgressBar');
    const playerProgressFill = document.getElementById('playerProgressFill');
    const playerVolumeBar = document.getElementById('playerVolumeBar');
    const playerVolumeFill = document.getElementById('playerVolumeFill');
    const playerVolumeBtn = document.getElementById('playerVolumeBtn');
    const playAllBtn = document.getElementById('playAllBtn');
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    function updatePlayerUI(songItem) {
        const coverPath = songItem.getAttribute('data-cover');
        const songTitle = songItem.querySelector('.song-title').textContent;
        const songArtist = songItem.querySelector('.song-artist').textContent;
        
        playerAlbumArt.src = coverPath;
        playerTrackName.textContent = songTitle;
        playerArtistName.textContent = songArtist;
    }
    
    function playSong(songItem, index) {
        const songPath = songItem.getAttribute('data-song');
        
        if (currentSongItem) {
            currentSongItem.classList.remove('playing');
            const prevBtn = currentSongItem.querySelector('.song-play-btn');
            prevBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
        
        audioPlayer.src = songPath;
        audioPlayer.play();
        songItem.classList.add('playing');
        const playBtn = songItem.querySelector('.song-play-btn');
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playerPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        
        currentSongItem = songItem;
        currentSongIndex = index;
        updatePlayerUI(songItem);
    }
    
    function togglePlayPause() {
        if (audioPlayer.paused) {
            if (currentSongItem) {
                audioPlayer.play();
                playerPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                const playBtn = currentSongItem.querySelector('.song-play-btn');
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            } else {
                playSong(songsArray[0], 0);
            }
        } else {
            audioPlayer.pause();
            playerPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            if (currentSongItem) {
                const playBtn = currentSongItem.querySelector('.song-play-btn');
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        }
    }
    
    songItems.forEach(function(songItem, index) {
        const playBtn = songItem.querySelector('.song-play-btn');
        
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (currentSongItem === songItem && !audioPlayer.paused) {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                playerPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                songItem.classList.remove('playing');
                return;
            }
            
            playSong(songItem, index);
        });
        
        songItem.addEventListener('click', function() {
            playBtn.click();
        });
    });
    
    if (playAllBtn) {
        playAllBtn.addEventListener('click', function() {
            playSong(songsArray[0], 0);
        });
    }
    
    playerPlayBtn.addEventListener('click', togglePlayPause);
    
    playerPrevBtn.addEventListener('click', function() {
        if (currentSongIndex > 0) {
            playSong(songsArray[currentSongIndex - 1], currentSongIndex - 1);
        }
    });
    
    playerNextBtn.addEventListener('click', function() {
        if (currentSongIndex < songsArray.length - 1) {
            playSong(songsArray[currentSongIndex + 1], currentSongIndex + 1);
        }
    });
    
    audioPlayer.addEventListener('ended', function() {
        if (currentSongItem) {
            currentSongItem.classList.remove('playing');
            const playBtn = currentSongItem.querySelector('.song-play-btn');
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playerPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
        if (currentSongIndex < songsArray.length - 1) {
            playSong(songsArray[currentSongIndex + 1], currentSongIndex + 1);
        }
    });
    
    audioPlayer.addEventListener('timeupdate', function() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            playerProgressFill.style.width = progress + '%';
            playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
        }
    });
    
    audioPlayer.addEventListener('loadedmetadata', function() {
        playerTotalTime.textContent = formatTime(audioPlayer.duration);
    });
    
    let isSeekingProgress = false;
    
    playerProgressBar.addEventListener('mousedown', function(e) {
        isSeekingProgress = true;
        playerProgressBar.classList.add('seeking');
        seekToPosition(e);
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isSeekingProgress) {
            seekToPosition(e);
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isSeekingProgress) {
            isSeekingProgress = false;
            playerProgressBar.classList.remove('seeking');
        }
    });
    
    function seekToPosition(e) {
        if (audioPlayer.duration) {
            const rect = playerProgressBar.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            audioPlayer.currentTime = percent * audioPlayer.duration;
        }
    }
    
    let isAdjustingVolume = false;
    audioPlayer.volume = 0.7;
    playerVolumeFill.style.width = '70%';
    
    playerVolumeBar.addEventListener('mousedown', function(e) {
        isAdjustingVolume = true;
        playerVolumeBar.classList.add('adjusting');
        setVolume(e);
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isAdjustingVolume) {
            setVolume(e);
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isAdjustingVolume) {
            isAdjustingVolume = false;
            playerVolumeBar.classList.remove('adjusting');
        }
    });
    
    function setVolume(e) {
        const rect = playerVolumeBar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        audioPlayer.volume = percent;
        playerVolumeFill.style.width = (percent * 100) + '%';
        
        if (percent === 0) {
            playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else if (percent < 0.5) {
            playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
        } else {
            playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    }
    
    let previousVolume = 0.7;
    playerVolumeBtn.addEventListener('click', function() {
        if (audioPlayer.volume > 0) {
            previousVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            playerVolumeFill.style.width = '0%';
            playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            audioPlayer.volume = previousVolume;
            playerVolumeFill.style.width = (previousVolume * 100) + '%';
            if (previousVolume < 0.5) {
                playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
            } else {
                playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        }
    });
});