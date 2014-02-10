var valintaColor = '#CC0000';
var valintaWidth = 2;
var dragBoxSize = 6;
var interval = 30;

function MuokattavaElementti(elementti, parentContext, callback){
	Elementti.apply(this, arguments);
	

}
MuokattavaElementti.prototype = new Elementti();
MuokattavaElementti.prototype.constructor = MuokattavaElementti;
MuokattavaElementti.prototype.handels = function(){
	var half = dragBoxSize / 2;
	var handels = [];
	handels[0] = {x:this.x-half, 				y:this.y-half};
	handels[1] = {x:this.x+this.width-half, 	y:this.y-half};
	handels[2] = {x:this.x+this.width-half, 	y:this.y+this.height-half};
	handels[3] = {x:this.x-half, 				y:this.y+this.height-half};
	
	return handels;
}

MuokattavaElementti.prototype.contains = function(mx, my, tolerance) {
	var tolerance = tolerance || 0;
	var minx = this.x-tolerance;
	var maxx = this.x + this.width + tolerance;
	var miny = this.y - tolerance;
	var maxy = this.y + this.height + tolerance;
	return  (minx <= mx) && (mx <= maxx) && (miny <= my) && (my <= maxy);
};
MuokattavaElementti.prototype.containsDrag = function(mx,my, tolerance) {
	var tolerance = tolerance || 0;
	var handels = this.handels();
	for (var i=0; i < handels.length; i++){
		var h = handels[i];
		if ((h.x - tolerance <= mx) && (h.x + dragBoxSize +tolerance >= mx) && (h.y - tolerance <= my) && (h.y + dragBoxSize + tolerance >= my)) return i;
	}
	return false;
};
MuokattavaElementti.prototype.draw = function(ctx){
	ctx.drawImage(
			this.image,
			this.x,
			this.y,
			this.width,
			this.height);
};

MuokattavaElementti.prototype.drawValinta  = function(ctx) {
    ctx.strokeStyle = valintaColor;
    ctx.lineWidth = valintaWidth;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}
MuokattavaElementti.prototype.drawHandels  = function(ctx) {
	ctx.fillStyle = valintaColor;
	var handels = this.handels();
	for (var i=0; i < handels.length; i++){
		var h = handels[i];
		ctx.fillRect(h.x, h.y, dragBoxSize, dragBoxSize);
	}
}


