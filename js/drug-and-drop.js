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

      if (window.filter.imagePreview.classList.contains('effects__preview--chrome')) {
        window.filter.imagePreview.style.filter = 'grayscale(' + positionPin / window.filter.effectLine.offsetWidth + ')';
      } else if (window.filter.imagePreview.classList.contains('effects__preview--sepia')) {
        window.filter.imagePreview.style.filter = 'sepia(' + positionPin / window.filter.effectLine.offsetWidth + ')';
      } else if (window.filter.imagePreview.classList.contains('effects__preview--marvin')) {
        window.filter.imagePreview.style.filter = 'invert(' + positionPin / window.filter.effectLine.offsetWidth * 100 + '%)';
      } else if (window.filter.imagePreview.classList.contains('effects__preview--phobos')) {
        var blurEffectLevel = positionPin / window.filter.effectLine.offsetWidth * 3;
        if (blurEffectLevel > 3 || blurEffectLevel < 0) {
          blurEffectLevel = Math.round(blurEffectLevel);
        }
        window.filter.imagePreview.style.filter = 'blur(' + blurEffectLevel + 'px)';
      } else if (window.filter.imagePreview.classList.contains('effects__preview--heat')) {
        var brightnessEffectLevel = (positionPin / window.filter.effectLine.offsetWidth * 2 + 1);
        if (brightnessEffectLevel > 3 || brightnessEffectLevel < 1) {
          brightnessEffectLevel = Math.round(brightnessEffectLevel);
        }
        window.filter.imagePreview.style.filter = 'brightness(' + brightnessEffectLevel + ')';
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
