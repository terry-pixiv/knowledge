async function setupCamera(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    'video': {
      width: 320,
      height: 240
    },
    'audio': false,
  });
  videoElement.srcObject = stream;
  return new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      resolve();
    };
  });
}

function segmentBody(input, output, bodypixnet) {
  async function renderFrame() {
    const segmentation = await bodypixnet.segmentPerson(input);
    const backgroundBlurAmount = 3;
    const edgeBlurAmount = 3;
    const flipHorizontal = true;
    bodyPix.drawBokehEffect(
      output, input, segmentation, backgroundBlurAmount,
      edgeBlurAmount, flipHorizontal);
    requestAnimationFrame(renderFrame);
  }
  renderFrame();
}

function loading(onoff) {
  document.getElementById('loadingicon').style.display = onoff ? 'inline' : 'none';
}

async function start() {
  loading(true);
  const input = document.getElementById('input');
  if (input.srcObject) {
    input.srcObject = null;
  } else {
    const output = document.getElementById('output');
    await setupCamera(input);
    const bodypixnet = await bodyPix.load();
    segmentBody(input, output, bodypixnet);
  }
  loading(false);
}
