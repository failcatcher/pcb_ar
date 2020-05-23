import '@/assets/styles/main.css';
import jsQR from 'jsqr';
import { getBoard, getModelPath, getPatternPath } from '@/utils/index';
import Message from '@/utils/message';
import * as dat from 'dat.gui';
import { OBJLoader } from './utils/objloader';
import { MTLLoader } from './utils/mtlloader';

const setLevel = (levelName) => {
  const sceneObj = scene.getObjectByName(currentLevel);
  scene.remove(sceneObj);

  scene.add(objects.find((level) => level.name == levelName).obj);

  currentLevel = levelName;
};

const loadObject = (
  boardId,
  level,
  { material, model, scale, position },
  index
) => {
  new MTLLoader(manager).load(material, function (materials) {
    materials.preload();

    new OBJLoader(manager).setMaterials(materials).load(model, function (obj) {
      decreaseRemainedAmount(boardId);

      obj.scale.set(...scale);
      obj.position.set(...position);
      obj.name = level.name;

      objects.push({
        boardId,
        name: level.name,
        obj
      });

      if (index == 0) {
        currentLevel = level.name;
        scene.add(obj);
      }
    });
  });
};

function decreaseRemainedAmount(boardId) {
  remainedObjects--;
  if (remainedObjects == 0) {
    message.hide();
    initLevelController(boardId);
  }
}

function initLevelController(boardId) {
  modelController.level = '';

  const board = boards.find((board) => board.id == boardId);

  let levelController = gui.add(
    modelController,
    'level',
    board.levels.map((level) => level.name)
  );

  levelController.setValue(board.levels[0].name).onChange(setLevel);
}

const message = new Message();

var boards = [],
  objects = [],
  remainedObjects = 0;

var video, canvas, context;

var modelController, gui, currentLevel;

var renderer = new THREE.WebGLRenderer({
  preserveDrawingBuffer: true,
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

message.show('Наведіть камеру на QR код');

var onRenderFcts = [];

var scene = new THREE.Scene();

var camera = new THREE.Camera();
scene.add(camera);

var light = new THREE.AmbientLight(0xffffff, 2.8);
scene.add(light);

var arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: 'webcam'
});

arToolkitSource.init(function onReady() {
  setTimeout(() => {
    onResize();

    video = document.querySelector('video');

    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
  }, 2000);
});

window.addEventListener('resize', function () {
  onResize();
});

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

var arToolkitContext = new THREEx.ArToolkitContext({
  detectionMode: 'mono'
});

arToolkitContext.init(function onCompleted() {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) return;

  arToolkitContext.update(arToolkitSource.domElement);

  scene.visible = camera.visible;
});

scene.visible = false;

const manager = new THREE.LoadingManager();

onRenderFcts.push(function () {
  renderer.render(scene, camera);
});

onRenderFcts.push(function () {
  if (video && boards.length == 0) {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.hidden = false;

      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        if (boards.find((board) => board.id == code.data) == undefined) {
          initBoard(code.data);
        }
      }
    }
  }
});

var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  requestAnimationFrame(animate);
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;

  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
});

function initBoard(id) {
  message.hide();

  const board = getBoard(id);
  boards.push(board);

  console.log(`Found board ${id}`);

  if (boards.length == 1) {
    modelController = {
      name: board.name
    };

    gui = new dat.GUI();
    gui.add(modelController, 'name');

    let modelParams = {
      scale: board.scale || [1, 1, 1],
      position: board.position || [0, 0, 0]
    };

    remainedObjects = board.levels.length;

    message.show('Завантаження моделей');

    board.levels.map((level, index) => {
      let modelPath = getModelPath(board.id, level.file);
      let params = { ...modelPath, ...modelParams };
      loadObject(id, level, params, index);
    });
  }

  let patternPath = getPatternPath(board.id);

  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type: 'pattern',
    // patternUrl: patternPath,
    patternUrl: 'patterns/hiro.patt',
    changeMatrixMode: 'cameraTransformMatrix'
  });
}
