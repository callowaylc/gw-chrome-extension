function determine_url_from(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function random_uri() {
  return "http://www.showbizdaily.net/"
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

chrome.webRequest.onBeforeSendHeaders.addListener(function(data) {

  if ( data.url == random_uri() ) {
    var xdata=data.requestHeaders;

    xdata.push({
      "name":  "x-forwarded-scheme",
      "value": "http"
    })  

    return { requestHeaders: xdata };
  }
}, { //Filter
    urls: ["<all_urls>"]
     //For testing purposes
},[ "blocking", "requestHeaders" ]);

// on window create (or browser start) we open tab to pm receiver
//chrome.windows.onCreated.addListener(function(w) {
chrome.windows.getAll({ "populate": true  }, function(windows) { 
  w = windows.pop()

  chrome.tabs.update(w.tabs[0].id, { "url": random_uri() }, function(tab) {
    // ensure tab is currently displaying
    chrome.tabs.get(tab_id, function(tab) {
      if (tab.url != random_uri()) {
        // close tab window
        //chrome.windows.remove(tab.windowId, function() { })
      }
    })     
  })

  f = function(tab_id) {
    // set a random number of page visits
    var counter     = 0
    var page_visits = Math.floor((Math.random()*5)+1)

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
  f(w.tabs[0].id)



})
