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
waitForElm('nav').then(e => {
    console.log('yeaabb')
    initElements();
});

var mainCont = document.querySelector('#react-root');

function createIntroModal(){
    //intro modal
    let introCont = document.createElement('div');
    introCont.className = 'intro';
    introCont.innerHTML = '<div class="headerCustom">Disembodied Instagram Extension</div><div class="subhead">Watch yourself browse Instagram.</div>';
    document.querySelector('body').appendChild(introCont);
    showIntro();

    let recordBtn = document.createElement('div');
    recordBtn.innerHTML = '<div class="startScroll">Start Browsing</div>';
    introCont.appendChild(recordBtn);
    recordBtn.onclick = function(e){
        hideIntro();
        chrome.storage.local.set({"scrollArray": []});
        document.addEventListener('scroll', scrollListener, true);
    }
    document.querySelector('.intro').className = 'intro';
}

function createHeaderActions(){
    let recInd = document.createElement('thing');
    recInd.className = 'recInd';
    recInd.innerHTML = 'Recording...'
    document.querySelectorAll('nav')[0].appendChild(recInd);

    let headerDec = document.createElement('div');
    headerDec.className = "headerDec headerFloat";
    headerDec.innerHTML = '<div>Disembodied Browsing</div>';
    mainCont.appendChild(headerDec);

    let btnStop = document.createElement('div');
    btnStop.className = "btnStop headerFloat hidden";
    btnStop.innerHTML = '<div>Stop Watching</div>';
    mainCont.appendChild(btnStop);

    let btnReplay = document.createElement('div');
    btnReplay.className = "btnReplay headerFloat hidden";
    btnReplay.innerHTML = '<div>Replay</div>';
    mainCont.appendChild(btnReplay);

    let btnNewSesh = document.createElement('div');
    btnNewSesh.className = "btnNewSesh headerFloat hidden";
    btnNewSesh.innerHTML = '<div>New Session</div>';
    mainCont.appendChild(btnNewSesh);

    let playBtn = document.createElement('div');
    playBtn.className = "startPlay headerFloat";
    playBtn.innerHTML = '<div>Done Browsing</div>';
    playBtn.onclick = function(e){
        document.querySelectorAll('nav').forEach(d=> {d.classList.add('collapse')});
        // document.querySelector('.helpBtn').classList.add('hide');
        // document.querySelector('.startPlay').classList.add('hide');
        scrollEmulation();
    }
    mainCont.appendChild(playBtn);
}

function createHeaderHelper(){
    let helpBtn = document.createElement('div');
    helpBtn.className = "helpBtn headerFloat";
    helpBtn.innerHTML = '<div>?</div>';
    helpBtn.onclick = function(e){
        if (this.classList.contains('active')){
            this.className = 'helpBtn'
            document.querySelector('.helpTip').className = 'helpTip'
        } else {
            this.className = 'helpBtn active'
            document.querySelector('.helpTip').className = 'helpTip show'
            setTimeout(function(){
                document.querySelector('.helpTip').className = 'helpTip';
                helpBtn.className = 'helpBtn'       
            }, 5000)
        }
    }
    mainCont.appendChild(helpBtn);

    let helpTip = document.createElement('div');
    helpTip.className = "helpTip";
    helpTip.innerHTML = "<div>Your scrolling activity is currently being watched. After clicking the 'Done Browsing' button in the header, your scrolling activity will be played back to you.</div>";
    mainCont.appendChild(helpTip);
}

function initElements(){
    mainCont.className = 'inactive';

    createIntroModal();
    createHeaderActions();
    createHeaderHelper();
 

}

function showIntro(){
    document.querySelector('.intro').className = 'intro';
    mainCont.classList.remove('inactive');
    mainCont.classList.add('inactive');
}
function hideIntro(){
    document.querySelector('.intro').className = 'intro inactive';
    mainCont.classList.remove('inactive');
}


var mainShell = document.querySelector('main');

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

        //console.log(data.scrollArray)

    })
   
};



function scrollEmulation(){
    
    document.querySelector('main').classList.add('inactive');

    document.removeEventListener('scroll', scrollListener, true);
    chrome.storage.local.get('scrollArray',  localData => {

        console.log('running emulation');

        //requires promises
        window.scrollTo(0, localData.scrollArray[0].scrollPos);
  
        localData.scrollArray.forEach( async (s, i) => {
            await setTimeout(function(){
                // window.scrollTo(0, s.scrollPos)

                //mainCont.scrollTop = s.scrollPos;

                window.scrollTo({
                    top: s.scrollPos,
                    behavior: 'smooth',
                })
            }, s.elapsedTime)
        });  
    })
}










//start timer





// let recordBtn = document.createElement('div');
// recordBtn.className = "startScroll";
// recordBtn.innerHTML = '<div>Record</div>';
// recordBtn.onclick = function(e){
//     document.addEventListener('scroll', scrollListener, true);
// }

// document.querySelector('body').appendChild(recordBtn);


// document.addEventListener("DOMContentLoaded", function(){
//     console.log('hi');
 
// });


//name.appendChild(document.createElement('div'))