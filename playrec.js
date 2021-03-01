
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

scrollEmulation();


//get buttons to appear on the instagram header
//blur our instagram header
//


//    position: fixed;
// color: black;
// top: 10px;
// left: 20%;
// font-size: 20x;
// z-index: 1000000000000000000000;
// background: white;
// border: 1px solid black;
// }