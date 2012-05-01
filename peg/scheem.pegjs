start =
    expression

expression =
    atom:atom
    	{ return atom; }
  / "(" first:expression rest:spacedexpression* ")"
  		{ return [first].concat(rest); }

spacedexpression =
	" " expression:expression
    { return expression; }

validchar
    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }