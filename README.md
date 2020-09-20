## How to run Discolab radio

1. Start Icecast server

    `icecast -c ~/radio/dev/icecast.xml`

2. Feed Liquidsoap audio stream into Icecast

    `liquidsoap --verbose  ~/radio/dev/start-radio`
