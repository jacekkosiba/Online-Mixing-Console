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



    const $fader = document.querySelectorAll('.fader');



    // checkIfNotSoloed function


    function checkIfNotSoloed() {
      const arr = tracksSoloed.filter( function(i) {
        return i === true
      });
      return arr.length > 0 ? false : true;
    };




    // setVolume function


    function setVolume(index, thisFader) {

      const $mute = thisFader.parent().parent().prev().find('.mute');

      if( $mute.hasClass('muted') ) {
        null;
      } else if( tracksSoloed[index] || checkIfNotSoloed() ) {
        tracksGroup.sounds[index].volume = ( parseInt(thisFader.css('top')) - 315 ) / -350;
      };
    };




    // fader movement


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
              target.css('top', '70px');
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
            $(this).removeClass('muted');
            setVolume( id, thisFader );
          };
      });



    // solo


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



  // masterFader movement


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


  // adding new stereoPanner effect to each track

  tracksGroup.sounds.forEach( (t, i) => {
    window['stereoPanner' + i] = new Pizzicato.Effects.StereoPanner({
       pan: 0
     });

    t.addEffect(window['stereoPanner' + i]);
  });



  // function setPan


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




  // panKnobs movement


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
                target.css('-moz-transform', 'rotate(' + (- degree) + 'deg)');
                target.css('-moz-transform-origin', '50% 50%');
                target.css('-webkit-transform', 'rotate(' + (- degree) + 'deg)');
                target.css('-webkit-transform-origin', '50% 50%');
                target.css('-o-transform', 'rotate(' + (- degree) + 'deg)');
                target.css('-o-transform-origin', '50% 50%');
                target.css('-ms-transform', 'rotate(' + (- degree) + 'deg)');
                target.css('-ms-transform-origin', '50% 50%');

                setPan(i, target, (- degree));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2U2M2MyMTQxZDJmODMyNzA1OGUiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsR0FBRyxFQUFFOzs7OztBQUtMOzs7O0FBSUE7Ozs7QUFJQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOzs7OztBQUtBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7OztBQU1MOzs7QUFHQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7OztBQUlQOzs7QUFHQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQSxPQUFPOzs7Ozs7QUFNUDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7OztBQUdBLDBDQUEwQzs7QUFFMUM7O0FBRUE7QUFDQTs7QUFFQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUcsT0FBTzs7Ozs7QUFLVjs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVULEtBQUs7QUFDTDs7QUFFQTs7Ozs7OztBQU9BOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7OztBQUlIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsR0FBRzs7Ozs7Ozs7O0FBU0gsQ0FBQyIsImZpbGUiOiIuL2pzL291dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNlNjNjMjE0MWQyZjgzMjcwNThlIiwiJChmdW5jdGlvbigpeyAvL0RPTUNvbnRlbnRMb2FkZWRcblxuXG5cbi8vIGxvYWRpbmcgdHJhY2tzIGZyb20gYXJyYXlcblxuXG4gIGxldCB0cmFja3NHcm91cCA9IG5ldyBQaXp6aWNhdG8uR3JvdXAoKTtcbiAgbGV0IGNvdW50ZXIgPSAwO1xuICBjb25zdCB0cmFja3NBcnIgPSBbJy4vLi4vYXVkaW8vQlAvRFJVTVMud2F2JywgJy4vLi4vYXVkaW8vQlAvQkFTUy53YXYnLCAnLi8uLi9hdWRpby9CUC9HVFIud2F2JywgJy4vLi4vYXVkaW8vQlAvVk9DLndhdiddO1xuICBjb25zdCB0cmFja3NOYW1lcyA9IFsnRFJVTVMnLCAnQkFTUycsICdHVFInLCAnVk9DJyBdO1xuICBjb25zdCB0cmFja3NTb2xvZWQgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgXTtcblxuXG5cblxuXG4gIHRyYWNrc0Fyci5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG5cbiAgICAgICAgc291cmNlOiAnZmlsZScsXG4gICAgICAgIG9wdGlvbnM6IHsgcGF0aDogdCB9XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJyBhdWRpbyBmaWxlIGxvYWRlZCEnKTtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfSk7XG5cbiAgICAgIHRyYWNrc0dyb3VwLmFkZFNvdW5kKHRyYWNrKTtcblxuICAgICAgLy8gY3JlYXRpbmcgY2hhbm5lbCBzdHJpcHNcblxuICAgICAgbGV0IG5ld1N0cmlwID0gJCgnPGRpdiBjbGFzcz1cInN0cmlwXCI+PGRpdiBjbGFzcz1cImVmZmVjdEJveFwiPjwvZGl2PjxkaXYgY2xhc3M9XCJwYW5Cb3hcIj48ZGl2IGNsYXNzPVwicGFuS25vYlwiPjxkaXYgY2xhc3M9XCJrbm9iTWFya1wiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJidXR0b25Cb3hcIj48YnV0dG9uIGNsYXNzPVwic29sb1wiPlM8L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwibXV0ZVwiPk08L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVwidHJhY2tib3hcIj48ZGl2IGNsYXNzPVwidHJhY2tcIj48ZGl2IGRhdGEtaWQ9JytpKycgY2xhc3M9XCJmYWRlcicraSsnIGZhZGVyXCI+PC9kaXY+PC9kaXY+PC9kaXY+PHAgY2xhc3M9XCJsYWJlbFwiPicrdHJhY2tzTmFtZXNbaV0rJzwvcD48L2Rpdj4nKTtcbiAgICAgICQoJy5tYXN0ZXJTdHJpcCcpLmJlZm9yZShuZXdTdHJpcCk7XG5cbiAgICAgIHRyYWNrLnZvbHVtZSA9IDAuNjk5OTtcblxuXG4gIH0pOyAvLyBlbmQgb2YgZm9yRWFjaFxuXG5cblxuXG4gIC8vIHZvbHVtZSBmdW5jdGlvbmFsaXRpZXNcblxuXG5cbiAgICBjb25zdCAkZmFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmFkZXInKTtcblxuXG5cbiAgICAvLyBjaGVja0lmTm90U29sb2VkIGZ1bmN0aW9uXG5cblxuICAgIGZ1bmN0aW9uIGNoZWNrSWZOb3RTb2xvZWQoKSB7XG4gICAgICBjb25zdCBhcnIgPSB0cmFja3NTb2xvZWQuZmlsdGVyKCBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBpID09PSB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhcnIubGVuZ3RoID4gMCA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9O1xuXG5cblxuXG4gICAgLy8gc2V0Vm9sdW1lIGZ1bmN0aW9uXG5cblxuICAgIGZ1bmN0aW9uIHNldFZvbHVtZShpbmRleCwgdGhpc0ZhZGVyKSB7XG5cbiAgICAgIGNvbnN0ICRtdXRlID0gdGhpc0ZhZGVyLnBhcmVudCgpLnBhcmVudCgpLnByZXYoKS5maW5kKCcubXV0ZScpO1xuXG4gICAgICBpZiggJG11dGUuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgIG51bGw7XG4gICAgICB9IGVsc2UgaWYoIHRyYWNrc1NvbG9lZFtpbmRleF0gfHwgY2hlY2tJZk5vdFNvbG9lZCgpICkge1xuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLnZvbHVtZSA9ICggcGFyc2VJbnQodGhpc0ZhZGVyLmNzcygndG9wJykpIC0gMzE1ICkgLyAtMzUwO1xuICAgICAgfTtcbiAgICB9O1xuXG5cblxuXG4gICAgLy8gZmFkZXIgbW92ZW1lbnRcblxuXG4gICAgJGZhZGVyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gJCgnLmZhZGVyJykuZXEoaSk7XG4gICAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCBlLnBhZ2VZIC0gMzEwKTtcbiAgICAgICAgICAgICAgICBpZiggcGFyc2VJbnQodGFyZ2V0LmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICczMTVweCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQodGFyZ2V0LmNzcygndG9wJykpIDwgLTM1ICkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIHRhcmdldC5kYXRhKCdpZCcpLCB0YXJnZXQgKTtcblxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIC8vIGRvdWJsZSBjbGljayBvbiBmYWRlclxuXG4gICAgICAgICAgdGFyZ2V0Lm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICc3MHB4Jyk7XG4gICAgICAgICAgICAgIHNldFZvbHVtZSggdGFyZ2V0LmRhdGEoJ2lkJyksIHRhcmdldCApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG5cblxuICAvLyBzb2xvICYgbXV0ZVxuXG5cbiAgICAvLyBtdXRlXG5cblxuICAgICAgY29uc3QgJG11dGUgPSAkKCcubXV0ZScpO1xuXG4gICAgICAkbXV0ZS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdtdXRlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdtdXRlZCcpO1xuICAgICAgICAgICAgc2V0Vm9sdW1lKCBpZCwgdGhpc0ZhZGVyICk7XG4gICAgICAgICAgfTtcbiAgICAgIH0pO1xuXG5cblxuICAgIC8vIHNvbG9cblxuXG4gICAgICBjb25zdCAkc29sbyA9ICQoJy5zb2xvJyk7XG5cblxuICAgICAgJHNvbG8ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0ICRzZWxmID0gJCh0aGlzKTtcbiAgICAgICAgbGV0IG5vdFNvbG9lZCA9IHRydWU7XG5cbiAgICAgICAgICAkc29sby5lYWNoKCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICBjb25zdCB0aGlzRmFkZXIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpO1xuXG4gICAgICAgICAgICBpZiggc2VsZiA9PT0gdGhpcyApIHtcbiAgICAgICAgICAgICAgaWYoICEkc2VsZi5oYXNDbGFzcygnc29sb2VkJykgKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzU29sb2VkW2lkXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0Vm9sdW1lKCBpZCwgdGhpc0ZhZGVyICk7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ3NvbG9lZCcpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnc29sb2VkJyk7XG4gICAgICAgICAgICAgICAgdHJhY2tzU29sb2VkW2lkXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYoICEkKHRoaXMpLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07O1xuXG4gICAgICAgICAgICBpZiggJCh0aGlzKS5oYXNDbGFzcygnc29sb2VkJykgKSB7XG4gICAgICAgICAgICAgIG5vdFNvbG9lZCA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYoIG5vdFNvbG9lZCApIHtcbiAgICAgICAgICAgICRzb2xvLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgICBjb25zdCB0aGlzRmFkZXIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpO1xuXG4gICAgICAgICAgICAgIHNldFZvbHVtZShpZCwgdGhpc0ZhZGVyKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgIH0pO1xuXG5cblxuXG5cbiAgLy8gdHJhbnNwb3J0IHdpbmRvd1xuXG5cbiAgLy8gYnV0dG9uc1xuXG4gIGNvbnN0ICRwbGF5QnRuID0gJCgnI3BsYXknKTtcbiAgY29uc3QgJHBhdXNlQnRuID0gJCgnI3BhdXNlJyk7XG4gIGNvbnN0ICRzdG9wQnRuID0gJCgnI3N0b3AnKTtcbiAgY29uc3QgJHJ3QnRuID0gJCgnI3J3Jyk7XG4gIGNvbnN0ICRmZkJ0biA9ICQoJyNmZicpO1xuICBjb25zdCAkcndyd0J0biA9ICQoJyNyd3J3Jyk7XG4gIGNvbnN0ICRmZmZmQnRuID0gJCgnI2ZmZmYnKTtcbiAgY29uc3QgJGxvYWQgPSAkKCcjbG9hZCcpO1xuICBjb25zdCAkY29udGFpbmVyID0gJCgnLmNvbnRhaW5lcicpO1xuXG5cblxuICAvLyBjaGVja2luZyBpZiB0cmFja3MgYXJlIGxvYWRlZFxuXG4gIGNvbnN0IGxvYWRpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKCAoKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdDaGVjaycpO1xuXG5cbiAgICAgIGlmKCB0cmFja3NBcnIubGVuZ3RoID09PSBjb3VudGVyICkgeyAvLyB0cmFja3MgbG9hZGVkXG5cbiAgICAgICAgLy8gcGxheVxuXG4gICAgICAgICRwbGF5QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwYXVzZVxuXG4gICAgICAgICRwYXVzZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9wXG5cbiAgICAgICAgJHN0b3BCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc3RvcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMTBzZWNcblxuICAgICAgICAkcndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMTBzZWNcblxuICAgICAgICAkZmZCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgKyAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA+IDM1MCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMzUwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV3aW5kIDMwc2VjXG5cbiAgICAgICAgJHJ3cndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAzMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMzBzZWNcblxuICAgICAgICAkZmZmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDQwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMb2FkaW5nIGJveFxuXG4gICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgJGxvYWQucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgJGxvYWQudGV4dCgnJylcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsb2FkaW5nSW50ZXJ2YWwpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgJGxvYWQuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgJGxvYWQudGV4dCgnTG9hZGluZy4uLicpO1xuXG4gICAgICB9O1xuICB9LCA1MDApOyAvLyBsb2FkaW5nIGNoZWNrIGZyZXF1ZW5jeVxuXG5cblxuXG4gIC8vIG1hc3RlcmZhZGVyXG5cblxuXG4gIGNvbnN0ICRtYXN0ZXJGYWRlciA9ICQoJy5tYXN0ZXInKTtcblxuXG4gIGZ1bmN0aW9uIHNldE1hc3RlclZvbHVtZVN0YXJ0KCkge1xuICAgICAgdHJhY2tHcm91cC52b2x1bWUgPSAwLjY5OTk7XG4gIH07XG4gIHNldE1hc3RlclZvbHVtZSgpO1xuXG5cblxuXG4gIGZ1bmN0aW9uIHNldE1hc3RlclZvbHVtZSgpIHtcbiAgICAgIHRyYWNrc0dyb3VwLnZvbHVtZSA9ICggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpIC0gMzE1ICkgLyAtMzUwO1xuICB9O1xuXG5cblxuICAvLyBtYXN0ZXJGYWRlciBtb3ZlbWVudFxuXG5cbiAgZnVuY3Rpb24gTWFzdGVyRmFkZXJNb3ZlKCkge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkbWFzdGVyRmFkZXIubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgZS5wYWdlWSAtIDMxMCk7XG4gICAgICAgICAgICAgIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICczMTVweCcpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAkbWFzdGVyRmFkZXIub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgICAgICBzZXRNYXN0ZXJWb2x1bWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfTtcblxuICBNYXN0ZXJGYWRlck1vdmUoKTtcblxuXG5cblxuXG5cbiAgLy8gc3RlcmVvIHBhbiBmZWF1dHVyZXNcblxuXG4gIC8vIGFkZGluZyBuZXcgc3RlcmVvUGFubmVyIGVmZmVjdCB0byBlYWNoIHRyYWNrXG5cbiAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goICh0LCBpKSA9PiB7XG4gICAgd2luZG93WydzdGVyZW9QYW5uZXInICsgaV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuU3RlcmVvUGFubmVyKHtcbiAgICAgICBwYW46IDBcbiAgICAgfSk7XG5cbiAgICB0LmFkZEVmZmVjdCh3aW5kb3dbJ3N0ZXJlb1Bhbm5lcicgKyBpXSk7XG4gIH0pO1xuXG5cblxuICAvLyBmdW5jdGlvbiBzZXRQYW5cblxuXG4gIGZ1bmN0aW9uIHNldFBhbihpbmRleCwgdGhpc0tub2IsIGRlZykge1xuICAgIC8vIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5vcHRpb25zLnBhbiA9ICggcGFyc2VJbnQodGhpc0tub2IuY3NzKCd0cmFuc2Zvcm0nKSkgO1xuICAgIGlmICggZGVnID4gMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAoZGVnIC8gMTAwKSAtMC40IDtcbiAgICB9IGVsc2UgaWYgKCBkZWcgPCAwICkge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IChkZWcgLyAxMDApICswLjQgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gMDtcbiAgICB9O1xuICB9O1xuXG5cblxuXG4gIC8vIHBhbktub2JzIG1vdmVtZW50XG5cblxuICBjb25zdCBwYW5Lbm9icyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5Lbm9iJyk7XG5cbiAgcGFuS25vYnMuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcucGFuS25vYicpLmVxKGkpO1xuICAgICAgICB0YXJnZXQubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgICAgIHZhciBtb3VzZV95ID0gZS5wYWdlWTtcbiAgICAgICAgICAgICAgICB2YXIgZGVncmVlID0gbW91c2VfeSAtIDE0MFxuICAgICAgICAgICAgICAgIGlmKCBkZWdyZWUgPiAxNDAgKSB7XG4gICAgICAgICAgICAgICAgICBkZWdyZWUgPSAxNDA7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG5cbiAgICAgICAgICAgICAgICBzZXRQYW4oaSwgdGFyZ2V0LCAoLSBkZWdyZWUpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRhcmdldC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG5cbiAgICAgICAgICAgIHNldFBhbihpLCB0YXJnZXQsIDApO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuXG5cblxuXG5cblxuXG59KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vanMvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=