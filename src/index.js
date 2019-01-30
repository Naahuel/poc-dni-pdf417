import './js/BigInteger';
import './js/zxing-pdf417';
import './styles/main.scss';

// Crossbrowser getUserMedia
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

// Variables
let _canvasWidth = 0, _canvasHeight = 0;
let source, binarizer, bitmap, result;

// Crear canvas para el video
const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

// Párrafo de resultado
let resultP = document.createElement('p');
document.body.appendChild(resultP)

// Agregar canvas al body
document.body.appendChild(canvas);

// Crear elemento video e imagen
const video = document.createElement('video');
      video.setAttribute('autoplay',true);
const image = document.createElement('img')

const startWebcam = () => { 
  navigator.getUserMedia({ video: true, audio: false }, function(stream) {
    video.srcObject = stream;
  }, function(e) {
    console.error('Error de cámara', e);
  });
}

let loopFrame;

const loop = () => {
  // Loop principal
  loopFrame = requestAnimationFrame(loop);
  ctx.globalAlpha = 1;
  image.src = canvas.toDataURL();
  ctx.drawImage(video, 0, 0, _canvasWidth, _canvasHeight);

  // Analizar frame

  if( image.naturalWidth && image.naturalHeight ) {
    try {
      source    = new ZXing.BitmapLuminanceSource(ctx, image);
      binarizer = new ZXing.Common.HybridBinarizer(source);
      bitmap    = new ZXing.BinaryBitmap(binarizer);
      result    = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false)
      if( result && result[0] ) {
        resultP.innerHTML = result[0].Text.split('@').join('<br />');
      }
     
    } catch (err) {
      console.error(err);
    }
  }
}

const startLoop = () => { 
  loopFrame = loopFrame || requestAnimationFrame(loop);
}

// Iniciar loop
video.addEventListener('loadedmetadata',function(){
  _canvasWidth  = canvas.width = video.videoWidth;
  _canvasHeight = canvas.height = video.videoHeight;
  startLoop();
});


// Inicializar
startWebcam();