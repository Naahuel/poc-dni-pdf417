import './js/BigInteger';
import './js/zxing-pdf417';
import './styles/main.scss';

const image = document.createElement('img')
image.src = require('./images/dni_sample.jpg');

image.addEventListener('load', _ => {
  document.body.appendChild(image);

  const canvas = document.createElement('canvas');
  const canvas_context = canvas.getContext('2d');
  let source, binarizer, bitmap, result;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas_context.drawImage(image, 0, 0, canvas.width, canvas.height);

  try {
    source    = new ZXing.BitmapLuminanceSource(canvas_context, image);
    binarizer = new ZXing.Common.HybridBinarizer(source);
    bitmap    = new ZXing.BinaryBitmap(binarizer);
    result    = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false)
    if( result && result[0] ) {
      let p = document.createElement('p');
      p.innerHTML = result[0].Text.split('@').join('<br />');
      document.body.appendChild(p)
    }
  } catch (err) {
    console.error(err);
  }
});