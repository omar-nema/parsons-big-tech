var status = true;

chrome.runtime.onInstalled.addListener(function(e){

    chrome.storage.local.set({scrollArray: []});
    chrome.storage.sync.set({pageVisted: false});

    //clicking browser action button will change icon, and transmit msg to content script to add remove styles depending on whether enabled or disabled
    chrome.pageAction.onClicked.addListener(function (tab) {
      if (status == 'true'){
        status = false;
        chrome.pageAction.setIcon({path: "./icon_16px_disable.png", tabId: tab.id});
      } 
      else {
        status = true;
        chrome.pageAction.setIcon({path: "./icon_16px_enable.png", tabId: tab.id});
      }
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.pageAction.hide(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {status: status});
      });
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.status == "getStatus")
        sendResponse({status: status});
  });

  ///don't need permissions if on instagram.com
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: 
          [
          new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {hostEquals: 'www.instagram.com', schemes:['https']},
          })
          ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }])
    });

});