store.Model('Article', function() {
  // this is the `definition scope`
  this.validatesPresenceOf('name');

  this.html = function() {
    text = '<h1>' + this.name + '</h1>';
    text += '<h4>' + this.author + '</h4>';
    text += '<h4>Keywords: ' + this.keyword + '</h4>';
    text += this.inhalt;
    text = '<html><body>' + text + '</body></html>';
    return text;
  };

  this.tex = function() {
    let text = "\\documentclass{article}\n";
    text += "\\title{" + this.name + "}\n";
    text += "\\author{" + this.author + "}\n";
    text += "\\begin{document}\n";
    text += "\\maketitle\n";
    let inhalt_r = this.inhalt;
    inhalt_r = inhalt_r.replace(/&nbsp;/g, " ");
    inhalt_r = inhalt_r.replace(/<strong>([^<]*)<\/strong>/g, "\\textbf{$1}");
    inhalt_r = inhalt_r.replace(/<p>/g, "");
    inhalt_r = inhalt_r.replace(/<\/p>/g, "\n");
    text += inhalt_r;
    text += "\n";
    text += "\\end{document}\n";
    return text;
  };

});

