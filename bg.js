import { createAnimatedValue, createAnimationSequence } from "./animated-value.js";

export {
  createBgCanvas
}

function setupCanvas(canvas) {
  const context = canvas.getContext('2d');
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  return context;
}

function equals(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  return Object.keys(a).every(key => a[key] === b[key]);
}

function createBgCanvas(canvas, player) {
  const context = setupCanvas(canvas);
  window.addEventListener('resize', () => {
    setupCanvas(canvas);
    draw(true);
  });

  const state = {
    dy: null,
    amplitude: null,
    frequency: null,
  };

  const yAnim = createAnimatedValue({ duration: 300 });
  const ampAnim = createAnimatedValue({ duration: 500 });

  const animSeq = createAnimationSequence([
    yAnim,
    ampAnim,
  ]);

  function toggle(isActive) {
    isActive ? animSeq.forward() : animSeq.backward();
  }

  function draw(force = false) {
    if (player.getAnalyser()) {
      player.getAnalyser().updateSample();
    }

    const newState = {
      dy: yAnim.val(),
      amplitude: ampAnim.val() * (player.getAnalyser() ? player.getAnalyser().getAverage() : 10),
      frequency: 24
    };
    const numOfSegments = Math.floor(window.innerHeight / 100);

    if (force || !equals(state, newState)) {
      const { offsetWidth: width, offsetHeight: height } = context.canvas;
      const { dy, amplitude, frequency } = newState;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 3;
      context.strokeStyle = "#19a26d";

      for (let y = -0.5; y <= 0.5; y += 1/numOfSegments) {
        context.beginPath();
        for (let x = 0; x <= width; x++) {
          context.lineTo(x, (0.5 + y * dy) * height + amplitude * Math.sin(x/frequency));
        }
        context.stroke();
      }
    }

    Object.assign(state, newState);

    requestAnimationFrame(() => draw());
  }

  return {
    draw,
    toggle
  };
}
