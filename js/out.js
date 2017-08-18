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
                console.log(e.pageY);
                var degree = mouse_y - 140;
                if( degree > 140 ) {
                  degree = 140;
                } else if( degree < -140 ) {
                  degree = -140;
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzQ5NzhlNmZiOTAyMmFlMDNmZjkiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUE7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxHQUFHLEVBQUU7Ozs7O0FBS0w7Ozs7QUFJQTs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7Ozs7QUFLQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7Ozs7O0FBS0E7Ozs7O0FBS0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0EsV0FBVzs7O0FBR1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVgsT0FBTztBQUNQLEtBQUs7Ozs7OztBQU1MOzs7QUFHQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7OztBQUlQOzs7QUFHQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQSxPQUFPOzs7Ozs7QUFNUDs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7OztBQUdBLDBDQUEwQzs7QUFFMUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTtBQUNBOztBQUVBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxPQUFPOzs7OztBQUtWOzs7O0FBSUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTs7OztBQUlBOzs7Ozs7O0FBT0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVULEtBQUs7QUFDTDs7QUFFQTs7Ozs7OztBQU9BOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsR0FBRzs7OztBQUlIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7O0FBS0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsR0FBRzs7Ozs7QUFLSDs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOzs7Ozs7QUFNSDs7O0FBR0E7Ozs7O0FBS0E7OztBQUdBOzs7QUFHQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTO0FBQ1QsS0FBSztBQUNMLEdBQUc7Ozs7Ozs7Ozs7O0FBV0gsQ0FBQyIsImZpbGUiOiIuL2pzL291dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDc0OTc4ZTZmYjkwMjJhZTAzZmY5IiwiJChmdW5jdGlvbigpeyAvL0RPTUNvbnRlbnRMb2FkZWRcblxuXG5cbi8vIGxvYWRpbmcgdHJhY2tzIGZyb20gYXJyYXlcblxuXG4gIGxldCB0cmFja3NHcm91cCA9IG5ldyBQaXp6aWNhdG8uR3JvdXAoKTtcbiAgbGV0IGNvdW50ZXIgPSAwO1xuICBjb25zdCB0cmFja3NBcnIgPSBbJy4vLi4vYXVkaW8vQlAvRFJVTVMud2F2JywgJy4vLi4vYXVkaW8vQlAvQkFTUy53YXYnXTtcbiAgY29uc3QgdHJhY2tzTmFtZXMgPSBbJ0RSVU1TJywgJ0JBU1MnXTtcbiAgY29uc3QgdHJhY2tzU29sb2VkID0gW2ZhbHNlLCBmYWxzZV07XG5cblxuXG5cblxuXG5cbiAgdHJhY2tzQXJyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgY29uc3QgdHJhY2sgPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcblxuICAgICAgICBzb3VyY2U6ICdmaWxlJyxcbiAgICAgICAgb3B0aW9uczogeyBwYXRoOiB0IH1cbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGkgKyAnIGF1ZGlvIGZpbGUgbG9hZGVkIScpO1xuICAgICAgICBjb3VudGVyKys7XG4gICAgICB9KTtcblxuICAgICAgdHJhY2tzR3JvdXAuYWRkU291bmQodHJhY2spO1xuXG4gICAgICAvLyBjcmVhdGluZyBjaGFubmVsIHN0cmlwc1xuXG4gICAgICBsZXQgbmV3U3RyaXAgPSAkKCc8ZGl2IGNsYXNzPVwic3RyaXBcIj48ZGl2IGNsYXNzPVwiZWZmZWN0Qm94XCI+PHA+RFJPUCBGWDwvcD48L2Rpdj48ZGl2IGNsYXNzPVwicGFuQm94XCI+PGRpdiBjbGFzcz1cInBhbktub2JcIj48ZGl2IGNsYXNzPVwia25vYk1hcmtcIj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiYnV0dG9uQm94XCI+PGJ1dHRvbiBjbGFzcz1cInNvbG9cIj5TPC9idXR0b24+PGJ1dHRvbiBjbGFzcz1cIm11dGVcIj5NPC9idXR0b24+PC9kaXY+PGRpdiBjbGFzcz1cInRyYWNrYm94XCI+PGRpdiBjbGFzcz1cInRyYWNrXCI+PGRpdiBkYXRhLWlkPScraSsnIGNsYXNzPVwiZmFkZXInK2krJyBmYWRlclwiPjwvZGl2PjwvZGl2PjwvZGl2PjxwIGNsYXNzPVwibGFiZWxcIj4nK3RyYWNrc05hbWVzW2ldKyc8L3A+PC9kaXY+Jyk7XG4gICAgICAkKCcubWFzdGVyU3RyaXAnKS5iZWZvcmUobmV3U3RyaXApO1xuXG4gICAgICB0cmFjay52b2x1bWUgPSAwLjg7XG5cblxuICB9KTsgLy8gZW5kIG9mIGZvckVhY2hcblxuXG5cblxuICAvLyB2b2x1bWUgZnVuY3Rpb25hbGl0aWVzXG5cblxuXG4gICAgY29uc3QgJGZhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZhZGVyJyk7XG5cblxuXG4gICAgLy8gY2hlY2tJZk5vdFNvbG9lZCBmdW5jdGlvblxuXG5cbiAgICBmdW5jdGlvbiBjaGVja0lmTm90U29sb2VkKCkge1xuICAgICAgY29uc3QgYXJyID0gdHJhY2tzU29sb2VkLmZpbHRlciggZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gaSA9PT0gdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYXJyLmxlbmd0aCA+IDAgPyBmYWxzZSA6IHRydWU7XG4gICAgfTtcblxuXG5cblxuICAgIC8vIHNldFZvbHVtZSBmdW5jdGlvblxuXG5cbiAgICBmdW5jdGlvbiBzZXRWb2x1bWUoaW5kZXgsIHRoaXNGYWRlcikge1xuXG4gICAgICBjb25zdCAkbXV0ZSA9IHRoaXNGYWRlci5wYXJlbnQoKS5wYXJlbnQoKS5wcmV2KCkuZmluZCgnLm11dGUnKTtcblxuICAgICAgaWYoICRtdXRlLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICBudWxsO1xuICAgICAgfSBlbHNlIGlmKCB0cmFja3NTb2xvZWRbaW5kZXhdIHx8IGNoZWNrSWZOb3RTb2xvZWQoKSApIHtcbiAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS52b2x1bWUgPSAoIHBhcnNlSW50KHRoaXNGYWRlci5jc3MoJ3RvcCcpKSAtIDMxNSApIC8gLTM1MDtcbiAgICAgIH07XG4gICAgfTtcblxuXG5cblxuICAgIC8vIGZhZGVyIG1vdmVtZW50XG5cblxuXG5cbiAgICAkZmFkZXIuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgICAkKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5mYWRlcicpLmVxKGkpO1xuICAgICAgICAgIGxldCBmYWRlck9mZnNldFRvcCA9IHRhcmdldC5vZmZzZXQoKS50b3A7XG5cblxuICAgICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICAgICAgZmFkZXJPZmZzZXRUb3AgPSAkKGUudGFyZ2V0KS5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgKCBlLnBhZ2VZIC0gZmFkZXJPZmZzZXRUb3ApKTtcbiAgICAgICAgICAgICAgICAgIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQodGFyZ2V0LmNzcygndG9wJykpIDwgLTM1ICkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgIHNldFZvbHVtZSggdGFyZ2V0LmRhdGEoJ2lkJyksIHRhcmdldCApO1xuXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAgIHRhcmdldC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggJG11dGUuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICczNXB4Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzVweCcpO1xuICAgICAgICAgICAgICBzZXRWb2x1bWUoIHRhcmdldC5kYXRhKCdpZCcpLCB0YXJnZXQgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxuXG5cbiAgLy8gc29sbyAmIG11dGVcblxuXG4gICAgLy8gbXV0ZVxuXG5cbiAgICAgIGNvbnN0ICRtdXRlID0gJCgnLm11dGUnKTtcblxuICAgICAgJG11dGUub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICBjb25zdCB0aGlzRmFkZXIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpO1xuXG4gICAgICAgICAgaWYoICEkKHRoaXMpLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cbiAgICAvLyBzb2xvXG5cblxuICAgICAgY29uc3QgJHNvbG8gPSAkKCcuc29sbycpO1xuXG5cbiAgICAgICRzb2xvLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQodGhpcyk7XG4gICAgICAgIGxldCBub3RTb2xvZWQgPSB0cnVlO1xuXG4gICAgICAgICAgJHNvbG8uZWFjaCggZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgaWYoIHNlbGYgPT09IHRoaXMgKSB7XG4gICAgICAgICAgICAgIGlmKCAhJHNlbGYuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ3NvbG9lZCcpO1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmKCAhJCh0aGlzKS5oYXNDbGFzcygnc29sb2VkJykgKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9OztcblxuICAgICAgICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICBub3RTb2xvZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmKCBub3RTb2xvZWQgKSB7XG4gICAgICAgICAgICAkc29sby5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgICBzZXRWb2x1bWUoaWQsIHRoaXNGYWRlcik7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cblxuXG4gIC8vIHRyYW5zcG9ydCB3aW5kb3dcblxuXG4gIC8vIGJ1dHRvbnNcblxuICBjb25zdCAkcGxheUJ0biA9ICQoJyNwbGF5Jyk7XG4gIGNvbnN0ICRwYXVzZUJ0biA9ICQoJyNwYXVzZScpO1xuICBjb25zdCAkc3RvcEJ0biA9ICQoJyNzdG9wJyk7XG4gIGNvbnN0ICRyd0J0biA9ICQoJyNydycpO1xuICBjb25zdCAkZmZCdG4gPSAkKCcjZmYnKTtcbiAgY29uc3QgJHJ3cndCdG4gPSAkKCcjcndydycpO1xuICBjb25zdCAkZmZmZkJ0biA9ICQoJyNmZmZmJyk7XG4gIGNvbnN0ICRsb2FkID0gJCgnI2xvYWQnKTtcbiAgY29uc3QgJGNvbnRhaW5lciA9ICQoJy5jb250YWluZXInKTtcblxuXG5cbiAgLy8gY2hlY2tpbmcgaWYgdHJhY2tzIGFyZSBsb2FkZWRcblxuICBjb25zdCBsb2FkaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCggKCkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZygnQ2hlY2snKTtcblxuXG4gICAgICBpZiggdHJhY2tzQXJyLmxlbmd0aCAhPT0gY291bnRlciApIHsgLy8gdHJhY2tzIGxvYWRlZFxuXG4gICAgICAgIGlmKCAhJGxvYWQuaGFzQ2xhc3MoJ2xvYWRpbmcnKSApIHtcbiAgICAgICAgICAkbG9hZC5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdsb2FkZXInPjwvZGl2PlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgICRsb2FkLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gcGxheVxuXG4gICAgICAgICRwbGF5QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwYXVzZVxuXG4gICAgICAgICRwYXVzZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9wXG5cbiAgICAgICAgJHN0b3BCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc3RvcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMTBzZWNcblxuICAgICAgICAkcndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMTBzZWNcblxuICAgICAgICAkZmZCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgKyAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA+IDM1MCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMzUwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV3aW5kIDMwc2VjXG5cbiAgICAgICAgJHJ3cndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAzMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMzBzZWNcblxuICAgICAgICAkZmZmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDQwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMb2FkaW5nIGJveFxuXG4gICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgJGxvYWQucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgJGxvYWQudGV4dCgnJyk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwobG9hZGluZ0ludGVydmFsKTtcblxuICAgICAgfTtcbiAgfSwgNTAwKTsgLy8gbG9hZGluZyBjaGVjayBmcmVxdWVuY3lcblxuXG5cblxuICAvLyBtYXN0ZXJmYWRlclxuXG5cblxuICBjb25zdCAkbWFzdGVyRmFkZXIgPSAkKCcubWFzdGVyJyk7XG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWVTdGFydCgpIHtcbiAgICAgIHRyYWNrR3JvdXAudm9sdW1lID0gMC44O1xuICB9O1xuICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuXG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWUoKSB7XG4gICAgICB0cmFja3NHcm91cC52b2x1bWUgPSAoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSAtIDMxNSApIC8gLTM1MDtcbiAgfTtcblxuXG5cbiAgLy8gbWFzdGVyRmFkZXIgbW92ZW1lbnRcblxuXG5cblxuXG5cbiAgZnVuY3Rpb24gTWFzdGVyRmFkZXJNb3ZlKCkge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICBsZXQgbWFzdGVyT2Zmc2V0VG9wID0gJG1hc3RlckZhZGVyLm9mZnNldCgpLnRvcDtcblxuICAgICAgICAkbWFzdGVyRmFkZXIubW91c2Vkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgICAgbWFzdGVyT2Zmc2V0VG9wID0gJChlLnRhcmdldCkub2Zmc2V0KCkudG9wO1xuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZXVwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUoZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgKGUucGFnZVkgLSBtYXN0ZXJPZmZzZXRUb3ApICk7XG4gICAgICAgICAgICAgIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICczMTVweCcpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSA8IC0zNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAkbWFzdGVyRmFkZXIub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJzM1cHgnKTtcbiAgICAgICAgICBzZXRNYXN0ZXJWb2x1bWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfTtcblxuICBNYXN0ZXJGYWRlck1vdmUoKTtcblxuXG5cblxuXG5cbiAgLy8gc3RlcmVvIHBhbiBmZWF1dHVyZXNcblxuXG4gIC8vIGFkZGluZyBuZXcgc3RlcmVvUGFubmVyIGVmZmVjdCB0byBlYWNoIHRyYWNrXG5cbiAgdHJhY2tzR3JvdXAuc291bmRzLmZvckVhY2goICh0LCBpKSA9PiB7XG4gICAgd2luZG93WydzdGVyZW9QYW5uZXInICsgaV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuU3RlcmVvUGFubmVyKHtcbiAgICAgICBwYW46IDBcbiAgICAgfSk7XG5cbiAgICB0LmFkZEVmZmVjdCh3aW5kb3dbJ3N0ZXJlb1Bhbm5lcicgKyBpXSk7XG4gIH0pO1xuXG5cblxuICAvLyBmdW5jdGlvbiBzZXRQYW5cblxuXG4gIGZ1bmN0aW9uIHNldFBhbihpbmRleCwgdGhpc0tub2IsIGRlZykge1xuICAgIC8vIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5vcHRpb25zLnBhbiA9ICggcGFyc2VJbnQodGhpc0tub2IuY3NzKCd0cmFuc2Zvcm0nKSkgO1xuICAgIGlmICggZGVnID4gMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSAoZGVnIC8gMTAwKSAtMC40IDtcbiAgICB9IGVsc2UgaWYgKCBkZWcgPCAwICkge1xuICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2luZGV4XS5lZmZlY3RzWzBdLnBhbiA9IChkZWcgLyAxMDApICswLjQgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gMDtcbiAgICB9O1xuICB9O1xuXG5cblxuXG4gIC8vIHBhbktub2JzIG1vdmVtZW50XG5cblxuICBjb25zdCBwYW5Lbm9icyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5Lbm9iJyk7XG5cbiAgcGFuS25vYnMuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5wYW5Lbm9iJykuZXEoaSk7XG5cbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KVxuXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgICAgIHZhciBtb3VzZV95ID0gZS5wYWdlWTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnBhZ2VZKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVncmVlID0gbW91c2VfeSAtIDE0MDtcbiAgICAgICAgICAgICAgICBpZiggZGVncmVlID4gMTQwICkge1xuICAgICAgICAgICAgICAgICAgZGVncmVlID0gMTQwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggZGVncmVlIDwgLTE0MCApIHtcbiAgICAgICAgICAgICAgICAgIGRlZ3JlZSA9IC0xNDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArICgtIGRlZ3JlZSkgKyAnZGVnKScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcblxuICAgICAgICAgICAgICAgIHNldFBhbihpLCB0YXJnZXQsICgtIGRlZ3JlZSkpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdGFyZ2V0Lm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW8tdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tcy10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcblxuICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgMCk7XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cblxuXG4gIC8vIGVmZmVjdHMgZnVuY3Rpb25hbGl0aWVzXG5cbiAgY29uc3QgJG1peGVyID0gJCgnLm1peGVyJyk7XG5cbiAgbGV0IGZ4Q291bnQgPSAwO1xuXG5cbiAgLy8gaHBmXG4gICRtaXhlci5vbignY2xpY2snLCAnLmhwZicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuSGlnaFBhc3NGaWx0ZXIoe1xuICAgICAgICAgICAgICAgZnJlcXVlbmN5OiA0MDAsXG4gICAgICAgICAgICAgICBwZWFrOiAzLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snaHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5IaWdoUGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMCxcbiAgICAgICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snaHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9O1xuXG4gIH0pO1xuXG4gIC8vIGxwZlxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5scGYnLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkxvd1Bhc3NGaWx0ZXIoe1xuICAgICAgICAgICAgICAgZnJlcXVlbmN5OiA0MDAwLFxuICAgICAgICAgICAgICAgcGVhazogMyxcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuYWRkRWZmZWN0KHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2xwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuTG93UGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMDAsXG4gICAgICAgICAgICAgICBwZWFrOiAzLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2xwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG5cbiAgfSk7XG5cbiAgLy8gY29tcHJlc3NvclxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5jb21wcmVzc29yJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuQ29tcHJlc3Nvcih7XG4gICAgICAgICAgICAgICAgdHJlc2hvbGQ6IC0zMCxcbiAgICAgICAgICAgICAgICByYXRpbzogMTJcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuYWRkRWZmZWN0KHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2NvbXByZXNzb3InICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuQ29tcHJlc3Nvcih7XG4gICAgICAgICAgICAgICB0cmVzaG9sZDogLTMwLFxuICAgICAgICAgICAgICAgcmF0aW86IDEyXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBmdXp6XG4gICRtaXhlci5vbignY2xpY2snLCAnLmZ1enonLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydmdXp6JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5RdWFkcmFmdXp6KHtcbiAgICAgICAgICAgICAgICBsb3dHYWluOiAxLjAsXG4gICAgICAgICAgICAgICAgbWlkTG93R2FpbjogMC42LFxuICAgICAgICAgICAgICAgIG1pZEhpZ2hHYWluOiAwLjc4LFxuICAgICAgICAgICAgICAgIGhpZ2hHYWluOiAwLjksXG4gICAgICAgICAgICAgICAgbWl4OiAxLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydmdXp6JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlF1YWRyYWZ1enooe1xuICAgICAgICAgICAgICAgbG93R2FpbjogMS4wLFxuICAgICAgICAgICAgICAgbWlkTG93R2FpbjogMC42LFxuICAgICAgICAgICAgICAgbWlkSGlnaEdhaW46IDAuNzgsXG4gICAgICAgICAgICAgICBoaWdoR2FpbjogMC45LFxuICAgICAgICAgICAgICAgbWl4OiAxLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gZGlzdG9ydGlvblxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5kaXN0b3J0aW9uJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZGlzdG9ydGlvbicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRGlzdG9ydGlvbih7XG4gICAgICAgICAgICAgICAgZ2FpbjogMS4wLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZGlzdG9ydGlvbicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5EaXN0b3J0aW9uKHtcbiAgICAgICAgICAgICAgIGdhaW46IDEuMCxcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGZsYW5nZXJcbiAgJG1peGVyLm9uKCdjbGljaycsICcuZmxhbmdlcicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2ZsYW5nZXInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkZsYW5nZXIoe1xuICAgICAgICAgICAgICAgIHRpbWU6IDAsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMTMsXG4gICAgICAgICAgICAgICAgZGVwdGg6IDAuMjUsXG4gICAgICAgICAgICAgICAgZmVlZGJhY2s6IDAuOCxcbiAgICAgICAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuYWRkRWZmZWN0KHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2ZsYW5nZXInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRmxhbmdlcih7XG4gICAgICAgICAgICAgIHRpbWU6IDAsXG4gICAgICAgICAgICAgIHNwZWVkOiAwLjEzLFxuICAgICAgICAgICAgICBkZXB0aDogMC4yNSxcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IDAuOCxcbiAgICAgICAgICAgICAgbWl4OiAwLjI1XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBkZWxheVxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5kZWxheScsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2RlbGF5JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5EZWxheSh7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2s6IDAuMyxcbiAgICAgICAgICAgICAgICB0aW1lOiAwLjI1LFxuICAgICAgICAgICAgICAgIG1peDogMC4yNVxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydkZWxheScgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2RlbGF5JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkRlbGF5KHtcbiAgICAgICAgICAgICAgZmVlZGJhY2s6IDAuMyxcbiAgICAgICAgICAgICAgdGltZTogMC4yNSxcbiAgICAgICAgICAgICAgbWl4OiAwLjI1XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2RlbGF5JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIHJldmVyYlxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5yZXZlcmInLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydyZXZlcmInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlJldmVyYih7XG4gICAgICAgICAgICAgICAgdGltZTogMS44LFxuICAgICAgICAgICAgICAgIGRlY2F5OiAzLFxuICAgICAgICAgICAgICAgIG1peDogMC43XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydyZXZlcmInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlJldmVyYih7XG4gICAgICAgICAgICAgICB0aW1lOiAxLjgsXG4gICAgICAgICAgICAgICBkZWNheTogMyxcbiAgICAgICAgICAgICAgIG1peDogMC43XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydyZXZlcmInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cblxuXG5cblxuICAvLyBlZmZlY3RzIGRyYWcgJiBkcm9wXG5cblxuICBjb25zdCAkY2hvb3NlQnRucyA9ICQoJy5jaG9vc2VCdG4nKTtcblxuXG5cblxuICAkY2hvb3NlQnRucy5lYWNoKCAoaSx0KSA9PiB7XG5cblxuICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlXG5cblxuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICRjaG9vc2VCdG5zLmVxKGkpO1xuXG5cbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KTtcblxuXG4gICAgICAgICQoJy5zdHJpcCcpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICggZHJhZ2dpbmcgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgIGZ4Q291bnQrKztcbiAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuZWZmZWN0Qm94JykuYXBwZW5kKFxuICAgICAgICAgICAgICAgICc8YnV0dG9uIGNsYXNzPVwiJyArIHRhcmdldC5hdHRyKCdkYXRhLXBhc3NDbGFzcycpICsgJyBlZmZlY3RCdG5cIiBkYXRhLWluc3RhbmNlPScgKyBmeENvdW50ICsgJz4nICsgdGFyZ2V0LmF0dHIoJ2RhdGEtbmFtZScpICsgJzwvYnV0dG9uPidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcblxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cblxuXG5cblxuXG5cblxuXG5cbn0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9qcy9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==