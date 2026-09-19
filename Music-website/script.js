// The Real Music House - Interactive Audio Player Script

document.addEventListener('DOMContentLoaded', () => {
    // Audio Tracks Data
    const tracks = [
        {
            title: "Faded (Remix Edition)",
            artist: "Alan Walker",
            src: "images/Walker.mp3",
            cover: "images/img.jpg",
            badge: "Electronic / Chill"
        },
        {
            title: "Melodic Vibes (Original Mix)",
            artist: "The Real Music House",
            src: "images/sds.mp3",
            cover: "images/image.png",
            badge: "Deep House / Beats"
        }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    // DOM Elements
    const audio = document.getElementById('mysong');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const trackBadge = document.getElementById('track-badge');
    const albumArt = document.getElementById('album-art');
    const discWrapper = document.getElementById('disc-wrapper');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');
    const equalizer = document.getElementById('equalizer');
    const repeatBtn = document.getElementById('repeat-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const trackListItems = document.querySelectorAll('.playlist-item');
    const trackCardPlays = document.querySelectorAll('.card-play-btn');
    const heroPlayDirect = document.getElementById('hero-play-direct');

    // Mobile Navigation
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }

    // Settings
    let isRepeat = false;
    let isShuffle = false;
    let previousVolume = 0.8;

    // Format Seconds to MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Load Track
    function loadTrack(index, autoPlay = false) {
        if (index < 0) index = tracks.length - 1;
        if (index >= tracks.length) index = 0;
        currentTrackIndex = index;

        const currentTrack = tracks[currentTrackIndex];
        audio.src = currentTrack.src;
        if (trackTitle) trackTitle.textContent = currentTrack.title;
        if (trackArtist) trackArtist.textContent = currentTrack.artist;
        if (trackBadge) trackBadge.textContent = currentTrack.badge;
        if (albumArt) albumArt.src = currentTrack.cover;

        // Reset progress bar
        if (progressBar) progressBar.value = 0;
        if (currentTimeEl) currentTimeEl.textContent = "0:00";
        if (durationTimeEl) durationTimeEl.textContent = "--:--";

        // Update active class in playlist
        updatePlaylistUI();

        if (autoPlay) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    // Play Audio
    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            if (playIcon) playIcon.src = "images/pause.png";
            if (discWrapper) discWrapper.classList.add('spinning');
            if (equalizer) equalizer.classList.add('active');
            updatePlaylistUI();
        }).catch(err => {
            console.log("Audio play prevented:", err);
        });
    }

    // Pause Audio
    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.src = "images/play.png";
        if (discWrapper) discWrapper.classList.remove('spinning');
        if (equalizer) equalizer.classList.remove('active');
        updatePlaylistUI();
    }

    // Toggle Play/Pause
    function togglePlay() {
        if (audio.paused || !isPlaying) {
            playAudio();
        } else {
            pauseAudio();
        }
    }

    // Next Track
    function nextTrack() {
        if (isShuffle) {
            let nextIndex = Math.floor(Math.random() * tracks.length);
            if (tracks.length > 1 && nextIndex === currentTrackIndex) {
                nextIndex = (nextIndex + 1) % tracks.length;
            }
            loadTrack(nextIndex, true);
        } else {
            loadTrack((currentTrackIndex + 1) % tracks.length, true);
        }
    }

    // Previous Track
    function prevTrack() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        loadTrack((currentTrackIndex - 1 + tracks.length) % tracks.length, true);
    }

    // Update Playlist UI
    function updatePlaylistUI() {
        trackListItems.forEach((item, idx) => {
            if (idx === currentTrackIndex) {
                item.classList.add('active');
                const stateText = item.querySelector('.track-status');
                if (stateText) stateText.textContent = isPlaying ? "Playing" : "Paused";
            } else {
                item.classList.remove('active');
                const stateText = item.querySelector('.track-status');
                if (stateText) stateText.textContent = "";
            }
        });

        trackCardPlays.forEach((btn, idx) => {
            if (idx === currentTrackIndex && isPlaying) {
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`;
                btn.classList.add('playing');
            } else {
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
                btn.classList.remove('playing');
            }
        });
    }

    // Event Listeners for Player Controls
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (playIcon) playIcon.addEventListener('click', togglePlay);
    if (heroPlayDirect) {
        heroPlayDirect.addEventListener('click', (e) => {
            e.preventDefault();
            togglePlay();
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', prevTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);

    // Audio Metadata Loaded
    audio.addEventListener('loadedmetadata', () => {
        if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
        if (progressBar) progressBar.max = Math.floor(audio.duration);
    });

    // Time Update & Progress Slider
    audio.addEventListener('timeupdate', () => {
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        if (progressBar && !progressBar.matches(':active')) {
            progressBar.value = Math.floor(audio.currentTime);
            const percentage = (audio.currentTime / (audio.duration || 1)) * 100;
            progressBar.style.background = `linear-gradient(to right, #00f2fe ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)`;
        }
        if (durationTimeEl && (!durationTimeEl.textContent || durationTimeEl.textContent === "--:--")) {
            durationTimeEl.textContent = formatTime(audio.duration);
            if (progressBar) progressBar.max = Math.floor(audio.duration);
        }
    });

    // Seek in Progress Bar
    if (progressBar) {
        progressBar.addEventListener('input', () => {
            if (currentTimeEl) currentTimeEl.textContent = formatTime(progressBar.value);
            const percentage = (progressBar.value / (progressBar.max || 1)) * 100;
            progressBar.style.background = `linear-gradient(to right, #00f2fe ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)`;
        });

        progressBar.addEventListener('change', () => {
            audio.currentTime = progressBar.value;
        });
    }

    // Repeat Toggle
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            isRepeat = !isRepeat;
            repeatBtn.classList.toggle('active', isRepeat);
            repeatBtn.title = isRepeat ? "Repeat: ON" : "Repeat: OFF";
        });
    }

    // Shuffle Toggle
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            isShuffle = !isShuffle;
            shuffleBtn.classList.toggle('active', isShuffle);
            shuffleBtn.title = isShuffle ? "Shuffle: ON" : "Shuffle: OFF";
        });
    }

    // Track Finished
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            playAudio();
        } else {
            nextTrack();
        }
    });

    // Volume Control
    if (volumeSlider) {
        // Initialize volume
        audio.volume = 0.8;
        volumeSlider.value = 0.8;
        const volPercent = volumeSlider.value * 100;
        volumeSlider.style.background = `linear-gradient(to right, #00f2fe ${volPercent}%, rgba(255,255,255,0.2) ${volPercent}%)`;

        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            audio.volume = val;
            updateVolumeIcon(val);
            const percent = val * 100;
            volumeSlider.style.background = `linear-gradient(to right, #00f2fe ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
        });
    }

    function updateVolumeIcon(vol) {
        if (!volumeIcon) return;
        if (vol === 0) {
            volumeIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
        } else if (vol < 0.5) {
            volumeIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`;
        } else {
            volumeIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L9 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        }
    }

    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            if (audio.volume > 0) {
                previousVolume = audio.volume;
                audio.volume = 0;
                if (volumeSlider) {
                    volumeSlider.value = 0;
                    volumeSlider.style.background = `rgba(255,255,255,0.2)`;
                }
                updateVolumeIcon(0);
            } else {
                audio.volume = previousVolume || 0.8;
                if (volumeSlider) {
                    volumeSlider.value = audio.volume;
                    const percent = audio.volume * 100;
                    volumeSlider.style.background = `linear-gradient(to right, #00f2fe ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
                }
                updateVolumeIcon(audio.volume);
            }
        });
    }

    // Playlist Item Clicks
    trackListItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (currentTrackIndex === index && isPlaying) {
                pauseAudio();
            } else {
                loadTrack(index, true);
            }
        });
    });

    // Cards Play Button Clicks
    trackCardPlays.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentTrackIndex === index && isPlaying) {
                pauseAudio();
            } else {
                loadTrack(index, true);
            }
        });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        // Avoid intercepting if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            audio.currentTime = Math.max(audio.currentTime - 5, 0);
        } else if (e.key === 'm' || e.key === 'M') {
            if (volumeIcon) volumeIcon.click();
        }
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Load initial track without autoplay
    loadTrack(0, false);
});
