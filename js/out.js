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



    // const $fader = $('.fader');
    const $fader = document.querySelectorAll('.fader');

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


    // $fader.on('mousemove', function(e) {
    //
    //     e.preventDefault();
    //
    //     const $mute = $(this).parent().parent().prev().find('.mute');
    //     const $solo = $(this).parent().parent().prev().find('.solo');
    //
    //
    //
    //     if ( $mute.hasClass('muted') ) {
    //
    //         null;
    //
    //     } else {
    //
    //         if( e.buttons === 1 ) {
    //           $(this).css('top', e.pageY - 310);
    //           if( parseInt($(this).css('top')) >= 315 ) {
    //             $(this).css('top', '315px');
    //           } else if( parseInt($(this).css('top')) < -35 ) {
    //             $(this).css('top', '-35px');
    //           };
    //           setVolume( $(this).data('id'), $(this) );
    //        };
    //    };
    //
    // });



    $fader.forEach( (t,i) => {

      let dragging = false

      $(function () {
          const target = $('.fader').eq(i);
          target.mousedown(function() {
              dragging = true
          })
          $(document).mouseup(function() {
              dragging = false
          })
          $(document).mousemove(function(e) {
              if (dragging) {

              target.css('top', e.pageY - 310);
                if( parseInt(target.css('top')) >= 315 ) {
                  target.css('top', '315px');
                } else if( parseInt(target.css('top')) < -35 ) {
                  target.css('top', '-35px');
                };
                setVolume( target.data('id'), target );

              };
          });

              // double click on fader

          target.on('dblclick', function() {
            if ( $mute.hasClass('muted') ) {
              null;
            } else {
              target.css('top', '70px');
              setVolume( target.data('id'), target );
            };
          });

      });
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


  function MasterFaderMove() {

    let dragging = false

    $(function () {
        $masterFader.mousedown(function() {
            dragging = true
        })
        $(document).mouseup(function() {
            dragging = false
        })
        $(document).mousemove(function(e) {
            if (dragging) {

            $masterFader.css('top', e.pageY - 310);
              if( parseInt($masterFader.css('top')) >= 315 ) {
                $masterFader.css('top', '315px');
              } else if( parseInt($masterFader.css('top')) < -35 ) {
                $masterFader.css('top', '-35px');
              };
              setMasterVolume();

            };
        });

            // double click on fader

        $masterFader.on('dblclick', function() {
          $masterFader.css('top', '70px');
          setMasterVolume();
        });

    });
  };

  MasterFaderMove();




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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTk2NjFjYWI0Y2UwZWZmY2VhYmQiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxHQUFHLEVBQUU7Ozs7O0FBS0w7Ozs7QUFJQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7Ozs7QUFJUjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7O0FBS0w7OztBQUdBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7O0FBSVA7OztBQUdBOztBQUVBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGFBQWE7QUFDYjtBQUNBLE9BQU87Ozs7OztBQU1QOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTs7QUFFQTs7O0FBR0EsMENBQTBDOztBQUUxQzs7QUFFQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxPQUFPOzs7OztBQUtWOzs7O0FBSUE7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQsS0FBSztBQUNMOztBQUVBOzs7OztBQUtBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNULEtBQUs7QUFDTCxHQUFHOzs7Ozs7Ozs7QUFTSCxDQUFDIiwiZmlsZSI6Ii4vanMvb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTk2NjFjYWI0Y2UwZWZmY2VhYmQiLCIkKGZ1bmN0aW9uKCl7IC8vRE9NQ29udGVudExvYWRlZFxuXG5cblxuLy8gbG9hZGluZyB0cmFja3MgZnJvbSBhcnJheVxuXG4gIGxldCB0cmFja3NHcm91cCA9IG5ldyBQaXp6aWNhdG8uR3JvdXAoKTtcbiAgbGV0IGNvdW50ZXIgPSAwO1xuICBjb25zdCB0cmFja3NBcnIgPSBbJy4vLi4vYXVkaW8vQlAvRFJVTVMud2F2JywgJy4vLi4vYXVkaW8vQlAvQkFTUy53YXYnLCAnLi8uLi9hdWRpby9CUC9HVFIud2F2JywgJy4vLi4vYXVkaW8vQlAvVk9DLndhdiddO1xuICBjb25zdCB0cmFja3NOYW1lcyA9IFsnRFJVTVMnLCAnQkFTUycsICdHVFInLCAnVk9DJyBdO1xuICBjb25zdCB0cmFja3NTb2xvZWQgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgXTtcblxuXG5cblxuXG4gIHRyYWNrc0Fyci5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG5cbiAgICAgICAgc291cmNlOiAnZmlsZScsXG4gICAgICAgIG9wdGlvbnM6IHsgcGF0aDogdCB9XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJyBhdWRpbyBmaWxlIGxvYWRlZCEnKTtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfSk7XG5cbiAgICAgIHRyYWNrc0dyb3VwLmFkZFNvdW5kKHRyYWNrKTtcblxuICAgICAgLy8gY3JlYXRpbmcgY2hhbm5lbCBzdHJpcHNcblxuICAgICAgbGV0IG5ld1N0cmlwID0gJCgnPGRpdiBjbGFzcz1cInN0cmlwXCI+PGRpdiBjbGFzcz1cImVmZmVjdEJveFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJwYW5Cb3hcIj48ZGl2IGNsYXNzPVwicGFuS25vYlwiPjxkaXYgY2xhc3M9XCJrbm9iTWFya1wiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJidXR0b25Cb3hcIj48YnV0dG9uIGNsYXNzPVwic29sb1wiPlM8L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwibXV0ZVwiPk08L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVwidHJhY2tib3hcIj48ZGl2IGNsYXNzPVwidHJhY2tcIj48ZGl2IGRhdGEtaWQ9JytpKycgY2xhc3M9XCJmYWRlcicraSsnIGZhZGVyXCI+PC9kaXY+PC9kaXY+PC9kaXY+PHAgY2xhc3M9XCJsYWJlbFwiPicrdHJhY2tzTmFtZXNbaV0rJzwvcD48L2Rpdj4nKTtcbiAgICAgICQoJy5tYXN0ZXJTdHJpcCcpLmJlZm9yZShuZXdTdHJpcCk7XG5cbiAgICAgIHRyYWNrLnZvbHVtZSA9IDAuNjk5OTtcblxuXG4gIH0pOyAvLyBlbmQgb2YgZm9yRWFjaFxuXG5cblxuXG4gIC8vIHZvbHVtZSBmdW5jdGlvbmFsaXRpZXNcblxuXG5cbiAgICAvLyBjb25zdCAkZmFkZXIgPSAkKCcuZmFkZXInKTtcbiAgICBjb25zdCAkZmFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmFkZXInKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrSWZOb3RTb2xvZWQoKSB7XG4gICAgICBjb25zdCBhcnIgPSB0cmFja3NTb2xvZWQuZmlsdGVyKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBpID09PSB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhcnIubGVuZ3RoID4gMCA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBzZXRWb2x1bWUoaW5kZXgsIHRoaXNGYWRlcikge1xuICAgICAgaWYoIHRyYWNrc1NvbG9lZFtpbmRleF0gfHwgY2hlY2tJZk5vdFNvbG9lZCgpICkge1xuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLnZvbHVtZSA9ICggcGFyc2VJbnQodGhpc0ZhZGVyLmNzcygndG9wJykpIC0gMzE1ICkgLyAtMzUwO1xuICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICAvLyAkZmFkZXIub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAvL1xuICAgIC8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy9cbiAgICAvLyAgICAgY29uc3QgJG11dGUgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnByZXYoKS5maW5kKCcubXV0ZScpO1xuICAgIC8vICAgICBjb25zdCAkc29sbyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkucHJldigpLmZpbmQoJy5zb2xvJyk7XG4gICAgLy9cbiAgICAvL1xuICAgIC8vXG4gICAgLy8gICAgIGlmICggJG11dGUuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgLy9cbiAgICAvLyAgICAgICAgIG51bGw7XG4gICAgLy9cbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvL1xuICAgIC8vICAgICAgICAgaWYoIGUuYnV0dG9ucyA9PT0gMSApIHtcbiAgICAvLyAgICAgICAgICAgJCh0aGlzKS5jc3MoJ3RvcCcsIGUucGFnZVkgLSAzMTApO1xuICAgIC8vICAgICAgICAgICBpZiggcGFyc2VJbnQoJCh0aGlzKS5jc3MoJ3RvcCcpKSA+PSAzMTUgKSB7XG4gICAgLy8gICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ3RvcCcsICczMTVweCcpO1xuICAgIC8vICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KCQodGhpcykuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgLy8gICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ3RvcCcsICctMzVweCcpO1xuICAgIC8vICAgICAgICAgICB9O1xuICAgIC8vICAgICAgICAgICBzZXRWb2x1bWUoICQodGhpcykuZGF0YSgnaWQnKSwgJCh0aGlzKSApO1xuICAgIC8vICAgICAgICB9O1xuICAgIC8vICAgIH07XG4gICAgLy9cbiAgICAvLyB9KTtcblxuXG5cbiAgICAkZmFkZXIuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcuZmFkZXInKS5lcShpKTtcbiAgICAgICAgICB0YXJnZXQubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuXG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsIGUucGFnZVkgLSAzMTApO1xuICAgICAgICAgICAgICAgIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNldFZvbHVtZSggdGFyZ2V0LmRhdGEoJ2lkJyksIHRhcmdldCApO1xuXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoICRtdXRlLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgICBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKCB0YXJnZXQuZGF0YSgnaWQnKSwgdGFyZ2V0ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9KTtcblxuXG5cblxuICAvLyBzb2xvICYgbXV0ZVxuXG5cbiAgICAvLyBtdXRlXG5cblxuICAgICAgY29uc3QgJG11dGUgPSAkKCcubXV0ZScpO1xuXG4gICAgICAkbXV0ZS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdtdXRlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgfTtcbiAgICAgIH0pO1xuXG5cblxuICAgIC8vIHNvbG9cblxuXG4gICAgICAvLyBjb25zdCAkc29sbyA9ICQoJy5zb2xvJyk7XG5cbiAgICAgIGNvbnN0ICRzb2xvID0gJCgnLnNvbG8nKTtcblxuXG4gICAgICAkc29sby5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgbm90U29sb2VkID0gdHJ1ZTtcblxuICAgICAgICAgICRzb2xvLmVhY2goIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgIGlmKCBzZWxmID09PSB0aGlzICkge1xuICAgICAgICAgICAgICBpZiggISRzZWxmLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnc29sb2VkJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gZmFsc2U7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTs7XG5cbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgbm90U29sb2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiggbm90U29sb2VkICkge1xuICAgICAgICAgICAgJHNvbG8uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKGlkLCB0aGlzRmFkZXIpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG5cblxuICAvLyB0cmFuc3BvcnQgd2luZG93XG5cblxuICAvLyBidXR0b25zXG5cbiAgY29uc3QgJHBsYXlCdG4gPSAkKCcjcGxheScpO1xuICBjb25zdCAkcGF1c2VCdG4gPSAkKCcjcGF1c2UnKTtcbiAgY29uc3QgJHN0b3BCdG4gPSAkKCcjc3RvcCcpO1xuICBjb25zdCAkcndCdG4gPSAkKCcjcncnKTtcbiAgY29uc3QgJGZmQnRuID0gJCgnI2ZmJyk7XG4gIGNvbnN0ICRyd3J3QnRuID0gJCgnI3J3cncnKTtcbiAgY29uc3QgJGZmZmZCdG4gPSAkKCcjZmZmZicpO1xuICBjb25zdCAkbG9hZCA9ICQoJyNsb2FkJyk7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcuY29udGFpbmVyJyk7XG5cblxuXG4gIC8vIGNoZWNraW5nIGlmIHRyYWNrcyBhcmUgbG9hZGVkXG5cbiAgY29uc3QgbG9hZGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoICgpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coJ0NoZWNrJyk7XG5cblxuICAgICAgaWYoIHRyYWNrc0Fyci5sZW5ndGggPT09IGNvdW50ZXIgKSB7IC8vIHRyYWNrcyBsb2FkZWRcblxuICAgICAgICAvLyBwbGF5XG5cbiAgICAgICAgJHBsYXlCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHBhdXNlXG5cbiAgICAgICAgJHBhdXNlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3BcblxuICAgICAgICAkc3RvcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5zdG9wKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJld2luZCAxMHNlY1xuXG4gICAgICAgICRyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAxMHNlY1xuXG4gICAgICAgICRmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMzBzZWNcblxuICAgICAgICAkcndyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDMwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAzMHNlY1xuXG4gICAgICAgICRmZmZmQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lICsgNDBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPiAzNTAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDM1MFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExvYWRpbmcgYm94XG5cbiAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCcnKVxuICAgICAgICBjbGVhckludGVydmFsKGxvYWRpbmdJbnRlcnZhbCk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCdMb2FkaW5nLi4uJyk7XG5cbiAgICAgIH07XG4gIH0sIDUwMCk7IC8vIGxvYWRpbmcgY2hlY2sgZnJlcXVlbmN5XG5cblxuXG5cbiAgLy8gbWFzdGVyZmFkZXJcblxuXG5cbiAgY29uc3QgJG1hc3RlckZhZGVyID0gJCgnLm1hc3RlcicpO1xuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lU3RhcnQoKSB7XG4gICAgICB0cmFja0dyb3VwLnZvbHVtZSA9IDAuNjk5OTtcbiAgfTtcblxuICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuXG4gIGZ1bmN0aW9uIHNldE1hc3RlclZvbHVtZSgpIHtcbiAgICAgIHRyYWNrc0dyb3VwLnZvbHVtZSA9ICggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpIC0gMzE1ICkgLyAtMzUwO1xuICB9O1xuXG5cbiAgZnVuY3Rpb24gTWFzdGVyRmFkZXJNb3ZlKCkge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkbWFzdGVyRmFkZXIubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgZS5wYWdlWSAtIDMxMCk7XG4gICAgICAgICAgICAgIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICczMTVweCcpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAkbWFzdGVyRmFkZXIub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgICAgICBzZXRNYXN0ZXJWb2x1bWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfTtcblxuICBNYXN0ZXJGYWRlck1vdmUoKTtcblxuXG5cblxuICAvLyBzdGVyZW8gcGFuIGZlYXV0dXJlc1xuXG5cbiAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goICh0LCBpKSA9PiB7XG4gICAgd2luZG93WydzdGVyZW9QYW5uZXInICsgaV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuU3RlcmVvUGFubmVyKHtcbiAgICAgICBwYW46IDBcbiAgICAgfSk7XG5cbiAgICB0LmFkZEVmZmVjdCh3aW5kb3dbJ3N0ZXJlb1Bhbm5lcicgKyBpXSk7XG4gIH0pO1xuXG5cbiAgZnVuY3Rpb24gc2V0UGFuKGluZGV4LCB0aGlzS25vYiwgZGVnKSB7XG4gICAgLy8gdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLm9wdGlvbnMucGFuID0gKCBwYXJzZUludCh0aGlzS25vYi5jc3MoJ3RyYW5zZm9ybScpKSA7XG4gICAgaWYgKCBkZWcgPiAwICkge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IChkZWcgLyAxMDApIC0wLjQgO1xuICAgIH0gZWxzZSBpZiAoIGRlZyA8IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gKGRlZyAvIDEwMCkgKzAuNCA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAwO1xuICAgIH07XG4gIH07XG5cblxuXG4gIGNvbnN0IHBhbktub2JzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbktub2InKTtcblxuICBwYW5Lbm9icy5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5wYW5Lbm9iJykuZXEoaSk7XG4gICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlX3kgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBkZWdyZWUgPSBtb3VzZV95IC0gMTQwXG4gICAgICAgICAgICAgICAgaWYoIGRlZ3JlZSA+IDE0MCApIHtcbiAgICAgICAgICAgICAgICAgIGRlZ3JlZSA9IDE0MDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZGVncmVlICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZGVncmVlICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIGRlZ3JlZSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIGRlZ3JlZSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgZGVncmVlKTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRhcmdldC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG5cbiAgICAgICAgICAgIHNldFBhbihpLCB0YXJnZXQsIDApO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuXG5cblxuXG5cblxuXG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=