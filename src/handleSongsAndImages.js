// save the current audios in the array
export const handleSongs=()=>{

  const Songs= [
     
    {
      SongName: 'I Wanna Be Yours',
      SongArtist: 'Unknown',
      image: './Assests/images/img (1).jpg',
      audio: './Assests/songs/Arctic Monkeys - I Wanna Be Yours(MP3_160K).mp3',
    },
    {
      SongName: 'runaway',
      SongArtist: 'Unknown',
      image: './Assests/images/img (2).jpg',
      audio: './Assests/songs/aurora - runaway ( s l o w e d   r e v e r b )(MP3_128K).mp3',
    },
    {
      SongName: 'Better Man',
      SongArtist: 'Unknown',
      image: './Assests/images/img (3).jpg',
      audio: './Assests/songs/Better Man(MP3_160K).mp3',
    },
    {
      SongName: 'i am not who i was',
      SongArtist: 'Chance Peña',
      image: './Assests/images/img (4).jpg',
      audio: './Assests/songs/Chance Peña - i am not who i was (Official Audio)(MP3_160K).mp3',
    },
    {
      SongName: 'Under The Influence',
      SongArtist: 'Chris Brown',
      image: './Assests/images/img (5).jpg',
      audio: './Assests/songs/Chris Brown - Under The Influence (TikTok Remix   Naoto)(MP3_128K).mp3',
    },
    // {
    //   SongName: 'daylight',
    //   SongArtist: 'david kushner',
    //   image: './Assests/images/img (6).jpg',
    //   audio: './Assests/songs/david kushner - daylight (slowed   reverb)(MP3_160K).mp3',
    // },
    // {
    //   SongName: 'drake_ one dance ',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (7).jpg',
    //   audio: './Assests/songs/drake_ one dance (slowed   reverb)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'indila - love story',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (8).jpg',
    //   audio: './Assests/songs/indila - love story (slowed _ reverb)(MP3_160K).mp3',
    // },
    // {
    //   SongName: 'abcdefu ',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (9).jpg',
    //   audio: './Assests/songs/GAYLE - abcdefu (Lyrics)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Heat Waves',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (10).jpg',
    //   audio: './Assests/songs/Heat Waves - Glass Animals ( Slowed And Reverb ) __ Lirik Dan Terjemahan(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'John Mayer - Rosie',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (11).jpg',
    //   audio: './Assests/songs/John Mayer - Rosie (Audio)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Let Me Down Slowly x Main Dhoondne Ko Zamaane Mein',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (13).jpg',
    //   audio: './Assests/songs/Let Me Down Slowly x Main Dhoondne Ko Zamaane Mein (Gravero Mashup) _ Full Version(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Let Me Down Slowly X Rendu Kaadhal',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (14).jpg',
    //   audio: './Assests/songs/Let Me Down Slowly X Rendu Kaadhal (Lyrics)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Let Me Down Slowly x Tose Naina',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (15).jpg',
    //   audio: './Assests/songs/Let Me Down Slowly x Tose Naina (Gravero Mashup) _ Full Version(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Michael Bublé - Feeling Good',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (16).jpg',
    //   audio: './Assests/songs/Michael Bublé - Feeling Good [Official Music Video](MP3_128K).mp3',
    // },
    // {
    //   SongName: 'One kiss x i was Never There',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (17).jpg',
    //   audio: './Assests/songs/One kiss x i was Never There (perfect version)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'ROSIE - to get over you',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (18).jpg',
    //   audio: './Assests/songs/ROSIE - to get over you (Lyrics)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Ruth B. - Dandelions',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (19).jpg',
    //   audio: './Assests/songs/Ruth B. - Dandelions (Lyrics) (Slowed   Reverb)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Sub Urban - INFERNO ',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (20).jpg',
    //   audio: './Assests/songs/Sub Urban - INFERNO (Lyrics)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'Suzume no Tojimari',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (21).jpg',
    //   audio: './Assests/songs/Suzume no Tojimari『Suzume』Theme Song(MP3_160K).mp3',
    // },
    // {
    //   SongName: 'Tate McRae - stupid',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (22).jpg',
    //   audio: './Assests/songs/Tate McRae - stupid (Lyrics)(MP3_128K).mp3',
    // },
    // {
    //   SongName: 'The Former',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (23).jpg',
    //   audio: './Assests/songs/The Former(MP3_160K).mp3',
    // },
    // {
    //   SongName: 'the weeknd - blinding lights',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (24).jpg',
    //   audio: './Assests/songs/the weeknd - blinding lights (slowed   reverb)(MP3_160K).mp3',
    // },
    // {
    //   SongName: 'Whatever It Takes',
    //   SongArtist: 'Unknown',
    //   image: './Assests/images/img (24).jpg',
    //   audio: './Assests/songs/Whatever It Takes (Official Music Video)(MP3_160K).mp3',
    // },
  ];
  return Songs;
};


 // Array of background video sources
 export const vidArray = [
  './Assests/videos/Video (1).mp4', './Assests/videos/Video (2).mp4',
  //'./Assests/videos/Video (3).mp4', './Assests/videos/Video (4).mp4',
  //'./Assests/videos/Video (5).mp4', //'./Assests/videos/Video (6).mp4',
  // './Assests/videos/Video (7).mp4', './Assests/videos/Video (8).mp4',
  // './Assests/videos/Video (9).mp4', './Assests/videos/Video (10).mp4',
  // './Assests/videos/Video (11).mp4', './Assests/videos/Video (12).mp4',
  // './Assests/videos/Video (13).mp4', './Assests/videos/Video (14).mp4',
  // './Assests/videos/Video (15).mp4', './Assests/videos/Video (16).mp4',
  // './Assests/videos/Video (17).mp4', './Assests/videos/Video (18).mp4',
  // './Assests/videos/Video (19).mp4', './Assests/videos/Video (20).mp4',
  // './Assests/videos/Video (21).mp4', './Assests/videos/Video (22).mp4',
  // './Assests/videos/Video (23).mp4', './Assests/videos/Video (24).mp4',
  // './Assests/videos/Video (25).mp4'
];
