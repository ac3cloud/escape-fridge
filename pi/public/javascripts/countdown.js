const countdown = () => new Promise((resolve /* , reject */) => { // eslint-disable-line no-unused-vars
  let counter = 4;
  let msg;

  const timerInterval = setInterval(
    () => {
      switch (counter) {
        case 4:
          $('#countdown').show();
          msg = 'Ready!';
          break;
        case 3:
        case 2:
        case 1:
          msg = counter;
          break;
        case 0:
          msg = 'Smile!';
          break;
        default:
          clearInterval(timerInterval);
          $('#countdown').hide();
          resolve();
          return;
      }

      $('#countdown span').html(msg);

      counter -= 1;
    },
    1000,
  );
});
