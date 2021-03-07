var status = true;

chrome.runtime.onInstalled.addListener(function(){

    chrome.storage.local.set({scrollArray: []});
    chrome.storage.sync.set({pageVisted: false});

    //clicking browser action button will change icon, and transmit msg to content script to add remove styles depending on whether enabled or disabled
    chrome.browserAction.onClicked.addListener(function (tab) {
      if (status == 'true'){
        status = false;
        chrome.browserAction.setIcon({path: "./icon_16px_disable.png"});
      } 
      else{
        status = true;
        chrome.browserAction.setIcon({path: "./icon_16px_enable.png"});
      }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {status: status});
      });
      
     
  });

  //send extension status on request
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.status == "getStatus")
        sendResponse({status: status});
  });


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