function createAudioPlayer(streamUrl, onStateChange) {
  let audio;
  let analyser;

  function toggle() {
    if (isPlaying()) {
      pause();
    } else {
      play();
    }
    onStateChange(isPlaying());
  }

  function play() {
    audio = new Audio();
    audio.src = createMediaSource(streamUrl);
    audio.play();
    analyser = new SpectrumAnalyzer(4096 * 2, 0.7);
    analyser.setSource(audio);
  }

  function pause() {
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    audio = null;
  }

  function isPlaying() {
    return !!(audio && !audio.paused);
  }

  return {
    toggle,
    isPlaying,
    getAnalyser: () => analyser
  };
}
