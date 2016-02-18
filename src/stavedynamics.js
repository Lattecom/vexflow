// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Lattecom
//
// ## Description
// StaveDynamics is rearranged from TextDynamics
// This can be added to note directly
//
// You can render any dynamics string that contains a combination of
// the following letters:  P, M, F, Z, R, S
Vex.Flow.StaveDynamics = (function(){
  function StaveDynamics(text) {
    if (arguments.length > 0) this.init(text);
  }

  // To enable logging for this class. Set `Vex.Flow.TextDynamics.DEBUG` to `true`.
  function L() { if (StaveDynamics.DEBUG) Vex.L("Vex.Flow.StaveDynamics", arguments); }

  // The glyph data for each dynamics letter
  StaveDynamics.GLYPHS = {
    "f": {
      code: "vba",
      width: 12
    },
    "p": {
      code: "vbf",
      width: 14
    },
    "m": {
      code: "v62",
      width: 17
    },
    "s": {
      code: "v4a",
      width: 10
    },
    "z": {
      code: "v80",
      width: 12
    },
    "r": {
      code: "vb1",
      width: 12
    }
  };

  // ## Prototype Methods
  //
  // A `TextDynamics` object inherits from `Note` so that it can be formatted
  // within a `Voice`.
  Vex.Inherit(StaveDynamics, Vex.Flow.Modifier, {
    // Create the dynamics marking. `text_struct` is an object
    // that contains a `duration` property and a `sequence` of
    // letters that represents the letters to render
    init: function(text) {
      StaveDynamics.superclass.init.call(this);

      this.sequence = text.toLowerCase();
      this.line =  0;
      this.glyphs = [];
      this.render_options = {};
      Vex.Merge(this.render_options, {
        glyph_font_size: 30
      });

      L("New Dynamics Text: ", this.sequence);

      this.preFormat();
    },

    // Set the Stave line on which the note should be placed
    setLine: function(line) { this.line = line;  return this; },

    // Preformat the dynamics text
    preFormat: function() {
      var total_width = 0;
      // Iterate through each letter
      this.sequence.split('').forEach(function(letter) {
        // Get the glyph data for the letter
        var glyph_data = StaveDynamics.GLYPHS[letter];
        if (!glyph_data) throw new Vex.RERR("Invalid dynamics character: " + letter);

        var size =  this.render_options.glyph_font_size;
        var glyph = new Vex.Flow.Glyph(glyph_data.code, size);

        // Add the glyph
        this.glyphs.push(glyph);

        total_width += glyph_data.width;
      }, this);

      // Store the width of the text
      this.setWidth(total_width);
      this.preFormatted = true;
      return this;
    },

    // Draw the dynamics text on the rendering context
    draw: function() {
      var x, y;


      x = this.note.getStemX() - (this.width / 2);

      var stem_ext, spacing;
      var has_stem = this.note.hasStem();
      var stave = this.note.getStave();

      // The position of the text varies based on whether or not the note
      // has a stem.
      if (has_stem) {
        stem_ext = this.note.getStem().getExtents();
        spacing = stave.getSpacingBetweenLines();
      }

      y = stave.getYForBottomText(this.text_line);
      if (has_stem) {
        var stem_base = (this.note.getStemDirection() === 1 ? stem_ext.baseY : stem_ext.topY);
        y = Math.max(y, stem_base + (spacing * (this.text_line + 2)));
      }

      L("Rendering Dynamics: ", this.sequence);

      var letter_x = x;
      this.glyphs.forEach(function(glyph, index) {
        var current_letter = this.sequence[index];
        glyph.render(this.context, letter_x, y);
        letter_x += StaveDynamics.GLYPHS[current_letter].width;
      }, this);
    }
  });

  return StaveDynamics;
})();
