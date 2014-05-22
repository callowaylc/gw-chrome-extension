function determine_url_from(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function random_uri() {
  return "http://www.elmundodigital.net?xyz"
}

function random_timeout() {
  var max = 90
  var min = 10

  return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000
}


// set random weighted user agent
//navigator.__defineGetter__('userAgent', function(){
//  return ""
//});


// on window create (or browser start) we open tab to pm receiver
//chrome.windows.onCreated.addListener(function(w) {
chrome.windows.getAll({ "populate": true  }, function(windows) { 
    w = windows.pop()
    //return
    //chrome.tabs.query({'active': true}, function(tabs) {
    //setTimeout(function() { 
    //chrome.windows.get(w.id, { "populate": true }, function(w) {
      chrome.tabs.update(w.tabs[0].id, { "url": random_uri() })

      f = function(tab_id) {
        // set a random number of page visits
        var counter     = 0
        var page_visits = Math.floor((Math.random()*6)+2)

        // set random user agents 
        // PASS

        // set random timeout
        reload_tab = function(wait, tab_id) {
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
         
          setTimeout(function() {  
            chrome.tabs.reload(tab_id, { }, function() { })

            setTimeout(function() { 
              reload_tab(random_timeout(), tab_id)

            }, wait)
          }, 1000)
        }

        reload_tab(random_timeout(), tab_id)
      }
      //alert(w.tabs[0].id)
      f(w.tabs[0].id)

    //})
    //}, 5000)
    //win.tabs.update(0, {url: 'http://www.elmundodigital.net'});
  //});

})
