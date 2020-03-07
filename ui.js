const streamUrl = 'http://saturn.whatbox.ca:16896/sasha-today-320.mp3';
const statusUrl = 'http://saturn.whatbox.ca:16896/status-json.xsl';

const player = createAudioPlayer(
  streamUrl,
  isPlaying => updateState({ isPlaying })
);

const uiState = {
  title: '~~~~~~~',
  isPlaying: player.isPlaying(),
};

const canvas = document.querySelector('.bg');
const bgCanvas = createBgCanvas(canvas, player);

document.body.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    player.toggle()
  }
});
canvas.addEventListener('click', () => player.toggle());
bgCanvas.draw();

pollStatus();
renderUi(uiState);

//==========================================================

function pollStatus() {
  fetchStatus()
    .then(() => delay(5000))
    .then(pollStatus);
}

function fetchStatus() {
  return fetch(statusUrl)
    .then((resp) => resp.json())
    .then((resp) => resp.icestats.source.title)
    .then((title) => updateState({ title }));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateState(updates) {
  Object.assign(uiState, updates);
  renderUi(uiState);
}

function renderUi({ title, isPlaying }) {
  renderTitle(title);
  bgCanvas.toggle(isPlaying);
}

function renderTitle(title) {
  if (renderTitle.lastValue !== title) {
    document.querySelector('.title').innerText = document.title = title;
    renderTitle.lastValue = title;
  }
}
