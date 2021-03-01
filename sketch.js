// article {
//     background: blue;
//   }
  
//   article button div {
//     display: none;
//   }
  
//   img {
//   display: none;
//   }
  
//   video {
//     display: none;
//   }


document.addEventListener("DOMContentLoaded", function(){
    console.log('sup')



    var scrollListener = function(e) {
        // TODO: hide dialog
        console.log(e, window.scrollY)
        
        // document.removeEventListener('scroll', scrollListener, true);
    };
    
    document.addEventListener('scroll', scrollListener, true);
});