var albumi;
var carouselStage, carouselNavigation;

function luoAlbumi(json){
	albumi = new MuokattavaAlbumi(json);
	lisaaAlbumi();
	var canvakset = $('.carousel-stage ul li canvas');
	$.each(canvakset, function(i, canvas){
		canvas.addEventListener('dragenter', handleDragEnter, false);
		canvas.addEventListener('dragleave', handleDragLeave, false);
		canvas.addEventListener('dragover', handleDragOver, false);
		canvas.addEventListener('drop', handleDrop, false);
	});
}
var dragSrcEl = null;
function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
    e.dataTransfer.setData('Text', this.id); // required otherwise doesn't work

    dragSrcEl = this;
};

function handleDragEnter(e) {
	this.classList.add('over');
}

function handleDragLeave(e) {
	this.classList.remove('over');
}

function handleDragOver(e) {
	if (e.preventDefault) e.preventDefault(); // allows us to drop
    this.classList.add('over');
    e.dataTransfer.dropEffect = 'copy';
    return false;
}

function handleDragEnd(e) {
	var canvakset = $('.carousel-stage ul li canvas');
	$.each(canvakset, function(i, canvas){
		canvas.classList.remove('over');
	});
};

function handleDrop(e) {
	e.stopPropagation();
	//e.preventDefault();

	var el = document.getElementById(e.dataTransfer.getData('Text'));
	var url = dragSrcEl.getAttribute("src");
	var sivunumero = parseInt(this.id.slice(10));
	var sivu = albumi.sivut[sivunumero];
	
	var mouse = sivu.getMouse(e);
	
	var z = sivu.elementit.length;
	var leveys = sivu.width/2;
	var k = dragSrcEl.clientHeight;
	var l = dragSrcEl.clientWidth;
	var aspect = k / l;
	var korkeus = leveys * aspect;

	var elementti = {
			"id": null,
			"kuva": {
				"url": url
			},
			"y": mouse.y-korkeus/2,
			"x": mouse.x-leveys/2,
			"z": z+1,
			"koko_y": korkeus,
			"koko_x": leveys
	};
	
	sivu.lisaaElementti(elementti);
}


$( document ).ready(function() {
	initJCarousel();
	$('.carousel-stage').on('jcarousel:animateend', paivitaSivunumero);
	$.getJSON("albumi/albumi/"+1+".json", luoAlbumi);
	var kuvat = $('.raahattavaKuva');
	$.each(kuvat, function(i, kuva){
		kuva.addEventListener('dragstart', handleDragStart, false);
		kuva.addEventListener('dragend', handleDragEnd, false);
	});
});