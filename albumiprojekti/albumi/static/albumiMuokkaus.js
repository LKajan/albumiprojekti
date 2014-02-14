var albumi;
var carouselStage, carouselNavigation;
var dragSrcEl = null;

function luoAlbumi(json){
	albumi = new MuokattavaAlbumi(json);
	lisaaAlbumi();
	$('#julkinenCheckbox').attr('checked', albumi.julkinen);
	var canvakset = $('.carousel-stage ul li canvas');
	$.each(canvakset, function(i, canvas){
		canvas.addEventListener('dragenter', handleDragEnter, false);
		canvas.addEventListener('dragleave', handleDragLeave, false);
		canvas.addEventListener('dragover', handleDragOver, false);
		canvas.addEventListener('drop', handleDrop, false);
	});
	
}

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
	var kuvanNimi = $(dragSrcEl).siblings('input.kuvanNimi').val();
	var kuvanId = $(dragSrcEl).siblings('input.kuvanId').val();
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
			kuva: {
				url: url
			},
			y: mouse.y-korkeus/2,
			x: mouse.x-leveys/2,
			z: z+1,
			koko_y: korkeus,
			koko_x: leveys
	};
	
	if (typeof kuvanId !== 'undefined') {
		elementti.kuva.id = parseInt(kuvanId);
	}
	if (typeof kuvanNimi !== 'undefined') {
		elementti.kuva.nimi = kuvanNimi;
	}
	
	sivu.lisaaElementti(elementti, sivu.elementtiValmis);
}

function lataaKuva(e){
	var kuvaInput = $('#kuvaUrlInput');
	var url = kuvaInput.val();
	var div = $('<div>', {'class': "col-lg-6 thumbnail"});

	var kuva = $('<img>', {
				'class': "raahattavaKuva img-responsive",
				'src': url,
				'draggable': "true"})
	
	kuva[0].addEventListener('dragstart', handleDragStart, false);
	kuva[0].addEventListener('dragend', handleDragEnd, false);
				
	kuva.appendTo(div);
	$('<input>', {'class': "muokattavaTeksti", 'placeholder': "kuvan nimi", 'value':""}).appendTo(div);

	div.appendTo($('#albumilista'));
	
	kuvaInput.val('');
}

function paivitaTalletettu(json){
	console.log("Tallennettu!!!!!");
	var currentdate = new Date();
	$('#tallennettuAika').text('Tallennettu '+currentdate.getHours()+':'+currentdate.getMinutes());
	$('#tallennettuAika').show();
	console.log(json);
	
	albumi.id = json.id;
	for (var i=0; i< json.sivut.length; i++){
		var sivu = json.sivut[i];
		albumi.sivut[i].id = sivu.id;
		
		for (var j=0; j< sivu.elementit.length; j++){
			var elementti = sivu.elementit[j];
			albumi.sivut[i].elementit[j].id = elementti.id;
			albumi.sivut[i].elementit[j].kuva.id = elementti.kuva.id;
		}
	}
}

function tallenna(e){

	var json = JSON.stringify(albumi);
	
	$.ajax({
		  type: "POST",
		  url: "albumi/tallenna",
		  data: json,
		  success: paivitaTalletettu
	});
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

function uusiSivu(){
	var sivuja = albumi.sivut.length;

	albumi.lisaaSivu(sivuja, 
			{
		elementit: [],
		width: albumi.koko_x,
		height: albumi.koko_y,
		sivunumero: sivuja
		},
		albumi.sivuValmis);
	
	var sivu = albumi.sivut[sivuja];
	
	sivu.canvas.addEventListener('dragenter', handleDragEnter, false);
	sivu.canvas.addEventListener('dragleave', handleDragLeave, false);
	sivu.canvas.addEventListener('dragover', handleDragOver, false);
	sivu.canvas.addEventListener('drop', handleDrop, false);
	
	
	$('<li>', {html: sivu.canvas}).appendTo($('.carousel-stage ul'));
	$('<li>').html(
		$('<div>', {'width':'70px', 'height': '50px'}).html(
			$('<p>').text(sivuja+1)
		)
	).appendTo($('.carousel-navigation ul'));

	$('#sivunumeroYht').text(sivuja+1);
	reloadCarousel();
}

$( document ).ready(function() {
	var kuvat = $('.raahattavaKuva');
	$.each(kuvat, function(i, kuva){
		kuva.addEventListener('dragstart', handleDragStart, false);
		kuva.addEventListener('dragend', handleDragEnd, false);
	});
	
	$('#lisaaKuvaButton').click(lataaKuva);
	$('#tallennaButton').click(tallenna);
	$('#lisaaSivuButton').click(uusiSivu);
	$('#albumiNimi').change(function(){
		var nimi = $(this).val()
		albumi.nimi = nimi;
		});
	$('#julkinenCheckbox').click(function () {
	    albumi.julkinen = this.checked;
	});
	
	var csrftoken = $.cookie('csrftoken');
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
	            // Send the token to same-origin, relative URLs only.
	            // Send the token only if the method warrants CSRF protection
	            // Using the CSRFToken value acquired earlier
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});
});