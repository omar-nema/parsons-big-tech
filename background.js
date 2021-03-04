chrome.runtime.onInstalled.addListener(function(){

    chrome.storage.local.set({scrollArray: []});
    chrome.storage.sync.set({pageVisted: false});

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: 
            [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.instagram.com', schemes:['https']},
            })
            ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });


});



//to see what's stored: window.localStorage

