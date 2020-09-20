function fetchStream(streamUrl, processChunk) {
  const controller = new AbortController();

  fetch(streamUrl, { signal: controller.signal })
    .then(({ body }) => {
      if (typeof WritableStream === 'function') {
        return body.pipeTo(new WritableStream({ write: processChunk }))
      } else {
        const reader = body.getReader();

        reader.read().then(function process({done, value}) {
          if (!done && value) {
            processChunk(value);
            return reader.read().then(process);
          }
        });
      }
    })
    .catch((e) => console.log('fetching was stopped', e.toString()));

  return function cancelFetch() {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  };
}
