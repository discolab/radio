import {createAudioPlayer} from "./audio-player.js";
import {createBgCanvas} from "./bg.js";


const streamUrl = 'aHR0cDovL3NhdHVybi53aGF0Ym94LmNhOjE2ODk2L3Nhc2hhLXRvZGF5LTMyMC5tcDM=';
const statusUrl = 'aHR0cDovL3NhdHVybi53aGF0Ym94LmNhOjE2ODk2L3N0YXR1cy1qc29uLnhzbA==';

const player = createAudioPlayer(
  atob(streamUrl),
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
  return fetch(atob(statusUrl))
    .then((resp) => resp.json())
    .then((resp) => he.decode(resp.icestats.source.title))
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
