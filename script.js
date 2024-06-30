document.addEventListener('DOMContentLoaded', () => {
    let playlist = []; // Updated to an empty array initially
    let currentTrack = 0;
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const playlistDiv = document.getElementById('playlist');
    const spotifyPlaylistDiv = document.getElementById('spotifyPlaylist');

    function initializePlaylist() {
        // Clear existing playlist elements
        playlistDiv.innerHTML = '';
        // Create playlist items
        playlist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track');
            const trackName = document.createElement('span');
            trackName.textContent = track.name;
            trackName.onclick = () => {
                currentTrack = index;
                playTrack();
            };
            const renameIcon = document.createElement('i');
            renameIcon.className = 'fas fa-edit';
            renameIcon.onclick = () => renameTrack(index);
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt';
            deleteIcon.onclick = () => deleteTrack(index);
            trackElement.appendChild(trackName);
            trackElement.appendChild(renameIcon);
            trackElement.appendChild(deleteIcon);
            playlistDiv.appendChild(trackElement);
        });
    }

    function playTrack() {
        const track = playlist[currentTrack];
        if (track.file) {
            const fileURL = URL.createObjectURL(track.file);
            audioPlayer.src = fileURL;
        } else {
            audioPlayer.src = track.source;
        }
        audioPlayer.play().then(() => {
            playBtn.textContent = 'Pause';
        }).catch(error => {
            console.error('Error playing track:', error);
            alert('Error playing track. Make sure the URL is correct and accessible.');
        });
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                playBtn.textContent = 'Pause';
            }).catch(error => {
                console.error('Error playing track:', error);
                alert('Error playing track. Make sure the URL is correct and accessible.');
            });
        } else {
            audioPlayer.pause();
            playBtn.textContent = 'Play';
        }
    }

    function nextTrack() {
        currentTrack = (currentTrack + 1) % playlist.length;
        playTrack();
    }

    function prevTrack() {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        playTrack();
    }

    function changeVolume() {
        audioPlayer.volume = volumeSlider.value;
    }

    function addTrack() {
        const trackNameInput = document.getElementById('trackName');
        const trackFileInput = document.getElementById('trackFile');

        const trackName = trackNameInput.value.trim();
        const trackFile = trackFileInput.files[0];

        if (trackName !== '' && trackFile) {
            const newTrack = { name: trackName, file: trackFile };
            playlist.push(newTrack);
            initializePlaylist();
            trackNameInput.value = '';
            trackFileInput.value = '';
        } else {
            alert('Please enter a track name and select a file.');
        }
    }

    function renameTrack(index) {
        const newName = prompt('Enter new track name:', playlist[index].name);
        if (newName) {
            playlist[index].name = newName;
            initializePlaylist();
        }
    }

    function deleteTrack(index) {
        if (confirm('Are you sure you want to delete this track?')) {
            playlist.splice(index, 1);
            initializePlaylist();
        }
    }

    function addSpotifyTrack() {
        const spotifyNameInput = document.getElementById('spotifyName');
        const spotifyURLInput = document.getElementById('spotifyURL');

        const spotifyName = spotifyNameInput.value.trim();
        const spotifyURL = spotifyURLInput.value.trim();

        if (spotifyName !== '' && spotifyURL !== '') {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track');
            const trackLink = document.createElement('a');
            trackLink.href = 'javascript:void(0)';
            trackLink.textContent = spotifyName;
            trackLink.onclick = () => {
                const nowPlayingElement = document.createElement('div');
                nowPlayingElement.textContent = 'Now Playing:';
                const iframe = document.createElement('iframe');
                iframe.src = spotifyURL;
                iframe.width = "300";
                iframe.height = "80";
                iframe.frameBorder = "0";
                iframe.allow = "encrypted-media";
                trackElement.appendChild(nowPlayingElement);
                trackElement.appendChild(iframe);
            };
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt';
            deleteIcon.onclick = () => {
                if (confirm('Are you sure you want to delete this Spotify track?')) {
                    trackElement.remove();
                }
            };
            trackElement.appendChild(trackLink);
            trackElement.appendChild(deleteIcon);
            spotifyPlaylistDiv.appendChild(trackElement);
            spotifyNameInput.value = '';
            spotifyURLInput.value = '';
        } else {
            alert('Please enter both Spotify track name and embed URL.');
        }
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    volumeSlider.addEventListener('change', changeVolume);
    document.querySelector('.playlist-add button').addEventListener('click', addTrack);
    document.querySelector('.spotify-add button').addEventListener('click', addSpotifyTrack);

    // Initialize playlist on page load
    initializePlaylist();
});
