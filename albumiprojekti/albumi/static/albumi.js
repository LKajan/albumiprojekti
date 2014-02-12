function Elementti(elementti, callback) {
	if (arguments.length == 0) return;
	
	var elementtiObject = this;
	
	this.id = elementti.id;
	this.teksti = elementti.teksti;
	this.x = elementti.x;
	this.y = elementti.y;
	this.z = elementti.z;
	this.width = elementti.koko_x;
	this.height = elementti.koko_y;
	this.aspect = this.height / this.width;
	this.kuvanid = elementti.kuva.id;
	this.kuvanNimi = elementti.kuva.nimi;
	this.image = new Image();

	this.image.onload = function() {
		console.log("Elementti "+elementtiObject.id+" latautunut.");
		if(typeof callback !== 'undefined'){
			callback();
		}
	};
	this.image.src = elementti.kuva.url;
};
Elementti.prototype.toJSON = function(){
	var json = {
		id: this.id,
		teksti: this.teksti,
		x: this.x,
		y: this.y,
		z: this.z,
		kuva : {url: this.image.src, id: this.kuvanid, nimi: this.kuvanNimi},
		koko_x: this.width,
		koko_y: this.height
	}
	return json;
}

function Sivu(sivu, callback){
	if (arguments.length == 0) return;
	
	var sivuObject = this;
	var elementtejaValmiina = 0;
	var elementteja = sivu.elementit.length;
	this.elementtiValmis = function(){
		elementtejaValmiina++;
		if (elementtejaValmiina >= elementteja) {
			for (var i =0; i < sivuObject.elementit.length; i++){
				var elementti = sivuObject.elementit[i];
				sivuObject.context.drawImage(elementti.image,
						elementti.x,
						elementti.y,
						elementti.width,
						elementti.height);
			}
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
		sivuObject.lisaaElementti(elementti, sivuObject.elementtiValmis);
	});
	
	if (elementteja == 0) {
		this.elementtiValmis();
	}
};
Sivu.prototype.toJSON = function(){
	var json = {
		id: this.id,
		sivunumero: this.sivunumero,
		elementit : this.elementit,
	};
	return json;
}

Sivu.prototype.lisaaElementti = function(elementti, callback) {
	if (typeof(elementti.z) == 'undefined') elementti.z = this.elementit.length;
	
	this.elementit.push(new Elementti(elementti, callback));
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
	this.koko_x = json.koko_x;
	this.koko_y = json.koko_y;
	
	var sivujavalmiina = 0;
	var sivuja = json.sivut.length;
	this.sivuValmis = function(){
		sivujavalmiina++;
		if (sivujavalmiina >= sivuja) {
			console.log("Koko albumi valmis!");
			console.log(JSON.stringify(albumiObject));
			if(typeof callback !== 'undefined'){
				callback();
			}
		}
	}
	$.each( json.sivut, function(i, sivu) {
		sivu.width = albumiObject.koko_x;
		sivu.height = albumiObject.koko_y;
		albumiObject.lisaaSivu(sivu.sivunumero, sivu, albumiObject.sivuValmis);
	});
	
	if (sivuja == 0){ 
		this.sivuValmis();
	}
};
Albumi.prototype.lisaaSivu = function(sivunumero, sivu, callback){
	this.sivut[sivunumero] = new Sivu(sivu, callback);
}
Albumi.prototype.toJSON = function(){
	var json = {
		id: this.id,
		nimi: this.nimi,
		koko_x: this.koko_x,
		koko_y: this.koko_y,
		sivut : this.sivut
	}
	return json;
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




