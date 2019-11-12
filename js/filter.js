'use strict';

(function () {
  var imageSize = window.util.IMAGE_SIZE;
  var photoUploadNode = document.querySelector('.img-upload');
  var fileUploadNode = photoUploadNode.querySelector('.img-upload__input');
  var photoOverlay = photoUploadNode.querySelector('.img-upload__overlay');
  var photoCloseButton = photoUploadNode.querySelector('.img-upload__cancel');
  var photoResizeNode = photoUploadNode.querySelector('.img-upload__scale');
  var imageResizeButton = photoResizeNode.querySelector('.scale__control--value');
  var imagePreview = photoUploadNode.querySelector('.img-upload__preview img');
  var imageEffects = photoUploadNode.querySelector('.img-upload__effects');
  var imageSlider = photoUploadNode.querySelector('.img-upload__effect-level');
  var textDescription = photoUploadNode.querySelector('.text__description');
  var textHashtags = photoUploadNode.querySelector('.text__hashtags');
  var formSubmit = photoUploadNode.querySelector('.img-upload__form');
  var similarSuccessTemplate = document.querySelector('#success').content.querySelector('.success');
  var similarErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var effectLine = document.querySelector('.effect-level__line');
  var effectPin = effectLine.querySelector('.effect-level__pin');
  var effectDepth = effectLine.querySelector('.effect-level__depth');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function () {
    photoOverlay.classList.remove('hidden');
    imageResizeButton.value = window.util.IMAGE_SIZE + '%';
    imageSlider.classList.add('visually-hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    photoOverlay.classList.add('hidden');
    fileUploadNode.value = '';
    imageSize = window.util.IMAGE_SIZE;
    textDescription.value = '';
    textHashtags.value = '';
    imagePreview.style = '';
    imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
    photoUploadNode.querySelector('#effect-none').checked = 'true';
    document.removeEventListener('keydown', onPopupEscPress);
  };

  fileUploadNode.addEventListener('change', function () {
    openPopup();
  });

  photoCloseButton.addEventListener('click', function () {
    closePopup();
  });

  photoResizeNode.addEventListener('click', function (evt) {
    var target = evt.target;
    var size;
    if (target && target.matches('button.scale__control--smaller') && imageSize > window.util.STEP_SIZE) {
      imageSize = imageSize - window.util.STEP_SIZE;
    } else if (target && target.matches('button.scale__control--bigger') && imageSize < window.util.IMAGE_SIZE) {
      imageSize = imageSize + window.util.STEP_SIZE;
    }
    imageResizeButton.value = imageSize + '%';
    size = imageSize / window.util.IMAGE_SIZE;
    imagePreview.style = 'transform: scale(' + size + ')';
  });

  imageEffects.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target && target.matches('span.effects__preview--chrome')) {
      imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat');
      imagePreview.style.filter = '';
      imagePreview.classList.add('effects__preview--chrome');
      imagePreview.style.filter = 'grayscale(1)';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      imageSlider.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--sepia')) {
      imagePreview.classList.remove('effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imagePreview.style.filter = '';
      imagePreview.classList.add('effects__preview--sepia');
      imagePreview.style.filter = 'sepia(1)';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      imageSlider.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--marvin')) {
      imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imagePreview.style.filter = '';
      imagePreview.classList.add('effects__preview--marvin');
      imagePreview.style.filter = 'invert(100%)';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      imageSlider.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--phobos')) {
      imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--heat', 'effects__preview--chrome');
      imagePreview.style.filter = '';
      imagePreview.classList.add('effects__preview--phobos');
      imagePreview.style.filter = 'blur(3px)';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      imageSlider.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--heat')) {
      imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--chrome');
      imagePreview.style.filter = '';
      imagePreview.classList.add('effects__preview--heat');
      imagePreview.style.filter = 'brightness(3)';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      imageSlider.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--none')) {
      imagePreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imagePreview.style.filter = '';
      imageSlider.classList.add('visually-hidden');
    }
  });

  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });

  textDescription.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });

  textHashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });

  textHashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });

  textDescription.addEventListener('input', function () {
    var comment = textDescription.value;
    textDescription.setCustomValidity('');
    if (comment.length > 140) {
      textDescription.setCustomValidity('Длинна сообщения не должна превышать 140 символов');
    }
  });

  textHashtags.addEventListener('input', function () {
    if (textHashtags.value.length === 0) {
      textHashtags.setCustomValidity('');
      return;
    }
    var tags = textHashtags.value.split(' ');
    textHashtags.setCustomValidity('');
    for (var k = 0; k < tags.length; k++) {
      for (var j = k + 1; j < tags.length; j++) {
        if (tags[k].toLowerCase() === tags[j].toLowerCase()) {
          textHashtags.setCustomValidity('Одинаковые хештеги не допускаются');
        }
      }
      if (tags[k][0] !== '#') {
        textHashtags.setCustomValidity('Хештег должен начинаться с символа #');
      } else if (tags[k].length === 1) {
        textHashtags.setCustomValidity('Хештег не может состоять из одного символа');
      } else if (tags[k].length > 20) {
        textHashtags.setCustomValidity('Длинна хештега не должна превышать 20 символов');
      } else if (tags[k].slice(1).includes('#')) {
        textHashtags.setCustomValidity('Хэштеги должны быть разделены пробелом');
      }
    }
    if (tags.length > 5) {
      textHashtags.setCustomValidity('Должно быть не больше 5 хештегов');
    }
  });

  var uploadPhotoHandler = function () {
    var node = similarSuccessTemplate.cloneNode(true);
    closePopup();
    document.body.insertAdjacentElement('afterbegin', node);

    var successPopupWrapper = document.querySelector('.success');
    var successPopup = successPopupWrapper.querySelector('.success__inner');
    var successButton = successPopupWrapper.querySelector('.success__button');

    var closeSuccessPopupEsc = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closeSuccessPopup();
      }
    };

    var closeSuccessPopupOutside = function (evt) {
      if (!successPopup.contains(evt.target)) {
        closeSuccessPopup();
      }
    };

    var closeSuccessPopup = function () {
      successPopupWrapper.classList.add('visually-hidden');
      document.removeEventListener('keydown', closeSuccessPopupEsc);
      document.removeEventListener('click', closeSuccessPopupOutside);
    };


    document.addEventListener('click', closeSuccessPopupOutside);
    document.addEventListener('keydown', closeSuccessPopupEsc);
    successButton.addEventListener('click', closeSuccessPopup);
  };

  var errorUploadHandler = function () {
    var node = similarErrorTemplate.cloneNode(true);
    closePopup();
    document.body.insertAdjacentElement('afterbegin', node);

    var errorPopupWrapper = document.querySelector('.error');
    var errorPopup = errorPopupWrapper.querySelector('.error__inner');
    var errorButtons = errorPopupWrapper.querySelectorAll('.error__button');

    var closeErrorPopupEsc = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        closeErrorPopup();
      }
    };

    var closeErrorPopupOutside = function (evt) {
      if (!errorPopup.contains(evt.target)) {
        closeErrorPopup();
      }
    };

    var closeErrorPopup = function () {
      errorPopupWrapper.classList.add('visually-hidden');
      document.removeEventListener('keydown', closeErrorPopupEsc);
      document.removeEventListener('click', closeErrorPopupOutside);
    };


    document.addEventListener('click', closeErrorPopupOutside);
    document.addEventListener('keydown', closeErrorPopupEsc);
    for (var i = 0; i < errorButtons.length; i++) {
      errorButtons[i].addEventListener('click', closeErrorPopup);
    }
  };

  formSubmit.addEventListener('submit', function (evt) {
    window.upload(new FormData(formSubmit), uploadPhotoHandler, errorUploadHandler);
    evt.preventDefault();
  });

  window.filter = {
    imagePreview: imagePreview,
    effectLine: effectLine,
    effectPin: effectPin,
    effectDepth: effectDepth
  };
})();
