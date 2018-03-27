const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);

  switch (payload.cmd) {
    case 'take-photo':
      mySmileIsMyPassortVerifyMe(); // eslint-disable-line no-undef
      break;
    case 'face-data':
      showFaceData(payload.data); // eslint-disable-line no-undef
      break;
    case 'result':
      showResult(payload.isSmiling); // eslint-disable-line no-undef
      break;
    default:
      console.error(`Unknown Command: ${payload.cmd}`);
  }
};

const sendMessage = (payload) => { // eslint-disable-line no-unused-vars
  ws.send(JSON.stringify(payload), (error) => {
    console.error(error);
  });
};

// TODO: Do we leave this here?
ws.error = (error) => {
  console.error('ERROR');
  console.error(error);
};
