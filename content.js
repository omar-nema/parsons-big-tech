
var startTime = Date.now();


console.log('INJECT ME BABY')

var scrollListener = function(e) {

    chrome.storage.local.get('scrollArray',  function(data) {

        var scrollObj;
        if (data.scrollArray.length > 0){
            scrollObj = {"scrollPos": window.scrollY, "timestamp": Date.now(), "elapsedTime": Date.now() - data.scrollArray[0].timestamp};
        } else {
            scrollObj = {"scrollPos": window.scrollY, "timestamp": Date.now(), "elapsedTime": 0};
        }
        data.scrollArray.push(scrollObj);
        chrome.storage.local.set({"scrollArray": data.scrollArray});


    })
   
};





//start timer

document.addEventListener('scroll', scrollListener, true);

