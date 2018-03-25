
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);

  switch (payload.cmd) {
    case 'take-photo':
      mySmileIsMyPassortVerifyMe(); // eslint-disable-line no-undef
      break;
    default:
      console.error('Unknown Command');
  }
};

// TODO: Do we leave this here?
ws.error = (error) => {
  console.error('ERROR');
  console.error(error);
};
