import './App.css'; // Importing the CSS for the app
import { handleSongs } from './handleSongsAndImages'; // Importing the handleSongs function
import { vidArray } from './handleSongsAndImages'; // Importing the array of background videos
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'; // Importing React hooks

const MusicApp = () => {
  // Defining various state variables
  const [isPlaying, setIsPlaying] = useState(false); // Tracks if audio is currently playing
  const [audioProgressBar, setAudioProgressBar] = useState(0); // Tracks the progress of the current song
  const [musicTrack, setMusicTrack] = useState(0); // Index of the current song
  const [musicTotalLength, setMusicTotalLength] = useState('00:00'); // Total duration of the current song
  const [musicCurrentTime, setMusicCurrentTime] = useState('00:00'); // Current playback time of the song
  const [videoIndex, setVideoIndex] = useState(0); // Index of the current background video
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    // Default details for the first song
    SongName: 'I Wanna Be Yours',
    SongArtist: 'Unknown',
    image: './Assests/images/img (1).jpg',
    audio: './Assests/songs/Arctic Monkeys - I Wanna Be Yours(MP3_160K).mp3',
  });

  // Refs for audio management
  const currentAudio = useRef(null); // Ref for the audio element
  const audioContextRef = useRef(null); // Ref for the AudioContext
  const analyserRef = useRef(null); // Ref for the AnalyserNode
  const sourceRef = useRef(null); // Ref for the MediaElementSourceNode

  // Ref to store the ID of the requestAnimationFrame
  const animationIdRef = useRef(null);
  const isPlayingRef = useRef(isPlaying); // Ref for syncing the isPlaying state

  // Sync the isPlaying state with the ref whenever it changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Memoize the MusicAPI to avoid recomputing it on every render
  const MusicAPI = useMemo(() => handleSongs(), []);

  // Function to handle play/pause action
  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play(); // Play the audio if paused
      setIsPlaying(true); // Update state to reflect that the audio is playing
    } else {
      currentAudio.current.pause(); // Pause the audio if already playing
      setIsPlaying(false); // Update state to reflect the pause
    }
  };

  // Function to handle changes in the progress bar
  const handleProgressChange = (e) => {
    const newValue = e.target.value; // Get the new value of the progress bar
    setAudioProgressBar(newValue); // Update the progress bar state
    currentAudio.current.currentTime = (newValue * currentAudio.current.duration) / 100; // Update the current audio time
  };

  // Function to handle switching to the next song
  const handleNextSong = () => {
    const nextSong = musicTrack >= MusicAPI.length - 1 ? 0 : musicTrack + 1; // Cycle to the next song or loop back to the start
    setMusicTrack(nextSong); // Update the song track
    setIsPlaying(true); // Automatically play the next song
  };

  // Function to handle switching to the previous song
  const handlePrevSong = () => {
    const prevSong = musicTrack <= 0 ? MusicAPI.length - 1 : musicTrack - 1; // Cycle to the previous song or loop back
    setMusicTrack(prevSong); // Update the song track
    setIsPlaying(true); // Automatically play the previous song
  };

  // Update the song details when the track changes
  const updateCurrentSongDetails = useCallback(
    async (num) => {
      try {
        const musicObject = MusicAPI[num]; // Get song details based on the track index

        // Update song details only if necessary
        setCurrentMusicDetails((prevDetails) => {
          if (
            prevDetails.SongName === musicObject.SongName &&
            prevDetails.SongArtist === musicObject.SongArtist &&
            prevDetails.image === musicObject.image &&
            prevDetails.audio === musicObject.audio
          ) {
            return prevDetails; // No change if song details are the same
          }
          return {
            SongName: musicObject.SongName,
            SongArtist: musicObject.SongArtist,
            image: musicObject.image,
            audio: musicObject.audio,
          };
        });

        if (currentAudio.current) {
          if (!currentAudio.current.paused) {
            await currentAudio.current.pause(); // Pause the audio if playing
          }

          // Set a new audio source if the audio is different
          if (currentAudio.current.src !== musicObject.audio) {
            currentAudio.current.src = musicObject.audio;
            await currentAudio.current.load(); // Load the new audio source
          }

          if (isPlayingRef.current) {
            await currentAudio.current.play(); // Autoplay if the song is playing
          }
        }
      } catch (error) {
        console.error("Error updating song:", error); // Error handling
      }
    },
    [MusicAPI] // Only updates when MusicAPI changes
  );

  // Trigger song and video updates when the music track changes
  useEffect(() => {
    updateCurrentSongDetails(musicTrack); // Update song details when track changes
  }, [musicTrack,updateCurrentSongDetails]); // Only reruns when musicTrack changes

  // Update the progress bar and time display as the audio plays
  const handleAudioTimeUpdate = () => {
    if (!currentAudio.current.duration) return; // Prevent NaN errors

    // Calculate and display the total song duration
    const minutes = Math.floor(currentAudio.current.duration / 60).toString();
    const seconds = Math.floor(currentAudio.current.duration % 60).toString();
    const musicTotalTime = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalTime);

    // Calculate and display the current song time
    const currentMinutes = Math.floor(currentAudio.current.currentTime / 60).toString();
    const currentSeconds = Math.floor(currentAudio.current.currentTime % 60).toString();
    const songCurrentTime = `${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
    setMusicCurrentTime(songCurrentTime);

    // Update the progress bar
    const progress = (currentAudio.current.currentTime / currentAudio.current.duration) * 100;
    setAudioProgressBar(isNaN(progress) ? 0 : progress); // Prevent NaN values
  };

  // Change the background video
  const handleBgVideoChange = () => {
    setVideoIndex(videoIndex >= vidArray.length - 1 ? 0 : videoIndex + 1); // Cycle through background videos
  };

  // Create an RGB lighting effect based on the audio frequencies
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)(); // Create the AudioContext
      analyserRef.current = audioContextRef.current.createAnalyser(); // Create an AnalyserNode
      sourceRef.current = audioContextRef.current.createMediaElementSource(currentAudio.current); // Create a source from the audio element
      sourceRef.current.connect(analyserRef.current); // Connect the source to the analyser
      analyserRef.current.connect(audioContextRef.current.destination); // Connect the analyser to the speakers
    }

    // If the audio is playing, ensure the AudioContext is resumed
    if (isPlaying && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount); // Array for frequency data

    const animateShadow = () => {
      analyserRef.current.getByteFrequencyData(dataArray); // Get frequency data
      const avgFreq = dataArray.reduce((sum, value) => sum + value) / dataArray.length; // Average frequency

      // Create RGB values based on frequency
      const r = Math.floor((avgFreq * 2) % 255);
      const g = Math.floor((avgFreq * 3) % 255);
      const b = Math.floor((avgFreq * 4) % 255);

      // Apply the box shadow effect with RGB colors
      const musicContainer = document.querySelector(".music-container");
      if (musicContainer) {
        musicContainer.style.boxShadow = `0 0 20px rgba(${r}, ${g}, ${b}, 0.7), 0 0 40px rgba(${r}, ${g}, ${b}, 0.7), 0 0 80px rgba(${r}, ${g}, ${b}, 0.7)`;
      }

      animationIdRef.current = requestAnimationFrame(animateShadow); // Continue animation
    };

    // Start or stop the shadow animation based on isPlaying
    if (isPlaying)
 {
      animateShadow();
    } else {
      cancelAnimationFrame(animationIdRef.current);
    }

    return () => {
      cancelAnimationFrame(animationIdRef.current); // Clean up on unmount
    };
  }, [isPlaying]);

  return (
    <>
      <div className="container">
        {/* Audio element */}
        <audio
          ref={currentAudio}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleNextSong}
        ></audio>

        {/* Background video */}
        <video src={vidArray[videoIndex]} autoPlay muted loop className='bg-video'></video>

        <div className="blackScreen"></div>

        <div className="music-container">
          <p className="musicPlayer">Music Player</p>
          <p className="music-head-name">{currentMusicDetails.SongName}</p>
          <p className="music-artist-name">{currentMusicDetails.SongArtist}</p>
          <img
            src={currentMusicDetails.image}
            alt="song Avatar"
            id="songAvatar"
            className={isPlaying ? 'songAvatar' : ''}
          />
          <div className="musicTimeDiv">
            <p id="musicCurrentTime">{musicCurrentTime}</p>
            <p id="musicTotalTime">{musicTotalLength}</p>
          </div>
          <input
            type="range"
            name="musicProgressBar"
            className="musicProgressBar"
            value={audioProgressBar}
            onChange={handleProgressChange}
          />
          <div className="musicController">
            <i className="fa-solid fa-backward musicController" onClick={handlePrevSong}></i>
            <i
              className={`fa-solid ${isPlaying ? 'fa-pause-circle' : 'fa-circle-play'} playBtn`}
              onClick={handleAudioPlay}
            ></i>
            <i className="fa-solid fa-forward musicController" onClick={handleNextSong}></i>
          </div>
        </div>
        <div className="changeBackBtn" onClick={handleBgVideoChange}>
          <p>Change Background</p>
        </div>
      </div>
    </>
  );
};

export default MusicApp;