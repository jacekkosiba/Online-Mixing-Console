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
  const tracksArr = ['./../audio/BP/DRUMS.wav', './../audio/BP/BASS.wav'];
  const tracksNames = ['DRUMS', 'BASS'];
  const tracksSoloed = [false, false];







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

      let newStrip = $('<div class="strip"><div class="effectBox"><p>DROP FX</p></div><div class="panBox"><div class="panKnob"><div class="knobMark"></div></div></div><div class="buttonBox"><button class="solo">S</button><button class="mute">M</button></div><div class="trackbox"><div class="track"><div data-id='+i+' class="fader'+i+' fader"></div></div></div><p class="label">'+tracksNames[i]+'</p></div>');
      $('.masterStrip').before(newStrip);

      track.volume = 0.8;


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
          let faderOffsetTop = target.offset().top;


          target.mousedown(function(e) {
              dragging = true
              faderOffsetTop = $(e.target).offset().top;
          });

          $(document).mouseup(function() {
              dragging = false
          });


          $(document).mousemove(function(e) {

              if (dragging) {
                target.css('top', ( e.pageY - faderOffsetTop));
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
              target.css('top', '35px');
            } else {
              target.css('top', '35px');
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


      if( tracksArr.length !== counter ) { // tracks loaded

        if( !$load.hasClass('loading') ) {
          $load.append("<div class='loader'></div>");
        };

        $container.addClass('overlay');
        $load.addClass('loading');

      } else {

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
        $load.text('');
        clearInterval(loadingInterval);

      };
  }, 500); // loading check frequency




  // masterfader



  const $masterFader = $('.master');


  function setMasterVolumeStart() {
      trackGroup.volume = 0.8;
  };
  setMasterVolume();




  function setMasterVolume() {
      tracksGroup.volume = ( parseInt($masterFader.css('top')) - 315 ) / -350;
  };



  // masterFader movement






  function MasterFaderMove() {

    let dragging = false

    $(function () {

      let masterOffsetTop = $masterFader.offset().top;

        $masterFader.mousedown(function(e) {
            dragging = true
            masterOffsetTop = $(e.target).offset().top;
        })
        $(document).mouseup(function() {
            dragging = false
        })
        $(document).mousemove(function(e) {

            if (dragging) {
              $masterFader.css('top', (e.pageY - masterOffsetTop) );
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
          $masterFader.css('top', '35px');
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
        });

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

  let fxCount = 0;


  // hpf
  $mixer.on('click', '.hpf', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['hpf' + $(this).attr('data-instance')] = new Pizzicato.Effects.HighPassFilter({
               frequency: 400,
               peak: 3,
             });

            tracksGroup.addEffect(window['hpf' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['hpf' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['hpf' + $(this).attr('data-instance')] = new Pizzicato.Effects.HighPassFilter({
               frequency: 400,
               peak: 3,
             });

            tracksGroup.sounds[id].addEffect(window['hpf' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['hpf' + $(this).attr('data-instance')]);

          };

    };

  });

  // lpf
  $mixer.on('click', '.lpf', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['lpf' + $(this).attr('data-instance')] = new Pizzicato.Effects.LowPassFilter({
               frequency: 4000,
               peak: 3,
             });

            tracksGroup.addEffect(window['lpf' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['lpf' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['lpf' + $(this).attr('data-instance')] = new Pizzicato.Effects.LowPassFilter({
               frequency: 4000,
               peak: 3,
             });

            tracksGroup.sounds[id].addEffect(window['lpf' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['lpf' + $(this).attr('data-instance')]);

          };
    };

  });

  // compressor
  $mixer.on('click', '.compressor', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['compressor' + $(this).attr('data-instance')] = new Pizzicato.Effects.Compressor({
                treshold: -30,
                ratio: 12
             });

            tracksGroup.addEffect(window['compressor' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['compressor' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['compressor' + $(this).attr('data-instance')] = new Pizzicato.Effects.Compressor({
               treshold: -30,
               ratio: 12
             });

            tracksGroup.sounds[id].addEffect(window['compressor' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['compressor' + $(this).attr('data-instance')]);

          };
    };
  });

  // fuzz
  $mixer.on('click', '.fuzz', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['fuzz' + $(this).attr('data-instance')] = new Pizzicato.Effects.Quadrafuzz({
                lowGain: 1.0,
                midLowGain: 0.6,
                midHighGain: 0.78,
                highGain: 0.9,
                mix: 1,
             });

            tracksGroup.addEffect(window['fuzz' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['fuzz' + $(this).attr('data-instance')]);

          };

    } else {

      const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['fuzz' + $(this).attr('data-instance')] = new Pizzicato.Effects.Quadrafuzz({
               lowGain: 1.0,
               midLowGain: 0.6,
               midHighGain: 0.78,
               highGain: 0.9,
               mix: 1,
             });

            tracksGroup.sounds[id].addEffect(window['fuzz' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['fuzz' + $(this).attr('data-instance')]);

          };
    };
  });

  // distortion
  $mixer.on('click', '.distortion', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['distortion' + $(this).attr('data-instance')] = new Pizzicato.Effects.Distortion({
                gain: 1.0,
             });

            tracksGroup.addEffect(window['distortion' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['distortion' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['distortion' + $(this).attr('data-instance')] = new Pizzicato.Effects.Distortion({
               gain: 1.0,
             });

            tracksGroup.sounds[id].addEffect(window['distortion' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['distortion' + $(this).attr('data-instance')]);

          };
    };
  });

  // flanger
  $mixer.on('click', '.flanger', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['flanger' + $(this).attr('data-instance')] = new Pizzicato.Effects.Flanger({
                time: 0,
                speed: 0.13,
                depth: 0.25,
                feedback: 0.8,
                mix: 0.25
             });

            tracksGroup.addEffect(window['flanger' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['flanger' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['flanger' + $(this).attr('data-instance')] = new Pizzicato.Effects.Flanger({
              time: 0,
              speed: 0.13,
              depth: 0.25,
              feedback: 0.8,
              mix: 0.25
             });

            tracksGroup.sounds[id].addEffect(window['flanger' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['flanger' + $(this).attr('data-instance')]);

          };
    };
  });

  // delay
  $mixer.on('click', '.delay', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['delay' + $(this).attr('data-instance')] = new Pizzicato.Effects.Delay({
                feedback: 0.3,
                time: 0.25,
                mix: 0.25
             });

            tracksGroup.addEffect(window['delay' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['delay' + $(this).attr('data-instance')]);

          };

    } else {

      const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['delay' + $(this).attr('data-instance')] = new Pizzicato.Effects.Delay({
              feedback: 0.3,
              time: 0.25,
              mix: 0.25
             });

            tracksGroup.sounds[id].addEffect(window['delay' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['delay' + $(this).attr('data-instance')]);

          };
    };
  });

  // reverb
  $mixer.on('click', '.reverb', function(e) {

    if( $(e.target).parent().parent().hasClass('masterStrip') ) {

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['reverb' + $(this).attr('data-instance')] = new Pizzicato.Effects.Reverb({
                time: 1.8,
                decay: 3,
                mix: 0.7
             });

            tracksGroup.addEffect(window['reverb' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.removeEffect(window['reverb' + $(this).attr('data-instance')]);

          };

    } else {

          const id = $(e.target).parent().parent().find('.fader').data('id');

          if( !$(e.target).hasClass('effectOn') ) {

            $(e.target).addClass('effectOn');

            window['reverb' + $(this).attr('data-instance')] = new Pizzicato.Effects.Reverb({
               time: 1.8,
               decay: 3,
               mix: 0.7
             });

            tracksGroup.sounds[id].addEffect(window['reverb' + $(this).attr('data-instance')]);

          } else {

            $(e.target).removeClass('effectOn');

            tracksGroup.sounds[id].removeEffect(window['reverb' + $(this).attr('data-instance')]);

          };
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
              fxCount++;
              $(this).find('.effectBox').append(
                '<button class="' + target.attr('data-passClass') + ' effectBtn" data-instance=' + fxCount + '>' + target.attr('data-name') + '</button>'
              );
            };

            dragging = false

        });
    });
  });










});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTRjODFjZDVjZTVhMTc3NjI2YzMiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUE7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxHQUFHLEVBQUU7Ozs7O0FBS0w7Ozs7QUFJQTs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7Ozs7QUFLQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7Ozs7O0FBS0E7Ozs7O0FBS0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0EsV0FBVzs7O0FBR1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7OztBQU1MOzs7QUFHQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7OztBQUlQOzs7QUFHQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQSxPQUFPOzs7Ozs7QUFNUDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7OztBQUdBLDBDQUEwQzs7QUFFMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxPQUFPOzs7OztBQUtWOzs7O0FBSUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTs7OztBQUlBOzs7Ozs7O0FBT0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVULEtBQUs7QUFDTDs7QUFFQTs7Ozs7OztBQU9BOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7OztBQUlIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1QsS0FBSztBQUNMLEdBQUc7Ozs7O0FBS0g7O0FBRUE7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7Ozs7O0FBTUg7OztBQUdBOzs7OztBQUtBOzs7QUFHQTs7O0FBR0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNULEtBQUs7QUFDTCxHQUFHOzs7Ozs7Ozs7OztBQVdILENBQUMiLCJmaWxlIjoiLi9qcy9vdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhNGM4MWNkNWNlNWExNzc2MjZjMyIsIiQoZnVuY3Rpb24oKXsgLy9ET01Db250ZW50TG9hZGVkXG5cblxuXG4vLyBsb2FkaW5nIHRyYWNrcyBmcm9tIGFycmF5XG5cblxuICBsZXQgdHJhY2tzR3JvdXAgPSBuZXcgUGl6emljYXRvLkdyb3VwKCk7XG4gIGxldCBjb3VudGVyID0gMDtcbiAgY29uc3QgdHJhY2tzQXJyID0gWycuLy4uL2F1ZGlvL0JQL0RSVU1TLndhdicsICcuLy4uL2F1ZGlvL0JQL0JBU1Mud2F2J107XG4gIGNvbnN0IHRyYWNrc05hbWVzID0gWydEUlVNUycsICdCQVNTJ107XG4gIGNvbnN0IHRyYWNrc1NvbG9lZCA9IFtmYWxzZSwgZmFsc2VdO1xuXG5cblxuXG5cblxuXG4gIHRyYWNrc0Fyci5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG5cbiAgICAgICAgc291cmNlOiAnZmlsZScsXG4gICAgICAgIG9wdGlvbnM6IHsgcGF0aDogdCB9XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJyBhdWRpbyBmaWxlIGxvYWRlZCEnKTtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfSk7XG5cbiAgICAgIHRyYWNrc0dyb3VwLmFkZFNvdW5kKHRyYWNrKTtcblxuICAgICAgLy8gY3JlYXRpbmcgY2hhbm5lbCBzdHJpcHNcblxuICAgICAgbGV0IG5ld1N0cmlwID0gJCgnPGRpdiBjbGFzcz1cInN0cmlwXCI+PGRpdiBjbGFzcz1cImVmZmVjdEJveFwiPjxwPkRST1AgRlg8L3A+PC9kaXY+PGRpdiBjbGFzcz1cInBhbkJveFwiPjxkaXYgY2xhc3M9XCJwYW5Lbm9iXCI+PGRpdiBjbGFzcz1cImtub2JNYXJrXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImJ1dHRvbkJveFwiPjxidXR0b24gY2xhc3M9XCJzb2xvXCI+UzwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJtdXRlXCI+TTwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XCJ0cmFja2JveFwiPjxkaXYgY2xhc3M9XCJ0cmFja1wiPjxkaXYgZGF0YS1pZD0nK2krJyBjbGFzcz1cImZhZGVyJytpKycgZmFkZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48cCBjbGFzcz1cImxhYmVsXCI+Jyt0cmFja3NOYW1lc1tpXSsnPC9wPjwvZGl2PicpO1xuICAgICAgJCgnLm1hc3RlclN0cmlwJykuYmVmb3JlKG5ld1N0cmlwKTtcblxuICAgICAgdHJhY2sudm9sdW1lID0gMC44O1xuXG5cbiAgfSk7IC8vIGVuZCBvZiBmb3JFYWNoXG5cblxuXG5cbiAgLy8gdm9sdW1lIGZ1bmN0aW9uYWxpdGllc1xuXG5cblxuICAgIGNvbnN0ICRmYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYWRlcicpO1xuXG5cblxuICAgIC8vIGNoZWNrSWZOb3RTb2xvZWQgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gY2hlY2tJZk5vdFNvbG9lZCgpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRyYWNrc1NvbG9lZC5maWx0ZXIoIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFyci5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlO1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBzZXRWb2x1bWUgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gc2V0Vm9sdW1lKGluZGV4LCB0aGlzRmFkZXIpIHtcblxuICAgICAgY29uc3QgJG11dGUgPSB0aGlzRmFkZXIucGFyZW50KCkucGFyZW50KCkucHJldigpLmZpbmQoJy5tdXRlJyk7XG5cbiAgICAgIGlmKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgbnVsbDtcbiAgICAgIH0gZWxzZSBpZiggdHJhY2tzU29sb2VkW2luZGV4XSB8fCBjaGVja0lmTm90U29sb2VkKCkgKSB7XG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0udm9sdW1lID0gKCBwYXJzZUludCh0aGlzRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gICAgICB9O1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBmYWRlciBtb3ZlbWVudFxuXG5cblxuXG4gICAgJGZhZGVyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICAgJChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcuZmFkZXInKS5lcShpKTtcbiAgICAgICAgICBsZXQgZmFkZXJPZmZzZXRUb3AgPSB0YXJnZXQub2Zmc2V0KCkudG9wO1xuXG5cbiAgICAgICAgICB0YXJnZXQubW91c2Vkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgICAgICAgIGZhZGVyT2Zmc2V0VG9wID0gJChlLnRhcmdldCkub2Zmc2V0KCkudG9wO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICggZS5wYWdlWSAtIGZhZGVyT2Zmc2V0VG9wKSk7XG4gICAgICAgICAgICAgICAgICBpZiggcGFyc2VJbnQodGFyZ2V0LmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzMxNXB4Jyk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KHRhcmdldC5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIHRhcmdldC5kYXRhKCdpZCcpLCB0YXJnZXQgKTtcblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoICRtdXRlLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzVweCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgJzM1cHgnKTtcbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKCB0YXJnZXQuZGF0YSgnaWQnKSwgdGFyZ2V0ICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICB9KTtcblxuXG5cblxuXG4gIC8vIHNvbG8gJiBtdXRlXG5cblxuICAgIC8vIG11dGVcblxuXG4gICAgICBjb25zdCAkbXV0ZSA9ICQoJy5tdXRlJyk7XG5cbiAgICAgICRtdXRlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgIGlmKCAhJCh0aGlzKS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ211dGVkJyk7XG4gICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG4gICAgLy8gc29sb1xuXG5cbiAgICAgIGNvbnN0ICRzb2xvID0gJCgnLnNvbG8nKTtcblxuXG4gICAgICAkc29sby5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgJHNlbGYgPSAkKHRoaXMpO1xuICAgICAgICBsZXQgbm90U29sb2VkID0gdHJ1ZTtcblxuICAgICAgICAgICRzb2xvLmVhY2goIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgIGlmKCBzZWxmID09PSB0aGlzICkge1xuICAgICAgICAgICAgICBpZiggISRzZWxmLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRWb2x1bWUoIGlkLCB0aGlzRmFkZXIgKTtcbiAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnc29sb2VkJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgICB0cmFja3NTb2xvZWRbaWRdID0gZmFsc2U7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiggISQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0udm9sdW1lID0gMDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTs7XG5cbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmhhc0NsYXNzKCdzb2xvZWQnKSApIHtcbiAgICAgICAgICAgICAgbm90U29sb2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiggbm90U29sb2VkICkge1xuICAgICAgICAgICAgJHNvbG8uZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAgIGNvbnN0IHRoaXNGYWRlciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJyk7XG5cbiAgICAgICAgICAgICAgc2V0Vm9sdW1lKGlkLCB0aGlzRmFkZXIpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgfSk7XG5cblxuXG5cblxuICAvLyB0cmFuc3BvcnQgd2luZG93XG5cblxuICAvLyBidXR0b25zXG5cbiAgY29uc3QgJHBsYXlCdG4gPSAkKCcjcGxheScpO1xuICBjb25zdCAkcGF1c2VCdG4gPSAkKCcjcGF1c2UnKTtcbiAgY29uc3QgJHN0b3BCdG4gPSAkKCcjc3RvcCcpO1xuICBjb25zdCAkcndCdG4gPSAkKCcjcncnKTtcbiAgY29uc3QgJGZmQnRuID0gJCgnI2ZmJyk7XG4gIGNvbnN0ICRyd3J3QnRuID0gJCgnI3J3cncnKTtcbiAgY29uc3QgJGZmZmZCdG4gPSAkKCcjZmZmZicpO1xuICBjb25zdCAkbG9hZCA9ICQoJyNsb2FkJyk7XG4gIGNvbnN0ICRjb250YWluZXIgPSAkKCcuY29udGFpbmVyJyk7XG5cblxuXG4gIC8vIGNoZWNraW5nIGlmIHRyYWNrcyBhcmUgbG9hZGVkXG5cbiAgY29uc3QgbG9hZGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoICgpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coJ0NoZWNrJyk7XG5cblxuICAgICAgaWYoIHRyYWNrc0Fyci5sZW5ndGggIT09IGNvdW50ZXIgKSB7IC8vIHRyYWNrcyBsb2FkZWRcblxuICAgICAgICBpZiggISRsb2FkLmhhc0NsYXNzKCdsb2FkaW5nJykgKSB7XG4gICAgICAgICAgJGxvYWQuYXBwZW5kKFwiPGRpdiBjbGFzcz0nbG9hZGVyJz48L2Rpdj5cIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICAkbG9hZC5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIHBsYXlcblxuICAgICAgICAkcGxheUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcGF1c2VcblxuICAgICAgICAkcGF1c2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc3RvcFxuXG4gICAgICAgICRzdG9wQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnN0b3AoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV3aW5kIDEwc2VjXG5cbiAgICAgICAgJHJ3QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lIC0gMTBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPCAwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZmFzdCBmb3J3YXJkIDEwc2VjXG5cbiAgICAgICAgJGZmQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lICsgMTBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPiAzNTAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDM1MFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0cmFja3NHcm91cC5wbGF5KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJld2luZCAzMHNlY1xuXG4gICAgICAgICRyd3J3QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBhdXNlKCk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goIHQgPT4ge1xuICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gdC5vZmZzZXRUaW1lIC0gMzBcbiAgICAgICAgICAgIGlmKCB0Lm9mZnNldFRpbWUgPCAwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZmFzdCBmb3J3YXJkIDMwc2VjXG5cbiAgICAgICAgJGZmZmZCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgKyA0MFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA+IDM1MCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMzUwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTG9hZGluZyBib3hcblxuICAgICAgICAkY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgICRsb2FkLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICRsb2FkLnRleHQoJycpO1xuICAgICAgICBjbGVhckludGVydmFsKGxvYWRpbmdJbnRlcnZhbCk7XG5cbiAgICAgIH07XG4gIH0sIDUwMCk7IC8vIGxvYWRpbmcgY2hlY2sgZnJlcXVlbmN5XG5cblxuXG5cbiAgLy8gbWFzdGVyZmFkZXJcblxuXG5cbiAgY29uc3QgJG1hc3RlckZhZGVyID0gJCgnLm1hc3RlcicpO1xuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lU3RhcnQoKSB7XG4gICAgICB0cmFja0dyb3VwLnZvbHVtZSA9IDAuODtcbiAgfTtcbiAgc2V0TWFzdGVyVm9sdW1lKCk7XG5cblxuXG5cbiAgZnVuY3Rpb24gc2V0TWFzdGVyVm9sdW1lKCkge1xuICAgICAgdHJhY2tzR3JvdXAudm9sdW1lID0gKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gIH07XG5cblxuXG4gIC8vIG1hc3RlckZhZGVyIG1vdmVtZW50XG5cblxuXG5cblxuXG4gIGZ1bmN0aW9uIE1hc3RlckZhZGVyTW92ZSgpIHtcblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgbGV0IG1hc3Rlck9mZnNldFRvcCA9ICRtYXN0ZXJGYWRlci5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgJG1hc3RlckZhZGVyLm1vdXNlZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICAgIG1hc3Rlck9mZnNldFRvcCA9ICQoZS50YXJnZXQpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsIChlLnBhZ2VZIC0gbWFzdGVyT2Zmc2V0VG9wKSApO1xuICAgICAgICAgICAgICBpZiggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNldE1hc3RlclZvbHVtZSgpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgJG1hc3RlckZhZGVyLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICczNXB4Jyk7XG4gICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH07XG5cbiAgTWFzdGVyRmFkZXJNb3ZlKCk7XG5cblxuXG5cblxuXG4gIC8vIHN0ZXJlbyBwYW4gZmVhdXR1cmVzXG5cblxuICAvLyBhZGRpbmcgbmV3IHN0ZXJlb1Bhbm5lciBlZmZlY3QgdG8gZWFjaCB0cmFja1xuXG4gIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCAodCwgaSkgPT4ge1xuICAgIHdpbmRvd1snc3RlcmVvUGFubmVyJyArIGldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlN0ZXJlb1Bhbm5lcih7XG4gICAgICAgcGFuOiAwXG4gICAgIH0pO1xuXG4gICAgdC5hZGRFZmZlY3Qod2luZG93WydzdGVyZW9QYW5uZXInICsgaV0pO1xuICB9KTtcblxuXG5cbiAgLy8gZnVuY3Rpb24gc2V0UGFuXG5cblxuICBmdW5jdGlvbiBzZXRQYW4oaW5kZXgsIHRoaXNLbm9iLCBkZWcpIHtcbiAgICAvLyB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ub3B0aW9ucy5wYW4gPSAoIHBhcnNlSW50KHRoaXNLbm9iLmNzcygndHJhbnNmb3JtJykpIDtcbiAgICBpZiAoIGRlZyA+IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gKGRlZyAvIDEwMCkgLTAuNCA7XG4gICAgfSBlbHNlIGlmICggZGVnIDwgMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAoZGVnIC8gMTAwKSArMC40IDtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IDA7XG4gICAgfTtcbiAgfTtcblxuXG5cblxuICAvLyBwYW5Lbm9icyBtb3ZlbWVudFxuXG5cbiAgY29uc3QgcGFuS25vYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuS25vYicpO1xuXG4gIHBhbktub2JzLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cbiAgICAkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcucGFuS25vYicpLmVxKGkpO1xuXG4gICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbW91c2VfeSA9IGUucGFnZVk7XG4gICAgICAgICAgICAgICAgdmFyIGRlZ3JlZSA9IG1vdXNlX3kgLSAxNDBcbiAgICAgICAgICAgICAgICBpZiggZGVncmVlID4gMTQwICkge1xuICAgICAgICAgICAgICAgICAgZGVncmVlID0gMTQwO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgKC0gZGVncmVlKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICBzZXRQYW4oaSwgdGFyZ2V0LCAwKTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cblxuXG5cbiAgLy8gZWZmZWN0cyBmdW5jdGlvbmFsaXRpZXNcblxuICBjb25zdCAkbWl4ZXIgPSAkKCcubWl4ZXInKTtcblxuICBsZXQgZnhDb3VudCA9IDA7XG5cblxuICAvLyBocGZcbiAgJG1peGVyLm9uKCdjbGljaycsICcuaHBmJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snaHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5IaWdoUGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMCxcbiAgICAgICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkhpZ2hQYXNzRmlsdGVyKHtcbiAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogNDAwLFxuICAgICAgICAgICAgICAgcGVhazogMyxcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH07XG5cbiAgfSk7XG5cbiAgLy8gbHBmXG4gICRtaXhlci5vbignY2xpY2snLCAnLmxwZicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2xwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuTG93UGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMDAsXG4gICAgICAgICAgICAgICBwZWFrOiAzLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Mb3dQYXNzRmlsdGVyKHtcbiAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogNDAwMCxcbiAgICAgICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcblxuICB9KTtcblxuICAvLyBjb21wcmVzc29yXG4gICRtaXhlci5vbignY2xpY2snLCAnLmNvbXByZXNzb3InLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Db21wcmVzc29yKHtcbiAgICAgICAgICAgICAgICB0cmVzaG9sZDogLTMwLFxuICAgICAgICAgICAgICAgIHJhdGlvOiAxMlxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Db21wcmVzc29yKHtcbiAgICAgICAgICAgICAgIHRyZXNob2xkOiAtMzAsXG4gICAgICAgICAgICAgICByYXRpbzogMTJcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGZ1enpcbiAgJG1peGVyLm9uKCdjbGljaycsICcuZnV6eicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlF1YWRyYWZ1enooe1xuICAgICAgICAgICAgICAgIGxvd0dhaW46IDEuMCxcbiAgICAgICAgICAgICAgICBtaWRMb3dHYWluOiAwLjYsXG4gICAgICAgICAgICAgICAgbWlkSGlnaEdhaW46IDAuNzgsXG4gICAgICAgICAgICAgICAgaGlnaEdhaW46IDAuOSxcbiAgICAgICAgICAgICAgICBtaXg6IDEsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydmdXp6JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUXVhZHJhZnV6eih7XG4gICAgICAgICAgICAgICBsb3dHYWluOiAxLjAsXG4gICAgICAgICAgICAgICBtaWRMb3dHYWluOiAwLjYsXG4gICAgICAgICAgICAgICBtaWRIaWdoR2FpbjogMC43OCxcbiAgICAgICAgICAgICAgIGhpZ2hHYWluOiAwLjksXG4gICAgICAgICAgICAgICBtaXg6IDEsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBkaXN0b3J0aW9uXG4gICRtaXhlci5vbignY2xpY2snLCAnLmRpc3RvcnRpb24nLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5EaXN0b3J0aW9uKHtcbiAgICAgICAgICAgICAgICBnYWluOiAxLjAsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkRpc3RvcnRpb24oe1xuICAgICAgICAgICAgICAgZ2FpbjogMS4wLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gZmxhbmdlclxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5mbGFuZ2VyJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRmxhbmdlcih7XG4gICAgICAgICAgICAgICAgdGltZTogMCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMC4xMyxcbiAgICAgICAgICAgICAgICBkZXB0aDogMC4yNSxcbiAgICAgICAgICAgICAgICBmZWVkYmFjazogMC44LFxuICAgICAgICAgICAgICAgIG1peDogMC4yNVxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5GbGFuZ2VyKHtcbiAgICAgICAgICAgICAgdGltZTogMCxcbiAgICAgICAgICAgICAgc3BlZWQ6IDAuMTMsXG4gICAgICAgICAgICAgIGRlcHRoOiAwLjI1LFxuICAgICAgICAgICAgICBmZWVkYmFjazogMC44LFxuICAgICAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGRlbGF5XG4gICRtaXhlci5vbignY2xpY2snLCAnLmRlbGF5JywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkRlbGF5KHtcbiAgICAgICAgICAgICAgICBmZWVkYmFjazogMC4zLFxuICAgICAgICAgICAgICAgIHRpbWU6IDAuMjUsXG4gICAgICAgICAgICAgICAgbWl4OiAwLjI1XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2RlbGF5JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydkZWxheScgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRGVsYXkoe1xuICAgICAgICAgICAgICBmZWVkYmFjazogMC4zLFxuICAgICAgICAgICAgICB0aW1lOiAwLjI1LFxuICAgICAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydkZWxheScgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gcmV2ZXJiXG4gICRtaXhlci5vbignY2xpY2snLCAnLnJldmVyYicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUmV2ZXJiKHtcbiAgICAgICAgICAgICAgICB0aW1lOiAxLjgsXG4gICAgICAgICAgICAgICAgZGVjYXk6IDMsXG4gICAgICAgICAgICAgICAgbWl4OiAwLjdcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuYWRkRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUmV2ZXJiKHtcbiAgICAgICAgICAgICAgIHRpbWU6IDEuOCxcbiAgICAgICAgICAgICAgIGRlY2F5OiAzLFxuICAgICAgICAgICAgICAgbWl4OiAwLjdcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydyZXZlcmInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuXG5cblxuXG4gIC8vIGVmZmVjdHMgZHJhZyAmIGRyb3BcblxuXG4gIGNvbnN0ICRjaG9vc2VCdG5zID0gJCgnLmNob29zZUJ0bicpO1xuXG5cblxuXG4gICRjaG9vc2VCdG5zLmVhY2goIChpLHQpID0+IHtcblxuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gJGNob29zZUJ0bnMuZXEoaSk7XG5cblxuICAgICAgICB0YXJnZXQubW91c2Vkb3duKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgJCgnLnN0cmlwJykubW91c2V1cChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKCBkcmFnZ2luZyA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgZnhDb3VudCsrO1xuICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5lZmZlY3RCb3gnKS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgJzxidXR0b24gY2xhc3M9XCInICsgdGFyZ2V0LmF0dHIoJ2RhdGEtcGFzc0NsYXNzJykgKyAnIGVmZmVjdEJ0blwiIGRhdGEtaW5zdGFuY2U9JyArIGZ4Q291bnQgKyAnPicgKyB0YXJnZXQuYXR0cignZGF0YS1uYW1lJykgKyAnPC9idXR0b24+J1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9