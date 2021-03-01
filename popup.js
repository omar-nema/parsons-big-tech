var bkg = chrome.extension.getBackgroundPage();

let startRec  = document.getElementById('startRec');
startRec.onclick = function(e){

    chrome.storage.local.set({scrollArray: []});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: "./content.js"});
      });
}

let playbtn  = document.getElementById('play');
playbtn.onclick = function(e){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: "./playrec.js"});
      });
}

//content script writes directly to normal log
//popup and be inspected on its own or in tandem with background script