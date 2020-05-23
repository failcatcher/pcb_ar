import '@/assets/styles/main.css';
import jsQR from 'jsqr';
import { getBoard, getModelPath, getPatternPath } from '@/utils/index';
import * as dat from 'dat.gui';

var video = document.createElement('video'),
  stream = null,
  canvasElement = document.getElementById('canvas'),
  canvas = canvasElement.getContext('2d'),
  boardCode = null;

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: 'environment' } })
  .then((mediaStream) => {
    stream = mediaStream;
    video.srcObject = mediaStream;
    video.setAttribute('playsinline', true);
    video.play();
    requestAnimationFrame(tick);
  });

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code) {
      boardCode = code.data;
    }
  }

  var ModelController = function () {
    this.name = '';
    this.showModel1 = false;
    this.showModel2 = false;
  };

  if (!boardCode) {
    requestAnimationFrame(tick);
  } else {
    let board = getBoard(boardCode);

    if (board == undefined) {
      requestAnimationFrame(tick);
    } else {
      stopVideoStreaming();
      document.body.removeChild(canvasElement);

      let board = getBoard(boardCode);

      let modelPath = getModelPath(board.id, board.levels[0].file),
        patternPath = getPatternPath(board.id);

      var modelController = new ModelController();
      var gui = new dat.GUI();
      gui.add(modelController, 'name');
      gui.add(modelController, 'showModel1');
      gui.add(modelController, 'showModel2');

      document.body.innerHTML =
        `<a-scene embedded arjs>` +
        `<a-marker type="pattern" url="${patternPath}">` +
        `<a-entity obj-model="obj: url(${modelPath.model}); mtl: url(${modelPath.material})"></a-entity>` +
        `</a-marker>` +
        `<a-entity camera></a-entity>` +
        `</a-scene>`;
    }
  }
}

function stopVideoStreaming() {
  video.pause();
  video.srcObject = null;
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}
