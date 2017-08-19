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
  const tracksArr = ['./../audio/ovh.mp3', './../audio/drCloseMics.mp3', './../audio/drRoom.mp3', './../audio/bas.mp3', './../audio/gtrRif.mp3', './../audio/gtrS.mp3', './../audio/mainVx.mp3', './../audio/backVx.mp3', './../audio/fx.mp3'];
  const tracksNames = ['DR OVH', 'DRUMS', 'DR ROOM', 'BASS', 'GTR', 'GTR 2', 'VOC', 'VOC 2', 'FX' ];
  const tracksSoloed = [false, false, false, false, false, false, false, false, false];







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

          let faderOffsetTop = 0;


    $fader.forEach( (t,i) => {

      let dragging = false

      $(function () {

          const target = $('.fader').eq(i);
          faderOffsetTop = target.offset().top;


          target.mousedown(function(e) {
              dragging = true
          });

          $(document).mouseup(function(e) {
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


  let masterOffsetTop = 0;



  function MasterFaderMove() {

    let dragging = false

    $(function () {

      masterOffsetTop = $masterFader.offset().top;

        $masterFader.mousedown(function(e) {
            dragging = true
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
    if ( deg > 0 ) {
      tracksGroup.sounds[index].effects[0].pan = Math.round(deg - 40) / 100;
    } else if ( deg < 0 ) {
      tracksGroup.sounds[index].effects[0].pan = Math.round(deg + 40) / 100
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
                var degree = mouse_y - 140;

                if( degree > 140 ) {
                  degree = 140;
                } else if( degree < -140 ) {
                  degree = -140;
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
  const $strip = $('.strip');

  $strip.each( (i,t) => {
    $(t).droppable({
      drop: function( event, ui ) {
        fxCount++;
        $(this).find('.effectBox').append(
            '<button class="' + $(ui.draggable[0]).attr('data-passClass') + ' effectBtn" data-instance=' + fxCount + '>' + $(ui.draggable[0]).attr('data-name') + '</button>'
        );
        faderOffsetTop = faderOffsetTop + 35;
        masterOffsetTop = masterOffsetTop + 35;
      }
    });
  });

    $chooseBtns.each( (i,t) => {
      $(t).draggable({
        containment: 'document',
        scroll: 'true',
        helper: 'clone',
        stack: '.chooseBtn',
        opacity: '0.7',
        zIndex: '100',
        cursorAt: { top: 17.5, left: 70 },
      });
    });








});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWNmY2U1NGI3YWE5YWNiYTY0ZjUiLCJ3ZWJwYWNrOi8vLy4vanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxhQUFhOzs7O0FBSWI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUE7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0I7QUFDbEIsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQSxHQUFHLEVBQUU7Ozs7O0FBS0w7Ozs7QUFJQTs7OztBQUlBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7Ozs7QUFLQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7Ozs7O0FBS0E7O0FBRUE7OztBQUdBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxXQUFXOztBQUVYO0FBQ0E7QUFDQSxXQUFXOzs7QUFHWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsV0FBVzs7QUFFWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWCxPQUFPO0FBQ1AsS0FBSzs7Ozs7O0FBTUw7OztBQUdBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPOzs7O0FBSVA7OztBQUdBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGFBQWE7QUFDYjtBQUNBLE9BQU87Ozs7OztBQU1QOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTs7QUFFQTs7O0FBR0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxPQUFPOztBQUVQOztBQUVBO0FBQ0E7O0FBRUEsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHLE9BQU87Ozs7O0FBS1Y7Ozs7QUFJQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBOzs7O0FBSUE7OztBQUdBOzs7O0FBSUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCxLQUFLO0FBQ0w7O0FBRUE7Ozs7Ozs7QUFPQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBLEdBQUc7Ozs7QUFJSDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7Ozs7QUFLQTs7O0FBR0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNULEtBQUs7QUFDTCxHQUFHOzs7OztBQUtIOztBQUVBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7O0FBRUEsV0FBVzs7QUFFWDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDs7QUFFQSxXQUFXOztBQUVYOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkOztBQUVBLFdBQVc7O0FBRVg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7Ozs7OztBQU1IOzs7OztBQUtBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QyxPQUFPO0FBQ1AsS0FBSzs7Ozs7Ozs7O0FBU0wsQ0FBQyIsImZpbGUiOiIuL2pzL291dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFjZmNlNTRiN2FhOWFjYmE2NGY1IiwiJChmdW5jdGlvbigpeyAvL0RPTUNvbnRlbnRMb2FkZWRcblxuXG5cbi8vIGxvYWRpbmcgdHJhY2tzIGZyb20gYXJyYXlcblxuXG4gIGxldCB0cmFja3NHcm91cCA9IG5ldyBQaXp6aWNhdG8uR3JvdXAoKTtcbiAgbGV0IGNvdW50ZXIgPSAwO1xuICBjb25zdCB0cmFja3NBcnIgPSBbJy4vLi4vYXVkaW8vb3ZoLm1wMycsICcuLy4uL2F1ZGlvL2RyQ2xvc2VNaWNzLm1wMycsICcuLy4uL2F1ZGlvL2RyUm9vbS5tcDMnLCAnLi8uLi9hdWRpby9iYXMubXAzJywgJy4vLi4vYXVkaW8vZ3RyUmlmLm1wMycsICcuLy4uL2F1ZGlvL2d0clMubXAzJywgJy4vLi4vYXVkaW8vbWFpblZ4Lm1wMycsICcuLy4uL2F1ZGlvL2JhY2tWeC5tcDMnLCAnLi8uLi9hdWRpby9meC5tcDMnXTtcbiAgY29uc3QgdHJhY2tzTmFtZXMgPSBbJ0RSIE9WSCcsICdEUlVNUycsICdEUiBST09NJywgJ0JBU1MnLCAnR1RSJywgJ0dUUiAyJywgJ1ZPQycsICdWT0MgMicsICdGWCcgXTtcbiAgY29uc3QgdHJhY2tzU29sb2VkID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdO1xuXG5cblxuXG5cblxuXG4gIHRyYWNrc0Fyci5mb3JFYWNoKCAodCxpKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG5cbiAgICAgICAgc291cmNlOiAnZmlsZScsXG4gICAgICAgIG9wdGlvbnM6IHsgcGF0aDogdCB9XG4gICAgICB9LCBmdW5jdGlvbigpIHtcblxuICAgICAgICBjb25zb2xlLmxvZyhpICsgJyBhdWRpbyBmaWxlIGxvYWRlZCEnKTtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfSk7XG5cbiAgICAgIHRyYWNrc0dyb3VwLmFkZFNvdW5kKHRyYWNrKTtcblxuICAgICAgLy8gY3JlYXRpbmcgY2hhbm5lbCBzdHJpcHNcblxuICAgICAgbGV0IG5ld1N0cmlwID0gJCgnPGRpdiBjbGFzcz1cInN0cmlwXCI+PGRpdiBjbGFzcz1cImVmZmVjdEJveFwiPjxwPkRST1AgRlg8L3A+PC9kaXY+PGRpdiBjbGFzcz1cInBhbkJveFwiPjxkaXYgY2xhc3M9XCJwYW5Lbm9iXCI+PGRpdiBjbGFzcz1cImtub2JNYXJrXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImJ1dHRvbkJveFwiPjxidXR0b24gY2xhc3M9XCJzb2xvXCI+UzwvYnV0dG9uPjxidXR0b24gY2xhc3M9XCJtdXRlXCI+TTwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XCJ0cmFja2JveFwiPjxkaXYgY2xhc3M9XCJ0cmFja1wiPjxkaXYgZGF0YS1pZD0nK2krJyBjbGFzcz1cImZhZGVyJytpKycgZmFkZXJcIj48L2Rpdj48L2Rpdj48L2Rpdj48cCBjbGFzcz1cImxhYmVsXCI+Jyt0cmFja3NOYW1lc1tpXSsnPC9wPjwvZGl2PicpO1xuICAgICAgJCgnLm1hc3RlclN0cmlwJykuYmVmb3JlKG5ld1N0cmlwKTtcblxuICAgICAgdHJhY2sudm9sdW1lID0gMC44O1xuXG5cbiAgfSk7IC8vIGVuZCBvZiBmb3JFYWNoXG5cblxuXG5cbiAgLy8gdm9sdW1lIGZ1bmN0aW9uYWxpdGllc1xuXG5cblxuICAgIGNvbnN0ICRmYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYWRlcicpO1xuXG5cblxuICAgIC8vIGNoZWNrSWZOb3RTb2xvZWQgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gY2hlY2tJZk5vdFNvbG9lZCgpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRyYWNrc1NvbG9lZC5maWx0ZXIoIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFyci5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlO1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBzZXRWb2x1bWUgZnVuY3Rpb25cblxuXG4gICAgZnVuY3Rpb24gc2V0Vm9sdW1lKGluZGV4LCB0aGlzRmFkZXIpIHtcblxuICAgICAgY29uc3QgJG11dGUgPSB0aGlzRmFkZXIucGFyZW50KCkucGFyZW50KCkucHJldigpLmZpbmQoJy5tdXRlJyk7XG5cbiAgICAgIGlmKCAkbXV0ZS5oYXNDbGFzcygnbXV0ZWQnKSApIHtcbiAgICAgICAgbnVsbDtcbiAgICAgIH0gZWxzZSBpZiggdHJhY2tzU29sb2VkW2luZGV4XSB8fCBjaGVja0lmTm90U29sb2VkKCkgKSB7XG4gICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0udm9sdW1lID0gKCBwYXJzZUludCh0aGlzRmFkZXIuY3NzKCd0b3AnKSkgLSAzMTUgKSAvIC0zNTA7XG4gICAgICB9O1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBmYWRlciBtb3ZlbWVudFxuXG4gICAgICAgICAgbGV0IGZhZGVyT2Zmc2V0VG9wID0gMDtcblxuXG4gICAgJGZhZGVyLmZvckVhY2goICh0LGkpID0+IHtcblxuICAgICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICAgJChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSAkKCcuZmFkZXInKS5lcShpKTtcbiAgICAgICAgICBmYWRlck9mZnNldFRvcCA9IHRhcmdldC5vZmZzZXQoKS50b3A7XG5cblxuICAgICAgICAgIHRhcmdldC5tb3VzZWRvd24oZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygndG9wJywgKCBlLnBhZ2VZIC0gZmFkZXJPZmZzZXRUb3ApKTtcbiAgICAgICAgICAgICAgICAgIGlmKCBwYXJzZUludCh0YXJnZXQuY3NzKCd0b3AnKSkgPj0gMzE1ICkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggcGFyc2VJbnQodGFyZ2V0LmNzcygndG9wJykpIDwgLTM1ICkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnLTM1cHgnKTtcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgIHNldFZvbHVtZSggdGFyZ2V0LmRhdGEoJ2lkJyksIHRhcmdldCApO1xuXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBkb3VibGUgY2xpY2sgb24gZmFkZXJcblxuICAgICAgICAgIHRhcmdldC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICggJG11dGUuaGFzQ2xhc3MoJ211dGVkJykgKSB7XG4gICAgICAgICAgICAgIHRhcmdldC5jc3MoJ3RvcCcsICczNXB4Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXQuY3NzKCd0b3AnLCAnMzVweCcpO1xuICAgICAgICAgICAgICBzZXRWb2x1bWUoIHRhcmdldC5kYXRhKCdpZCcpLCB0YXJnZXQgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cblxuXG5cbiAgLy8gc29sbyAmIG11dGVcblxuXG4gICAgLy8gbXV0ZVxuXG5cbiAgICAgIGNvbnN0ICRtdXRlID0gJCgnLm11dGUnKTtcblxuICAgICAgJG11dGUub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICBjb25zdCB0aGlzRmFkZXIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpO1xuXG4gICAgICAgICAgaWYoICEkKHRoaXMpLmhhc0NsYXNzKCdtdXRlZCcpICkge1xuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbXV0ZWQnKTtcbiAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cbiAgICAvLyBzb2xvXG5cblxuICAgICAgY29uc3QgJHNvbG8gPSAkKCcuc29sbycpO1xuXG5cbiAgICAgICRzb2xvLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCAkc2VsZiA9ICQodGhpcyk7XG4gICAgICAgIGxldCBub3RTb2xvZWQgPSB0cnVlO1xuXG4gICAgICAgICAgJHNvbG8uZWFjaCggZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlkID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgaWYoIHNlbGYgPT09IHRoaXMgKSB7XG4gICAgICAgICAgICAgIGlmKCAhJHNlbGYuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldFZvbHVtZSggaWQsIHRoaXNGYWRlciApO1xuICAgICAgICAgICAgICAgICRzZWxmLmFkZENsYXNzKCdzb2xvZWQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnZvbHVtZSA9IDA7XG4gICAgICAgICAgICAgICAgJHNlbGYucmVtb3ZlQ2xhc3MoJ3NvbG9lZCcpO1xuICAgICAgICAgICAgICAgIHRyYWNrc1NvbG9lZFtpZF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmKCAhJCh0aGlzKS5oYXNDbGFzcygnc29sb2VkJykgKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS52b2x1bWUgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9OztcblxuICAgICAgICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ3NvbG9lZCcpICkge1xuICAgICAgICAgICAgICBub3RTb2xvZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmKCBub3RTb2xvZWQgKSB7XG4gICAgICAgICAgICAkc29sby5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICAgY29uc3QgdGhpc0ZhZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKTtcblxuICAgICAgICAgICAgICBzZXRWb2x1bWUoaWQsIHRoaXNGYWRlcik7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICB9KTtcblxuXG5cblxuXG4gIC8vIHRyYW5zcG9ydCB3aW5kb3dcblxuXG4gIC8vIGJ1dHRvbnNcblxuICBjb25zdCAkcGxheUJ0biA9ICQoJyNwbGF5Jyk7XG4gIGNvbnN0ICRwYXVzZUJ0biA9ICQoJyNwYXVzZScpO1xuICBjb25zdCAkc3RvcEJ0biA9ICQoJyNzdG9wJyk7XG4gIGNvbnN0ICRyd0J0biA9ICQoJyNydycpO1xuICBjb25zdCAkZmZCdG4gPSAkKCcjZmYnKTtcbiAgY29uc3QgJHJ3cndCdG4gPSAkKCcjcndydycpO1xuICBjb25zdCAkZmZmZkJ0biA9ICQoJyNmZmZmJyk7XG4gIGNvbnN0ICRsb2FkID0gJCgnI2xvYWQnKTtcbiAgY29uc3QgJGNvbnRhaW5lciA9ICQoJy5jb250YWluZXInKTtcblxuXG5cbiAgLy8gY2hlY2tpbmcgaWYgdHJhY2tzIGFyZSBsb2FkZWRcblxuICBjb25zdCBsb2FkaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCggKCkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZygnQ2hlY2snKTtcblxuXG4gICAgICBpZiggdHJhY2tzQXJyLmxlbmd0aCAhPT0gY291bnRlciApIHsgLy8gdHJhY2tzIGxvYWRlZFxuXG4gICAgICAgIGlmKCAhJGxvYWQuaGFzQ2xhc3MoJ2xvYWRpbmcnKSApIHtcbiAgICAgICAgICAkbG9hZC5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdsb2FkZXInPjwvZGl2PlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgICRsb2FkLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gcGxheVxuXG4gICAgICAgICRwbGF5QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwYXVzZVxuXG4gICAgICAgICRwYXVzZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzdG9wXG5cbiAgICAgICAgJHN0b3BCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAuc3RvcCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZXdpbmQgMTBzZWNcblxuICAgICAgICAkcndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMTBzZWNcblxuICAgICAgICAkZmZCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgKyAxMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA+IDM1MCApIHtcbiAgICAgICAgICAgICAgdC5vZmZzZXRUaW1lID0gMzUwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnBsYXkoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV3aW5kIDMwc2VjXG5cbiAgICAgICAgJHJ3cndCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGF1c2UoKTtcbiAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHMuZm9yRWFjaCggdCA9PiB7XG4gICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSB0Lm9mZnNldFRpbWUgLSAzMFxuICAgICAgICAgICAgaWYoIHQub2Zmc2V0VGltZSA8IDAgKSB7XG4gICAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBmYXN0IGZvcndhcmQgMzBzZWNcblxuICAgICAgICAkZmZmZkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cmFja3NHcm91cC5wYXVzZSgpO1xuICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCB0ID0+IHtcbiAgICAgICAgICAgIHQub2Zmc2V0VGltZSA9IHQub2Zmc2V0VGltZSArIDQwXG4gICAgICAgICAgICBpZiggdC5vZmZzZXRUaW1lID4gMzUwICkge1xuICAgICAgICAgICAgICB0Lm9mZnNldFRpbWUgPSAzNTBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdHJhY2tzR3JvdXAucGxheSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMb2FkaW5nIGJveFxuXG4gICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgJGxvYWQucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgJGxvYWQudGV4dCgnJyk7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwobG9hZGluZ0ludGVydmFsKTtcblxuICAgICAgfTtcbiAgfSwgNTAwKTsgLy8gbG9hZGluZyBjaGVjayBmcmVxdWVuY3lcblxuXG5cblxuICAvLyBtYXN0ZXJmYWRlclxuXG5cblxuICBjb25zdCAkbWFzdGVyRmFkZXIgPSAkKCcubWFzdGVyJyk7XG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWVTdGFydCgpIHtcbiAgICAgIHRyYWNrR3JvdXAudm9sdW1lID0gMC44O1xuICB9O1xuICBzZXRNYXN0ZXJWb2x1bWUoKTtcblxuXG5cblxuICBmdW5jdGlvbiBzZXRNYXN0ZXJWb2x1bWUoKSB7XG4gICAgICB0cmFja3NHcm91cC52b2x1bWUgPSAoIHBhcnNlSW50KCRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcpKSAtIDMxNSApIC8gLTM1MDtcbiAgfTtcblxuXG5cbiAgLy8gbWFzdGVyRmFkZXIgbW92ZW1lbnRcblxuXG4gIGxldCBtYXN0ZXJPZmZzZXRUb3AgPSAwO1xuXG5cblxuICBmdW5jdGlvbiBNYXN0ZXJGYWRlck1vdmUoKSB7XG5cbiAgICBsZXQgZHJhZ2dpbmcgPSBmYWxzZVxuXG4gICAgJChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIG1hc3Rlck9mZnNldFRvcCA9ICRtYXN0ZXJGYWRlci5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgJG1hc3RlckZhZGVyLm1vdXNlZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlKGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsIChlLnBhZ2VZIC0gbWFzdGVyT2Zmc2V0VG9wKSApO1xuICAgICAgICAgICAgICBpZiggcGFyc2VJbnQoJG1hc3RlckZhZGVyLmNzcygndG9wJykpID49IDMxNSApIHtcbiAgICAgICAgICAgICAgICAkbWFzdGVyRmFkZXIuY3NzKCd0b3AnLCAnMzE1cHgnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKCBwYXJzZUludCgkbWFzdGVyRmFkZXIuY3NzKCd0b3AnKSkgPCAtMzUgKSB7XG4gICAgICAgICAgICAgICAgJG1hc3RlckZhZGVyLmNzcygndG9wJywgJy0zNXB4Jyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHNldE1hc3RlclZvbHVtZSgpO1xuXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZG91YmxlIGNsaWNrIG9uIGZhZGVyXG5cbiAgICAgICAgJG1hc3RlckZhZGVyLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRtYXN0ZXJGYWRlci5jc3MoJ3RvcCcsICczNXB4Jyk7XG4gICAgICAgICAgc2V0TWFzdGVyVm9sdW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH07XG5cbiAgTWFzdGVyRmFkZXJNb3ZlKCk7XG5cblxuXG5cblxuXG4gIC8vIHN0ZXJlbyBwYW4gZmVhdXR1cmVzXG5cblxuICAvLyBhZGRpbmcgbmV3IHN0ZXJlb1Bhbm5lciBlZmZlY3QgdG8gZWFjaCB0cmFja1xuXG4gIHRyYWNrc0dyb3VwLnNvdW5kcy5mb3JFYWNoKCAodCwgaSkgPT4ge1xuICAgIHdpbmRvd1snc3RlcmVvUGFubmVyJyArIGldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlN0ZXJlb1Bhbm5lcih7XG4gICAgICAgcGFuOiAwXG4gICAgIH0pO1xuXG4gICAgdC5hZGRFZmZlY3Qod2luZG93WydzdGVyZW9QYW5uZXInICsgaV0pO1xuICB9KTtcblxuXG5cbiAgLy8gZnVuY3Rpb24gc2V0UGFuXG5cblxuICBmdW5jdGlvbiBzZXRQYW4oaW5kZXgsIHRoaXNLbm9iLCBkZWcpIHtcbiAgICBpZiAoIGRlZyA+IDAgKSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gTWF0aC5yb3VuZChkZWcgLSA0MCkgLyAxMDA7XG4gICAgfSBlbHNlIGlmICggZGVnIDwgMCApIHtcbiAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpbmRleF0uZWZmZWN0c1swXS5wYW4gPSBNYXRoLnJvdW5kKGRlZyArIDQwKSAvIDEwMFxuICAgIH0gZWxzZSB7XG4gICAgICB0cmFja3NHcm91cC5zb3VuZHNbaW5kZXhdLmVmZmVjdHNbMF0ucGFuID0gMDtcbiAgICB9O1xuICB9O1xuXG5cblxuXG4gIC8vIHBhbktub2JzIG1vdmVtZW50XG5cblxuICBjb25zdCBwYW5Lbm9icyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5Lbm9iJyk7XG5cbiAgcGFuS25vYnMuZm9yRWFjaCggKHQsaSkgPT4ge1xuXG4gICAgbGV0IGRyYWdnaW5nID0gZmFsc2VcblxuICAgICQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICQoJy5wYW5Lbm9iJykuZXEoaSk7XG5cbiAgICAgICAgdGFyZ2V0Lm1vdXNlZG93bihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICB9KVxuXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZHJhZ2dpbmcpIHtcblxuICAgICAgICAgICAgICAgIHZhciBtb3VzZV95ID0gZS5wYWdlWTtcbiAgICAgICAgICAgICAgICB2YXIgZGVncmVlID0gbW91c2VfeSAtIDE0MDtcblxuICAgICAgICAgICAgICAgIGlmKCBkZWdyZWUgPiAxNDAgKSB7XG4gICAgICAgICAgICAgICAgICBkZWdyZWUgPSAxNDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBkZWdyZWUgPCAtMTQwICkge1xuICAgICAgICAgICAgICAgICAgZGVncmVlID0gLTE0MDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1vei10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAoLSBkZWdyZWUpICsgJ2RlZyknKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0tb3JpZ2luJywgJzUwJSA1MCUnKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuY3NzKCctbXMtdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgKC0gZGVncmVlKSArICdkZWcpJyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICAgICAgc2V0UGFuKGksIHRhcmdldCwgKC0gZGVncmVlKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICB0YXJnZXQub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgMCArICdkZWcpJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctbW96LXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbicsICc1MCUgNTAlJyk7XG4gICAgICAgICAgICB0YXJnZXQuY3NzKCctby10cmFuc2Zvcm0nLCAncm90YXRlKCcgKyAwICsgJ2RlZyknKTtcbiAgICAgICAgICAgIHRhcmdldC5jc3MoJy1vLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybScsICdyb3RhdGUoJyArIDAgKyAnZGVnKScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNzcygnLW1zLXRyYW5zZm9ybS1vcmlnaW4nLCAnNTAlIDUwJScpO1xuXG4gICAgICAgICAgICBzZXRQYW4oaSwgdGFyZ2V0LCAwKTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cblxuXG5cbiAgLy8gZWZmZWN0cyBmdW5jdGlvbmFsaXRpZXNcblxuICBjb25zdCAkbWl4ZXIgPSAkKCcubWl4ZXInKTtcblxuICBsZXQgZnhDb3VudCA9IDA7XG5cblxuICAvLyBocGZcbiAgJG1peGVyLm9uKCdjbGljaycsICcuaHBmJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snaHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5IaWdoUGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMCxcbiAgICAgICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkhpZ2hQYXNzRmlsdGVyKHtcbiAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogNDAwLFxuICAgICAgICAgICAgICAgcGVhazogMyxcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydocGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2hwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH07XG5cbiAgfSk7XG5cbiAgLy8gbHBmXG4gICRtaXhlci5vbignY2xpY2snLCAnLmxwZicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2xwZicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuTG93UGFzc0ZpbHRlcih7XG4gICAgICAgICAgICAgICBmcmVxdWVuY3k6IDQwMDAsXG4gICAgICAgICAgICAgICBwZWFrOiAzLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Mb3dQYXNzRmlsdGVyKHtcbiAgICAgICAgICAgICAgIGZyZXF1ZW5jeTogNDAwMCxcbiAgICAgICAgICAgICAgIHBlYWs6IDMsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snbHBmJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydscGYnICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcblxuICB9KTtcblxuICAvLyBjb21wcmVzc29yXG4gICRtaXhlci5vbignY2xpY2snLCAnLmNvbXByZXNzb3InLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Db21wcmVzc29yKHtcbiAgICAgICAgICAgICAgICB0cmVzaG9sZDogLTMwLFxuICAgICAgICAgICAgICAgIHJhdGlvOiAxMlxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snY29tcHJlc3NvcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5Db21wcmVzc29yKHtcbiAgICAgICAgICAgICAgIHRyZXNob2xkOiAtMzAsXG4gICAgICAgICAgICAgICByYXRpbzogMTJcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93Wydjb21wcmVzc29yJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGZ1enpcbiAgJG1peGVyLm9uKCdjbGljaycsICcuZnV6eicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLlF1YWRyYWZ1enooe1xuICAgICAgICAgICAgICAgIGxvd0dhaW46IDEuMCxcbiAgICAgICAgICAgICAgICBtaWRMb3dHYWluOiAwLjYsXG4gICAgICAgICAgICAgICAgbWlkSGlnaEdhaW46IDAuNzgsXG4gICAgICAgICAgICAgICAgaGlnaEdhaW46IDAuOSxcbiAgICAgICAgICAgICAgICBtaXg6IDEsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2Z1enonICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydmdXp6JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgY29uc3QgaWQgPSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZmFkZXInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUXVhZHJhZnV6eih7XG4gICAgICAgICAgICAgICBsb3dHYWluOiAxLjAsXG4gICAgICAgICAgICAgICBtaWRMb3dHYWluOiAwLjYsXG4gICAgICAgICAgICAgICBtaWRIaWdoR2FpbjogMC43OCxcbiAgICAgICAgICAgICAgIGhpZ2hHYWluOiAwLjksXG4gICAgICAgICAgICAgICBtaXg6IDEsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0uYWRkRWZmZWN0KHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snZnV6eicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBkaXN0b3J0aW9uXG4gICRtaXhlci5vbignY2xpY2snLCAnLmRpc3RvcnRpb24nLCBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiggJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuaGFzQ2xhc3MoJ21hc3RlclN0cmlwJykgKSB7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5EaXN0b3J0aW9uKHtcbiAgICAgICAgICAgICAgICBnYWluOiAxLjAsXG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5yZW1vdmVFZmZlY3Qod2luZG93WydkaXN0b3J0aW9uJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkRpc3RvcnRpb24oe1xuICAgICAgICAgICAgICAgZ2FpbjogMS4wLFxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLmFkZEVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ2Rpc3RvcnRpb24nICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gZmxhbmdlclxuICAkbWl4ZXIub24oJ2NsaWNrJywgJy5mbGFuZ2VyJywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRmxhbmdlcih7XG4gICAgICAgICAgICAgICAgdGltZTogMCxcbiAgICAgICAgICAgICAgICBzcGVlZDogMC4xMyxcbiAgICAgICAgICAgICAgICBkZXB0aDogMC4yNSxcbiAgICAgICAgICAgICAgICBmZWVkYmFjazogMC44LFxuICAgICAgICAgICAgICAgIG1peDogMC4yNVxuICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5hZGRFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZmxhbmdlcicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSA9IG5ldyBQaXp6aWNhdG8uRWZmZWN0cy5GbGFuZ2VyKHtcbiAgICAgICAgICAgICAgdGltZTogMCxcbiAgICAgICAgICAgICAgc3BlZWQ6IDAuMTMsXG4gICAgICAgICAgICAgIGRlcHRoOiAwLjI1LFxuICAgICAgICAgICAgICBmZWVkYmFjazogMC44LFxuICAgICAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5yZW1vdmVFZmZlY3Qod2luZG93WydmbGFuZ2VyJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIGRlbGF5XG4gICRtaXhlci5vbignY2xpY2snLCAnLmRlbGF5JywgZnVuY3Rpb24oZSkge1xuXG4gICAgaWYoICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmhhc0NsYXNzKCdtYXN0ZXJTdHJpcCcpICkge1xuXG4gICAgICAgICAgaWYoICEkKGUudGFyZ2V0KS5oYXNDbGFzcygnZWZmZWN0T24nKSApIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldID0gbmV3IFBpenppY2F0by5FZmZlY3RzLkRlbGF5KHtcbiAgICAgICAgICAgICAgICBmZWVkYmFjazogMC4zLFxuICAgICAgICAgICAgICAgIHRpbWU6IDAuMjUsXG4gICAgICAgICAgICAgICAgbWl4OiAwLjI1XG4gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLmFkZEVmZmVjdCh3aW5kb3dbJ2RlbGF5JyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBjb25zdCBpZCA9ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5mYWRlcicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICBpZiggISQoZS50YXJnZXQpLmhhc0NsYXNzKCdlZmZlY3RPbicpICkge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgd2luZG93WydkZWxheScgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuRGVsYXkoe1xuICAgICAgICAgICAgICBmZWVkYmFjazogMC4zLFxuICAgICAgICAgICAgICB0aW1lOiAwLjI1LFxuICAgICAgICAgICAgICBtaXg6IDAuMjVcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydkZWxheScgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ2VmZmVjdE9uJyk7XG5cbiAgICAgICAgICAgIHRyYWNrc0dyb3VwLnNvdW5kc1tpZF0ucmVtb3ZlRWZmZWN0KHdpbmRvd1snZGVsYXknICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH07XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gcmV2ZXJiXG4gICRtaXhlci5vbignY2xpY2snLCAnLnJldmVyYicsIGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmKCAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5oYXNDbGFzcygnbWFzdGVyU3RyaXAnKSApIHtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUmV2ZXJiKHtcbiAgICAgICAgICAgICAgICB0aW1lOiAxLjgsXG4gICAgICAgICAgICAgICAgZGVjYXk6IDMsXG4gICAgICAgICAgICAgICAgbWl4OiAwLjdcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuYWRkRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5yZW1vdmVDbGFzcygnZWZmZWN0T24nKTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAucmVtb3ZlRWZmZWN0KHdpbmRvd1sncmV2ZXJiJyArICQodGhpcykuYXR0cignZGF0YS1pbnN0YW5jZScpXSk7XG5cbiAgICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICAgIGNvbnN0IGlkID0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmZhZGVyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgIGlmKCAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2VmZmVjdE9uJykgKSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0gPSBuZXcgUGl6emljYXRvLkVmZmVjdHMuUmV2ZXJiKHtcbiAgICAgICAgICAgICAgIHRpbWU6IDEuOCxcbiAgICAgICAgICAgICAgIGRlY2F5OiAzLFxuICAgICAgICAgICAgICAgbWl4OiAwLjdcbiAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdHJhY2tzR3JvdXAuc291bmRzW2lkXS5hZGRFZmZlY3Qod2luZG93WydyZXZlcmInICsgJCh0aGlzKS5hdHRyKCdkYXRhLWluc3RhbmNlJyldKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdlZmZlY3RPbicpO1xuXG4gICAgICAgICAgICB0cmFja3NHcm91cC5zb3VuZHNbaWRdLnJlbW92ZUVmZmVjdCh3aW5kb3dbJ3JldmVyYicgKyAkKHRoaXMpLmF0dHIoJ2RhdGEtaW5zdGFuY2UnKV0pO1xuXG4gICAgICAgICAgfTtcbiAgICB9O1xuICB9KTtcblxuXG5cblxuXG4gIC8vIGVmZmVjdHMgZHJhZyAmIGRyb3BcblxuXG5cblxuICBjb25zdCAkY2hvb3NlQnRucyA9ICQoJy5jaG9vc2VCdG4nKTtcbiAgY29uc3QgJHN0cmlwID0gJCgnLnN0cmlwJyk7XG5cbiAgJHN0cmlwLmVhY2goIChpLHQpID0+IHtcbiAgICAkKHQpLmRyb3BwYWJsZSh7XG4gICAgICBkcm9wOiBmdW5jdGlvbiggZXZlbnQsIHVpICkge1xuICAgICAgICBmeENvdW50Kys7XG4gICAgICAgICQodGhpcykuZmluZCgnLmVmZmVjdEJveCcpLmFwcGVuZChcbiAgICAgICAgICAgICc8YnV0dG9uIGNsYXNzPVwiJyArICQodWkuZHJhZ2dhYmxlWzBdKS5hdHRyKCdkYXRhLXBhc3NDbGFzcycpICsgJyBlZmZlY3RCdG5cIiBkYXRhLWluc3RhbmNlPScgKyBmeENvdW50ICsgJz4nICsgJCh1aS5kcmFnZ2FibGVbMF0pLmF0dHIoJ2RhdGEtbmFtZScpICsgJzwvYnV0dG9uPidcbiAgICAgICAgKTtcbiAgICAgICAgZmFkZXJPZmZzZXRUb3AgPSBmYWRlck9mZnNldFRvcCArIDM1O1xuICAgICAgICBtYXN0ZXJPZmZzZXRUb3AgPSBtYXN0ZXJPZmZzZXRUb3AgKyAzNTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgICAkY2hvb3NlQnRucy5lYWNoKCAoaSx0KSA9PiB7XG4gICAgICAkKHQpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiAnZG9jdW1lbnQnLFxuICAgICAgICBzY3JvbGw6ICd0cnVlJyxcbiAgICAgICAgaGVscGVyOiAnY2xvbmUnLFxuICAgICAgICBzdGFjazogJy5jaG9vc2VCdG4nLFxuICAgICAgICBvcGFjaXR5OiAnMC43JyxcbiAgICAgICAgekluZGV4OiAnMTAwJyxcbiAgICAgICAgY3Vyc29yQXQ6IHsgdG9wOiAxNy41LCBsZWZ0OiA3MCB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG5cblxuXG5cblxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2pzL2FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9