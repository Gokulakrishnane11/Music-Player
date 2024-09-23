import './App.css';
import { handleSongs } from './handleSongsAndImages';
import { vidArray } from './handleSongsAndImages';
import React, { useState, useRef, useEffect,useCallback } from 'react';

const MusicApp = () => {
  const [isPlaying, setIsPlaying] = useState(false); // Tracks if audio is currently playing
  const [audioProgressBar, setAudioProgressBar] = useState(0); // Tracks progress of current song (0-100)
  const [musicTrack, setMusicTrack] = useState(0); // Index of current song in playlist
  const [musicTotalLength, setMusicTotalLength] = useState('00:00'); // Total length of current song
  const [musicCurrentTime, setMusicCurrentTime] = useState('00:00'); // Current time of playing song
  const [videoIndex, setVideoIndex] = useState(0); // Index of current background video
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    SongName: 'I Wanna Be Yours',
    SongArtist: 'Unknown',
    image: './Assests/images/img (1).jpg',
    audio: './Assests/songs/Arctic Monkeys - I Wanna Be Yours(MP3_160K).mp3',
  });

    // Refs to store the audio element, AudioContext, AnalyserNode, and MediaElementSourceNode
    const currentAudio = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
  
    // Ref to store requestAnimationFrame ID
    const animationIdRef = useRef(null);
  
  

  // Fetch the song list from external data handler
  const MusicAPI = handleSongs();

  // Load the songs and images once
  useEffect(() => {
    updateCurrentSongDetails(musicTrack);
  }, [musicTrack]);

  // Handle play/pause
  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsPlaying(true);
    } else {
      currentAudio.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    const newValue = e.target.value;
    setAudioProgressBar(newValue);
    // Set current time of audio based on progress bar value
    currentAudio.current.currentTime = (newValue * currentAudio.current.duration) / 100;
  };

  // Handle next song
  const handleNextSong = () => {
    const nextSong = musicTrack >= MusicAPI.length - 1 ? 0 : musicTrack + 1;
    setMusicTrack(nextSong);
    setIsPlaying(true); // Autoplay the next song
    // Change background video
    // setVideoIndex(videoIndex >= vidArray.length - 1 ? 0 : videoIndex + 1);
  };

  // Handle previous song
  const handlePrevSong = () => {
    const prevSong = musicTrack <= 0 ? MusicAPI.length - 1 : musicTrack - 1;
    setMusicTrack(prevSong);
    setIsPlaying(true);
     // Change background video
    // setVideoIndex(videoIndex >= vidArray.length - 1 ? 0 : videoIndex + 1);
  };

  // Function to update song details when a track changes
  const updateCurrentSongDetails = useCallback(
    async (num) => {
      try {
        const musicObject = MusicAPI[num];

        // Update state with the selected music details
        setCurrentMusicDetails({
          SongName: musicObject.SongName,
          SongArtist: musicObject.SongArtist,
          image: musicObject.image,
          audio: musicObject.audio,
        });

        if (currentAudio.current) {
          // Pause the current audio if it's playing
          currentAudio.current.pause();
          // Load and play the audio
          currentAudio.current.src = await musicObject.audio;
          await currentAudio.current.load();
          if (isPlaying) {
            try {
              await currentAudio.current.play();
              // All good! Set isPlaying to true
              setIsPlaying(true);
            } catch (playError) {
              console.error("Error playing audio:", playError);
              setIsPlaying(false);
            }
          }
        }
      } catch (error) {
        console.error("Error updating song:", error);
        setIsPlaying(false); // Handle the error gracefully
      }
    },
    [MusicAPI]
  );

  // Update audio progress and time displays
  const handleAudioTimeUpdate = () => {
    if (!currentAudio.current.duration) return; // Prevent NaN errors

    // Calculate and set total length of the audio
    const minutes = Math.floor(currentAudio.current.duration / 60).toString();
    const seconds = Math.floor(currentAudio.current.duration % 60).toString();
    const musicTotalTime = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalTime);

    // Calculate and set current time of the audio
    const currentMinutes = Math.floor(currentAudio.current.currentTime / 60).toString();
    const currentSeconds = Math.floor(currentAudio.current.currentTime % 60).toString();
    const songCurrentTime = `${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
    setMusicCurrentTime(songCurrentTime);

    // Update progress bar
    const progress = (currentAudio.current.currentTime / currentAudio.current.duration) * 100;
    setAudioProgressBar(isNaN(progress) ? 0 : progress); // Prevent NaN values
  };

  // Handle background video change
  const handleBgVideoChange = () => {
    setVideoIndex(videoIndex >= vidArray.length - 1 ? 0 : videoIndex + 1);
  };

  // RGB background light effect
  useEffect(() => {
    if (!audioContextRef.current) {
      // Initialize AudioContext and nodes only once
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      sourceRef.current = audioContextRef.current.createMediaElementSource(
        currentAudio.current
      ); // Create source node from audio element
      sourceRef.current.connect(analyserRef.current); // Connect source to analyser
      analyserRef.current.connect(audioContextRef.current.destination); // Connect analyser to destination (speakers)
    }

    // If playing, ensure AudioContext is resumed
    if (isPlaying && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount); // Create an array for frequency data

    const animateShadow = () => {
      analyserRef.current.getByteFrequencyData(dataArray); // Get frequency data
      const avgFreq =
        dataArray.reduce((sum, value) => sum + value) / dataArray.length; // Calculate average frequency

      // Calculate RGB color values based on frequency
      const r = Math.floor((avgFreq * 2) % 255);
      const g = Math.floor((avgFreq * 3) % 255);
      const b = Math.floor((avgFreq * 4) % 255);

      // Apply the box shadow effect using calculated RGB values
      const musicContainer = document.querySelector(".music-container");
      if (musicContainer) {
        musicContainer.style.boxShadow = `0 0 20px rgba(${r}, ${g}, ${b}, 0.7), 0 0 40px rgba(${r}, ${g}, ${b}, 0.7), 0 0 80px rgba(${r}, ${g}, ${b}, 0.7)`;
      }

      // Request the next animation frame
      animationIdRef.current = requestAnimationFrame(animateShadow);
    };

    // Start animation if playing, otherwise cancel it
    if (isPlaying) {
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