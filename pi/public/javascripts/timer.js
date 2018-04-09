const setupTimer = (start) => { // eslint-disable-line no-unused-vars
  const elapsed = Math.round((Date.now() - start) / 1000);
  const max = 600;
  const maxMin = Math.round(max / 60);
  const maxSec = Math.round(max % 60);
  const maxString = `${maxMin}:${maxSec <= 0 ? '0' : ''}${maxSec}`;

  const params = {
    precision: 'seconds',
    startValues: {
      seconds: elapsed,
    },
    target: {
      seconds: max,
    },
  };

  const timer = new Timer(); // eslint-disable-line no-undef
  timer.start(params);

  const updateHTML = () => {
    const values = timer.getTotalTimeValues();
    const now = values.seconds > max ? max : values.seconds;

    const minutes = Math.round(values.seconds / 60);
    const seconds = Math.round(values.seconds % 60);
    const string = values.seconds > max ? maxString : `${minutes}:${seconds <= 0 ? '0' : ''}${seconds}`;

    const percentage = Math.round((now / max) * 100);

    $('#timer .values').html(string);
    $('#timer .progress-bar').css('width', `${percentage}%`);
    if (percentage > 50) {
      $('#timer .progress-bar').addClass('bg-warning');
      $('#timer .progress-bar').removeClass('bg-success');
    }
    if (percentage > 75) {
      $('#timer .progress-bar').addClass('bg-danger');
      $('#timer .progress-bar').removeClass('bg-warning');
    }
  };

  updateHTML();

  timer.addEventListener('secondsUpdated', (/* event */) => {
    updateHTML();
  });

  timer.addEventListener('targetAchieved', (/* event */) => {
    const payload = {
      cmd: 'timer',
      // do we need to feed email in here?
    };

    sendMessage(payload); // eslint-disable-line no-undef
  });
};
