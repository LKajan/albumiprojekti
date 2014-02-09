function Elementti(elementti, parentContext, callback) {
	if (arguments.length == 0) return;
	
	var parentContext = parentContext;
	var elementtiObject = this;
	
	this.id = elementti.id;
	this.teksti = elementti.teksti;
	this.x = elementti.x;
	this.y = elementti.y;
	this.width = elementti.koko_x;
	this.heigth = elementti.koko_y;
	this.image = new Image();

	this.image.onload = function() {
		parentContext.drawImage(elementtiObject.image,
				elementtiObject.x,
				elementtiObject.y,
				elementtiObject.width,
				elementtiObject.heigth);
		console.log("Elementti "+elementtiObject.id+" valmis.");
		if(typeof callback !== 'undefined'){
			callback();
		}
	};
	this.image.src = elementti.kuva.url;
};

function Sivu(sivu, callback){
	if (arguments.length == 0) return;
	
	var sivuObject = this;
	var elementtejaValmiina = 0;
	var elementteja = sivu.elementit.length;
	var elementtiValmis = function(){
		elementtejaValmiina++;
		if (elementtejaValmiina >= elementteja) {
			console.log("Sivu "+sivuObject.id+" valmis!");
			if(typeof callback !== 'undefined'){
				callback();
			}
		}
	};
	
	this.elementit = [];
	this.id = sivu.id;
	this.sivunumero = sivu.sivunumero;
	this.canvas = $('<canvas>', {'class': 'sivuCanvas', 'id': 'sivuCanvas'+this.sivunumero})[0];
	this.canvas.width = sivu.width;
	this.canvas.height = sivu.height;
	this.width = sivu.width;
	this.height = sivu.height;
	
	this.context = this.canvas.getContext('2d');

	$.each( sivu.elementit, function(i, elementti) {
		sivuObject.lisaaElementti(elementti, elementtiValmis);
	});
	
	if (elementteja == 0) {
		elementtiValmis();
	}
};
Sivu.prototype.lisaaElementti = function(elementti, callback) {
	this.elementit.push(new Elementti(elementti, this.context, callback));
};
Sivu.prototype.thumb = function() {
	// TODO CORS error tietenkin
	var dataUrl = this.canvas.toDataURL("image/png");
	var img = $('<img>', {
		'src': dataUrl,
		'height' : '50px',
		'width': '70px'
	});
	return img;
};


function Albumi(json, callback) {
	if (arguments.length == 0) return;
	
	var albumiObject = this;
	
	this.sivut = [];
	this.id = json.id;
	this.nimi = json.nimi;
	
	
	var sivujavalmiina = 0;
	var sivuja = json.sivut.length;
	var sivuValmis = function(){
		sivujavalmiina++;
		if (sivujavalmiina >= sivuja) {
			console.log("Koko albumi valmis!");
			if(typeof callback !== 'undefined'){
				callback();
			}
		}
	}
	$.each( json.sivut, function(i, sivu) {
		sivu.width = json.koko_x;
		sivu.height = json.koko_y;
		albumiObject.lisaaSivu(sivu.sivunumero, sivu, sivuValmis);
	});
	
	if (sivuja == 0){ 
		sivuValmis();
	}
};
Albumi.prototype.lisaaSivu = function(sivunumero, sivu, callback){
	this.sivut[sivunumero] = new Sivu(sivu, callback);
}


function lisaaAlbumi(){
	var sivuja = albumi.sivut.length;
	for (var sivunumero = 0; sivunumero < sivuja; sivunumero++) {
		var sivu = albumi.sivut[sivunumero];
		$('<li>', {html: sivu.canvas}).appendTo($('.carousel-stage ul'));
		$('<li>').html(
			$('<div>', {'width':'70px', 'height': '50px'}).html(
				$('<p>').text(sivunumero+1)
			)
		).appendTo($('.carousel-navigation ul'));
    }
	$('#sivunumeroYht').text(sivuja);
	reloadCarousel();
};


function paivitaThumbnailit(){
	// TODO Ei nyt toiminutkaan kun tulee cors error
	for (var i = 0; i < albumi.sivut.length; i++) {
		var sivu = albumi.sivut[i];
		var img = sivu.thumb();
		var divi = $('.carousel-navigation ul li:nth-child('+i+') div');
		img.appendTo(divi);
	}
};


function paivitaSivunumero(event, carousel){
	var currentFirstItem = $(this).jcarousel('first');
	var idx = currentFirstItem.index();
	$('#sivunumeroTama').text(idx+1);
};




