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

      let newStrip = $('<div class="strip"><div class="effectBox"><p>DROP FX HERE</p></div><div class="panBox"><div class="panKnob"><div class="knobMark"></div></div></div><div class="buttonBox"><button class="solo">S</button><button class="mute">M</button></div><div class="trackbox"><div class="track"><div data-id='+i+' class="fader'+i+' fader"></div></div></div><p class="label">'+tracksNames[i]+'</p></div>');
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

let faderOffsetTop = $($fader).offset().top ;



    $fader.forEach( (t,i) => {

      let dragging = false

      $(function () {

          const target = $('.fader').eq(i);

          target.mousedown(function() {
              dragging = true
          });

          $(document).mouseup(function() {
              dragging = false
          });

          $(document).mousemove(function(e) {
              if (dragging) {

                target.css('top', (e.pageY - faderOffsetTop));
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
      trackGroup.volume = 0.8;
  };
  setMasterVolume();




  function setMasterVolume() {
      tracksGroup.volume = ( parseInt($masterFader.css('top')) - 315 ) / -350;
  };



  // masterFader movement




let masterOffsetTop = $masterFader.offset().top ;


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
              faderOffsetTop = faderOffsetTop + 35 ;
              masterOffsetTop = masterOffsetTop + 35 ;
              $(this).find('.effectBox').append(
                '<button class="' + target.attr('data-passClass') + ' effectBtn" data-instance=' + fxCount + '>' + target.attr('data-name') + '</button>'
              );
            };

            dragging = false

        });
    });
  });










});
