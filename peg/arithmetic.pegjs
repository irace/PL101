start =
    comma

comma =
	left:additive "," right:comma
    	{ return {tag: ",", left:left, right:right}; }
    / additive

additive =
    left:multiplicative "+" right:additive
        { return {tag: "+", left:left, right:right}; }
  / multiplicative

multiplicative =
    left:primary "*" right:multiplicative
        { return {tag: "*", left:left, right:right}; }
  / primary

primary =
    integer
  / "(" comma:comma ")"
      { return comma; }

integer =
    digits:[0-9]+
        { return parseInt(digits.join(""), 10); }