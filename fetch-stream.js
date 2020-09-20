function fetchStream(streamUrl, processChunk) {
  const controller = new AbortController();

  fetch(streamUrl, { signal: controller.signal })
    .then(({ body }) => {
      return body.pipeTo(new WritableStream({ write: processChunk }))
    })
    .catch((e) => console.log('fetching was stopped', e.toString()));

  return () => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  };
}
