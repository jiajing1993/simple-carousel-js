Zepto(function($) {
  function Carousel(id, options) {
    this.el = {
      slider: $(id),
      holder: $(id + " .holder"),
      sliderWrapper: $(id + " .slide-wrapper"),
      eachSlider: $(id + " .slide"),
      imgSlide: $(id + ".slide-image")
    }

    this.default = {
      radius: 5,
      width: 90,
      padding: 5
    }

    if (options !== undefined){
      this.initialized(options);
    }


    this.settings = {
      slideWidth: undefined,
      maxSlider: this.el.holder.children().length,
      touchstartx: undefined,
      touchmovex: undefined,
      movex: undefined,
      previous_movex: undefined,
      index: 0,
      marginLeft: undefined
    }

    this.disableScrollingY = function(){
      $(document.body).css({
        "height": "100vh",
        "overflow": "hidden"
      });
    }
    this.enableScrollingY = function(){
      // make normal scroll work again
      $(document.body).css({
        "height": "auto",
        "overflow": "scroll"
      });
    }
  }

  Carousel.prototype.init = function(){
    this.setWidth();
    this.bindUIEvents();
  };

  Carousel.prototype.initialized = function(options){
    this.default.width = options.width
    this.default.radius = options.radius
    this.default.padding = options.padding
  }

  Carousel.prototype.setWidth = function(){

    // set the size of slider and also the gap between each other
    this.el.sliderWrapper.css({
      'width': ($(window).width() * this.default.width / 100 ) - this.default.padding * 2 + "px",
      'padding': this.default.padding + "px"
    })

    // set the border-radius for slider
    this.el.eachSlider.css({
      'border-radius': this.default.radius + "px"
    })

    // set the total width of the carousel holder
    this.el.holder.css('width', this.settings.maxSlider * this.el.sliderWrapper.width() + "%");

    // get the sliders' width size
    this.settings.slideWidth = this.el.sliderWrapper.width()

    // get the margin of each size to let slider always stay center
    this.settings.marginLeft = ( $(window).width() - this.settings.slideWidth ) / 2
  };

  Carousel.prototype.bindUIEvents = function(){
    var that = this
    this.el.holder.on("touchstart", function(event) {
      // when user start touching the carousel
      that.startScrolling(event);
    });

    this.el.holder.on("touchmove", function(event) {
      // when user start moving their finger on carousel
      that.onScrolling(event);
    });

    this.el.holder.on("touchend", function(event) {
      that.stopScrolling(event);
    });
  };

  Carousel.prototype.startScrolling = function(event){
    event.preventDefault();
    // record the horizontal position of user touch
    this.settings.touchstartx = event.touches[0].pageX;

    this.disableScrollingY();
    // no idea why I need to remove this class
    $('.animate').removeClass('animate');
  };

  Carousel.prototype.onScrolling = function(event){
    event.preventDefault();
    // this suppose to prevent scroll x when carousel are being scroll, however it didnt work on mobile.
    $(document.body).css('overflow-y', 'hidden');

    // record the horizontal position user's finger move to
    this.settings.touchmovex = event.touches[0].pageX;

    // touchmovex is only limited to 0 - 375px
    // the number of slider position + user move travel distance (touchmovex)
    this.settings.movex = this.settings.index * this.settings.slideWidth + (this.settings.touchstartx - this.settings.touchmovex);

    // animate carousel along with the touch movement.
    this.el.holder.css('transform', 'translate3d(' + (this.settings.movex * (-1)) + 'px,0,0)');
  };

  Carousel.prototype.stopScrolling = function(event){
    this.enableScrollingY();

    // total touch movement (power of pulling carousel)
    // initial touch position - final touch position
    var absMove = Math.abs(this.settings.touchstartx - this.settings.touchmovex);

    // power need to more than 100 to trigger the carousel movement
    if (this.settings.previous_movex !== this.settings.movex && absMove > 100) {

      // detect the carousel should go left or go right
      // if (this.settings.touchstartx - this.settings.touchmovex) is negative, go left. else go right.
      if ( (this.settings.movex > this.settings.index * this.settings.slideWidth) && (this.settings.index < this.settings.maxSlider - 1) ) {
        this.settings.index++;
      } else if (this.settings.movex < this.settings.index * this.settings.slideWidth && this.settings.index > 0) {
        this.settings.index--;
      }
    }

    // make sure the first slider always stick to the wall
    if (this.settings.index !== 0) {
      this.pushToLeft(this.settings.marginLeft);
    } else {
      this.pushToLeft(0);
    }

    // move to the targeted slider
    var movement = (this.settings.index * this.settings.slideWidth)
    this.el.holder.addClass('animate').css('transform', 'translate3d(' + movement * (-1) + 'px,0,0)');

    // set the previous moving point
    this.settings.previous_movex = this.settings.movex;
  }

  Carousel.prototype.pushToLeft = function(marginLeft){
    this.el.holder.css('width', $('.holder').width() + marginLeft + "px")
    this.el.sliderWrapper.first().css("margin-left", marginLeft + "px");
  }

  // dafault carousel object
  var carousel = new Carousel('#favepay-carousel');
  carousel.init();


  // customizable carousel object
  // var carousel2 = new Carousel('#slider2', {
  //   radius: 0,
  //   padding: 0,
  //   width: 100,
  // });
  // carousel2.init();
});
