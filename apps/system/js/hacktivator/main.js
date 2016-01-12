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

  var store = atom((newState) => {newState}, STATES.WAITING);
  var timer = undefined;
  var hackElm = document.getElementById('hacktivator');

  hackElm.textContent = 'Waiting for hackysack';
  window.addEventListener('userproximity', proximity);


  function proximity(ev) {
    if (ev.near) {
      console.log('[Hacktivator] near', ev);
      navigator.vibrate(200);
      
      // If BUFFERING timer is running, clear it
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
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
        timer = window.setTimeout(startHackSession, 15000);
      } 
    }
  }

  function startHackSession() {
    var payload = {
      "text": _.shuffle(MESSAGES).pop(),
      "channel": "#hack",
      "username": "hacktivator",
      "icon_emoji": ":hackysack:",
      "link_names": 0
    };

    console.log('payload', payload);

    reqwest({
      method: "post",
      url: URL,
      data: JSON.stringify(payload),
      type: 'json',
      crossOrigin: true,
      error: function(err) {
        console.error('FootBag err', err);
      },
      success: function(resp) {
        store.dispatch(STATES.HACKING);
        console.log('FootBag success!', resp);
      }
    });
  }

  console.log('Starting Hacktivator');
});
