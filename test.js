var mainCont = document.querySelector('#react-root');

initElements();

function initElements(){
    mainCont.className = 'inactive';

    let introCont = document.createElement('div');
    introCont.className = 'intro';
    introCont.innerHTML = '<div class="headerCustom">Disembodied Instagram</div><div class="subhead">Watch yourself browse Instagram.</div>';
    document.querySelector('body').appendChild(introCont);

    let recordBtn = document.createElement('div');
    recordBtn.innerHTML = '<div class="startScroll">Record</div>';
    introCont.appendChild(recordBtn);
    recordBtn.onclick = function(e){
        hideIntro();
        document.addEventListener('scroll', scrollListener, true);
    }
}

function showIntro(){
    document.querySelector('.intro').className = 'intro';
    mainCont.className = 'inactive';
}
function hideIntro(){
    document.querySelector('.intro').className = 'intro inactive';
    mainCont.className = '';
}


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

        console.log(data.scrollArray)

    })
   
};



function scrollEmulation(){
    
    document.removeEventListener('scroll', scrollListener, true);
    chrome.storage.local.get('scrollArray',  localData => {

        console.log('running emulation');

        //requires promises
        window.scrollTo(0, localData.scrollArray[0].scrollPos);
  
        localData.scrollArray.forEach( async (s, i) => {
            await setTimeout(function(){
                // window.scrollTo(0, s.scrollPos)
                window.scrollTo({
                    top: s.scrollPos,
                    behavior: 'smooth',
                })
            }, s.elapsedTime)
        });  
    })
}

let playBtn = document.createElement('div');
playBtn.className = "startPlay";
playBtn.innerHTML = '<div>Play</div>';
playBtn.onclick = function(e){
    scrollEmulation();
}
mainCont.appendChild(playBtn);








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