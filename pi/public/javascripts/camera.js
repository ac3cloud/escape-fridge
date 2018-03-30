// https://github.com/mdn/samples-server/tree/master/s/webrtc-capturestill

const width = 320;
let height = 0; // This will be computed based on the input stream

let streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.
let video = null;
let canvas = null;
let photo = null;

// Fill the photo with an indication that none has been
// captured.
const clearphoto = () => {
  const context = canvas.getContext('2d');
  context.fillStyle = '#AAA';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
};

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.
const takePhoto = () => { // eslint-disable-line no-unused-vars
  const context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);

    $('#camera').addClass('collapse');
    $('#face-data p').html('Processing your smile...');
    $('#output').removeClass('collapse');
  } else {
    clearphoto();
  }
};

const startup = () => {
  [video] = $('#video');
  [canvas] = $('#canvas');
  [photo] = $('#photo');

  navigator.getUserMedia(
    {
      video: true,
      audio: false,
    },
    (stream) => {
      video.srcObject = stream;
      video.play();
    },
    err => console.error(`An error occured! ${err}`),
  );

  video.addEventListener('canplay', (/* event */) => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  clearphoto();
};

window.addEventListener('load', startup, false);
