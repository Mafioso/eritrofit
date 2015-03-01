'use strict';

var PNGlib = require('pnglib');

var Identicon = function(hash, size, margin) {
  this.hash   = hash;
  this.size   = size   || 64;
  this.margin = margin || 0.08;
};

Identicon.prototype = {
  hash:   null,
  size:   null,
  margin: null,

  render: function(){
    var hash    = this.hash,
        size    = this.size,
        margin  = Math.floor(size * this.margin),
        cell    = Math.floor((size - (margin * 2)) / 4),
        image   = new PNGlib(size, size, 256);

    // light-grey background
    var fg      = image.color(242, 240, 241);

    // foreground is last 7 chars as hue
    var rgb     = this.hsl2rgb(parseInt(hash.substr(-7), 16) / 0xfffffff, 1, 0.5),
        bg      = image.color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);

    // the first 15 characters of the hash control the pixels (even/odd)
    // they are drawn down the middle first, then mirrored outwards
    var i, color;
    for (i = 0; i < 12; i++) {
      color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;

      if (i < 4) {
        this.rectangle(0 * cell + margin, i * cell + margin, cell, cell, color, image);
      } else if (i < 8) {
        this.rectangle(1 * cell + margin, (i - 4) * cell + margin, cell, cell, color, image);
      } else if (i < 12) {
        this.rectangle(2 * cell + margin, (i - 8) * cell + margin, cell, cell, color, image);
        this.rectangle(3 * cell + margin, (i - 8) * cell + margin, cell, cell, color, image);
      }

    }
    // for (i = 0; i < 15; i++) {
    //     color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
    //     if (i < 5) {
    //         this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
    //     } else if (i < 10) {
    //         this.rectangle(1 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
    //         this.rectangle(3 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
    //     } else if (i < 15) {
    //         this.rectangle(0 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
    //         this.rectangle(4 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
    //     }
    // }

    return image;
  },

  rectangle: function(x, y, w, h, color, image) {
      var i, j;
      for (i = x; i < x + w; i++) {
          for (j = y; j < y + h; j++) {
              image.buffer[image.index(i, j)] = color;
          }
      }
  },

  // adapted from: https://gist.github.com/aemkei/1325937
  hsl2rgb: function(h, s, b){
      h *= 6;
      s = [
          b += s *= b < 0.5 ? b : 1 - b,
          b - h % 1 * s * 2,
          b -= s *= 2,
          b,
          b + h % 1 * s,
          b + s
      ];

      return[
          s[ ~~h    % 6 ],  // red
          s[ (h|16) % 6 ],  // green
          s[ (h|8)  % 6 ]   // blue
      ];
  },

  toString: function(){
    return this.render().getBase64();
  }
};

module.exports = Identicon;
