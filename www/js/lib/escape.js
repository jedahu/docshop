define(

{ html: function(str)
  { return str
    . replace(/&/, '&amp;')
    . replace(/</, '&lt;')
    . replace(/>/, '&gt;')
  }

});