function MuokattavaSivu(sivu, callback){
	Sivu.apply(this, arguments);
	
	var sivuObject = this;
	
	this.valid = false;
	this.dragging = false;
	this.resizing = false;
	this.valinta = null;
	this.dragoffx = 0;
	this.dragoffy = 0;
	
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. See getMouse for more detail
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10)   || 0;
	}
	// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
	// They will mess up mouse coordinates and this fixes that
	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;
	
	this.canvas.addEventListener('mousedown', function(e) {
		var mouse = sivuObject.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		if (sivuObject.valinta) {
			var mySel = sivuObject.valinta;
			var resizeSuunta = mySel.containsDrag(mx, my);
		    if (resizeSuunta !== false){
		    	sivuObject.resizing = true;
		    	sivuObject.resizeSuunta = resizeSuunta;
		    	
			    sivuObject.valid = false;
			    return;
		    }
		}


		var elementit = sivuObject.elementit;
		var l = elementit.length;
		for (var i = l-1; i >= 0; i--) {
			if (elementit[i].contains(mx, my)) {
				var mySel = elementit[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
			    sivuObject.dragoffx = mx - mySel.x;
			    sivuObject.dragoffy = my - mySel.y;
			    sivuObject.dragging = true;

			    sivuObject.valinta = mySel;
			    sivuObject.valid = false;
			    return;
			}
		}
		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (sivuObject.valinta) {
			sivuObject.valinta = null;
			sivuObject.valid = false; // Need to clear the old valinta border
		}
	}, true);
	this.canvas.addEventListener('mousemove', function(e) {
		this.style.cursor='auto';
		if (sivuObject.valinta) {
			var mouse = sivuObject.getMouse(e);
			var mx = mouse.x;
			var my = mouse.y;
			var mySel = sivuObject.valinta;
			if (mySel.contains(mx, my, dragBoxSize/2)) {
				if (mySel.contains(mx, my)) {
					this.style.cursor='move';
				}
				var h = mySel.containsDrag(mx, my);
		        if (h !== false){
					switch (h) {
			          case 0:
			            this.style.cursor='nw-resize';
			            break;
			          case 1:
			            this.style.cursor='ne-resize';
			            break;
			          case 2:
			            this.style.cursor='se-resize';
			            break;
			          case 3:
			            this.style.cursor='sw-resize';
			            break;
			        }
				}
			}
		}
		if (sivuObject.resizing){
			var mouse = sivuObject.getMouse(e);
			var suunta = sivuObject.resizeSuunta;
			var mySel = sivuObject.valinta;
			
		    var oldx = mySel.x;
		    var oldy = mySel.y;
		    var oldh = mySel.height;
		    var oldw = mySel.width;
		    
		    switch (suunta) {
		      case 0:
		        mySel.x = mx;
		        mySel.width += oldx - mx;
		        mySel.height = mySel.aspect * mySel.width;
		        mySel.y -= mySel.height - oldh;
		        
		        break;
		      case 1:
		        mySel.width = mx - oldx;
		        mySel.height = mySel.aspect * mySel.width;
		        mySel.y -= mySel.height - oldh;
		        break;
		      case 2:
		        mySel.width = mx - oldx;
		        mySel.height = mySel.aspect * mySel.width;
		        break;
		      case 3:
		        mySel.x = mx;
		        mySel.width += oldx - mx;
		        mySel.height = mySel.aspect * mySel.width;
		        break;
		    }
		    sivuObject.valid = false;
		} else if (sivuObject.dragging){
			var mouse = sivuObject.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			sivuObject.valinta.x = mouse.x - sivuObject.dragoffx;
			sivuObject.valinta.y = mouse.y - sivuObject.dragoffy;   
			sivuObject.valid = false; // Something's dragging so we must redraw
		}
	}, true);
	this.canvas.addEventListener('mouseup', function(e) {
		sivuObject.dragging = false;
		sivuObject.resizing = false;
	}, true);
	
	
	setInterval(function() { sivuObject.draw(); }, interval);
}
MuokattavaSivu.prototype = new Sivu();
MuokattavaSivu.prototype.constructor = MuokattavaSivu;

MuokattavaSivu.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.context;
    var elementit = this.elementit;
    this.tyhjenna();
 
    // ** Add stuff you want drawn in the background all the time here **
 
    // draw all elementit
    var l = elementit.length;
    for (var i = 0; i < l; i++) {
      var shape = elementit[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      elementit[i].draw(ctx);
    }
 
    // draw valinta
    // right now this is just a stroke along the edge of the selected Shape
    if (this.valinta != null) {
      ctx.strokeStyle = this.valintaColor;
      ctx.lineWidth = this.valintaWidth;
      var mySel = this.valinta;
      this.valinta.drawValinta(ctx);
	  this.valinta.drawHandels(ctx);
    }
 
    this.valid = true;
  }
};
Sivu.prototype.lisaaElementti = function(elementti, callback) {
	this.elementit.push(new MuokattavaElementti(elementti, this.context, callback));
};
MuokattavaSivu.prototype.tyhjenna = function(){
	this.context.clearRect(0, 0, this.width, this.height);
};

//Creates an object with x and y defined, set to the mouse position relative to the state's canvas
//If you wanna be super-correct this can be tricky, we have to worry about padding and borders
MuokattavaSivu.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
	
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	
	// We return a simple javascript object (a hash) with x and y defined
	return {x: mx, y: my};
}


function MuokattavaAlbumi(json, callback){
	Albumi.apply(this, arguments);
	
	var albumiObject = this;
}
MuokattavaAlbumi.prototype = new Albumi();
MuokattavaAlbumi.prototype.constructor = MuokattavaAlbumi;
MuokattavaAlbumi.prototype.lisaaSivu = function(sivunumero, sivu, callback){
	this.sivut[sivunumero] = new MuokattavaSivu(sivu, callback);
}