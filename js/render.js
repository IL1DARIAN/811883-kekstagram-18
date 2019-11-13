'use strict';

(function () {
  var similarPhotosTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var similarErrorTemplate = document.querySelector('#error').content.querySelector('.error');
  var picturesCard = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');

  var renderPhotos = function (photoCard) {
    var createdPhoto = similarPhotosTemplate.cloneNode(true);

    createdPhoto.querySelector('.picture__img').src = photoCard.url;
    createdPhoto.querySelector('.picture__likes').textContent = photoCard.likes;
    createdPhoto.querySelector('.picture__comments').textContent = photoCard.comments.length;

    createdPhoto.addEventListener('click', function () {

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
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onPopupEscPress);
      };

      document.addEventListener('keydown', onPopupEscPress);

      bigPictures.classList.remove('hidden');
      document.body.classList.add('modal-open');
      bigPictures.querySelector('.big-picture__img img').src = photoCard.url;
      bigPictures.querySelector('.likes-count').textContent = photoCard.likes;
      bigPictures.querySelector('.comments-count').textContent = photoCard.comments.length;
      bigPictures.querySelector('.social__caption').textContent = photoCard.description;


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
        var maxComments = window.util.MAX_COMMENT;
        var createdComment;

        var renderComments = function (iterator) {
          createdComment = itemComment.cloneNode(true);
          createdComment.querySelector('.social__picture').src = photoCard.comments[iterator].avatar;
          createdComment.querySelector('.social__picture').alt = photoCard.comments[iterator].name;
          createdComment.querySelector('.social__text').textContent = photoCard.comments[iterator].message;
          return fragment.appendChild(createdComment);
        };

        if (photoCard.comments.length <= maxComments) {
          for (var i = 0; i < photoCard.comments.length; i++) {
            renderComments(i);
            bigPictures.querySelector('.comments-loader').classList.add('visually-hidden');
            bigPictures.querySelector('.social__comment-count').innerHTML = photoCard.comments.length + ' из <span class="comments-count"> ' + photoCard.comments.length + '<span> комментариев';
          }
        } else {
          for (var j = 0; j < maxComments; j++) {
            renderComments(j);
            bigPictures.querySelector('.comments-loader').classList.remove('visually-hidden');
            bigPictures.querySelector('.social__comment-count').innerHTML = maxComments + ' из <span class="comments-count"> ' + photoCard.comments.length + '<span> комментариев';
          }
        }

        bigPictures.querySelector('.comments-loader').addEventListener('click', function () {
          socialComments.textContent = '';
          maxComments = maxComments + window.util.STEP_COMMENT;
          if (photoCard.comments.length <= maxComments) {
            for (var k = 0; k < photoCard.comments.length; k++) {
              renderComments(k);
              bigPictures.querySelector('.comments-loader').classList.add('visually-hidden');
              bigPictures.querySelector('.social__comment-count').innerHTML = photoCard.comments.length + ' из <span class="comments-count"> ' + photoCard.comments.length + '<span> комментариев';
            }
          } else {
            for (var l = 0; l < maxComments; l++) {
              renderComments(l);
              bigPictures.querySelector('.comments-loader').classList.remove('visually-hidden');
              bigPictures.querySelector('.social__comment-count').innerHTML = maxComments + ' из <span class="comments-count"> ' + photoCard.comments.length + '<span> комментариев';
            }
          }

          return socialComments.appendChild(fragment);
        });

        return socialComments.appendChild(fragment);
      };

      socialComments.textContent = '';

      renderComment();
    });

    return createdPhoto;
  };

  var getPopularPhotos = function (array) {
    var sortedPhotos = array.slice();
    return sortedPhotos;
  };

  var getRandomPhotos = function (array) {
    var randomArray = array.slice();
    window.util.shuffle(randomArray);
    var sortedPhotos = randomArray.slice(0, 10);
    return sortedPhotos;
  };

  var getDiscussedPhotos = function (array) {
    var sortedPhotos = array.slice();
    sortedPhotos.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return sortedPhotos;
  };

  var getSortedPhotos = function (popularPhotos, randomPhotos, discussedPhotos, array) {
    var sortedPhotos;
    if (document.querySelector('#filter-popular').classList.contains('img-filters__button--active')) {
      sortedPhotos = popularPhotos(array);
    } else if (document.querySelector('#filter-random').classList.contains('img-filters__button--active')) {
      sortedPhotos = randomPhotos(array);
    } else if (document.querySelector('#filter-discussed').classList.contains('img-filters__button--active')) {
      sortedPhotos = discussedPhotos(array);
    }
    return sortedPhotos;
  };

  var renderFragment = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPhotos(array[i]));
    }
    return fragment;
  };

  var clearPhotos = function () {
    var deletedPictures = picturesCard.querySelectorAll('.picture');
    deletedPictures.forEach(function (picture) {
      if (picture.classList.contains('picture')) {
        picture.remove();
      }
    });
  };

  var loadingPhotosHandler = function (photoCard) {
    var allPhotos = photoCard;
    var sortedPhotos = getSortedPhotos(getPopularPhotos, getRandomPhotos, getDiscussedPhotos, allPhotos);
    var fragment = renderFragment(sortedPhotos);
    var drawPhotos = window.util.debounce(function () {
      clearPhotos();
      sortedPhotos = getSortedPhotos(getPopularPhotos, getRandomPhotos, getDiscussedPhotos, allPhotos);
      fragment = renderFragment(sortedPhotos);
      picturesCard.appendChild(fragment);
    });
    imageFilters.classList.remove('img-filters--inactive');

    imageFilters.querySelector('.img-filters__form').addEventListener('click', function (evt) {
      var target = evt.target;
      if (target && target.matches('button.img-filters__button')) {
        document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        drawPhotos(photoCard, allPhotos);
      }
    });
    picturesCard.appendChild(fragment);
  };

  var errorPhotosHandler = function () {
    var node = similarErrorTemplate.cloneNode(true);
    document.body.insertAdjacentElement('afterbegin', node);

    var errorPopupWrapper = document.querySelector('.error');
    var errorPopup = errorPopupWrapper.querySelector('.error__inner');
    var errorButtons = errorPopupWrapper.querySelectorAll('.error__button');

    var errorPopupEscPressHandler = function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE) {
        errorPopupCloseHandler();
      }
    };

    var errorPopupClickOutsideHandler = function (evt) {
      if (!errorPopup.contains(evt.target)) {
        errorPopupCloseHandler();
      }
    };

    var errorPopupCloseHandler = function () {
      errorPopupWrapper.classList.add('visually-hidden');
      document.removeEventListener('keydown', errorPopupEscPressHandler);
      document.removeEventListener('click', errorPopupClickOutsideHandler);
    };


    document.addEventListener('click', errorPopupClickOutsideHandler);
    document.addEventListener('keydown', errorPopupEscPressHandler);
    for (var i = 0; i < errorButtons.length; i++) {
      errorButtons[i].addEventListener('click', errorPopupCloseHandler);
    }
  };

  window.load(loadingPhotosHandler, errorPhotosHandler);
})();
