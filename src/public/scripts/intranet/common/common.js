$('a').click(function(){
    document.getElementById("page-loader").style.display = 'block';
    location.reload()
})
$("form").submit(function() {
    document.getElementById("page-loader").style.display = 'block';
});