//MENU
$(document).ready(function(){
    $("#toggleHeader").click(function(){
        responsiveHeaderToggle();
        $("#common-subheader").hide();
    });

    $("#toggleSubHeader").click(function(){
        responsiveSubHeaderToggle();
        $("#headerMenu").hide();
    });

    $("#headerResponsiveCloser").click(function(){
        $("#headerMenu").hide();
        $("#common-subheader").hide();
        $("#headerResponsiveCloser").hide();
    });


})


function responsiveHeaderToggle(){
    $("#headerMenu").slideToggle("fast");
    $("#headerResponsiveCloser").slideToggle("fast");
}

function responsiveSubHeaderToggle(){
    $("#common-subheader").slideToggle("fast");
    $("#headerResponsiveCloser").slideToggle("fast");
}
