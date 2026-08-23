
    
function stopVideoYoutube(id){
    
    $('#cartoonVideo'+id).attr('src', $('#cartoonVideo'+id).attr('src'));
};



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var rotarLogo = function (estado){
    if(estado == 'mostrar'){
        $("#logoHome").show();
    }else{
        $("#logoHome").hide();
    }
 }

//console.log( $('[id^="myModal"]'));

function showYear(year){
    $(".hide-"+year).show();
    $(".show-"+year).hide();
    $('.button-show-'+year).hide();
    $(".button-hide-"+year).show();
}

function hideYear(year){
    $(".hide-"+year).hide();
    $(".button-hide-"+year).hide();
    $('.button-show-'+year).show();
}



 
jQuery(document).ready(function($) {

    var autor = getParameterByName('autor');
    if((autor != '')) {
        $('#collapse'+autor).attr('class', 'b-top b-bottom collapse show');
        //offset.top = 5;    
        $('html, body').animate({
            scrollTop: $('#collapse'+autor).offset().top
            }, 2000);
            //location.href = "#collapse"+autor;
    }
    
    $('[id^="myModal"]').on('click', function (e) {
        // do something...
        let id = $(this).attr('id');
        let ids = id.split("myModal");
        stopVideoYoutube(ids[1]);
      })
     
    
    $(".loader").hide();

});
