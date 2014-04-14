function determine_url_from(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function random_uri() {
  return "http://www.elmundodigital.net?xyz"
}


// set random weighted user agent
//navigator.__defineGetter__('userAgent', function(){
//  return ""
//});


// on window create (or browser start) we open tab to pm receiver
chrome.windows.onCreated.addListener(function(w) {
  //chrome.tabs.query({'active': true}, function(tabs) {
    //setTimeout(function() { 
    chrome.windows.get(w.id, { "populate": true }, function(w) {
      chrome.tabs.update(w.tabs[0].id, { "url": random_uri() })

      f = function(tab_id) {
        // set a random number of page visits
        var counter     = 0
        var page_visits = Math.floor((Math.random()*6)+2)

        // set random user agent 

        setInterval(function() {

          // if we have iterated 7 times, or this is the first
          // instance, then 
          if (counter++ % page_visits === 0) {
            chrome.cookies.getAll({}, function(cookies) {
              for(var i = 0; i < cookies.length; i++) {
                chrome.cookies.remove({
                  url:  determine_url_from(cookies[i]),
                  name: cookies[i].name
                
                }, function(details) { })
              }
            })           
          }

          chrome.tabs.reload(tab_id, { }, function() { })

        }, 10000)
      }
      f(w.tabs[0].id)

    })
    //}, 5000)
    //win.tabs.update(0, {url: 'http://www.elmundodigital.net'});
  //});

})
