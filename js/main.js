'use strict';

var STORYES = 25;
var MIN_LIKE = 15;
var MAX_LIKE = 200;
var MIN_COMMENT = 1;
var MAX_COMMENT = 2;
var MIN_AUTHOR = 1;
var MAX_AUTHOR = 6;
var ESC_KEYCODE = 27;
var IMAGE_SIZE = 100;
var STEP_SIZE = 25;
var n = IMAGE_SIZE;

var totalComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var names = ['Генрих Цой', 'Варлам Купатов', 'Владимир Дорогомылов', 'Айрат Байхазов', 'Валентина Глазунова', 'Алла Томилина'];

var similarPhotosTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesCard = document.querySelector('.pictures');

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getComments = function () {
  var comments = [];

  for (var i = MIN_COMMENT; i <= getRandom(MIN_COMMENT, MAX_COMMENT); i++) {
    comments.push({
      avatar: 'img/avatar-' + getRandom(MIN_AUTHOR, MAX_AUTHOR) + '.svg',
      massage: totalComments[getRandom(0, totalComments.length - 1)],
      name: names[getRandom(0, names.length - 1)]
    });
  }

  return comments;
};

var getPhotos = function () {
  var photos = [];

  for (var i = 1; i <= STORYES; i++) {
    photos.push({
      url: 'photos/' + i + '.jpg',
      description: 'Описание ' + i,
      likes: getRandom(MIN_LIKE, MAX_LIKE),
      comments: getComments()
    });
  }

  return photos;
};

var renderPhotos = function (photoCard) {
  var photoElement = similarPhotosTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photoCard.url;
  photoElement.querySelector('.picture__likes').textContent = photoCard.likes;
  photoElement.querySelector('.picture__comments').textContent = photoCard.comments.length;

  return photoElement;
};

var totalPhotos = getPhotos();

var loadingPhotos = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < totalPhotos.length; i++) {
    fragment.appendChild(renderPhotos(totalPhotos[i]));
  }

  return picturesCard.appendChild(fragment);
};

loadingPhotos();

var bigPictures = document.querySelector('.big-picture');

//  bigPictures.classList.remove('hidden');
bigPictures.querySelector('.big-picture__img img').src = totalPhotos[0].url;
bigPictures.querySelector('.likes-count').textContent = totalPhotos[0].likes;
bigPictures.querySelector('.comments-count').textContent = totalPhotos[0].comments.length;
bigPictures.querySelector('.social__caption').textContent = totalPhotos[0].description;
bigPictures.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPictures.querySelector('.comments-loader').classList.add('visually-hidden');

var socialComments = bigPictures.querySelector('.social__comments');
var itemComment = socialComments.querySelector('.social__comment');

var renderComment = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < totalPhotos[0].comments.length; i++) {
    var commentElement = itemComment.cloneNode(true);
    commentElement.querySelector('.social__picture').src = totalPhotos[0].comments[i].avatar;
    commentElement.querySelector('.social__picture').alt = totalPhotos[0].comments[i].name;
    commentElement.querySelector('.social__text').textContent = totalPhotos[0].comments[i].massage;

    fragment.appendChild(commentElement);
  }

  return socialComments.appendChild(fragment);
};

socialComments.textContent = '';

renderComment();

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
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  uploadOverlay.classList.remove('hidden');
  imgSize.value = IMAGE_SIZE + '%';
  imgMod.classList.add('visually-hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  uploadOverlay.classList.add('hidden');
  uploadFile.value = '';
  n = IMAGE_SIZE;
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
  if (target && target.matches('button.scale__control--smaller') && n > STEP_SIZE) {
    n = n - STEP_SIZE;
  } else if (target && target.matches('button.scale__control--bigger') && n < IMAGE_SIZE) {
    n = n + STEP_SIZE;
  }
  imgSize.value = n + '%';
  size = n / IMAGE_SIZE;
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
  var tags = textHashtags.value.split(' ');
  textHashtags.setCustomValidity('');
  for (var i = 0; i < tags.length; i++) {
    tags[i] = tags[i].toLowerCase();
  }
  for (var k = 0; k < tags.length; k++) {
    for (var j = i + 1; j < tags.length; j++) {
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
    }
  }
  if (tags.length > 5) {
    textHashtags.setCustomValidity('Должно быть не больше 5 хештегов');
  }
});
