'use strict';

(function () {
  var similarPhotosTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var similarErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var picturesCard = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');

  var renderPhotos = function (photoCard) {
    var photoElement = similarPhotosTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = photoCard.url;
    photoElement.querySelector('.picture__likes').textContent = photoCard.likes;
    photoElement.querySelector('.picture__comments').textContent = photoCard.comments.length;

    photoElement.addEventListener('click', function () {

      var bigPictures = document.querySelector('.big-picture');
      var socialComments = bigPictures.querySelector('.social__comments');
      var closePicture = bigPictures.querySelector('.big-picture__cancel');
      var addComment = bigPictures.querySelector('.social__footer-text');
      var itemComment = socialComments.querySelector('.social__comment');

      var onPopupEscPress = function (evt) {
        if (evt.keyCode === window.util.ESC_KEYCODE) {
          closePopup();
        }
      };

      var closePopup = function () {
        bigPictures.classList.add('hidden');
        addComment.value = '';
        document.removeEventListener('keydown', onPopupEscPress);
      };

      document.addEventListener('keydown', onPopupEscPress);

      bigPictures.classList.remove('hidden');
      bigPictures.querySelector('.big-picture__img img').src = photoCard.url;
      bigPictures.querySelector('.likes-count').textContent = photoCard.likes;
      bigPictures.querySelector('.comments-count').textContent = photoCard.comments.length;
      bigPictures.querySelector('.social__caption').textContent = photoCard.description;
      bigPictures.querySelector('.social__comment-count').classList.add('visually-hidden');
      bigPictures.querySelector('.comments-loader').classList.add('visually-hidden');

      closePicture.addEventListener('click', function () {
        closePopup();
      });

      addComment.addEventListener('focus', function () {
        document.removeEventListener('keydown', onPopupEscPress);
      });

      addComment.addEventListener('blur', function () {
        document.addEventListener('keydown', onPopupEscPress);
      });

      var renderComment = function () {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < photoCard.comments.length; i++) {
          var commentElement = itemComment.cloneNode(true);
          commentElement.querySelector('.social__picture').src = photoCard.comments[i].avatar;
          commentElement.querySelector('.social__picture').alt = photoCard.comments[i].name;
          commentElement.querySelector('.social__text').textContent = photoCard.comments[i].message;

          fragment.appendChild(commentElement);
        }

        return socialComments.appendChild(fragment);
      };

      socialComments.textContent = '';

      renderComment();

    });

    return photoElement;
  };

  var popularPhotoHandler = function (array) {
    var sortPhoto = array.slice();
    return sortPhoto;
  };

  var randomPhotoHandler = function (array) {
    var randomArr = array.slice();
    window.util.shuffle(randomArr);
    var sortPhoto = randomArr.slice(0, 10);
    return sortPhoto;
  };

  var likesPhotoHandler = function (array) {
    var sortPhoto = array.slice();
    sortPhoto.sort(function (a, b) {
      return b.likes - a.likes;
    });
    return sortPhoto;
  };

  var sortPhotoHandler = function (popular, random, likes, array) {
    var sortPhoto;
    if (document.querySelector('#filter-popular').classList.contains('img-filters__button--active')) {
      sortPhoto = popular(array);
    } else if (document.querySelector('#filter-random').classList.contains('img-filters__button--active')) {
      sortPhoto = random(array);
    } else if (document.querySelector('#filter-discussed').classList.contains('img-filters__button--active')) {
      sortPhoto = likes(array);
    }
    return sortPhoto;
  };

  var renderFragmentHandler = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPhotos(array[i]));
    }
    return fragment;
  };

  var loadingPhotosHandler = function (photoCard) {
    var allPhotos = photoCard;
    imageFilters.classList.remove('img-filters--inactive');
    var sortPhoto = sortPhotoHandler(popularPhotoHandler, randomPhotoHandler, likesPhotoHandler, allPhotos);
    var fragment = renderFragmentHandler(sortPhoto);

    imageFilters.querySelector('.img-filters__form').addEventListener('click', function (evt) {
      var target = evt.target;
      if (target && target.matches('button.img-filters__button')) {
        document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
      } else {
        return sortPhoto;
      }
      var delElements = picturesCard.querySelectorAll('.picture');
      delElements.forEach(function (picture) {
        if (picture.classList.contains('picture')) {
          picture.remove();
        }
      });
      sortPhoto = sortPhotoHandler(popularPhotoHandler, randomPhotoHandler, likesPhotoHandler, allPhotos);
      fragment = renderFragmentHandler(sortPhoto);
      return picturesCard.appendChild(fragment);
    });

    return picturesCard.appendChild(fragment);
  };

  var errorPhotosHandler = function () {
    var node = similarErrorTemplate.cloneNode(true);

    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(loadingPhotosHandler, errorPhotosHandler);
})();
