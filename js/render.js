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

  var loadingPhotosHandler = function (photoCard) {
    var allPhotos = photoCard;
    imageFilters.classList.remove('img-filters--inactive');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photoCard.length; i++) {
      fragment.appendChild(renderPhotos(photoCard[i]));
    }

    imageFilters.querySelector('.img-filters__form').addEventListener('click', function (evt) {
      var sortPhoto;
      var target = evt.target;
      var changeFillters = imageFilters.querySelectorAll('.img-filters__button');
      for (var j = 0; j < changeFillters.length; j++) {
        if (changeFillters[j].classList.contains('img-filters__button--active')) {
          changeFillters[j].classList.remove('img-filters__button--active');
        }
      }
      var domElements = picturesCard.children;
      for (var k = domElements.length - 1; k >= 0; k--) {
        if (domElements[k].classList.contains('picture')) {
          domElements[k].remove();
        }
      }
      if (target && target.matches('button#filter-popular')) {
        sortPhoto = allPhotos.slice();
        target.classList.add('img-filters__button--active');
      } else if (target && target.matches('button#filter-random')) {
        var randomArr = allPhotos.slice();
        var shuffle = function (arr) {
          var step;
          var temp;
          for (var m = arr.length - 1; m > 0; m--) {
            step = Math.floor(Math.random() * (m + 1));
            temp = arr[step];
            arr[step] = arr[m];
            arr[m] = temp;
          }
          return arr;
        };
        shuffle(randomArr);
        sortPhoto = randomArr.slice(0, 10);
        target.classList.add('img-filters__button--active');
      } else if (target && target.matches('button#filter-discussed')) {
        sortPhoto = allPhotos.slice();
        sortPhoto.sort(function (a, b) {
          return b.likes - a.likes;
        });
        target.classList.add('img-filters__button--active');
      }

      fragment = document.createDocumentFragment();
      for (var l = 0; l < sortPhoto.length; l++) {
        fragment.appendChild(renderPhotos(sortPhoto[l]));
      }

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
