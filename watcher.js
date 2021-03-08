var mainCont = document.querySelector('#react-root');
var mainShell = document.querySelector('main');
var pageState = 'intro';
var emulationStop = false; 

//watch for message if extension is enabled or disabled
//depending on msg, enable or disable styles
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if (request.status == 'true'){
        console.log('enabled')
        insertStyles();
    } else {
        console.log('disabled')
        removeStyles();
    }
  });

  initScript();
  var link = document.createElement("link");
  insertStyles();

  function insertStyles() {
    // var head = document.head;
    link.type = "text/css";
    link.rel = "stylesheet";
    //link.href = 'watcherStyles.css';
    link.href = chrome.extension.getURL("watcherStyles.css");
    document.getElementsByTagName("head")[0].appendChild(link);
    //head.appendChild(link);
  }

  function removeStyles(){
    document.getElementsByTagName("head")[0].removeChild(link);
  }

  function initScript(){
    waitForElm('nav').then(e => {
        mainCont.className = 'inactive';
        initIntroModal();
        initHeaderActions();
        chrome.storage.sync.get(['pageVisited'], function(p){
            adjustUI();
        }); 
    });
  }
 

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function initIntroModal(){
    //intro modal
    let introCont = document.createElement('div');
    introCont.className = 'intro inactive';
    introCont.innerHTML = '<div class="headerCustom">Instagram Mirror</div><div class="subhead">Watch yourself browse Instagram.</div>';
    document.querySelector('body').appendChild(introCont);
  
    let recordBtn = document.createElement('div');
    recordBtn.innerHTML = '<div class="startScroll">Start Browsing</div>';
    introCont.appendChild(recordBtn);
    recordBtn.onclick = function(e){
        pageState = 'watching';
        adjustUI();
        chrome.storage.local.set({"scrollArray": []});
        document.addEventListener('scroll', scrollListener, true);
    }
    document.querySelector('.intro').className = 'intro';
}

function initHeaderActions(){

    let headerCont = document.createElement('div');
    headerCont.className = "headerCont";
    mainCont.appendChild(headerCont);

    let headerDec = document.createElement('div');
    headerDec.className = "headerDec";
    headerDec.innerHTML = '<div>Instagram Mirror</div>';
    headerCont.appendChild(headerDec);

    let headerHolder = document.createElement('div');
    headerHolder.className = "headerHolder";
    headerCont.appendChild(headerHolder);
 
    let btnReplay = document.createElement('div');
    btnReplay.className = "btnReplay headerFloat hidden";
    btnReplay.innerHTML = '<div>Replay</div>';
    btnReplay.onclick = function(e){
        emulationStop = true;
        //chrome.storage.sync.set({pageVisited: true});
        scrollEmulation();
    }
    headerHolder.appendChild(btnReplay);

    let btnNewSesh = document.createElement('div');
    btnNewSesh.className = "btnNew headerFloat hidden";
    btnNewSesh.innerHTML = '<div>New Session</div>';
    btnNewSesh.onclick = function(e){
        chrome.storage.local.set({"scrollArray": []});
        location.reload();
    }
    headerHolder.appendChild(btnNewSesh);

    let playBtn = document.createElement('div');
    playBtn.className = "startPlay disabled headerFloat";
    playBtn.innerHTML = '<div>Done Browsing</div>';
    playBtn.onclick = function(e){
        pageState = 'playing';
        adjustUI();
        scrollEmulation();
    }
    headerHolder.appendChild(playBtn);



    let playFeedback = document.createElement('div');
    playFeedback.className = "playFeedback hidden";
    playFeedback.innerHTML = '<div>Playing back your browsing session</div>';
    mainCont.appendChild(playFeedback);

    let helpBtn = document.createElement('div');
    helpBtn.className = "helpBtn headerFloat";
    helpBtn.innerHTML = '<div>?</div>';
    headerCont.appendChild(helpBtn);

    let helpTip = document.createElement('div');
    helpTip.className = "helpTip";

    mainCont.appendChild(helpTip);

    helpBtn.onclick = function(e){
        if (this.classList.contains('active')){
            this.classList.remove('active');
            helpTip.className = 'helpTip'
        } else {
            this.classList.add('active');
            helpTip.className = 'helpTip show'
            if (pageState =='watching'){
                helpTip.innerHTML = "<div>Your scrolling activity is currently being watched. After clicking the 'Done Browsing' button in the header, your scrolling activity will be played back to you.</div>";
            } else {
                helpTip.innerHTML = "<div>Watch your browsing session. Click 'replay' to play session from the start. 'New session' will refresh your browser and allow you to record a new session.</div>";
            }
            setTimeout(function(){
                helpTip.className = 'helpTip';
                helpBtn.classList.remove('active');     
            }, 5000)
        }
    }

}


async function adjustUI(){
  
    if (pageState == 'intro'){
        document.querySelector('.intro').className = 'intro';
        mainCont.classList.remove('inactive');
        mainCont.classList.add('inactive');
    } else if (pageState =='watching'){
        document.querySelector('.intro').className = 'intro inactive';
        mainCont.classList.remove('inactive');
        document.querySelector('.startPlay').classList.remove('hidden');
    } else if (pageState == 'playing'){
        var playfeedback = document.querySelector('.playFeedback');
        playfeedback.classList.remove('hidden');
        setTimeout(function(){playfeedback.classList.add('hidden')}, 3000)
        document.querySelector('.startPlay').classList.add('hidden');
        document.querySelector('.btnReplay').classList.remove('hidden');
        document.querySelector('.btnNew').classList.remove('hidden');
    }
}

var scrollListener = function(e) {
    chrome.storage.local.get('scrollArray',  function(data) {
        var scrollObj;
        if (data.scrollArray.length > 0){
            document.querySelector('.startPlay').classList.remove('disabled');
            scrollObj = {"scrollPos": window.scrollY, "timestamp": Date.now(), "elapsedTime": Date.now() - data.scrollArray[0].timestamp};
        } else {
            scrollObj = {"scrollPos": window.scrollY, "timestamp": Date.now(), "elapsedTime": 0};
        }
        data.scrollArray.push(scrollObj);
        chrome.storage.local.set({"scrollArray": data.scrollArray});
        // console.log(data.scrollArray)
    })
};

function scrollEmulation(){
    
    mainShell.classList.add('inactive');
    document.removeEventListener('scroll', scrollListener, true);
    chrome.storage.local.get('scrollArray',  localData => {

        //requires promises
        window.scrollTo(0, localData.scrollArray[0].scrollPos);
  
        localData.scrollArray.forEach( async (s, i) => {
          
            await window.setTimeout(function(){
                window.scrollTo({top: s.scrollPos,behavior: 'smooth'});
                if (i == localData.scrollArray.length-1){
                    mainShell.classList.remove('inactive');
                };
            }, s.elapsedTime);

         
          
        });  
    })
}