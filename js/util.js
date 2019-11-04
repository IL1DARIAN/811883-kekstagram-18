'use strict';

(function () {
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
  var DEBOUNCE_INTERVAL = 500;

  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  var shuffle = function (arr) {
    var step;
    var temp;
    for (var i = arr.length - 1; i > 0; i--) {
      step = Math.floor(Math.random() * (i + 1));
      temp = arr[step];
      arr[step] = arr[i];
      arr[i] = temp;
    }
    return arr;
  };

  window.util = {
    STORYES: STORYES,
    MIN_LIKE: MIN_LIKE,
    MAX_LIKE: MAX_LIKE,
    MIN_COMMENT: MIN_COMMENT,
    MAX_COMMENT: MAX_COMMENT,
    MIN_AUTHOR: MIN_AUTHOR,
    MAX_AUTHOR: MAX_AUTHOR,
    ESC_KEYCODE: ESC_KEYCODE,
    IMAGE_SIZE: IMAGE_SIZE,
    STEP_SIZE: STEP_SIZE,
    getRandom: getRandom,
    debounce: debounce,
    shuffle: shuffle
  };
})();
