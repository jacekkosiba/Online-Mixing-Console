$(function(){ //DOMContentLoaded



// loading tracks from array

  let tracksGroup = new Pizzicato.Group();
  let counter = 0;
  const tracksArr = ['./../audio/BP/DRUMS.wav', './../audio/BP/BASS.wav', './../audio/BP/GTR.wav', './../audio/BP/VOC.wav'];
  const tracksNames = ['DRUMS', 'BASS', 'GTR', 'VOC'];



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

      let newStrip = $('<div class="strip"><div class="buttonBox"><button class="solo">S</button><button class="mute">M</button></div><div class="trackbox"><div class="track"><div data-id='+i+' class="fader'+i+' fader"></div></div></div><p class="label">'+tracksNames[i]+'</p></div>');
      $('.masterStrip').before(newStrip);

      track.volume = 0.6999;


  }); // end of forEach




  // volume functionalities



    const $fader = $('.fader');


    function setVolume(index, thisFader) {
        tracksGroup.sounds[index].volume = ( parseInt(thisFader.css('top')) - 315 ) / -350;
    };


    $fader.on('mousemove', function(e) {

        e.preventDefault();

        const $mute = $(this).parent().parent().prev().find('.mute');

        if ( $mute.hasClass('muted') ) {
          console.log('track is muted');
        } else {
          if( e.buttons === 1 ) {
            $(this).css('top', e.pageY - 130);
            if( parseInt($(this).css('top')) >= 315 ) {
              $(this).css('top', '315px');
            } else if( parseInt($(this).css('top')) < -35 ) {
              $(this).css('top', '-35px');
            };
         };
         setVolume( $(this).data('id'), $(this) );
       };

    });


    // double click on fader

    $fader.on('dblclick', function() {
        if ( $mute.hasClass('muted') ) {
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



      const $solo = $('.solo');

      $solo.on('click', function() {

          const id = $(this).parent().parent().find('.fader').data('id');

          if( !$(this).hasClass('soloed') ) {
            tracksGroup.sounds.forEach( (t,i) => {
              if( i !== id ) {
                t.volume = 0;
              };
            });
            $(this).addClass('soloed');
          } else {
            tracksGroup.sounds.forEach( (t,i) => {
              if( i !== id ) {
                setVolume(i, $(this) );
              };
            });
            $(this).removeClass('soloed');
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
        $masterFader.css('top', e.pageY - 130);
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


  //




















});
