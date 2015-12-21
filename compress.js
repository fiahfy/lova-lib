var Imagemin = require('imagemin');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

new Imagemin()
	.src('public/assets/img/l/*.jpg')
	.dest('public/assets/img/ll')
	.use(imageminJpegRecompress({
    max: 40
  }))
	.run();

new Imagemin()
	.src('public/assets/img/m/*.jpg')
	.dest('public/assets/img/mm')
	.use(imageminJpegRecompress({
    max: 40
  }))
	.run();
