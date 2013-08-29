/* Created by Martin Hintzmann 2008 martin [a] hintzmann.dk
 * MIT (http://www.opensource.org/licenses/mit-license.php) licensed.
 *
 * Version: 0.2
 * Requires: jQuery 1.2+
 * http://plugins.jquery.com/project/textshadow
 *
 */
(function($) {
  $.fn.textShadow = function(option) {

    // FAILSAFE - only applies to IE 9 and below
    if (!$.browser.msie || $.browser.version > 9) {
      return;
    }

    // detect IE6 -
    var IE6 = $.browser.version < 7;

    // add shadow to each subelement of this element
    return this.each(function() {

      // the subelement
      var el = $(this);

      // auto detect the shadow set via CSS
      var shadow = el.textShadowParse(this.currentStyle["text-shadow"]);

      // merge in options passed in as a parameter
      shadow = $.extend(shadow, option);

      // remove any existing shadow
      el.textShadowRemove();

      // FAILSAFE - DO NOT CONTINUE if all parameters are ZERO
      if (shadow.x == 0 && shadow.y == 0 && shadow.radius == 0) {
        return;
      }

      // Change to relative positioning on this element
      if (el.css("position") == "static") {
        el.css({position:"relative"});
      }

      // change z-index to 0
      el.css({zIndex:"0"});

      // remove existing filters
      el.css({filter:0});

      // if IE 6 set zoom to 1 - not sure why
      if (IE6) {
        el.css({zoom:"1"});
      }

      var span=document.createElement("span");
      $(span).addClass("jQueryTextShadow");
      // copy the original element html into the span
      $(span).html(el.html());
      $(span).css({
        padding:  this.currentStyle["padding"],
        margin:    this.currentStyle["margin"],
        width:    el.width(),
        position:  "absolute",
        zIndex:    "-1",
        color:    shadow.color!=null?shadow.color:el.css("color"),
        left:      (-parseInt(shadow.radius)+parseInt(shadow.x))+"px",
        top:      (-parseInt(shadow.radius)+parseInt(shadow.y))+"px"
      });
      $(span).children().css({
        color:    shadow.color!=null?shadow.color:el.css("color")
      });

      if (shadow.radius != 0) {
        if (shadow.opacity != null) {
          $(span).css("filter", "progid:DXImageTransform.Microsoft.Blur(pixelradius="+parseInt(shadow.radius)+", enabled='true', makeShadow='true', ShadowOpacity="+shadow.opacity+")");
        }
        else {
          $(span).css("filter", "progid:DXImageTransform.Microsoft.Blur(pixelradius="+parseInt(shadow.radius)+", enabled='true')");
        }
      }
      el.append(span);

    });
  };

  $.fn.textShadowParse = function(value) {
    value = String(value)
      .replace(/^\s+|\s+$/gi, '')
      .replace(/\s*!\s*important/i, '')
      .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3/$4)')
      .replace(/\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^\)]+)\s*\)/g, '($1/$2/$3)')

    var shadow = {
      x      : 0,
      y      : 0,
      radius : 0,
      color  : null
    };

    if (value.length > 1 || value[0].toLowerCase() != 'none') {
      value = value.replace(/\//g, ',');
      var color;
      if ( value.match(/(\#[0-9a-f]{6}|\#[0-9a-f]{3}|(rgb|hsb)a?\([^\)]*\)|\b[a-z]+\b)/i) && (color = RegExp.$1) ) {
        shadow.color = color.replace(/^\s+/, '');
        value = value.replace(shadow.color, '');
      }

      value = value
        .replace(/^\s+|\s+$/g, '')
        .split(/\s+/);
      value = $.map(value, function(item) {
        return (item || '').replace(/^0[a-z]*$/, '') ? item : 0 ;
      });

      switch (value.length) {
        case 1:
          shadow.x = shadow.y = value[0];
          break;
        case 2:
          shadow.x = value[0];
          shadow.y = value[1];
          break;
        case 3:
          shadow.x = value[0];
          shadow.y = value[1];
          shadow.radius = value[2];
          break;
      }
      if ((!shadow.x && !shadow.y && !shadow.radius) || shadow.color == 'transparent') {
        shadow.x = shadow.y = shadow.radius = 0;
        shadow.color = null;
      }
    }

    return shadow;
  };

  $.fn.textShadowRemove = function() {
    if (!$.browser.msie) return;
    return this.each(function() {
      $(this).children("span.jQueryTextShadow").remove();
    });
  };
})(jQuery);
;
