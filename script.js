// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    // Helpers for safer DOM work
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const on = (el, evt, handler, opts) => { if (el) el.addEventListener(evt, handler, opts); return el; };
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    const userName = sessionStorage.getItem('userName');
    
    // If not logged in, redirect to login page
    if (!isLoggedIn) {
        window.location.href = 'vibefy_login.html';
        return;
    }
    
    // Set username in dropdown
    if (userName) {
        const displayUsername = document.getElementById('displayUsername');
        const dropdownUsername = document.getElementById('dropdownUsername');
        if (displayUsername) displayUsername.textContent = userName;
        if (dropdownUsername) dropdownUsername.textContent = userName;
    }
    
    const menuSearchBtn = document.getElementById('menuSearchBtn');
    const navbarSearchInput = document.getElementById('navbarSearchInput');
    
    if (menuSearchBtn && navbarSearchInput) {
        menuSearchBtn.addEventListener('click', function() {
            navbarSearchInput.focus();
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    on(logoutBtn, 'click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userName');
        window.location.href = 'vibefy_login.html';
    });
    
    // Create Playlist Modal functionality
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const playlistModal = document.getElementById('playlistModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const playlistNameInput = document.getElementById('playlistName');
    const playlistDescriptionInput = document.getElementById('playlistDescription');

    if (createPlaylistBtn && playlistModal && cancelBtn && submitBtn && playlistNameInput && playlistDescriptionInput) {
        const closePlaylistModal = () => {
            playlistModal.classList.remove('active');
            playlistNameInput.value = '';
            playlistDescriptionInput.value = '';
        };

        on(createPlaylistBtn, 'click', function() {
            playlistModal.classList.add('active');
            playlistNameInput.focus();
        });

        on(cancelBtn, 'click', closePlaylistModal);

        on(playlistModal, 'click', function(e) {
            if (e.target === playlistModal) closePlaylistModal();
        });

        on(submitBtn, 'click', function() {
            const playlistName = playlistNameInput.value.trim();
            const playlistDescription = playlistDescriptionInput.value.trim();

            if (playlistName) {
                const scrollContainer = document.querySelector('.scroll-container');
                if (scrollContainer) {
                    const newPlaylist = document.createElement('p');
                    newPlaylist.textContent = playlistName;
                    scrollContainer.appendChild(newPlaylist);
                } else {
                    console.warn('scroll-container not found; playlist not added to sidebar');
                }
                closePlaylistModal();
                console.log('Playlist created:', playlistName, playlistDescription);
            } else {
                playlistNameInput.focus();
            }
        });

        // Enter key submits
        on(playlistNameInput, 'keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }
    
    // Artist Card Click - Redirect to artist pages
    const artistCards = document.querySelectorAll('.music-card[data-artist]');
    
    artistCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const artistName = card.getAttribute('data-artist');
            window.location.href = 'artists/' + artistName + '.html';
        });
    });
    
    // Audio Player Functionality
    const audioPlayer = document.getElementById('audioPlayer');
    const songItems = document.querySelectorAll('.song-item');
    let currentSongItem = null;
    let songsArray = Array.from(songItems);
    let currentSongIndex = -1;

    // Bottom player elements
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
    
    // Function to format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    // UI helpers
    function updatePlayerUI(songItem) {
        if (!songItem) return;
        const coverPath = songItem.getAttribute('data-cover');
        const songTitle = songItem.querySelector('.song-title')?.textContent || '';
        const songArtist = songItem.querySelector('.song-artist')?.textContent || '';
        if (playerAlbumArt && coverPath) playerAlbumArt.src = coverPath;
        if (playerTrackName) playerTrackName.textContent = songTitle;
        if (playerArtistName) playerArtistName.textContent = songArtist;
    }

    function setItemPlayState(songItem, isPlaying) {
        if (!songItem) return;
        songItem.classList.toggle('playing', !!isPlaying);
        const btn = songItem.querySelector('.song-play-btn');
        if (btn) btn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }

    function setGlobalPlayBtn(isPlaying) {
        if (playerPlayBtn) playerPlayBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }
    
    // Function to play song
    function playSong(songItem, index) {
        const songPath = songItem.getAttribute('data-song');
        
        // Stop previous song
        if (currentSongItem) {
            setItemPlayState(currentSongItem, false);
        }
        
        // Play new song
        if (audioPlayer) {
            audioPlayer.src = songPath;
            audioPlayer.play();
        }
        setItemPlayState(songItem, true);
        setGlobalPlayBtn(true);
        
        currentSongItem = songItem;
        currentSongIndex = index;
        updatePlayerUI(songItem);
    }
    
    // Function to toggle play/pause
    function togglePlayPause() {
        if (!audioPlayer) return;
        if (audioPlayer.paused) {
            if (currentSongItem) {
                audioPlayer.play();
                setGlobalPlayBtn(true);
                setItemPlayState(currentSongItem, true);
            } else if (songsArray.length > 0) {
                // Play first song if none selected
                playSong(songsArray[0], 0);
            }
        } else {
            audioPlayer.pause();
            setGlobalPlayBtn(false);
            if (currentSongItem) setItemPlayState(currentSongItem, false);
        }
    }
    
    songsArray.forEach(function(songItem, index) {
        const playBtn = songItem.querySelector('.song-play-btn');

        // Play button click
        on(playBtn, 'click', function(e) {
            e.stopPropagation();
            if (!audioPlayer) return;
            // If clicking the currently playing song, pause it
            if (currentSongItem === songItem && !audioPlayer.paused) {
                audioPlayer.pause();
                setItemPlayState(songItem, false);
                setGlobalPlayBtn(false);
                return;
            }
            playSong(songItem, index);
        });

        // Click on song item to play
        on(songItem, 'click', function() {
            playBtn?.click();
        });
    });
    
    // Bottom player controls
    on(playerPlayBtn, 'click', togglePlayPause);

    on(playerPrevBtn, 'click', function() {
        if (currentSongIndex > 0) {
            playSong(songsArray[currentSongIndex - 1], currentSongIndex - 1);
        }
    });

    on(playerNextBtn, 'click', function() {
        if (currentSongIndex < songsArray.length - 1) {
            playSong(songsArray[currentSongIndex + 1], currentSongIndex + 1);
        }
    });
    
    // Audio player events
    on(audioPlayer, 'ended', function() {
        if (currentSongItem) setItemPlayState(currentSongItem, false);
        setGlobalPlayBtn(false);
        // Auto-play next song
        if (currentSongIndex < songsArray.length - 1) {
            playSong(songsArray[currentSongIndex + 1], currentSongIndex + 1);
        }
    });
    
    // Update progress bar
    // Throttle timeupdate UI via rAF
    let rafPending = false;
    function updateProgressUI() {
        if (!audioPlayer) return;
        const duration = audioPlayer.duration || 0;
        if (duration) {
            const progress = (audioPlayer.currentTime / duration) * 100;
            if (playerProgressFill) playerProgressFill.style.width = progress + '%';
            if (playerCurrentTime) playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
        }
        rafPending = false;
    }
    on(audioPlayer, 'timeupdate', function() {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(updateProgressUI);
        }
    });
    
    // Update total time when metadata loads
    on(audioPlayer, 'loadedmetadata', function() {
        if (playerTotalTime) playerTotalTime.textContent = formatTime(audioPlayer.duration);
    });
    
    // Progress bar seeking with drag support
    function seekToPosition(e) {
        if (audioPlayer.duration) {
            const rect = playerProgressBar.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent)); // Clamp between 0 and 1
            audioPlayer.currentTime = percent * audioPlayer.duration;
        }
    }

    // Attach/detach drag listeners for seeking
    if (playerProgressBar) {
        on(playerProgressBar, 'mousedown', function(e) {
            playerProgressBar.classList.add('seeking');
            seekToPosition(e);
            const move = (ev) => seekToPosition(ev);
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                playerProgressBar.classList.remove('seeking');
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }
    
    // Volume control with drag support
    if (audioPlayer) {
        audioPlayer.volume = 0.7;
        if (playerVolumeFill) playerVolumeFill.style.width = '70%';
    }

    if (playerVolumeBar) {
        on(playerVolumeBar, 'mousedown', function(e) {
            playerVolumeBar.classList.add('adjusting');
            setVolume(e);
            const move = (ev) => setVolume(ev);
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                playerVolumeBar.classList.remove('adjusting');
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }
    
    function setVolume(e) {
        if (!playerVolumeBar || !audioPlayer) return;
        const rect = playerVolumeBar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent)); // Clamp between 0 and 1
        audioPlayer.volume = percent;
        if (playerVolumeFill) playerVolumeFill.style.width = (percent * 100) + '%';
        
        // Update volume icon
        if (playerVolumeBtn) {
            if (percent === 0) {
                playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else if (percent < 0.5) {
                playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
            } else {
                playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        }
    }
    let previousVolume = 0.7;
    on(playerVolumeBtn, 'click', function() {
        if (!audioPlayer) return;
        if (audioPlayer.volume > 0) {
            previousVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            if (playerVolumeFill) playerVolumeFill.style.width = '0%';
            if (playerVolumeBtn) playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            audioPlayer.volume = previousVolume;
            if (playerVolumeFill) playerVolumeFill.style.width = (previousVolume * 100) + '%';
            if (playerVolumeBtn) {
                if (previousVolume < 0.5) {
                    playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
                } else {
                    playerVolumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                }
            }
        }
    });
});