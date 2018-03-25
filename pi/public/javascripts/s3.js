const s3Upload = () => new Promise((resolve /* , reject */) => { // eslint-disable-line no-unused-vars
  const [canvas] = $('#canvas');

  canvas.toBlob((image) => {
    fetch('/s3', { method: 'POST' })
      .then(res => res.json())
      .then(body => fetch(body.url, { method: 'PUT', headers: { 'content-type': 'image/png' }, body: image }))
      .then(() => resolve());
  });
});
