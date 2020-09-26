// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
// https://github.com/mrdoob/three.js/blob/master/src/audio/AudioAnalyser.js
// https://github.com/mrdoob/three.js/blob/master/examples/webaudio_visualizer.html
// https://noisehack.com/build-music-visualizer-web-audio-api/
// https://www.twilio.com/blog/audio-visualisation-web-audio-api--react

export default class SpectrumAnalyzer {
  constructor (binCount, smoothingTimeConstant) {
    this.binCount = binCount;
    this.timeByteData = new Uint8Array(binCount);		// waveform
    this.frequencyByteData = new Uint8Array(binCount); 	// frequency

    this.context = new AudioContext();

    this.analyzerNode = this.context.createAnalyser();
    this.analyzerNode.fftSize = binCount * 2;
    this.analyzerNode.smoothingTimeConstant = smoothingTimeConstant;
  }

  setSource(source) {
    this.source = this.context.createMediaElementSource(source);
    this.source.connect(this.analyzerNode);
    this.analyzerNode.connect(this.context.destination);
  }

  getFrequencyData() {
    return this.frequencyByteData;
  }

  getTimeData() {
    return this.timeByteData;
  }

  // not save if out of bounds
  getAverage(index, count) {
    var total = 0;
    var start = index || 0;
    var end = start + (count || this.binCount);

    for (var i = start; i < end; i++) {
      total += this.frequencyByteData[i];
    }

    return total / (end - start);
  }

  updateSample() {
    this.analyzerNode.getByteFrequencyData(this.frequencyByteData);
    this.analyzerNode.getByteTimeDomainData(this.timeByteData);
  }
}
