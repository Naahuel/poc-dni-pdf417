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
let skipFrame = 25;
let loopFrame;
let source, binarizer, bitmap, result;
let ultimoDni = '';

// Crear canvas para el video
const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

// Párrafo de resultado
let resultP        = document.getElementById('result');
let resultTemplate = resultP.innerHTML;

// Crear elemento video e imagen
const video = document.getElementById('dniVideo');
const image = document.createElement('img');

// Validaciones
const validarTexto = _text => {
  // El protocolo mantiene el texto en mayúsculas y sin caracteres especiales
  let _regex = /^[A-Z ]+$/;
  return _regex.test(_text.trim());
}
const validarFecha = _text => {
  let _regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}?$/;
  return _regex.test(_text.trim());
}
const validarNumero = _text => {
  _text = _text.trim();
  return !isNaN(_text) && _text.length >= 7 && _text.length <= 8;
}

// Parsear resultado
const parseResult = _text => {
  let result = resultTemplate,
      nombre = '',
      apellido = '',
      dni = '',
      sexo = '',
      fechaNac = '',
      raw = _text;
  let data = _text.split('@');
  console.log(data);
  if( data.length == 8 ||  data.length == 9 ) {
    // Formato nuevo
    apellido = data[1]
    nombre   = data[2]
    sexo     = data[3]
    dni      = data[4]
    fechaNac = data[6]

  } else if (data.length == 15) {
    // Formato anterior
    apellido = data[4]
    nombre   = data[5]
    sexo     = data[8]
    dni      = data[1]
    fechaNac = data[7]
  } else {
    // Formato NO identificado
    return;
  }

  if( ultimoDni === dni ) {
    // El DNI escaneado es igual al último
    return;
  }

  if( validarFecha(fechaNac) &&
      validarNumero(dni) && 
      validarTexto(sexo) && 
      validarTexto(apellido) && 
      validarTexto(nombre) ) {
    result = result.replace('%raw%', raw);
    result = result.replace('%nombre%', nombre);
    result = result.replace('%apellido%', apellido);
    result = result.replace('%sexo%', sexo);
    result = result.replace('%dni%', dni);
    result = result.replace('%fechaNac%', fechaNac);

    resultP.innerHTML = result;
  }
}

const startWebcam = () => { 
  //----------------------------------------------------------------------
  //  Here we list all media devices, in order to choose between
  //  the front and the back camera.
  //      videoDevices[0] : Front Camera
  //      videoDevices[1] : Back Camera
  //----------------------------------------------------------------------
  navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    let videoDevices = [0,0];
    let videoDeviceIndex = 0;
    devices.forEach(function(device) {
      // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
      if (device.kind == "videoinput") {  
        videoDevices[videoDeviceIndex++] =  device.deviceId;    
      }
    });

    let _videoDevice = videoDevices[1] ? videoDevices[1] : videoDevices[0];
    let constraints =  {
      width: { min: 320, ideal: 640, max: 1024 },
      height: { min: 240, ideal: 480, max: 768 },
      deviceId: { exact: _videoDevice  } 
    };
    
    return navigator.mediaDevices.getUserMedia({ video: constraints });
  })
  .then(stream => {
    if (video.mozSrcObject !== undefined) {
      video.mozSrcObject = stream;
    } else if (video.srcObject !== undefined) {
      video.srcObject = stream;
    } else {
      video.src = stream;
    }})
  .catch(e => console.error(e));
}

const mainLoop = () => {
  // Loop principal
  loopFrame = requestAnimationFrame(mainLoop);
  ctx.globalAlpha = 1;
  image.src = canvas.toDataURL();
  ctx.drawImage(video, 0, 0, _canvasWidth, _canvasHeight);

  // Analizar frame

  if( (loopFrame % skipFrame !== 0) && image.naturalWidth && image.naturalHeight ) {
    try {
      source    = new ZXing.BitmapLuminanceSource(ctx, image);
      binarizer = new ZXing.Common.HybridBinarizer(source);
      bitmap    = new ZXing.BinaryBitmap(binarizer);
      result    = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false)
      if( result && result[0] ) {
        parseResult(result[0].Text);
      }
     
    } catch (err) {
      console.error(err);
    }
  }
}

const startLoop = () => { 
  loopFrame = loopFrame || requestAnimationFrame(mainLoop);
}

// Iniciar loop al cargar video
video.addEventListener('loadedmetadata',function(){
  _canvasWidth  = canvas.width = video.videoWidth;
  _canvasHeight = canvas.height = video.videoHeight;
  startLoop();
});

// Inicializar
startWebcam();