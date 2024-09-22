import './App.css';
import { handleSongs } from './handleSongsAndImages';
import { vidArray } from './handleSongsAndImages';
import React, { useState, useRef, useEffect } from 'react';

const MusicApp = () => {
  // State to track play/pause status
  const [isPlaying, setIsPlaying] = useState(false);
  
  // State to track progress bar value
  const [audioProgressBar, setAudioProgressBar] = useState(0);
  
  // State to track the current music track index
  const [musicTrack, setMusicTrack] = useState(0);
  
  // State for total length of current song
  const [musicTotalLength, setMusicTotalLength] = useState('00:00');
  
  // State for current time of the song
  const [musicCurrentTime, setMusicCurrentTime] = useState('00:00');
  
  // State to track background video index
  const [videoIndex, setVideoIndex] = useState(0);
  
  // State to track current song details (name, artist, image, audio)
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

  // Function to play or pause the audio
  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsPlaying(true);
    } else {
      currentAudio.current.pause();
      setIsPlaying(false);
    }
  };

  // Function to handle progress bar input and seek audio
  const handleProgressChange = (e) => {
    const newValue = e.target.value;
    setAudioProgressBar(newValue); // Update progress bar value
    currentAudio.current.currentTime = (newValue * currentAudio.current.duration) / 100; // Set new current time based on progress bar
  };

  // Function to move to the next song
  const handleNextSong = () => {
    setMusicTrack((prevTrack) => (prevTrack >= MusicAPI.length - 1 ? 0 : prevTrack + 1));
  };

  // Function to move to the previous song
  const handlePrevSong = () => {
    setMusicTrack((prevTrack) => (prevTrack <= 0 ? MusicAPI.length - 1 : prevTrack - 1));
  };

  // Function to update song details when a track changes
  const updateCurrentSongDetails = async (num) => {
    let musicObject = MusicAPI[num]; // Get the selected song object
    
    currentAudio.current.src = musicObject.audio; // Set the audio source

    setCurrentMusicDetails({
      SongName: musicObject.SongName,
      SongArtist: musicObject.SongArtist,
      image: musicObject.image,
      audio: musicObject.audio,
    });

    try {
      await currentAudio.current.load(); // Load new audio
      await currentAudio.current.play(); // Play the audio
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  // Function to handle time updates in the audio and update progress
  const handleAudioTimeUpdate = () => {
    const duration = currentAudio.current.duration; // Get total duration of the song
    const currentTime = currentAudio.current.currentTime; // Get current playback time

    // Format the duration and current time into mm:ss
    setMusicTotalLength(
      `${Math.floor(duration / 60)
        .toString()
        .padStart(2, '0')}:${Math.floor(duration % 60)
        .toString()
        .padStart(2, '0')}`
    );

    setMusicCurrentTime(
      `${Math.floor(currentTime / 60)
        .toString()
        .padStart(2, '0')}:${Math.floor(currentTime % 60)
        .toString()
        .padStart(2, '0')}`
    );

    const progress = (currentTime / duration) * 100; // Calculate the progress in percentage
    setAudioProgressBar(progress || 0); // Update the progress bar
  };

  // UseEffect to update song details when the track index changes
  useEffect(() => {
    updateCurrentSongDetails(musicTrack);
  }, [musicTrack]);

  // UseEffect to handle song ending and move to the next one automatically
  useEffect(() => {
    currentAudio.current.addEventListener('ended', handleNextSong);
    return () => {
      currentAudio.current.removeEventListener('ended', handleNextSong);
    };
  }, []);

  // Function to change the background video
  const handleBgVideoChange = () => {
    setVideoIndex((prevIndex) => (prevIndex >= vidArray.length - 1 ? 0 : prevIndex + 1));
  };

  // RGB background effect
  useEffect(() => {
    if (!audioContextRef.current) {
      // Initialize AudioContext and nodes only once
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      sourceRef.current = audioContextRef.current.createMediaElementSource(currentAudio.current); // Create source node from audio element
      sourceRef.current.connect(analyserRef.current); // Connect source to analyser
      analyserRef.current.connect(audioContextRef.current.destination); // Connect analyser to destination (speakers)
    }

    // If playing, ensure AudioContext is resumed
    if (isPlaying && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount); // Create an array for frequency data

    const animateShadow = () => {
      analyserRef.current.getByteFrequencyData(dataArray); // Get frequency data
      const avgFreq = dataArray.reduce((sum, value) => sum + value) / dataArray.length; // Calculate average frequency

      // Calculate RGB color values based on frequency
      const r = Math.floor((avgFreq * 2) % 255);
      const g = Math.floor((avgFreq * 3) % 255);
      const b = Math.floor((avgFreq * 4) % 255);

      // Apply the box shadow effect using calculated RGB values
      document.querySelector('.music-container').style.boxShadow = `0 0 20px rgba(${r}, ${g}, ${b}, 0.7), 0 0 40px rgba(${r}, ${g}, ${b}, 0.7), 0 0 80px rgba(${r}, ${g}, ${b}, 0.7)`;

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
    <div className="container">
      {/* Audio element */}
      <audio ref={currentAudio} onTimeUpdate={handleAudioTimeUpdate} ></audio>

      {/* Background video */}
      <video src={vidArray[videoIndex]} autoPlay muted loop className="bg-video"></video>

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
  );
};

export default MusicApp;
