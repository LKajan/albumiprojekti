var albumi;
var carouselStage, carouselNavigation;

function Elementti(elementti, parentContext) {
	this.id = elementti.id;
	this.teksti = elementti.teksti;
	this.x = elementti.x;
	this.y = elementti.y;
	this.width = elementti.koko_x;
	this.heigth = elementti.koko_y;
	this.image = new Image();
	var parentContext = parentContext;
	var elementtiObject = this;
	this.image.onload = function() {
		parentContext.drawImage(
				elementtiObject.image,
				elementtiObject.x,
				elementtiObject.y,
				elementtiObject.width,
				elementtiObject.heigth);
	};
	this.image.src = elementti.kuva.url;
};
function Sivu(sivu, koko){
	this.id = sivu.id;
	this.sivunumero = sivu.sivunumero;
	this.canvas = $('<canvas>', {'class': 'sivuCanvas', 'id': 'sivuCanvas'+this.sivunumero})[0];
	this.canvas.width = koko[0];
	this.canvas.height = koko[1];
	this.context = this.canvas.getContext('2d');
	
	this.elementit = [];
	var sivuObject = this;
	$.each( sivu.elementit, function(i, elementti) {
		sivuObject.elementit.push(new Elementti(elementti, sivuObject.context));
	});
	
	var imagesLoaded = 0;
	var numImages = this.elementit.length;
};

Sivu.prototype.thumb = function() {
	var dataUrl = this.canvas.toDataURL();
	var canvasImg = $('<img>', {
		'src': dataUrl,
		'height' : '50px',
		'width': '50px'
	});
	return canvasImg;
};
function Albumi(json) {
	this.sivut = [];
	this.id = json.id;
	this.nimi = json.nimi;
	this.koko = [json.koko_x, json.koko_y];
	
	var albumiObject = this;
	$.each( json.sivut, function(i, sivu) {
		albumiObject.sivut[sivu.sivunumero] = new Sivu(sivu, [json.koko_x, json.koko_y]);
	});
	this.luoAlbumi();
};
Albumi.prototype.luoAlbumi = function(){
	for (var sivunumero = 0; sivunumero< this.sivut.length; sivunumero++) {
		var sivu = this.sivut[sivunumero];
		$('<li>', {html: sivu.canvas}).appendTo($('.carousel-stage ul'));
		//var sivuThumb = sivu.thumb();
		$('<li>').html($('<div>', {'width':'70px', 'height': '50px'}).html($('<p>').text(sivunumero+1))).appendTo($('.carousel-navigation ul'));
    }
	$('#sivunumeroYht').text(this.sivut.length);
	reloadCarousel()
};

function lueAlbumi(json){
	albumi = new Albumi(json);
};

function paivitaSivunumero(event, carousel){
	var currentFirstItem = $(this).jcarousel('first');
	var idx = currentFirstItem.index();
	$('#sivunumeroTama').text(idx+1);
};

$( document ).ready(function() {
    // Setup the carousels. Adjust the options for both carousels here.

	initJCarousel();
	$('.carousel-stage').on('jcarousel:animateend', paivitaSivunumero);
	$.getJSON("albumi/albumi/"+1+".json", lueAlbumi);
});