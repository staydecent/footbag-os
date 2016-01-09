window.addEventListener('online', function() {
  window.footbagSensor = {
    url: "https://hooks.slack.com/services/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",
    messages: [
      "Stop what you're doing, it's time to hack. @channel",
      "You're getting fat. :hackysack: @channel",
      ":hackysack: @channel"
    ],

    start: function() {
      var debounced = _.debounce(this.proximity.bind(this), 500);
      window.addEventListener('userproximity', debounced);
      console.log('[FootbagSensor] Started!');
    },

    proximity: function(e) {
      if (e.near) {
        console.log('[FootbagSensor] near', e);
        navigator.vibrate(200);
      } else {
        console.log('[FootbagSensor] far', e);

        var payload = {
          "text": _.shuffle(this.messages).pop(),
          "channel": "#hack",
          "username": "hacktivator",
          "icon_emoji": ":hackysack:",
          "link_names": 0
        };

        console.log('payload', payload);

        reqwest({
          method: "post",
          url: this.url,
          data: JSON.stringify(payload),
          type: 'json',
          crossOrigin: true,
          error: function(err) {
            console.error('FootBag', err);
          },
          success: function(resp) {
            console.log('FootBag success!', resp);
          }
        });
      }
    },

    stop: function() {
      window.removeEventListener('userproximity', this.proximity);
    }
  };
  
  console.log('Starting FootbagSensor');
  window.footbagSensor.start();
});
