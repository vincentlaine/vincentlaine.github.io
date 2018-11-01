(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

      $("#text-rotator").typer({
          strings: [
              "Web apps",
              "Chatbots",
              "JavaScript"
          ],
          useCursor: true
      });

  }); // end of document ready
})(jQuery); // end of jQuery name space
