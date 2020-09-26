export {
  createAnimatedValue,
  createAnimationSequence
}

function seq(promiseFns) {
  return promiseFns.reduce((chain, fn) => {
    return chain.then(
      () => fn(),
      () => {}
    )
    ;
  }, Promise.resolve());
}

function createAnimationSequence(values) {
  return {
    forward: () => seq(values.map(v => () => v.toMax())),
    backward: () => seq(values.slice().reverse().map(v => () => v.toMin()))
  }
}

function createAnimatedValue({ min = 0, max = 1, duration = 300 } = {}) {
  let cancel;
  let current = min;

  function toValue(val) {
    return new Promise((resolve, reject) => {
      cancel && cancel();
      const to = val;
      const from = current;

      cancel = tween({
        from,
        to,
        duration: Math.abs(from - to)/(max - min) * duration,
        onUpdate: (val) => current = val,
        onComplete: resolve,
        onCancel: reject
      });
    });
  }

  return {
    toMin: () => toValue(min),
    toMax: () => toValue(max),
    val: () => current
  }
}

function tween({ from, to, duration, ease = easeOut, onUpdate, onComplete, onCancel }) {
  const delta = to - from;
  const startTime = performance.now();
  let frame = requestAnimationFrame(update);
  let isCanceled = false;

  return cancel;

  function update(now) {
    if (isCanceled) return;

    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = from + ease(progress) * delta;

    onUpdate(current);

    if (progress === 1 || current === to) {
      onComplete();
    } else {
      frame = requestAnimationFrame(update);
    }
  }

  function cancel() {
    if (!isCanceled) {
      isCanceled = true;
      frame && cancelAnimationFrame(frame);
      onCancel();
    }
  }
}

function easeOut(progress, power = 2) {
  return 1 - (1 - progress) ** power;
}
