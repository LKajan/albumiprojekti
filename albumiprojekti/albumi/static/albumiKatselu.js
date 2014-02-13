var albumi;
var carouselStage, carouselNavigation;

function luoAlbumi(json){
	albumi = new Albumi(json);
	lisaaAlbumi();
}
