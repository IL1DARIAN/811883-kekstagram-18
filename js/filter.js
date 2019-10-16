'use strict';

(function () {
  var n = window.util.IMAGE_SIZE;
  var uploadPhoto = document.querySelector('.img-upload');
  var uploadFile = uploadPhoto.querySelector('.img-upload__input');
  var uploadOverlay = uploadPhoto.querySelector('.img-upload__overlay');
  var uploadClose = uploadPhoto.querySelector('.img-upload__cancel');
  var uploadImg = uploadPhoto.querySelector('.img-upload__scale');
  var imgSize = uploadImg.querySelector('.scale__control--value');
  var imgPreview = uploadPhoto.querySelector('.img-upload__preview img');
  var imgEffects = uploadPhoto.querySelector('.img-upload__effects');
  var imgMod = uploadPhoto.querySelector('.img-upload__effect-level');
  var textDescription = uploadPhoto.querySelector('.text__description');
  var textHashtags = uploadPhoto.querySelector('.text__hashtags');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function () {
    uploadOverlay.classList.remove('hidden');
    imgSize.value = window.util.IMAGE_SIZE + '%';
    imgMod.classList.add('visually-hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    uploadOverlay.classList.add('hidden');
    uploadFile.value = '';
    n = window.util.IMAGE_SIZE;
    textDescription.value = '';
    textHashtags.value = '';
    imgPreview.style = '';
    imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  uploadFile.addEventListener('change', function () {
    openPopup();
  });

  uploadClose.addEventListener('click', function () {
    closePopup();
  });

  uploadImg.addEventListener('click', function (evt) {
    var target = evt.target;
    var size;
    if (target && target.matches('button.scale__control--smaller') && n > window.util.STEP_SIZE) {
      n = n - window.util.STEP_SIZE;
    } else if (target && target.matches('button.scale__control--bigger') && n < window.util.IMAGE_SIZE) {
      n = n + window.util.STEP_SIZE;
    }
    imgSize.value = n + '%';
    size = n / window.util.IMAGE_SIZE;
    imgPreview.style = 'transform: scale(' + size + ')';
  });

  imgEffects.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target && target.matches('span.effects__preview--chrome')) {
      imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat');
      imgPreview.classList.add('effects__preview--chrome');
      imgMod.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--sepia')) {
      imgPreview.classList.remove('effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imgPreview.classList.add('effects__preview--sepia');
      imgMod.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--marvin')) {
      imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imgPreview.classList.add('effects__preview--marvin');
      imgMod.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--phobos')) {
      imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--heat', 'effects__preview--chrome');
      imgPreview.classList.add('effects__preview--phobos');
      imgMod.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--heat')) {
      imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--chrome');
      imgPreview.classList.add('effects__preview--heat');
      imgMod.classList.remove('visually-hidden');
    } else if (target && target.matches('span.effects__preview--none')) {
      imgPreview.classList.remove('effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat', 'effects__preview--chrome');
      imgMod.classList.add('visually-hidden');
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
    if (comment.length > 160) {
      textDescription.setCustomValidity('Длинна сообщения не должна превышать 160 символов');
    }
  });

  textHashtags.addEventListener('input', function () {
    if (textHashtags.value.length === 0) {
      textHashtags.setCustomValidity('');
      return;
    }
    var tags = textHashtags.value.split(' ');
    textHashtags.setCustomValidity('');
    for (var i = 0; i < tags.length; i++) {
      tags[i] = tags[i].toLowerCase();
    }
    for (var k = 0; k < tags.length; k++) {
      for (var j = k + 1; j < tags.length; j++) {
        if (tags[k] === tags[j]) {
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
})();
