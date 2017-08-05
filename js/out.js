/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

$(function(){ //DOMContentLoaded



// loading tracks from array

  let tracksGroup = new Pizzicato.Group();
  let counter = 0;
  const tracksArr = ['./../audio/BP/DRUMS.wav', './../audio/BP/BASS.wav', './../audio/BP/GTR.wav', './../audio/BP/VOC.wav'];
  const tracksNames = ['DRUMS', 'BASS', 'GTR', 'VOC' ];
  const tracksSoloed = [false, false, false, false ];





  tracksArr.forEach( (t,i) => {

      const track = new Pizzicato.Sound({

        source: 'file',
        options: { path: t }
      }, function() {

        console.log(i + ' audio file loaded!');
        counter++;
      });

      tracksGroup.addSound(track);

      // creating channel strips

      let newStrip = $('<div class="strip"><div class="effectBox"></div><div class="panBox"><div class="panKnob"><div class="knobMark"></div></div></div><div class="buttonBox"><button class="solo">S</button><button class="mute">M</button></div><div class="trackbox"><div class="track"><div data-id='+i+' class="fader'+i+' fader"></div></div></div><p class="label">'+tracksNames[i]+'</p></div>');
      $('.masterStrip').before(newStrip);

      track.volume = 0.6999;


  }); // end of forEach




  // volume functionalities



    const $fader = $('.fader');

    function checkIfNotSoloed() {
      const arr = tracksSoloed.filter( function(i) {
        return i === true
      });
      return arr.length > 0 ? false : true;
    };


    function setVolume(index, thisFader) {
      if( tracksSoloed[index] || checkIfNotSoloed() ) {
        tracksGroup.sounds[index].volume = ( parseInt(thisFader.css('top')) - 315 ) / -350;
      };
    };


    $fader.on('mousemove', function(e) {

        e.preventDefault();

        const $mute = $(this).parent().parent().prev().find('.mute');
        const $solo = $(this).parent().parent().prev().find('.solo');



        if ( $mute.hasClass('muted') ) {

            null;

        } else {

            if( e.buttons === 1 ) {
              $(this).css('top', e.pageY - 310);
              if( parseInt($(this).css('top')) >= 315 ) {
                $(this).css('top', '315px');
              } else if( parseInt($(this).css('top')) < -35 ) {
                $(this).css('top', '-35px');
              };
              setVolume( $(this).data('id'), $(this) );
           };
       };

    });


    // double click on fader

    $fader.on('dblclick', function() {
        if ( $mute.hasClass('muted') ) {
          null;
        } else {
          $(this).css('top', '70px');
          setVolume( $(this).data('id'), $(this) );
        };

    });




  // solo & mute


    // mute


      const $mute = $('.mute');

      $mute.on('click', function() {

          const id = $(this).parent().parent().find('.fader').data('id');
          const thisFader = $(this).parent().parent().find('.fader');

          if( !$(this).hasClass('muted') ) {
            tracksGroup.sounds[id].volume = 0;
            $(this).addClass('muted');
          } else {
            setVolume( id, thisFader );
            $(this).removeClass('muted');
          };
      });



    // solo


      // const $solo = $('.solo');

      const $solo = $('.solo');


      $solo.on('click', function() {

        const self = this;
        const $self = $(this);
        let notSoloed = true;

          $solo.each( function() {

            const id = $(this).parent().parent().find('.fader').data('id');
            const thisFader = $(this).parent().parent().find('.fader');

            if( self === this ) {
              if( !$self.hasClass('soloed') ) {
                tracksSoloed[id] = true;
                setVolume( id, thisFader );
                $self.addClass('soloed');
              } else {
                tracksGroup.sounds[id].volume = 0;
                $self.removeClass('soloed');
                tracksSoloed[id] = false;
              };
            } else {
              if( !$(this).hasClass('soloed') ) {
                tracksGroup.sounds[id].volume = 0;
              }
            };;

            if( $(this).hasClass('soloed') ) {
              notSoloed = false;
            };

          });

          if( notSoloed ) {
            $solo.each(function() {
              const id = $(this).parent().parent().find('.fader').data('id');
              const thisFader = $(this).parent().parent().find('.fader');

              setVolume(id, thisFader);

            });
          };
      });





  // transport window


  // buttons

  const $playBtn = $('#play');
  const $pauseBtn = $('#pause');
  const $stopBtn = $('#stop');
  const $rwBtn = $('#rw');
  const $ffBtn = $('#ff');
  const $rwrwBtn = $('#rwrw');
  const $ffffBtn = $('#ffff');
  const $load = $('#load');
  const $container = $('.container');



  // checking if tracks are loaded

  const loadingInterval = setInterval( () => {

      console.log('Check');


      if( tracksArr.length === counter ) { // tracks loaded

        // play

        $playBtn.on('click', function() {
          tracksGroup.play();

        });

        // pause

        $pauseBtn.on('click', function() {
          tracksGroup.pause();
        });

        // stop

        $stopBtn.on('click', function() {
          tracksGroup.stop();
        });

        // rewind 10sec

        $rwBtn.on('click', function() {
          tracksGroup.pause();
          tracksGroup.sounds.forEach( t => {
            t.offsetTime = t.offsetTime - 10
            if( t.offsetTime < 0 ) {
              t.offsetTime = 0
            };
          });
          tracksGroup.play();
        });

        // fast forward 10sec

        $ffBtn.on('click', function() {
          tracksGroup.pause();
          tracksGroup.sounds.forEach( t => {
            t.offsetTime = t.offsetTime + 10
            if( t.offsetTime > 350 ) {
              t.offsetTime = 350
            };
          });
          tracksGroup.play();
        });

        // rewind 30sec

        $rwrwBtn.on('click', function() {
          tracksGroup.pause();
          tracksGroup.sounds.forEach( t => {
            t.offsetTime = t.offsetTime - 30
            if( t.offsetTime < 0 ) {
              t.offsetTime = 0
            };
          });
          tracksGroup.play();
        });

        // fast forward 30sec

        $ffffBtn.on('click', function() {
          tracksGroup.pause();
          tracksGroup.sounds.forEach( t => {
            t.offsetTime = t.offsetTime + 40
            if( t.offsetTime > 350 ) {
              t.offsetTime = 350
            };
          });
          tracksGroup.play();
        });

        // Loading box

        $container.removeClass('overlay');
        $load.removeClass('loading');
        $load.text('')
        clearInterval(loadingInterval);

      } else {

        $container.addClass('overlay');
        $load.addClass('loading');
        $load.text('Loading...');

      };
  }, 500); // loading check frequency




  // masterfader



  const $masterFader = $('.master');


  function setMasterVolumeStart() {
      trackGroup.volume = 0.6999;
  };

  setMasterVolume();


  function setMasterVolume() {
      tracksGroup.volume = ( parseInt($masterFader.css('top')) - 315 ) / -350;
  };


  $masterFader.on('mousemove', function(e) {

      e.preventDefault();


      if( e.buttons === 1 ) {
        $masterFader.css('top', e.pageY - 310);
        if( parseInt($masterFader.css('top')) >= 315 ) {
          $masterFader.css('top', '315px');
        } else if( parseInt($masterFader.css('top')) < -35 ) {
          $masterFader.css('top', '-35px');
        };
     };

     setMasterVolume();

  });

    // double click on masterfader
  $masterFader.on('dblclick', function() {

      $masterFader.css('top', '70px');
      setMasterVolume();

  });




  // stereo pan feautures


  tracksGroup.sounds.forEach( (t, i) => {
    window['stereoPanner' + i] = new Pizzicato.Effects.StereoPanner({
       pan: 0
     });

    t.addEffect(window['stereoPanner' + i]);
  });


  function setPan(index, thisKnob, deg) {
    // tracksGroup.sounds[index].effects[0].options.pan = ( parseInt(thisKnob.css('transform')) ;
    if ( deg > 0 ) {
      tracksGroup.sounds[index].effects[0].pan = (deg / 100) -0.4 ;
    } else if ( deg < 0 ) {
      tracksGroup.sounds[index].effects[0].pan = (deg / 100) +0.4 ;
    } else {
      tracksGroup.sounds[index].effects[0].pan = 0;
    };
  };



  const panKnobs = document.querySelectorAll('.panKnob');

  panKnobs.forEach( (t,i) => {

    let dragging = false

    $(function () {
        const target = $('.panKnob').eq(i);
        target.mousedown(function() {
            dragging = true
        })
        $(document).mouseup(function() {
            dragging = false
        })
        $(document).mousemove(function(e) {
            if (dragging) {

                var mouse_y = e.pageY;
                var degree = mouse_y - 140
                if( degree > 140 ) {
                  degree = 140;
                };
                target.css('-moz-transform', 'rotate(' + degree + 'deg)');
                target.css('-moz-transform-origin', '50% 50%');
                target.css('-webkit-transform', 'rotate(' + degree + 'deg)');
                target.css('-webkit-transform-origin', '50% 50%');
                target.css('-o-transform', 'rotate(' + degree + 'deg)');
                target.css('-o-transform-origin', '50% 50%');
                target.css('-ms-transform', 'rotate(' + degree + 'deg)');
                target.css('-ms-transform-origin', '50% 50%');

                setPan(i, target, degree);

            };
        });
        target.on('dblclick', function() {

            target.css('-moz-transform', 'rotate(' + 0 + 'deg)');
            target.css('-moz-transform-origin', '50% 50%');
            target.css('-webkit-transform', 'rotate(' + 0 + 'deg)');
            target.css('-webkit-transform-origin', '50% 50%');
            target.css('-o-transform', 'rotate(' + 0 + 'deg)');
            target.css('-o-transform-origin', '50% 50%');
            target.css('-ms-transform', 'rotate(' + 0 + 'deg)');
            target.css('-ms-transform-origin', '50% 50%');

            setPan(i, target, 0);

        });
    });
  });








});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZmRjY2FmOGYwNzkyNzA1ZGVkYzMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxHQUFHLEVBQUU7Ozs7O0FBS0w7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7OztBQUlBOztBQUVBOztBQUVBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLEtBQUs7Ozs7O0FBS0w7OztBQUdBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7O0FBSVA7OztBQUdBOztBQUVBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGFBQWE7QUFDYjtBQUNBLE9BQU87Ozs7OztBQU1QOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTs7QUFFQTs7O0FBR0EsMENBQTBDOztBQUUxQzs7QUFFQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxPQUFPOzs7OztBQUtWOzs7O0FBSUE7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7Ozs7O0FBS0g7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1QsS0FBSztBQUNMLEdBQUc7Ozs7Ozs7OztBQVNILENBQUMiLCJmaWxlIjoiLi9qcy9vdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmZGNjYWY4ZjA3OTI3MDVkZWRjMyIsIiQoZnVuY3Rpb24oKXsgLy9ET01Db250ZW50TG9hZGVkXG5cblxuXG4vLyBsb2FkaW5nIHRyYWNrcyBmcm9tIGFycmF5XG5cbiAgbGV0IHRyYWNrc0dyb3VwID0gbmV3IFBpenppY2F0by5Hcm91cCgpO1xuICBsZXQgY291bnRlciA9IDA7XG4gIGNvbnN0IHRyYWNrc0FyciA9IFsnLi8uLi9hdWRpby9CUC9EUlVNUy53YXYnLCAnLi8uLi9hdWRpby9CUC9CQVNTLndhdicsICcuLy4uL2F1ZGlvL0JQL0dUUi53YXYnLCAnLi8uLi9hdWRpby9CUC9WT0Mud2F2J107XG4gIGNvbnN0IHRyYWNrc05hbWVzID0gWydEUlVNUycsICdCQVNTJywgJ0dUUicsICdWT0MnIF07XG4gIGNvbnN0IHRyYWNrc1NvbG9lZCA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSBdO1xuXG5cblxuXG5cbiAgdHJhY2tzQXJyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgY29uc3QgdHJhY2sgPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcblxuICAgICAgICBzb3VyY2U6ICdmaWxlJyxcbiAgICAgICAgb3B0aW9uczogeyBwYXRoOiB0IH1cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnIGF1ZGlvIGZpbGUgbG9hZGVkIScpO1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICB9KTtcblxuICAgICAgdHJhY2tzR3JvdXAuYWRkU291bmQodHJhY2spO1xuXG4gICAgICAvLyBjcmVhdGluZyBjaGFubmVsIHN0cmlwc1xuXG4gICAgICBsZXQgbmV3U3RyaXAgPSAkKCc8ZGl2IGNsYXNzPVwic3RyaXBcIj48ZGl2IGNsYXNzPVwiZWZmZWN0Qm94XCI+PC9kaXY+PGRpdiBjbGFzcz1cInBhbkJveFwiPjxkaXYgY2xhc3M9XCJwYW5Lbm9iXCI+PGRpdiBjbGFzcz1cImtub2JNYXJrXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImJ1dHRvbkJveFwiPjxidXR0b24gY2xhc3M9XCJzb2xvXCI+UzwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJtdXRlXCI+TTwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XCJ0cmFja2JveFwiPjxkaXYgY2xhc3M9XCJ0cmFja1wiPjxkaXYgZGF0YS1pZD0nK2krJyBjbGFzcz1cImZhZGVyJytpKycgZmFkZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48cCBjbGFzcz1cImxhYmVsXCI+Jyt0cmFja3NOYW1lc1tpXSsnPC9wPjwvZGl2PicpO1xuICAgICAgJCgnLm1hc3RlclN0cmlwJykuYmVmb3JlKG5ld1N0cmlwKTtcblxuICAgICAgdHJhY2sudm9sdW1lID0gMC42OTk5O1xuXG5cbiAgfSk7IC8vIGVuZCBvZiBmb3JFYWNoXG5cblxuXG5cbiAgLy8gdm9sdW1lIGZ1bmN0aW9uYWxpdGllc1xuXG5cblxuICAgIGNvbnN0ICRmYWRlciA9ICQoJy5mYWRlcicpO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tJZk5vdFNvbG9lZCgpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRyYWNrc1NvbG9lZC5maWx0ZXIoIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFyci5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlO1xuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIHNldFZvbHVtZShpbmRleCwgdGhpc0ZhZGVyKSB7XG4gICAgICBpZiggdHJhY2tzU29sb2VkW2luZGV4XSB8fCBjaGVja0lmTm90U29sb2VkKCkgKSB7XG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0udm9sdW1lID0gKCBwYXJzZUludCh0aGlzRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gICAgICB9O1xuICAgIH07XG5cblxuICAgICRmYWRlci5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCAkbXV0ZSA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkucHJldigpLmZpbmQoJy5tdXRlJyk7XG4gICAgICAgIGNvbnN0ICRzb2xvID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wcmV2KCkuZmluZCgnLnNvbG8nKTtcblxuXG5cbiAgICAgICAgaWYgKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcblxuICAgICAgICAgICAgbnVsbDtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiggZS5idXR0b25zID09PSAxICkge1xuICAgICAgICAgICAgICAkKHRoaXMpLmNzcygndG9wJywgZS5wYWdlWSAtIDMxMCk7XG4gICAgICAgICAgICAgIGlmKCBwYXJzZUludCgkKHRoaXMpLmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNldFZvbHVtZSggJCh0aGlzKS5kYXRhKCdpZCcpLCAkKHRoaXMpICk7XG4gICAgICAgICAgIH07XG4gICAgICAgfTtcblxuICAgIH0pO1xuXG5cbiAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICRmYWRlci5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgICBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQodGhpcykuY3NzKCd0b3AnLCAnNzBweCcpO1xuICAgICAgICAgIHNldFZvbHVtZSggJCh0aGlzKS5kYXRhKCdpZCcpLCAkKHRoaXMpICk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuXG5cblxuICAvLyBzb2xvICYgbXV0ZVxuXG5cbiAgICAvLyBtdXRlXG5cblxuICAgICAgY29uc3QgJG11dGUgPSAkKCcubXV0ZScpO1xuXG4gICAgICAkbXV0ZS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdtdXRlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgfTtcbiAgICAgIH0pO1xuXG5cblxuICAgIC8vIHNvbG9cblxuXG4gICAgICAvLyBjb25zdCAkc29sbyA9ICQoJy5zb2xvJyk7XG5cbiAgICAgIGNvbnN0ICRzb2xvID0gJCgnLnNvbG8nKTtcblxuXG4gICAgICAkc29sby5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgbm90U29sb2VkID0gdHJ1ZTtcblxuICAgICAgICAgICRzb2xvLmVhY2goIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgIGlmKCBzZWxmID09PSB0aGlzICkge1xuICAgICAgICAgICAgICBpZiggISRzZWxmLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnc29sb2VkJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gZmFsc2U7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTs7XG5cbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgbm90U29sb2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiggbm90U29sb2VkICkge1xuICAgICAgICAgICAgJHNvbG8uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKGlkLCB0aGlzRmFkZXIpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG5cblxuICAvLyB0cmFuc3BvcnQgd2luZG93XG5cblxuICAvLyBidXR0b25zXG5cbiAgY29uc3QgJHBsYXlCdG4gPSAkKCcjcGxheScpO1xuICBjb25zdCAkcGF1c2VCdG4gPSAkKCcjcGF1c2UnKTtcbiAgY29uc3QgJHN0b3BCdG4gPSAkKCcjc3RvcCcpO1xuICBjb25zdCAkcndCdG4gPSAkKCcjcncnKTtcbiAgY29uc3QgJGZmQnRuID0gJCgnI2ZmJyk7XG4gIGNvbnN0ICRyd3J3QnRuID0gJCgnI3J3cncnKTtcbiAgY29uc3QgJGZmZmZCdG4gPSAkKCcjZmZmZicpO1xuICBjb25zdCAkbG9hZCA9ICQoJyNsb2FkJyk7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcuY29udGFpbmVyJyk7XG5cblxuXG4gIC8vIGNoZWNraW5nIGlmIHRyYWNrcyBhcmUgbG9hZGVkXG5cbiAgY29uc3QgbG9hZGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoICgpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coJ0NoZWNrJyk7XG5cblxuICAgICAgaWYoIHRyYWNrc0Fyci5sZW5ndGggPT09IGNvdW50ZXIgKSB7IC8vIHRyYWNrcyBsb2FkZWRcblxuICAgICAgICAvLyBwbGF5XG5cbiAgICAgICAgJHBsYXlCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHBhdXNlXG5cbiAgICAgICAgJHBhdXNlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3BcblxuICAgICAgICAkc3RvcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5zdG9wKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJld2luZCAxMHNlY1xuXG4gICAgICAgICRyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAxMHNlY1xuXG4gICAgICAgICRmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMzBzZWNcblxuICAgICAgICAkcndyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDMwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAzMHNlY1xuXG4gICAgICAgICRmZmZmQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lICsgNDBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPiAzNTAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDM1MFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExvYWRpbmcgYm94XG5cbiAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCcnKVxuICAgICAgICBjbGVhckludGVydmFsKGxvYWRpbmdJbnRlcnZhbCk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCdMb2FkaW5nLi4uJyk7XG5cbiAgICAgIH07XG4gIH0sIDUwMCk7IC8vIGxvYWRpbmcgY2hlY2sgZnJlcXVlbmN5XG5cblxuXG5cbiAgLy8gbWFzdGVyZmFkZXJcblxuXG5cbiAgY29uc3QgJG1hc3RlckZhZGVyID0gJCgnLm1hc3RlcicpO1xuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lU3RhcnQoKSB7XG4gICAgICB0cmFja0dyb3VwLnZvbHVtZSA9IDAuNjk5OTtcbiAgfTtcblxuICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuXG4gIGZ1bmN0aW9uIHNldE1hc3RlclZvbHVtZSgpIHtcbiAgICAgIHRyYWNrc0dyb3VwLnZvbHVtZSA9ICggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpIC0gMzE1ICkgLyAtMzUwO1xuICB9O1xuXG5cbiAgJG1hc3RlckZhZGVyLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXG4gICAgICBpZiggZS5idXR0b25zID09PSAxICkge1xuICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCBlLnBhZ2VZIC0gMzEwKTtcbiAgICAgICAgaWYoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSA+PSAzMTUgKSB7XG4gICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpIDwgLTM1ICkge1xuICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICctMzVweCcpO1xuICAgICAgICB9O1xuICAgICB9O1xuXG4gICAgIHNldE1hc3RlclZvbHVtZSgpO1xuXG4gIH0pO1xuXG4gICAgLy8gZG91YmxlIGNsaWNrIG9uIG1hc3RlcmZhZGVyXG4gICRtYXN0ZXJGYWRlci5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgIHNldE1hc3RlclZvbHVtZSgpO1xuXG4gIH0pO1xuXG5cblxuXG4gIC8vIHN0ZXJlbyBwYW4gZmVhdXR1cmVzXG5cblxuICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggKHQsIGkpID0+IHtcbiAgICB3aW5kb3dbJ3N0ZXJlb1Bhbm5lcicgKyBpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5TdGVyZW9QYW5uZXIoe1xuICAgICAgIHBhbjogMFxuICAgICB9KTtcblxuICAgIHQuYWRkRWZmZWN0KHdpbmRvd1snc3RlcmVvUGFubmVyJyArIGldKTtcbiAgfSk7XG5cblxuICBmdW5jdGlvbiBzZXRQYW4oaW5kZXgsIHRoaXNLbm9iLCBkZWcpIHtcbiAgICAvLyB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ub3B0aW9ucy5wYW4gPSAoIHBhcnNlSW50KHRoaXNLbm9iLmNzcygndHJhbnNmb3JtJykpIDtcbiAgICBpZiAoIGRlZyA+IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gKGRlZyAvIDEwMCkgLTAuNCA7XG4gICAgfSBlbHNlIGlmICggZGVnIDwgMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAoZGVnIC8gMTAwKSArMC40IDtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IDA7XG4gICAgfTtcbiAgfTtcblxuXG5cbiAgY29uc3QgcGFuS25vYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuS25vYicpO1xuXG4gIHBhbktub2JzLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gJCgnLnBhbktub2InKS5lcShpKTtcbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW91c2VfeSA9IGUucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGRlZ3JlZSA9IG1vdXNlX3kgLSAxNDBcbiAgICAgICAgICAgICAgICBpZiggZGVncmVlID4gMTQwICkge1xuICAgICAgICAgICAgICAgICAgZGVncmVlID0gMTQwO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyBkZWdyZWUgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyBkZWdyZWUgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZGVncmVlICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZGVncmVlICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG5cbiAgICAgICAgICAgICAgICBzZXRQYW4oaSwgdGFyZ2V0LCBkZWdyZWUpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdGFyZ2V0Lm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcblxuICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgMCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cblxuXG5cblxuXG5cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==