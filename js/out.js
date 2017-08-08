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





  // effects functionalities

  const $mixer = $('.mixer');


  // hpf
  $mixer.on('click', '.hpf', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');
      console.log( id );

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['hpf' + id] = new Pizzicato.Effects.HighPassFilter({
           frequency: 400,
           peak: 3,
         });

        tracksGroup.sounds[id].addEffect(window['hpf' + id]);

      }
      else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['hpf' + id]);

      };

  });

  // lpf
  $mixer.on('click', '.lpf', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['lpf' + id] = new Pizzicato.Effects.LowPassFilter({
           frequency: 4000,
           peak: 3,
         });

        tracksGroup.sounds[id].addEffect(window['lpf' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['lpf' + id]);

      };

  });

  // compressor
  $mixer.on('click', '.compressor', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['compressor' + id] = new Pizzicato.Effects.Compressor({
           treshold: -30,
           ratio: 12
         });

        tracksGroup.sounds[id].addEffect(window['compressor' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['compressor' + id]);

      };
  });

  // fuzz
  $mixer.on('click', '.fuzz', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['fuzz' + id] = new Pizzicato.Effects.Quadrafuzz({
           lowGain: 1.0,
           midLowGain: 0.6,
           midHighGain: 0.78,
           highGain: 0.9,
           mix: 1,
         });

        tracksGroup.sounds[id].addEffect(window['fuzz' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['fuzz' + id]);

      };
  });

  // distortion
  $mixer.on('click', '.distortion', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['distortion' + id] = new Pizzicato.Effects.Distortion({
           gain: 1.0,
         });

        tracksGroup.sounds[id].addEffect(window['distortion' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['distortion' + id]);

      };
  });

  // flanger
  $mixer.on('click', '.flanger', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['flanger' + id] = new Pizzicato.Effects.Flanger({
          time: 0,
          speed: 0.13,
          depth: 0.25,
          feedback: 0.8,
          mix: 0.25
         });

        tracksGroup.sounds[id].addEffect(window['flanger' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['flanger' + id]);

      };
  });

  // delay
  $mixer.on('click', '.delay', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['delay' + id] = new Pizzicato.Effects.Delay({
          feedback: 0.3,
          time: 0.25,
          mix: 0.25
         });

        tracksGroup.sounds[id].addEffect(window['delay' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['delay' + id]);

      };
  });

  // reverb
  $mixer.on('click', '.reverb', function(e) {

      const id = $(e.target).parent().parent().find('.fader').data('id');

      if( !$(e.target).hasClass('effectOn') ) {

        $(e.target).addClass('effectOn');

        window['reverb' + id] = new Pizzicato.Effects.Reverb({
           time: 1.8,
           decay: 3,
           mix: 0.7
         });

        tracksGroup.sounds[id].addEffect(window['reverb' + id]);

      } else {

        $(e.target).removeClass('effectOn');

        tracksGroup.sounds[id].removeEffect(window['reverb' + id]);

      };
  });





  // effects drag & drop


  const $chooseBtns = $('.chooseBtn');




  $chooseBtns.each( (i,t) => {


    let dragging = false


    $(function () {

        const target = $chooseBtns.eq(i);


        target.mousedown(function() {
            dragging = true
        });


        $('.strip').mouseup(function() {

            if ( dragging === true ) {
              $(this).find('.effectBox').append(
                '<button class="' + target.attr('data-passClass') + ' effectBtn">' + target.attr('data-name') + '</button>'
              );
            };

            dragging = false

        });
    });
  });









});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzVlYTI0MzM0Y2UxYzJmOTE2NjIiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCO0FBQ2xCLE9BQU87O0FBRVA7QUFDQTtBQUNBLE9BQU87O0FBRVA7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsR0FBRyxFQUFFOzs7OztBQUtMOzs7O0FBSUE7Ozs7QUFJQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOzs7OztBQUtBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7OztBQU1MOzs7QUFHQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7OztBQUlQOzs7QUFHQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQSxPQUFPOzs7Ozs7QUFNUDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7OztBQUdBLDBDQUEwQzs7QUFFMUM7O0FBRUE7QUFDQTs7QUFFQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUcsT0FBTzs7Ozs7QUFLVjs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVULEtBQUs7QUFDTDs7QUFFQTs7Ozs7OztBQU9BOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7OztBQUlIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsR0FBRzs7Ozs7O0FBTUg7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOztBQUVWOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjs7QUFFQSxPQUFPOztBQUVQOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTs7QUFFVjs7QUFFQSxPQUFPOztBQUVQOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7O0FBRVY7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBLEdBQUc7Ozs7OztBQU1IOzs7QUFHQTs7Ozs7QUFLQTs7O0FBR0E7OztBQUdBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0EsU0FBUzs7O0FBR1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1QsS0FBSztBQUNMLEdBQUc7Ozs7Ozs7Ozs7QUFVSCxDQUFDIiwiZmlsZSI6Ii4vanMvb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzVlYTI0MzM0Y2UxYzJmOTE2NjIiLCIkKGZ1bmN0aW9uKCl7IC8vRE9NQ29udGVudExvYWRlZFxuXG5cblxuLy8gbG9hZGluZyB0cmFja3MgZnJvbSBhcnJheVxuXG5cbiAgbGV0IHRyYWNrc0dyb3VwID0gbmV3IFBpenppY2F0by5Hcm91cCgpO1xuICBsZXQgY291bnRlciA9IDA7XG4gIGNvbnN0IHRyYWNrc0FyciA9IFsnLi8uLi9hdWRpby9CUC9EUlVNUy53YXYnLCAnLi8uLi9hdWRpby9CUC9CQVNTLndhdicsICcuLy4uL2F1ZGlvL0JQL0dUUi53YXYnLCAnLi8uLi9hdWRpby9CUC9WT0Mud2F2J107XG4gIGNvbnN0IHRyYWNrc05hbWVzID0gWydEUlVNUycsICdCQVNTJywgJ0dUUicsICdWT0MnIF07XG4gIGNvbnN0IHRyYWNrc1NvbG9lZCA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSBdO1xuXG5cblxuXG5cbiAgdHJhY2tzQXJyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgY29uc3QgdHJhY2sgPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcblxuICAgICAgICBzb3VyY2U6ICdmaWxlJyxcbiAgICAgICAgb3B0aW9uczogeyBwYXRoOiB0IH1cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnIGF1ZGlvIGZpbGUgbG9hZGVkIScpO1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICB9KTtcblxuICAgICAgdHJhY2tzR3JvdXAuYWRkU291bmQodHJhY2spO1xuXG4gICAgICAvLyBjcmVhdGluZyBjaGFubmVsIHN0cmlwc1xuXG4gICAgICBsZXQgbmV3U3RyaXAgPSAkKCc8ZGl2IGNsYXNzPVwic3RyaXBcIj48ZGl2IGNsYXNzPVwiZWZmZWN0Qm94XCI+PC9kaXY+PGRpdiBjbGFzcz1cInBhbkJveFwiPjxkaXYgY2xhc3M9XCJwYW5Lbm9iXCI+PGRpdiBjbGFzcz1cImtub2JNYXJrXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImJ1dHRvbkJveFwiPjxidXR0b24gY2xhc3M9XCJzb2xvXCI+UzwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJtdXRlXCI+TTwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XCJ0cmFja2JveFwiPjxkaXYgY2xhc3M9XCJ0cmFja1wiPjxkaXYgZGF0YS1pZD0nK2krJyBjbGFzcz1cImZhZGVyJytpKycgZmFkZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48cCBjbGFzcz1cImxhYmVsXCI+Jyt0cmFja3NOYW1lc1tpXSsnPC9wPjwvZGl2PicpO1xuICAgICAgJCgnLm1hc3RlclN0cmlwJykuYmVmb3JlKG5ld1N0cmlwKTtcblxuICAgICAgdHJhY2sudm9sdW1lID0gMC42OTk5O1xuXG5cbiAgfSk7IC8vIGVuZCBvZiBmb3JFYWNoXG5cblxuXG5cbiAgLy8gdm9sdW1lIGZ1bmN0aW9uYWxpdGllc1xuXG5cblxuICAgIGNvbnN0ICRmYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYWRlcicpO1xuXG5cblxuICAgIC8vIGNoZWNrSWZOb3RTb2xvZWQgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gY2hlY2tJZk5vdFNvbG9lZCgpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRyYWNrc1NvbG9lZC5maWx0ZXIoIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFyci5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlO1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBzZXRWb2x1bWUgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gc2V0Vm9sdW1lKGluZGV4LCB0aGlzRmFkZXIpIHtcblxuICAgICAgY29uc3QgJG11dGUgPSB0aGlzRmFkZXIucGFyZW50KCkucGFyZW50KCkucHJldigpLmZpbmQoJy5tdXRlJyk7XG5cbiAgICAgIGlmKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgbnVsbDtcbiAgICAgIH0gZWxzZSBpZiggdHJhY2tzU29sb2VkW2luZGV4XSB8fCBjaGVja0lmTm90U29sb2VkKCkgKSB7XG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0udm9sdW1lID0gKCBwYXJzZUludCh0aGlzRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gICAgICB9O1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBmYWRlciBtb3ZlbWVudFxuXG5cbiAgICAkZmFkZXIuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcuZmFkZXInKS5lcShpKTtcbiAgICAgICAgICB0YXJnZXQubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuXG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsIGUucGFnZVkgLSAzMTApO1xuICAgICAgICAgICAgICAgIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNldFZvbHVtZSggdGFyZ2V0LmRhdGEoJ2lkJyksIHRhcmdldCApO1xuXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoICRtdXRlLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnNzBweCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzcwcHgnKTtcbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKCB0YXJnZXQuZGF0YSgnaWQnKSwgdGFyZ2V0ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9KTtcblxuXG5cblxuXG4gIC8vIHNvbG8gJiBtdXRlXG5cblxuICAgIC8vIG11dGVcblxuXG4gICAgICBjb25zdCAkbXV0ZSA9ICQoJy5tdXRlJyk7XG5cbiAgICAgICRtdXRlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgIGlmKCAhJCh0aGlzKS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG4gICAgLy8gc29sb1xuXG5cbiAgICAgIGNvbnN0ICRzb2xvID0gJCgnLnNvbG8nKTtcblxuXG4gICAgICAkc29sby5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgbm90U29sb2VkID0gdHJ1ZTtcblxuICAgICAgICAgICRzb2xvLmVhY2goIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgIGlmKCBzZWxmID09PSB0aGlzICkge1xuICAgICAgICAgICAgICBpZiggISRzZWxmLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnc29sb2VkJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gZmFsc2U7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTs7XG5cbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgbm90U29sb2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiggbm90U29sb2VkICkge1xuICAgICAgICAgICAgJHNvbG8uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKGlkLCB0aGlzRmFkZXIpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG5cblxuICAvLyB0cmFuc3BvcnQgd2luZG93XG5cblxuICAvLyBidXR0b25zXG5cbiAgY29uc3QgJHBsYXlCdG4gPSAkKCcjcGxheScpO1xuICBjb25zdCAkcGF1c2VCdG4gPSAkKCcjcGF1c2UnKTtcbiAgY29uc3QgJHN0b3BCdG4gPSAkKCcjc3RvcCcpO1xuICBjb25zdCAkcndCdG4gPSAkKCcjcncnKTtcbiAgY29uc3QgJGZmQnRuID0gJCgnI2ZmJyk7XG4gIGNvbnN0ICRyd3J3QnRuID0gJCgnI3J3cncnKTtcbiAgY29uc3QgJGZmZmZCdG4gPSAkKCcjZmZmZicpO1xuICBjb25zdCAkbG9hZCA9ICQoJyNsb2FkJyk7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcuY29udGFpbmVyJyk7XG5cblxuXG4gIC8vIGNoZWNraW5nIGlmIHRyYWNrcyBhcmUgbG9hZGVkXG5cbiAgY29uc3QgbG9hZGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoICgpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coJ0NoZWNrJyk7XG5cblxuICAgICAgaWYoIHRyYWNrc0Fyci5sZW5ndGggPT09IGNvdW50ZXIgKSB7IC8vIHRyYWNrcyBsb2FkZWRcblxuICAgICAgICAvLyBwbGF5XG5cbiAgICAgICAgJHBsYXlCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHBhdXNlXG5cbiAgICAgICAgJHBhdXNlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHN0b3BcblxuICAgICAgICAkc3RvcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5zdG9wKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJld2luZCAxMHNlY1xuXG4gICAgICAgICRyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAxMHNlY1xuXG4gICAgICAgICRmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDEwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMzBzZWNcblxuICAgICAgICAkcndyd0J0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSAtIDMwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lIDwgMCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGZhc3QgZm9yd2FyZCAzMHNlY1xuXG4gICAgICAgICRmZmZmQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lICsgNDBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPiAzNTAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDM1MFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIExvYWRpbmcgYm94XG5cbiAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCcnKVxuICAgICAgICBjbGVhckludGVydmFsKGxvYWRpbmdJbnRlcnZhbCk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAkbG9hZC50ZXh0KCdMb2FkaW5nLi4uJyk7XG5cbiAgICAgIH07XG4gIH0sIDUwMCk7IC8vIGxvYWRpbmcgY2hlY2sgZnJlcXVlbmN5XG5cblxuXG5cbiAgLy8gbWFzdGVyZmFkZXJcblxuXG5cbiAgY29uc3QgJG1hc3RlckZhZGVyID0gJCgnLm1hc3RlcicpO1xuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lU3RhcnQoKSB7XG4gICAgICB0cmFja0dyb3VwLnZvbHVtZSA9IDAuNjk5OTtcbiAgfTtcbiAgc2V0TWFzdGVyVm9sdW1lKCk7XG5cblxuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lKCkge1xuICAgICAgdHJhY2tzR3JvdXAudm9sdW1lID0gKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gIH07XG5cblxuXG4gIC8vIG1hc3RlckZhZGVyIG1vdmVtZW50XG5cblxuICBmdW5jdGlvbiBNYXN0ZXJGYWRlck1vdmUoKSB7XG5cbiAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICRtYXN0ZXJGYWRlci5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuXG4gICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCBlLnBhZ2VZIC0gMzEwKTtcbiAgICAgICAgICAgICAgaWYoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSA+PSAzMTUgKSB7XG4gICAgICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpIDwgLTM1ICkge1xuICAgICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICctMzVweCcpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGRvdWJsZSBjbGljayBvbiBmYWRlclxuXG4gICAgICAgICRtYXN0ZXJGYWRlci5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnNzBweCcpO1xuICAgICAgICAgIHNldE1hc3RlclZvbHVtZSgpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuICB9O1xuXG4gIE1hc3RlckZhZGVyTW92ZSgpO1xuXG5cblxuXG5cblxuICAvLyBzdGVyZW8gcGFuIGZlYXV0dXJlc1xuXG5cbiAgLy8gYWRkaW5nIG5ldyBzdGVyZW9QYW5uZXIgZWZmZWN0IHRvIGVhY2ggdHJhY2tcblxuICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggKHQsIGkpID0+IHtcbiAgICB3aW5kb3dbJ3N0ZXJlb1Bhbm5lcicgKyBpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5TdGVyZW9QYW5uZXIoe1xuICAgICAgIHBhbjogMFxuICAgICB9KTtcblxuICAgIHQuYWRkRWZmZWN0KHdpbmRvd1snc3RlcmVvUGFubmVyJyArIGldKTtcbiAgfSk7XG5cblxuXG4gIC8vIGZ1bmN0aW9uIHNldFBhblxuXG5cbiAgZnVuY3Rpb24gc2V0UGFuKGluZGV4LCB0aGlzS25vYiwgZGVnKSB7XG4gICAgLy8gdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLm9wdGlvbnMucGFuID0gKCBwYXJzZUludCh0aGlzS25vYi5jc3MoJ3RyYW5zZm9ybScpKSA7XG4gICAgaWYgKCBkZWcgPiAwICkge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IChkZWcgLyAxMDApIC0wLjQgO1xuICAgIH0gZWxzZSBpZiAoIGRlZyA8IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gKGRlZyAvIDEwMCkgKzAuNCA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAwO1xuICAgIH07XG4gIH07XG5cblxuXG5cbiAgLy8gcGFuS25vYnMgbW92ZW1lbnRcblxuXG4gIGNvbnN0IHBhbktub2JzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbktub2InKTtcblxuICBwYW5Lbm9icy5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5wYW5Lbm9iJykuZXEoaSk7XG4gICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlX3kgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgICAgIHZhciBkZWdyZWUgPSBtb3VzZV95IC0gMTQwXG4gICAgICAgICAgICAgICAgaWYoIGRlZ3JlZSA+IDE0MCApIHtcbiAgICAgICAgICAgICAgICAgIGRlZ3JlZSA9IDE0MDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcblxuICAgICAgICAgICAgICAgIHNldFBhbihpLCB0YXJnZXQsICgtIGRlZ3JlZSkpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdGFyZ2V0Lm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcblxuICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgMCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cblxuXG5cbiAgLy8gZWZmZWN0cyBmdW5jdGlvbmFsaXRpZXNcblxuICBjb25zdCAkbWl4ZXIgPSAkKCcubWl4ZXInKTtcblxuXG4gIC8vIGhwZlxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5ocGYnLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKCBpZCApO1xuXG4gICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgIHdpbmRvd1snaHBmJyArIGlkXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5IaWdoUGFzc0ZpbHRlcih7XG4gICAgICAgICAgIGZyZXF1ZW5jeTogNDAwLFxuICAgICAgICAgICBwZWFrOiAzLFxuICAgICAgICAgfSk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydocGYnICsgaWRdKTtcblxuICAgICAgfVxuICAgICAgZWxzZSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydocGYnICsgaWRdKTtcblxuICAgICAgfTtcblxuICB9KTtcblxuICAvLyBscGZcbiAgJG1peGVyLm9uKCdjbGljaycsICcubHBmJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93WydscGYnICsgaWRdID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkxvd1Bhc3NGaWx0ZXIoe1xuICAgICAgICAgICBmcmVxdWVuY3k6IDQwMDAsXG4gICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICB9KTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2xwZicgKyBpZF0pO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snbHBmJyArIGlkXSk7XG5cbiAgICAgIH07XG5cbiAgfSk7XG5cbiAgLy8gY29tcHJlc3NvclxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5jb21wcmVzc29yJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93Wydjb21wcmVzc29yJyArIGlkXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Db21wcmVzc29yKHtcbiAgICAgICAgICAgdHJlc2hvbGQ6IC0zMCxcbiAgICAgICAgICAgcmF0aW86IDEyXG4gICAgICAgICB9KTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2NvbXByZXNzb3InICsgaWRdKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2NvbXByZXNzb3InICsgaWRdKTtcblxuICAgICAgfTtcbiAgfSk7XG5cbiAgLy8gZnV6elxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5mdXp6JywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93WydmdXp6JyArIGlkXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5RdWFkcmFmdXp6KHtcbiAgICAgICAgICAgbG93R2FpbjogMS4wLFxuICAgICAgICAgICBtaWRMb3dHYWluOiAwLjYsXG4gICAgICAgICAgIG1pZEhpZ2hHYWluOiAwLjc4LFxuICAgICAgICAgICBoaWdoR2FpbjogMC45LFxuICAgICAgICAgICBtaXg6IDEsXG4gICAgICAgICB9KTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2Z1enonICsgaWRdKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2Z1enonICsgaWRdKTtcblxuICAgICAgfTtcbiAgfSk7XG5cbiAgLy8gZGlzdG9ydGlvblxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5kaXN0b3J0aW9uJywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93WydkaXN0b3J0aW9uJyArIGlkXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5EaXN0b3J0aW9uKHtcbiAgICAgICAgICAgZ2FpbjogMS4wLFxuICAgICAgICAgfSk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArIGlkXSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArIGlkXSk7XG5cbiAgICAgIH07XG4gIH0pO1xuXG4gIC8vIGZsYW5nZXJcbiAgJG1peGVyLm9uKCdjbGljaycsICcuZmxhbmdlcicsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgIHdpbmRvd1snZmxhbmdlcicgKyBpZF0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRmxhbmdlcih7XG4gICAgICAgICAgdGltZTogMCxcbiAgICAgICAgICBzcGVlZDogMC4xMyxcbiAgICAgICAgICBkZXB0aDogMC4yNSxcbiAgICAgICAgICBmZWVkYmFjazogMC44LFxuICAgICAgICAgIG1peDogMC4yNVxuICAgICAgICAgfSk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArIGlkXSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArIGlkXSk7XG5cbiAgICAgIH07XG4gIH0pO1xuXG4gIC8vIGRlbGF5XG4gICRtaXhlci5vbignY2xpY2snLCAnLmRlbGF5JywgZnVuY3Rpb24oZSkge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgd2luZG93WydkZWxheScgKyBpZF0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRGVsYXkoe1xuICAgICAgICAgIGZlZWRiYWNrOiAwLjMsXG4gICAgICAgICAgdGltZTogMC4yNSxcbiAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgIH0pO1xuXG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snZGVsYXknICsgaWRdKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2RlbGF5JyArIGlkXSk7XG5cbiAgICAgIH07XG4gIH0pO1xuXG4gIC8vIHJldmVyYlxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5yZXZlcmInLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICB3aW5kb3dbJ3JldmVyYicgKyBpZF0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUmV2ZXJiKHtcbiAgICAgICAgICAgdGltZTogMS44LFxuICAgICAgICAgICBkZWNheTogMyxcbiAgICAgICAgICAgbWl4OiAwLjdcbiAgICAgICAgIH0pO1xuXG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArIGlkXSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydyZXZlcmInICsgaWRdKTtcblxuICAgICAgfTtcbiAgfSk7XG5cblxuXG5cblxuICAvLyBlZmZlY3RzIGRyYWcgJiBkcm9wXG5cblxuICBjb25zdCAkY2hvb3NlQnRucyA9ICQoJy5jaG9vc2VCdG4nKTtcblxuXG5cblxuICAkY2hvb3NlQnRucy5lYWNoKCAoaSx0KSA9PiB7XG5cblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cblxuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICRjaG9vc2VCdG5zLmVxKGkpO1xuXG5cbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KTtcblxuXG4gICAgICAgICQoJy5zdHJpcCcpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICggZHJhZ2dpbmcgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICQodGhpcykuZmluZCgnLmVmZmVjdEJveCcpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAnPGJ1dHRvbiBjbGFzcz1cIicgKyB0YXJnZXQuYXR0cignZGF0YS1wYXNzQ2xhc3MnKSArICcgZWZmZWN0QnRuXCI+JyArIHRhcmdldC5hdHRyKCdkYXRhLW5hbWUnKSArICc8L2J1dHRvbj4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cblxuXG5cblxuXG5cblxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9