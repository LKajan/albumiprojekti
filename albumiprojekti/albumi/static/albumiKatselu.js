var albumi;
var carouselStage, carouselNavigation;


function luoAlbumi(json){
	albumi = new Albumi(json);
	lisaaAlbumi();
}

$( document ).ready(function() {
	initJCarousel();
	$('.carousel-stage').on('jcarousel:animateend', paivitaSivunumero);
	$.getJSON("albumi/albumi/"+1+".json", luoAlbumi);
});