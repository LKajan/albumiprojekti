function MuokattavaElementti(elementti, parentContext, callback){
	Elementti.apply(this, arguments);
	
	var elementtiObject = this;
}
MuokattavaElementti.prototype = new Elementti();
MuokattavaElementti.prototype.constructor = MuokattavaElementti;

MuokattavaElementti.prototype.contains = function(mx, my) {
	return  (this.x <= mx) && (this.x + this.width >= mx) && (this.y <= my) && (this.y + this.heigth >= my);
};
MuokattavaElementti.prototype.draw = function(ctx){
	ctx.drawImage(
			this.image,
			this.x,
			this.y,
			this.width,
			this.heigth);
};



function MuokattavaSivu(sivu, callback){
	Sivu.apply(this, arguments);
	
	var sivuObject = this;
	
	this.valid = false;
	this.dragging = false;
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
		if (sivuObject.dragging){
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
	}, true);
	
	
	
	// **** Options! ****
	  
	this.valintaColor = '#CC0000';
	this.valintaWidth = 2;  
	this.interval = 30;
	setInterval(function() { sivuObject.draw(); }, sivuObject.interval);
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
      ctx.strokeRect(mySel.x,mySel.y,mySel.width,mySel.heigth);
    }
 
    // ** Add stuff you want drawn on top all the time here **
 
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