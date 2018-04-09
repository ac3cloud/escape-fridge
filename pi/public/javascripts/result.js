const showResult = (isSmiling) => { // eslint-disable-line no-unused-vars
  const msg = `Access ${isSmiling === 'success' ? 'granted' : 'denied, try again'}!!!`;

  $('#alert').removeClass('alert-success');
  $('#alert').removeClass('alert-danger');
  $('#alert').addClass(`alert-${isSmiling === 'success' ? 'success' : 'danger'}`);
  $('#alert p').html(msg);
  $('#alert').show();
};

const showFaceData = (data) => { // eslint-disable-line no-unused-vars
  $('#face-data pre code').html(JSON.stringify(data, null, 2));
  Prism.highlightAll();
  $('#face-data').show();
};
