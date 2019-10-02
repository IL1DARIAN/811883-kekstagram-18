'use strict';

var STORYES = 25;
var MIN_LIKE = 15;
var MAX_LIKE = 200;
var MIN_COMMENT = 1;
var MAX_COMMENT = 2;
var MIN_AUTHOR = 1;
var MAX_AUTHOR = 6;

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

bigPictures.classList.remove('hidden');
bigPictures.querySelector('.big-picture__img img').src = totalPhotos[0].url;
bigPictures.querySelector('.likes-count').textContent = totalPhotos[0].likes;
bigPictures.querySelector('.comments-count').textContent = totalPhotos[0].comments.length;
bigPictures.querySelector('.social__caption').textContent = totalPhotos[0].description;
bigPictures.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPictures.querySelector('.comments-loader').classList.add('visually-hidden');

var socialComments = bigPictures.querySelector('.social__comments');
var itemComment = socialComments.querySelector('.social__comment');

var renderComment = function () {
  var commentElement = itemComment.cloneNode(true);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < totalPhotos[0].comments.length; i++) {
    commentElement.querySelector('.social__picture').src = totalPhotos[0].comments[i].avatar;
    commentElement.querySelector('.social__picture').alt = totalPhotos[0].comments[i].name;
    commentElement.querySelector('.social__text').textContent = totalPhotos[0].comments[i].massage;

    fragment.appendChild(commentElement);
  }

  return socialComments.appendChild(fragment);
};

socialComments.textContent = '';

renderComment();
