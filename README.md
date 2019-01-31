# Lector de código de barras de DNI Argentino
Este demo intenta leer el código de barras 2D en formato PDF417 del DNI argentino desde un stream de la webcam.

Está basado en un [port de JS](https://github.com/PeculiarVentures/js-zxing-pdf417) de [ZXing](http://github.com/zxing/zxing)

## Desarrollo
```
npm install
npm run dev
```

## Build & serve
```
npm run build
npm start
```


El código debe estar bien enfocado y horizontal, lo más paralelo a la imagen como sea posible.

[Ver demo](https://dni-argentino-scan.now.sh)