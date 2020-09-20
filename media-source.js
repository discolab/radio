function createMediaSource(streamUrl, mimeType) {
  let abort;
  let buffer;

  const queue = [];

  const source = new MediaSource();
  source.addEventListener('sourceopen', onSourceOpen);
  source.addEventListener('sourceclose', onSourceClose);

  return URL.createObjectURL(source);

  function onSourceOpen() {
    abort = fetchStream(streamUrl);
    buffer = source.addSourceBuffer(mimeType);
    buffer.addEventListener('updateend', () => appendBuffer());
  }

  function onSourceClose() {
    buffer = null;
    if (abort) abort();
    abort = null;
    queue.length = 0;
  }

  function appendBuffer(data) {
    if (!buffer) {
      return;
    }
    if (data) {
      queue.push(data);
    }
    if (!buffer.updating && queue.length) {
      buffer.appendBuffer(queue.shift());
    }
  }

  function fetchStream() {
    const controller = new AbortController();

    fetch(streamUrl, { signal: controller.signal })
      .then(({ body }) => {
        return body.pipeTo(new WritableStream({ write: appendBuffer }))
      })
      .catch((e) => console.log('fetching was stopped'));

    return () => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    };
  }
}
