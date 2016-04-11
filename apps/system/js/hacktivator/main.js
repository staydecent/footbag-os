window.addEventListener('online', function() {
  var URL = "https://hooks.slack.com/services/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";
  
  var MESSAGES = [
    "Stop what you're doing, it's time to hack. @channel",
    "You're getting fat. :hackysack: @channel",
    ":hackysack: @channel"
  ];
  
  var STATES = {
    'WAITING':    'WAITING', // For 1st time hack is placed down
    'CHILLING':   'CHILLING', // Hack is chilling
    'BUFFERING':  'BUFFERING', // Hack is remove, but giving 15 seconds grace period
    'HACKING':    'HACKING' // we be hacking
  };

  var intervalID = undefined;
  var timer = 0;
  var bufferTime = 15;
  var bufferStrTemplate = 'Starting hack session in 15s ...';

  var hackElm = document.getElementById('hacktivator');
  var store = atom(newState => newState, '');

  store.subscribe(function() {
    console.log('state', store.getState());
    document.body.className = store.getState().toLowerCase();

    switch (store.getState()) {
      case STATES.WAITING:
        hackElm.textContent = 'Waiting for hackysack';
        break;

      case STATES.CHILLING:
        hackElm.textContent = 'ZzZz';
        break;

      case STATES.BUFFERING:
        hackElm.textContent = bufferStrTemplate;
        break;

      case STATES.HACKING:
        hackElm.textContent = 'Hack session is in progress!';
        break;
    }
  });

  store.dispatch(STATES.WAITING);

  window.addEventListener('userproximity', proximity);

  function proximity(ev) {
    if (ev.near) {
      console.log('[Hacktivator] near', ev);
      navigator.vibrate(200);
      
      // If BUFFERING intervalID is running, clear it
      if (intervalID !== undefined) {
        window.clearTimeout(intervalID);
        intervalID = undefined;
        timer = 0;
      }

      // Hack session is over, should we do something?
      if (store.getState() === STATES.HACKING) {
        console.log('[Hacktivator] Hack session completed!');
      }
      
      store.dispatch(STATES.CHILLING);
    } else {
      console.log('[Hacktivator] far', ev);

      // If hack is chilling, it's now been removed! Start session.
      if (store.getState() === STATES.CHILLING) {
        store.dispatch(STATES.BUFFERING);
        intervalID = window.setInterval(countdown, 1000);
      } 
    }
  }

  function countdown() {
    if (timer >= bufferTime) {
      startHackSession();
      window.clearInterval(intervalID);
      intervalID = undefined;
    } else {
      timer = timer + 1;
      console.log('[Hacktivator] countdown', timer);
      hackElm.textContent = bufferStrTemplate.replace('15', bufferTime - timer);
    }
  }

  function startHackSession() {
    var payload = {
      "text": _.shuffle(MESSAGES).pop(),
      "channel": "#hack",
      "username": "hacktivator",
      "icon_emoji": ":hackysack:",
      "link_names": 1
    };

    console.log('payload', payload);

    reqwest({
      method: "post",
      url: URL,
      data: JSON.stringify(payload),
      type: 'json',
      crossOrigin: true,
      complete: function(resp) {
        store.dispatch(STATES.HACKING);
        console.log('FootBag success!', resp);
      }
    });
  }

  console.log('Starting Hacktivator');
});
