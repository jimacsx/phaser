$(function(){
  $('#Viewport').attr('content', 'initial-scale=0.5, maximum-scale=0.5, minimum-scale=0, user-scalable=no');
  $( window ).resize(function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      console.log("Es dispositivo");
      var ww = ( $(window).width() < window.screen.width ) ? $(window).width() : window.screen.width; //get proper width
      var mw = 480; // min width of site
      var ratio =  ww / mw; //calculate ratio
      ratio = ratio - 0.16666666666;
      if(ww < mw){ //smaller than minimum size
       $('#Viewport').attr('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=yes, width=' + ww);
      }else{ //regular size
        if(ww < 768) {
          $('#Viewport').attr('content', 'initial-scale=0.5, maximum-scale=0.75, minimum-scale=0, user-scalable=yes, width=' + ww);
        } else {
          $('#Viewport').attr('content', 'initial-scale=1.0, maximum-scale=2, minimum-scale=1.0, user-scalable=yes, width=' + ww);
        }
      }
    } else {
      console.log("Es desktop");
      if(ww < 768) {
        $('#Viewport').attr('content', 'initial-scale=0.5, maximum-scale=0.5, minimum-scale=0');
      } else {
        $('#Viewport').attr('content', 'initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes, width=' + ww);
      }
    }
  });
});
