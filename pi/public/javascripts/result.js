const showResult = (isSmiling) => { // eslint-disable-line no-unused-vars
  const msg = `Access ${isSmiling === 'success' ? 'granted' : 'denied, try again'}!!!`;

  $('#result').addClass(`alert-${isSmiling === 'success' ? 'success' : 'danger'}`);
  $('#result p').html(msg);
  $('#result').show();
};

const showFaceData = (data) => { // eslint-disable-line no-unused-vars
  $('#face-data pre').html(JSON.stringify(data, null, 2));
  $('#face-data').show();
};
