'use strict';

(function () {
  window.filter.effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoordsX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      var shift = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;
      var positionPin = window.filter.effectPin.offsetLeft - shift;
      window.filter.effectPin.style.left = positionPin + 'px';
      window.filter.effectDepth.style.width = positionPin + 'px';

      if (window.filter.imgPreview.classList.contains('effects__preview--chrome')) {
        window.filter.imgPreview.style.filter = 'grayscale(' + positionPin / window.filter.effectLine.offsetWidth + ')';
      } else if (window.filter.imgPreview.classList.contains('effects__preview--sepia')) {
        window.filter.imgPreview.style.filter = 'sepia(' + positionPin / window.filter.effectLine.offsetWidth + ')';
      } else if (window.filter.imgPreview.classList.contains('effects__preview--marvin')) {
        window.filter.imgPreview.style.filter = 'invert(' + positionPin / window.filter.effectLine.offsetWidth * 100 + '%)';
      } else if (window.filter.imgPreview.classList.contains('effects__preview--phobos')) {
        window.filter.imgPreview.style.filter = 'blur(' + positionPin / window.filter.effectLine.offsetWidth * 3 + 'px)';
      } else if (window.filter.imgPreview.classList.contains('effects__preview--heat')) {
        window.filter.imgPreview.style.filter = 'brightness(' + (positionPin / window.filter.effectLine.offsetWidth * 2 + 1) + ')';
      }

      if (positionPin <= 0) {
        window.filter.effectPin.style.left = 0;
        window.filter.effectDepth.style.width = 0;
      } else if (positionPin >= window.filter.effectLine.offsetWidth) {
        window.filter.effectPin.style.left = window.filter.effectLine.offsetWidth + 'px';
        window.filter.effectDepth.style.width = window.filter.effectLine.offsetWidth + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
