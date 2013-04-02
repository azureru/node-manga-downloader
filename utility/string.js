/**
 * Collection of string utilities
 *
 * slug
 * trim
 * ltrim
 * fulltrim
 * pad
 * padLeft
 */

var replaceTable = {
    'á': 'a',
    'à': 'a',
    'â': 'a',
    'ã': 'a',
    'Á': 'A',
    'À': 'A',
    'Ã': 'A',
    'Â': 'A',

    'ê': 'e',
    'é': 'e',
    'É': 'E',

    'í': 'i',
    'ì': 'i',
    'î': 'i',
    'ĩ': 'i',
    'Í': 'I',
    'Ì': 'I',
    'Î': 'I',
    'Ĩ': 'I',

    'ó': 'o',
    'ò': 'o',
    'ô': 'o',
    'õ': 'o',
    'Ó': 'O',
    'Ò': 'O',
    'Ô': 'O',
    'Õ': 'O',

    'ú': 'u',
    'ù': 'u',
    'û': 'u',
    'ũ': 'u',
    'Ú': 'U',
    'Ù': 'U',
    'Û': 'U',
    'Ũ': 'U',

    'ç': 'c',
    'Ç': 'C',

    ' ' : '-'
};

String.prototype.slug = function () {
	if(!this) {
	  return this;
	}
	return this.toLowerCase().replace(/./g, function(c) {
	  	var match = replaceTable[c];
	  	return match ? match : c;
	});
};
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
String.prototype.pad = function(size, char) {
  var i, pad, _i, _size;
  if (char == null) {
    char = ' ';
  }
  if (typeof string === 'number') {
    _size = size;
    size = string;
    string = _size;
  }
  string = this.toString();
  pad = '';
  size = size - string.length;
  for (i = _i = 0; 0 <= size ? _i < size : _i > size; i = 0 <= size ? ++_i : --_i) {
    pad += char;
  }
  if (_size) {
    return pad + string;
  } else {
    return string + pad;
  }
};
String.prototype.padLeft = function(size, char) {
  var i, pad, _i, _size;
  if (char == null) {
    char = ' ';
  }
  if (typeof string === 'number') {
    _size = size;
    size = string;
    string = _size;
  }
  string = this.toString();
  pad = '';
  size = size - string.length;
  for (i = _i = 0; 0 <= size ? _i < size : _i > size; i = 0 <= size ? ++_i : --_i) {
    pad += char;
  }
   return pad + string;
};
