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

      let newStrip = $('<div class="strip"><div class="effectBox"><button class="reverb effectBtn">REVERB</button></div><div class="panBox"><div class="panKnob"><div class="knobMark"></div></div></div><div class="buttonBox"><button class="solo">S</button><button class="mute">M</button></div><div class="trackbox"><div class="track"><div data-id='+i+' class="fader'+i+' fader"></div></div></div><p class="label">'+tracksNames[i]+'</p></div>');
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





  // effects



  // reverb


  const $reverb = $('.reverb');


  $reverb.on('click', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        console.log('reverb ON!');
        $(e.target).addClass('effectOn');

        window['reverb' + id] = new Pizzicato.Effects.Reverb({
           time: 1.5,
           decay: 3,
           mix: 0.6
         });

        tracksGroup.sounds[id].addEffect(window['reverb' + id]);

      } else {

        console.log('reverb OFF!');
        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['reverb' + id]);

      };



  });









});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjVmODdkMTFiZTI2NDk5OWZhM2QiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsR0FBRyxFQUFFOzs7OztBQUtMOzs7O0FBSUE7Ozs7QUFJQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOzs7OztBQUtBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7OztBQU1MOzs7QUFHQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7OztBQUlQOzs7QUFHQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQSxPQUFPOzs7Ozs7QUFNUDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7OztBQUdBLDBDQUEwQzs7QUFFMUM7O0FBRUE7QUFDQTs7QUFFQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUcsT0FBTzs7Ozs7QUFLVjs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVULEtBQUs7QUFDTDs7QUFFQTs7Ozs7OztBQU9BOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7OztBQUlIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsR0FBRzs7Ozs7O0FBTUg7Ozs7QUFJQTs7O0FBR0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWOztBQUVBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTs7QUFFQTs7OztBQUlBLEdBQUc7Ozs7Ozs7Ozs7QUFVSCxDQUFDIiwiZmlsZSI6Ii4vanMvb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjVmODdkMTFiZTI2NDk5OWZhM2QiLCIkKGZ1bmN0aW9uKCl7IC8vRE9NQ29udGVudExvYWRlZFxuXG5cblxuLy8gbG9hZGluZyB0cmFja3MgZnJvbSBhcnJheVxuXG5cbiAgbGV0IHRyYWNrc0dyb3VwID0gbmV3IFBpenppY2F0by5Hcm91cCgpO1xuICBsZXQgY291bnRlciA9IDA7XG4gIGNvbnN0IHRyYWNrc0FyciA9IFsnLi8uLi9hdWRpby9CUC9EUlVNUy53YXYnLCAnLi8uLi9hdWRpby9CUC9CQVNTLndhdicsICcuLy4uL2F1ZGlvL0JQL0dUUi53YXYnLCAnLi8uLi9hdWRpby9CUC9WT0Mud2F2J107XG4gIGNvbnN0IHRyYWNrc05hbWVzID0gWydEUlVNUycsICdCQVNTJywgJ0dUUicsICdWT0MnIF07XG4gIGNvbnN0IHRyYWNrc1NvbG9lZCA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSBdO1xuXG5cblxuXG5cbiAgdHJhY2tzQXJyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgY29uc3QgdHJhY2sgPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcblxuICAgICAgICBzb3VyY2U6ICdmaWxlJyxcbiAgICAgICAgb3B0aW9uczogeyBwYXRoOiB0IH1cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnIGF1ZGlvIGZpbGUgbG9hZGVkIScpO1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICB9KTtcblxuICAgICAgdHJhY2tzR3JvdXAuYWRkU291bmQodHJhY2spO1xuXG4gICAgICAvLyBjcmVhdGluZyBjaGFubmVsIHN0cmlwc1xuXG4gICAgICBsZXQgbmV3U3RyaXAgPSAkKCc8ZGl2IGNsYXNzPVwic3RyaXBcIj48ZGl2IGNsYXNzPVwiZWZmZWN0Qm94XCI+PGJ1dHRvbiBjbGFzcz1cInJldmVyYiBlZmZlY3RCdG5cIj5SRVZFUkI8L2J1dHRvbj48L2Rpdj48ZGl2IGNsYXNzPVwicGFuQm94XCI+PGRpdiBjbGFzcz1cInBhbktub2JcIj48ZGl2IGNsYXNzPVwia25vYk1hcmtcIj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiYnV0dG9uQm94XCI+PGJ1dHRvbiBjbGFzcz1cInNvbG9cIj5TPC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cIm11dGVcIj5NPC9idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cInRyYWNrYm94XCI+PGRpdiBjbGFzcz1cInRyYWNrXCI+PGRpdiBkYXRhLWlkPScraSsnIGNsYXNzPVwiZmFkZXInK2krJyBmYWRlclwiPjwvZGl2PjwvZGl2PjwvZGl2PjxwIGNsYXNzPVwibGFiZWxcIj4nK3RyYWNrc05hbWVzW2ldKyc8L3A+PC9kaXY+Jyk7XG4gICAgICAkKCcubWFzdGVyU3RyaXAnKS5iZWZvcmUobmV3U3RyaXApO1xuXG4gICAgICB0cmFjay52b2x1bWUgPSAwLjY5OTk7XG5cblxuICB9KTsgLy8gZW5kIG9mIGZvckVhY2hcblxuXG5cblxuICAvLyB2b2x1bWUgZnVuY3Rpb25hbGl0aWVzXG5cblxuXG4gICAgY29uc3QgJGZhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZhZGVyJyk7XG5cblxuXG4gICAgLy8gY2hlY2tJZk5vdFNvbG9lZCBmdW5jdGlvblxuXG5cbiAgICBmdW5jdGlvbiBjaGVja0lmTm90U29sb2VkKCkge1xuICAgICAgY29uc3QgYXJyID0gdHJhY2tzU29sb2VkLmZpbHRlciggZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gaSA9PT0gdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYXJyLmxlbmd0aCA+IDAgPyBmYWxzZSA6IHRydWU7XG4gICAgfTtcblxuXG5cblxuICAgIC8vIHNldFZvbHVtZSBmdW5jdGlvblxuXG5cbiAgICBmdW5jdGlvbiBzZXRWb2x1bWUoaW5kZXgsIHRoaXNGYWRlcikge1xuXG4gICAgICBjb25zdCAkbXV0ZSA9IHRoaXNGYWRlci5wYXJlbnQoKS5wYXJlbnQoKS5wcmV2KCkuZmluZCgnLm11dGUnKTtcblxuICAgICAgaWYoICRtdXRlLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICBudWxsO1xuICAgICAgfSBlbHNlIGlmKCB0cmFja3NTb2xvZWRbaW5kZXhdIHx8IGNoZWNrSWZOb3RTb2xvZWQoKSApIHtcbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS52b2x1bWUgPSAoIHBhcnNlSW50KHRoaXNGYWRlci5jc3MoJ3RvcCcpKSAtIDMxNSApIC8gLTM1MDtcbiAgICAgIH07XG4gICAgfTtcblxuXG5cblxuICAgIC8vIGZhZGVyIG1vdmVtZW50XG5cblxuICAgICRmYWRlci5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAgICQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5mYWRlcicpLmVxKGkpO1xuICAgICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgZS5wYWdlWSAtIDMxMCk7XG4gICAgICAgICAgICAgICAgaWYoIHBhcnNlSW50KHRhcmdldC5jc3MoJ3RvcCcpKSA+PSAzMTUgKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KHRhcmdldC5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICctMzVweCcpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2V0Vm9sdW1lKCB0YXJnZXQuZGF0YSgnaWQnKSwgdGFyZ2V0ICk7XG5cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAgIHRhcmdldC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggJG11dGUuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICc3MHB4Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnNzBweCcpO1xuICAgICAgICAgICAgICBzZXRWb2x1bWUoIHRhcmdldC5kYXRhKCdpZCcpLCB0YXJnZXQgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxuXG5cbiAgLy8gc29sbyAmIG11dGVcblxuXG4gICAgLy8gbXV0ZVxuXG5cbiAgICAgIGNvbnN0ICRtdXRlID0gJCgnLm11dGUnKTtcblxuICAgICAgJG11dGUub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICBjb25zdCB0aGlzRmFkZXIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpO1xuXG4gICAgICAgICAgaWYoICEkKHRoaXMpLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cbiAgICAvLyBzb2xvXG5cblxuICAgICAgY29uc3QgJHNvbG8gPSAkKCcuc29sbycpO1xuXG5cbiAgICAgICRzb2xvLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQodGhpcyk7XG4gICAgICAgIGxldCBub3RTb2xvZWQgPSB0cnVlO1xuXG4gICAgICAgICAgJHNvbG8uZWFjaCggZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgaWYoIHNlbGYgPT09IHRoaXMgKSB7XG4gICAgICAgICAgICAgIGlmKCAhJHNlbGYuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ3NvbG9lZCcpO1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmKCAhJCh0aGlzKS5oYXNDbGFzcygnc29sb2VkJykgKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9OztcblxuICAgICAgICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICBub3RTb2xvZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmKCBub3RTb2xvZWQgKSB7XG4gICAgICAgICAgICAkc29sby5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgICBzZXRWb2x1bWUoaWQsIHRoaXNGYWRlcik7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cblxuXG4gIC8vIHRyYW5zcG9ydCB3aW5kb3dcblxuXG4gIC8vIGJ1dHRvbnNcblxuICBjb25zdCAkcGxheUJ0biA9ICQoJyNwbGF5Jyk7XG4gIGNvbnN0ICRwYXVzZUJ0biA9ICQoJyNwYXVzZScpO1xuICBjb25zdCAkc3RvcEJ0biA9ICQoJyNzdG9wJyk7XG4gIGNvbnN0ICRyd0J0biA9ICQoJyNydycpO1xuICBjb25zdCAkZmZCdG4gPSAkKCcjZmYnKTtcbiAgY29uc3QgJHJ3cndCdG4gPSAkKCcjcndydycpO1xuICBjb25zdCAkZmZmZkJ0biA9ICQoJyNmZmZmJyk7XG4gIGNvbnN0ICRsb2FkID0gJCgnI2xvYWQnKTtcbiAgY29uc3QgJGNvbnRhaW5lciA9ICQoJy5jb250YWluZXInKTtcblxuXG5cbiAgLy8gY2hlY2tpbmcgaWYgdHJhY2tzIGFyZSBsb2FkZWRcblxuICBjb25zdCBsb2FkaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCggKCkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZygnQ2hlY2snKTtcblxuXG4gICAgICBpZiggdHJhY2tzQXJyLmxlbmd0aCA9PT0gY291bnRlciApIHsgLy8gdHJhY2tzIGxvYWRlZFxuXG4gICAgICAgIC8vIHBsYXlcblxuICAgICAgICAkcGxheUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcGF1c2VcblxuICAgICAgICAkcGF1c2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcFxuXG4gICAgICAgICRzdG9wQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnN0b3AoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV3aW5kIDEwc2VjXG5cbiAgICAgICAgJHJ3QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lIC0gMTBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPCAwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZmFzdCBmb3J3YXJkIDEwc2VjXG5cbiAgICAgICAgJGZmQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lICsgMTBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPiAzNTAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDM1MFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJld2luZCAzMHNlY1xuXG4gICAgICAgICRyd3J3QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lIC0gMzBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPCAwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZmFzdCBmb3J3YXJkIDMwc2VjXG5cbiAgICAgICAgJGZmZmZCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgKyA0MFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA+IDM1MCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMzUwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9hZGluZyBib3hcblxuICAgICAgICAkY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgICRsb2FkLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICRsb2FkLnRleHQoJycpXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobG9hZGluZ0ludGVydmFsKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgICRsb2FkLmFkZENsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICRsb2FkLnRleHQoJ0xvYWRpbmcuLi4nKTtcblxuICAgICAgfTtcbiAgfSwgNTAwKTsgLy8gbG9hZGluZyBjaGVjayBmcmVxdWVuY3lcblxuXG5cblxuICAvLyBtYXN0ZXJmYWRlclxuXG5cblxuICBjb25zdCAkbWFzdGVyRmFkZXIgPSAkKCcubWFzdGVyJyk7XG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWVTdGFydCgpIHtcbiAgICAgIHRyYWNrR3JvdXAudm9sdW1lID0gMC42OTk5O1xuICB9O1xuICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuXG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWUoKSB7XG4gICAgICB0cmFja3NHcm91cC52b2x1bWUgPSAoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSAtIDMxNSApIC8gLTM1MDtcbiAgfTtcblxuXG5cbiAgLy8gbWFzdGVyRmFkZXIgbW92ZW1lbnRcblxuXG4gIGZ1bmN0aW9uIE1hc3RlckZhZGVyTW92ZSgpIHtcblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJG1hc3RlckZhZGVyLm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsIGUucGFnZVkgLSAzMTApO1xuICAgICAgICAgICAgICBpZiggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNldE1hc3RlclZvbHVtZSgpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgJG1hc3RlckZhZGVyLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICc3MHB4Jyk7XG4gICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH07XG5cbiAgTWFzdGVyRmFkZXJNb3ZlKCk7XG5cblxuXG5cblxuXG4gIC8vIHN0ZXJlbyBwYW4gZmVhdXR1cmVzXG5cblxuICAvLyBhZGRpbmcgbmV3IHN0ZXJlb1Bhbm5lciBlZmZlY3QgdG8gZWFjaCB0cmFja1xuXG4gIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCAodCwgaSkgPT4ge1xuICAgIHdpbmRvd1snc3RlcmVvUGFubmVyJyArIGldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlN0ZXJlb1Bhbm5lcih7XG4gICAgICAgcGFuOiAwXG4gICAgIH0pO1xuXG4gICAgdC5hZGRFZmZlY3Qod2luZG93WydzdGVyZW9QYW5uZXInICsgaV0pO1xuICB9KTtcblxuXG5cbiAgLy8gZnVuY3Rpb24gc2V0UGFuXG5cblxuICBmdW5jdGlvbiBzZXRQYW4oaW5kZXgsIHRoaXNLbm9iLCBkZWcpIHtcbiAgICAvLyB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ub3B0aW9ucy5wYW4gPSAoIHBhcnNlSW50KHRoaXNLbm9iLmNzcygndHJhbnNmb3JtJykpIDtcbiAgICBpZiAoIGRlZyA+IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gKGRlZyAvIDEwMCkgLTAuNCA7XG4gICAgfSBlbHNlIGlmICggZGVnIDwgMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAoZGVnIC8gMTAwKSArMC40IDtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IDA7XG4gICAgfTtcbiAgfTtcblxuXG5cblxuICAvLyBwYW5Lbm9icyBtb3ZlbWVudFxuXG5cbiAgY29uc3QgcGFuS25vYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuS25vYicpO1xuXG4gIHBhbktub2JzLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gJCgnLnBhbktub2InKS5lcShpKTtcbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW91c2VfeSA9IGUucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGRlZ3JlZSA9IG1vdXNlX3kgLSAxNDBcbiAgICAgICAgICAgICAgICBpZiggZGVncmVlID4gMTQwICkge1xuICAgICAgICAgICAgICAgICAgZGVncmVlID0gMTQwO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgKC0gZGVncmVlKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICBzZXRQYW4oaSwgdGFyZ2V0LCAwKTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cblxuXG5cblxuICAvLyBlZmZlY3RzXG5cblxuXG4gIC8vIHJldmVyYlxuXG5cbiAgY29uc3QgJHJldmVyYiA9ICQoJy5yZXZlcmInKTtcblxuXG4gICRyZXZlcmIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3JldmVyYiBPTiEnKTtcbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93WydyZXZlcmInICsgaWRdID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlJldmVyYih7XG4gICAgICAgICAgIHRpbWU6IDEuNSxcbiAgICAgICAgICAgZGVjYXk6IDMsXG4gICAgICAgICAgIG1peDogMC42XG4gICAgICAgICB9KTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyBpZF0pO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXZlcmIgT0ZGIScpO1xuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyBpZF0pO1xuXG4gICAgICB9O1xuXG5cblxuICB9KTtcblxuXG5cblxuXG5cblxuXG5cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==