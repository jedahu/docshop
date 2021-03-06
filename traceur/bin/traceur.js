var $__createClassNoExtends = function(object) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  return ctor;
}, $__superDescriptor = function(proto, name) {
  if (!proto) throw new TypeError('super is null');
  return Object.getPropertyDescriptor(proto, name);
}, $__superCall = function(self, proto, name, args) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if ('value'in descriptor) return descriptor.value.apply(self, args);
    if (descriptor.get) return descriptor.get.call(self).apply(self, args);
  }
  throw new TypeError("Object has no method '" + name + "'.");
}, $__getProtoParent = function(superClass) {
  if (typeof superClass === 'function') return superClass.prototype;
  if (superClass === null) return null;
  if (Object(superClass) === superClass) return superClass;
  throw new TypeError();
}, $__createClass = function(object, protoParent, superClass, hasConstructor) {
  var ctor = object.constructor;
  if (typeof superClass === 'function') {
    if (protoParent === null) throw new TypeError();
    ctor.__proto__ = superClass;
  } else if (superClass === null && !hasConstructor) {
    ctor = object.constructor = function() {};
  }
  var descriptors = {}, name, names = Object.getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  }
  descriptors.constructor.enumerable = false;
  ctor.prototype = Object.create(protoParent, descriptors);
  return ctor;
}, $__superGet = function(self, proto, name) {
  var descriptor = $__superDescriptor(proto, name);
  if (descriptor) {
    if (descriptor.get) return descriptor.get.call(self); else if ('value'in descriptor) return descriptor.value;
  }
  return undefined;
}, $__toObject = function(value) {
  if (value == null) throw TypeError();
  return Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
(function(global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    sourceMapModule['array-set'] = factory();
  }
}(this, function() {
  function ArraySet() {
    this._array = [];
    this._set = {};
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i]);
    }
    return set;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr) {
    if (this.has(aStr)) {
      return;
    }
    var idx = this._array.length;
    this._array.push(aStr);
    this._set[aStr] = idx;
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set, aStr);
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[aStr];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  return ArraySet;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    sourceMapModule.base64 = factory();
  }
}(this, function() {
  var exports = {};
  var charToIntMap = {};
  var intToCharMap = {};
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('').forEach(function(ch, index) {
    charToIntMap[ch] = index;
    intToCharMap[index] = ch;
  });
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
    }
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  };
  return exports;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    var base64 = require('./base64');
    module.exports = factory(base64);
  } else if (typeof define === 'function' && define.amd) {
    define(['source-map/base64'], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    sourceMapModule['base64-vlq'] = factory(sourceMapModule.base64);
  }
}(this, function(base64) {
  var exports = {};
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? ((- aValue) << 1) + 1: (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? - shifted: shifted;
  }
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports.decode = function base64VLQ_decode(aStr) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    return {
      value: fromVLQSigned(result),
      rest: aStr.slice(i)
    };
  };
  return exports;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    sourceMapModule['binary-search'] = factory();
  }
}(this, function() {
  var exports = {};
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid]);
    if (cmp === 0) {
      return aHaystack[mid];
    } else if (cmp > 0) {
      if (aHigh - mid > 1) {
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
      }
      return aHaystack[mid];
    } else {
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
      }
      return aLow < 0 ? null: aHaystack[aLow];
    }
  }
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0 ? recursiveSearch(- 1, aHaystack.length, aNeedle, aHaystack, aCompare): null;
  };
  return exports;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    sourceMapModule['util'] = factory();
  }
}(this, function() {
  var exports = {};
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;
  function join(aRoot, aPath) {
    return aPath.charAt(0) === '/' ? aPath: aRoot.replace(/\/*$/, '') + '/' + aPath;
  }
  exports.join = join;
  return exports;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    var base64VLQ = require('./base64-vlq');
    var util = require('./util');
    var ArraySet = require('./array-set').ArraySet;
    module.exports = factory(base64VLQ, util, ArraySet);
  } else if (typeof define === 'function' && define.amd) {
    define(['source-map/base64-vlq', 'source-map/util', 'source-map/array-set'], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    var base64VLQ = sourceMapModule['base64-vlq'];
    var util = sourceMapModule['util'];
    var ArraySet = sourceMapModule['array-set'];
    sourceMapModule['source-map-generator'] = factory(base64VLQ, util, ArraySet);
  }
}(this, function(base64VLQ, util, ArraySet) {
  function SourceMapGenerator(aArgs) {
    this._file = util.getArg(aArgs, 'file');
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);
    this._validateMapping(generated, original, source, name);
    if (source && !this._sources.has(source)) {
      this._sources.add(source);
    }
    if (name && !this._names.has(name)) {
      this._names.add(name);
    }
    this._mappings.push({
      generated: generated,
      original: original,
      source: source,
      name: name
    });
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aGenerated && 'line'in aGenerated && 'column'in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && 'line'in aGenerated && 'column'in aGenerated && aOriginal && 'line'in aOriginal && 'column'in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error('Invalid mapping.');
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var mapping;
    this._mappings.sort(function(mappingA, mappingB) {
      var cmp = mappingA.generated.line - mappingB.generated.line;
      return cmp === 0 ? mappingA.generated.column - mappingB.generated.column: cmp;
    });
    for (var i = 0, len = this._mappings.length; i < len; i++) {
      mapping = this._mappings[i];
      if (mapping.generated.line !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generated.line !== previousGeneratedLine) {
          result += ';';
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          result += ',';
        }
      }
      result += base64VLQ.encode(mapping.generated.column - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generated.column;
      if (mapping.source && mapping.original) {
        result += base64VLQ.encode(this._sources.indexOf(mapping.source) - previousSource);
        previousSource = this._sources.indexOf(mapping.source);
        result += base64VLQ.encode(mapping.original.line - 1 - previousOriginalLine);
        previousOriginalLine = mapping.original.line - 1;
        result += base64VLQ.encode(mapping.original.column - previousOriginalColumn);
        previousOriginalColumn = mapping.original.column;
        if (mapping.name) {
          result += base64VLQ.encode(this._names.indexOf(mapping.name) - previousName);
          previousName = this._names.indexOf(mapping.name);
        }
      }
    }
    return result;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    var map = {
      version: this._version,
      file: this._file,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._sourceRoot) {
      map.sourceRoot = this._sourceRoot;
    }
    return JSON.stringify(map);
  };
  return SourceMapGenerator;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    var util = require('./util');
    var binarySearch = require('./binary-search');
    var ArraySet = require('./array-set').ArraySet;
    var base64VLQ = require('./base64-vlq');
    module.exports = factory(util, binarySearch, ArraySet, base64VLQ);
  } else if (typeof define === 'function' && define.amd) {
    define(['source-map/util', 'source-map/binary-search', 'source-map/array-set', 'source-map/base64-vlq'], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    var util = sourceMapModule['util'];
    var binarySearch = sourceMapModule['binary-search'];
    var ArraySet = sourceMapModule['array-set'];
    var base64VLQ = sourceMapModule['base64-vlq'];
    sourceMapModule['source-map-consumer'] = factory(util, binarySearch, ArraySet, base64VLQ);
  }
}(this, function(util, binarySearch, ArraySet, base64VLQ) {
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap);
    }
    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    var names = util.getArg(sourceMap, 'names');
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file');
    if (version !== this._version) {
      throw new Error('Unsupported version: ' + version);
    }
    this._names = ArraySet.fromArray(names);
    this._sources = ArraySet.fromArray(sources);
    this._generatedMappings = [];
    this._parseMappings(mappings, sourceRoot);
  }
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var mappingSeparator = /^[,;]/;
    var str = aStr;
    var mapping;
    var temp;
    while (str.length > 0) {
      if (str.charAt(0) === ';') {
        generatedLine++;
        str = str.slice(1);
        previousGeneratedColumn = 0;
      } else if (str.charAt(0) === ',') {
        str = str.slice(1);
      } else {
        mapping = {};
        mapping.generatedLine = generatedLine;
        temp = base64VLQ.decode(str);
        mapping.generatedColumn = previousGeneratedColumn + temp.value;
        previousGeneratedColumn = mapping.generatedColumn;
        str = temp.rest;
        if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
          temp = base64VLQ.decode(str);
          if (aSourceRoot) {
            mapping.source = util.join(aSourceRoot, this._sources.at(previousSource + temp.value));
          } else {
            mapping.source = this._sources.at(previousSource + temp.value);
          }
          previousSource += temp.value;
          str = temp.rest;
          if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
            throw new Error('Found a source, but no line and column');
          }
          temp = base64VLQ.decode(str);
          mapping.originalLine = previousOriginalLine + temp.value;
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          str = temp.rest;
          if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
            throw new Error('Found a source and line, but no column');
          }
          temp = base64VLQ.decode(str);
          mapping.originalColumn = previousOriginalColumn + temp.value;
          previousOriginalColumn = mapping.originalColumn;
          str = temp.rest;
          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
            temp = base64VLQ.decode(str);
            mapping.name = this._names.at(previousName + temp.value);
            previousName += temp.value;
            str = temp.rest;
          }
        }
        this._generatedMappings.push(mapping);
      }
    }
  };
  SourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    function compare(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      return cmp === 0 ? mappingA.generatedColumn - mappingB.generatedColumn: cmp;
    }
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };
    if (needle.generatedLine <= 0) {
      throw new TypeError('Line must be greater than or equal to 1.');
    }
    if (needle.generatedColumn < 0) {
      throw new TypeError('Column must be greater than or equal to 0.');
    }
    var mapping = binarySearch.search(needle, this._generatedMappings, compare);
    if (mapping) {
      return {
        source: util.getArg(mapping, 'source', null),
        line: util.getArg(mapping, 'originalLine', null),
        column: util.getArg(mapping, 'originalColumn', null),
        name: util.getArg(mapping, 'name', null)
      };
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  return SourceMapConsumer;
}));
(function(global, factory) {
  if (typeof exports === 'object') {
    var SourceMapGenerator = require('./source-map-generator');
    module.exports = factory(SourceMapGenerator);
  } else if (typeof define === 'function' && define.amd) {
    define(['source-map/source-map-generator'], factory);
  } else {
    var sourceMapModule = global.sourceMapModule = global.sourceMapModule || {};
    var SourceMapGenerator = sourceMapModule['source-map-generator'];
    sourceMapModule['source-node'] = factory(SourceMapGenerator);
  }
}(this, function(SourceMapGenerator) {
  function SourceNode(aLine, aColumn, aSource, aChunks) {
    this.children = [];
    this.line = aLine;
    this.column = aColumn;
    this.source = aSource;
    if (aChunks) this.add(aChunks);
  }
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.push(aChunk);
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    this.children.forEach(function(chunk) {
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
      } else {
        if (chunk !== '') {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column
          });
        }
      }
    }, this);
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === 'string') {
      this.children[this.children.lenth - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
      }
      chunk.split('').forEach(function(char) {
        if (char === '\n') {
          generated.line++;
          generated.column = 0;
        } else {
          generated.column++;
        }
      });
    });
    return {
      code: generated.code,
      map: map
    };
  };
  return SourceNode;
}));
if (!this.traceur) this.traceur = {};
traceur.runtime = (function(global) {
  'use strict';
  var $call = Function.prototype.call.bind(Function.prototype.call);
  var $create = Object.create;
  var $defineProperty = Object.defineProperty;
  var $freeze = Object.freeze;
  var $getOwnPropertyNames = Object.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  var bind = Function.prototype.bind;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var method = nonEnum;
  Object.defineProperties(String.prototype, {
    startsWith: method(function(s) {
      return this.lastIndexOf(s, 0) === 0;
    }),
    endsWith: method(function(s) {
      var t = String(s);
      var l = this.length - t.length;
      return l >= 0 && this.indexOf(t, l) === l;
    }),
    contains: method(function(s) {
      return this.indexOf(s) !== - 1;
    }),
    toArray: method(function() {
      return this.split('');
    })
  });
  $defineProperty(String, 'raw', {
    value: function(callsite) {
      var raw = callsite.raw;
      var len = raw.length >>> 0;
      if (len === 0) return '';
      var s = '';
      var i = 0;
      while (true) {
        s += raw[i];
        if (i + 1 === len) return s;
        s += arguments[++i];
      }
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var nameRe = /^__\$(?:\d+)\$(?:\d+)\$__$/;
  var internalStringValueName = newUniqueString();
  function Name(string) {
    if (!string) string = newUniqueString();
    $defineProperty(this, internalStringValueName, {value: newUniqueString()});
    function toString() {
      return string;
    }
    $freeze(toString);
    $freeze(toString.prototype);
    var toStringDescr = method(toString);
    $defineProperty(this, 'toString', toStringDescr);
    this.public = $freeze($create(null, {toString: method($freeze(function toString() {
        return string;
      }))}));
    $freeze(this.public.toString.prototype);
    $freeze(this);
  }
  ;
  $freeze(Name);
  $freeze(Name.prototype);
  function assertName(val) {
    if (!NameModule.isName(val)) throw new TypeError(val + ' is not a Name');
    return val;
  }
  var elementDeleteName = new Name();
  var elementGetName = new Name();
  var elementSetName = new Name();
  var NameModule = $freeze({
    Name: function(str) {
      return new Name(str);
    },
    isName: function(x) {
      return x instanceof Name;
    },
    elementGet: elementGetName,
    elementSet: elementSetName,
    elementDelete: elementDeleteName
  });
  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);
  function getOwnPropertyNames(object) {
    return filter($getOwnPropertyNames(object), function(str) {
      return !nameRe.test(str);
    });
  }
  function hasOwnProperty(name) {
    if (NameModule.isName(name) || nameRe.test(name)) return false;
    return $hasOwnProperty.call(this, name);
  }
  function elementDelete(object, name) {
    if (traceur.options.trapMemberLookup && hasPrivateNameProperty(object, elementDeleteName)) {
      return getProperty(object, elementDeleteName).call(object, name);
    }
    return deleteProperty(object, name);
  }
  function elementGet(object, name) {
    if (traceur.options.trapMemberLookup && hasPrivateNameProperty(object, elementGetName)) {
      return getProperty(object, elementGetName).call(object, name);
    }
    return getProperty(object, name);
  }
  function elementHas(object, name) {
    return has(object, name);
  }
  function elementSet(object, name, value) {
    if (traceur.options.trapMemberLookup && hasPrivateNameProperty(object, elementSetName)) {
      getProperty(object, elementSetName).call(object, name, value);
    } else {
      setProperty(object, name, value);
    }
    return value;
  }
  function assertNotName(s) {
    if (nameRe.test(s)) throw Error('Invalid access to private name');
  }
  function deleteProperty(object, name) {
    if (NameModule.isName(name)) return delete object[name[internalStringValueName]];
    if (nameRe.test(name)) return true;
    return delete object[name];
  }
  function getProperty(object, name) {
    if (NameModule.isName(name)) return object[name[internalStringValueName]];
    if (nameRe.test(name)) return undefined;
    return object[name];
  }
  function hasPrivateNameProperty(object, name) {
    return name[internalStringValueName]in Object(object);
  }
  function has(object, name) {
    if (NameModule.isName(name) || nameRe.test(name)) return false;
    return name in Object(object);
  }
  function setProperty(object, name, value) {
    if (NameModule.isName(name)) {
      var descriptor = $getPropertyDescriptor(object, [name[internalStringValueName]]);
      if (descriptor) object[name[internalStringValueName]] = value; else $defineProperty(object, name[internalStringValueName], nonEnum(value));
    } else {
      assertNotName(name);
      object[name] = value;
    }
  }
  function defineProperty(object, name, descriptor) {
    if (NameModule.isName(name)) {
      if (descriptor.enumerable) {
        descriptor = Object.create(descriptor, {enumerable: {value: false}});
      }
      $defineProperty(object, name[internalStringValueName], descriptor);
    } else {
      assertNotName(name);
      $defineProperty(object, name, descriptor);
    }
  }
  function $getPropertyDescriptor(obj, name) {
    while (obj !== null) {
      var result = Object.getOwnPropertyDescriptor(obj, name);
      if (result) return result;
      obj = $getPrototypeOf(obj);
    }
    return undefined;
  }
  function getPropertyDescriptor(obj, name) {
    if (NameModule.isName(name)) return undefined;
    assertNotName(name);
    return $getPropertyDescriptor(obj, name);
  }
  $defineProperty(Object, 'defineProperty', {value: defineProperty});
  $defineProperty(Object, 'deleteProperty', method(deleteProperty));
  $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
  $defineProperty(Object, 'getProperty', method(getProperty));
  $defineProperty(Object, 'getPropertyDescriptor', method(getPropertyDescriptor));
  $defineProperty(Object, 'has', method(has));
  $defineProperty(Object, 'setProperty', method(setProperty));
  $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
  function is(left, right) {
    if (left === right) return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function isnt(left, right) {
    return !is(left, right);
  }
  $defineProperty(Object, 'is', method(is));
  var iteratorName = new Name('iterator');
  var IterModule = {get iterator() {
      return iteratorName;
    }};
  function getIterator(collection) {
    return getProperty(collection, iteratorName).call(collection);
  }
  function returnThis() {
    return this;
  }
  function addIterator(object) {
    setProperty(object, iteratorName, returnThis);
  }
  defineProperty(Array.prototype, IterModule.iterator, method(function() {
    var index = 0;
    var array = this;
    var current;
    return {
      get current() {
        return current;
      },
      moveNext: function() {
        if (index < array.length) {
          current = array[index++];
          return true;
        }
        return false;
      }
    };
  }));
  function Deferred(canceller) {
    this.canceller_ = canceller;
    this.listeners_ = [];
  }
  function notify(self) {
    while (self.listeners_.length > 0) {
      var current = self.listeners_.shift();
      var currentResult = undefined;
      try {
        try {
          if (self.result_[1]) {
            if (current.errback) currentResult = current.errback.call(undefined, self.result_[0]);
          } else {
            if (current.callback) currentResult = current.callback.call(undefined, self.result_[0]);
          }
          current.deferred.callback(currentResult);
        } catch (err) {
          current.deferred.errback(err);
        }
      } catch (unused) {}
    }
  }
  function fire(self, value, isError) {
    if (self.fired_) throw new Error('already fired');
    self.fired_ = true;
    self.result_ = [value, isError];
    notify(self);
  }
  Deferred.prototype = {
    fired_: false,
    result_: undefined,
    createPromise: function() {
      return {
        then: this.then.bind(this),
        cancel: this.cancel.bind(this)
      };
    },
    callback: function(value) {
      fire(this, value, false);
    },
    errback: function(err) {
      fire(this, err, true);
    },
    then: function(callback, errback) {
      var result = new Deferred(this.cancel.bind(this));
      this.listeners_.push({
        deferred: result,
        callback: callback,
        errback: errback
      });
      if (this.fired_) notify(this);
      return result.createPromise();
    },
    cancel: function() {
      if (this.fired_) throw new Error('already finished');
      var result;
      if (this.canceller_) {
        result = this.canceller_(this);
        if (!result instanceof Error) result = new Error(result);
      } else {
        result = new Error('cancelled');
      }
      if (!this.fired_) {
        this.result_ = [result, true];
        notify(this);
      }
    }
  };
  var modules = $freeze({
    get'@name'() {
      return NameModule;
    },
    get'@iter'() {
      return IterModule;
    }
  });
  global.Deferred = Deferred;
  return {
    Deferred: Deferred,
    addIterator: addIterator,
    assertName: assertName,
    createName: NameModule.Name,
    deleteProperty: deleteProperty,
    elementDelete: elementDelete,
    elementGet: elementGet,
    elementHas: elementHas,
    elementSet: elementSet,
    getIterator: getIterator,
    getProperty: getProperty,
    setProperty: setProperty,
    has: has,
    is: is,
    isnt: isnt,
    modules: modules
  };
})(this);
var $__src_options_js = (function() {
  "use strict";
  var Kind = {
    es6: 'es6',
    es6proposal: 'es6proposal',
    harmony: 'harmony',
    experimental: 'experimental'
  };
  var kindMapping = Object.create(null);
  Object.keys(Kind).forEach((function(kind) {
    kindMapping[kind] = Object.create(null);
  }));
  function enable(kind, b) {
    Object.keys(kindMapping[kind]).forEach((function(name) {
      options[name] = b;
    }));
  }
  function getValue(kind) {
    var value;
    Object.keys(kindMapping[kind]).every((function(name) {
      var currentValue = options[name];
      if (value === undefined) {
        value = currentValue;
        return true;
      }
      if (currentValue !== value) {
        value = null;
        return false;
      }
      return true;
    }));
    return value;
  }
  var parseOptions = Object.create(null);
  var transformOptions = Object.create(null);
  var defaultValues = Object.create(null);
  var options = {
    set es6(v) {
      enable(Kind.es6, coerceOptionValue(v));
    },
    get es6() {
      return getValue(Kind.es6);
    },
    set es6proposal(v) {
      enable(Kind.es6proposal, coerceOptionValue(v));
    },
    get es6proposal() {
      return getValue(Kind.es6proposal);
    },
    set harmony(v) {
      enable(Kind.harmony, coerceOptionValue(v));
    },
    get harmony() {
      return getValue(Kind.harmony);
    },
    set experimental(v) {
      enable(Kind.experimental, coerceOptionValue(v));
    },
    get experimental() {
      return getValue(Kind.experimental);
    }
  };
  function reset(opt_allOff) {
    var useDefault = opt_allOff === undefined;
    Object.keys(options).forEach((function(name) {
      options[name] = useDefault && defaultValues[name];
    }));
  }
  function fromString(s) {
    fromArgv(s.split(/\s+/));
  }
  function fromArgv(args) {
    args.forEach(parseCommand);
  }
  function setFromObject(object) {
    Object.keys(object).forEach((function(name) {
      options[name] = object[name];
    }));
  }
  function coerceOptionValue(v) {
    switch (v) {
      case 'false':
      case false:
        return false;
      case 'parse':
        return 'parse';
      default:
        return true;
    }
  }
  function setOption(name, value) {
    name = toCamelCase(name);
    value = coerceOptionValue(value);
    if (name in options) {
      options[name] = value;
    } else {
      throw Error('Unknown option: ' + name);
    }
  }
  function optionCallback(name, value) {
    setOption(name, value);
  }
  function addOptions(flags) {
    Object.keys(options).forEach(function(name) {
      var dashedName = toDashCase(name);
      if ((name in parseOptions) && (name in transformOptions)) flags.option('--' + dashedName + ' [true|false|parse]'); else flags.option('--' + dashedName + ' [true|false]');
      flags.on(dashedName, optionCallback.bind(null, dashedName));
    });
  }
  Object.defineProperties(options, {
    parse: {value: parseOptions},
    transform: {value: transformOptions},
    reset: {value: reset},
    fromString: {value: fromString},
    fromArgv: {value: fromArgv},
    setFromObject: {value: setFromObject},
    addOptions: {value: addOptions}
  });
  function parseCommand(s) {
    var re = /--([^=]+)(?:=(.+))?/;
    var m = re.exec(s);
    if (m) setOption(m[1], m[2]);
  }
  function toCamelCase(s) {
    return s.replace(/-\w/g, function(ch) {
      return ch[1].toUpperCase();
    });
  }
  function toDashCase(s) {
    return s.replace(/[A-W]/g, function(ch) {
      return '-' + ch.toLowerCase();
    });
  }
  function addFeatureOption(name, kind) {
    kindMapping[kind][name] = true;
    Object.defineProperty(options, name, {
      get: function() {
        if (parseOptions[name] === transformOptions[name]) {
          return parseOptions[name];
        }
        return 'parse';
      },
      set: function(v) {
        if (v === 'parse') {
          parseOptions[name] = true;
          transformOptions[name] = false;
        } else {
          parseOptions[name] = transformOptions[name] = Boolean(v);
        }
      },
      enumerable: true,
      configurable: true
    });
    var defaultValue = kind !== Kind.experimental;
    defaultValues[name] = defaultValue;
    parseOptions[name] = defaultValue;
    transformOptions[name] = defaultValue;
  }
  function addBoolOption(name) {
    defaultValues[name] = true;
    options[name] = true;
  }
  addFeatureOption('arrayComprehension', Kind.es6);
  addFeatureOption('arrowFunctions', Kind.es6);
  addFeatureOption('blockBinding', Kind.es6);
  addFeatureOption('classes', Kind.es6);
  addFeatureOption('defaultParameters', Kind.es6);
  addFeatureOption('destructuring', Kind.es6);
  addFeatureOption('forOf', Kind.es6);
  addFeatureOption('isExpression', Kind.es6);
  addFeatureOption('propertyMethods', Kind.es6);
  addFeatureOption('propertyNameShorthand', Kind.es6);
  addFeatureOption('templateLiterals', Kind.es6);
  addFeatureOption('restParameters', Kind.es6);
  addFeatureOption('spread', Kind.es6);
  addFeatureOption('generatorComprehension', Kind.es6proposal);
  addFeatureOption('generators', Kind.es6proposal);
  addFeatureOption('modules', Kind.es6proposal);
  addFeatureOption('privateNameSyntax', Kind.es6proposal);
  addFeatureOption('privateNames', Kind.es6proposal);
  addFeatureOption('cascadeExpression', Kind.experimental);
  addFeatureOption('trapMemberLookup', Kind.experimental);
  addFeatureOption('deferredFunctions', Kind.experimental);
  addFeatureOption('propertyOptionalComma', Kind.experimental);
  addFeatureOption('strictSemicolons', Kind.experimental);
  addFeatureOption('types', Kind.experimental);
  addBoolOption('debug');
  addBoolOption('sourceMaps');
  addBoolOption('freeVariableChecker');
  addBoolOption('validate');
  return Object.preventExtensions(Object.create(null, {
    parseOptions: {
      get: function() {
        return parseOptions;
      },
      enumerable: true
    },
    transformOptions: {
      get: function() {
        return transformOptions;
      },
      enumerable: true
    },
    options: {
      get: function() {
        return options;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_semantics_symbols_SymbolType_js = (function() {
  "use strict";
  var SymbolType = {
    EXPORT: 'EXPORT',
    MODULE: 'MODULE'
  };
  return Object.preventExtensions(Object.create(null, {SymbolType: {
      get: function() {
        return SymbolType;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_symbols_Symbol_js = (function() {
  "use strict";
  var SymbolType = $__src_semantics_symbols_SymbolType_js.SymbolType;
  var Symbol = function() {
    var $Symbol = ($__createClassNoExtends)({
      constructor: function(type, tree, name) {
        this.type = type;
        this.tree = tree;
        this.name = name;
      },
      asExport: function() {
        traceur.assert(this.type == SymbolType.EXPORT);
        return this;
      },
      asModuleSymbol: function() {
        traceur.assert(this.type == SymbolType.MODULE);
        return this;
      }
    });
    return $Symbol;
  }();
  return Object.preventExtensions(Object.create(null, {Symbol: {
      get: function() {
        return Symbol;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_symbols_ExportSymbol_js = (function() {
  "use strict";
  var Symbol = $__src_semantics_symbols_Symbol_js.Symbol;
  var SymbolType = $__src_semantics_symbols_SymbolType_js.SymbolType;
  var ExportSymbol = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportSymbol = ($__createClass)({constructor: function(tree, name, relatedTree) {
        $__superCall(this, $__proto, "constructor", [SymbolType.EXPORT, tree, name]);
        this.relatedTree = relatedTree;
      }}, $__proto, $__super, true);
    return $ExportSymbol;
  }(Symbol);
  return Object.preventExtensions(Object.create(null, {ExportSymbol: {
      get: function() {
        return ExportSymbol;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_trees_ParseTreeType_js = (function() {
  "use strict";
  var ARGUMENT_LIST = 'ARGUMENT_LIST';
  var ARRAY_COMPREHENSION = 'ARRAY_COMPREHENSION';
  var ARRAY_LITERAL_EXPRESSION = 'ARRAY_LITERAL_EXPRESSION';
  var ARRAY_PATTERN = 'ARRAY_PATTERN';
  var ARROW_FUNCTION_EXPRESSION = 'ARROW_FUNCTION_EXPRESSION';
  var AT_NAME_DECLARATION = 'AT_NAME_DECLARATION';
  var AT_NAME_EXPRESSION = 'AT_NAME_EXPRESSION';
  var AWAIT_STATEMENT = 'AWAIT_STATEMENT';
  var BINARY_OPERATOR = 'BINARY_OPERATOR';
  var BINDING_ELEMENT = 'BINDING_ELEMENT';
  var BINDING_IDENTIFIER = 'BINDING_IDENTIFIER';
  var BLOCK = 'BLOCK';
  var BREAK_STATEMENT = 'BREAK_STATEMENT';
  var CALL_EXPRESSION = 'CALL_EXPRESSION';
  var CASCADE_EXPRESSION = 'CASCADE_EXPRESSION';
  var CASE_CLAUSE = 'CASE_CLAUSE';
  var CATCH = 'CATCH';
  var CLASS_DECLARATION = 'CLASS_DECLARATION';
  var CLASS_EXPRESSION = 'CLASS_EXPRESSION';
  var COMMA_EXPRESSION = 'COMMA_EXPRESSION';
  var COMPREHENSION_FOR = 'COMPREHENSION_FOR';
  var CONDITIONAL_EXPRESSION = 'CONDITIONAL_EXPRESSION';
  var CONTINUE_STATEMENT = 'CONTINUE_STATEMENT';
  var COVER_FORMALS = 'COVER_FORMALS';
  var DEBUGGER_STATEMENT = 'DEBUGGER_STATEMENT';
  var DEFAULT_CLAUSE = 'DEFAULT_CLAUSE';
  var DO_WHILE_STATEMENT = 'DO_WHILE_STATEMENT';
  var EMPTY_STATEMENT = 'EMPTY_STATEMENT';
  var EXPORT_DECLARATION = 'EXPORT_DECLARATION';
  var EXPORT_MAPPING = 'EXPORT_MAPPING';
  var EXPORT_MAPPING_LIST = 'EXPORT_MAPPING_LIST';
  var EXPORT_SPECIFIER = 'EXPORT_SPECIFIER';
  var EXPORT_SPECIFIER_SET = 'EXPORT_SPECIFIER_SET';
  var EXPORT_STAR = 'EXPORT_STAR';
  var EXPRESSION_STATEMENT = 'EXPRESSION_STATEMENT';
  var FINALLY = 'FINALLY';
  var FOR_IN_STATEMENT = 'FOR_IN_STATEMENT';
  var FOR_OF_STATEMENT = 'FOR_OF_STATEMENT';
  var FOR_STATEMENT = 'FOR_STATEMENT';
  var FORMAL_PARAMETER_LIST = 'FORMAL_PARAMETER_LIST';
  var FUNCTION_DECLARATION = 'FUNCTION_DECLARATION';
  var FUNCTION_EXPRESSION = 'FUNCTION_EXPRESSION';
  var GENERATOR_COMPREHENSION = 'GENERATOR_COMPREHENSION';
  var GET_ACCESSOR = 'GET_ACCESSOR';
  var IDENTIFIER_EXPRESSION = 'IDENTIFIER_EXPRESSION';
  var IF_STATEMENT = 'IF_STATEMENT';
  var IMPORT_BINDING = 'IMPORT_BINDING';
  var IMPORT_DECLARATION = 'IMPORT_DECLARATION';
  var IMPORT_SPECIFIER = 'IMPORT_SPECIFIER';
  var IMPORT_SPECIFIER_SET = 'IMPORT_SPECIFIER_SET';
  var LABELLED_STATEMENT = 'LABELLED_STATEMENT';
  var LITERAL_EXPRESSION = 'LITERAL_EXPRESSION';
  var MEMBER_EXPRESSION = 'MEMBER_EXPRESSION';
  var MEMBER_LOOKUP_EXPRESSION = 'MEMBER_LOOKUP_EXPRESSION';
  var MISSING_PRIMARY_EXPRESSION = 'MISSING_PRIMARY_EXPRESSION';
  var MODULE_DECLARATION = 'MODULE_DECLARATION';
  var MODULE_DEFINITION = 'MODULE_DEFINITION';
  var MODULE_EXPRESSION = 'MODULE_EXPRESSION';
  var MODULE_REQUIRE = 'MODULE_REQUIRE';
  var MODULE_SPECIFIER = 'MODULE_SPECIFIER';
  var NAME_STATEMENT = 'NAME_STATEMENT';
  var NEW_EXPRESSION = 'NEW_EXPRESSION';
  var OBJECT_LITERAL_EXPRESSION = 'OBJECT_LITERAL_EXPRESSION';
  var OBJECT_PATTERN = 'OBJECT_PATTERN';
  var OBJECT_PATTERN_FIELD = 'OBJECT_PATTERN_FIELD';
  var PAREN_EXPRESSION = 'PAREN_EXPRESSION';
  var POSTFIX_EXPRESSION = 'POSTFIX_EXPRESSION';
  var PREDEFINED_TYPE = 'PREDEFINED_TYPE';
  var PROGRAM = 'PROGRAM';
  var PROPERTY_METHOD_ASSIGNMENT = 'PROPERTY_METHOD_ASSIGNMENT';
  var PROPERTY_NAME_ASSIGNMENT = 'PROPERTY_NAME_ASSIGNMENT';
  var PROPERTY_NAME_SHORTHAND = 'PROPERTY_NAME_SHORTHAND';
  var REST_PARAMETER = 'REST_PARAMETER';
  var RETURN_STATEMENT = 'RETURN_STATEMENT';
  var SET_ACCESSOR = 'SET_ACCESSOR';
  var SPREAD_EXPRESSION = 'SPREAD_EXPRESSION';
  var SPREAD_PATTERN_ELEMENT = 'SPREAD_PATTERN_ELEMENT';
  var STATE_MACHINE = 'STATE_MACHINE';
  var SUPER_EXPRESSION = 'SUPER_EXPRESSION';
  var SWITCH_STATEMENT = 'SWITCH_STATEMENT';
  var TEMPLATE_LITERAL_EXPRESSION = 'TEMPLATE_LITERAL_EXPRESSION';
  var TEMPLATE_LITERAL_PORTION = 'TEMPLATE_LITERAL_PORTION';
  var TEMPLATE_SUBSTITUTION = 'TEMPLATE_SUBSTITUTION';
  var THIS_EXPRESSION = 'THIS_EXPRESSION';
  var THROW_STATEMENT = 'THROW_STATEMENT';
  var TRY_STATEMENT = 'TRY_STATEMENT';
  var TYPE_NAME = 'TYPE_NAME';
  var UNARY_EXPRESSION = 'UNARY_EXPRESSION';
  var VARIABLE_DECLARATION = 'VARIABLE_DECLARATION';
  var VARIABLE_DECLARATION_LIST = 'VARIABLE_DECLARATION_LIST';
  var VARIABLE_STATEMENT = 'VARIABLE_STATEMENT';
  var WHILE_STATEMENT = 'WHILE_STATEMENT';
  var WITH_STATEMENT = 'WITH_STATEMENT';
  var YIELD_EXPRESSION = 'YIELD_EXPRESSION';
  return Object.preventExtensions(Object.create(null, {
    ARGUMENT_LIST: {
      get: function() {
        return ARGUMENT_LIST;
      },
      enumerable: true
    },
    ARRAY_COMPREHENSION: {
      get: function() {
        return ARRAY_COMPREHENSION;
      },
      enumerable: true
    },
    ARRAY_LITERAL_EXPRESSION: {
      get: function() {
        return ARRAY_LITERAL_EXPRESSION;
      },
      enumerable: true
    },
    ARRAY_PATTERN: {
      get: function() {
        return ARRAY_PATTERN;
      },
      enumerable: true
    },
    ARROW_FUNCTION_EXPRESSION: {
      get: function() {
        return ARROW_FUNCTION_EXPRESSION;
      },
      enumerable: true
    },
    AT_NAME_DECLARATION: {
      get: function() {
        return AT_NAME_DECLARATION;
      },
      enumerable: true
    },
    AT_NAME_EXPRESSION: {
      get: function() {
        return AT_NAME_EXPRESSION;
      },
      enumerable: true
    },
    AWAIT_STATEMENT: {
      get: function() {
        return AWAIT_STATEMENT;
      },
      enumerable: true
    },
    BINARY_OPERATOR: {
      get: function() {
        return BINARY_OPERATOR;
      },
      enumerable: true
    },
    BINDING_ELEMENT: {
      get: function() {
        return BINDING_ELEMENT;
      },
      enumerable: true
    },
    BINDING_IDENTIFIER: {
      get: function() {
        return BINDING_IDENTIFIER;
      },
      enumerable: true
    },
    BLOCK: {
      get: function() {
        return BLOCK;
      },
      enumerable: true
    },
    BREAK_STATEMENT: {
      get: function() {
        return BREAK_STATEMENT;
      },
      enumerable: true
    },
    CALL_EXPRESSION: {
      get: function() {
        return CALL_EXPRESSION;
      },
      enumerable: true
    },
    CASCADE_EXPRESSION: {
      get: function() {
        return CASCADE_EXPRESSION;
      },
      enumerable: true
    },
    CASE_CLAUSE: {
      get: function() {
        return CASE_CLAUSE;
      },
      enumerable: true
    },
    CATCH: {
      get: function() {
        return CATCH;
      },
      enumerable: true
    },
    CLASS_DECLARATION: {
      get: function() {
        return CLASS_DECLARATION;
      },
      enumerable: true
    },
    CLASS_EXPRESSION: {
      get: function() {
        return CLASS_EXPRESSION;
      },
      enumerable: true
    },
    COMMA_EXPRESSION: {
      get: function() {
        return COMMA_EXPRESSION;
      },
      enumerable: true
    },
    COMPREHENSION_FOR: {
      get: function() {
        return COMPREHENSION_FOR;
      },
      enumerable: true
    },
    CONDITIONAL_EXPRESSION: {
      get: function() {
        return CONDITIONAL_EXPRESSION;
      },
      enumerable: true
    },
    CONTINUE_STATEMENT: {
      get: function() {
        return CONTINUE_STATEMENT;
      },
      enumerable: true
    },
    COVER_FORMALS: {
      get: function() {
        return COVER_FORMALS;
      },
      enumerable: true
    },
    DEBUGGER_STATEMENT: {
      get: function() {
        return DEBUGGER_STATEMENT;
      },
      enumerable: true
    },
    DEFAULT_CLAUSE: {
      get: function() {
        return DEFAULT_CLAUSE;
      },
      enumerable: true
    },
    DO_WHILE_STATEMENT: {
      get: function() {
        return DO_WHILE_STATEMENT;
      },
      enumerable: true
    },
    EMPTY_STATEMENT: {
      get: function() {
        return EMPTY_STATEMENT;
      },
      enumerable: true
    },
    EXPORT_DECLARATION: {
      get: function() {
        return EXPORT_DECLARATION;
      },
      enumerable: true
    },
    EXPORT_MAPPING: {
      get: function() {
        return EXPORT_MAPPING;
      },
      enumerable: true
    },
    EXPORT_MAPPING_LIST: {
      get: function() {
        return EXPORT_MAPPING_LIST;
      },
      enumerable: true
    },
    EXPORT_SPECIFIER: {
      get: function() {
        return EXPORT_SPECIFIER;
      },
      enumerable: true
    },
    EXPORT_SPECIFIER_SET: {
      get: function() {
        return EXPORT_SPECIFIER_SET;
      },
      enumerable: true
    },
    EXPORT_STAR: {
      get: function() {
        return EXPORT_STAR;
      },
      enumerable: true
    },
    EXPRESSION_STATEMENT: {
      get: function() {
        return EXPRESSION_STATEMENT;
      },
      enumerable: true
    },
    FINALLY: {
      get: function() {
        return FINALLY;
      },
      enumerable: true
    },
    FOR_IN_STATEMENT: {
      get: function() {
        return FOR_IN_STATEMENT;
      },
      enumerable: true
    },
    FOR_OF_STATEMENT: {
      get: function() {
        return FOR_OF_STATEMENT;
      },
      enumerable: true
    },
    FOR_STATEMENT: {
      get: function() {
        return FOR_STATEMENT;
      },
      enumerable: true
    },
    FORMAL_PARAMETER_LIST: {
      get: function() {
        return FORMAL_PARAMETER_LIST;
      },
      enumerable: true
    },
    FUNCTION_DECLARATION: {
      get: function() {
        return FUNCTION_DECLARATION;
      },
      enumerable: true
    },
    FUNCTION_EXPRESSION: {
      get: function() {
        return FUNCTION_EXPRESSION;
      },
      enumerable: true
    },
    GENERATOR_COMPREHENSION: {
      get: function() {
        return GENERATOR_COMPREHENSION;
      },
      enumerable: true
    },
    GET_ACCESSOR: {
      get: function() {
        return GET_ACCESSOR;
      },
      enumerable: true
    },
    IDENTIFIER_EXPRESSION: {
      get: function() {
        return IDENTIFIER_EXPRESSION;
      },
      enumerable: true
    },
    IF_STATEMENT: {
      get: function() {
        return IF_STATEMENT;
      },
      enumerable: true
    },
    IMPORT_BINDING: {
      get: function() {
        return IMPORT_BINDING;
      },
      enumerable: true
    },
    IMPORT_DECLARATION: {
      get: function() {
        return IMPORT_DECLARATION;
      },
      enumerable: true
    },
    IMPORT_SPECIFIER: {
      get: function() {
        return IMPORT_SPECIFIER;
      },
      enumerable: true
    },
    IMPORT_SPECIFIER_SET: {
      get: function() {
        return IMPORT_SPECIFIER_SET;
      },
      enumerable: true
    },
    LABELLED_STATEMENT: {
      get: function() {
        return LABELLED_STATEMENT;
      },
      enumerable: true
    },
    LITERAL_EXPRESSION: {
      get: function() {
        return LITERAL_EXPRESSION;
      },
      enumerable: true
    },
    MEMBER_EXPRESSION: {
      get: function() {
        return MEMBER_EXPRESSION;
      },
      enumerable: true
    },
    MEMBER_LOOKUP_EXPRESSION: {
      get: function() {
        return MEMBER_LOOKUP_EXPRESSION;
      },
      enumerable: true
    },
    MISSING_PRIMARY_EXPRESSION: {
      get: function() {
        return MISSING_PRIMARY_EXPRESSION;
      },
      enumerable: true
    },
    MODULE_DECLARATION: {
      get: function() {
        return MODULE_DECLARATION;
      },
      enumerable: true
    },
    MODULE_DEFINITION: {
      get: function() {
        return MODULE_DEFINITION;
      },
      enumerable: true
    },
    MODULE_EXPRESSION: {
      get: function() {
        return MODULE_EXPRESSION;
      },
      enumerable: true
    },
    MODULE_REQUIRE: {
      get: function() {
        return MODULE_REQUIRE;
      },
      enumerable: true
    },
    MODULE_SPECIFIER: {
      get: function() {
        return MODULE_SPECIFIER;
      },
      enumerable: true
    },
    NAME_STATEMENT: {
      get: function() {
        return NAME_STATEMENT;
      },
      enumerable: true
    },
    NEW_EXPRESSION: {
      get: function() {
        return NEW_EXPRESSION;
      },
      enumerable: true
    },
    OBJECT_LITERAL_EXPRESSION: {
      get: function() {
        return OBJECT_LITERAL_EXPRESSION;
      },
      enumerable: true
    },
    OBJECT_PATTERN: {
      get: function() {
        return OBJECT_PATTERN;
      },
      enumerable: true
    },
    OBJECT_PATTERN_FIELD: {
      get: function() {
        return OBJECT_PATTERN_FIELD;
      },
      enumerable: true
    },
    PAREN_EXPRESSION: {
      get: function() {
        return PAREN_EXPRESSION;
      },
      enumerable: true
    },
    POSTFIX_EXPRESSION: {
      get: function() {
        return POSTFIX_EXPRESSION;
      },
      enumerable: true
    },
    PREDEFINED_TYPE: {
      get: function() {
        return PREDEFINED_TYPE;
      },
      enumerable: true
    },
    PROGRAM: {
      get: function() {
        return PROGRAM;
      },
      enumerable: true
    },
    PROPERTY_METHOD_ASSIGNMENT: {
      get: function() {
        return PROPERTY_METHOD_ASSIGNMENT;
      },
      enumerable: true
    },
    PROPERTY_NAME_ASSIGNMENT: {
      get: function() {
        return PROPERTY_NAME_ASSIGNMENT;
      },
      enumerable: true
    },
    PROPERTY_NAME_SHORTHAND: {
      get: function() {
        return PROPERTY_NAME_SHORTHAND;
      },
      enumerable: true
    },
    REST_PARAMETER: {
      get: function() {
        return REST_PARAMETER;
      },
      enumerable: true
    },
    RETURN_STATEMENT: {
      get: function() {
        return RETURN_STATEMENT;
      },
      enumerable: true
    },
    SET_ACCESSOR: {
      get: function() {
        return SET_ACCESSOR;
      },
      enumerable: true
    },
    SPREAD_EXPRESSION: {
      get: function() {
        return SPREAD_EXPRESSION;
      },
      enumerable: true
    },
    SPREAD_PATTERN_ELEMENT: {
      get: function() {
        return SPREAD_PATTERN_ELEMENT;
      },
      enumerable: true
    },
    STATE_MACHINE: {
      get: function() {
        return STATE_MACHINE;
      },
      enumerable: true
    },
    SUPER_EXPRESSION: {
      get: function() {
        return SUPER_EXPRESSION;
      },
      enumerable: true
    },
    SWITCH_STATEMENT: {
      get: function() {
        return SWITCH_STATEMENT;
      },
      enumerable: true
    },
    TEMPLATE_LITERAL_EXPRESSION: {
      get: function() {
        return TEMPLATE_LITERAL_EXPRESSION;
      },
      enumerable: true
    },
    TEMPLATE_LITERAL_PORTION: {
      get: function() {
        return TEMPLATE_LITERAL_PORTION;
      },
      enumerable: true
    },
    TEMPLATE_SUBSTITUTION: {
      get: function() {
        return TEMPLATE_SUBSTITUTION;
      },
      enumerable: true
    },
    THIS_EXPRESSION: {
      get: function() {
        return THIS_EXPRESSION;
      },
      enumerable: true
    },
    THROW_STATEMENT: {
      get: function() {
        return THROW_STATEMENT;
      },
      enumerable: true
    },
    TRY_STATEMENT: {
      get: function() {
        return TRY_STATEMENT;
      },
      enumerable: true
    },
    TYPE_NAME: {
      get: function() {
        return TYPE_NAME;
      },
      enumerable: true
    },
    UNARY_EXPRESSION: {
      get: function() {
        return UNARY_EXPRESSION;
      },
      enumerable: true
    },
    VARIABLE_DECLARATION: {
      get: function() {
        return VARIABLE_DECLARATION;
      },
      enumerable: true
    },
    VARIABLE_DECLARATION_LIST: {
      get: function() {
        return VARIABLE_DECLARATION_LIST;
      },
      enumerable: true
    },
    VARIABLE_STATEMENT: {
      get: function() {
        return VARIABLE_STATEMENT;
      },
      enumerable: true
    },
    WHILE_STATEMENT: {
      get: function() {
        return WHILE_STATEMENT;
      },
      enumerable: true
    },
    WITH_STATEMENT: {
      get: function() {
        return WITH_STATEMENT;
      },
      enumerable: true
    },
    YIELD_EXPRESSION: {
      get: function() {
        return YIELD_EXPRESSION;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_util_SourceRange_js = (function() {
  "use strict";
  var SourceRange = function() {
    var $SourceRange = ($__createClassNoExtends)({constructor: function(start, end) {
        this.start = start;
        this.end = end;
      }});
    return $SourceRange;
  }();
  return Object.preventExtensions(Object.create(null, {SourceRange: {
      get: function() {
        return SourceRange;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_trees_ParseTree_js = (function() {
  "use strict";
  var ParseTreeType = $__src_syntax_trees_ParseTreeType_js;
  var SourceRange = $__src_util_SourceRange_js.SourceRange;
  var $__9 = ParseTreeType, ARGUMENT_LIST = $__9.ARGUMENT_LIST, ARRAY_COMPREHENSION = $__9.ARRAY_COMPREHENSION, ARRAY_LITERAL_EXPRESSION = $__9.ARRAY_LITERAL_EXPRESSION, ARRAY_PATTERN = $__9.ARRAY_PATTERN, ARROW_FUNCTION_EXPRESSION = $__9.ARROW_FUNCTION_EXPRESSION, AT_NAME_DECLARATION = $__9.AT_NAME_DECLARATION, AT_NAME_EXPRESSION = $__9.AT_NAME_EXPRESSION, AWAIT_STATEMENT = $__9.AWAIT_STATEMENT, BINARY_OPERATOR = $__9.BINARY_OPERATOR, BINDING_ELEMENT = $__9.BINDING_ELEMENT, BINDING_IDENTIFIER = $__9.BINDING_IDENTIFIER, BLOCK = $__9.BLOCK, BREAK_STATEMENT = $__9.BREAK_STATEMENT, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, CASE_CLAUSE = $__9.CASE_CLAUSE, CATCH = $__9.CATCH, CLASS_DECLARATION = $__9.CLASS_DECLARATION, CLASS_EXPRESSION = $__9.CLASS_EXPRESSION, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, COMPREHENSION_FOR = $__9.COMPREHENSION_FOR, CONDITIONAL_EXPRESSION = $__9.CONDITIONAL_EXPRESSION, CONTINUE_STATEMENT = $__9.CONTINUE_STATEMENT, COVER_FORMALS = $__9.COVER_FORMALS, DEBUGGER_STATEMENT = $__9.DEBUGGER_STATEMENT, DEFAULT_CLAUSE = $__9.DEFAULT_CLAUSE, DO_WHILE_STATEMENT = $__9.DO_WHILE_STATEMENT, EMPTY_STATEMENT = $__9.EMPTY_STATEMENT, EXPORT_DECLARATION = $__9.EXPORT_DECLARATION, EXPORT_MAPPING = $__9.EXPORT_MAPPING, EXPORT_MAPPING_LIST = $__9.EXPORT_MAPPING_LIST, EXPORT_SPECIFIER = $__9.EXPORT_SPECIFIER, EXPORT_SPECIFIER_SET = $__9.EXPORT_SPECIFIER_SET, EXPORT_STAR = $__9.EXPORT_STAR, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, FINALLY = $__9.FINALLY, FOR_IN_STATEMENT = $__9.FOR_IN_STATEMENT, FOR_OF_STATEMENT = $__9.FOR_OF_STATEMENT, FOR_STATEMENT = $__9.FOR_STATEMENT, FORMAL_PARAMETER_LIST = $__9.FORMAL_PARAMETER_LIST, FUNCTION_DECLARATION = $__9.FUNCTION_DECLARATION, FUNCTION_EXPRESSION = $__9.FUNCTION_EXPRESSION, GENERATOR_COMPREHENSION = $__9.GENERATOR_COMPREHENSION, GET_ACCESSOR = $__9.GET_ACCESSOR, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, IF_STATEMENT = $__9.IF_STATEMENT, IMPORT_BINDING = $__9.IMPORT_BINDING, IMPORT_DECLARATION = $__9.IMPORT_DECLARATION, IMPORT_SPECIFIER = $__9.IMPORT_SPECIFIER, IMPORT_SPECIFIER_SET = $__9.IMPORT_SPECIFIER_SET, LABELLED_STATEMENT = $__9.LABELLED_STATEMENT, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, MISSING_PRIMARY_EXPRESSION = $__9.MISSING_PRIMARY_EXPRESSION, MODULE_DECLARATION = $__9.MODULE_DECLARATION, MODULE_DEFINITION = $__9.MODULE_DEFINITION, MODULE_EXPRESSION = $__9.MODULE_EXPRESSION, MODULE_REQUIRE = $__9.MODULE_REQUIRE, MODULE_SPECIFIER = $__9.MODULE_SPECIFIER, NAME_STATEMENT = $__9.NAME_STATEMENT, NEW_EXPRESSION = $__9.NEW_EXPRESSION, OBJECT_LITERAL_EXPRESSION = $__9.OBJECT_LITERAL_EXPRESSION, OBJECT_PATTERN = $__9.OBJECT_PATTERN, OBJECT_PATTERN_FIELD = $__9.OBJECT_PATTERN_FIELD, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, POSTFIX_EXPRESSION = $__9.POSTFIX_EXPRESSION, PREDEFINED_TYPE = $__9.PREDEFINED_TYPE, PROGRAM = $__9.PROGRAM, PROPERTY_METHOD_ASSIGNMENT = $__9.PROPERTY_METHOD_ASSIGNMENT, PROPERTY_NAME_ASSIGNMENT = $__9.PROPERTY_NAME_ASSIGNMENT, PROPERTY_NAME_SHORTHAND = $__9.PROPERTY_NAME_SHORTHAND, REST_PARAMETER = $__9.REST_PARAMETER, RETURN_STATEMENT = $__9.RETURN_STATEMENT, SET_ACCESSOR = $__9.SET_ACCESSOR, SPREAD_EXPRESSION = $__9.SPREAD_EXPRESSION, SPREAD_PATTERN_ELEMENT = $__9.SPREAD_PATTERN_ELEMENT, STATE_MACHINE = $__9.STATE_MACHINE, SUPER_EXPRESSION = $__9.SUPER_EXPRESSION, SWITCH_STATEMENT = $__9.SWITCH_STATEMENT, TEMPLATE_LITERAL_EXPRESSION = $__9.TEMPLATE_LITERAL_EXPRESSION, TEMPLATE_LITERAL_PORTION = $__9.TEMPLATE_LITERAL_PORTION, TEMPLATE_SUBSTITUTION = $__9.TEMPLATE_SUBSTITUTION, THIS_EXPRESSION = $__9.THIS_EXPRESSION, THROW_STATEMENT = $__9.THROW_STATEMENT, TRY_STATEMENT = $__9.TRY_STATEMENT, TYPE_NAME = $__9.TYPE_NAME, UNARY_EXPRESSION = $__9.UNARY_EXPRESSION, VARIABLE_DECLARATION = $__9.VARIABLE_DECLARATION, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST, VARIABLE_STATEMENT = $__9.VARIABLE_STATEMENT, WHILE_STATEMENT = $__9.WHILE_STATEMENT, WITH_STATEMENT = $__9.WITH_STATEMENT, YIELD_EXPRESSION = $__9.YIELD_EXPRESSION;
  var ParseTree = function() {
    var $ParseTree = ($__createClassNoExtends)({
      constructor: function(type, location) {
        this.type = type;
        this.location = location;
      },
      isPattern: function() {
        switch (this.type) {
          case ARRAY_PATTERN:
          case OBJECT_PATTERN:
            return true;
          case PAREN_EXPRESSION:
            return this.expression.isPattern();
          default:
            return false;
        }
      },
      isLeftHandSideExpression: function() {
        switch (this.type) {
          case THIS_EXPRESSION:
          case CLASS_EXPRESSION:
          case SUPER_EXPRESSION:
          case IDENTIFIER_EXPRESSION:
          case LITERAL_EXPRESSION:
          case ARRAY_LITERAL_EXPRESSION:
          case OBJECT_LITERAL_EXPRESSION:
          case NEW_EXPRESSION:
          case MEMBER_EXPRESSION:
          case MEMBER_LOOKUP_EXPRESSION:
          case CALL_EXPRESSION:
          case FUNCTION_EXPRESSION:
          case TEMPLATE_LITERAL_EXPRESSION:
            return true;
          case PAREN_EXPRESSION:
            return this.expression.isLeftHandSideExpression();
          default:
            return false;
        }
      },
      isArrowFunctionExpression: function() {
        switch (this.type) {
          case ARRAY_COMPREHENSION:
          case ARRAY_LITERAL_EXPRESSION:
          case ARROW_FUNCTION_EXPRESSION:
          case AT_NAME_EXPRESSION:
          case BINARY_OPERATOR:
          case CALL_EXPRESSION:
          case CASCADE_EXPRESSION:
          case CLASS_EXPRESSION:
          case CONDITIONAL_EXPRESSION:
          case FUNCTION_EXPRESSION:
          case GENERATOR_COMPREHENSION:
          case IDENTIFIER_EXPRESSION:
          case LITERAL_EXPRESSION:
          case MEMBER_EXPRESSION:
          case MEMBER_LOOKUP_EXPRESSION:
          case MISSING_PRIMARY_EXPRESSION:
          case NEW_EXPRESSION:
          case OBJECT_LITERAL_EXPRESSION:
          case PAREN_EXPRESSION:
          case POSTFIX_EXPRESSION:
          case TEMPLATE_LITERAL_EXPRESSION:
          case SUPER_EXPRESSION:
          case THIS_EXPRESSION:
          case UNARY_EXPRESSION:
          case YIELD_EXPRESSION:
            return true;
          default:
            return false;
        }
      },
      isMemberExpression: function() {
        switch (this.type) {
          case THIS_EXPRESSION:
          case CLASS_EXPRESSION:
          case SUPER_EXPRESSION:
          case IDENTIFIER_EXPRESSION:
          case LITERAL_EXPRESSION:
          case ARRAY_LITERAL_EXPRESSION:
          case OBJECT_LITERAL_EXPRESSION:
          case PAREN_EXPRESSION:
          case TEMPLATE_LITERAL_EXPRESSION:
          case FUNCTION_EXPRESSION:
          case MEMBER_LOOKUP_EXPRESSION:
          case MEMBER_EXPRESSION:
          case CALL_EXPRESSION:
          case CASCADE_EXPRESSION:
            return true;
          case NEW_EXPRESSION:
            return this.args != null;
        }
        return false;
      },
      isExpression: function() {
        return this.isArrowFunctionExpression() || this.type == COMMA_EXPRESSION;
      },
      isAssignmentOrSpread: function() {
        return this.isArrowFunctionExpression() || this.type == SPREAD_EXPRESSION;
      },
      isRestParameter: function() {
        return this.type == REST_PARAMETER;
      },
      isSpreadPatternElement: function() {
        return this.type == SPREAD_PATTERN_ELEMENT;
      },
      isStatement: function() {
        return this.isSourceElement();
      },
      isStatementStandard: function() {
        switch (this.type) {
          case BLOCK:
          case AWAIT_STATEMENT:
          case VARIABLE_STATEMENT:
          case EMPTY_STATEMENT:
          case EXPRESSION_STATEMENT:
          case IF_STATEMENT:
          case DO_WHILE_STATEMENT:
          case WHILE_STATEMENT:
          case FOR_OF_STATEMENT:
          case FOR_IN_STATEMENT:
          case FOR_STATEMENT:
          case CONTINUE_STATEMENT:
          case BREAK_STATEMENT:
          case RETURN_STATEMENT:
          case WITH_STATEMENT:
          case SWITCH_STATEMENT:
          case LABELLED_STATEMENT:
          case THROW_STATEMENT:
          case TRY_STATEMENT:
          case DEBUGGER_STATEMENT:
            return true;
          default:
            return false;
        }
      },
      isSourceElement: function() {
        switch (this.type) {
          case FUNCTION_DECLARATION:
          case CLASS_DECLARATION:
          case NAME_STATEMENT:
            return true;
        }
        return this.isStatementStandard();
      },
      isProgramElement: function() {
        switch (this.type) {
          case CLASS_DECLARATION:
          case EXPORT_DECLARATION:
          case FUNCTION_DECLARATION:
          case IMPORT_DECLARATION:
          case MODULE_DECLARATION:
          case MODULE_DEFINITION:
          case NAME_STATEMENT:
          case VARIABLE_DECLARATION:
            return true;
        }
        return this.isStatementStandard();
      }
    });
    return $ParseTree;
  }();
  ParseTree.stripLocation = function(key, value) {
    if (key === 'location') {
      return undefined;
    }
    return value;
  };
  return Object.preventExtensions(Object.create(null, {
    ParseTreeType: {
      get: function() {
        return ParseTreeType;
      },
      enumerable: true
    },
    ParseTree: {
      get: function() {
        return ParseTree;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_syntax_ParseTreeVisitor_js = (function() {
  "use strict";
  var ParseTreeVisitor = function() {
    var $ParseTreeVisitor = ($__createClassNoExtends)({
      constructor: function() {},
      visitAny: function(tree) {
        tree && tree.visit(this);
      },
      visit: function(tree) {
        this.visitAny(tree);
      },
      visitList: function(list) {
        for (var i = 0; i < list.length; i++) {
          this.visitAny(list[i]);
        }
      },
      visitArgumentList: function(tree) {
        this.visitList(tree.args);
      },
      visitArrayComprehension: function(tree) {
        this.visitAny(tree.expression);
        this.visitList(tree.comprehensionForList);
        this.visitAny(tree.ifExpression);
      },
      visitArrayLiteralExpression: function(tree) {
        this.visitList(tree.elements);
      },
      visitArrayPattern: function(tree) {
        this.visitList(tree.elements);
      },
      visitArrowFunctionExpression: function(tree) {
        this.visitAny(tree.formalParameters);
        this.visitAny(tree.functionBody);
      },
      visitAtNameExpression: function(tree) {},
      visitAtNameDeclaration: function(tree) {
        this.visitAny(tree.initializer);
      },
      visitAwaitStatement: function(tree) {
        this.visitAny(tree.expression);
      },
      visitBinaryOperator: function(tree) {
        this.visitAny(tree.left);
        this.visitAny(tree.right);
      },
      visitBindingElement: function(tree) {
        this.visitAny(tree.binding);
        this.visitAny(tree.initializer);
      },
      visitBindingIdentifier: function(tree) {},
      visitBlock: function(tree) {
        this.visitList(tree.statements);
      },
      visitBreakStatement: function(tree) {},
      visitCallExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitAny(tree.args);
      },
      visitCaseClause: function(tree) {
        this.visitAny(tree.expression);
        this.visitList(tree.statements);
      },
      visitCatch: function(tree) {
        this.visitAny(tree.binding);
        this.visitAny(tree.catchBody);
      },
      visitCascadeExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitList(tree.expressions);
      },
      visitClassDeclaration: function(tree) {
        this.visitAny(tree.superClass);
        this.visitList(tree.elements);
      },
      visitClassExpression: function(tree) {},
      visitCommaExpression: function(tree) {
        this.visitList(tree.expressions);
      },
      visitComprehensionFor: function(tree) {
        this.visitAny(tree.left);
        this.visitAny(tree.iterator);
      },
      visitConditionalExpression: function(tree) {
        this.visitAny(tree.condition);
        this.visitAny(tree.left);
        this.visitAny(tree.right);
      },
      visitContinueStatement: function(tree) {},
      visitDebuggerStatement: function(tree) {},
      visitDefaultClause: function(tree) {
        this.visitList(tree.statements);
      },
      visitDoWhileStatement: function(tree) {
        this.visitAny(tree.body);
        this.visitAny(tree.condition);
      },
      visitEmptyStatement: function(tree) {},
      visitExportDeclaration: function(tree) {
        this.visitAny(tree.declaration);
      },
      visitExportMapping: function(tree) {
        this.visitAny(tree.moduleExpression);
        this.visitAny(tree.specifierSet);
      },
      visitExportMappingList: function(tree) {
        this.visitList(tree.paths);
      },
      visitExportSpecifier: function(tree) {},
      visitExportSpecifierSet: function(tree) {
        this.visitList(tree.specifiers);
      },
      visitExportStar: function(tree) {},
      visitExpressionStatement: function(tree) {
        this.visitAny(tree.expression);
      },
      visitFinally: function(tree) {
        this.visitAny(tree.block);
      },
      visitForOfStatement: function(tree) {
        this.visitAny(tree.initializer);
        this.visitAny(tree.collection);
        this.visitAny(tree.body);
      },
      visitForInStatement: function(tree) {
        this.visitAny(tree.initializer);
        this.visitAny(tree.collection);
        this.visitAny(tree.body);
      },
      visitForStatement: function(tree) {
        this.visitAny(tree.initializer);
        this.visitAny(tree.condition);
        this.visitAny(tree.increment);
        this.visitAny(tree.body);
      },
      visitFormalParameterList: function(tree) {
        this.visitList(tree.parameters);
      },
      visitFunction: function(tree) {
        this.visitAny(tree.name);
        this.visitAny(tree.formalParameterList);
        this.visitAny(tree.functionBody);
      },
      visitFunctionDeclaration: function(tree) {
        this.visitFunction(tree);
      },
      visitFunctionExpression: function(tree) {
        this.visitFunction(tree);
      },
      visitGeneratorComprehension: function(tree) {
        this.visitAny(tree.expression);
        this.visitList(tree.comprehensionForList);
        this.visitAny(tree.ifExpression);
      },
      visitGetAccessor: function(tree) {
        this.visitAny(tree.body);
      },
      visitIdentifierExpression: function(tree) {},
      visitIfStatement: function(tree) {
        this.visitAny(tree.condition);
        this.visitAny(tree.ifClause);
        this.visitAny(tree.elseClause);
      },
      visitImportDeclaration: function(tree) {
        this.visitList(tree.importPathList);
      },
      visitImportBinding: function(tree) {
        if (tree.importSpecifierSet !== null) {
          this.visitList(tree.importSpecifierSet);
        }
        this.visitAny(tree.moduleExpression);
      },
      visitImportSpecifier: function(tree) {},
      visitImportSpecifierSet: function(tree) {
        this.visitList(tree.specifiers);
      },
      visitLabelledStatement: function(tree) {
        this.visitAny(tree.statement);
      },
      visitLiteralExpression: function(tree) {},
      visitMemberExpression: function(tree) {
        this.visitAny(tree.operand);
      },
      visitMemberLookupExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitAny(tree.memberExpression);
      },
      visitMissingPrimaryExpression: function(tree) {},
      visitModuleDeclaration: function(tree) {
        this.visitList(tree.specifiers);
      },
      visitModuleDefinition: function(tree) {
        this.visitList(tree.elements);
      },
      visitModuleExpression: function(tree) {
        this.visitAny(tree.reference);
      },
      visitModuleRequire: function(tree) {},
      visitModuleSpecifier: function(tree) {
        this.visitAny(tree.expression);
      },
      visitNewExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitAny(tree.args);
      },
      visitNameStatement: function(tree) {
        this.visitList(tree.declarations);
      },
      visitObjectLiteralExpression: function(tree) {
        this.visitList(tree.propertyNameAndValues);
      },
      visitObjectPattern: function(tree) {
        this.visitList(tree.fields);
      },
      visitObjectPatternField: function(tree) {
        this.visitAny(tree.element);
      },
      visitParenExpression: function(tree) {
        this.visitAny(tree.expression);
      },
      visitPostfixExpression: function(tree) {
        this.visitAny(tree.operand);
      },
      visitPredefinedType: function(tree) {},
      visitProgram: function(tree) {
        this.visitList(tree.programElements);
      },
      visitPropertyMethodAssignment: function(tree) {
        this.visitAny(tree.formalParameterList);
        this.visitAny(tree.functionBody);
      },
      visitPropertyNameAssignment: function(tree) {
        this.visitAny(tree.value);
      },
      visitPropertyNameShorthand: function(tree) {},
      visitTemplateLiteralExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitList(tree.elements);
      },
      visitTemplateLiteralPortion: function(tree) {},
      visitTemplateSubstitution: function(tree) {
        this.visitAny(tree.expression);
      },
      visitRestParameter: function(tree) {},
      visitReturnStatement: function(tree) {
        this.visitAny(tree.expression);
      },
      visitSetAccessor: function(tree) {
        this.visitAny(tree.parameter);
        this.visitAny(tree.body);
      },
      visitSpreadExpression: function(tree) {
        this.visitAny(tree.expression);
      },
      visitSpreadPatternElement: function(tree) {
        this.visitAny(tree.lvalue);
      },
      visitStateMachine: function(tree) {
        throw Error('State machines should not live outside of the' + ' GeneratorTransformer.');
      },
      visitSuperExpression: function(tree) {},
      visitSwitchStatement: function(tree) {
        this.visitAny(tree.expression);
        this.visitList(tree.caseClauses);
      },
      visitThisExpression: function(tree) {},
      visitThrowStatement: function(tree) {
        this.visitAny(tree.value);
      },
      visitTryStatement: function(tree) {
        this.visitAny(tree.body);
        this.visitAny(tree.catchBlock);
        this.visitAny(tree.finallyBlock);
      },
      visitTypeName: function(tree) {
        this.visitAny(tree.moduleName);
      },
      visitUnaryExpression: function(tree) {
        this.visitAny(tree.operand);
      },
      visitVariableDeclaration: function(tree) {
        this.visitAny(tree.lvalue);
        this.visitAny(tree.typeAnnotation);
        this.visitAny(tree.initializer);
      },
      visitVariableDeclarationList: function(tree) {
        this.visitList(tree.declarations);
      },
      visitVariableStatement: function(tree) {
        this.visitAny(tree.declarations);
      },
      visitWhileStatement: function(tree) {
        this.visitAny(tree.condition);
        this.visitAny(tree.body);
      },
      visitWithStatement: function(tree) {
        this.visitAny(tree.expression);
        this.visitAny(tree.body);
      },
      visitYieldExpression: function(tree) {
        this.visitAny(tree.expression);
      }
    });
    return $ParseTreeVisitor;
  }();
  return Object.preventExtensions(Object.create(null, {ParseTreeVisitor: {
      get: function() {
        return ParseTreeVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_url_js = (function() {
  "use strict";
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/') return '/';
    var leadingSlash = path[0] === '/' ? '/': '';
    var trailingSlash = path.slice(- 1) === '/' ? '/': '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length) out.pop(); else up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0) out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH];
    path = removeDotSegments(path.replace(/\/\//.g, '/'));
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    if (url[0] === '@') return url;
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  return Object.preventExtensions(Object.create(null, {
    removeDotSegments: {
      get: function() {
        return removeDotSegments;
      },
      enumerable: true
    },
    canonicalizeUrl: {
      get: function() {
        return canonicalizeUrl;
      },
      enumerable: true
    },
    resolveUrl: {
      get: function() {
        return resolveUrl;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_module_ModuleVisitor_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTree_js, ParseTree = $__9.ParseTree, ParseTreeType = $__9.ParseTreeType;
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var Symbol = $__src_semantics_symbols_Symbol_js.Symbol;
  var resolveUrl = $__src_util_url_js.resolveUrl;
  function getFriendlyName(module) {
    return module.name || module.url;
  }
  var ModuleVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleVisitor = ($__createClass)({
      constructor: function(reporter, project, module) {
        $__superCall(this, $__proto, "constructor", []);
        this.reporter_ = reporter;
        this.project = project;
        this.currentModule_ = module;
      },
      get currentModule() {
        return this.currentModule_;
      },
      getModuleByName: function(name) {
        var module = this.currentModule;
        while (module) {
          if (module.hasModule(name)) {
            return module.getModule(name);
          }
          module = module.parent;
        }
        return null;
      },
      getModuleForModuleExpression: function(tree, reportErrors) {
        if (tree.reference.type == ParseTreeType.MODULE_REQUIRE) {
          var url = tree.reference.url.processedValue;
          url = resolveUrl(this.currentModule.url, url);
          return this.project.getModuleForUrl(url);
        }
        var getNext = (function(parent, identifierToken) {
          var name = identifierToken.value;
          if (!parent.hasModule(name)) {
            if (reportErrors) {
              this.reportError_(tree, '\'%s\' is not a module', name);
            }
            return null;
          }
          if (!parent.hasExport(name)) {
            if (reportErrors) {
              this.reportError_(tree, '\'%s\' is not exported by %s', name, getFriendlyName(parent));
            }
            return null;
          }
          return parent.getModule(name);
        }).bind(this);
        var name = tree.reference.identifierToken.value;
        var parent = this.getModuleByName(name);
        if (!parent) {
          if (reportErrors) {
            this.reportError_(tree, '\'%s\' is not a module', name);
          }
          return null;
        }
        for (var i = 0; i < tree.identifiers.length; i++) {
          parent = getNext(parent, tree.identifiers[i]);
          if (!parent) {
            return null;
          }
        }
        return parent;
      },
      visitFunction: function(tree) {},
      visitSetAccessor: function(tree) {},
      visitGetAccessor: function(tree) {},
      visitModuleElement_: function(element) {
        switch (element.type) {
          case ParseTreeType.MODULE_DECLARATION:
          case ParseTreeType.MODULE_DEFINITION:
          case ParseTreeType.EXPORT_DECLARATION:
          case ParseTreeType.IMPORT_DECLARATION:
            this.visitAny(element);
        }
      },
      visitProgram: function(tree) {
        tree.programElements.forEach(this.visitModuleElement_, this);
      },
      visitModuleDefinition: function(tree) {
        var current = this.currentModule_;
        var name = tree.name.value;
        var module = current.getModule(name);
        traceur.assert(module);
        this.currentModule_ = module;
        tree.elements.forEach(this.visitModuleElement_, this);
        this.currentModule_ = current;
      },
      checkForDuplicateModule_: function(name, tree) {
        var parent = this.currentModule;
        if (parent.hasModule(name)) {
          this.reportError_(tree, 'Duplicate module declaration \'%s\'', name);
          this.reportRelatedError_(parent.getModule(name).tree);
          return false;
        }
        return true;
      },
      reportError_: function(symbolOrTree, format) {
        var $__10;
        for (var args = [], $__6 = 2; $__6 < arguments.length; $__6++) args[$__6 - 2] = arguments[$__6];
        var tree;
        if (symbolOrTree instanceof Symbol) {
          tree = symbolOrTree.tree;
        } else {
          tree = symbolOrTree;
        }
        ($__10 = this.reporter_).reportError.apply($__10, $__spread([tree.location.start, format], args));
      },
      reportRelatedError_: function(symbolOrTree) {
        if (symbolOrTree instanceof ParseTree) {
          this.reportError_(symbolOrTree, 'Location related to previous error');
        } else {
          var tree = symbolOrTree.tree;
          if (tree) {
            this.reportRelatedError_(tree);
          } else {
            this.reporter_.reportError(null, ("Module related to previous error: " + symbolOrTree.url));
          }
        }
      }
    }, $__proto, $__super, true);
    return $ModuleVisitor;
  }(ParseTreeVisitor);
  return Object.preventExtensions(Object.create(null, {ModuleVisitor: {
      get: function() {
        return ModuleVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_module_ExportVisitor_js = (function() {
  "use strict";
  var ExportSymbol = $__src_semantics_symbols_ExportSymbol_js.ExportSymbol;
  var IDENTIFIER_EXPRESSION = $__src_syntax_trees_ParseTreeType_js.IDENTIFIER_EXPRESSION;
  var ModuleVisitor = $__src_codegeneration_module_ModuleVisitor_js.ModuleVisitor;
  var ExportVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportVisitor = ($__createClass)({
      constructor: function(reporter, project, module) {
        $__superCall(this, $__proto, "constructor", [reporter, project, module]);
        this.inExport_ = false;
        this.relatedTree_ = null;
      },
      addExport_: function(name, tree) {
        if (!this.inExport_) {
          return;
        }
        traceur.assert(typeof name == 'string');
        var parent = this.currentModule;
        if (parent.hasExport(name)) {
          this.reportError_(tree, 'Duplicate export declaration \'%s\'', name);
          this.reportRelatedError_(parent.getExport(name));
          return;
        }
        parent.addExport(name, new ExportSymbol(tree, name, this.relatedTree_));
      },
      visitClassDeclaration: function(tree) {
        this.addExport_(tree.name.identifierToken.value, tree);
      },
      visitExportDeclaration: function(tree) {
        this.inExport_ = true;
        this.visitAny(tree.declaration);
        this.inExport_ = false;
      },
      visitExportMapping: function(tree) {
        this.relatedTree_ = tree.moduleExpression;
        this.visitAny(tree.specifierSet);
        this.relatedTree_ = null;
      },
      visitExportMappingList: function(tree) {
        for (var i = 0; i < tree.paths.length; i++) {
          var path = tree.paths[i];
          if (path.type == IDENTIFIER_EXPRESSION) {
            this.addExport_(path.identifierToken.value, path);
          } else {
            this.visitAny(path);
          }
        }
      },
      visitExportSpecifier: function(tree) {
        this.addExport_((tree.rhs || tree.lhs).value, tree);
      },
      visitExportStar: function(tree) {
        var module = this.getModuleForModuleExpression(this.relatedTree_);
        module.getExports().forEach((function($__9) {
          var name = $__9.name;
          this.addExport_(name, tree);
        }).bind(this));
      },
      visitFunctionDeclaration: function(tree) {
        this.addExport_(tree.name.identifierToken.value, tree);
      },
      visitIdentifierExpression: function(tree) {
        this.addExport_(tree.identifierToken.value, tree);
      },
      visitModuleDefinition: function(tree) {
        this.addExport_(tree.name.value, tree);
        var inExport = this.inExport_;
        this.inExport_ = false;
        $__superCall(this, $__proto, "visitModuleDefinition", [tree]);
        this.inExport_ = inExport;
      },
      visitModuleSpecifier: function(tree) {
        this.addExport_(tree.identifier.value, tree);
      },
      visitVariableDeclaration: function(tree) {
        this.addExport_(tree.lvalue.identifierToken.value, tree);
      }
    }, $__proto, $__super, true);
    return $ExportVisitor;
  }(ModuleVisitor);
  return Object.preventExtensions(Object.create(null, {ExportVisitor: {
      get: function() {
        return ExportVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_TokenType_js = (function() {
  "use strict";
  var AMPERSAND = '&';
  var AMPERSAND_EQUAL = '&=';
  var AND = '&&';
  var ARROW = '=>';
  var AT_NAME = 'at name';
  var AWAIT = 'await';
  var BACK_QUOTE = '`';
  var BANG = '!';
  var BAR = '|';
  var BAR_EQUAL = '|=';
  var BREAK = 'break';
  var CARET = '^';
  var CARET_EQUAL = '^=';
  var CASE = 'case';
  var CATCH = 'catch';
  var CLASS = 'class';
  var CLOSE_ANGLE = '>';
  var CLOSE_CURLY = '}';
  var CLOSE_PAREN = ')';
  var CLOSE_SQUARE = ']';
  var COLON = ':';
  var COMMA = ',';
  var CONST = 'const';
  var CONTINUE = 'continue';
  var DEBUGGER = 'debugger';
  var DEFAULT = 'default';
  var DELETE = 'delete';
  var DO = 'do';
  var DOLLAR = '$';
  var DOT_DOT_DOT = '...';
  var ELSE = 'else';
  var END_OF_FILE = 'End of File';
  var ENUM = 'enum';
  var EQUAL = '=';
  var EQUAL_EQUAL = '==';
  var EQUAL_EQUAL_EQUAL = '===';
  var ERROR = 'error';
  var EXPORT = 'export';
  var EXTENDS = 'extends';
  var FALSE = 'false';
  var FINALLY = 'finally';
  var FOR = 'for';
  var FUNCTION = 'function';
  var GREATER_EQUAL = '>=';
  var IDENTIFIER = 'identifier';
  var IF = 'if';
  var IMPLEMENTS = 'implements';
  var IMPORT = 'import';
  var IN = 'in';
  var INSTANCEOF = 'instanceof';
  var INTERFACE = 'interface';
  var LEFT_SHIFT = '<<';
  var LEFT_SHIFT_EQUAL = '<<=';
  var LESS_EQUAL = '<=';
  var LET = 'let';
  var MINUS = '-';
  var MINUS_EQUAL = '-=';
  var MINUS_MINUS = '--';
  var NEW = 'new';
  var NO_SUBSTITUTION_TEMPLATE = 'no substitution template';
  var NOT_EQUAL = '!=';
  var NOT_EQUAL_EQUAL = '!==';
  var NULL = 'null';
  var NUMBER = 'number literal';
  var OPEN_ANGLE = '<';
  var OPEN_CURLY = '{';
  var OPEN_PAREN = '(';
  var OPEN_SQUARE = '[';
  var OR = '||';
  var PACKAGE = 'package';
  var PERCENT = '%';
  var PERCENT_EQUAL = '%=';
  var PERIOD = '.';
  var PERIOD_OPEN_CURLY = '.{';
  var PLUS = '+';
  var PLUS_EQUAL = '+=';
  var PLUS_PLUS = '++';
  var PRIVATE = 'private';
  var PROTECTED = 'protected';
  var PUBLIC = 'public';
  var QUESTION = '?';
  var REGULAR_EXPRESSION = 'regular expression literal';
  var RETURN = 'return';
  var RIGHT_SHIFT = '>>';
  var RIGHT_SHIFT_EQUAL = '>>=';
  var SEMI_COLON = ';';
  var SLASH = '/';
  var SLASH_EQUAL = '/=';
  var STAR = '*';
  var STAR_EQUAL = '*=';
  var STATIC = 'static';
  var STRING = 'string literal';
  var SUPER = 'super';
  var SWITCH = 'switch';
  var TEMPLATE_HEAD = 'template head';
  var TEMPLATE_MIDDLE = 'template middle';
  var TEMPLATE_TAIL = 'template tail';
  var THIS = 'this';
  var THROW = 'throw';
  var TILDE = '~';
  var TRUE = 'true';
  var TRY = 'try';
  var TYPEOF = 'typeof';
  var UNSIGNED_RIGHT_SHIFT = '>>>';
  var UNSIGNED_RIGHT_SHIFT_EQUAL = '>>>=';
  var VAR = 'var';
  var VOID = 'void';
  var WHILE = 'while';
  var WITH = 'with';
  var YIELD = 'yield';
  return Object.preventExtensions(Object.create(null, {
    AMPERSAND: {
      get: function() {
        return AMPERSAND;
      },
      enumerable: true
    },
    AMPERSAND_EQUAL: {
      get: function() {
        return AMPERSAND_EQUAL;
      },
      enumerable: true
    },
    AND: {
      get: function() {
        return AND;
      },
      enumerable: true
    },
    ARROW: {
      get: function() {
        return ARROW;
      },
      enumerable: true
    },
    AT_NAME: {
      get: function() {
        return AT_NAME;
      },
      enumerable: true
    },
    AWAIT: {
      get: function() {
        return AWAIT;
      },
      enumerable: true
    },
    BACK_QUOTE: {
      get: function() {
        return BACK_QUOTE;
      },
      enumerable: true
    },
    BANG: {
      get: function() {
        return BANG;
      },
      enumerable: true
    },
    BAR: {
      get: function() {
        return BAR;
      },
      enumerable: true
    },
    BAR_EQUAL: {
      get: function() {
        return BAR_EQUAL;
      },
      enumerable: true
    },
    BREAK: {
      get: function() {
        return BREAK;
      },
      enumerable: true
    },
    CARET: {
      get: function() {
        return CARET;
      },
      enumerable: true
    },
    CARET_EQUAL: {
      get: function() {
        return CARET_EQUAL;
      },
      enumerable: true
    },
    CASE: {
      get: function() {
        return CASE;
      },
      enumerable: true
    },
    CATCH: {
      get: function() {
        return CATCH;
      },
      enumerable: true
    },
    CLASS: {
      get: function() {
        return CLASS;
      },
      enumerable: true
    },
    CLOSE_ANGLE: {
      get: function() {
        return CLOSE_ANGLE;
      },
      enumerable: true
    },
    CLOSE_CURLY: {
      get: function() {
        return CLOSE_CURLY;
      },
      enumerable: true
    },
    CLOSE_PAREN: {
      get: function() {
        return CLOSE_PAREN;
      },
      enumerable: true
    },
    CLOSE_SQUARE: {
      get: function() {
        return CLOSE_SQUARE;
      },
      enumerable: true
    },
    COLON: {
      get: function() {
        return COLON;
      },
      enumerable: true
    },
    COMMA: {
      get: function() {
        return COMMA;
      },
      enumerable: true
    },
    CONST: {
      get: function() {
        return CONST;
      },
      enumerable: true
    },
    CONTINUE: {
      get: function() {
        return CONTINUE;
      },
      enumerable: true
    },
    DEBUGGER: {
      get: function() {
        return DEBUGGER;
      },
      enumerable: true
    },
    DEFAULT: {
      get: function() {
        return DEFAULT;
      },
      enumerable: true
    },
    DELETE: {
      get: function() {
        return DELETE;
      },
      enumerable: true
    },
    DO: {
      get: function() {
        return DO;
      },
      enumerable: true
    },
    DOLLAR: {
      get: function() {
        return DOLLAR;
      },
      enumerable: true
    },
    DOT_DOT_DOT: {
      get: function() {
        return DOT_DOT_DOT;
      },
      enumerable: true
    },
    ELSE: {
      get: function() {
        return ELSE;
      },
      enumerable: true
    },
    END_OF_FILE: {
      get: function() {
        return END_OF_FILE;
      },
      enumerable: true
    },
    ENUM: {
      get: function() {
        return ENUM;
      },
      enumerable: true
    },
    EQUAL: {
      get: function() {
        return EQUAL;
      },
      enumerable: true
    },
    EQUAL_EQUAL: {
      get: function() {
        return EQUAL_EQUAL;
      },
      enumerable: true
    },
    EQUAL_EQUAL_EQUAL: {
      get: function() {
        return EQUAL_EQUAL_EQUAL;
      },
      enumerable: true
    },
    ERROR: {
      get: function() {
        return ERROR;
      },
      enumerable: true
    },
    EXPORT: {
      get: function() {
        return EXPORT;
      },
      enumerable: true
    },
    EXTENDS: {
      get: function() {
        return EXTENDS;
      },
      enumerable: true
    },
    FALSE: {
      get: function() {
        return FALSE;
      },
      enumerable: true
    },
    FINALLY: {
      get: function() {
        return FINALLY;
      },
      enumerable: true
    },
    FOR: {
      get: function() {
        return FOR;
      },
      enumerable: true
    },
    FUNCTION: {
      get: function() {
        return FUNCTION;
      },
      enumerable: true
    },
    GREATER_EQUAL: {
      get: function() {
        return GREATER_EQUAL;
      },
      enumerable: true
    },
    IDENTIFIER: {
      get: function() {
        return IDENTIFIER;
      },
      enumerable: true
    },
    IF: {
      get: function() {
        return IF;
      },
      enumerable: true
    },
    IMPLEMENTS: {
      get: function() {
        return IMPLEMENTS;
      },
      enumerable: true
    },
    IMPORT: {
      get: function() {
        return IMPORT;
      },
      enumerable: true
    },
    IN: {
      get: function() {
        return IN;
      },
      enumerable: true
    },
    INSTANCEOF: {
      get: function() {
        return INSTANCEOF;
      },
      enumerable: true
    },
    INTERFACE: {
      get: function() {
        return INTERFACE;
      },
      enumerable: true
    },
    LEFT_SHIFT: {
      get: function() {
        return LEFT_SHIFT;
      },
      enumerable: true
    },
    LEFT_SHIFT_EQUAL: {
      get: function() {
        return LEFT_SHIFT_EQUAL;
      },
      enumerable: true
    },
    LESS_EQUAL: {
      get: function() {
        return LESS_EQUAL;
      },
      enumerable: true
    },
    LET: {
      get: function() {
        return LET;
      },
      enumerable: true
    },
    MINUS: {
      get: function() {
        return MINUS;
      },
      enumerable: true
    },
    MINUS_EQUAL: {
      get: function() {
        return MINUS_EQUAL;
      },
      enumerable: true
    },
    MINUS_MINUS: {
      get: function() {
        return MINUS_MINUS;
      },
      enumerable: true
    },
    NEW: {
      get: function() {
        return NEW;
      },
      enumerable: true
    },
    NO_SUBSTITUTION_TEMPLATE: {
      get: function() {
        return NO_SUBSTITUTION_TEMPLATE;
      },
      enumerable: true
    },
    NOT_EQUAL: {
      get: function() {
        return NOT_EQUAL;
      },
      enumerable: true
    },
    NOT_EQUAL_EQUAL: {
      get: function() {
        return NOT_EQUAL_EQUAL;
      },
      enumerable: true
    },
    NULL: {
      get: function() {
        return NULL;
      },
      enumerable: true
    },
    NUMBER: {
      get: function() {
        return NUMBER;
      },
      enumerable: true
    },
    OPEN_ANGLE: {
      get: function() {
        return OPEN_ANGLE;
      },
      enumerable: true
    },
    OPEN_CURLY: {
      get: function() {
        return OPEN_CURLY;
      },
      enumerable: true
    },
    OPEN_PAREN: {
      get: function() {
        return OPEN_PAREN;
      },
      enumerable: true
    },
    OPEN_SQUARE: {
      get: function() {
        return OPEN_SQUARE;
      },
      enumerable: true
    },
    OR: {
      get: function() {
        return OR;
      },
      enumerable: true
    },
    PACKAGE: {
      get: function() {
        return PACKAGE;
      },
      enumerable: true
    },
    PERCENT: {
      get: function() {
        return PERCENT;
      },
      enumerable: true
    },
    PERCENT_EQUAL: {
      get: function() {
        return PERCENT_EQUAL;
      },
      enumerable: true
    },
    PERIOD: {
      get: function() {
        return PERIOD;
      },
      enumerable: true
    },
    PERIOD_OPEN_CURLY: {
      get: function() {
        return PERIOD_OPEN_CURLY;
      },
      enumerable: true
    },
    PLUS: {
      get: function() {
        return PLUS;
      },
      enumerable: true
    },
    PLUS_EQUAL: {
      get: function() {
        return PLUS_EQUAL;
      },
      enumerable: true
    },
    PLUS_PLUS: {
      get: function() {
        return PLUS_PLUS;
      },
      enumerable: true
    },
    PRIVATE: {
      get: function() {
        return PRIVATE;
      },
      enumerable: true
    },
    PROTECTED: {
      get: function() {
        return PROTECTED;
      },
      enumerable: true
    },
    PUBLIC: {
      get: function() {
        return PUBLIC;
      },
      enumerable: true
    },
    QUESTION: {
      get: function() {
        return QUESTION;
      },
      enumerable: true
    },
    REGULAR_EXPRESSION: {
      get: function() {
        return REGULAR_EXPRESSION;
      },
      enumerable: true
    },
    RETURN: {
      get: function() {
        return RETURN;
      },
      enumerable: true
    },
    RIGHT_SHIFT: {
      get: function() {
        return RIGHT_SHIFT;
      },
      enumerable: true
    },
    RIGHT_SHIFT_EQUAL: {
      get: function() {
        return RIGHT_SHIFT_EQUAL;
      },
      enumerable: true
    },
    SEMI_COLON: {
      get: function() {
        return SEMI_COLON;
      },
      enumerable: true
    },
    SLASH: {
      get: function() {
        return SLASH;
      },
      enumerable: true
    },
    SLASH_EQUAL: {
      get: function() {
        return SLASH_EQUAL;
      },
      enumerable: true
    },
    STAR: {
      get: function() {
        return STAR;
      },
      enumerable: true
    },
    STAR_EQUAL: {
      get: function() {
        return STAR_EQUAL;
      },
      enumerable: true
    },
    STATIC: {
      get: function() {
        return STATIC;
      },
      enumerable: true
    },
    STRING: {
      get: function() {
        return STRING;
      },
      enumerable: true
    },
    SUPER: {
      get: function() {
        return SUPER;
      },
      enumerable: true
    },
    SWITCH: {
      get: function() {
        return SWITCH;
      },
      enumerable: true
    },
    TEMPLATE_HEAD: {
      get: function() {
        return TEMPLATE_HEAD;
      },
      enumerable: true
    },
    TEMPLATE_MIDDLE: {
      get: function() {
        return TEMPLATE_MIDDLE;
      },
      enumerable: true
    },
    TEMPLATE_TAIL: {
      get: function() {
        return TEMPLATE_TAIL;
      },
      enumerable: true
    },
    THIS: {
      get: function() {
        return THIS;
      },
      enumerable: true
    },
    THROW: {
      get: function() {
        return THROW;
      },
      enumerable: true
    },
    TILDE: {
      get: function() {
        return TILDE;
      },
      enumerable: true
    },
    TRUE: {
      get: function() {
        return TRUE;
      },
      enumerable: true
    },
    TRY: {
      get: function() {
        return TRY;
      },
      enumerable: true
    },
    TYPEOF: {
      get: function() {
        return TYPEOF;
      },
      enumerable: true
    },
    UNSIGNED_RIGHT_SHIFT: {
      get: function() {
        return UNSIGNED_RIGHT_SHIFT;
      },
      enumerable: true
    },
    UNSIGNED_RIGHT_SHIFT_EQUAL: {
      get: function() {
        return UNSIGNED_RIGHT_SHIFT_EQUAL;
      },
      enumerable: true
    },
    VAR: {
      get: function() {
        return VAR;
      },
      enumerable: true
    },
    VOID: {
      get: function() {
        return VOID;
      },
      enumerable: true
    },
    WHILE: {
      get: function() {
        return WHILE;
      },
      enumerable: true
    },
    WITH: {
      get: function() {
        return WITH;
      },
      enumerable: true
    },
    YIELD: {
      get: function() {
        return YIELD;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_module_ImportStarVisitor_js = (function() {
  "use strict";
  var IMPORT_SPECIFIER_SET = $__src_syntax_trees_ParseTreeType_js.IMPORT_SPECIFIER_SET;
  var ModuleVisitor = $__src_codegeneration_module_ModuleVisitor_js.ModuleVisitor;
  var STAR = $__src_syntax_TokenType_js.STAR;
  var ImportStarVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ImportStarVisitor = ($__createClass)({
      constructor: function(reporter, project, module) {
        $__superCall(this, $__proto, "constructor", [reporter, project, module]);
      },
      visitImportBinding: function(tree) {
        var importSpecifierSet = tree.importSpecifierSet;
        if (importSpecifierSet.type === IMPORT_SPECIFIER_SET && importSpecifierSet.specifiers.type === STAR) {
          var module = this.getModuleForModuleExpression(tree.moduleExpression);
          this.project.setModuleForStarTree(importSpecifierSet, module);
        }
      }
    }, $__proto, $__super, true);
    return $ImportStarVisitor;
  }(ModuleVisitor);
  return Object.preventExtensions(Object.create(null, {ImportStarVisitor: {
      get: function() {
        return ImportStarVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_module_ModuleDeclarationVisitor_js = (function() {
  "use strict";
  var ModuleVisitor = $__src_codegeneration_module_ModuleVisitor_js.ModuleVisitor;
  var ModuleDeclarationVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleDeclarationVisitor = ($__createClass)({
      constructor: function(reporter, project, module) {
        $__superCall(this, $__proto, "constructor", [reporter, project, module]);
      },
      visitModuleSpecifier: function(tree) {
        var name = tree.identifier.value;
        var parent = this.currentModule;
        var module = this.getModuleForModuleExpression(tree.expression);
        if (!module) {
          return;
        }
        parent.addModuleWithName(module, name);
      }
    }, $__proto, $__super, true);
    return $ModuleDeclarationVisitor;
  }(ModuleVisitor);
  return Object.preventExtensions(Object.create(null, {ModuleDeclarationVisitor: {
      get: function() {
        return ModuleDeclarationVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_symbols_ModuleSymbol_js = (function() {
  "use strict";
  var Symbol = $__src_semantics_symbols_Symbol_js.Symbol;
  var SymbolType = $__src_semantics_symbols_SymbolType_js.SymbolType;
  var ModuleSymbol = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleSymbol = ($__createClass)({
      constructor: function(name, parent, tree, url) {
        $__superCall(this, $__proto, "constructor", [SymbolType.MODULE, tree, name]);
        this.children_ = Object.create(null);
        this.exports_ = Object.create(null);
        this.parent = parent;
        this.tree = tree;
        if (!url) {
          console.error('Missing URL');
        }
        this.url = url;
      },
      addModule: function(module) {
        this.addModuleWithName(module, module.name);
      },
      addModuleWithName: function(module, name) {
        this.children_[name] = module;
      },
      hasModule: function(name) {
        return name in this.children_;
      },
      getModule: function(name) {
        return this.children_[name];
      },
      hasExport: function(name) {
        return name in this.exports_;
      },
      getExport: function(name) {
        return this.exports_[name];
      },
      addExport: function(name, exp) {
        this.exports_[name] = exp;
      },
      getExports: function() {
        var exports = this.exports_;
        return Object.keys(exports).map((function(key) {
          return exports[key];
        }));
      }
    }, $__proto, $__super, true);
    return $ModuleSymbol;
  }(Symbol);
  return Object.preventExtensions(Object.create(null, {ModuleSymbol: {
      get: function() {
        return ModuleSymbol;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_module_ModuleDefinitionVisitor_js = (function() {
  "use strict";
  var ModuleSymbol = $__src_semantics_symbols_ModuleSymbol_js.ModuleSymbol;
  var ModuleVisitor = $__src_codegeneration_module_ModuleVisitor_js.ModuleVisitor;
  var ModuleDefinitionVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleDefinitionVisitor = ($__createClass)({
      constructor: function(reporter, project, module) {
        $__superCall(this, $__proto, "constructor", [reporter, project, module]);
      },
      visitModuleDefinition: function(tree) {
        var name = tree.name.value;
        if (this.checkForDuplicateModule_(name, tree)) {
          var parent = this.currentModule;
          var module = new ModuleSymbol(name, parent, tree, parent.url);
          parent.addModule(module);
        }
        $__superCall(this, $__proto, "visitModuleDefinition", [tree]);
      }
    }, $__proto, $__super, true);
    return $ModuleDefinitionVisitor;
  }(ModuleVisitor);
  return Object.preventExtensions(Object.create(null, {ModuleDefinitionVisitor: {
      get: function() {
        return ModuleDefinitionVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_module_ValidationVisitor_js = (function() {
  "use strict";
  var ModuleVisitor = $__src_codegeneration_module_ModuleVisitor_js.ModuleVisitor;
  function getFriendlyName(module) {
    return module.name || "'" + module.url + "'";
  }
  var ValidationVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ValidationVisitor = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      checkExport_: function(tree, name) {
        if (this.validatingModule_ && !this.validatingModule_.hasExport(name)) {
          this.reportError_(tree, '\'%s\' is not exported by %s', name, getFriendlyName(this.validatingModule_));
        }
      },
      visitAndValidate_: function(module, tree) {
        var validatingModule = this.validatingModule_;
        this.validatingModule_ = module;
        this.visitAny(tree);
        this.validatingModule_ = validatingModule;
      },
      visitExportMapping: function(tree) {
        if (tree.moduleExpression) {
          this.visitAny(tree.moduleExpression);
          var module = this.getModuleForModuleExpression(tree.moduleExpression);
          this.visitAndValidate_(module, tree.specifierSet);
        }
      },
      visitExportSpecifier: function(tree) {
        this.checkExport_(tree, tree.lhs.value);
      },
      visitIdentifierExpression: function(tree) {
        this.checkExport_(tree, tree.identifierToken.value);
      },
      visitModuleExpression: function(tree) {
        this.getModuleForModuleExpression(tree, true);
      },
      visitImportBinding: function(tree) {
        var module = this.getModuleForModuleExpression(tree.moduleExpression, true);
        this.visitAndValidate_(module, tree.importSpecifierSet);
      },
      visitImportSpecifier: function(tree) {
        this.checkExport_(tree, tree.lhs.value);
      }
    }, $__proto, $__super, false);
    return $ValidationVisitor;
  }(ModuleVisitor);
  return Object.preventExtensions(Object.create(null, {ValidationVisitor: {
      get: function() {
        return ValidationVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_ModuleAnalyzer_js = (function() {
  "use strict";
  var ExportVisitor = $__src_codegeneration_module_ExportVisitor_js.ExportVisitor;
  var ImportStarVisitor = $__src_codegeneration_module_ImportStarVisitor_js.ImportStarVisitor;
  var ModuleDeclarationVisitor = $__src_codegeneration_module_ModuleDeclarationVisitor_js.ModuleDeclarationVisitor;
  var ModuleDefinitionVisitor = $__src_codegeneration_module_ModuleDefinitionVisitor_js.ModuleDefinitionVisitor;
  var ValidationVisitor = $__src_codegeneration_module_ValidationVisitor_js.ValidationVisitor;
  var ModuleAnalyzer = function() {
    var $ModuleAnalyzer = ($__createClassNoExtends)({
      constructor: function(reporter, project) {
        this.reporter_ = reporter;
        this.project_ = project;
      },
      analyze: function() {
        this.analyzeTrees(this.project_.getParseTrees());
      },
      analyzeFile: function(sourceFile) {
        var trees = [this.project_.getParseTree(sourceFile)];
        this.analyzeTrees(trees);
      },
      analyzeTrees: function(trees) {
        this.analyzeModuleTrees(trees);
      },
      analyzeModuleTrees: function(trees, opt_roots) {
        var reporter = this.reporter_;
        var project = this.project_;
        var root = project.getRootModule();
        function getRoot(i) {
          return opt_roots ? opt_roots[i]: root;
        }
        function doVisit(ctor) {
          for (var i = 0; i < trees.length; i++) {
            var visitor = new ctor(reporter, project, getRoot(i));
            visitor.visitAny(trees[i]);
          }
        }
        doVisit(ModuleDefinitionVisitor);
        doVisit(ExportVisitor);
        doVisit(ModuleDeclarationVisitor);
        doVisit(ValidationVisitor);
        doVisit(ImportStarVisitor);
      }
    });
    return $ModuleAnalyzer;
  }();
  return Object.preventExtensions(Object.create(null, {ModuleAnalyzer: {
      get: function() {
        return ModuleAnalyzer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_trees_ParseTrees_js = (function() {
  "use strict";
  var ParseTree = $__src_syntax_trees_ParseTree_js.ParseTree;
  var ParseTreeType = $__src_syntax_trees_ParseTreeType_js;
  var $__9 = ParseTreeType, ARGUMENT_LIST = $__9.ARGUMENT_LIST, ARRAY_COMPREHENSION = $__9.ARRAY_COMPREHENSION, ARRAY_LITERAL_EXPRESSION = $__9.ARRAY_LITERAL_EXPRESSION, ARRAY_PATTERN = $__9.ARRAY_PATTERN, ARROW_FUNCTION_EXPRESSION = $__9.ARROW_FUNCTION_EXPRESSION, AT_NAME_DECLARATION = $__9.AT_NAME_DECLARATION, AT_NAME_EXPRESSION = $__9.AT_NAME_EXPRESSION, AWAIT_STATEMENT = $__9.AWAIT_STATEMENT, BINARY_OPERATOR = $__9.BINARY_OPERATOR, BINDING_ELEMENT = $__9.BINDING_ELEMENT, BINDING_IDENTIFIER = $__9.BINDING_IDENTIFIER, BLOCK = $__9.BLOCK, BREAK_STATEMENT = $__9.BREAK_STATEMENT, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, CASE_CLAUSE = $__9.CASE_CLAUSE, CATCH = $__9.CATCH, CLASS_DECLARATION = $__9.CLASS_DECLARATION, CLASS_EXPRESSION = $__9.CLASS_EXPRESSION, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, COMPREHENSION_FOR = $__9.COMPREHENSION_FOR, CONDITIONAL_EXPRESSION = $__9.CONDITIONAL_EXPRESSION, CONTINUE_STATEMENT = $__9.CONTINUE_STATEMENT, COVER_FORMALS = $__9.COVER_FORMALS, DEBUGGER_STATEMENT = $__9.DEBUGGER_STATEMENT, DEFAULT_CLAUSE = $__9.DEFAULT_CLAUSE, DO_WHILE_STATEMENT = $__9.DO_WHILE_STATEMENT, EMPTY_STATEMENT = $__9.EMPTY_STATEMENT, EXPORT_DECLARATION = $__9.EXPORT_DECLARATION, EXPORT_MAPPING = $__9.EXPORT_MAPPING, EXPORT_MAPPING_LIST = $__9.EXPORT_MAPPING_LIST, EXPORT_SPECIFIER = $__9.EXPORT_SPECIFIER, EXPORT_SPECIFIER_SET = $__9.EXPORT_SPECIFIER_SET, EXPORT_STAR = $__9.EXPORT_STAR, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, FINALLY = $__9.FINALLY, FOR_IN_STATEMENT = $__9.FOR_IN_STATEMENT, FOR_OF_STATEMENT = $__9.FOR_OF_STATEMENT, FOR_STATEMENT = $__9.FOR_STATEMENT, FORMAL_PARAMETER_LIST = $__9.FORMAL_PARAMETER_LIST, FUNCTION_DECLARATION = $__9.FUNCTION_DECLARATION, FUNCTION_EXPRESSION = $__9.FUNCTION_EXPRESSION, GENERATOR_COMPREHENSION = $__9.GENERATOR_COMPREHENSION, GET_ACCESSOR = $__9.GET_ACCESSOR, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, IF_STATEMENT = $__9.IF_STATEMENT, IMPORT_BINDING = $__9.IMPORT_BINDING, IMPORT_DECLARATION = $__9.IMPORT_DECLARATION, IMPORT_SPECIFIER = $__9.IMPORT_SPECIFIER, IMPORT_SPECIFIER_SET = $__9.IMPORT_SPECIFIER_SET, LABELLED_STATEMENT = $__9.LABELLED_STATEMENT, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, MISSING_PRIMARY_EXPRESSION = $__9.MISSING_PRIMARY_EXPRESSION, MODULE_DECLARATION = $__9.MODULE_DECLARATION, MODULE_DEFINITION = $__9.MODULE_DEFINITION, MODULE_EXPRESSION = $__9.MODULE_EXPRESSION, MODULE_REQUIRE = $__9.MODULE_REQUIRE, MODULE_SPECIFIER = $__9.MODULE_SPECIFIER, NAME_STATEMENT = $__9.NAME_STATEMENT, NEW_EXPRESSION = $__9.NEW_EXPRESSION, OBJECT_LITERAL_EXPRESSION = $__9.OBJECT_LITERAL_EXPRESSION, OBJECT_PATTERN = $__9.OBJECT_PATTERN, OBJECT_PATTERN_FIELD = $__9.OBJECT_PATTERN_FIELD, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, POSTFIX_EXPRESSION = $__9.POSTFIX_EXPRESSION, PREDEFINED_TYPE = $__9.PREDEFINED_TYPE, PROGRAM = $__9.PROGRAM, PROPERTY_METHOD_ASSIGNMENT = $__9.PROPERTY_METHOD_ASSIGNMENT, PROPERTY_NAME_ASSIGNMENT = $__9.PROPERTY_NAME_ASSIGNMENT, PROPERTY_NAME_SHORTHAND = $__9.PROPERTY_NAME_SHORTHAND, REST_PARAMETER = $__9.REST_PARAMETER, RETURN_STATEMENT = $__9.RETURN_STATEMENT, SET_ACCESSOR = $__9.SET_ACCESSOR, SPREAD_EXPRESSION = $__9.SPREAD_EXPRESSION, SPREAD_PATTERN_ELEMENT = $__9.SPREAD_PATTERN_ELEMENT, STATE_MACHINE = $__9.STATE_MACHINE, SUPER_EXPRESSION = $__9.SUPER_EXPRESSION, SWITCH_STATEMENT = $__9.SWITCH_STATEMENT, TEMPLATE_LITERAL_EXPRESSION = $__9.TEMPLATE_LITERAL_EXPRESSION, TEMPLATE_LITERAL_PORTION = $__9.TEMPLATE_LITERAL_PORTION, TEMPLATE_SUBSTITUTION = $__9.TEMPLATE_SUBSTITUTION, THIS_EXPRESSION = $__9.THIS_EXPRESSION, THROW_STATEMENT = $__9.THROW_STATEMENT, TRY_STATEMENT = $__9.TRY_STATEMENT, TYPE_NAME = $__9.TYPE_NAME, UNARY_EXPRESSION = $__9.UNARY_EXPRESSION, VARIABLE_DECLARATION = $__9.VARIABLE_DECLARATION, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST, VARIABLE_STATEMENT = $__9.VARIABLE_STATEMENT, WHILE_STATEMENT = $__9.WHILE_STATEMENT, WITH_STATEMENT = $__9.WITH_STATEMENT, YIELD_EXPRESSION = $__9.YIELD_EXPRESSION;
  var ArgumentList = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArgumentList = ($__createClass)({
      constructor: function(location, args) {
        this.location = location;
        this.args = args;
      },
      transform: function(transformer) {
        return transformer.transformArgumentList(this);
      },
      visit: function(visitor) {
        visitor.visitArgumentList(this);
      },
      get type() {
        return ARGUMENT_LIST;
      }
    }, $__proto, $__super, true);
    return $ArgumentList;
  }(ParseTree);
  var ArrayComprehension = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrayComprehension = ($__createClass)({
      constructor: function(location, expression, comprehensionForList, ifExpression) {
        this.location = location;
        this.expression = expression;
        this.comprehensionForList = comprehensionForList;
        this.ifExpression = ifExpression;
      },
      transform: function(transformer) {
        return transformer.transformArrayComprehension(this);
      },
      visit: function(visitor) {
        visitor.visitArrayComprehension(this);
      },
      get type() {
        return ARRAY_COMPREHENSION;
      }
    }, $__proto, $__super, true);
    return $ArrayComprehension;
  }(ParseTree);
  var ArrayLiteralExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrayLiteralExpression = ($__createClass)({
      constructor: function(location, elements) {
        this.location = location;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformArrayLiteralExpression(this);
      },
      visit: function(visitor) {
        visitor.visitArrayLiteralExpression(this);
      },
      get type() {
        return ARRAY_LITERAL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ArrayLiteralExpression;
  }(ParseTree);
  var ArrayPattern = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrayPattern = ($__createClass)({
      constructor: function(location, elements) {
        this.location = location;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformArrayPattern(this);
      },
      visit: function(visitor) {
        visitor.visitArrayPattern(this);
      },
      get type() {
        return ARRAY_PATTERN;
      }
    }, $__proto, $__super, true);
    return $ArrayPattern;
  }(ParseTree);
  var ArrowFunctionExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrowFunctionExpression = ($__createClass)({
      constructor: function(location, formalParameters, functionBody) {
        this.location = location;
        this.formalParameters = formalParameters;
        this.functionBody = functionBody;
      },
      transform: function(transformer) {
        return transformer.transformArrowFunctionExpression(this);
      },
      visit: function(visitor) {
        visitor.visitArrowFunctionExpression(this);
      },
      get type() {
        return ARROW_FUNCTION_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ArrowFunctionExpression;
  }(ParseTree);
  var AtNameDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AtNameDeclaration = ($__createClass)({
      constructor: function(location, atNameToken, initializer) {
        this.location = location;
        this.atNameToken = atNameToken;
        this.initializer = initializer;
      },
      transform: function(transformer) {
        return transformer.transformAtNameDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitAtNameDeclaration(this);
      },
      get type() {
        return AT_NAME_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $AtNameDeclaration;
  }(ParseTree);
  var AtNameExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AtNameExpression = ($__createClass)({
      constructor: function(location, atNameToken) {
        this.location = location;
        this.atNameToken = atNameToken;
      },
      transform: function(transformer) {
        return transformer.transformAtNameExpression(this);
      },
      visit: function(visitor) {
        visitor.visitAtNameExpression(this);
      },
      get type() {
        return AT_NAME_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $AtNameExpression;
  }(ParseTree);
  var AwaitStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AwaitStatement = ($__createClass)({
      constructor: function(location, identifier, expression) {
        this.location = location;
        this.identifier = identifier;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformAwaitStatement(this);
      },
      visit: function(visitor) {
        visitor.visitAwaitStatement(this);
      },
      get type() {
        return AWAIT_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $AwaitStatement;
  }(ParseTree);
  var BinaryOperator = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BinaryOperator = ($__createClass)({
      constructor: function(location, left, operator, right) {
        this.location = location;
        this.left = left;
        this.operator = operator;
        this.right = right;
      },
      transform: function(transformer) {
        return transformer.transformBinaryOperator(this);
      },
      visit: function(visitor) {
        visitor.visitBinaryOperator(this);
      },
      get type() {
        return BINARY_OPERATOR;
      }
    }, $__proto, $__super, true);
    return $BinaryOperator;
  }(ParseTree);
  var BindingElement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BindingElement = ($__createClass)({
      constructor: function(location, binding, initializer) {
        this.location = location;
        this.binding = binding;
        this.initializer = initializer;
      },
      transform: function(transformer) {
        return transformer.transformBindingElement(this);
      },
      visit: function(visitor) {
        visitor.visitBindingElement(this);
      },
      get type() {
        return BINDING_ELEMENT;
      }
    }, $__proto, $__super, true);
    return $BindingElement;
  }(ParseTree);
  var BindingIdentifier = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BindingIdentifier = ($__createClass)({
      constructor: function(location, identifierToken) {
        this.location = location;
        this.identifierToken = identifierToken;
      },
      transform: function(transformer) {
        return transformer.transformBindingIdentifier(this);
      },
      visit: function(visitor) {
        visitor.visitBindingIdentifier(this);
      },
      get type() {
        return BINDING_IDENTIFIER;
      }
    }, $__proto, $__super, true);
    return $BindingIdentifier;
  }(ParseTree);
  var Block = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $Block = ($__createClass)({
      constructor: function(location, statements) {
        this.location = location;
        this.statements = statements;
      },
      transform: function(transformer) {
        return transformer.transformBlock(this);
      },
      visit: function(visitor) {
        visitor.visitBlock(this);
      },
      get type() {
        return BLOCK;
      }
    }, $__proto, $__super, true);
    return $Block;
  }(ParseTree);
  var BreakStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BreakStatement = ($__createClass)({
      constructor: function(location, name) {
        this.location = location;
        this.name = name;
      },
      transform: function(transformer) {
        return transformer.transformBreakStatement(this);
      },
      visit: function(visitor) {
        visitor.visitBreakStatement(this);
      },
      get type() {
        return BREAK_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $BreakStatement;
  }(ParseTree);
  var CallExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CallExpression = ($__createClass)({
      constructor: function(location, operand, args) {
        this.location = location;
        this.operand = operand;
        this.args = args;
      },
      transform: function(transformer) {
        return transformer.transformCallExpression(this);
      },
      visit: function(visitor) {
        visitor.visitCallExpression(this);
      },
      get type() {
        return CALL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $CallExpression;
  }(ParseTree);
  var CascadeExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CascadeExpression = ($__createClass)({
      constructor: function(location, operand, expressions) {
        this.location = location;
        this.operand = operand;
        this.expressions = expressions;
      },
      transform: function(transformer) {
        return transformer.transformCascadeExpression(this);
      },
      visit: function(visitor) {
        visitor.visitCascadeExpression(this);
      },
      get type() {
        return CASCADE_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $CascadeExpression;
  }(ParseTree);
  var CaseClause = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CaseClause = ($__createClass)({
      constructor: function(location, expression, statements) {
        this.location = location;
        this.expression = expression;
        this.statements = statements;
      },
      transform: function(transformer) {
        return transformer.transformCaseClause(this);
      },
      visit: function(visitor) {
        visitor.visitCaseClause(this);
      },
      get type() {
        return CASE_CLAUSE;
      }
    }, $__proto, $__super, true);
    return $CaseClause;
  }(ParseTree);
  var Catch = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $Catch = ($__createClass)({
      constructor: function(location, binding, catchBody) {
        this.location = location;
        this.binding = binding;
        this.catchBody = catchBody;
      },
      transform: function(transformer) {
        return transformer.transformCatch(this);
      },
      visit: function(visitor) {
        visitor.visitCatch(this);
      },
      get type() {
        return CATCH;
      }
    }, $__proto, $__super, true);
    return $Catch;
  }(ParseTree);
  var ClassDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ClassDeclaration = ($__createClass)({
      constructor: function(location, name, superClass, elements) {
        this.location = location;
        this.name = name;
        this.superClass = superClass;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformClassDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitClassDeclaration(this);
      },
      get type() {
        return CLASS_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $ClassDeclaration;
  }(ParseTree);
  var ClassExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ClassExpression = ($__createClass)({
      constructor: function(location, name, superClass, elements) {
        this.location = location;
        this.name = name;
        this.superClass = superClass;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformClassExpression(this);
      },
      visit: function(visitor) {
        visitor.visitClassExpression(this);
      },
      get type() {
        return CLASS_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ClassExpression;
  }(ParseTree);
  var CommaExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CommaExpression = ($__createClass)({
      constructor: function(location, expressions) {
        this.location = location;
        this.expressions = expressions;
      },
      transform: function(transformer) {
        return transformer.transformCommaExpression(this);
      },
      visit: function(visitor) {
        visitor.visitCommaExpression(this);
      },
      get type() {
        return COMMA_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $CommaExpression;
  }(ParseTree);
  var ComprehensionFor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ComprehensionFor = ($__createClass)({
      constructor: function(location, left, iterator) {
        this.location = location;
        this.left = left;
        this.iterator = iterator;
      },
      transform: function(transformer) {
        return transformer.transformComprehensionFor(this);
      },
      visit: function(visitor) {
        visitor.visitComprehensionFor(this);
      },
      get type() {
        return COMPREHENSION_FOR;
      }
    }, $__proto, $__super, true);
    return $ComprehensionFor;
  }(ParseTree);
  var ConditionalExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ConditionalExpression = ($__createClass)({
      constructor: function(location, condition, left, right) {
        this.location = location;
        this.condition = condition;
        this.left = left;
        this.right = right;
      },
      transform: function(transformer) {
        return transformer.transformConditionalExpression(this);
      },
      visit: function(visitor) {
        visitor.visitConditionalExpression(this);
      },
      get type() {
        return CONDITIONAL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ConditionalExpression;
  }(ParseTree);
  var ContinueStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ContinueStatement = ($__createClass)({
      constructor: function(location, name) {
        this.location = location;
        this.name = name;
      },
      transform: function(transformer) {
        return transformer.transformContinueStatement(this);
      },
      visit: function(visitor) {
        visitor.visitContinueStatement(this);
      },
      get type() {
        return CONTINUE_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ContinueStatement;
  }(ParseTree);
  var CoverFormals = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CoverFormals = ($__createClass)({
      constructor: function(location, expressions) {
        this.location = location;
        this.expressions = expressions;
      },
      transform: function(transformer) {
        return transformer.transformCoverFormals(this);
      },
      visit: function(visitor) {
        visitor.visitCoverFormals(this);
      },
      get type() {
        return COVER_FORMALS;
      }
    }, $__proto, $__super, true);
    return $CoverFormals;
  }(ParseTree);
  var DebuggerStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $DebuggerStatement = ($__createClass)({
      constructor: function(location) {
        this.location = location;
      },
      transform: function(transformer) {
        return transformer.transformDebuggerStatement(this);
      },
      visit: function(visitor) {
        visitor.visitDebuggerStatement(this);
      },
      get type() {
        return DEBUGGER_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $DebuggerStatement;
  }(ParseTree);
  var DefaultClause = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $DefaultClause = ($__createClass)({
      constructor: function(location, statements) {
        this.location = location;
        this.statements = statements;
      },
      transform: function(transformer) {
        return transformer.transformDefaultClause(this);
      },
      visit: function(visitor) {
        visitor.visitDefaultClause(this);
      },
      get type() {
        return DEFAULT_CLAUSE;
      }
    }, $__proto, $__super, true);
    return $DefaultClause;
  }(ParseTree);
  var DoWhileStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $DoWhileStatement = ($__createClass)({
      constructor: function(location, body, condition) {
        this.location = location;
        this.body = body;
        this.condition = condition;
      },
      transform: function(transformer) {
        return transformer.transformDoWhileStatement(this);
      },
      visit: function(visitor) {
        visitor.visitDoWhileStatement(this);
      },
      get type() {
        return DO_WHILE_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $DoWhileStatement;
  }(ParseTree);
  var EmptyStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $EmptyStatement = ($__createClass)({
      constructor: function(location) {
        this.location = location;
      },
      transform: function(transformer) {
        return transformer.transformEmptyStatement(this);
      },
      visit: function(visitor) {
        visitor.visitEmptyStatement(this);
      },
      get type() {
        return EMPTY_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $EmptyStatement;
  }(ParseTree);
  var ExportDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportDeclaration = ($__createClass)({
      constructor: function(location, declaration) {
        this.location = location;
        this.declaration = declaration;
      },
      transform: function(transformer) {
        return transformer.transformExportDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitExportDeclaration(this);
      },
      get type() {
        return EXPORT_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $ExportDeclaration;
  }(ParseTree);
  var ExportMapping = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportMapping = ($__createClass)({
      constructor: function(location, moduleExpression, specifierSet) {
        this.location = location;
        this.moduleExpression = moduleExpression;
        this.specifierSet = specifierSet;
      },
      transform: function(transformer) {
        return transformer.transformExportMapping(this);
      },
      visit: function(visitor) {
        visitor.visitExportMapping(this);
      },
      get type() {
        return EXPORT_MAPPING;
      }
    }, $__proto, $__super, true);
    return $ExportMapping;
  }(ParseTree);
  var ExportMappingList = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportMappingList = ($__createClass)({
      constructor: function(location, paths) {
        this.location = location;
        this.paths = paths;
      },
      transform: function(transformer) {
        return transformer.transformExportMappingList(this);
      },
      visit: function(visitor) {
        visitor.visitExportMappingList(this);
      },
      get type() {
        return EXPORT_MAPPING_LIST;
      }
    }, $__proto, $__super, true);
    return $ExportMappingList;
  }(ParseTree);
  var ExportSpecifier = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportSpecifier = ($__createClass)({
      constructor: function(location, lhs, rhs) {
        this.location = location;
        this.lhs = lhs;
        this.rhs = rhs;
      },
      transform: function(transformer) {
        return transformer.transformExportSpecifier(this);
      },
      visit: function(visitor) {
        visitor.visitExportSpecifier(this);
      },
      get type() {
        return EXPORT_SPECIFIER;
      }
    }, $__proto, $__super, true);
    return $ExportSpecifier;
  }(ParseTree);
  var ExportSpecifierSet = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportSpecifierSet = ($__createClass)({
      constructor: function(location, specifiers) {
        this.location = location;
        this.specifiers = specifiers;
      },
      transform: function(transformer) {
        return transformer.transformExportSpecifierSet(this);
      },
      visit: function(visitor) {
        visitor.visitExportSpecifierSet(this);
      },
      get type() {
        return EXPORT_SPECIFIER_SET;
      }
    }, $__proto, $__super, true);
    return $ExportSpecifierSet;
  }(ParseTree);
  var ExportStar = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExportStar = ($__createClass)({
      constructor: function(location) {
        this.location = location;
      },
      transform: function(transformer) {
        return transformer.transformExportStar(this);
      },
      visit: function(visitor) {
        visitor.visitExportStar(this);
      },
      get type() {
        return EXPORT_STAR;
      }
    }, $__proto, $__super, true);
    return $ExportStar;
  }(ParseTree);
  var ExpressionStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ExpressionStatement = ($__createClass)({
      constructor: function(location, expression) {
        this.location = location;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformExpressionStatement(this);
      },
      visit: function(visitor) {
        visitor.visitExpressionStatement(this);
      },
      get type() {
        return EXPRESSION_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ExpressionStatement;
  }(ParseTree);
  var Finally = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $Finally = ($__createClass)({
      constructor: function(location, block) {
        this.location = location;
        this.block = block;
      },
      transform: function(transformer) {
        return transformer.transformFinally(this);
      },
      visit: function(visitor) {
        visitor.visitFinally(this);
      },
      get type() {
        return FINALLY;
      }
    }, $__proto, $__super, true);
    return $Finally;
  }(ParseTree);
  var ForInStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ForInStatement = ($__createClass)({
      constructor: function(location, initializer, collection, body) {
        this.location = location;
        this.initializer = initializer;
        this.collection = collection;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformForInStatement(this);
      },
      visit: function(visitor) {
        visitor.visitForInStatement(this);
      },
      get type() {
        return FOR_IN_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ForInStatement;
  }(ParseTree);
  var ForOfStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ForOfStatement = ($__createClass)({
      constructor: function(location, initializer, collection, body) {
        this.location = location;
        this.initializer = initializer;
        this.collection = collection;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformForOfStatement(this);
      },
      visit: function(visitor) {
        visitor.visitForOfStatement(this);
      },
      get type() {
        return FOR_OF_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ForOfStatement;
  }(ParseTree);
  var ForStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ForStatement = ($__createClass)({
      constructor: function(location, initializer, condition, increment, body) {
        this.location = location;
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformForStatement(this);
      },
      visit: function(visitor) {
        visitor.visitForStatement(this);
      },
      get type() {
        return FOR_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ForStatement;
  }(ParseTree);
  var FormalParameterList = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FormalParameterList = ($__createClass)({
      constructor: function(location, parameters) {
        this.location = location;
        this.parameters = parameters;
      },
      transform: function(transformer) {
        return transformer.transformFormalParameterList(this);
      },
      visit: function(visitor) {
        visitor.visitFormalParameterList(this);
      },
      get type() {
        return FORMAL_PARAMETER_LIST;
      }
    }, $__proto, $__super, true);
    return $FormalParameterList;
  }(ParseTree);
  var FunctionDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FunctionDeclaration = ($__createClass)({
      constructor: function(location, name, isGenerator, formalParameterList, functionBody) {
        this.location = location;
        this.name = name;
        this.isGenerator = isGenerator;
        this.formalParameterList = formalParameterList;
        this.functionBody = functionBody;
      },
      transform: function(transformer) {
        return transformer.transformFunctionDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitFunctionDeclaration(this);
      },
      get type() {
        return FUNCTION_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $FunctionDeclaration;
  }(ParseTree);
  var FunctionExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FunctionExpression = ($__createClass)({
      constructor: function(location, name, isGenerator, formalParameterList, functionBody) {
        this.location = location;
        this.name = name;
        this.isGenerator = isGenerator;
        this.formalParameterList = formalParameterList;
        this.functionBody = functionBody;
      },
      transform: function(transformer) {
        return transformer.transformFunctionExpression(this);
      },
      visit: function(visitor) {
        visitor.visitFunctionExpression(this);
      },
      get type() {
        return FUNCTION_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $FunctionExpression;
  }(ParseTree);
  var GeneratorComprehension = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $GeneratorComprehension = ($__createClass)({
      constructor: function(location, expression, comprehensionForList, ifExpression) {
        this.location = location;
        this.expression = expression;
        this.comprehensionForList = comprehensionForList;
        this.ifExpression = ifExpression;
      },
      transform: function(transformer) {
        return transformer.transformGeneratorComprehension(this);
      },
      visit: function(visitor) {
        visitor.visitGeneratorComprehension(this);
      },
      get type() {
        return GENERATOR_COMPREHENSION;
      }
    }, $__proto, $__super, true);
    return $GeneratorComprehension;
  }(ParseTree);
  var GetAccessor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $GetAccessor = ($__createClass)({
      constructor: function(location, name, body) {
        this.location = location;
        this.name = name;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformGetAccessor(this);
      },
      visit: function(visitor) {
        visitor.visitGetAccessor(this);
      },
      get type() {
        return GET_ACCESSOR;
      }
    }, $__proto, $__super, true);
    return $GetAccessor;
  }(ParseTree);
  var IdentifierExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $IdentifierExpression = ($__createClass)({
      constructor: function(location, identifierToken) {
        this.location = location;
        this.identifierToken = identifierToken;
      },
      transform: function(transformer) {
        return transformer.transformIdentifierExpression(this);
      },
      visit: function(visitor) {
        visitor.visitIdentifierExpression(this);
      },
      get type() {
        return IDENTIFIER_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $IdentifierExpression;
  }(ParseTree);
  var IfStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $IfStatement = ($__createClass)({
      constructor: function(location, condition, ifClause, elseClause) {
        this.location = location;
        this.condition = condition;
        this.ifClause = ifClause;
        this.elseClause = elseClause;
      },
      transform: function(transformer) {
        return transformer.transformIfStatement(this);
      },
      visit: function(visitor) {
        visitor.visitIfStatement(this);
      },
      get type() {
        return IF_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $IfStatement;
  }(ParseTree);
  var ImportBinding = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ImportBinding = ($__createClass)({
      constructor: function(location, moduleExpression, importSpecifierSet) {
        this.location = location;
        this.moduleExpression = moduleExpression;
        this.importSpecifierSet = importSpecifierSet;
      },
      transform: function(transformer) {
        return transformer.transformImportBinding(this);
      },
      visit: function(visitor) {
        visitor.visitImportBinding(this);
      },
      get type() {
        return IMPORT_BINDING;
      }
    }, $__proto, $__super, true);
    return $ImportBinding;
  }(ParseTree);
  var ImportDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ImportDeclaration = ($__createClass)({
      constructor: function(location, importPathList) {
        this.location = location;
        this.importPathList = importPathList;
      },
      transform: function(transformer) {
        return transformer.transformImportDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitImportDeclaration(this);
      },
      get type() {
        return IMPORT_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $ImportDeclaration;
  }(ParseTree);
  var ImportSpecifier = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ImportSpecifier = ($__createClass)({
      constructor: function(location, lhs, rhs) {
        this.location = location;
        this.lhs = lhs;
        this.rhs = rhs;
      },
      transform: function(transformer) {
        return transformer.transformImportSpecifier(this);
      },
      visit: function(visitor) {
        visitor.visitImportSpecifier(this);
      },
      get type() {
        return IMPORT_SPECIFIER;
      }
    }, $__proto, $__super, true);
    return $ImportSpecifier;
  }(ParseTree);
  var ImportSpecifierSet = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ImportSpecifierSet = ($__createClass)({
      constructor: function(location, specifiers) {
        this.location = location;
        this.specifiers = specifiers;
      },
      transform: function(transformer) {
        return transformer.transformImportSpecifierSet(this);
      },
      visit: function(visitor) {
        visitor.visitImportSpecifierSet(this);
      },
      get type() {
        return IMPORT_SPECIFIER_SET;
      }
    }, $__proto, $__super, true);
    return $ImportSpecifierSet;
  }(ParseTree);
  var LabelledStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $LabelledStatement = ($__createClass)({
      constructor: function(location, name, statement) {
        this.location = location;
        this.name = name;
        this.statement = statement;
      },
      transform: function(transformer) {
        return transformer.transformLabelledStatement(this);
      },
      visit: function(visitor) {
        visitor.visitLabelledStatement(this);
      },
      get type() {
        return LABELLED_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $LabelledStatement;
  }(ParseTree);
  var LiteralExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $LiteralExpression = ($__createClass)({
      constructor: function(location, literalToken) {
        this.location = location;
        this.literalToken = literalToken;
      },
      transform: function(transformer) {
        return transformer.transformLiteralExpression(this);
      },
      visit: function(visitor) {
        visitor.visitLiteralExpression(this);
      },
      get type() {
        return LITERAL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $LiteralExpression;
  }(ParseTree);
  var MemberExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $MemberExpression = ($__createClass)({
      constructor: function(location, operand, memberName) {
        this.location = location;
        this.operand = operand;
        this.memberName = memberName;
      },
      transform: function(transformer) {
        return transformer.transformMemberExpression(this);
      },
      visit: function(visitor) {
        visitor.visitMemberExpression(this);
      },
      get type() {
        return MEMBER_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $MemberExpression;
  }(ParseTree);
  var MemberLookupExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $MemberLookupExpression = ($__createClass)({
      constructor: function(location, operand, memberExpression) {
        this.location = location;
        this.operand = operand;
        this.memberExpression = memberExpression;
      },
      transform: function(transformer) {
        return transformer.transformMemberLookupExpression(this);
      },
      visit: function(visitor) {
        visitor.visitMemberLookupExpression(this);
      },
      get type() {
        return MEMBER_LOOKUP_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $MemberLookupExpression;
  }(ParseTree);
  var MissingPrimaryExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $MissingPrimaryExpression = ($__createClass)({
      constructor: function(location, nextToken) {
        this.location = location;
        this.nextToken = nextToken;
      },
      transform: function(transformer) {
        return transformer.transformMissingPrimaryExpression(this);
      },
      visit: function(visitor) {
        visitor.visitMissingPrimaryExpression(this);
      },
      get type() {
        return MISSING_PRIMARY_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $MissingPrimaryExpression;
  }(ParseTree);
  var ModuleDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleDeclaration = ($__createClass)({
      constructor: function(location, specifiers) {
        this.location = location;
        this.specifiers = specifiers;
      },
      transform: function(transformer) {
        return transformer.transformModuleDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitModuleDeclaration(this);
      },
      get type() {
        return MODULE_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $ModuleDeclaration;
  }(ParseTree);
  var ModuleDefinition = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleDefinition = ($__createClass)({
      constructor: function(location, name, elements) {
        this.location = location;
        this.name = name;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformModuleDefinition(this);
      },
      visit: function(visitor) {
        visitor.visitModuleDefinition(this);
      },
      get type() {
        return MODULE_DEFINITION;
      }
    }, $__proto, $__super, true);
    return $ModuleDefinition;
  }(ParseTree);
  var ModuleExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleExpression = ($__createClass)({
      constructor: function(location, reference, identifiers) {
        this.location = location;
        this.reference = reference;
        this.identifiers = identifiers;
      },
      transform: function(transformer) {
        return transformer.transformModuleExpression(this);
      },
      visit: function(visitor) {
        visitor.visitModuleExpression(this);
      },
      get type() {
        return MODULE_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ModuleExpression;
  }(ParseTree);
  var ModuleRequire = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleRequire = ($__createClass)({
      constructor: function(location, url) {
        this.location = location;
        this.url = url;
      },
      transform: function(transformer) {
        return transformer.transformModuleRequire(this);
      },
      visit: function(visitor) {
        visitor.visitModuleRequire(this);
      },
      get type() {
        return MODULE_REQUIRE;
      }
    }, $__proto, $__super, true);
    return $ModuleRequire;
  }(ParseTree);
  var ModuleSpecifier = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleSpecifier = ($__createClass)({
      constructor: function(location, identifier, expression) {
        this.location = location;
        this.identifier = identifier;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformModuleSpecifier(this);
      },
      visit: function(visitor) {
        visitor.visitModuleSpecifier(this);
      },
      get type() {
        return MODULE_SPECIFIER;
      }
    }, $__proto, $__super, true);
    return $ModuleSpecifier;
  }(ParseTree);
  var NameStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $NameStatement = ($__createClass)({
      constructor: function(location, declarations) {
        this.location = location;
        this.declarations = declarations;
      },
      transform: function(transformer) {
        return transformer.transformNameStatement(this);
      },
      visit: function(visitor) {
        visitor.visitNameStatement(this);
      },
      get type() {
        return NAME_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $NameStatement;
  }(ParseTree);
  var NewExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $NewExpression = ($__createClass)({
      constructor: function(location, operand, args) {
        this.location = location;
        this.operand = operand;
        this.args = args;
      },
      transform: function(transformer) {
        return transformer.transformNewExpression(this);
      },
      visit: function(visitor) {
        visitor.visitNewExpression(this);
      },
      get type() {
        return NEW_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $NewExpression;
  }(ParseTree);
  var ObjectLiteralExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ObjectLiteralExpression = ($__createClass)({
      constructor: function(location, propertyNameAndValues) {
        this.location = location;
        this.propertyNameAndValues = propertyNameAndValues;
      },
      transform: function(transformer) {
        return transformer.transformObjectLiteralExpression(this);
      },
      visit: function(visitor) {
        visitor.visitObjectLiteralExpression(this);
      },
      get type() {
        return OBJECT_LITERAL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ObjectLiteralExpression;
  }(ParseTree);
  var ObjectPattern = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ObjectPattern = ($__createClass)({
      constructor: function(location, fields) {
        this.location = location;
        this.fields = fields;
      },
      transform: function(transformer) {
        return transformer.transformObjectPattern(this);
      },
      visit: function(visitor) {
        visitor.visitObjectPattern(this);
      },
      get type() {
        return OBJECT_PATTERN;
      }
    }, $__proto, $__super, true);
    return $ObjectPattern;
  }(ParseTree);
  var ObjectPatternField = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ObjectPatternField = ($__createClass)({
      constructor: function(location, identifier, element) {
        this.location = location;
        this.identifier = identifier;
        this.element = element;
      },
      transform: function(transformer) {
        return transformer.transformObjectPatternField(this);
      },
      visit: function(visitor) {
        visitor.visitObjectPatternField(this);
      },
      get type() {
        return OBJECT_PATTERN_FIELD;
      }
    }, $__proto, $__super, true);
    return $ObjectPatternField;
  }(ParseTree);
  var ParenExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ParenExpression = ($__createClass)({
      constructor: function(location, expression) {
        this.location = location;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformParenExpression(this);
      },
      visit: function(visitor) {
        visitor.visitParenExpression(this);
      },
      get type() {
        return PAREN_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ParenExpression;
  }(ParseTree);
  var PostfixExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PostfixExpression = ($__createClass)({
      constructor: function(location, operand, operator) {
        this.location = location;
        this.operand = operand;
        this.operator = operator;
      },
      transform: function(transformer) {
        return transformer.transformPostfixExpression(this);
      },
      visit: function(visitor) {
        visitor.visitPostfixExpression(this);
      },
      get type() {
        return POSTFIX_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $PostfixExpression;
  }(ParseTree);
  var PredefinedType = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PredefinedType = ($__createClass)({
      constructor: function(location, typeToken) {
        this.location = location;
        this.typeToken = typeToken;
      },
      transform: function(transformer) {
        return transformer.transformPredefinedType(this);
      },
      visit: function(visitor) {
        visitor.visitPredefinedType(this);
      },
      get type() {
        return PREDEFINED_TYPE;
      }
    }, $__proto, $__super, true);
    return $PredefinedType;
  }(ParseTree);
  var Program = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $Program = ($__createClass)({
      constructor: function(location, programElements) {
        this.location = location;
        this.programElements = programElements;
      },
      transform: function(transformer) {
        return transformer.transformProgram(this);
      },
      visit: function(visitor) {
        visitor.visitProgram(this);
      },
      get type() {
        return PROGRAM;
      }
    }, $__proto, $__super, true);
    return $Program;
  }(ParseTree);
  var PropertyMethodAssignment = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PropertyMethodAssignment = ($__createClass)({
      constructor: function(location, name, isGenerator, formalParameterList, functionBody) {
        this.location = location;
        this.name = name;
        this.isGenerator = isGenerator;
        this.formalParameterList = formalParameterList;
        this.functionBody = functionBody;
      },
      transform: function(transformer) {
        return transformer.transformPropertyMethodAssignment(this);
      },
      visit: function(visitor) {
        visitor.visitPropertyMethodAssignment(this);
      },
      get type() {
        return PROPERTY_METHOD_ASSIGNMENT;
      }
    }, $__proto, $__super, true);
    return $PropertyMethodAssignment;
  }(ParseTree);
  var PropertyNameAssignment = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PropertyNameAssignment = ($__createClass)({
      constructor: function(location, name, value) {
        this.location = location;
        this.name = name;
        this.value = value;
      },
      transform: function(transformer) {
        return transformer.transformPropertyNameAssignment(this);
      },
      visit: function(visitor) {
        visitor.visitPropertyNameAssignment(this);
      },
      get type() {
        return PROPERTY_NAME_ASSIGNMENT;
      }
    }, $__proto, $__super, true);
    return $PropertyNameAssignment;
  }(ParseTree);
  var PropertyNameShorthand = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PropertyNameShorthand = ($__createClass)({
      constructor: function(location, name) {
        this.location = location;
        this.name = name;
      },
      transform: function(transformer) {
        return transformer.transformPropertyNameShorthand(this);
      },
      visit: function(visitor) {
        visitor.visitPropertyNameShorthand(this);
      },
      get type() {
        return PROPERTY_NAME_SHORTHAND;
      }
    }, $__proto, $__super, true);
    return $PropertyNameShorthand;
  }(ParseTree);
  var RestParameter = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $RestParameter = ($__createClass)({
      constructor: function(location, identifier) {
        this.location = location;
        this.identifier = identifier;
      },
      transform: function(transformer) {
        return transformer.transformRestParameter(this);
      },
      visit: function(visitor) {
        visitor.visitRestParameter(this);
      },
      get type() {
        return REST_PARAMETER;
      }
    }, $__proto, $__super, true);
    return $RestParameter;
  }(ParseTree);
  var ReturnStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ReturnStatement = ($__createClass)({
      constructor: function(location, expression) {
        this.location = location;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformReturnStatement(this);
      },
      visit: function(visitor) {
        visitor.visitReturnStatement(this);
      },
      get type() {
        return RETURN_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ReturnStatement;
  }(ParseTree);
  var SetAccessor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SetAccessor = ($__createClass)({
      constructor: function(location, name, parameter, body) {
        this.location = location;
        this.name = name;
        this.parameter = parameter;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformSetAccessor(this);
      },
      visit: function(visitor) {
        visitor.visitSetAccessor(this);
      },
      get type() {
        return SET_ACCESSOR;
      }
    }, $__proto, $__super, true);
    return $SetAccessor;
  }(ParseTree);
  var SpreadExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SpreadExpression = ($__createClass)({
      constructor: function(location, expression) {
        this.location = location;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformSpreadExpression(this);
      },
      visit: function(visitor) {
        visitor.visitSpreadExpression(this);
      },
      get type() {
        return SPREAD_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $SpreadExpression;
  }(ParseTree);
  var SpreadPatternElement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SpreadPatternElement = ($__createClass)({
      constructor: function(location, lvalue) {
        this.location = location;
        this.lvalue = lvalue;
      },
      transform: function(transformer) {
        return transformer.transformSpreadPatternElement(this);
      },
      visit: function(visitor) {
        visitor.visitSpreadPatternElement(this);
      },
      get type() {
        return SPREAD_PATTERN_ELEMENT;
      }
    }, $__proto, $__super, true);
    return $SpreadPatternElement;
  }(ParseTree);
  var SuperExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SuperExpression = ($__createClass)({
      constructor: function(location) {
        this.location = location;
      },
      transform: function(transformer) {
        return transformer.transformSuperExpression(this);
      },
      visit: function(visitor) {
        visitor.visitSuperExpression(this);
      },
      get type() {
        return SUPER_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $SuperExpression;
  }(ParseTree);
  var SwitchStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SwitchStatement = ($__createClass)({
      constructor: function(location, expression, caseClauses) {
        this.location = location;
        this.expression = expression;
        this.caseClauses = caseClauses;
      },
      transform: function(transformer) {
        return transformer.transformSwitchStatement(this);
      },
      visit: function(visitor) {
        visitor.visitSwitchStatement(this);
      },
      get type() {
        return SWITCH_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $SwitchStatement;
  }(ParseTree);
  var TemplateLiteralExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TemplateLiteralExpression = ($__createClass)({
      constructor: function(location, operand, elements) {
        this.location = location;
        this.operand = operand;
        this.elements = elements;
      },
      transform: function(transformer) {
        return transformer.transformTemplateLiteralExpression(this);
      },
      visit: function(visitor) {
        visitor.visitTemplateLiteralExpression(this);
      },
      get type() {
        return TEMPLATE_LITERAL_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $TemplateLiteralExpression;
  }(ParseTree);
  var TemplateLiteralPortion = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TemplateLiteralPortion = ($__createClass)({
      constructor: function(location, value) {
        this.location = location;
        this.value = value;
      },
      transform: function(transformer) {
        return transformer.transformTemplateLiteralPortion(this);
      },
      visit: function(visitor) {
        visitor.visitTemplateLiteralPortion(this);
      },
      get type() {
        return TEMPLATE_LITERAL_PORTION;
      }
    }, $__proto, $__super, true);
    return $TemplateLiteralPortion;
  }(ParseTree);
  var TemplateSubstitution = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TemplateSubstitution = ($__createClass)({
      constructor: function(location, expression) {
        this.location = location;
        this.expression = expression;
      },
      transform: function(transformer) {
        return transformer.transformTemplateSubstitution(this);
      },
      visit: function(visitor) {
        visitor.visitTemplateSubstitution(this);
      },
      get type() {
        return TEMPLATE_SUBSTITUTION;
      }
    }, $__proto, $__super, true);
    return $TemplateSubstitution;
  }(ParseTree);
  var ThisExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ThisExpression = ($__createClass)({
      constructor: function(location) {
        this.location = location;
      },
      transform: function(transformer) {
        return transformer.transformThisExpression(this);
      },
      visit: function(visitor) {
        visitor.visitThisExpression(this);
      },
      get type() {
        return THIS_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $ThisExpression;
  }(ParseTree);
  var ThrowStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ThrowStatement = ($__createClass)({
      constructor: function(location, value) {
        this.location = location;
        this.value = value;
      },
      transform: function(transformer) {
        return transformer.transformThrowStatement(this);
      },
      visit: function(visitor) {
        visitor.visitThrowStatement(this);
      },
      get type() {
        return THROW_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $ThrowStatement;
  }(ParseTree);
  var TryStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TryStatement = ($__createClass)({
      constructor: function(location, body, catchBlock, finallyBlock) {
        this.location = location;
        this.body = body;
        this.catchBlock = catchBlock;
        this.finallyBlock = finallyBlock;
      },
      transform: function(transformer) {
        return transformer.transformTryStatement(this);
      },
      visit: function(visitor) {
        visitor.visitTryStatement(this);
      },
      get type() {
        return TRY_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $TryStatement;
  }(ParseTree);
  var TypeName = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TypeName = ($__createClass)({
      constructor: function(location, moduleName, name) {
        this.location = location;
        this.moduleName = moduleName;
        this.name = name;
      },
      transform: function(transformer) {
        return transformer.transformTypeName(this);
      },
      visit: function(visitor) {
        visitor.visitTypeName(this);
      },
      get type() {
        return TYPE_NAME;
      }
    }, $__proto, $__super, true);
    return $TypeName;
  }(ParseTree);
  var UnaryExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $UnaryExpression = ($__createClass)({
      constructor: function(location, operator, operand) {
        this.location = location;
        this.operator = operator;
        this.operand = operand;
      },
      transform: function(transformer) {
        return transformer.transformUnaryExpression(this);
      },
      visit: function(visitor) {
        visitor.visitUnaryExpression(this);
      },
      get type() {
        return UNARY_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $UnaryExpression;
  }(ParseTree);
  var VariableDeclaration = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $VariableDeclaration = ($__createClass)({
      constructor: function(location, lvalue, typeAnnotation, initializer) {
        this.location = location;
        this.lvalue = lvalue;
        this.typeAnnotation = typeAnnotation;
        this.initializer = initializer;
      },
      transform: function(transformer) {
        return transformer.transformVariableDeclaration(this);
      },
      visit: function(visitor) {
        visitor.visitVariableDeclaration(this);
      },
      get type() {
        return VARIABLE_DECLARATION;
      }
    }, $__proto, $__super, true);
    return $VariableDeclaration;
  }(ParseTree);
  var VariableDeclarationList = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $VariableDeclarationList = ($__createClass)({
      constructor: function(location, declarationType, declarations) {
        this.location = location;
        this.declarationType = declarationType;
        this.declarations = declarations;
      },
      transform: function(transformer) {
        return transformer.transformVariableDeclarationList(this);
      },
      visit: function(visitor) {
        visitor.visitVariableDeclarationList(this);
      },
      get type() {
        return VARIABLE_DECLARATION_LIST;
      }
    }, $__proto, $__super, true);
    return $VariableDeclarationList;
  }(ParseTree);
  var VariableStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $VariableStatement = ($__createClass)({
      constructor: function(location, declarations) {
        this.location = location;
        this.declarations = declarations;
      },
      transform: function(transformer) {
        return transformer.transformVariableStatement(this);
      },
      visit: function(visitor) {
        visitor.visitVariableStatement(this);
      },
      get type() {
        return VARIABLE_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $VariableStatement;
  }(ParseTree);
  var WhileStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $WhileStatement = ($__createClass)({
      constructor: function(location, condition, body) {
        this.location = location;
        this.condition = condition;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformWhileStatement(this);
      },
      visit: function(visitor) {
        visitor.visitWhileStatement(this);
      },
      get type() {
        return WHILE_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $WhileStatement;
  }(ParseTree);
  var WithStatement = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $WithStatement = ($__createClass)({
      constructor: function(location, expression, body) {
        this.location = location;
        this.expression = expression;
        this.body = body;
      },
      transform: function(transformer) {
        return transformer.transformWithStatement(this);
      },
      visit: function(visitor) {
        visitor.visitWithStatement(this);
      },
      get type() {
        return WITH_STATEMENT;
      }
    }, $__proto, $__super, true);
    return $WithStatement;
  }(ParseTree);
  var YieldExpression = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $YieldExpression = ($__createClass)({
      constructor: function(location, expression, isYieldFor) {
        this.location = location;
        this.expression = expression;
        this.isYieldFor = isYieldFor;
      },
      transform: function(transformer) {
        return transformer.transformYieldExpression(this);
      },
      visit: function(visitor) {
        visitor.visitYieldExpression(this);
      },
      get type() {
        return YIELD_EXPRESSION;
      }
    }, $__proto, $__super, true);
    return $YieldExpression;
  }(ParseTree);
  return Object.preventExtensions(Object.create(null, {
    ArgumentList: {
      get: function() {
        return ArgumentList;
      },
      enumerable: true
    },
    ArrayComprehension: {
      get: function() {
        return ArrayComprehension;
      },
      enumerable: true
    },
    ArrayLiteralExpression: {
      get: function() {
        return ArrayLiteralExpression;
      },
      enumerable: true
    },
    ArrayPattern: {
      get: function() {
        return ArrayPattern;
      },
      enumerable: true
    },
    ArrowFunctionExpression: {
      get: function() {
        return ArrowFunctionExpression;
      },
      enumerable: true
    },
    AtNameDeclaration: {
      get: function() {
        return AtNameDeclaration;
      },
      enumerable: true
    },
    AtNameExpression: {
      get: function() {
        return AtNameExpression;
      },
      enumerable: true
    },
    AwaitStatement: {
      get: function() {
        return AwaitStatement;
      },
      enumerable: true
    },
    BinaryOperator: {
      get: function() {
        return BinaryOperator;
      },
      enumerable: true
    },
    BindingElement: {
      get: function() {
        return BindingElement;
      },
      enumerable: true
    },
    BindingIdentifier: {
      get: function() {
        return BindingIdentifier;
      },
      enumerable: true
    },
    Block: {
      get: function() {
        return Block;
      },
      enumerable: true
    },
    BreakStatement: {
      get: function() {
        return BreakStatement;
      },
      enumerable: true
    },
    CallExpression: {
      get: function() {
        return CallExpression;
      },
      enumerable: true
    },
    CascadeExpression: {
      get: function() {
        return CascadeExpression;
      },
      enumerable: true
    },
    CaseClause: {
      get: function() {
        return CaseClause;
      },
      enumerable: true
    },
    Catch: {
      get: function() {
        return Catch;
      },
      enumerable: true
    },
    ClassDeclaration: {
      get: function() {
        return ClassDeclaration;
      },
      enumerable: true
    },
    ClassExpression: {
      get: function() {
        return ClassExpression;
      },
      enumerable: true
    },
    CommaExpression: {
      get: function() {
        return CommaExpression;
      },
      enumerable: true
    },
    ComprehensionFor: {
      get: function() {
        return ComprehensionFor;
      },
      enumerable: true
    },
    ConditionalExpression: {
      get: function() {
        return ConditionalExpression;
      },
      enumerable: true
    },
    ContinueStatement: {
      get: function() {
        return ContinueStatement;
      },
      enumerable: true
    },
    CoverFormals: {
      get: function() {
        return CoverFormals;
      },
      enumerable: true
    },
    DebuggerStatement: {
      get: function() {
        return DebuggerStatement;
      },
      enumerable: true
    },
    DefaultClause: {
      get: function() {
        return DefaultClause;
      },
      enumerable: true
    },
    DoWhileStatement: {
      get: function() {
        return DoWhileStatement;
      },
      enumerable: true
    },
    EmptyStatement: {
      get: function() {
        return EmptyStatement;
      },
      enumerable: true
    },
    ExportDeclaration: {
      get: function() {
        return ExportDeclaration;
      },
      enumerable: true
    },
    ExportMapping: {
      get: function() {
        return ExportMapping;
      },
      enumerable: true
    },
    ExportMappingList: {
      get: function() {
        return ExportMappingList;
      },
      enumerable: true
    },
    ExportSpecifier: {
      get: function() {
        return ExportSpecifier;
      },
      enumerable: true
    },
    ExportSpecifierSet: {
      get: function() {
        return ExportSpecifierSet;
      },
      enumerable: true
    },
    ExportStar: {
      get: function() {
        return ExportStar;
      },
      enumerable: true
    },
    ExpressionStatement: {
      get: function() {
        return ExpressionStatement;
      },
      enumerable: true
    },
    Finally: {
      get: function() {
        return Finally;
      },
      enumerable: true
    },
    ForInStatement: {
      get: function() {
        return ForInStatement;
      },
      enumerable: true
    },
    ForOfStatement: {
      get: function() {
        return ForOfStatement;
      },
      enumerable: true
    },
    ForStatement: {
      get: function() {
        return ForStatement;
      },
      enumerable: true
    },
    FormalParameterList: {
      get: function() {
        return FormalParameterList;
      },
      enumerable: true
    },
    FunctionDeclaration: {
      get: function() {
        return FunctionDeclaration;
      },
      enumerable: true
    },
    FunctionExpression: {
      get: function() {
        return FunctionExpression;
      },
      enumerable: true
    },
    GeneratorComprehension: {
      get: function() {
        return GeneratorComprehension;
      },
      enumerable: true
    },
    GetAccessor: {
      get: function() {
        return GetAccessor;
      },
      enumerable: true
    },
    IdentifierExpression: {
      get: function() {
        return IdentifierExpression;
      },
      enumerable: true
    },
    IfStatement: {
      get: function() {
        return IfStatement;
      },
      enumerable: true
    },
    ImportBinding: {
      get: function() {
        return ImportBinding;
      },
      enumerable: true
    },
    ImportDeclaration: {
      get: function() {
        return ImportDeclaration;
      },
      enumerable: true
    },
    ImportSpecifier: {
      get: function() {
        return ImportSpecifier;
      },
      enumerable: true
    },
    ImportSpecifierSet: {
      get: function() {
        return ImportSpecifierSet;
      },
      enumerable: true
    },
    LabelledStatement: {
      get: function() {
        return LabelledStatement;
      },
      enumerable: true
    },
    LiteralExpression: {
      get: function() {
        return LiteralExpression;
      },
      enumerable: true
    },
    MemberExpression: {
      get: function() {
        return MemberExpression;
      },
      enumerable: true
    },
    MemberLookupExpression: {
      get: function() {
        return MemberLookupExpression;
      },
      enumerable: true
    },
    MissingPrimaryExpression: {
      get: function() {
        return MissingPrimaryExpression;
      },
      enumerable: true
    },
    ModuleDeclaration: {
      get: function() {
        return ModuleDeclaration;
      },
      enumerable: true
    },
    ModuleDefinition: {
      get: function() {
        return ModuleDefinition;
      },
      enumerable: true
    },
    ModuleExpression: {
      get: function() {
        return ModuleExpression;
      },
      enumerable: true
    },
    ModuleRequire: {
      get: function() {
        return ModuleRequire;
      },
      enumerable: true
    },
    ModuleSpecifier: {
      get: function() {
        return ModuleSpecifier;
      },
      enumerable: true
    },
    NameStatement: {
      get: function() {
        return NameStatement;
      },
      enumerable: true
    },
    NewExpression: {
      get: function() {
        return NewExpression;
      },
      enumerable: true
    },
    ObjectLiteralExpression: {
      get: function() {
        return ObjectLiteralExpression;
      },
      enumerable: true
    },
    ObjectPattern: {
      get: function() {
        return ObjectPattern;
      },
      enumerable: true
    },
    ObjectPatternField: {
      get: function() {
        return ObjectPatternField;
      },
      enumerable: true
    },
    ParenExpression: {
      get: function() {
        return ParenExpression;
      },
      enumerable: true
    },
    PostfixExpression: {
      get: function() {
        return PostfixExpression;
      },
      enumerable: true
    },
    PredefinedType: {
      get: function() {
        return PredefinedType;
      },
      enumerable: true
    },
    Program: {
      get: function() {
        return Program;
      },
      enumerable: true
    },
    PropertyMethodAssignment: {
      get: function() {
        return PropertyMethodAssignment;
      },
      enumerable: true
    },
    PropertyNameAssignment: {
      get: function() {
        return PropertyNameAssignment;
      },
      enumerable: true
    },
    PropertyNameShorthand: {
      get: function() {
        return PropertyNameShorthand;
      },
      enumerable: true
    },
    RestParameter: {
      get: function() {
        return RestParameter;
      },
      enumerable: true
    },
    ReturnStatement: {
      get: function() {
        return ReturnStatement;
      },
      enumerable: true
    },
    SetAccessor: {
      get: function() {
        return SetAccessor;
      },
      enumerable: true
    },
    SpreadExpression: {
      get: function() {
        return SpreadExpression;
      },
      enumerable: true
    },
    SpreadPatternElement: {
      get: function() {
        return SpreadPatternElement;
      },
      enumerable: true
    },
    SuperExpression: {
      get: function() {
        return SuperExpression;
      },
      enumerable: true
    },
    SwitchStatement: {
      get: function() {
        return SwitchStatement;
      },
      enumerable: true
    },
    TemplateLiteralExpression: {
      get: function() {
        return TemplateLiteralExpression;
      },
      enumerable: true
    },
    TemplateLiteralPortion: {
      get: function() {
        return TemplateLiteralPortion;
      },
      enumerable: true
    },
    TemplateSubstitution: {
      get: function() {
        return TemplateSubstitution;
      },
      enumerable: true
    },
    ThisExpression: {
      get: function() {
        return ThisExpression;
      },
      enumerable: true
    },
    ThrowStatement: {
      get: function() {
        return ThrowStatement;
      },
      enumerable: true
    },
    TryStatement: {
      get: function() {
        return TryStatement;
      },
      enumerable: true
    },
    TypeName: {
      get: function() {
        return TypeName;
      },
      enumerable: true
    },
    UnaryExpression: {
      get: function() {
        return UnaryExpression;
      },
      enumerable: true
    },
    VariableDeclaration: {
      get: function() {
        return VariableDeclaration;
      },
      enumerable: true
    },
    VariableDeclarationList: {
      get: function() {
        return VariableDeclarationList;
      },
      enumerable: true
    },
    VariableStatement: {
      get: function() {
        return VariableStatement;
      },
      enumerable: true
    },
    WhileStatement: {
      get: function() {
        return WhileStatement;
      },
      enumerable: true
    },
    WithStatement: {
      get: function() {
        return WithStatement;
      },
      enumerable: true
    },
    YieldExpression: {
      get: function() {
        return YieldExpression;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_ParseTreeTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, ArgumentList = $__9.ArgumentList, ArrayComprehension = $__9.ArrayComprehension, ArrayLiteralExpression = $__9.ArrayLiteralExpression, ArrayPattern = $__9.ArrayPattern, ArrowFunctionExpression = $__9.ArrowFunctionExpression, AtNameDeclaration = $__9.AtNameDeclaration, AtNameExpression = $__9.AtNameExpression, AwaitStatement = $__9.AwaitStatement, BinaryOperator = $__9.BinaryOperator, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, Block = $__9.Block, BreakStatement = $__9.BreakStatement, CallExpression = $__9.CallExpression, CascadeExpression = $__9.CascadeExpression, CaseClause = $__9.CaseClause, Catch = $__9.Catch, ClassDeclaration = $__9.ClassDeclaration, ClassExpression = $__9.ClassExpression, CommaExpression = $__9.CommaExpression, ComprehensionFor = $__9.ComprehensionFor, ConditionalExpression = $__9.ConditionalExpression, ContinueStatement = $__9.ContinueStatement, CoverFormals = $__9.CoverFormals, DebuggerStatement = $__9.DebuggerStatement, DefaultClause = $__9.DefaultClause, DoWhileStatement = $__9.DoWhileStatement, EmptyStatement = $__9.EmptyStatement, ExportDeclaration = $__9.ExportDeclaration, ExportMapping = $__9.ExportMapping, ExportMappingList = $__9.ExportMappingList, ExportSpecifier = $__9.ExportSpecifier, ExportSpecifierSet = $__9.ExportSpecifierSet, ExportStar = $__9.ExportStar, ExpressionStatement = $__9.ExpressionStatement, Finally = $__9.Finally, ForInStatement = $__9.ForInStatement, ForOfStatement = $__9.ForOfStatement, ForStatement = $__9.ForStatement, FormalParameterList = $__9.FormalParameterList, FunctionDeclaration = $__9.FunctionDeclaration, FunctionExpression = $__9.FunctionExpression, GeneratorComprehension = $__9.GeneratorComprehension, GetAccessor = $__9.GetAccessor, IdentifierExpression = $__9.IdentifierExpression, IfStatement = $__9.IfStatement, ImportBinding = $__9.ImportBinding, ImportDeclaration = $__9.ImportDeclaration, ImportSpecifier = $__9.ImportSpecifier, ImportSpecifierSet = $__9.ImportSpecifierSet, LabelledStatement = $__9.LabelledStatement, LiteralExpression = $__9.LiteralExpression, MemberExpression = $__9.MemberExpression, MemberLookupExpression = $__9.MemberLookupExpression, MissingPrimaryExpression = $__9.MissingPrimaryExpression, ModuleDeclaration = $__9.ModuleDeclaration, ModuleDefinition = $__9.ModuleDefinition, ModuleExpression = $__9.ModuleExpression, ModuleRequire = $__9.ModuleRequire, ModuleSpecifier = $__9.ModuleSpecifier, NameStatement = $__9.NameStatement, NewExpression = $__9.NewExpression, ObjectLiteralExpression = $__9.ObjectLiteralExpression, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, ParenExpression = $__9.ParenExpression, PostfixExpression = $__9.PostfixExpression, PredefinedType = $__9.PredefinedType, Program = $__9.Program, PropertyMethodAssignment = $__9.PropertyMethodAssignment, PropertyNameAssignment = $__9.PropertyNameAssignment, PropertyNameShorthand = $__9.PropertyNameShorthand, RestParameter = $__9.RestParameter, ReturnStatement = $__9.ReturnStatement, SetAccessor = $__9.SetAccessor, SpreadExpression = $__9.SpreadExpression, SpreadPatternElement = $__9.SpreadPatternElement, SuperExpression = $__9.SuperExpression, SwitchStatement = $__9.SwitchStatement, TemplateLiteralExpression = $__9.TemplateLiteralExpression, TemplateLiteralPortion = $__9.TemplateLiteralPortion, TemplateSubstitution = $__9.TemplateSubstitution, ThisExpression = $__9.ThisExpression, ThrowStatement = $__9.ThrowStatement, TryStatement = $__9.TryStatement, TypeName = $__9.TypeName, UnaryExpression = $__9.UnaryExpression, VariableDeclaration = $__9.VariableDeclaration, VariableDeclarationList = $__9.VariableDeclarationList, VariableStatement = $__9.VariableStatement, WhileStatement = $__9.WhileStatement, WithStatement = $__9.WithStatement, YieldExpression = $__9.YieldExpression;
  var ParseTreeTransformer = function() {
    var $ParseTreeTransformer = ($__createClassNoExtends)({
      constructor: function() {},
      transformAny: function(tree) {
        return tree && tree.transform(this);
      },
      transformList: function(list) {
        if (list == null || list.length == 0) {
          return list;
        }
        var builder = null;
        for (var index = 0; index < list.length; index++) {
          var element = list[index];
          var transformed = this.transformAny(element);
          if (builder != null || element != transformed) {
            if (builder == null) {
              builder = list.slice(0, index);
            }
            builder.push(transformed);
          }
        }
        return builder || list;
      },
      toSourceElement: function(tree) {
        return tree.isSourceElement() ? tree: new ExpressionStatement(tree.location, tree);
      },
      transformSourceElements: function(list) {
        if (list == null || list.length == 0) {
          return list;
        }
        var builder = null;
        for (var index = 0; index < list.length; index++) {
          var element = list[index];
          var transformed = this.toSourceElement(this.transformAny(element));
          if (builder != null || element != transformed) {
            if (builder == null) {
              builder = list.slice(0, index);
            }
            builder.push(transformed);
          }
        }
        return builder || list;
      },
      transformArgumentList: function(tree) {
        var args = this.transformList(tree.args);
        if (args == tree.args) {
          return tree;
        }
        return new ArgumentList(tree.location, args);
      },
      transformArrayComprehension: function(tree) {
        var expression = this.transformAny(tree.expression);
        var comprehensionForList = this.transformList(tree.comprehensionForList);
        var ifExpression = this.transformAny(tree.ifExpression);
        if (expression === tree.expression && comprehensionForList === tree.comprehensionForList && ifExpression === tree.ifExpression) {
          return tree;
        }
        return new ArrayComprehension(tree.location, expression, comprehensionForList, ifExpression);
      },
      transformArrayLiteralExpression: function(tree) {
        var elements = this.transformList(tree.elements);
        if (elements == tree.elements) {
          return tree;
        }
        return new ArrayLiteralExpression(tree.location, elements);
      },
      transformArrayPattern: function(tree) {
        var elements = this.transformList(tree.elements);
        if (elements == tree.elements) {
          return tree;
        }
        return new ArrayPattern(tree.location, elements);
      },
      transformArrowFunctionExpression: function(tree) {
        var parameters = this.transformAny(tree.formalParameters);
        var body = this.transformAny(tree.functionBody);
        if (parameters == tree.formalParameters && body == tree.functionBody) {
          return tree;
        }
        return new ArrowFunctionExpression(null, parameters, body);
      },
      transformAtNameExpression: function(tree) {
        return tree;
      },
      transformAtNameDeclaration: function(tree) {
        var initializer = this.transformAny(tree.initializer);
        if (initializer === tree.initializer) return tree;
        return new AtNameDeclaration(tree.location, tree.atNameToken, initializer);
      },
      transformAwaitStatement: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (tree.expression == expression) {
          return tree;
        }
        return new AwaitStatement(tree.location, tree.identifier, expression);
      },
      transformBinaryOperator: function(tree) {
        var left = this.transformAny(tree.left);
        var right = this.transformAny(tree.right);
        if (left == tree.left && right == tree.right) {
          return tree;
        }
        return new BinaryOperator(tree.location, left, tree.operator, right);
      },
      transformBindingElement: function(tree) {
        var binding = this.transformAny(tree.binding);
        var initializer = this.transformAny(tree.initializer);
        if (binding === tree.binding && initializer === tree.initializer) return tree;
        return new BindingElement(tree.location, binding, initializer);
      },
      transformBindingIdentifier: function(tree) {
        return tree;
      },
      transformBlock: function(tree) {
        var elements = this.transformList(tree.statements);
        if (elements == tree.statements) {
          return tree;
        }
        return new Block(tree.location, elements);
      },
      transformBreakStatement: function(tree) {
        return tree;
      },
      transformCallExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var args = this.transformAny(tree.args);
        if (operand == tree.operand && args == tree.args) {
          return tree;
        }
        return new CallExpression(tree.location, operand, args);
      },
      transformCaseClause: function(tree) {
        var expression = this.transformAny(tree.expression);
        var statements = this.transformList(tree.statements);
        if (expression == tree.expression && statements == tree.statements) {
          return tree;
        }
        return new CaseClause(tree.location, expression, statements);
      },
      transformCatch: function(tree) {
        var catchBody = this.transformAny(tree.catchBody);
        var binding = this.transformAny(tree.binding);
        if (catchBody == tree.catchBody && binding == tree.binding) {
          return tree;
        }
        return new Catch(tree.location, binding, catchBody);
      },
      transformCascadeExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var expressions = this.transformList(tree.expressions);
        if (operand == tree.operand && expressions == tree.expressions) {
          return tree;
        }
        return new CascadeExpression(tree.location, operand, expressions);
      },
      transformClassDeclaration: function(tree) {
        var superClass = this.transformAny(tree.superClass);
        var elements = this.transformList(tree.elements);
        if (superClass == tree.superClass && elements == tree.elements) return tree;
        return new ClassDeclaration(tree.location, tree.name, superClass, elements);
      },
      transformClassExpression: function(tree) {
        var superClass = this.transformAny(tree.superClass);
        var elements = this.transformList(tree.elements);
        if (superClass == tree.superClass && elements == tree.elements) return tree;
        return new ClassExpression(tree.location, tree.name, superClass, elements);
      },
      transformCommaExpression: function(tree) {
        var expressions = this.transformList(tree.expressions);
        if (expressions == tree.expressions) {
          return tree;
        }
        return new CommaExpression(tree.location, expressions);
      },
      transformComprehensionFor: function(tree) {
        var left = this.transformAny(tree.left);
        var iterator = this.transformAny(tree.iterator);
        if (left === tree.left && iterator === tree.iterator) return tree;
        return new ComprehensionFor(tree.location, left, iterator);
      },
      transformConditionalExpression: function(tree) {
        var condition = this.transformAny(tree.condition);
        var left = this.transformAny(tree.left);
        var right = this.transformAny(tree.right);
        if (condition == tree.condition && left == tree.left && right == tree.right) {
          return tree;
        }
        return new ConditionalExpression(tree.location, condition, left, right);
      },
      transformContinueStatement: function(tree) {
        return tree;
      },
      transformDebuggerStatement: function(tree) {
        return tree;
      },
      transformDefaultClause: function(tree) {
        var statements = this.transformList(tree.statements);
        if (statements == tree.statements) {
          return tree;
        }
        return new DefaultClause(tree.location, statements);
      },
      transformDoWhileStatement: function(tree) {
        var body = this.transformAny(tree.body);
        var condition = this.transformAny(tree.condition);
        if (body == tree.body && condition == tree.condition) {
          return tree;
        }
        return new DoWhileStatement(tree.location, body, condition);
      },
      transformEmptyStatement: function(tree) {
        return tree;
      },
      transformExportDeclaration: function(tree) {
        var declaration = this.transformAny(tree.declaration);
        if (tree.declaration == declaration) {
          return tree;
        }
        return new ExportDeclaration(tree.location, declaration);
      },
      transformExportMappingList: function(tree) {
        var paths = this.transformList(tree.paths);
        if (paths == tree.paths) {
          return tree;
        }
        return new ExportMappingList(tree.location, paths);
      },
      transformExportMapping: function(tree) {
        var moduleExpression = this.transformAny(tree.moduleExpression);
        var specifierSet = this.transformAny(tree.specifierSet);
        if (moduleExpression == tree.moduleExpression && specifierSet == tree.specifierSet) {
          return tree;
        }
        return new ExportMapping(tree.location, moduleExpression, specifierSet);
      },
      transformExportSpecifier: function(tree) {
        return tree;
      },
      transformExportSpecifierSet: function(tree) {
        var specifiers = this.transformList(tree.specifiers);
        if (specifiers == tree.specifiers) {
          return tree;
        }
        return new ExportSpecifierSet(tree.location, specifiers);
      },
      transformExportStar: function(tree) {
        return tree;
      },
      transformExpressionStatement: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new ExpressionStatement(tree.location, expression);
      },
      transformFinally: function(tree) {
        var block = this.transformAny(tree.block);
        if (block == tree.block) {
          return tree;
        }
        return new Finally(tree.location, block);
      },
      transformForOfStatement: function(tree) {
        var initializer = this.transformAny(tree.initializer);
        var collection = this.transformAny(tree.collection);
        var body = this.transformAny(tree.body);
        if (initializer == tree.initializer && collection == tree.collection && body == tree.body) {
          return tree;
        }
        return new ForOfStatement(tree.location, initializer, collection, body);
      },
      transformForInStatement: function(tree) {
        var initializer = this.transformAny(tree.initializer);
        var collection = this.transformAny(tree.collection);
        var body = this.transformAny(tree.body);
        if (initializer == tree.initializer && collection == tree.collection && body == tree.body) {
          return tree;
        }
        return new ForInStatement(tree.location, initializer, collection, body);
      },
      transformForStatement: function(tree) {
        var initializer = this.transformAny(tree.initializer);
        var condition = this.transformAny(tree.condition);
        var increment = this.transformAny(tree.increment);
        var body = this.transformAny(tree.body);
        if (initializer == tree.initializer && condition == tree.condition && increment == tree.increment && body == tree.body) {
          return tree;
        }
        return new ForStatement(tree.location, initializer, condition, increment, body);
      },
      transformFormalParameterList: function(tree) {
        var parameters = this.transformList(tree.parameters);
        if (parameters == tree.parameters) return tree;
        return new FormalParameterList(tree.location, parameters);
      },
      transformFunction: function(tree) {
        var name = this.transformAny(tree.name);
        var formalParameterList = this.transformAny(tree.formalParameterList);
        var functionBody = this.transformFunctionBody(tree.functionBody);
        if (name === tree.name && formalParameterList === tree.formalParameterList && functionBody === tree.functionBody) {
          return tree;
        }
        return new tree.constructor(tree.location, name, tree.isGenerator, formalParameterList, functionBody);
      },
      transformFunctionDeclaration: function(tree) {
        return this.transformFunction(tree);
      },
      transformFunctionExpression: function(tree) {
        return this.transformFunction(tree);
      },
      transformFunctionBody: function(tree) {
        return this.transformAny(tree);
      },
      transformGeneratorComprehension: function(tree) {
        var expression = this.transformAny(tree.expression);
        var comprehensionForList = this.transformList(tree.comprehensionForList);
        var ifExpression = this.transformAny(tree.ifExpression);
        if (expression === tree.expression && comprehensionForList === tree.comprehensionForList && ifExpression === tree.ifExpression) {
          return tree;
        }
        return new GeneratorComprehension(tree.location, expression, comprehensionForList, ifExpression);
      },
      transformGetAccessor: function(tree) {
        var body = this.transformFunctionBody(tree.body);
        if (body == tree.body) return tree;
        return new GetAccessor(tree.location, tree.name, body);
      },
      transformIdentifierExpression: function(tree) {
        return tree;
      },
      transformIfStatement: function(tree) {
        var condition = this.transformAny(tree.condition);
        var ifClause = this.transformAny(tree.ifClause);
        var elseClause = this.transformAny(tree.elseClause);
        if (condition == tree.condition && ifClause == tree.ifClause && elseClause == tree.elseClause) {
          return tree;
        }
        return new IfStatement(tree.location, condition, ifClause, elseClause);
      },
      transformImportDeclaration: function(tree) {
        var importPathList = this.transformList(tree.importPathList);
        if (importPathList == tree.importPathList) {
          return tree;
        }
        return new ImportDeclaration(tree.location, importPathList);
      },
      transformImportBinding: function(tree) {
        var moduleExpression = this.transformAny(tree.moduleExpression);
        var importSpecifierSet = this.transformList(tree.importSpecifierSet);
        if (moduleExpression == tree.moduleExpression && importSpecifierSet == tree.importSpecifierSet) {
          return tree;
        }
        return new ImportBinding(tree.location, moduleExpression, importSpecifierSet);
      },
      transformImportSpecifier: function(tree) {
        return tree;
      },
      transformLabelledStatement: function(tree) {
        var statement = this.transformAny(tree.statement);
        if (statement == tree.statement) {
          return tree;
        }
        return new LabelledStatement(tree.location, tree.name, statement);
      },
      transformLiteralExpression: function(tree) {
        return tree;
      },
      transformMemberExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        if (operand == tree.operand) {
          return tree;
        }
        return new MemberExpression(tree.location, operand, tree.memberName);
      },
      transformMemberLookupExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var memberExpression = this.transformAny(tree.memberExpression);
        if (operand == tree.operand && memberExpression == tree.memberExpression) {
          return tree;
        }
        return new MemberLookupExpression(tree.location, operand, memberExpression);
      },
      transformMissingPrimaryExpression: function(tree) {
        throw new Error('Should never transform trees that had errors during parse');
      },
      transformModuleDeclaration: function(tree) {
        var specifiers = this.transformList(tree.specifiers);
        if (specifiers == tree.specifiers) {
          return tree;
        }
        return new ModuleDeclaration(tree.location, specifiers);
      },
      transformModuleDefinition: function(tree) {
        var elements = this.transformList(tree.elements);
        if (elements == tree.elements) {
          return tree;
        }
        return new ModuleDefinition(tree.location, tree.name, elements);
      },
      transformModuleExpression: function(tree) {
        var reference = this.transformAny(tree.reference);
        if (reference == tree.reference) {
          return tree;
        }
        return new ModuleExpression(tree.location, reference, tree.identifiers);
      },
      transformModuleRequire: function(tree) {
        return tree;
      },
      transformModuleSpecifier: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new ModuleSpecifier(tree.location, tree.identifier, expression);
      },
      transformNameStatement: function(tree) {
        var declarations = this.transformList(tree.declarations);
        if (declarations === tree.declarations) return tree;
        return new NameStatement(tree.location, declarations);
      },
      transformNewExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var args = this.transformAny(tree.args);
        if (operand == tree.operand && args == tree.args) {
          return tree;
        }
        return new NewExpression(tree.location, operand, args);
      },
      transformObjectLiteralExpression: function(tree) {
        var propertyNameAndValues = this.transformList(tree.propertyNameAndValues);
        if (propertyNameAndValues == tree.propertyNameAndValues) {
          return tree;
        }
        return new ObjectLiteralExpression(tree.location, propertyNameAndValues);
      },
      transformObjectPattern: function(tree) {
        var fields = this.transformList(tree.fields);
        if (fields == tree.fields) {
          return tree;
        }
        return new ObjectPattern(tree.location, fields);
      },
      transformObjectPatternField: function(tree) {
        var element = this.transformAny(tree.element);
        if (element == tree.element) {
          return tree;
        }
        return new ObjectPatternField(tree.location, tree.identifier, element);
      },
      transformParenExpression: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new ParenExpression(tree.location, expression);
      },
      transformPostfixExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        if (operand == tree.operand) {
          return tree;
        }
        return new PostfixExpression(tree.location, operand, tree.operator);
      },
      transformPredefinedType: function(tree) {
        return tree;
      },
      transformProgram: function(tree) {
        var elements = this.transformList(tree.programElements);
        if (elements == tree.programElements) {
          return tree;
        }
        return new Program(tree.location, elements);
      },
      transformPropertyMethodAssignment: function(tree) {
        var parameters = this.transformAny(tree.formalParameterList);
        var functionBody = this.transformFunctionBody(tree.functionBody);
        if (parameters == tree.formalParameterList && functionBody == tree.functionBody) {
          return tree;
        }
        return new PropertyMethodAssignment(tree.location, tree.name, tree.isGenerator, parameters, functionBody);
      },
      transformPropertyNameAssignment: function(tree) {
        var value = this.transformAny(tree.value);
        if (value == tree.value) {
          return tree;
        }
        return new PropertyNameAssignment(tree.location, tree.name, value);
      },
      transformPropertyNameShorthand: function(tree) {
        return tree;
      },
      transformTemplateLiteralExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var elements = this.transformList(tree.elements);
        if (operand === tree.operand && elements == tree.elements) return tree;
        return new TemplateLiteralExpression(tree.location, operand, elements);
      },
      transformTemplateLiteralPortion: function(tree) {
        return tree;
      },
      transformTemplateSubstitution: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new TemplateSubstitution(tree.location, expression);
      },
      transformRestParameter: function(tree) {
        return tree;
      },
      transformReturnStatement: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new ReturnStatement(tree.location, expression);
      },
      transformSetAccessor: function(tree) {
        var parameter = this.transformAny(tree.parameter);
        var body = this.transformFunctionBody(tree.body);
        if (parameter === tree.parameter && body === tree.body) return tree;
        return new SetAccessor(tree.location, tree.name, parameter, body);
      },
      transformSpreadExpression: function(tree) {
        var expression = this.transformAny(tree.expression);
        if (expression == tree.expression) {
          return tree;
        }
        return new SpreadExpression(tree.location, expression);
      },
      transformSpreadPatternElement: function(tree) {
        var lvalue = this.transformAny(tree.lvalue);
        if (lvalue == tree.lvalue) {
          return tree;
        }
        return new SpreadPatternElement(tree.location, lvalue);
      },
      transformStateMachine: function(tree) {
        throw new Error();
      },
      transformSuperExpression: function(tree) {
        return tree;
      },
      transformSwitchStatement: function(tree) {
        var expression = this.transformAny(tree.expression);
        var caseClauses = this.transformList(tree.caseClauses);
        if (expression == tree.expression && caseClauses == tree.caseClauses) {
          return tree;
        }
        return new SwitchStatement(tree.location, expression, caseClauses);
      },
      transformThisExpression: function(tree) {
        return tree;
      },
      transformThrowStatement: function(tree) {
        var value = this.transformAny(tree.value);
        if (value == tree.value) {
          return tree;
        }
        return new ThrowStatement(tree.location, value);
      },
      transformTryStatement: function(tree) {
        var body = this.transformAny(tree.body);
        var catchBlock = this.transformAny(tree.catchBlock);
        var finallyBlock = this.transformAny(tree.finallyBlock);
        if (body == tree.body && catchBlock == tree.catchBlock && finallyBlock == tree.finallyBlock) {
          return tree;
        }
        return new TryStatement(tree.location, body, catchBlock, finallyBlock);
      },
      transformTypeName: function(tree) {
        var moduleName = this.transformAny(tree.moduleName);
        if (moduleName == tree.moduleName) {
          return tree;
        }
        return new TypeName(tree.location, moduleName, tree.name);
      },
      transformUnaryExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        if (operand == tree.operand) {
          return tree;
        }
        return new UnaryExpression(tree.location, tree.operator, operand);
      },
      transformVariableDeclaration: function(tree) {
        var lvalue = this.transformAny(tree.lvalue);
        var typeAnnotation = this.transformAny(tree.typeAnnotation);
        var initializer = this.transformAny(tree.initializer);
        if (lvalue == tree.lvalue && typeAnnotation == tree.typeAnnotation && initializer == tree.initializer) {
          return tree;
        }
        return new VariableDeclaration(tree.location, lvalue, typeAnnotation, initializer);
      },
      transformVariableDeclarationList: function(tree) {
        var declarations = this.transformList(tree.declarations);
        if (declarations == tree.declarations) {
          return tree;
        }
        return new VariableDeclarationList(tree.location, tree.declarationType, declarations);
      },
      transformVariableStatement: function(tree) {
        var declarations = this.transformAny(tree.declarations);
        if (declarations == tree.declarations) {
          return tree;
        }
        return new VariableStatement(tree.location, declarations);
      },
      transformWhileStatement: function(tree) {
        var condition = this.transformAny(tree.condition);
        var body = this.transformAny(tree.body);
        if (condition == tree.condition && body == tree.body) {
          return tree;
        }
        return new WhileStatement(tree.location, condition, body);
      },
      transformWithStatement: function(tree) {
        var expression = this.transformAny(tree.expression);
        var body = this.transformAny(tree.body);
        if (expression == tree.expression && body == tree.body) {
          return tree;
        }
        return new WithStatement(tree.location, expression, body);
      },
      transformYieldExpression: function(tree) {
        var expression = this.transformAny(tree.expression);
        var isYieldFor = tree.isYieldFor;
        if (expression == tree.expression) {
          return tree;
        }
        return new YieldExpression(tree.location, expression, isYieldFor);
      }
    });
    return $ParseTreeTransformer;
  }();
  return Object.preventExtensions(Object.create(null, {ParseTreeTransformer: {
      get: function() {
        return ParseTreeTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_AssignmentPatternTransformer_js = (function() {
  "use strict";
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_trees_ParseTrees_js, ArrayPattern = $__9.ArrayPattern, BindingElement = $__9.BindingElement, IdentifierExpression = $__9.IdentifierExpression, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, SpreadPatternElement = $__9.SpreadPatternElement;
  var EQUAL = $__src_syntax_TokenType_js.EQUAL;
  var AssignmentPatternTransformerError = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AssignmentPatternTransformerError = ($__createClass)({constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      }}, $__proto, $__super, false);
    return $AssignmentPatternTransformerError;
  }(Error);
  var AssignmentPatternTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AssignmentPatternTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformBinaryOperator: function(tree) {
        if (tree.operator.type !== EQUAL) throw new AssignmentPatternTransformerError();
        var bindingElement = this.transformAny(tree.left);
        return new BindingElement(tree.location, bindingElement.binding, tree.right);
      },
      transformArrayLiteralExpression: function(tree) {
        var elements = this.transformList(tree.elements);
        return new ArrayPattern(tree.location, elements);
      },
      transformObjectLiteralExpression: function(tree) {
        var propertyNameAndValues = this.transformList(tree.propertyNameAndValues);
        return new ObjectPattern(tree.location, propertyNameAndValues);
      },
      transformPropertyNameAssignment: function(tree) {
        return new ObjectPatternField(tree.location, tree.name, this.transformAny(tree.value));
      },
      transformPropertyNameShorthand: function(tree) {
        return new IdentifierExpression(tree.location, tree.name);
      },
      transformSpreadExpression: function(tree) {
        return new SpreadPatternElement(tree.location, tree.expression);
      },
      transformMissingPrimaryExpression: function(tree) {
        throw new AssignmentPatternTransformerError();
      }
    }, $__proto, $__super, false);
    return $AssignmentPatternTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {
    AssignmentPatternTransformerError: {
      get: function() {
        return AssignmentPatternTransformerError;
      },
      enumerable: true
    },
    AssignmentPatternTransformer: {
      get: function() {
        return AssignmentPatternTransformer;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_CoverFormalsTransformer_js = (function() {
  "use strict";
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_trees_ParseTrees_js, ArrayPattern = $__9.ArrayPattern, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, FormalParameterList = $__9.FormalParameterList, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, RestParameter = $__9.RestParameter, SpreadPatternElement = $__9.SpreadPatternElement;
  var EQUAL = $__src_syntax_TokenType_js.EQUAL;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, SPREAD_PATTERN_ELEMENT = $__9.SPREAD_PATTERN_ELEMENT;
  var CoverFormalsTransformerError = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CoverFormalsTransformerError = ($__createClass)({constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      }}, $__proto, $__super, false);
    return $CoverFormalsTransformerError;
  }(Error);
  var CoverFormalsTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CoverFormalsTransformer = ($__createClass)({
      constructor: function() {
        this.isValid = true;
        this.inArrayPattern_ = false;
      },
      transformCoverFormals: function(tree) {
        var expressions = this.transformList(tree.expressions);
        return new FormalParameterList(tree.location, expressions);
      },
      transformIdentifierExpression: function(tree) {
        return new BindingElement(tree.location, new BindingIdentifier(tree.location, tree.identifierToken), null);
      },
      transformBinaryOperator: function(tree) {
        if (tree.operator.type !== EQUAL) throw new CoverFormalsTransformerError();
        var bindingElement = this.transformAny(tree.left);
        return new BindingElement(tree.location, bindingElement.binding, tree.right);
      },
      transformArrayLiteralExpression: function(tree) {
        var wasInArrayPattern = this.inArrayPattern_;
        this.inArrayPattern_ = true;
        var elements = this.transformList(tree.elements);
        this.inArrayPattern_ = wasInArrayPattern;
        var okIndex = elements.length - 1;
        for (var i = 0; i < okIndex; i++) {
          if (elements[i].type === SPREAD_PATTERN_ELEMENT) throw new CoverFormalsTransformerError();
        }
        return new BindingElement(tree.location, new ArrayPattern(tree.location, elements), null);
      },
      transformObjectLiteralExpression: function(tree) {
        var propertyNameAndValues = this.transformList(tree.propertyNameAndValues);
        return new BindingElement(tree.location, new ObjectPattern(tree.location, propertyNameAndValues), null);
      },
      transformPropertyNameAssignment: function(tree) {
        return new ObjectPatternField(tree.location, tree.name, this.transformAny(tree.value));
      },
      transformPropertyNameShorthand: function(tree) {
        return new BindingElement(tree.location, new BindingIdentifier(tree.location, tree.name), null);
      },
      transformSpreadExpression: function(tree) {
        if (tree.expression.type !== IDENTIFIER_EXPRESSION) throw new CoverFormalsTransformerError();
        var bindingIdentifier = new BindingIdentifier(tree.expression.location, tree.expression.identifierToken);
        if (this.inArrayPattern_) return new SpreadPatternElement(tree.location, bindingIdentifier);
        return new RestParameter(tree.location, bindingIdentifier);
      },
      transformMissingPrimaryExpression: function(tree) {
        throw new AssignmentPatternTransformerError();
      }
    }, $__proto, $__super, true);
    return $CoverFormalsTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {
    CoverFormalsTransformerError: {
      get: function() {
        return CoverFormalsTransformerError;
      },
      enumerable: true
    },
    CoverFormalsTransformer: {
      get: function() {
        return CoverFormalsTransformer;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_syntax_Token_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, BAR_EQUAL = $__9.BAR_EQUAL, CARET_EQUAL = $__9.CARET_EQUAL, EQUAL = $__9.EQUAL, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, MINUS_EQUAL = $__9.MINUS_EQUAL, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PLUS_EQUAL = $__9.PLUS_EQUAL, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR_EQUAL = $__9.STAR_EQUAL, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL;
  var Token = function() {
    var $Token = ($__createClassNoExtends)({
      constructor: function(type, location) {
        this.type = type;
        this.location = location;
      },
      toString: function() {
        return this.type;
      },
      isAssignmentOperator: function() {
        return isAssignmentOperator(this.type);
      },
      isKeyword: function() {
        return false;
      }
    });
    return $Token;
  }();
  function isAssignmentOperator(type) {
    switch (type) {
      case AMPERSAND_EQUAL:
      case BAR_EQUAL:
      case CARET_EQUAL:
      case EQUAL:
      case LEFT_SHIFT_EQUAL:
      case MINUS_EQUAL:
      case PERCENT_EQUAL:
      case PLUS_EQUAL:
      case RIGHT_SHIFT_EQUAL:
      case SLASH_EQUAL:
      case STAR_EQUAL:
      case UNSIGNED_RIGHT_SHIFT_EQUAL:
        return true;
    }
    return false;
  }
  return Object.preventExtensions(Object.create(null, {
    Token: {
      get: function() {
        return Token;
      },
      enumerable: true
    },
    isAssignmentOperator: {
      get: function() {
        return isAssignmentOperator;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_syntax_IdentifierToken_js = (function() {
  "use strict";
  var Token = $__src_syntax_Token_js.Token;
  var IDENTIFIER = $__src_syntax_TokenType_js.IDENTIFIER;
  var IdentifierToken = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $IdentifierToken = ($__createClass)({
      constructor: function(location, value) {
        this.location = location;
        this.value = value;
      },
      toString: function() {
        return this.value;
      },
      get type() {
        return IDENTIFIER;
      }
    }, $__proto, $__super, true);
    return $IdentifierToken;
  }(Token);
  return Object.preventExtensions(Object.create(null, {IdentifierToken: {
      get: function() {
        return IdentifierToken;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_ErrorReporter_js = (function() {
  "use strict";
  var ErrorReporter = function() {
    var $ErrorReporter = ($__createClassNoExtends)({
      constructor: function() {
        this.hadError_ = false;
      },
      reportError: function(location, format, var_args) {
        this.hadError_ = true;
        var args = Array.prototype.slice.call(arguments, 2);
        this.reportMessageInternal(location, 'error', format, args);
      },
      reportWarning: function(location, format, var_args) {
        var args = Array.prototype.slice.call(arguments, 2);
        this.reportMessageInternal(location, 'warn', format, args);
      },
      reportMessageInternal: function(location, kind, format, args) {
        var $__10;
        if (location) format = (location + ": " + format);
        ($__10 = console)[kind].apply($__10, $__spread([format], args));
      },
      hadError: function() {
        return this.hadError_;
      },
      clearError: function() {
        this.hadError_ = false;
      }
    });
    return $ErrorReporter;
  }();
  ErrorReporter.format = function(location, text, opt_args) {
    var i = 0;
    text = text.replace(/%./g, function(s) {
      switch (s) {
        case '%s':
          return opt_args && opt_args[i++];
        case '%%':
          return '%';
      }
      return s;
    });
    if (location) text = (location + ": " + text);
    return text;
  };
  return Object.preventExtensions(Object.create(null, {ErrorReporter: {
      get: function() {
        return ErrorReporter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_MutedErrorReporter_js = (function() {
  "use strict";
  var ErrorReporter = $__src_util_ErrorReporter_js.ErrorReporter;
  var MutedErrorReporter = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $MutedErrorReporter = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      reportMessageInternal: function(location, message) {}
    }, $__proto, $__super, false);
    return $MutedErrorReporter;
  }(ErrorReporter);
  return Object.preventExtensions(Object.create(null, {MutedErrorReporter: {
      get: function() {
        return MutedErrorReporter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_PredefinedName_js = (function() {
  "use strict";
  var ADD_ITERATOR = 'addIterator';
  var ANY = 'any';
  var $ARGUMENTS = '$arguments';
  var $THAT = '$that';
  var $VALUE = '$value';
  var ADD_CONTINUATION = 'addContinuation';
  var APPLY = 'apply';
  var ARGUMENTS = 'arguments';
  var ARRAY = 'Array';
  var ASSERT_NAME = 'assertName';
  var BIND = 'bind';
  var BOOL = 'bool';
  var CALL = 'call';
  var CALLBACK = 'callback';
  var CAPTURED_ARGUMENTS = '$arguments';
  var CAPTURED_THIS = '$this';
  var CAUGHT_EXCEPTION = '$caughtException';
  var CLOSE = 'close';
  var CONFIGURABLE = 'configurable';
  var CONSTRUCTOR = 'constructor';
  var CONTINUATION = '$continuation';
  var CREATE = 'create';
  var CREATE_CALLBACK = '$createCallback';
  var CREATE_CLASS = 'createClass';
  var CREATE_ERRBACK = '$createErrback';
  var CREATE_NAME = 'createName';
  var CREATE_PROMISE = 'createPromise';
  var CURRENT = 'current';
  var DEFERRED = 'Deferred';
  var DEFINE_PROPERTIES = 'defineProperties';
  var DEFINE_PROPERTY = 'defineProperty';
  var DELETE_PROPERTY = 'deleteProperty';
  var ELEMENT_DELETE = 'elementDelete';
  var ELEMENT_GET = 'elementGet';
  var ELEMENT_HAS = 'elementHas';
  var ELEMENT_SET = 'elementSet';
  var ENUMERABLE = 'enumerable';
  var ERR = '$err';
  var ERRBACK = 'errback';
  var FIELD_INITIALIZER_METHOD = '$field_initializer_';
  var FINALLY_FALL_THROUGH = '$finallyFallThrough';
  var FREEZE = 'freeze';
  var FROM = 'from';
  var FUNCTION = 'Function';
  var GET = 'get';
  var GET_ITERATOR = 'getIterator';
  var GET_MODULE_INSTANCE_BY_URL = 'getModuleInstanceByUrl';
  var GET_PROPERTY = 'getProperty';
  var HAS = 'has';
  var INIT = '$init';
  var IS = 'is';
  var ISNT = 'isnt';
  var IS_DONE = 'isDone';
  var ITERATOR = 'iterator';
  var LENGTH = 'length';
  var MODULE = 'module';
  var MODULES = 'modules';
  var MOVE_NEXT = 'moveNext';
  var NEW = 'new';
  var NEW_STATE = '$newState';
  var NUMBER = 'number';
  var OBJECT = 'Object';
  var OBJECT_NAME = 'Object';
  var OF = 'of';
  var PARAM = '$param';
  var PREVENT_EXTENSIONS = 'preventExtensions';
  var PROTO = '__proto__';
  var PROTOTYPE = 'prototype';
  var PUSH = 'push';
  var RAW = 'raw';
  var REQUIRE = 'require';
  var REQUIRED = 'required';
  var REQUIRES = 'requires';
  var RESOLVE = 'resolve';
  var RESULT = '$result';
  var RUNTIME = 'runtime';
  var SET = 'set';
  var SET_PROPERTY = 'setProperty';
  var SLICE = 'slice';
  var SPREAD = 'spread';
  var SPREAD_NEW = 'spreadNew';
  var STATE = '$state';
  var STORED_EXCEPTION = '$storedException';
  var STRING = 'string';
  var SUPER_CALL = 'superCall';
  var SUPER_GET = 'superGet';
  var SUPER_SET = 'superSet';
  var THEN = 'then';
  var THIS = 'this';
  var TRACEUR = 'traceur';
  var TYPE_ERROR = 'TypeError';
  var UNDEFINED = 'undefined';
  var VALUE = 'value';
  var WAIT_TASK = '$waitTask';
  var WRITABLE = 'writable';
  var YIELD_SENT = '$yieldSent';
  function getParameterName(index) {
    return '$' + index;
  }
  ;
  return Object.preventExtensions(Object.create(null, {
    ADD_ITERATOR: {
      get: function() {
        return ADD_ITERATOR;
      },
      enumerable: true
    },
    ANY: {
      get: function() {
        return ANY;
      },
      enumerable: true
    },
    $ARGUMENTS: {
      get: function() {
        return $ARGUMENTS;
      },
      enumerable: true
    },
    $THAT: {
      get: function() {
        return $THAT;
      },
      enumerable: true
    },
    $VALUE: {
      get: function() {
        return $VALUE;
      },
      enumerable: true
    },
    ADD_CONTINUATION: {
      get: function() {
        return ADD_CONTINUATION;
      },
      enumerable: true
    },
    APPLY: {
      get: function() {
        return APPLY;
      },
      enumerable: true
    },
    ARGUMENTS: {
      get: function() {
        return ARGUMENTS;
      },
      enumerable: true
    },
    ARRAY: {
      get: function() {
        return ARRAY;
      },
      enumerable: true
    },
    ASSERT_NAME: {
      get: function() {
        return ASSERT_NAME;
      },
      enumerable: true
    },
    BIND: {
      get: function() {
        return BIND;
      },
      enumerable: true
    },
    BOOL: {
      get: function() {
        return BOOL;
      },
      enumerable: true
    },
    CALL: {
      get: function() {
        return CALL;
      },
      enumerable: true
    },
    CALLBACK: {
      get: function() {
        return CALLBACK;
      },
      enumerable: true
    },
    CAPTURED_ARGUMENTS: {
      get: function() {
        return CAPTURED_ARGUMENTS;
      },
      enumerable: true
    },
    CAPTURED_THIS: {
      get: function() {
        return CAPTURED_THIS;
      },
      enumerable: true
    },
    CAUGHT_EXCEPTION: {
      get: function() {
        return CAUGHT_EXCEPTION;
      },
      enumerable: true
    },
    CLOSE: {
      get: function() {
        return CLOSE;
      },
      enumerable: true
    },
    CONFIGURABLE: {
      get: function() {
        return CONFIGURABLE;
      },
      enumerable: true
    },
    CONSTRUCTOR: {
      get: function() {
        return CONSTRUCTOR;
      },
      enumerable: true
    },
    CONTINUATION: {
      get: function() {
        return CONTINUATION;
      },
      enumerable: true
    },
    CREATE: {
      get: function() {
        return CREATE;
      },
      enumerable: true
    },
    CREATE_CALLBACK: {
      get: function() {
        return CREATE_CALLBACK;
      },
      enumerable: true
    },
    CREATE_CLASS: {
      get: function() {
        return CREATE_CLASS;
      },
      enumerable: true
    },
    CREATE_ERRBACK: {
      get: function() {
        return CREATE_ERRBACK;
      },
      enumerable: true
    },
    CREATE_NAME: {
      get: function() {
        return CREATE_NAME;
      },
      enumerable: true
    },
    CREATE_PROMISE: {
      get: function() {
        return CREATE_PROMISE;
      },
      enumerable: true
    },
    CURRENT: {
      get: function() {
        return CURRENT;
      },
      enumerable: true
    },
    DEFERRED: {
      get: function() {
        return DEFERRED;
      },
      enumerable: true
    },
    DEFINE_PROPERTIES: {
      get: function() {
        return DEFINE_PROPERTIES;
      },
      enumerable: true
    },
    DEFINE_PROPERTY: {
      get: function() {
        return DEFINE_PROPERTY;
      },
      enumerable: true
    },
    DELETE_PROPERTY: {
      get: function() {
        return DELETE_PROPERTY;
      },
      enumerable: true
    },
    ELEMENT_DELETE: {
      get: function() {
        return ELEMENT_DELETE;
      },
      enumerable: true
    },
    ELEMENT_GET: {
      get: function() {
        return ELEMENT_GET;
      },
      enumerable: true
    },
    ELEMENT_HAS: {
      get: function() {
        return ELEMENT_HAS;
      },
      enumerable: true
    },
    ELEMENT_SET: {
      get: function() {
        return ELEMENT_SET;
      },
      enumerable: true
    },
    ENUMERABLE: {
      get: function() {
        return ENUMERABLE;
      },
      enumerable: true
    },
    ERR: {
      get: function() {
        return ERR;
      },
      enumerable: true
    },
    ERRBACK: {
      get: function() {
        return ERRBACK;
      },
      enumerable: true
    },
    FIELD_INITIALIZER_METHOD: {
      get: function() {
        return FIELD_INITIALIZER_METHOD;
      },
      enumerable: true
    },
    FINALLY_FALL_THROUGH: {
      get: function() {
        return FINALLY_FALL_THROUGH;
      },
      enumerable: true
    },
    FREEZE: {
      get: function() {
        return FREEZE;
      },
      enumerable: true
    },
    FROM: {
      get: function() {
        return FROM;
      },
      enumerable: true
    },
    FUNCTION: {
      get: function() {
        return FUNCTION;
      },
      enumerable: true
    },
    GET: {
      get: function() {
        return GET;
      },
      enumerable: true
    },
    GET_ITERATOR: {
      get: function() {
        return GET_ITERATOR;
      },
      enumerable: true
    },
    GET_MODULE_INSTANCE_BY_URL: {
      get: function() {
        return GET_MODULE_INSTANCE_BY_URL;
      },
      enumerable: true
    },
    GET_PROPERTY: {
      get: function() {
        return GET_PROPERTY;
      },
      enumerable: true
    },
    HAS: {
      get: function() {
        return HAS;
      },
      enumerable: true
    },
    INIT: {
      get: function() {
        return INIT;
      },
      enumerable: true
    },
    IS: {
      get: function() {
        return IS;
      },
      enumerable: true
    },
    ISNT: {
      get: function() {
        return ISNT;
      },
      enumerable: true
    },
    IS_DONE: {
      get: function() {
        return IS_DONE;
      },
      enumerable: true
    },
    ITERATOR: {
      get: function() {
        return ITERATOR;
      },
      enumerable: true
    },
    LENGTH: {
      get: function() {
        return LENGTH;
      },
      enumerable: true
    },
    MODULE: {
      get: function() {
        return MODULE;
      },
      enumerable: true
    },
    MODULES: {
      get: function() {
        return MODULES;
      },
      enumerable: true
    },
    MOVE_NEXT: {
      get: function() {
        return MOVE_NEXT;
      },
      enumerable: true
    },
    NEW: {
      get: function() {
        return NEW;
      },
      enumerable: true
    },
    NEW_STATE: {
      get: function() {
        return NEW_STATE;
      },
      enumerable: true
    },
    NUMBER: {
      get: function() {
        return NUMBER;
      },
      enumerable: true
    },
    OBJECT: {
      get: function() {
        return OBJECT;
      },
      enumerable: true
    },
    OBJECT_NAME: {
      get: function() {
        return OBJECT_NAME;
      },
      enumerable: true
    },
    OF: {
      get: function() {
        return OF;
      },
      enumerable: true
    },
    PARAM: {
      get: function() {
        return PARAM;
      },
      enumerable: true
    },
    PREVENT_EXTENSIONS: {
      get: function() {
        return PREVENT_EXTENSIONS;
      },
      enumerable: true
    },
    PROTO: {
      get: function() {
        return PROTO;
      },
      enumerable: true
    },
    PROTOTYPE: {
      get: function() {
        return PROTOTYPE;
      },
      enumerable: true
    },
    PUSH: {
      get: function() {
        return PUSH;
      },
      enumerable: true
    },
    RAW: {
      get: function() {
        return RAW;
      },
      enumerable: true
    },
    REQUIRE: {
      get: function() {
        return REQUIRE;
      },
      enumerable: true
    },
    REQUIRED: {
      get: function() {
        return REQUIRED;
      },
      enumerable: true
    },
    REQUIRES: {
      get: function() {
        return REQUIRES;
      },
      enumerable: true
    },
    RESOLVE: {
      get: function() {
        return RESOLVE;
      },
      enumerable: true
    },
    RESULT: {
      get: function() {
        return RESULT;
      },
      enumerable: true
    },
    RUNTIME: {
      get: function() {
        return RUNTIME;
      },
      enumerable: true
    },
    SET: {
      get: function() {
        return SET;
      },
      enumerable: true
    },
    SET_PROPERTY: {
      get: function() {
        return SET_PROPERTY;
      },
      enumerable: true
    },
    SLICE: {
      get: function() {
        return SLICE;
      },
      enumerable: true
    },
    SPREAD: {
      get: function() {
        return SPREAD;
      },
      enumerable: true
    },
    SPREAD_NEW: {
      get: function() {
        return SPREAD_NEW;
      },
      enumerable: true
    },
    STATE: {
      get: function() {
        return STATE;
      },
      enumerable: true
    },
    STORED_EXCEPTION: {
      get: function() {
        return STORED_EXCEPTION;
      },
      enumerable: true
    },
    STRING: {
      get: function() {
        return STRING;
      },
      enumerable: true
    },
    SUPER_CALL: {
      get: function() {
        return SUPER_CALL;
      },
      enumerable: true
    },
    SUPER_GET: {
      get: function() {
        return SUPER_GET;
      },
      enumerable: true
    },
    SUPER_SET: {
      get: function() {
        return SUPER_SET;
      },
      enumerable: true
    },
    THEN: {
      get: function() {
        return THEN;
      },
      enumerable: true
    },
    THIS: {
      get: function() {
        return THIS;
      },
      enumerable: true
    },
    TRACEUR: {
      get: function() {
        return TRACEUR;
      },
      enumerable: true
    },
    TYPE_ERROR: {
      get: function() {
        return TYPE_ERROR;
      },
      enumerable: true
    },
    UNDEFINED: {
      get: function() {
        return UNDEFINED;
      },
      enumerable: true
    },
    VALUE: {
      get: function() {
        return VALUE;
      },
      enumerable: true
    },
    WAIT_TASK: {
      get: function() {
        return WAIT_TASK;
      },
      enumerable: true
    },
    WRITABLE: {
      get: function() {
        return WRITABLE;
      },
      enumerable: true
    },
    YIELD_SENT: {
      get: function() {
        return YIELD_SENT;
      },
      enumerable: true
    },
    getParameterName: {
      get: function() {
        return getParameterName;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_syntax_AtNameToken_js = (function() {
  "use strict";
  var Token = $__src_syntax_Token_js.Token;
  var AT_NAME = $__src_syntax_TokenType_js.AT_NAME;
  var AtNameToken = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AtNameToken = ($__createClass)({
      constructor: function(location, value) {
        this.location = location;
        this.value = value;
      },
      toString: function() {
        return this.value;
      },
      get type() {
        return AT_NAME;
      }
    }, $__proto, $__super, true);
    return $AtNameToken;
  }(Token);
  return Object.preventExtensions(Object.create(null, {AtNameToken: {
      get: function() {
        return AtNameToken;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_KeywordToken_js = (function() {
  "use strict";
  var Token = $__src_syntax_Token_js.Token;
  var KeywordToken = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $KeywordToken = ($__createClass)({
      constructor: function(type, location) {
        this.type = type;
        this.location = location;
      },
      isKeyword: function() {
        return true;
      }
    }, $__proto, $__super, true);
    return $KeywordToken;
  }(Token);
  return Object.preventExtensions(Object.create(null, {KeywordToken: {
      get: function() {
        return KeywordToken;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_LiteralToken_js = (function() {
  "use strict";
  var Token = $__src_syntax_Token_js.Token;
  var $__9 = $__src_syntax_TokenType_js, NULL = $__9.NULL, NUMBER = $__9.NUMBER, STRING = $__9.STRING;
  var StringParser = function() {
    var $StringParser = ($__createClassNoExtends)({
      constructor: function(value) {
        this.value = value;
        this.index = 0;
      },
      moveNext: function() {
        this.index++;
        return this.index >= this.value.length - 1;
      },
      get current() {
        return this.value[this.index];
      },
      parse: function() {
        if (this.value.indexOf('\\') === - 1) return this.value.slice(1, - 1);
        var result = '';
        {
          var $__5 = traceur.runtime.getIterator(this);
          try {
            while ($__5.moveNext()) {
              var ch = $__5.current;
              {
                result += ch === '\\' ? this.parseEscapeSequence(): ch;
              }
            }
          } finally {
            if ($__5.close) $__5.close();
          }
        }
        return result;
      },
      parseEscapeSequence: function() {
        var next = (function() {
          traceur.assert(this.moveNext());
          return this.current;
        }).bind(this);
        var ch = next();
        switch (ch) {
          case '\n':
          case '\r':
          case '\u2028':
          case '\u2029':
            return '';
          case '0':
            return '\0';
          case 'b':
            return '\b';
          case 'f':
            return '\f';
          case 'n':
            return '\n';
          case 'r':
            return '\r';
          case 't':
            return '\t';
          case 'v':
            return '\v';
          case 'x':
            return String.fromCharCode(parseInt(next() + next(), 16));
          case 'u':
            return String.fromCharCode(parseInt(next() + next() + next() + next(), 16));
          default:
            if (Number(ch) < 8) throw new Error('Octal literals are not supported');
            return ch;
        }
      }
    });
    return $StringParser;
  }();
  var LiteralToken = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $LiteralToken = ($__createClass)({
      constructor: function(type, value, location) {
        this.type = type;
        this.location = location;
        this.value = value;
      },
      toString: function() {
        return this.value;
      },
      get processedValue() {
        switch (this.type) {
          case NULL:
            return null;
          case NUMBER:
            return Number(this.value);
          case STRING:
            var parser = new StringParser(this.value);
            return parser.parse();
          default:
            throw new Error('Not implemented');
        }
      }
    }, $__proto, $__super, true);
    return $LiteralToken;
  }(Token);
  return Object.preventExtensions(Object.create(null, {LiteralToken: {
      get: function() {
        return LiteralToken;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_SourcePosition_js = (function() {
  "use strict";
  var SourcePosition = function() {
    var $SourcePosition = ($__createClassNoExtends)({
      constructor: function(source, offset) {
        this.source = source;
        this.offset = offset;
        this.line_ = - 1;
        this.column_ = - 1;
      },
      get line() {
        if (this.line_ === - 1) this.line_ = this.source.lineNumberTable.getLine(this.offset);
        return this.line_;
      },
      get column() {
        if (this.column_ === - 1) this.column_ = this.source.lineNumberTable.getColumn(this.offset);
        return this.column_;
      },
      toString: function() {
        var name = this.source ? this.source.name: '';
        return (name + ":" + (this.line + 1) + ":" + (this.column + 1));
      }
    });
    return $SourcePosition;
  }();
  return Object.preventExtensions(Object.create(null, {SourcePosition: {
      get: function() {
        return SourcePosition;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_Keywords_js = (function() {
  "use strict";
  var keywords = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'class', 'const', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'null', 'true', 'false', 'await'];
  var keywordsByName = Object.create(null);
  keywords.forEach((function(value) {
    keywordsByName[value] = true;
  }));
  function isKeyword(value) {
    return !!keywordsByName[value];
  }
  ;
  return Object.preventExtensions(Object.create(null, {isKeyword: {
      get: function() {
        return isKeyword;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_Scanner_js = (function() {
  "use strict";
  var AtNameToken = $__src_syntax_AtNameToken_js.AtNameToken;
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var KeywordToken = $__src_syntax_KeywordToken_js.KeywordToken;
  var LiteralToken = $__src_syntax_LiteralToken_js.LiteralToken;
  var SourcePosition = $__src_util_SourcePosition_js.SourcePosition;
  var Token = $__src_syntax_Token_js.Token;
  var isKeyword = $__src_syntax_Keywords_js.isKeyword;
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND = $__9.AMPERSAND, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, AND = $__9.AND, ARROW = $__9.ARROW, AT_NAME = $__9.AT_NAME, AWAIT = $__9.AWAIT, BACK_QUOTE = $__9.BACK_QUOTE, BANG = $__9.BANG, BAR = $__9.BAR, BAR_EQUAL = $__9.BAR_EQUAL, BREAK = $__9.BREAK, CARET = $__9.CARET, CARET_EQUAL = $__9.CARET_EQUAL, CASE = $__9.CASE, CATCH = $__9.CATCH, CLASS = $__9.CLASS, CLOSE_ANGLE = $__9.CLOSE_ANGLE, CLOSE_CURLY = $__9.CLOSE_CURLY, CLOSE_PAREN = $__9.CLOSE_PAREN, CLOSE_SQUARE = $__9.CLOSE_SQUARE, COLON = $__9.COLON, COMMA = $__9.COMMA, CONST = $__9.CONST, CONTINUE = $__9.CONTINUE, DEBUGGER = $__9.DEBUGGER, DEFAULT = $__9.DEFAULT, DELETE = $__9.DELETE, DO = $__9.DO, DOLLAR = $__9.DOLLAR, DOT_DOT_DOT = $__9.DOT_DOT_DOT, ELSE = $__9.ELSE, END_OF_FILE = $__9.END_OF_FILE, ENUM = $__9.ENUM, EQUAL = $__9.EQUAL, EQUAL_EQUAL = $__9.EQUAL_EQUAL, EQUAL_EQUAL_EQUAL = $__9.EQUAL_EQUAL_EQUAL, ERROR = $__9.ERROR, EXPORT = $__9.EXPORT, EXTENDS = $__9.EXTENDS, FALSE = $__9.FALSE, FINALLY = $__9.FINALLY, FOR = $__9.FOR, FUNCTION = $__9.FUNCTION, GREATER_EQUAL = $__9.GREATER_EQUAL, IDENTIFIER = $__9.IDENTIFIER, IF = $__9.IF, IMPLEMENTS = $__9.IMPLEMENTS, IMPORT = $__9.IMPORT, IN = $__9.IN, INSTANCEOF = $__9.INSTANCEOF, INTERFACE = $__9.INTERFACE, LEFT_SHIFT = $__9.LEFT_SHIFT, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, LESS_EQUAL = $__9.LESS_EQUAL, LET = $__9.LET, MINUS = $__9.MINUS, MINUS_EQUAL = $__9.MINUS_EQUAL, MINUS_MINUS = $__9.MINUS_MINUS, NEW = $__9.NEW, NO_SUBSTITUTION_TEMPLATE = $__9.NO_SUBSTITUTION_TEMPLATE, NOT_EQUAL = $__9.NOT_EQUAL, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, NULL = $__9.NULL, NUMBER = $__9.NUMBER, OPEN_ANGLE = $__9.OPEN_ANGLE, OPEN_CURLY = $__9.OPEN_CURLY, OPEN_PAREN = $__9.OPEN_PAREN, OPEN_SQUARE = $__9.OPEN_SQUARE, OR = $__9.OR, PACKAGE = $__9.PACKAGE, PERCENT = $__9.PERCENT, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PERIOD = $__9.PERIOD, PERIOD_OPEN_CURLY = $__9.PERIOD_OPEN_CURLY, PLUS = $__9.PLUS, PLUS_EQUAL = $__9.PLUS_EQUAL, PLUS_PLUS = $__9.PLUS_PLUS, PRIVATE = $__9.PRIVATE, PROTECTED = $__9.PROTECTED, PUBLIC = $__9.PUBLIC, QUESTION = $__9.QUESTION, REGULAR_EXPRESSION = $__9.REGULAR_EXPRESSION, RETURN = $__9.RETURN, RIGHT_SHIFT = $__9.RIGHT_SHIFT, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SEMI_COLON = $__9.SEMI_COLON, SLASH = $__9.SLASH, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR = $__9.STAR, STAR_EQUAL = $__9.STAR_EQUAL, STATIC = $__9.STATIC, STRING = $__9.STRING, SUPER = $__9.SUPER, SWITCH = $__9.SWITCH, TEMPLATE_HEAD = $__9.TEMPLATE_HEAD, TEMPLATE_MIDDLE = $__9.TEMPLATE_MIDDLE, TEMPLATE_TAIL = $__9.TEMPLATE_TAIL, THIS = $__9.THIS, THROW = $__9.THROW, TILDE = $__9.TILDE, TRUE = $__9.TRUE, TRY = $__9.TRY, TYPEOF = $__9.TYPEOF, UNSIGNED_RIGHT_SHIFT = $__9.UNSIGNED_RIGHT_SHIFT, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL, VAR = $__9.VAR, VOID = $__9.VOID, WHILE = $__9.WHILE, WITH = $__9.WITH, YIELD = $__9.YIELD;
  var isWhitespaceArray = [];
  for (var i = 0; i < 128; i++) {
    isWhitespaceArray[i] = i >= 9 && i <= 13 || i === 0x20;
  }
  var isWhitespaceArray = [];
  for (var i = 0; i < 128; i++) {
    isWhitespaceArray[i] = i >= 9 && i <= 13 || i === 0x20;
  }
  function isWhitespace(code) {
    if (code < 128) return isWhitespaceArray[code];
    switch (code) {
      case 0xA0:
      case 0xFEFF:
      case 0x2028:
      case 0x2029:
        return true;
    }
    return false;
  }
  function isLineTerminator(code) {
    switch (code) {
      case 10:
      case 13:
      case 0x2028:
      case 0x2029:
        return true;
    }
    return false;
  }
  function isDecimalDigit(code) {
    return code >= 48 && code <= 57;
  }
  var isHexDigitArray = [];
  for (var i = 0; i < 128; i++) {
    isHexDigitArray[i] = i >= 48 && i <= 57 || i >= 65 && i <= 70 || i >= 97 && i <= 102;
  }
  function isHexDigit(code) {
    return code < 128 && isHexDigitArray[code];
  }
  var isIdentifierStartArray = [];
  for (var i = 0; i < 128; i++) {
    isIdentifierStartArray[i] = i === 36 || i >= 65 && i <= 90 || i === 95 || i >= 97 && i <= 122;
  }
  function isIdentifierStart(code) {
    return code < 128 ? isIdentifierStartArray[code]: isUnicodeLetter(code);
  }
  var isIdentifierPartArray = [];
  for (var i = 0; i < 128; i++) {
    isIdentifierPartArray[i] = isIdentifierStart(i) || isDecimalDigit(i);
  }
  function isIdentifierPart(code) {
    return code < 128 ? isIdentifierPartArray[code]: isUnicodeLetter(code);
  }
  var unicodeLetterTable = [170, 170, 181, 181, 186, 186, 192, 214, 216, 246, 248, 705, 710, 721, 736, 740, 748, 748, 750, 750, 880, 884, 886, 887, 890, 893, 902, 902, 904, 906, 908, 908, 910, 929, 931, 1013, 1015, 1153, 1162, 1319, 1329, 1366, 1369, 1369, 1377, 1415, 1488, 1514, 1520, 1522, 1568, 1610, 1646, 1647, 1649, 1747, 1749, 1749, 1765, 1766, 1774, 1775, 1786, 1788, 1791, 1791, 1808, 1808, 1810, 1839, 1869, 1957, 1969, 1969, 1994, 2026, 2036, 2037, 2042, 2042, 2048, 2069, 2074, 2074, 2084, 2084, 2088, 2088, 2112, 2136, 2308, 2361, 2365, 2365, 2384, 2384, 2392, 2401, 2417, 2423, 2425, 2431, 2437, 2444, 2447, 2448, 2451, 2472, 2474, 2480, 2482, 2482, 2486, 2489, 2493, 2493, 2510, 2510, 2524, 2525, 2527, 2529, 2544, 2545, 2565, 2570, 2575, 2576, 2579, 2600, 2602, 2608, 2610, 2611, 2613, 2614, 2616, 2617, 2649, 2652, 2654, 2654, 2674, 2676, 2693, 2701, 2703, 2705, 2707, 2728, 2730, 2736, 2738, 2739, 2741, 2745, 2749, 2749, 2768, 2768, 2784, 2785, 2821, 2828, 2831, 2832, 2835, 2856, 2858, 2864, 2866, 2867, 2869, 2873, 2877, 2877, 2908, 2909, 2911, 2913, 2929, 2929, 2947, 2947, 2949, 2954, 2958, 2960, 2962, 2965, 2969, 2970, 2972, 2972, 2974, 2975, 2979, 2980, 2984, 2986, 2990, 3001, 3024, 3024, 3077, 3084, 3086, 3088, 3090, 3112, 3114, 3123, 3125, 3129, 3133, 3133, 3160, 3161, 3168, 3169, 3205, 3212, 3214, 3216, 3218, 3240, 3242, 3251, 3253, 3257, 3261, 3261, 3294, 3294, 3296, 3297, 3313, 3314, 3333, 3340, 3342, 3344, 3346, 3386, 3389, 3389, 3406, 3406, 3424, 3425, 3450, 3455, 3461, 3478, 3482, 3505, 3507, 3515, 3517, 3517, 3520, 3526, 3585, 3632, 3634, 3635, 3648, 3654, 3713, 3714, 3716, 3716, 3719, 3720, 3722, 3722, 3725, 3725, 3732, 3735, 3737, 3743, 3745, 3747, 3749, 3749, 3751, 3751, 3754, 3755, 3757, 3760, 3762, 3763, 3773, 3773, 3776, 3780, 3782, 3782, 3804, 3805, 3840, 3840, 3904, 3911, 3913, 3948, 3976, 3980, 4096, 4138, 4159, 4159, 4176, 4181, 4186, 4189, 4193, 4193, 4197, 4198, 4206, 4208, 4213, 4225, 4238, 4238, 4256, 4293, 4304, 4346, 4348, 4348, 4352, 4680, 4682, 4685, 4688, 4694, 4696, 4696, 4698, 4701, 4704, 4744, 4746, 4749, 4752, 4784, 4786, 4789, 4792, 4798, 4800, 4800, 4802, 4805, 4808, 4822, 4824, 4880, 4882, 4885, 4888, 4954, 4992, 5007, 5024, 5108, 5121, 5740, 5743, 5759, 5761, 5786, 5792, 5866, 5870, 5872, 5888, 5900, 5902, 5905, 5920, 5937, 5952, 5969, 5984, 5996, 5998, 6000, 6016, 6067, 6103, 6103, 6108, 6108, 6176, 6263, 6272, 6312, 6314, 6314, 6320, 6389, 6400, 6428, 6480, 6509, 6512, 6516, 6528, 6571, 6593, 6599, 6656, 6678, 6688, 6740, 6823, 6823, 6917, 6963, 6981, 6987, 7043, 7072, 7086, 7087, 7104, 7141, 7168, 7203, 7245, 7247, 7258, 7293, 7401, 7404, 7406, 7409, 7424, 7615, 7680, 7957, 7960, 7965, 7968, 8005, 8008, 8013, 8016, 8023, 8025, 8025, 8027, 8027, 8029, 8029, 8031, 8061, 8064, 8116, 8118, 8124, 8126, 8126, 8130, 8132, 8134, 8140, 8144, 8147, 8150, 8155, 8160, 8172, 8178, 8180, 8182, 8188, 8305, 8305, 8319, 8319, 8336, 8348, 8450, 8450, 8455, 8455, 8458, 8467, 8469, 8469, 8473, 8477, 8484, 8484, 8486, 8486, 8488, 8488, 8490, 8493, 8495, 8505, 8508, 8511, 8517, 8521, 8526, 8526, 8544, 8584, 11264, 11310, 11312, 11358, 11360, 11492, 11499, 11502, 11520, 11557, 11568, 11621, 11631, 11631, 11648, 11670, 11680, 11686, 11688, 11694, 11696, 11702, 11704, 11710, 11712, 11718, 11720, 11726, 11728, 11734, 11736, 11742, 11823, 11823, 12293, 12295, 12321, 12329, 12337, 12341, 12344, 12348, 12353, 12438, 12445, 12447, 12449, 12538, 12540, 12543, 12549, 12589, 12593, 12686, 12704, 12730, 12784, 12799, 13312, 13312, 19893, 19893, 19968, 19968, 40907, 40907, 40960, 42124, 42192, 42237, 42240, 42508, 42512, 42527, 42538, 42539, 42560, 42606, 42623, 42647, 42656, 42735, 42775, 42783, 42786, 42888, 42891, 42894, 42896, 42897, 42912, 42921, 43002, 43009, 43011, 43013, 43015, 43018, 43020, 43042, 43072, 43123, 43138, 43187, 43250, 43255, 43259, 43259, 43274, 43301, 43312, 43334, 43360, 43388, 43396, 43442, 43471, 43471, 43520, 43560, 43584, 43586, 43588, 43595, 43616, 43638, 43642, 43642, 43648, 43695, 43697, 43697, 43701, 43702, 43705, 43709, 43712, 43712, 43714, 43714, 43739, 43741, 43777, 43782, 43785, 43790, 43793, 43798, 43808, 43814, 43816, 43822, 43968, 44002, 44032, 44032, 55203, 55203, 55216, 55238, 55243, 55291, 63744, 64045, 64048, 64109, 64112, 64217, 64256, 64262, 64275, 64279, 64285, 64285, 64287, 64296, 64298, 64310, 64312, 64316, 64318, 64318, 64320, 64321, 64323, 64324, 64326, 64433, 64467, 64829, 64848, 64911, 64914, 64967, 65008, 65019, 65136, 65140, 65142, 65276, 65313, 65338, 65345, 65370, 65382, 65470, 65474, 65479, 65482, 65487, 65490, 65495, 65498, 65500, 65536, 65547, 65549, 65574, 65576, 65594, 65596, 65597, 65599, 65613, 65616, 65629, 65664, 65786, 65856, 65908, 66176, 66204, 66208, 66256, 66304, 66334, 66352, 66378, 66432, 66461, 66464, 66499, 66504, 66511, 66513, 66517, 66560, 66717, 67584, 67589, 67592, 67592, 67594, 67637, 67639, 67640, 67644, 67644, 67647, 67669, 67840, 67861, 67872, 67897, 68096, 68096, 68112, 68115, 68117, 68119, 68121, 68147, 68192, 68220, 68352, 68405, 68416, 68437, 68448, 68466, 68608, 68680, 69635, 69687, 69763, 69807, 73728, 74606, 74752, 74850, 77824, 78894, 92160, 92728, 110592, 110593, 119808, 119892, 119894, 119964, 119966, 119967, 119970, 119970, 119973, 119974, 119977, 119980, 119982, 119993, 119995, 119995, 119997, 120003, 120005, 120069, 120071, 120074, 120077, 120084, 120086, 120092, 120094, 120121, 120123, 120126, 120128, 120132, 120134, 120134, 120138, 120144, 120146, 120485, 120488, 120512, 120514, 120538, 120540, 120570, 120572, 120596, 120598, 120628, 120630, 120654, 120656, 120686, 120688, 120712, 120714, 120744, 120746, 120770, 120772, 120779, 131072, 131072, 173782, 173782, 173824, 173824, 177972, 177972, 177984, 177984, 178205, 178205, 194560, 195101];
  function isUnicodeLetter(code) {
    for (var i = 0; i < unicodeLetterTable.length;) {
      if (code < unicodeLetterTable[i++]) return false;
      if (code <= unicodeLetterTable[i++]) return true;
    }
    return false;
  }
  function isRegularExpressionChar(code) {
    switch (code) {
      case 47:
        return false;
      case 91:
      case 92:
        return true;
    }
    return !isLineTerminator(code);
  }
  function isRegularExpressionFirstChar(code) {
    return isRegularExpressionChar(code) && code !== 42;
  }
  var index, input, length, token, lastToken, lookaheadToken, currentCharCode, lineNumberTable, errorReporter;
  var Scanner = function() {
    var $Scanner = ($__createClassNoExtends)({
      constructor: function(reporter, file) {
        errorReporter = reporter;
        lineNumberTable = file.lineNumberTable;
        input = file.contents;
        length = file.contents.length;
        index = 0;
        lastToken = null;
        token = null;
        lookaheadToken = null;
        updateCurrentCharCode();
      },
      get lastToken() {
        return lastToken;
      },
      getPosition: function() {
        return getPosition(getOffset());
      },
      nextRegularExpressionLiteralToken: function() {
        lastToken = nextRegularExpressionLiteralToken();
        token = scanToken();
        return lastToken;
      },
      nextTemplateLiteralToken: function() {
        var t = nextTemplateLiteralToken();
        token = scanToken();
        return t;
      },
      nextToken: function() {
        return nextToken();
      },
      peekToken: function(opt_index) {
        return opt_index ? peekTokenLookahead(): peekToken();
      },
      peekTokenNoLineTerminator: function() {
        return peekTokenNoLineTerminator();
      },
      isAtEnd: function() {
        return isAtEnd();
      }
    });
    return $Scanner;
  }();
  function getPosition(offset) {
    return lineNumberTable.getSourcePosition(offset);
  }
  function getTokenRange(startOffset) {
    return lineNumberTable.getSourceRange(startOffset, index);
  }
  function getOffset() {
    return token ? token.location.start.offset: index;
  }
  function nextRegularExpressionLiteralToken() {
    var beginIndex = index - 1;
    if (!skipRegularExpressionBody()) {
      return new LiteralToken(REGULAR_EXPRESSION, getTokenString(beginIndex), getTokenRange(beginIndex));
    }
    if (currentCharCode !== 47) {
      reportError('Expected \'/\' in regular expression literal');
      return new LiteralToken(REGULAR_EXPRESSION, getTokenString(beginIndex), getTokenRange(beginIndex));
    }
    next();
    while (isIdentifierPart(currentCharCode)) {
      next();
    }
    return new LiteralToken(REGULAR_EXPRESSION, getTokenString(beginIndex), getTokenRange(beginIndex));
  }
  function skipRegularExpressionBody() {
    if (!isRegularExpressionFirstChar(currentCharCode)) {
      reportError('Expected regular expression first char');
      return false;
    }
    while (!isAtEnd() && isRegularExpressionChar(currentCharCode)) {
      if (!skipRegularExpressionChar()) return false;
    }
    return true;
  }
  function skipRegularExpressionChar() {
    switch (currentCharCode) {
      case 92:
        return skipRegularExpressionBackslashSequence();
      case 91:
        return skipRegularExpressionClass();
      default:
        next();
        return true;
    }
  }
  function skipRegularExpressionBackslashSequence() {
    next();
    if (isLineTerminator(currentCharCode)) {
      reportError('New line not allowed in regular expression literal');
      return false;
    }
    next();
    return true;
  }
  function skipRegularExpressionClass() {
    next();
    while (!isAtEnd() && peekRegularExpressionClassChar()) {
      if (!skipRegularExpressionClassChar()) {
        return false;
      }
    }
    if (currentCharCode !== 93) {
      reportError('\']\' expected');
      return false;
    }
    next();
    return true;
  }
  function peekRegularExpressionClassChar() {
    return currentCharCode !== 93 && !isLineTerminator(currentCharCode);
  }
  function skipRegularExpressionClassChar() {
    if (currentCharCode === 92) {
      return skipRegularExpressionBackslashSequence();
    }
    next();
    return true;
  }
  function skipTemplateCharacter() {
    while (!isAtEnd()) {
      switch (currentCharCode) {
        case 96:
          return;
        case 92:
          skipStringLiteralEscapeSequence();
          break;
        case 36:
          var code = input.charCodeAt(index + 1);
          if (code === 123) return;
        default:
          next();
      }
    }
  }
  function scanTemplateStart(beginIndex) {
    if (isAtEnd()) {
      reportError('Unterminated template literal');
      return lastToken = createToken(END_OF_FILE, beginIndex);
    }
    return nextTemplateLiteralTokenShared(NO_SUBSTITUTION_TEMPLATE, TEMPLATE_HEAD);
  }
  function nextTemplateLiteralToken() {
    if (isAtEnd()) {
      reportError('Expected \'}\' after expression in template literal');
      return createToken(END_OF_FILE, index);
    }
    if (token.type !== CLOSE_CURLY) {
      reportError('Expected \'}\' after expression in template literal');
      return createToken(ERROR, index);
    }
    return nextTemplateLiteralTokenShared(TEMPLATE_TAIL, TEMPLATE_MIDDLE);
  }
  function nextTemplateLiteralTokenShared(endType, middleType) {
    var beginIndex = index;
    skipTemplateCharacter();
    if (isAtEnd()) {
      reportError('Unterminated template literal');
      return createToken(ERROR, beginIndex);
    }
    var value = getTokenString(beginIndex);
    switch (currentCharCode) {
      case 96:
        next();
        return lastToken = new LiteralToken(endType, value, getTokenRange(beginIndex - 1));
      case 36:
        next();
        next();
        return lastToken = new LiteralToken(middleType, value, getTokenRange(beginIndex - 1));
    }
  }
  function nextToken() {
    var t = peekToken();
    token = lookaheadToken || scanToken();
    lookaheadToken = null;
    lastToken = t;
    return t;
  }
  function peekTokenNoLineTerminator() {
    var t = peekToken();
    var start = lastToken.location.end.offset;
    var end = t.location.start.offset;
    for (var i = start; i < end; i++) {
      var code = input.charCodeAt(i);
      if (isLineTerminator(code)) return null;
      if (code === 47) {
        code = input.charCodeAt(++i);
        if (code === 47) return null;
        i = input.indexOf('*/', i) + 2;
      }
    }
    return t;
  }
  function peekToken() {
    return token || (token = scanToken());
  }
  function peekTokenLookahead() {
    if (!token) token = scanToken();
    if (!lookaheadToken) lookaheadToken = scanToken();
    return lookaheadToken;
  }
  function skipWhitespace() {
    while (!isAtEnd() && peekWhitespace()) {
      next();
    }
  }
  function peekWhitespace() {
    return isWhitespace(currentCharCode);
  }
  function skipComments() {
    while (skipComment()) {}
  }
  function skipComment() {
    skipWhitespace();
    var code = currentCharCode;
    if (code === 47) {
      code = input.charCodeAt(index + 1);
      switch (code) {
        case 47:
          skipSingleLineComment();
          return true;
        case 42:
          skipMultiLineComment();
          return true;
      }
    }
    return false;
  }
  function skipSingleLineComment() {
    while (!isAtEnd() && !isLineTerminator(currentCharCode)) {
      next();
    }
  }
  function skipMultiLineComment() {
    var i = input.indexOf('*/', index + 2);
    if (i !== - 1) index = i + 2; else index = length;
    updateCurrentCharCode();
  }
  function scanToken() {
    skipComments();
    var beginIndex = index;
    if (isAtEnd()) return createToken(END_OF_FILE, beginIndex);
    var code = currentCharCode;
    next();
    switch (code) {
      case 123:
        return createToken(OPEN_CURLY, beginIndex);
      case 125:
        return createToken(CLOSE_CURLY, beginIndex);
      case 40:
        return createToken(OPEN_PAREN, beginIndex);
      case 41:
        return createToken(CLOSE_PAREN, beginIndex);
      case 91:
        return createToken(OPEN_SQUARE, beginIndex);
      case 93:
        return createToken(CLOSE_SQUARE, beginIndex);
      case 46:
        switch (currentCharCode) {
          case 46:
            if (input.charCodeAt(index + 1) === 46) {
              next();
              next();
              return createToken(DOT_DOT_DOT, beginIndex);
            }
            break;
          case 123:
            next();
            return createToken(PERIOD_OPEN_CURLY, beginIndex);
          default:
            if (isDecimalDigit(currentCharCode)) return scanNumberPostPeriod(beginIndex);
        }
        return createToken(PERIOD, beginIndex);
      case 59:
        return createToken(SEMI_COLON, beginIndex);
      case 44:
        return createToken(COMMA, beginIndex);
      case 126:
        return createToken(TILDE, beginIndex);
      case 63:
        return createToken(QUESTION, beginIndex);
      case 58:
        return createToken(COLON, beginIndex);
      case 60:
        switch (currentCharCode) {
          case 60:
            next();
            if (currentCharCode === 61) {
              next();
              return createToken(LEFT_SHIFT_EQUAL, beginIndex);
            }
            return createToken(LEFT_SHIFT, beginIndex);
          case 61:
            next();
            return createToken(LESS_EQUAL, beginIndex);
          default:
            return createToken(OPEN_ANGLE, beginIndex);
        }
      case 62:
        switch (currentCharCode) {
          case 62:
            next();
            switch (currentCharCode) {
              case 61:
                next();
                return createToken(RIGHT_SHIFT_EQUAL, beginIndex);
              case 62:
                next();
                if (currentCharCode === 61) {
                  next();
                  return createToken(UNSIGNED_RIGHT_SHIFT_EQUAL, beginIndex);
                }
                return createToken(UNSIGNED_RIGHT_SHIFT, beginIndex);
              default:
                return createToken(RIGHT_SHIFT, beginIndex);
            }
          case 61:
            next();
            return createToken(GREATER_EQUAL, beginIndex);
          default:
            return createToken(CLOSE_ANGLE, beginIndex);
        }
      case 61:
        if (currentCharCode === 61) {
          next();
          if (currentCharCode === 61) {
            next();
            return createToken(EQUAL_EQUAL_EQUAL, beginIndex);
          }
          return createToken(EQUAL_EQUAL, beginIndex);
        }
        if (currentCharCode === 62) {
          next();
          return createToken(ARROW, beginIndex);
        }
        return createToken(EQUAL, beginIndex);
      case 33:
        if (currentCharCode === 61) {
          next();
          if (currentCharCode === 61) {
            next();
            return createToken(NOT_EQUAL_EQUAL, beginIndex);
          }
          return createToken(NOT_EQUAL, beginIndex);
        }
        return createToken(BANG, beginIndex);
      case 42:
        if (currentCharCode === 61) {
          next();
          return createToken(STAR_EQUAL, beginIndex);
        }
        return createToken(STAR, beginIndex);
      case 37:
        if (currentCharCode === 61) {
          next();
          return createToken(PERCENT_EQUAL, beginIndex);
        }
        return createToken(PERCENT, beginIndex);
      case 94:
        if (currentCharCode === 61) {
          next();
          return createToken(CARET_EQUAL, beginIndex);
        }
        return createToken(CARET, beginIndex);
      case 47:
        if (currentCharCode === 61) {
          next();
          return createToken(SLASH_EQUAL, beginIndex);
        }
        return createToken(SLASH, beginIndex);
      case 43:
        switch (currentCharCode) {
          case 43:
            next();
            return createToken(PLUS_PLUS, beginIndex);
          case 61:
            next();
            return createToken(PLUS_EQUAL, beginIndex);
          default:
            return createToken(PLUS, beginIndex);
        }
      case 45:
        switch (currentCharCode) {
          case 45:
            next();
            return createToken(MINUS_MINUS, beginIndex);
          case 61:
            next();
            return createToken(MINUS_EQUAL, beginIndex);
          default:
            return createToken(MINUS, beginIndex);
        }
      case 38:
        switch (currentCharCode) {
          case 38:
            next();
            return createToken(AND, beginIndex);
          case 61:
            next();
            return createToken(AMPERSAND_EQUAL, beginIndex);
          default:
            return createToken(AMPERSAND, beginIndex);
        }
      case 124:
        switch (currentCharCode) {
          case 124:
            next();
            return createToken(OR, beginIndex);
          case 61:
            next();
            return createToken(BAR_EQUAL, beginIndex);
          default:
            return createToken(BAR, beginIndex);
        }
      case 96:
        return scanTemplateStart(beginIndex);
      case 64:
        return scanAtName(beginIndex);
      case 48:
        return scanPostZero(beginIndex);
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return scanPostDigit(beginIndex);
      case 34:
      case 39:
        return scanStringLiteral(beginIndex, code);
      default:
        return scanIdentifierOrKeyword(beginIndex, code);
    }
  }
  function scanNumberPostPeriod(beginIndex) {
    skipDecimalDigits();
    return scanExponentOfNumericLiteral(beginIndex);
  }
  function scanPostDigit(beginIndex) {
    skipDecimalDigits();
    return scanFractionalNumericLiteral(beginIndex);
  }
  function scanPostZero(beginIndex) {
    switch (currentCharCode) {
      case 88:
      case 120:
        next();
        if (!isHexDigit(currentCharCode)) {
          reportError('Hex Integer Literal must contain at least one digit');
        }
        skipHexDigits();
        return new LiteralToken(NUMBER, getTokenString(beginIndex), getTokenRange(beginIndex));
      case 46:
        return scanFractionalNumericLiteral(beginIndex);
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return scanPostDigit(beginIndex);
      default:
        return new LiteralToken(NUMBER, getTokenString(beginIndex), getTokenRange(beginIndex));
    }
  }
  function createToken(type, beginIndex) {
    return new Token(type, getTokenRange(beginIndex));
  }
  function readUnicodeEscapeSequence() {
    var beginIndex = index;
    if (currentCharCode === 117) {
      next();
      if (skipHexDigit() && skipHexDigit() && skipHexDigit() && skipHexDigit()) {
        return parseInt(getTokenString(beginIndex + 1), 16);
      }
    }
    reportError('Invalid unicode escape sequence in identifier', beginIndex - 1);
    return 0;
  }
  function scanIdentifierOrKeyword(beginIndex, code) {
    var escapedCharCodes;
    if (code === 92) {
      code = readUnicodeEscapeSequence();
      escapedCharCodes = [code];
    }
    if (!isIdentifierStart(code)) {
      reportError(("Character code '" + code + "' is not a valid identifier start char"), beginIndex);
      return createToken(ERROR, beginIndex);
    }
    for (;;) {
      code = currentCharCode;
      if (isIdentifierPart(code)) {
        next();
      } else if (code === 92) {
        next();
        code = readUnicodeEscapeSequence();
        if (!escapedCharCodes) escapedCharCodes = [];
        escapedCharCodes.push(code);
        if (!isIdentifierPart(code)) return createToken(ERROR, beginIndex);
      } else {
        break;
      }
    }
    var value = input.slice(beginIndex, index);
    if (isKeyword(value)) {
      return new KeywordToken(value, getTokenRange(beginIndex));
    }
    if (escapedCharCodes) {
      var i = 0;
      value = value.replace(/\\u..../g, function(s) {
        return String.fromCharCode(escapedCharCodes[i++]);
      });
    }
    return new IdentifierToken(getTokenRange(beginIndex), value);
  }
  function scanAtName(beginIndex) {
    if (isAtEnd()) {
      reportError('Expected identifier start character', beginIndex);
      return createToken(ERROR, beginIndex);
    }
    var code = currentCharCode;
    next();
    var identifierToken = scanIdentifierOrKeyword(beginIndex, code);
    if (identifierToken.type === ERROR) return identifierToken;
    var value = identifierToken.value;
    return new AtNameToken(getTokenRange(beginIndex), value);
  }
  function scanStringLiteral(beginIndex, terminator) {
    while (peekStringLiteralChar(terminator)) {
      if (!skipStringLiteralChar()) {
        return new LiteralToken(STRING, getTokenString(beginIndex), getTokenRange(beginIndex));
      }
    }
    if (currentCharCode !== terminator) {
      reportError('Unterminated String Literal', beginIndex);
    } else {
      next();
    }
    return new LiteralToken(STRING, getTokenString(beginIndex), getTokenRange(beginIndex));
  }
  function getTokenString(beginIndex) {
    return input.substring(beginIndex, index);
  }
  function peekStringLiteralChar(terminator) {
    return !isAtEnd() && currentCharCode !== terminator && !isLineTerminator(currentCharCode);
  }
  function skipStringLiteralChar() {
    if (currentCharCode === 92) {
      return skipStringLiteralEscapeSequence();
    }
    next();
    return true;
  }
  function skipStringLiteralEscapeSequence() {
    next();
    if (isAtEnd()) {
      reportError('Unterminated string literal escape sequence');
      return false;
    }
    if (isLineTerminator(currentCharCode)) {
      skipLineTerminator();
      return true;
    }
    var code = currentCharCode;
    next();
    switch (code) {
      case 39:
      case 34:
      case 92:
      case 98:
      case 102:
      case 110:
      case 114:
      case 116:
      case 118:
      case 48:
        return true;
      case 120:
        return skipHexDigit() && skipHexDigit();
      case 117:
        return skipHexDigit() && skipHexDigit() && skipHexDigit() && skipHexDigit();
      default:
        return true;
    }
  }
  function skipHexDigit() {
    if (!isHexDigit(currentCharCode)) {
      reportError('Hex digit expected');
      return false;
    }
    next();
    return true;
  }
  function skipLineTerminator() {
    var first = currentCharCode;
    next();
    if (first === 13 && currentCharCode === 10) {
      next();
    }
  }
  function scanFractionalNumericLiteral(beginIndex) {
    if (currentCharCode === 46) {
      next();
      skipDecimalDigits();
    }
    return scanExponentOfNumericLiteral(beginIndex);
  }
  function scanExponentOfNumericLiteral(beginIndex) {
    switch (currentCharCode) {
      case 101:
      case 69:
        next();
        switch (currentCharCode) {
          case 43:
          case 45:
            next();
            break;
        }
        if (!isDecimalDigit(currentCharCode)) {
          reportError('Exponent part must contain at least one digit');
        }
        skipDecimalDigits();
        break;
      default:
        break;
    }
    return new LiteralToken(NUMBER, getTokenString(beginIndex), getTokenRange(beginIndex));
  }
  function skipDecimalDigits() {
    while (isDecimalDigit(currentCharCode)) {
      next();
    }
  }
  function skipHexDigits() {
    while (isHexDigit(currentCharCode)) {
      next();
    }
  }
  function isAtEnd() {
    return index === length;
  }
  function next() {
    index++;
    updateCurrentCharCode();
  }
  function updateCurrentCharCode() {
    currentCharCode = input.charCodeAt(index);
  }
  function reportError(message, opt_index) {
    var position = getPosition(opt_index || index);
    errorReporter.reportError(position, message);
  }
  return Object.preventExtensions(Object.create(null, {
    isLineTerminator: {
      get: function() {
        return isLineTerminator;
      },
      enumerable: true
    },
    Scanner: {
      get: function() {
        return Scanner;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_syntax_Parser_js = (function() {
  "use strict";
  var $__9 = $__src_codegeneration_AssignmentPatternTransformer_js, AssignmentPatternTransformer = $__9.AssignmentPatternTransformer, AssignmentPatternTransformerError = $__9.AssignmentPatternTransformerError;
  var $__9 = $__src_codegeneration_CoverFormalsTransformer_js, CoverFormalsTransformer = $__9.CoverFormalsTransformer, CoverFormalsTransformerError = $__9.CoverFormalsTransformerError;
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var MutedErrorReporter = $__src_util_MutedErrorReporter_js.MutedErrorReporter;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, ARRAY_LITERAL_EXPRESSION = $__9.ARRAY_LITERAL_EXPRESSION, BINARY_OPERATOR = $__9.BINARY_OPERATOR, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, FORMAL_PARAMETER_LIST = $__9.FORMAL_PARAMETER_LIST, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, MISSING_PRIMARY_EXPRESSION = $__9.MISSING_PRIMARY_EXPRESSION, OBJECT_LITERAL_EXPRESSION = $__9.OBJECT_LITERAL_EXPRESSION, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, PROPERTY_NAME_ASSIGNMENT = $__9.PROPERTY_NAME_ASSIGNMENT, REST_PARAMETER = $__9.REST_PARAMETER;
  var $__9 = $__src_syntax_PredefinedName_js, ANY = $__9.ANY, BOOL = $__9.BOOL, FROM = $__9.FROM, GET = $__9.GET, IS = $__9.IS, ISNT = $__9.ISNT, MODULE = $__9.MODULE, NUMBER = $__9.NUMBER, OF = $__9.OF, SET = $__9.SET, STRING = $__9.STRING;
  var Scanner = $__src_syntax_Scanner_js.Scanner;
  var SourceRange = $__src_util_SourceRange_js.SourceRange;
  var $__9 = $__src_syntax_Token_js, Token = $__9.Token, isAssignmentOperator = $__9.isAssignmentOperator;
  var isKeyword = $__src_syntax_Keywords_js.isKeyword;
  var options = $__src_options_js.parseOptions;
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND = $__9.AMPERSAND, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, AND = $__9.AND, ARROW = $__9.ARROW, AT_NAME = $__9.AT_NAME, AWAIT = $__9.AWAIT, BACK_QUOTE = $__9.BACK_QUOTE, BANG = $__9.BANG, BAR = $__9.BAR, BAR_EQUAL = $__9.BAR_EQUAL, BREAK = $__9.BREAK, CARET = $__9.CARET, CARET_EQUAL = $__9.CARET_EQUAL, CASE = $__9.CASE, CATCH = $__9.CATCH, CLASS = $__9.CLASS, CLOSE_ANGLE = $__9.CLOSE_ANGLE, CLOSE_CURLY = $__9.CLOSE_CURLY, CLOSE_PAREN = $__9.CLOSE_PAREN, CLOSE_SQUARE = $__9.CLOSE_SQUARE, COLON = $__9.COLON, COMMA = $__9.COMMA, CONST = $__9.CONST, CONTINUE = $__9.CONTINUE, DEBUGGER = $__9.DEBUGGER, DEFAULT = $__9.DEFAULT, DELETE = $__9.DELETE, DO = $__9.DO, DOLLAR = $__9.DOLLAR, DOT_DOT_DOT = $__9.DOT_DOT_DOT, ELSE = $__9.ELSE, END_OF_FILE = $__9.END_OF_FILE, ENUM = $__9.ENUM, EQUAL = $__9.EQUAL, EQUAL_EQUAL = $__9.EQUAL_EQUAL, EQUAL_EQUAL_EQUAL = $__9.EQUAL_EQUAL_EQUAL, ERROR = $__9.ERROR, EXPORT = $__9.EXPORT, EXTENDS = $__9.EXTENDS, FALSE = $__9.FALSE, FINALLY = $__9.FINALLY, FOR = $__9.FOR, FUNCTION = $__9.FUNCTION, GREATER_EQUAL = $__9.GREATER_EQUAL, IDENTIFIER = $__9.IDENTIFIER, IF = $__9.IF, IMPLEMENTS = $__9.IMPLEMENTS, IMPORT = $__9.IMPORT, IN = $__9.IN, INSTANCEOF = $__9.INSTANCEOF, INTERFACE = $__9.INTERFACE, LEFT_SHIFT = $__9.LEFT_SHIFT, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, LESS_EQUAL = $__9.LESS_EQUAL, LET = $__9.LET, MINUS = $__9.MINUS, MINUS_EQUAL = $__9.MINUS_EQUAL, MINUS_MINUS = $__9.MINUS_MINUS, NEW = $__9.NEW, NO_SUBSTITUTION_TEMPLATE = $__9.NO_SUBSTITUTION_TEMPLATE, NOT_EQUAL = $__9.NOT_EQUAL, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, NULL = $__9.NULL, NUMBER = $__9.NUMBER, OPEN_ANGLE = $__9.OPEN_ANGLE, OPEN_CURLY = $__9.OPEN_CURLY, OPEN_PAREN = $__9.OPEN_PAREN, OPEN_SQUARE = $__9.OPEN_SQUARE, OR = $__9.OR, PACKAGE = $__9.PACKAGE, PERCENT = $__9.PERCENT, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PERIOD = $__9.PERIOD, PERIOD_OPEN_CURLY = $__9.PERIOD_OPEN_CURLY, PLUS = $__9.PLUS, PLUS_EQUAL = $__9.PLUS_EQUAL, PLUS_PLUS = $__9.PLUS_PLUS, PRIVATE = $__9.PRIVATE, PROTECTED = $__9.PROTECTED, PUBLIC = $__9.PUBLIC, QUESTION = $__9.QUESTION, REGULAR_EXPRESSION = $__9.REGULAR_EXPRESSION, RETURN = $__9.RETURN, RIGHT_SHIFT = $__9.RIGHT_SHIFT, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SEMI_COLON = $__9.SEMI_COLON, SLASH = $__9.SLASH, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR = $__9.STAR, STAR_EQUAL = $__9.STAR_EQUAL, STATIC = $__9.STATIC, STRING = $__9.STRING, SUPER = $__9.SUPER, SWITCH = $__9.SWITCH, TEMPLATE_HEAD = $__9.TEMPLATE_HEAD, TEMPLATE_MIDDLE = $__9.TEMPLATE_MIDDLE, TEMPLATE_TAIL = $__9.TEMPLATE_TAIL, THIS = $__9.THIS, THROW = $__9.THROW, TILDE = $__9.TILDE, TRUE = $__9.TRUE, TRY = $__9.TRY, TYPEOF = $__9.TYPEOF, UNSIGNED_RIGHT_SHIFT = $__9.UNSIGNED_RIGHT_SHIFT, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL, VAR = $__9.VAR, VOID = $__9.VOID, WHILE = $__9.WHILE, WITH = $__9.WITH, YIELD = $__9.YIELD;
  var $__9 = $__src_syntax_trees_ParseTrees_js, ArgumentList = $__9.ArgumentList, ArrayComprehension = $__9.ArrayComprehension, ArrayLiteralExpression = $__9.ArrayLiteralExpression, ArrayPattern = $__9.ArrayPattern, ArrowFunctionExpression = $__9.ArrowFunctionExpression, AtNameDeclaration = $__9.AtNameDeclaration, AtNameExpression = $__9.AtNameExpression, AwaitStatement = $__9.AwaitStatement, BinaryOperator = $__9.BinaryOperator, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, Block = $__9.Block, BreakStatement = $__9.BreakStatement, CallExpression = $__9.CallExpression, CascadeExpression = $__9.CascadeExpression, CaseClause = $__9.CaseClause, Catch = $__9.Catch, ClassDeclaration = $__9.ClassDeclaration, ClassExpression = $__9.ClassExpression, CommaExpression = $__9.CommaExpression, ComprehensionFor = $__9.ComprehensionFor, ConditionalExpression = $__9.ConditionalExpression, ContinueStatement = $__9.ContinueStatement, CoverFormals = $__9.CoverFormals, DebuggerStatement = $__9.DebuggerStatement, DefaultClause = $__9.DefaultClause, DoWhileStatement = $__9.DoWhileStatement, EmptyStatement = $__9.EmptyStatement, ExportDeclaration = $__9.ExportDeclaration, ExportMapping = $__9.ExportMapping, ExportMappingList = $__9.ExportMappingList, ExportSpecifier = $__9.ExportSpecifier, ExportSpecifierSet = $__9.ExportSpecifierSet, ExportStar = $__9.ExportStar, ExpressionStatement = $__9.ExpressionStatement, Finally = $__9.Finally, ForInStatement = $__9.ForInStatement, ForOfStatement = $__9.ForOfStatement, ForStatement = $__9.ForStatement, FormalParameterList = $__9.FormalParameterList, FunctionDeclaration = $__9.FunctionDeclaration, FunctionExpression = $__9.FunctionExpression, GeneratorComprehension = $__9.GeneratorComprehension, GetAccessor = $__9.GetAccessor, IdentifierExpression = $__9.IdentifierExpression, IfStatement = $__9.IfStatement, ImportBinding = $__9.ImportBinding, ImportDeclaration = $__9.ImportDeclaration, ImportSpecifier = $__9.ImportSpecifier, ImportSpecifierSet = $__9.ImportSpecifierSet, LabelledStatement = $__9.LabelledStatement, LiteralExpression = $__9.LiteralExpression, MemberExpression = $__9.MemberExpression, MemberLookupExpression = $__9.MemberLookupExpression, MissingPrimaryExpression = $__9.MissingPrimaryExpression, ModuleDeclaration = $__9.ModuleDeclaration, ModuleDefinition = $__9.ModuleDefinition, ModuleExpression = $__9.ModuleExpression, ModuleRequire = $__9.ModuleRequire, ModuleSpecifier = $__9.ModuleSpecifier, NameStatement = $__9.NameStatement, NewExpression = $__9.NewExpression, ObjectLiteralExpression = $__9.ObjectLiteralExpression, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, ParenExpression = $__9.ParenExpression, PostfixExpression = $__9.PostfixExpression, PredefinedType = $__9.PredefinedType, Program = $__9.Program, PropertyMethodAssignment = $__9.PropertyMethodAssignment, PropertyNameAssignment = $__9.PropertyNameAssignment, PropertyNameShorthand = $__9.PropertyNameShorthand, RestParameter = $__9.RestParameter, ReturnStatement = $__9.ReturnStatement, SetAccessor = $__9.SetAccessor, SpreadExpression = $__9.SpreadExpression, SpreadPatternElement = $__9.SpreadPatternElement, SuperExpression = $__9.SuperExpression, SwitchStatement = $__9.SwitchStatement, TemplateLiteralExpression = $__9.TemplateLiteralExpression, TemplateLiteralPortion = $__9.TemplateLiteralPortion, TemplateSubstitution = $__9.TemplateSubstitution, ThisExpression = $__9.ThisExpression, ThrowStatement = $__9.ThrowStatement, TryStatement = $__9.TryStatement, TypeName = $__9.TypeName, UnaryExpression = $__9.UnaryExpression, VariableDeclaration = $__9.VariableDeclaration, VariableDeclarationList = $__9.VariableDeclarationList, VariableStatement = $__9.VariableStatement, WhileStatement = $__9.WhileStatement, WithStatement = $__9.WithStatement, YieldExpression = $__9.YieldExpression;
  var Expression = {
    NO_IN: 'NO_IN',
    NORMAL: 'NORMAL'
  };
  var DestructuringInitializer = {
    REQUIRED: 'REQUIRED',
    OPTIONAL: 'OPTIONAL'
  };
  function followedByCommaOrCloseSquare(token) {
    return token.type === COMMA || token.type === CLOSE_SQUARE;
  }
  function followedByCommaOrCloseCurly(token) {
    return token.type === COMMA || token.type === CLOSE_CURLY;
  }
  function followedByInOrOf(token) {
    return token.type === IN || token.type === IDENTIFIER && token.value === OF;
  }
  var Initializer = {
    ALLOWED: 'ALLOWED',
    REQUIRED: 'REQUIRED'
  };
  var Parser = function() {
    var $Parser = ($__createClassNoExtends)({
      constructor: function(errorReporter, file) {
        this.errorReporter_ = errorReporter;
        this.scanner_ = new Scanner(errorReporter, file);
        this.allowYield_ = false;
      },
      parseProgram: function(opt_load) {
        var start = this.getTreeStartLocation_();
        var programElements = this.parseProgramElements_(!!opt_load);
        this.eat_(END_OF_FILE);
        return new Program(this.getTreeLocation_(start), programElements);
      },
      parseProgramElements_: function(load) {
        var result = [];
        var type;
        while ((type = this.peekType_()) !== END_OF_FILE) {
          result.push(this.parseProgramElement_(type, load));
        }
        return result;
      },
      parseProgramElement_: function(type, load) {
        return this.parseStatement_(type, true, load);
      },
      peekModuleDefinition_: function(type) {
        return type === IDENTIFIER && this.peek_(OPEN_CURLY, 1);
      },
      parseModuleDefinition_: function(load, start) {
        var name = this.eatId_();
        this.eat_(OPEN_CURLY);
        var result = [];
        var type;
        while (this.peekModuleElement_(type = this.peekType_())) {
          result.push(this.parseModuleElement_(type, load));
        }
        this.eat_(CLOSE_CURLY);
        return new ModuleDefinition(this.getTreeLocation_(start), name, result);
      },
      parseModuleSpecifier_: function(load) {
        var start = this.getTreeStartLocation_();
        var identifier = this.eatId_();
        this.eatId_(FROM);
        var expression = this.parseModuleExpression_(load);
        return new ModuleSpecifier(this.getTreeLocation_(start), identifier, expression);
      },
      parseModuleExpression_: function(load) {
        var start = this.getTreeStartLocation_();
        var reference = this.parseModuleReference_(load);
        var identifierNames = [];
        while (this.peek_(PERIOD) && this.peekIdName_(this.peekToken_(1))) {
          this.eat_(PERIOD);
          identifierNames.push(this.eatIdName_());
        }
        return new ModuleExpression(this.getTreeLocation_(start), reference, identifierNames);
      },
      parseModuleReference_: function(load) {
        var start = this.getTreeStartLocation_();
        if (load && this.peek_(STRING)) {
          var url = this.eat_(STRING);
          return new ModuleRequire(this.getTreeLocation_(start), url);
        }
        return this.parseIdentifierExpression_();
      },
      peekModuleElement_: function(type) {
        return this.peekStatement_(type, true);
      },
      parseModuleElement_: function(type, load) {
        return this.parseProgramElement_(type, load);
      },
      parseImportDeclaration_: function(load) {
        var start = this.getTreeStartLocation_();
        this.eat_(IMPORT);
        var importBindings = [];
        importBindings.push(this.parseImportBinding_(load));
        while (this.eatIf_(COMMA)) {
          importBindings.push(this.parseImportBinding_(load));
        }
        this.eatPossibleImplicitSemiColon_();
        return new ImportDeclaration(this.getTreeLocation_(start), importBindings);
      },
      parseImportBinding_: function(load) {
        var start = this.getTreeStartLocation_();
        var importSpecifierSet = this.parseImportSpecifierSet_();
        this.eatId_(FROM);
        var moduleExpression = this.parseModuleExpression_(load);
        return new ImportBinding(this.getTreeLocation_(start), moduleExpression, importSpecifierSet);
      },
      parseImportSpecifierSet_: function() {
        if (this.peek_(OPEN_CURLY)) {
          var start = this.getTreeStartLocation_();
          this.eat_(OPEN_CURLY);
          var specifiers = [this.parseImportSpecifier_()];
          while (this.eatIf_(COMMA)) {
            if (this.peek_(CLOSE_CURLY)) break;
            specifiers.push(this.parseImportSpecifier_());
          }
          this.eat_(CLOSE_CURLY);
          return new ImportSpecifierSet(this.getTreeLocation_(start), specifiers);
        }
        if (this.peek_(STAR)) {
          var star = this.eat_(STAR);
          return new ImportSpecifierSet(this.getTreeLocation_(start), star);
        }
        return this.parseIdentifierNameExpression_();
      },
      parseImportSpecifier_: function() {
        var start = this.getTreeStartLocation_();
        var lhs = this.eatIdName_();
        var rhs = null;
        if (this.eatIf_(COLON)) rhs = this.eatId_();
        return new ImportSpecifier(this.getTreeLocation_(start), lhs, rhs);
      },
      parseExportDeclaration_: function(load) {
        var start = this.getTreeStartLocation_();
        this.eat_(EXPORT);
        var exportTree;
        var type = this.peekType_();
        switch (type) {
          case CONST:
          case LET:
          case VAR:
            exportTree = this.parseVariableStatement_();
            break;
          case FUNCTION:
            exportTree = this.parseFunctionDeclaration_();
            break;
          case CLASS:
            exportTree = this.parseClassDeclaration_();
            break;
          case IDENTIFIER:
            if (this.peekModuleDeclaration_(type)) {
              exportTree = this.parseModuleDeclaration_(load);
            } else {
              exportTree = this.parseExportMappingList_(load);
            }
            break;
          case OPEN_CURLY:
          case STAR:
            exportTree = this.parseExportMappingList_(load);
            break;
          default:
            this.reportError_(("Unexpected symbol '" + this.peekToken_() + "'"));
            return null;
        }
        return new ExportDeclaration(this.getTreeLocation_(start), exportTree);
      },
      parseExportMappingList_: function(load) {
        var start = this.getTreeStartLocation_();
        var mappings = [this.parseExportMapping_(load)];
        while (this.eatIf_(COMMA)) {
          mappings.push(this.parseExportMapping_(load));
        }
        this.eatPossibleImplicitSemiColon_();
        return new ExportMappingList(this.getTreeLocation_(start), mappings);
      },
      parseExportMapping_: function(load) {
        var start = this.getTreeStartLocation_();
        var specifierSet, expression;
        if (this.eatIf_(STAR)) {
          specifierSet = new ExportStar(this.getTreeLocation_(start));
          expression = this.parseFromModuleExpression_(load, true);
        } else if (this.peek_(OPEN_CURLY)) {
          specifierSet = this.parseExportSpecifierSet_();
          expression = this.parseFromModuleExpression_(load, false);
        } else {
          specifierSet = this.parseIdentifierExpression_();
          expression = this.parseFromModuleExpression_(load, false);
        }
        return new ExportMapping(this.getTreeLocation_(start), expression, specifierSet);
      },
      parseFromModuleExpression_: function(load, required) {
        if (required || this.peekPredefinedString_(FROM)) {
          this.eatId_(FROM);
          return this.parseModuleExpression_(load);
        }
        return null;
      },
      parseExportSpecifierSet_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(OPEN_CURLY);
        var specifiers = [this.parseExportSpecifier_()];
        while (this.eatIf_(COMMA)) {
          if (this.peek_(CLOSE_CURLY)) break;
          specifiers.push(this.parseExportSpecifier_());
        }
        this.eat_(CLOSE_CURLY);
        return new ExportSpecifierSet(this.getTreeLocation_(start), specifiers);
      },
      parseExportSpecifier_: function() {
        var start = this.getTreeStartLocation_();
        var lhs, rhs = null;
        if (this.peek_(COLON, 1)) {
          lhs = this.eatIdName_();
          this.eat_(COLON);
          rhs = this.eatId_();
        } else {
          lhs = this.eatId_();
        }
        return new ExportSpecifier(this.getTreeLocation_(start), lhs, rhs);
      },
      peekId_: function(type) {
        return type === IDENTIFIER;
      },
      peekIdName_: function(token) {
        return token.type === IDENTIFIER || token.isKeyword();
      },
      peekModuleDeclaration_: function(type) {
        return options.modules && type === IDENTIFIER && this.peekToken_().value === MODULE && this.peek_(IDENTIFIER, 1);
      },
      parseModuleDeclaration_: function(load) {
        var start = this.getTreeStartLocation_();
        this.eatId_();
        if (this.peekModuleDefinition_(this.peekType_())) return this.parseModuleDefinition_(load, start);
        var specifiers = [this.parseModuleSpecifier_(load)];
        while (this.eatIf_(COMMA)) {
          specifiers.push(this.parseModuleSpecifier_(load));
        }
        this.eatPossibleImplicitSemiColon_();
        return new ModuleDeclaration(this.getTreeLocation_(start), specifiers);
      },
      parseClassShared_: function(constr) {
        var start = this.getTreeStartLocation_();
        this.eat_(CLASS);
        var name = null;
        if (constr == ClassDeclaration || !this.peek_(EXTENDS) && !this.peek_(OPEN_CURLY)) {
          name = this.parseBindingIdentifier_();
        }
        var superClass = null;
        if (this.eatIf_(EXTENDS)) {
          superClass = this.parseAssignmentExpression();
        }
        this.eat_(OPEN_CURLY);
        var elements = this.parseClassElements_();
        this.eat_(CLOSE_CURLY);
        return new constr(this.getTreeLocation_(start), name, superClass, elements);
      },
      parseClassDeclaration_: function() {
        return this.parseClassShared_(ClassDeclaration);
      },
      parseClassExpression_: function() {
        return this.parseClassShared_(ClassExpression);
      },
      parseClassElements_: function() {
        var result = [];
        while (true) {
          var type = this.peekType_();
          if (type === SEMI_COLON) {
            this.nextToken_();
          } else if (this.peekMethodDefinition_(this.peekType_())) {
            result.push(this.parseMethodDefinition_());
          } else {
            break;
          }
        }
        return result;
      },
      peekMethodDefinition_: function(type) {
        return this.peekPropertyName_(type) || type === STAR && options.generators;
      },
      parseMethodDefinition_: function() {
        return this.parsePropertyDefinitionShared_(false);
      },
      parsePropertyName_: function() {
        return this.nextToken_();
      },
      parseStatement: function() {
        return this.parseStatement_(this.peekType_(), false, false);
      },
      parseStatement_: function(type, allowProgramElement, load) {
        switch (type) {
          case RETURN:
            return this.parseReturnStatement_();
          case CONST:
          case LET:
            if (!options.blockBinding) break;
          case VAR:
            return this.parseVariableStatement_();
          case IDENTIFIER:
            if (allowProgramElement && options.modules && this.peekModuleDeclaration_(type)) {
              return this.parseModuleDeclaration_(load);
            }
            break;
          case IF:
            return this.parseIfStatement_();
          case FOR:
            return this.parseForStatement_();
          case BREAK:
            return this.parseBreakStatement_();
          case SWITCH:
            return this.parseSwitchStatement_();
          case THROW:
            return this.parseThrowStatement_();
          case WHILE:
            return this.parseWhileStatement_();
          case FUNCTION:
            return this.parseFunctionDeclaration_();
          case AWAIT:
            if (options.deferredFunctions) return this.parseAwaitStatement_();
            break;
          case CLASS:
            if (options.classes) return this.parseClassDeclaration_();
            break;
          case CONTINUE:
            return this.parseContinueStatement_();
          case DEBUGGER:
            return this.parseDebuggerStatement_();
          case DO:
            return this.parseDoWhileStatement_();
          case EXPORT:
            if (allowProgramElement && options.modules) return this.parseExportDeclaration_(load);
            break;
          case IMPORT:
            if (allowProgramElement && options.modules) return this.parseImportDeclaration_(load);
            break;
          case OPEN_CURLY:
            return this.parseBlock_();
          case PRIVATE:
            if (options.privateNameSyntax) return this.parseNameStatement_();
            break;
          case SEMI_COLON:
            return this.parseEmptyStatement_();
          case TRY:
            return this.parseTryStatement_();
          case WITH:
            return this.parseWithStatement_();
        }
        return this.parseExpressionStatement_();
      },
      peekStatement_: function(type, allowProgramElement) {
        switch (type) {
          case RETURN:
          case THIS:
          case VAR:
          case IDENTIFIER:
          case IF:
          case FOR:
          case BREAK:
          case SWITCH:
          case THROW:
          case WHILE:
          case FUNCTION:
          case BANG:
          case CONTINUE:
          case DEBUGGER:
          case DELETE:
          case DO:
          case FALSE:
          case MINUS:
          case MINUS_MINUS:
          case NEW:
          case NULL:
          case NUMBER:
          case OPEN_CURLY:
          case OPEN_PAREN:
          case OPEN_SQUARE:
          case PLUS:
          case PLUS_PLUS:
          case SEMI_COLON:
          case SLASH:
          case SLASH_EQUAL:
          case STRING:
          case TILDE:
          case TRUE:
          case TRY:
          case TYPEOF:
          case VOID:
          case WITH:
            return true;
          case CLASS:
          case SUPER:
            return options.classes;
          case CONST:
          case LET:
            return options.blockBinding;
          case AT_NAME:
          case PRIVATE:
            return options.privateNameSyntax;
          case YIELD:
            return options.generators;
          case AWAIT:
            return options.deferredFunctions;
          case TEMPLATE_HEAD:
          case NO_SUBSTITUTION_TEMPLATE:
            return options.templateLiterals;
          case IMPORT:
          case EXPORT:
            return allowProgramElement && options.modules;
        }
        return false;
      },
      parseFunctionDeclaration_: function() {
        var start = this.getTreeStartLocation_();
        this.nextToken_();
        var isGenerator = this.eatIf_(STAR);
        return this.parseFunctionDeclarationTail_(start, isGenerator, this.parseBindingIdentifier_());
      },
      parseFunctionDeclarationTail_: function(start, isGenerator, name) {
        this.eat_(OPEN_PAREN);
        var formalParameterList = this.parseFormalParameterList_();
        this.eat_(CLOSE_PAREN);
        var functionBody = this.parseFunctionBody_(isGenerator);
        return new FunctionDeclaration(this.getTreeLocation_(start), name, isGenerator, formalParameterList, functionBody);
      },
      parseFunctionExpression_: function() {
        var start = this.getTreeStartLocation_();
        this.nextToken_();
        var isGenerator = this.eatIf_(STAR);
        var name = null;
        if (this.peekBindingIdentifier_(this.peekType_())) {
          name = this.parseBindingIdentifier_();
        }
        this.eat_(OPEN_PAREN);
        var formalParameterList = this.parseFormalParameterList_();
        this.eat_(CLOSE_PAREN);
        var functionBody = this.parseFunctionBody_(isGenerator);
        return new FunctionExpression(this.getTreeLocation_(start), name, isGenerator, formalParameterList, functionBody);
      },
      parseFormalParameterList_: function() {
        var start = this.getTreeStartLocation_();
        var formals = [];
        var type = this.peekType_();
        if (this.peekRest_(type)) {
          formals.push(this.parseRestParameter_());
        } else {
          if (this.peekFormalParameter_(this.peekType_())) formals.push(this.parseFormalParameter_());
          while (this.eatIf_(COMMA)) {
            if (this.peekRest_(this.peekType_())) {
              formals.push(this.parseRestParameter_());
              break;
            }
            formals.push(this.parseFormalParameter_());
          }
        }
        return new FormalParameterList(this.getTreeLocation_(start), formals);
      },
      peekFormalParameter_: function(type) {
        return this.peekBindingElement_(type);
      },
      parseFormalParameter_: function(opt_initializerAllowed) {
        return this.parseBindingElement_(opt_initializerAllowed);
      },
      parseRestParameter_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(DOT_DOT_DOT);
        var id = this.parseBindingIdentifier_();
        return new RestParameter(this.getTreeLocation_(start), id);
      },
      parseFunctionBody_: function(isGenerator) {
        var start = this.getTreeStartLocation_();
        this.eat_(OPEN_CURLY);
        var allowYield = this.allowYield_;
        this.allowYield_ = isGenerator;
        var result = this.parseStatementList_();
        this.allowYield_ = allowYield;
        this.eat_(CLOSE_CURLY);
        return new Block(this.getTreeLocation_(start), result);
      },
      parseStatementList_: function() {
        var result = [];
        var type;
        while (this.peekStatement_(type = this.peekType_(), false)) {
          result.push(this.parseStatement_(type, false, false));
        }
        return result;
      },
      parseSpreadExpression_: function() {
        if (!options.spread) {
          return this.parseMissingPrimaryExpression_();
        }
        var start = this.getTreeStartLocation_();
        this.eat_(DOT_DOT_DOT);
        var operand = this.parseAssignmentExpression();
        return new SpreadExpression(this.getTreeLocation_(start), operand);
      },
      parseBlock_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(OPEN_CURLY);
        var result = this.parseStatementList_();
        this.eat_(CLOSE_CURLY);
        return new Block(this.getTreeLocation_(start), result);
      },
      parseVariableStatement_: function() {
        var start = this.getTreeStartLocation_();
        var declarations = this.parseVariableDeclarationList_();
        this.checkInitializers_(declarations);
        this.eatPossibleImplicitSemiColon_();
        return new VariableStatement(this.getTreeLocation_(start), declarations);
      },
      parseVariableDeclarationList_: function(opt_expressionIn, opt_initializer) {
        var expressionIn = opt_expressionIn || Expression.NORMAL;
        var initializer = opt_initializer || DestructuringInitializer.REQUIRED;
        var type = this.peekType_();
        switch (type) {
          case CONST:
          case LET:
            if (!options.blockBinding) debugger;
          case VAR:
            this.nextToken_();
            break;
          default:
            throw Error('unreachable');
        }
        var start = this.getTreeStartLocation_();
        var declarations = [];
        declarations.push(this.parseVariableDeclaration_(type, expressionIn, initializer));
        while (this.eatIf_(COMMA)) {
          declarations.push(this.parseVariableDeclaration_(type, expressionIn, initializer));
        }
        return new VariableDeclarationList(this.getTreeLocation_(start), type, declarations);
      },
      parseVariableDeclaration_: function(binding, expressionIn, opt_initializer) {
        var initRequired = opt_initializer !== DestructuringInitializer.OPTIONAL;
        var start = this.getTreeStartLocation_();
        var lvalue;
        var typeAnnotation;
        if (this.peekPattern_(this.peekType_())) {
          lvalue = this.parseBindingPattern_();
          typeAnnotation = null;
        } else {
          lvalue = this.parseBindingIdentifier_();
          typeAnnotation = this.parseTypeAnnotationOpt_();
        }
        var initializer = null;
        if (this.peek_(EQUAL)) initializer = this.parseInitializer_(expressionIn); else if (lvalue.isPattern() && initRequired) this.reportError_('destructuring must have an initializer');
        return new VariableDeclaration(this.getTreeLocation_(start), lvalue, typeAnnotation, initializer);
      },
      parseInitializer_: function(expressionIn) {
        this.eat_(EQUAL);
        return this.parseAssignmentExpression(expressionIn);
      },
      parseNameStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(PRIVATE);
        var declarations = [];
        declarations.push(this.parseAtNameDeclaration_());
        while (this.eatIf_(COMMA)) {
          declarations.push(this.parseAtNameDeclaration_());
        }
        this.eatPossibleImplicitSemiColon_();
        return new NameStatement(this.getTreeLocation_(start), declarations);
      },
      parseAtNameDeclaration_: function() {
        var start = this.getTreeStartLocation_();
        var atName = this.eat_(AT_NAME);
        var initializer = null;
        if (this.peek_(EQUAL)) initializer = this.parseInitializer_(Expression.IN);
        return new AtNameDeclaration(this.getTreeLocation_(start), atName, initializer);
      },
      parseEmptyStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(SEMI_COLON);
        return new EmptyStatement(this.getTreeLocation_(start));
      },
      parseExpressionStatement_: function() {
        var start = this.getTreeStartLocation_();
        var expression = this.parseExpression();
        if (expression.type === IDENTIFIER_EXPRESSION && this.eatIf_(COLON)) {
          var name = expression.identifierToken;
          var statement = this.parseStatement();
          return new LabelledStatement(this.getTreeLocation_(start), name, statement);
        }
        this.eatPossibleImplicitSemiColon_();
        return new ExpressionStatement(this.getTreeLocation_(start), expression);
      },
      parseIfStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(IF);
        this.eat_(OPEN_PAREN);
        var condition = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        var ifClause = this.parseStatement();
        var elseClause = null;
        if (this.eatIf_(ELSE)) {
          elseClause = this.parseStatement();
        }
        return new IfStatement(this.getTreeLocation_(start), condition, ifClause, elseClause);
      },
      parseDoWhileStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(DO);
        var body = this.parseStatement();
        this.eat_(WHILE);
        this.eat_(OPEN_PAREN);
        var condition = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        this.eatPossibleImplicitSemiColon_();
        return new DoWhileStatement(this.getTreeLocation_(start), body, condition);
      },
      parseWhileStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(WHILE);
        this.eat_(OPEN_PAREN);
        var condition = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        var body = this.parseStatement();
        return new WhileStatement(this.getTreeLocation_(start), condition, body);
      },
      parseForStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(FOR);
        this.eat_(OPEN_PAREN);
        var validate = (function(variables, kind) {
          if (variables.declarations.length > 1) {
            this.reportError_(kind + ' statement may not have more than one variable declaration');
          }
          var declaration = variables.declarations[0];
          if (declaration.lvalue.isPattern() && declaration.initializer) {
            this.reportError_(declaration.initializer.location, ("initializer is not allowed in " + kind + " loop with pattern"));
          }
        }).bind(this);
        var type = this.peekType_();
        if (this.peekVariableDeclarationList_(type)) {
          var variables = this.parseVariableDeclarationList_(Expression.NO_IN, DestructuringInitializer.OPTIONAL);
          type = this.peekType_();
          if (type === IN) {
            validate(variables, 'for-in');
            var declaration = variables.declarations[0];
            if (options.blockBinding && (variables.declarationType == LET || variables.declarationType == CONST)) {
              if (declaration.initializer != null) {
                this.reportError_('let/const in for-in statement may not have initializer');
              }
            }
            return this.parseForInStatement_(start, variables);
          } else if (this.peekOf_(type)) {
            validate(variables, 'for-of');
            var declaration = variables.declarations[0];
            if (declaration.initializer != null) {
              this.reportError_('for-of statement may not have initializer');
            }
            return this.parseForOfStatement_(start, variables);
          } else {
            this.checkInitializers_(variables);
            return this.parseForStatement2_(start, variables);
          }
        }
        if (type === SEMI_COLON) {
          return this.parseForStatement2_(start, null);
        }
        var initializer = this.parseExpression(Expression.NO_IN);
        type = this.peekType_();
        if (initializer.isLeftHandSideExpression() && (type === IN || this.peekOf_(type))) {
          initializer = this.transformLeftHandSideExpression_(initializer);
          if (this.peekOf_(type)) return this.parseForOfStatement_(start, initializer);
          return this.parseForInStatement_(start, initializer);
        }
        return this.parseForStatement2_(start, initializer);
      },
      peekOf_: function(type) {
        return type === IDENTIFIER && options.forOf && this.peekToken_().value === OF;
      },
      parseForOfStatement_: function(start, initializer) {
        this.eatId_();
        var collection = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        var body = this.parseStatement();
        return new ForOfStatement(this.getTreeLocation_(start), initializer, collection, body);
      },
      checkInitializers_: function(variables) {
        if (options.blockBinding && variables.declarationType == CONST) {
          var type = variables.declarationType;
          for (var i = 0; i < variables.declarations.length; i++) {
            if (!this.checkInitializer_(type, variables.declarations[i])) {
              break;
            }
          }
        }
      },
      checkInitializer_: function(type, declaration) {
        if (options.blockBinding && type == CONST && declaration.initializer == null) {
          this.reportError_('const variables must have an initializer');
          return false;
        }
        return true;
      },
      peekVariableDeclarationList_: function(type) {
        switch (type) {
          case VAR:
            return true;
          case CONST:
          case LET:
            return options.blockBinding;
          default:
            return false;
        }
      },
      parseForStatement2_: function(start, initializer) {
        this.eat_(SEMI_COLON);
        var condition = null;
        if (!this.peek_(SEMI_COLON)) {
          condition = this.parseExpression();
        }
        this.eat_(SEMI_COLON);
        var increment = null;
        if (!this.peek_(CLOSE_PAREN)) {
          increment = this.parseExpression();
        }
        this.eat_(CLOSE_PAREN);
        var body = this.parseStatement();
        return new ForStatement(this.getTreeLocation_(start), initializer, condition, increment, body);
      },
      parseForInStatement_: function(start, initializer) {
        this.eat_(IN);
        var collection = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        var body = this.parseStatement();
        return new ForInStatement(this.getTreeLocation_(start), initializer, collection, body);
      },
      parseContinueStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(CONTINUE);
        var name = null;
        if (!this.peekImplicitSemiColon_(this.peekType_())) {
          name = this.eatIdOpt_();
        }
        this.eatPossibleImplicitSemiColon_();
        return new ContinueStatement(this.getTreeLocation_(start), name);
      },
      parseBreakStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(BREAK);
        var name = null;
        if (!this.peekImplicitSemiColon_(this.peekType_())) {
          name = this.eatIdOpt_();
        }
        this.eatPossibleImplicitSemiColon_();
        return new BreakStatement(this.getTreeLocation_(start), name);
      },
      parseReturnStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(RETURN);
        var expression = null;
        if (!this.peekImplicitSemiColon_(this.peekType_())) {
          expression = this.parseExpression();
        }
        this.eatPossibleImplicitSemiColon_();
        return new ReturnStatement(this.getTreeLocation_(start), expression);
      },
      parseYieldExpression_: function() {
        if (!this.allowYield_) {
          return this.parseMissingPrimaryExpression_("'yield' expressions are only allowed inside 'function*'");
        }
        var start = this.getTreeStartLocation_();
        this.eat_(YIELD);
        var expression = null;
        var isYieldFor = this.eatIf_(STAR);
        if (isYieldFor || !this.peekImplicitSemiColon_(this.peekType_())) {
          expression = this.parseAssignmentExpression();
        }
        return new YieldExpression(this.getTreeLocation_(start), expression, isYieldFor);
      },
      parseAwaitStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(AWAIT);
        var identifier = null;
        if (this.peek_(IDENTIFIER) && this.peek_(EQUAL, 1)) {
          identifier = this.eatId_();
          this.eat_(EQUAL);
        }
        var expression = this.parseExpression();
        this.eatPossibleImplicitSemiColon_();
        return new AwaitStatement(this.getTreeLocation_(start), identifier, expression);
      },
      parseWithStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(WITH);
        this.eat_(OPEN_PAREN);
        var expression = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        var body = this.parseStatement();
        return new WithStatement(this.getTreeLocation_(start), expression, body);
      },
      parseSwitchStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(SWITCH);
        this.eat_(OPEN_PAREN);
        var expression = this.parseExpression();
        this.eat_(CLOSE_PAREN);
        this.eat_(OPEN_CURLY);
        var caseClauses = this.parseCaseClauses_();
        this.eat_(CLOSE_CURLY);
        return new SwitchStatement(this.getTreeLocation_(start), expression, caseClauses);
      },
      parseCaseClauses_: function() {
        var foundDefaultClause = false;
        var result = [];
        while (true) {
          var start = this.getTreeStartLocation_();
          switch (this.peekType_()) {
            case CASE:
              this.nextToken_();
              var expression = this.parseExpression();
              this.eat_(COLON);
              var statements = this.parseCaseStatementsOpt_();
              result.push(new CaseClause(this.getTreeLocation_(start), expression, statements));
              break;
            case DEFAULT:
              if (foundDefaultClause) {
                this.reportError_('Switch statements may have at most one default clause');
              } else {
                foundDefaultClause = true;
              }
              this.nextToken_();
              this.eat_(COLON);
              result.push(new DefaultClause(this.getTreeLocation_(start), this.parseCaseStatementsOpt_()));
              break;
            default:
              return result;
          }
        }
      },
      parseCaseStatementsOpt_: function() {
        return this.parseStatementList_();
      },
      parseThrowStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(THROW);
        var value = null;
        if (!this.peekImplicitSemiColon_(this.peekType_())) {
          value = this.parseExpression();
        }
        this.eatPossibleImplicitSemiColon_();
        return new ThrowStatement(this.getTreeLocation_(start), value);
      },
      parseTryStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(TRY);
        var body = this.parseBlock_();
        var catchBlock = null;
        if (this.peek_(CATCH)) {
          catchBlock = this.parseCatch_();
        }
        var finallyBlock = null;
        if (this.peek_(FINALLY)) {
          finallyBlock = this.parseFinallyBlock_();
        }
        if (catchBlock == null && finallyBlock == null) {
          this.reportError_("'catch' or 'finally' expected.");
        }
        return new TryStatement(this.getTreeLocation_(start), body, catchBlock, finallyBlock);
      },
      parseCatch_: function() {
        var start = this.getTreeStartLocation_();
        var catchBlock;
        this.eat_(CATCH);
        this.eat_(OPEN_PAREN);
        var binding;
        if (this.peekPattern_(this.peekType_())) binding = this.parseBindingPattern_(); else binding = this.parseBindingIdentifier_();
        this.eat_(CLOSE_PAREN);
        var catchBody = this.parseBlock_();
        catchBlock = new Catch(this.getTreeLocation_(start), binding, catchBody);
        return catchBlock;
      },
      parseFinallyBlock_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(FINALLY);
        var finallyBlock = this.parseBlock_();
        return new Finally(this.getTreeLocation_(start), finallyBlock);
      },
      parseDebuggerStatement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(DEBUGGER);
        this.eatPossibleImplicitSemiColon_();
        return new DebuggerStatement(this.getTreeLocation_(start));
      },
      parsePrimaryExpression_: function() {
        switch (this.peekType_()) {
          case CLASS:
            return options.classes ? this.parseClassExpression_(): this.parseMissingPrimaryExpression_();
          case SUPER:
            return this.parseSuperExpression_();
          case THIS:
            return this.parseThisExpression_();
          case IDENTIFIER:
            return this.parseIdentifierExpression_();
          case NUMBER:
          case STRING:
          case TRUE:
          case FALSE:
          case NULL:
            return this.parseLiteralExpression_();
          case OPEN_SQUARE:
            return this.parseArrayLiteral_();
          case OPEN_CURLY:
            return this.parseObjectLiteral_();
          case OPEN_PAREN:
            return this.parseParenExpression_();
          case SLASH:
          case SLASH_EQUAL:
            return this.parseRegularExpressionLiteral_();
          case NO_SUBSTITUTION_TEMPLATE:
          case TEMPLATE_HEAD:
            return this.parseTemplateLiteral_(null);
          case AT_NAME:
            return this.parseAtNameExpression_();
          default:
            return this.parseMissingPrimaryExpression_();
        }
      },
      parseSuperExpression_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(SUPER);
        return new SuperExpression(this.getTreeLocation_(start));
      },
      parseThisExpression_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(THIS);
        return new ThisExpression(this.getTreeLocation_(start));
      },
      peekBindingIdentifier_: function(type) {
        return this.peekId_(type);
      },
      parseBindingIdentifier_: function() {
        var start = this.getTreeStartLocation_();
        var identifier = this.eatId_();
        return new BindingIdentifier(this.getTreeLocation_(start), identifier);
      },
      parseIdentifierExpression_: function() {
        var start = this.getTreeStartLocation_();
        var identifier = this.eatId_();
        return new IdentifierExpression(this.getTreeLocation_(start), identifier);
      },
      parseIdentifierNameExpression_: function() {
        var start = this.getTreeStartLocation_();
        var identifier = this.eatIdName_();
        return new IdentifierExpression(this.getTreeLocation_(start), identifier);
      },
      parseAtNameExpression_: function() {
        var start = this.getTreeStartLocation_();
        var atName = this.eat_(AT_NAME);
        return new AtNameExpression(this.getTreeLocation_(start), atName);
      },
      parseLiteralExpression_: function() {
        var start = this.getTreeStartLocation_();
        var literal = this.nextLiteralToken_();
        return new LiteralExpression(this.getTreeLocation_(start), literal);
      },
      nextLiteralToken_: function() {
        return this.nextToken_();
      },
      parseRegularExpressionLiteral_: function() {
        var start = this.getTreeStartLocation_();
        var literal = this.nextRegularExpressionLiteralToken_();
        return new LiteralExpression(this.getTreeLocation_(start), literal);
      },
      peekSpread_: function(type) {
        return type === DOT_DOT_DOT && options.spread;
      },
      parseArrayLiteral_: function() {
        var start = this.getTreeStartLocation_();
        var expression;
        var elements = [];
        var allowFor = options.arrayComprehension;
        this.eat_(OPEN_SQUARE);
        while (true) {
          var type = this.peekType_();
          if (type === COMMA) {
            expression = null;
            allowFor = false;
          } else if (this.peekSpread_(type)) {
            expression = this.parseSpreadExpression_();
          } else if (this.peekAssignmentExpression_(type)) {
            expression = this.parseAssignmentExpression();
          } else {
            break;
          }
          type = this.peekType_();
          if (allowFor && type === FOR) return this.parseArrayComprehension_(start, expression);
          allowFor = false;
          elements.push(expression);
          if (type !== CLOSE_SQUARE) {
            this.eat_(COMMA);
          }
        }
        this.eat_(CLOSE_SQUARE);
        return new ArrayLiteralExpression(this.getTreeLocation_(start), elements);
      },
      parseArrayComprehension_: function(start, expression) {
        var comprehensionForList = this.parseComprehensionForList_();
        var ifExpression = this.parseComprehensionIf_();
        this.eat_(CLOSE_SQUARE);
        return new ArrayComprehension(this.getTreeLocation_(start), expression, comprehensionForList, ifExpression);
      },
      parseObjectLiteral_: function() {
        var start = this.getTreeStartLocation_();
        var result = [];
        this.eat_(OPEN_CURLY);
        while (this.peekPropertyDefinition_(this.peekType_())) {
          var propertyDefinition = this.parsePropertyDefinition();
          if (!propertyDefinition) return null;
          result.push(propertyDefinition);
          if (propertyDefinition.type === PROPERTY_NAME_ASSIGNMENT) {
            if (!this.eatIf_(COMMA)) break;
          } else if (!this.eatPropertyOptionalComma_()) {
            break;
          }
        }
        this.eat_(CLOSE_CURLY);
        return new ObjectLiteralExpression(this.getTreeLocation_(start), result);
      },
      eatPropertyOptionalComma_: function() {
        return this.eatIf_(COMMA) || options.propertyOptionalComma;
      },
      parsePropertyDefinition: function() {
        return this.parsePropertyDefinitionShared_(true);
      },
      parsePropertyDefinitionShared_: function(inObjectLiteral) {
        var start = this.getTreeStartLocation_();
        var isGenerator = false;
        if (options.generators && options.propertyMethods && this.eatIf_(STAR)) {
          isGenerator = true;
        }
        var name = this.parsePropertyName_();
        if (isGenerator || options.propertyMethods && this.peek_(OPEN_PAREN)) {
          this.eat_(OPEN_PAREN);
          var formalParameterList = this.parseFormalParameterList_();
          this.eat_(CLOSE_PAREN);
          var functionBody = this.parseFunctionBody_(isGenerator);
          return new PropertyMethodAssignment(this.getTreeLocation_(start), name, isGenerator, formalParameterList, functionBody);
        }
        if (inObjectLiteral && this.eatIf_(COLON)) {
          var value = this.parseAssignmentExpression();
          return new PropertyNameAssignment(this.getTreeLocation_(start), name, value);
        }
        var type = this.peekType_();
        if (name.type === IDENTIFIER && name.value === GET && this.peekPropertyName_(type)) {
          name = this.parsePropertyName_();
          this.eat_(OPEN_PAREN);
          this.eat_(CLOSE_PAREN);
          var body = this.parseFunctionBody_(false);
          return new GetAccessor(this.getTreeLocation_(start), name, body);
        }
        if (name.type === IDENTIFIER && name.value === SET && this.peekPropertyName_(type)) {
          name = this.parsePropertyName_();
          this.eat_(OPEN_PAREN);
          var parameter = this.parsePropertySetParameterList_();
          this.eat_(CLOSE_PAREN);
          var body = this.parseFunctionBody_(false);
          return new SetAccessor(this.getTreeLocation_(start), name, parameter, body);
        }
        if (inObjectLiteral && options.propertyNameShorthand) return new PropertyNameShorthand(this.getTreeLocation_(start), name);
        this.reportError_(name, 'Unexpected token');
        return null;
      },
      peekPropertyDefinition_: function(type) {
        return this.peekPropertyName_(type) || type == STAR && options.propertyMethods && options.generators;
      },
      peekPropertyName_: function(type) {
        switch (type) {
          case AT_NAME:
            return options.privateNameSyntax;
          case IDENTIFIER:
          case STRING:
          case NUMBER:
            return true;
          default:
            return this.peekToken_().isKeyword();
        }
      },
      peekPredefinedString_: function(string) {
        var token = this.peekToken_();
        return token.type === IDENTIFIER && token.value === string;
      },
      parsePropertySetParameterList_: function() {
        var start = this.getTreeStartLocation_();
        var binding;
        if (this.peekPattern_(this.peekType_())) binding = this.parseBindingPattern_(); else binding = this.parseBindingIdentifier_();
        return new BindingElement(this.getTreeLocation_(start), binding, null);
      },
      parseParenExpression_: function() {
        return this.parseArrowFunction_();
      },
      parseMissingPrimaryExpression_: function(opt_message) {
        var start = this.getTreeStartLocation_();
        this.reportError_(opt_message || 'primary expression expected');
        var token = this.nextToken_();
        return new MissingPrimaryExpression(this.getTreeLocation_(start), token);
      },
      peekExpression_: function(type) {
        switch (type) {
          case NO_SUBSTITUTION_TEMPLATE:
          case TEMPLATE_HEAD:
            return options.templateLiterals;
          case AT_NAME:
            return options.privateNameSyntax;
          case BANG:
          case CLASS:
          case DELETE:
          case FALSE:
          case FUNCTION:
          case IDENTIFIER:
          case MINUS:
          case MINUS_MINUS:
          case NEW:
          case NULL:
          case NUMBER:
          case OPEN_CURLY:
          case OPEN_PAREN:
          case OPEN_SQUARE:
          case PLUS:
          case PLUS_PLUS:
          case SLASH:
          case SLASH_EQUAL:
          case STRING:
          case SUPER:
          case THIS:
          case TILDE:
          case TRUE:
          case TYPEOF:
          case VOID:
          case YIELD:
            return true;
          default:
            return false;
        }
      },
      parseExpression: function(opt_expressionIn) {
        var expressionIn = opt_expressionIn || Expression.IN;
        var start = this.getTreeStartLocation_();
        var result = this.parseAssignmentExpression(expressionIn);
        if (this.peek_(COMMA)) {
          var exprs = [result];
          while (this.eatIf_(COMMA)) {
            exprs.push(this.parseAssignmentExpression(expressionIn));
          }
          return new CommaExpression(this.getTreeLocation_(start), exprs);
        }
        return result;
      },
      parseExpressionForCoverFormals_: function(opt_expressionIn) {
        var expressionIn = opt_expressionIn || Expression.IN;
        var start = this.getTreeStartLocation_();
        var exprs = [this.parseAssignmentExpression(expressionIn)];
        if (this.peek_(COMMA)) {
          while (this.eatIf_(COMMA)) {
            if (this.peekRest_(this.peekType_())) {
              exprs.push(this.parseRestParameter_());
              break;
            }
            exprs.push(this.parseAssignmentExpression(expressionIn));
          }
        }
        return new CoverFormals(this.getTreeLocation_(start), exprs);
      },
      peekAssignmentExpression_: function(type) {
        return this.peekExpression_(type);
      },
      parseAssignmentExpression: function(opt_expressionIn) {
        if (this.allowYield_ && this.peek_(YIELD)) return this.parseYieldExpression_();
        var expressionIn = opt_expressionIn || Expression.NORMAL;
        var start = this.getTreeStartLocation_();
        var left = this.parseConditional_(expressionIn);
        var type = this.peekType_();
        if (this.peekAssignmentOperator_(type)) {
          if (type === EQUAL) left = this.transformLeftHandSideExpression_(left);
          if (!left.isLeftHandSideExpression() && !left.isPattern()) {
            this.reportError_('Left hand side of assignment must be new, call, member, function, primary expressions or destructuring pattern');
          }
          var operator = this.nextToken_();
          var right = this.parseAssignmentExpression(expressionIn);
          return new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        if (left && left.type === IDENTIFIER_EXPRESSION && this.peekArrow_(type)) {
          this.nextToken_();
          var id = new BindingIdentifier(left.location, left.identifierToken);
          var formals = [new BindingElement(id.location, id, null)];
          var body = this.parseConciseBody_();
          var startLoc = left.location;
          return new ArrowFunctionExpression(startLoc, new FormalParameterList(startLoc, formals), body);
        }
        return left;
      },
      transformLeftHandSideExpression_: function(tree) {
        switch (tree.type) {
          case ARRAY_LITERAL_EXPRESSION:
          case OBJECT_LITERAL_EXPRESSION:
            var transformer = new AssignmentPatternTransformer();
            var transformedTree;
            try {
              transformedTree = transformer.transformAny(tree);
            } catch (ex) {
              if (!(ex instanceof AssignmentPatternTransformerError)) throw ex;
            }
            if (transformedTree) return transformedTree;
            break;
          case PAREN_EXPRESSION:
            var expression = this.transformLeftHandSideExpression_(tree.expression);
            if (expression !== tree.expression) return new ParenExpression(tree.location, expression);
        }
        return tree;
      },
      peekAssignmentOperator_: function(type) {
        return isAssignmentOperator(type);
      },
      parseConditional_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var condition = this.parseLogicalOR_(expressionIn);
        if (this.eatIf_(QUESTION)) {
          var left = this.parseAssignmentExpression();
          this.eat_(COLON);
          var right = this.parseAssignmentExpression(expressionIn);
          return new ConditionalExpression(this.getTreeLocation_(start), condition, left, right);
        }
        return condition;
      },
      parseLogicalOR_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseLogicalAND_(expressionIn);
        var operator;
        while (operator = this.eatOpt_(OR)) {
          var right = this.parseLogicalAND_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      parseLogicalAND_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseBitwiseOR_(expressionIn);
        var operator;
        while (operator = this.eatOpt_(AND)) {
          var right = this.parseBitwiseOR_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      parseBitwiseOR_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseBitwiseXOR_(expressionIn);
        var operator;
        while (operator = this.eatOpt_(BAR)) {
          var right = this.parseBitwiseXOR_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      parseBitwiseXOR_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseBitwiseAND_(expressionIn);
        var operator;
        while (operator = this.eatOpt_(CARET)) {
          var right = this.parseBitwiseAND_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      parseBitwiseAND_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseEquality_(expressionIn);
        var operator;
        while (operator = this.eatOpt_(AMPERSAND)) {
          var right = this.parseEquality_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      parseEquality_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseRelational_(expressionIn);
        while (this.peekEqualityOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          var right = this.parseRelational_(expressionIn);
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      peekEqualityOperator_: function(type) {
        switch (type) {
          case EQUAL_EQUAL:
          case NOT_EQUAL:
          case EQUAL_EQUAL_EQUAL:
          case NOT_EQUAL_EQUAL:
            return true;
          case IDENTIFIER:
            if (!options.isExpression) return false;
            var token = this.peekToken_();
            if (!this.peekIsOrIsnt_(token)) return false;
            token = this.peekTokenNoLineTerminator_();
            return token && this.peekIsOrIsnt_(token);
        }
      },
      peekIsOrIsnt_: function(token) {
        return token.type === IDENTIFIER && (token.value === IS || token.value === ISNT);
      },
      parseRelational_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var left = this.parseShiftExpression_();
        while (this.peekRelationalOperator_(expressionIn)) {
          var operator = this.nextToken_();
          var right = this.parseShiftExpression_();
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      peekRelationalOperator_: function(expressionIn) {
        switch (this.peekType_()) {
          case OPEN_ANGLE:
          case CLOSE_ANGLE:
          case GREATER_EQUAL:
          case LESS_EQUAL:
          case INSTANCEOF:
            return true;
          case IN:
            return expressionIn == Expression.NORMAL;
          default:
            return false;
        }
      },
      parseShiftExpression_: function() {
        var start = this.getTreeStartLocation_();
        var left = this.parseAdditiveExpression_();
        while (this.peekShiftOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          var right = this.parseAdditiveExpression_();
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      peekShiftOperator_: function(type) {
        switch (type) {
          case LEFT_SHIFT:
          case RIGHT_SHIFT:
          case UNSIGNED_RIGHT_SHIFT:
            return true;
          default:
            return false;
        }
      },
      parseAdditiveExpression_: function() {
        var start = this.getTreeStartLocation_();
        var left = this.parseMultiplicativeExpression_();
        while (this.peekAdditiveOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          var right = this.parseMultiplicativeExpression_();
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      peekAdditiveOperator_: function(type) {
        switch (type) {
          case PLUS:
          case MINUS:
            return true;
          default:
            return false;
        }
      },
      parseMultiplicativeExpression_: function() {
        var start = this.getTreeStartLocation_();
        var left = this.parseUnaryExpression_();
        while (this.peekMultiplicativeOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          var right = this.parseUnaryExpression_();
          left = new BinaryOperator(this.getTreeLocation_(start), left, operator, right);
        }
        return left;
      },
      peekMultiplicativeOperator_: function(type) {
        switch (type) {
          case STAR:
          case SLASH:
          case PERCENT:
            return true;
          default:
            return false;
        }
      },
      parseUnaryExpression_: function() {
        var start = this.getTreeStartLocation_();
        if (this.peekUnaryOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          var operand = this.parseUnaryExpression_();
          return new UnaryExpression(this.getTreeLocation_(start), operator, operand);
        }
        return this.parsePostfixExpression_();
      },
      peekUnaryOperator_: function(type) {
        switch (type) {
          case DELETE:
          case VOID:
          case TYPEOF:
          case PLUS_PLUS:
          case MINUS_MINUS:
          case PLUS:
          case MINUS:
          case TILDE:
          case BANG:
            return true;
          default:
            return false;
        }
      },
      parsePostfixExpression_: function() {
        var start = this.getTreeStartLocation_();
        var operand = this.parseLeftHandSideExpression_();
        while (this.peekPostfixOperator_(this.peekType_())) {
          var operator = this.nextToken_();
          operand = new PostfixExpression(this.getTreeLocation_(start), operand, operator);
        }
        return operand;
      },
      peekPostfixOperator_: function(type) {
        switch (type) {
          case PLUS_PLUS:
          case MINUS_MINUS:
            var token = this.peekTokenNoLineTerminator_();
            return token !== null;
        }
        return false;
      },
      parseLeftHandSideExpression_: function() {
        var start = this.getTreeStartLocation_();
        var operand = this.parseNewExpression_();
        if (!(operand instanceof NewExpression) || operand.args != null) {
          loop: while (true) {
            switch (this.peekType_()) {
              case OPEN_PAREN:
                var args = this.parseArguments_();
                operand = new CallExpression(this.getTreeLocation_(start), operand, args);
                break;
              case OPEN_SQUARE:
                this.nextToken_();
                var member = this.parseExpression();
                this.eat_(CLOSE_SQUARE);
                operand = new MemberLookupExpression(this.getTreeLocation_(start), operand, member);
                break;
              case PERIOD:
                this.nextToken_();
                var memberName = this.eatIdName_();
                operand = new MemberExpression(this.getTreeLocation_(start), operand, memberName);
                break;
              case PERIOD_OPEN_CURLY:
                if (!options.cascadeExpression) break loop;
                var expressions = this.parseCascadeExpressions_();
                operand = new CascadeExpression(this.getTreeLocation_(start), operand, expressions);
                break;
              case NO_SUBSTITUTION_TEMPLATE:
              case TEMPLATE_HEAD:
                if (!options.templateLiterals) break loop;
                operand = this.parseTemplateLiteral_(operand);
                break;
              default:
                break loop;
            }
          }
        }
        return operand;
      },
      parseMemberExpressionNoNew_: function() {
        var start = this.getTreeStartLocation_();
        var operand;
        if (this.peekType_() === FUNCTION) {
          operand = this.parseFunctionExpression_();
        } else {
          operand = this.parsePrimaryExpression_();
        }
        loop: while (true) {
          switch (this.peekType_()) {
            case OPEN_SQUARE:
              this.nextToken_();
              var member = this.parseExpression();
              this.eat_(CLOSE_SQUARE);
              operand = new MemberLookupExpression(this.getTreeLocation_(start), operand, member);
              break;
            case PERIOD:
              this.nextToken_();
              var name;
              if (options.privateNameSyntax && this.peek_(AT_NAME)) name = this.nextToken_(); else name = this.eatIdName_();
              operand = new MemberExpression(this.getTreeLocation_(start), operand, name);
              break;
            case PERIOD_OPEN_CURLY:
              if (!options.cascadeExpression) break loop;
              var expressions = this.parseCascadeExpressions_();
              operand = new CascadeExpression(this.getTreeLocation_(start), operand, expressions);
              break;
            case NO_SUBSTITUTION_TEMPLATE:
            case TEMPLATE_HEAD:
              if (!options.templateLiterals) break loop;
              operand = this.parseTemplateLiteral_(operand);
              break;
            default:
              break loop;
          }
        }
        return operand;
      },
      parseCascadeExpressions_: function() {
        this.eat_(PERIOD_OPEN_CURLY);
        var expressions = [];
        var type;
        while (this.peekId_(type = this.peekType_()) && this.peekAssignmentExpression_(type)) {
          expressions.push(this.parseCascadeExpression_());
          this.eatPossibleImplicitSemiColon_();
        }
        this.eat_(CLOSE_CURLY);
        return expressions;
      },
      parseCascadeExpression_: function() {
        var expr = this.parseAssignmentExpression();
        var operand;
        switch (expr.type) {
          case CALL_EXPRESSION:
          case MEMBER_EXPRESSION:
          case MEMBER_LOOKUP_EXPRESSION:
          case CASCADE_EXPRESSION:
            operand = expr.operand;
            break;
          case BINARY_OPERATOR:
            operand = expr.left;
            break;
          default:
            this.reportError_(expr.location, ("Invalid expression. Type: " + expr.type));
        }
        if (operand) {
          switch (operand.type) {
            case MEMBER_EXPRESSION:
            case MEMBER_LOOKUP_EXPRESSION:
            case CALL_EXPRESSION:
            case CASCADE_EXPRESSION:
            case IDENTIFIER_EXPRESSION:
              break;
            default:
              this.reportError_(operand.location, ("Invalid expression: " + operand.type));
          }
        }
        if (expr.type == BINARY_OPERATOR && !expr.operator.isAssignmentOperator()) {
          this.reportError_(expr.operator, ("Invalid operator: " + expr.operator));
        }
        return expr;
      },
      parseNewExpression_: function() {
        if (this.peek_(NEW)) {
          var start = this.getTreeStartLocation_();
          this.eat_(NEW);
          var operand = this.parseNewExpression_();
          var args = null;
          if (this.peek_(OPEN_PAREN)) {
            args = this.parseArguments_();
          }
          return new NewExpression(this.getTreeLocation_(start), operand, args);
        } else {
          return this.parseMemberExpressionNoNew_();
        }
      },
      parseArguments_: function() {
        var start = this.getTreeStartLocation_();
        var args = [];
        this.eat_(OPEN_PAREN);
        while (true) {
          var type = this.peekType_();
          if (this.peekRest_(type)) {
            args.push(this.parseSpreadExpression_());
          } else if (this.peekAssignmentExpression_(type)) {
            args.push(this.parseAssignmentExpression());
          } else {
            break;
          }
          if (!this.peek_(CLOSE_PAREN)) {
            this.eat_(COMMA);
          }
        }
        this.eat_(CLOSE_PAREN);
        return new ArgumentList(this.getTreeLocation_(start), args);
      },
      peekRest_: function(type) {
        return type === DOT_DOT_DOT && options.restParameters;
      },
      parseArrowFunction_: function(expressionIn) {
        var start = this.getTreeStartLocation_();
        var formals;
        this.eat_(OPEN_PAREN);
        var coverFormals = this.parseCoverFormals_();
        var expressions = coverFormals.expressions;
        if (expressions.length === 1 && options.generatorComprehension && this.peek_(FOR)) {
          return this.parseGeneratorComprehension_(start, expressions[0]);
        }
        this.eat_(CLOSE_PAREN);
        var mustBeArrow = expressions.length === 0 || expressions[expressions.length - 1].type === REST_PARAMETER;
        if (mustBeArrow || this.peekArrow_(this.peekType_())) {
          formals = this.transformCoverFormals_(coverFormals);
          if (!formals && mustBeArrow) {
            return this.parseMissingPrimaryExpression_('Unexpected token \'...\'');
          }
        }
        if (!formals) {
          var expression;
          if (expressions.length > 1) expression = new CommaExpression(coverFormals.location, expressions); else expression = expressions[0];
          return new ParenExpression(this.getTreeLocation_(start), expression);
        }
        this.eat_(ARROW);
        var body = this.parseConciseBody_();
        var startLoc = this.getTreeLocation_(start);
        return new ArrowFunctionExpression(startLoc, formals, body);
      },
      parseCoverFormals_: function() {
        var start = this.getTreeStartLocation_();
        var type = this.peekType_();
        if (type === CLOSE_PAREN) return new CoverFormals(this.getTreeLocation_(start), []);
        if (this.peekRest_(type)) {
          var parameter = this.parseRestParameter_();
          return new CoverFormals(this.getTreeLocation_(start), [parameter]);
        }
        return this.parseExpressionForCoverFormals_();
      },
      transformCoverFormals_: function(coverFormals) {
        var transformer = new CoverFormalsTransformer();
        var formals = null;
        try {
          formals = transformer.transformAny(coverFormals);
        } catch (ex) {
          if (!(ex instanceof CoverFormalsTransformerError)) throw ex;
        }
        return formals;
      },
      peekArrow_: function(type) {
        return type === ARROW && options.arrowFunctions;
      },
      parseConciseBody_: function() {
        if (this.peek_(OPEN_CURLY)) return this.parseBlock_();
        return this.parseAssignmentExpression();
      },
      parseGeneratorComprehension_: function(start, expression) {
        var comprehensionForList = this.parseComprehensionForList_();
        var ifExpression = this.parseComprehensionIf_();
        this.eat_(CLOSE_PAREN);
        return new GeneratorComprehension(this.getTreeLocation_(start), expression, comprehensionForList, ifExpression);
      },
      parseComprehensionForList_: function() {
        var comprehensionForList = [];
        while (this.eatIf_(FOR)) {
          var innerStart = this.getTreeStartLocation_();
          var left = this.parseForBinding_();
          this.eatId_(OF);
          var iterator = this.parseExpression();
          comprehensionForList.push(new ComprehensionFor(this.getTreeLocation_(innerStart), left, iterator));
        }
        return comprehensionForList;
      },
      parseComprehensionIf_: function() {
        if (this.eatIf_(IF)) {
          return this.parseExpression();
        }
        return null;
      },
      parseForBinding_: function() {
        if (this.peekPattern_(this.peekType_())) return this.parseBindingPattern_();
        return this.parseBindingIdentifier_();
      },
      peekPattern_: function(type) {
        return options.destructuring && (this.peekObjectPattern_(type) || this.peekArrayPattern_(type));
      },
      peekArrayPattern_: function(type) {
        return type === OPEN_SQUARE;
      },
      peekObjectPattern_: function(type) {
        return type === OPEN_CURLY;
      },
      parseBindingPattern_: function() {
        if (this.peekArrayPattern_(this.peekType_())) return this.parseArrayBindingPattern_();
        return this.parseObjectBindingPattern_();
      },
      parseArrayBindingPattern_: function() {
        var start = this.getTreeStartLocation_();
        var elements = [];
        this.eat_(OPEN_SQUARE);
        var type;
        while ((type = this.peekType_()) === COMMA || this.peekBindingElement_(type) || this.peekRest_(type)) {
          this.parseElisionOpt_(elements);
          if (this.peekRest_(this.peekType_())) {
            elements.push(this.parseBindingRestElement_());
            break;
          } else {
            elements.push(this.parseBindingElement_());
            if (this.peek_(COMMA) && !this.peek_(CLOSE_SQUARE, 1)) {
              this.nextToken_();
            }
          }
        }
        this.eat_(CLOSE_SQUARE);
        return new ArrayPattern(this.getTreeLocation_(start), elements);
      },
      parseBindingElementList_: function(elements) {
        this.parseElisionOpt_(elements);
        elements.push(this.parseBindingElement_());
        while (this.eatIf_(COMMA)) {
          this.parseElisionOpt_(elements);
          elements.push(this.parseBindingElement_());
        }
      },
      parseElisionOpt_: function(elements) {
        while (this.eatIf_(COMMA)) {
          elements.push(null);
        }
      },
      peekBindingElement_: function(type) {
        return this.peekBindingIdentifier_(type) || this.peekPattern_(type);
      },
      parseBindingElement_: function(opt_initializer) {
        var start = this.getTreeStartLocation_();
        var binding;
        if (this.peekPattern_(this.peekType_())) binding = this.parseBindingPattern_(); else binding = this.parseBindingIdentifier_();
        var initializer = null;
        if (this.peek_(EQUAL) || opt_initializer === Initializer.REQUIRED) {
          initializer = this.parseInitializer_();
        }
        return new BindingElement(this.getTreeLocation_(start), binding, initializer);
      },
      parseBindingRestElement_: function() {
        var start = this.getTreeStartLocation_();
        this.eat_(DOT_DOT_DOT);
        var identifier = this.parseBindingIdentifier_();
        return new SpreadPatternElement(this.getTreeLocation_(start), identifier);
      },
      parseObjectBindingPattern_: function() {
        var start = this.getTreeStartLocation_();
        var elements = [];
        this.eat_(OPEN_CURLY);
        while (this.peekBindingProperty_(this.peekType_())) {
          elements.push(this.parseBindingProperty_());
          if (!this.eatIf_(COMMA)) break;
        }
        this.eat_(CLOSE_CURLY);
        return new ObjectPattern(this.getTreeLocation_(start), elements);
      },
      peekBindingProperty_: function(type) {
        return this.peekBindingIdentifier_(type) || this.peekPropertyName_(type);
      },
      parseBindingProperty_: function() {
        var start = this.getTreeStartLocation_();
        if (this.peek_(COLON, 1)) {
          var name = this.nextToken_();
          this.eat_(COLON);
          var binding = this.parseBindingElement_();
          return new ObjectPatternField(this.getTreeLocation_(start), name, binding);
        }
        var binding = this.parseBindingIdentifier_();
        var initializer = null;
        if (this.peek_(EQUAL)) initializer = this.parseInitializer_();
        return new BindingElement(this.getTreeLocation_(start), binding, initializer);
      },
      parseTemplateLiteral_: function(operand) {
        if (!options.templateLiterals) {
          return this.parseMissingPrimaryExpression_();
        }
        var start = operand ? operand.location.start: this.getTreeStartLocation_();
        var token = this.nextToken_();
        var elements = [new TemplateLiteralPortion(token.location, token)];
        if (token.type === NO_SUBSTITUTION_TEMPLATE) {
          return new TemplateLiteralExpression(this.getTreeLocation_(start), operand, elements);
        }
        var expression = this.parseExpression();
        elements.push(new TemplateSubstitution(expression.location, expression));
        while (expression.type !== MISSING_PRIMARY_EXPRESSION) {
          token = this.nextTemplateLiteralToken_();
          if (token.type === ERROR || token.type === END_OF_FILE) break;
          elements.push(new TemplateLiteralPortion(token.location, token));
          if (token.type === TEMPLATE_TAIL) break;
          expression = this.parseExpression();
          elements.push(new TemplateSubstitution(expression.location, expression));
        }
        return new TemplateLiteralExpression(this.getTreeLocation_(start), operand, elements);
      },
      parseTypeAnnotationOpt_: function() {
        if (options.types && this.eatOpt_(COLON)) {
          return this.parseType_();
        }
        return null;
      },
      parseType_: function() {
        var start = this.getTreeStartLocation_();
        var elementType;
        switch (this.peekType_()) {
          case IDENTIFIER:
            elementType = this.parseNamedOrPredefinedType_();
            break;
          case NEW:
            elementType = this.parseConstructorType_();
            break;
          case OPEN_CURLY:
            elementType = this.parseObjectType_();
            break;
          case OPEN_PAREN:
            elementType = this.parseFunctionType_();
            break;
          case VOID:
            var token = this.nextToken_();
            return new PredefinedType(this.getTreeLocation_(start), token);
          default:
            this.reportError_(("Expected Type. Found '" + this.peekToken_() + "'"));
            return null;
        }
        return this.parseArrayTypeSuffix_(start, elementType);
      },
      parseArrayTypeSuffix_: function(start, elementType) {
        return elementType;
      },
      parseConstructorType_: function() {
        throw 'NYI';
      },
      parseObjectType_: function() {
        throw 'NYI';
      },
      parseFunctionType_: function() {
        throw 'NYI';
      },
      parseNamedOrPredefinedType_: function() {
        var start = this.getTreeStartLocation_();
        switch (this.peekToken_().value) {
          case ANY:
          case NUMBER:
          case BOOL:
          case STRING:
            var token = this.nextToken_();
            return new PredefinedType(this.getTreeLocation_(start), token);
          default:
            return this.parseTypeName_();
        }
      },
      parseTypeName_: function() {
        var start = this.getTreeStartLocation_();
        var typeName = new TypeName(this.getTreeLocation_(start), null, this.eatId_());
        while (this.eatIf_(PERIOD)) {
          var memberName = this.eatIdName_();
          typeName = new TypeName(this.getTreeLocation_(start), typeName, memberName);
        }
        return typeName;
      },
      eatPossibleImplicitSemiColon_: function() {
        var token = this.peekTokenNoLineTerminator_();
        if (!token) {
          if (!options.strictSemicolons) return;
        } else {
          switch (token.type) {
            case SEMI_COLON:
              this.nextToken_();
              return;
            case END_OF_FILE:
            case CLOSE_CURLY:
              if (!options.strictSemicolons) return;
          }
        }
        this.reportError_('Semi-colon expected');
      },
      peekImplicitSemiColon_: function() {
        switch (this.peekType_()) {
          case SEMI_COLON:
          case CLOSE_CURLY:
          case END_OF_FILE:
            return true;
        }
        var token = this.peekTokenNoLineTerminator_();
        return token === null;
      },
      eatOpt_: function(expectedTokenType) {
        if (this.peek_(expectedTokenType)) return this.nextToken_();
        return null;
      },
      eatIdOpt_: function() {
        return this.peek_(IDENTIFIER) ? this.eatId_(): null;
      },
      eatId_: function(opt_expected) {
        var result = this.eat_(IDENTIFIER);
        if (opt_expected) {
          if (!result || result.value !== opt_expected) {
            if (!result) result = this.peekToken_();
            this.reportError_(result, ("expected '" + opt_expected + "'"));
            return null;
          }
        }
        return result;
      },
      eatIdName_: function() {
        var t = this.nextToken_();
        if (t.type != IDENTIFIER) {
          if (!t.isKeyword()) {
            this.reportExpectedError_(t, 'identifier');
            return null;
          }
          return new IdentifierToken(t.location, t.type);
        }
        return t;
      },
      eat_: function(expectedTokenType) {
        var token = this.nextToken_();
        if (token.type != expectedTokenType) {
          this.reportExpectedError_(token, expectedTokenType);
          return null;
        }
        return token;
      },
      eatIf_: function(expectedTokenType) {
        if (this.peek_(expectedTokenType)) {
          this.nextToken_();
          return true;
        }
        return false;
      },
      reportExpectedError_: function(token, expected) {
        this.reportError_(token, "'" + expected + "' expected");
      },
      getTreeStartLocation_: function() {
        return this.peekToken_().location.start;
      },
      getTreeEndLocation_: function() {
        return this.scanner_.lastToken.location.end;
      },
      getTreeLocation_: function(start) {
        return new SourceRange(start, this.getTreeEndLocation_());
      },
      nextToken_: function() {
        return this.scanner_.nextToken();
      },
      nextRegularExpressionLiteralToken_: function() {
        return this.scanner_.nextRegularExpressionLiteralToken();
      },
      nextTemplateLiteralToken_: function() {
        return this.scanner_.nextTemplateLiteralToken();
      },
      isAtEnd: function() {
        return this.scanner_.isAtEnd();
      },
      peek_: function(expectedType, opt_index) {
        return this.peekToken_(opt_index).type === expectedType;
      },
      peekType_: function() {
        return this.peekToken_().type;
      },
      peekToken_: function(opt_index) {
        return this.scanner_.peekToken(opt_index);
      },
      peekTokenNoLineTerminator_: function() {
        return this.scanner_.peekTokenNoLineTerminator();
      },
      reportError_: function(var_args) {
        if (arguments.length == 1) {
          this.errorReporter_.reportError(this.scanner_.getPosition(), arguments[0]);
        } else {
          var location = arguments[0];
          if (location instanceof Token) {
            location = location.location;
          }
          this.errorReporter_.reportError(location.start, arguments[1]);
        }
      },
      reportUnexpectedToken_: function() {
        this.reportError_(this.peekToken_(), 'Unexpected token');
      }
    });
    return $Parser;
  }();
  return Object.preventExtensions(Object.create(null, {Parser: {
      get: function() {
        return Parser;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ParseTreeFactory_js = (function() {
  "use strict";
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var LiteralToken = $__src_syntax_LiteralToken_js.LiteralToken;
  var $__9 = $__src_syntax_trees_ParseTree_js, ParseTree = $__9.ParseTree, ParseTreeType = $__9.ParseTreeType;
  var $__9 = $__src_syntax_PredefinedName_js, BIND = $__9.BIND, CALL = $__9.CALL, CREATE = $__9.CREATE, DEFINE_PROPERTY = $__9.DEFINE_PROPERTY, FREEZE = $__9.FREEZE, OBJECT = $__9.OBJECT, PREVENT_EXTENSIONS = $__9.PREVENT_EXTENSIONS, STATE = $__9.STATE, UNDEFINED = $__9.UNDEFINED, getParameterName = $__9.getParameterName;
  var Token = $__src_syntax_Token_js.Token;
  var $__9 = $__src_syntax_TokenType_js, EQUAL = $__9.EQUAL, FALSE = $__9.FALSE, NULL = $__9.NULL, NUMBER = $__9.NUMBER, STRING = $__9.STRING, TRUE = $__9.TRUE, VOID = $__9.VOID;
  var $__9 = $__src_syntax_trees_ParseTrees_js, ArgumentList = $__9.ArgumentList, ArrayComprehension = $__9.ArrayComprehension, ArrayLiteralExpression = $__9.ArrayLiteralExpression, ArrayPattern = $__9.ArrayPattern, ArrowFunctionExpression = $__9.ArrowFunctionExpression, AtNameDeclaration = $__9.AtNameDeclaration, AtNameExpression = $__9.AtNameExpression, AwaitStatement = $__9.AwaitStatement, BinaryOperator = $__9.BinaryOperator, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, Block = $__9.Block, BreakStatement = $__9.BreakStatement, CallExpression = $__9.CallExpression, CascadeExpression = $__9.CascadeExpression, CaseClause = $__9.CaseClause, Catch = $__9.Catch, ClassDeclaration = $__9.ClassDeclaration, ClassExpression = $__9.ClassExpression, CommaExpression = $__9.CommaExpression, ComprehensionFor = $__9.ComprehensionFor, ConditionalExpression = $__9.ConditionalExpression, ContinueStatement = $__9.ContinueStatement, CoverFormals = $__9.CoverFormals, DebuggerStatement = $__9.DebuggerStatement, DefaultClause = $__9.DefaultClause, DoWhileStatement = $__9.DoWhileStatement, EmptyStatement = $__9.EmptyStatement, ExportDeclaration = $__9.ExportDeclaration, ExportMapping = $__9.ExportMapping, ExportMappingList = $__9.ExportMappingList, ExportSpecifier = $__9.ExportSpecifier, ExportSpecifierSet = $__9.ExportSpecifierSet, ExportStar = $__9.ExportStar, ExpressionStatement = $__9.ExpressionStatement, Finally = $__9.Finally, ForInStatement = $__9.ForInStatement, ForOfStatement = $__9.ForOfStatement, ForStatement = $__9.ForStatement, FormalParameterList = $__9.FormalParameterList, FunctionDeclaration = $__9.FunctionDeclaration, FunctionExpression = $__9.FunctionExpression, GeneratorComprehension = $__9.GeneratorComprehension, GetAccessor = $__9.GetAccessor, IdentifierExpression = $__9.IdentifierExpression, IfStatement = $__9.IfStatement, ImportBinding = $__9.ImportBinding, ImportDeclaration = $__9.ImportDeclaration, ImportSpecifier = $__9.ImportSpecifier, ImportSpecifierSet = $__9.ImportSpecifierSet, LabelledStatement = $__9.LabelledStatement, LiteralExpression = $__9.LiteralExpression, MemberExpression = $__9.MemberExpression, MemberLookupExpression = $__9.MemberLookupExpression, MissingPrimaryExpression = $__9.MissingPrimaryExpression, ModuleDeclaration = $__9.ModuleDeclaration, ModuleDefinition = $__9.ModuleDefinition, ModuleExpression = $__9.ModuleExpression, ModuleRequire = $__9.ModuleRequire, ModuleSpecifier = $__9.ModuleSpecifier, NameStatement = $__9.NameStatement, NewExpression = $__9.NewExpression, ObjectLiteralExpression = $__9.ObjectLiteralExpression, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, ParenExpression = $__9.ParenExpression, PostfixExpression = $__9.PostfixExpression, PredefinedType = $__9.PredefinedType, Program = $__9.Program, PropertyMethodAssignment = $__9.PropertyMethodAssignment, PropertyNameAssignment = $__9.PropertyNameAssignment, PropertyNameShorthand = $__9.PropertyNameShorthand, RestParameter = $__9.RestParameter, ReturnStatement = $__9.ReturnStatement, SetAccessor = $__9.SetAccessor, SpreadExpression = $__9.SpreadExpression, SpreadPatternElement = $__9.SpreadPatternElement, SuperExpression = $__9.SuperExpression, SwitchStatement = $__9.SwitchStatement, TemplateLiteralExpression = $__9.TemplateLiteralExpression, TemplateLiteralPortion = $__9.TemplateLiteralPortion, TemplateSubstitution = $__9.TemplateSubstitution, ThisExpression = $__9.ThisExpression, ThrowStatement = $__9.ThrowStatement, TryStatement = $__9.TryStatement, TypeName = $__9.TypeName, UnaryExpression = $__9.UnaryExpression, VariableDeclaration = $__9.VariableDeclaration, VariableDeclarationList = $__9.VariableDeclarationList, VariableStatement = $__9.VariableStatement, WhileStatement = $__9.WhileStatement, WithStatement = $__9.WithStatement, YieldExpression = $__9.YieldExpression;
  var slice = Array.prototype.slice.call.bind(Array.prototype.slice);
  var map = Array.prototype.map.call.bind(Array.prototype.map);
  function createOperatorToken(operator) {
    return new Token(operator, null);
  }
  function createIdentifierToken(identifier) {
    return new IdentifierToken(null, identifier);
  }
  function createPropertyNameToken(name) {
    return createIdentifierToken(name);
  }
  function createStringLiteralToken(value) {
    return new LiteralToken(STRING, JSON.stringify(value), null);
  }
  function createBooleanLiteralToken(value) {
    return new Token(value ? TRUE: FALSE, null);
  }
  function createNullLiteralToken() {
    return new LiteralToken(NULL, 'null', null);
  }
  function createNumberLiteralToken(value) {
    return new LiteralToken(NUMBER, String(value), null);
  }
  function createEmptyParameters() {
    return [];
  }
  function createStatementList(statementsOrHead) {
    for (var args = [], $__6 = 1; $__6 < arguments.length; $__6++) args[$__6 - 1] = arguments[$__6];
    if (statementsOrHead instanceof Array) return $__spread(statementsOrHead, args);
    return slice(arguments);
  }
  function createBindingElement(arg) {
    var binding = createBindingIdentifier(arg);
    return new BindingElement(null, binding, null);
  }
  function createParameterList(arg0, var_args) {
    if (typeof arg0 == 'string') {
      var parameterList = map(arguments, createBindingElement);
      return new FormalParameterList(null, parameterList);
    }
    if (typeof arg0 == 'number') return createParameterListHelper(arg0, false);
    if (arg0 instanceof IdentifierToken) {
      return new FormalParameterList(null, [createBindingElement(arg0)]);
    }
    var builder = arg0.map(createBindingElement);
    return new FormalParameterList(null, builder);
  }
  function createParameterListHelper(numberOfParameters, hasRestParams) {
    var builder = [];
    for (var index = 0; index < numberOfParameters; index++) {
      var parameterName = getParameterName(index);
      var isRestParameter = index == numberOfParameters - 1 && hasRestParams;
      builder.push(isRestParameter ? createRestParameter(parameterName): createBindingElement(parameterName));
    }
    return new FormalParameterList(null, builder);
  }
  function createParameterListWithRestParams(numberOfParameters) {
    return createParameterListHelper(numberOfParameters, true);
  }
  function createParameterReference(index) {
    return createIdentifierExpression(getParameterName(index));
  }
  function createEmptyParameterList() {
    return new FormalParameterList(null, []);
  }
  function createEmptyList() {
    return [];
  }
  function createArgumentList(numberListOrFirst, var_args) {
    if (typeof numberListOrFirst == 'number') {
      return createArgumentListFromParameterList(createParameterList(numberListOrFirst));
    }
    var list;
    if (numberListOrFirst instanceof Array) list = numberListOrFirst; else list = slice(arguments);
    return new ArgumentList(null, list);
  }
  function createArgumentListFromParameterList(formalParameterList) {
    var builder = formalParameterList.parameters.map(function(parameter) {
      if (parameter.isRestParameter()) {
        return createSpreadExpression(createIdentifierExpression(parameter.identifier));
      } else {
        return parameter;
      }
    });
    return new ArgumentList(null, builder);
  }
  function createEmptyArgumentList() {
    return new ArgumentList(null, createEmptyList());
  }
  function createArrayLiteralExpression(list) {
    return new ArrayLiteralExpression(null, list);
  }
  function createEmptyArrayLiteralExpression() {
    return createArrayLiteralExpression(createEmptyList());
  }
  function createArrayPattern(list) {
    return new ArrayPattern(null, list);
  }
  function createAssignmentExpression(lhs, rhs) {
    return new BinaryOperator(null, lhs, createOperatorToken(EQUAL), rhs);
  }
  function createBinaryOperator(left, operator, right) {
    return new BinaryOperator(null, left, operator, right);
  }
  function createBindingIdentifier(identifier) {
    if (typeof identifier === 'string') identifier = createIdentifierToken(identifier); else if (identifier.type === ParseTreeType.BINDING_IDENTIFIER) return identifier; else if (identifier.type === ParseTreeType.IDENTIFIER_EXPRESSION) return new BindingIdentifier(identifier.location, identifier.identifierToken);
    return new BindingIdentifier(null, identifier);
  }
  function createEmptyStatement() {
    return new EmptyStatement(null);
  }
  function createEmptyBlock() {
    return createBlock(createEmptyList());
  }
  function createBlock(statements) {
    if (statements instanceof ParseTree) statements = slice(arguments);
    return new Block(null, statements);
  }
  function createScopedStatements(statements) {
    if (statements instanceof ParseTree) statements = slice(arguments);
    return createScopedBlock(createBlock(statements));
  }
  function createScopedBlock(block) {
    return createExpressionStatement(createScopedExpression(block));
  }
  function createScopedExpression(block) {
    return createCallCall(createParenExpression(createFunctionExpression(createEmptyParameterList(), block)), createThisExpression());
  }
  function createCallExpression(operand, opt_args) {
    var args = opt_args || createEmptyArgumentList();
    return new CallExpression(null, operand, args);
  }
  function createBoundCall(func, thisTree) {
    return createCallExpression(createMemberExpression(func.type == ParseTreeType.FUNCTION_EXPRESSION ? createParenExpression(func): func, BIND), createArgumentList(thisTree));
  }
  function createBreakStatement(opt_name) {
    return new BreakStatement(null, opt_name || null);
  }
  function createCallCall(func, thisExpression, args, var_args) {
    var $__10;
    if (args instanceof ParseTree) args = slice(arguments, 2);
    var builder = [thisExpression];
    if (args)($__10 = builder).push.apply($__10, $__toObject(args));
    return createCallExpression(createMemberExpression(func, CALL), createArgumentList(builder));
  }
  function createCallCallStatement(func, thisExpression) {
    for (var args = [], $__7 = 2; $__7 < arguments.length; $__7++) args[$__7 - 2] = arguments[$__7];
    return createExpressionStatement(createCallCall(func, thisExpression, args));
  }
  function createCaseClause(expression, statements) {
    return new CaseClause(null, expression, statements);
  }
  function createCatch(identifier, catchBody) {
    identifier = createBindingIdentifier(identifier);
    return new Catch(null, identifier, catchBody);
  }
  function createCascadeExpression(operand, expressions) {
    return new CascadeExpression(null, operand, expressions);
  }
  function createClassDeclaration(name, superClass, elements) {
    return new ClassDeclaration(null, name, superClass, elements);
  }
  function createCommaExpression(expressions) {
    return new CommaExpression(null, expressions);
  }
  function createConditionalExpression(condition, left, right) {
    return new ConditionalExpression(null, condition, left, right);
  }
  function createContinueStatement(opt_name) {
    return new ContinueStatement(null, opt_name || null);
  }
  function createDefaultClause(statements) {
    return new DefaultClause(null, statements);
  }
  function createDoWhileStatement(body, condition) {
    return new DoWhileStatement(null, body, condition);
  }
  function createAssignmentStatement(lhs, rhs) {
    return createExpressionStatement(createAssignmentExpression(lhs, rhs));
  }
  function createCallStatement(operand, opt_args) {
    if (opt_args) {
      return createExpressionStatement(createCallExpression(operand, opt_args));
    }
    return createExpressionStatement(createCallExpression(operand));
  }
  function createExpressionStatement(expression) {
    return new ExpressionStatement(null, expression);
  }
  function createFinally(block) {
    return new Finally(null, block);
  }
  function createForOfStatement(initializer, collection, body) {
    return new ForOfStatement(null, initializer, collection, body);
  }
  function createForInStatement(initializer, collection, body) {
    return new ForInStatement(null, initializer, collection, body);
  }
  function createForStatement(variables, condition, increment, body) {
    return new ForStatement(null, variables, condition, increment, body);
  }
  function createFunctionExpression(formalParameterList, functionBody) {
    return new FunctionExpression(null, null, false, formalParameterList, functionBody);
  }
  function createGetAccessor(name, body) {
    if (typeof name == 'string') name = createPropertyNameToken(name);
    return new GetAccessor(null, name, body);
  }
  function createIdentifierExpression(identifier) {
    if (typeof identifier == 'string') identifier = createIdentifierToken(identifier); else if (identifier instanceof BindingIdentifier) identifier = identifier.identifierToken;
    return new IdentifierExpression(null, identifier);
  }
  function createUndefinedExpression() {
    return createIdentifierExpression(UNDEFINED);
  }
  function createIfStatement(condition, ifClause, opt_elseClause) {
    return new IfStatement(null, condition, ifClause, opt_elseClause || null);
  }
  function createLabelledStatement(name, statement) {
    return new LabelledStatement(null, name, statement);
  }
  function createStringLiteral(value) {
    return new LiteralExpression(null, createStringLiteralToken(value));
  }
  function createBooleanLiteral(value) {
    return new LiteralExpression(null, createBooleanLiteralToken(value));
  }
  function createTrueLiteral() {
    return createBooleanLiteral(true);
  }
  function createFalseLiteral() {
    return createBooleanLiteral(false);
  }
  function createNullLiteral() {
    return new LiteralExpression(null, createNullLiteralToken());
  }
  function createNumberLiteral(value) {
    return new LiteralExpression(null, createNumberLiteralToken(value));
  }
  function createMemberExpression(operand, memberName, memberNames) {
    if (typeof operand == 'string' || operand instanceof IdentifierToken) operand = createIdentifierExpression(operand);
    if (typeof memberName == 'string') memberName = createIdentifierToken(memberName);
    var tree = new MemberExpression(null, operand, memberName);
    for (var i = 2; i < arguments.length; i++) {
      tree = createMemberExpression(tree, arguments[i]);
    }
    return tree;
  }
  function createMemberLookupExpression(operand, memberExpression) {
    return new MemberLookupExpression(null, operand, memberExpression);
  }
  function createThisExpression(memberName) {
    if (memberName) return createMemberExpression(createThisExpression(), memberName);
    return new ThisExpression(null);
  }
  function createNewExpression(operand, args) {
    return new NewExpression(null, operand, args);
  }
  function createObjectFreeze(value) {
    return createCallExpression(createMemberExpression(OBJECT, FREEZE), createArgumentList(value));
  }
  function createObjectPreventExtensions(value) {
    return createCallExpression(createMemberExpression(OBJECT, PREVENT_EXTENSIONS), createArgumentList(value));
  }
  function createObjectCreate(protoExpression, descriptors) {
    var argumentList = [protoExpression];
    if (descriptors) argumentList.push(descriptors);
    return createCallExpression(createMemberExpression(OBJECT, CREATE), createArgumentList(argumentList));
  }
  function createPropertyDescriptor(descr) {
    var propertyNameAndValues = Object.keys(descr).map(function(name) {
      var value = descr[name];
      if (!(value instanceof ParseTree)) value = createBooleanLiteral(!!value);
      return createPropertyNameAssignment(name, value);
    });
    return createObjectLiteralExpression(propertyNameAndValues);
  }
  function createDefineProperty(tree, name, descr) {
    if (typeof name === 'string') name = createStringLiteral(name);
    return createCallExpression(createMemberExpression(OBJECT, DEFINE_PROPERTY), createArgumentList(tree, name, createPropertyDescriptor(descr)));
  }
  function createObjectLiteralExpression(propertyNameAndValues) {
    if (propertyNameAndValues instanceof ParseTree) propertyNameAndValues = slice(arguments);
    return new ObjectLiteralExpression(null, propertyNameAndValues);
  }
  function createObjectPattern(list) {
    return new ObjectPattern(null, list);
  }
  function createObjectPatternField(identifier, element) {
    identifier = createBindingIdentifier(identifier);
    return new ObjectPatternField(null, identifier, element);
  }
  function createParenExpression(expression) {
    return new ParenExpression(null, expression);
  }
  function createPostfixExpression(operand, operator) {
    return new PostfixExpression(null, operand, operator);
  }
  function createProgram(programElements) {
    return new Program(null, programElements);
  }
  function createPropertyNameAssignment(identifier, value) {
    if (typeof identifier == 'string') identifier = createIdentifierToken(identifier);
    return new PropertyNameAssignment(null, identifier, value);
  }
  function createRestParameter(identifier) {
    return new RestParameter(null, createBindingIdentifier(identifier));
  }
  function createReturnStatement(expression) {
    return new ReturnStatement(null, expression);
  }
  function createYieldStatement(expression, isYieldFor) {
    return createExpressionStatement(new YieldExpression(null, expression, isYieldFor));
  }
  function createSetAccessor(name, parameter, body) {
    if (typeof name == 'string') name = createPropertyNameToken(name);
    if (typeof parameter == 'string') parameter = createIdentifierToken(parameter);
    return new SetAccessor(null, name, parameter, body);
  }
  function createSpreadExpression(expression) {
    return new SpreadExpression(null, expression);
  }
  function createSpreadPatternElement(lvalue) {
    return new SpreadPatternElement(null, lvalue);
  }
  function createSwitchStatement(expression, caseClauses) {
    return new SwitchStatement(null, expression, caseClauses);
  }
  function createThrowStatement(value) {
    return new ThrowStatement(null, value);
  }
  function createTryStatement(body, catchOrFinallyBlock, opt_finallyBlock) {
    var catchBlock, finallyBlock;
    if (arguments.length > 2) {
      catchBlock = arguments[1];
      finallyBlock = arguments[2];
    } else {
      catchBlock = null;
      finallyBlock = arguments[1];
    }
    return new TryStatement(null, body, catchBlock, finallyBlock);
  }
  function createUnaryExpression(operator, operand) {
    return new UnaryExpression(null, operator, operand);
  }
  function createUseStrictDirective() {
    return createExpressionStatement(createStringLiteral('use strict'));
  }
  function createVariableDeclarationList(binding, identifierOrDeclarations, initializer) {
    if (identifierOrDeclarations instanceof Array) {
      var declarations = identifierOrDeclarations;
      return new VariableDeclarationList(null, binding, declarations);
    }
    var identifier = identifierOrDeclarations;
    return createVariableDeclarationList(binding, [createVariableDeclaration(identifier, initializer)]);
  }
  function createVariableDeclaration(identifier, initializer) {
    if (!(identifier instanceof ParseTree) || identifier.type !== ParseTreeType.BINDING_IDENTIFIER && identifier.type !== ParseTreeType.OBJECT_PATTERN && identifier.type !== ParseTreeType.ARRAY_PATTERN) {
      identifier = createBindingIdentifier(identifier);
    }
    return new VariableDeclaration(null, identifier, null, initializer);
  }
  function createVariableStatement(listOrBinding, identifier, initializer) {
    if (listOrBinding instanceof VariableDeclarationList) return new VariableStatement(null, listOrBinding);
    var binding = listOrBinding;
    var list = createVariableDeclarationList(binding, identifier, initializer);
    return createVariableStatement(list);
  }
  function createVoid0() {
    return createParenExpression(createUnaryExpression(createOperatorToken(VOID), createNumberLiteral(0)));
  }
  function createWhileStatement(condition, body) {
    return new WhileStatement(null, condition, body);
  }
  function createWithStatement(expression, body) {
    return new WithStatement(null, expression, body);
  }
  function createAssignStateStatement(state) {
    return createAssignmentStatement(createIdentifierExpression(STATE), createNumberLiteral(state));
  }
  return Object.preventExtensions(Object.create(null, {
    createOperatorToken: {
      get: function() {
        return createOperatorToken;
      },
      enumerable: true
    },
    createIdentifierToken: {
      get: function() {
        return createIdentifierToken;
      },
      enumerable: true
    },
    createPropertyNameToken: {
      get: function() {
        return createPropertyNameToken;
      },
      enumerable: true
    },
    createStringLiteralToken: {
      get: function() {
        return createStringLiteralToken;
      },
      enumerable: true
    },
    createBooleanLiteralToken: {
      get: function() {
        return createBooleanLiteralToken;
      },
      enumerable: true
    },
    createNullLiteralToken: {
      get: function() {
        return createNullLiteralToken;
      },
      enumerable: true
    },
    createNumberLiteralToken: {
      get: function() {
        return createNumberLiteralToken;
      },
      enumerable: true
    },
    createEmptyParameters: {
      get: function() {
        return createEmptyParameters;
      },
      enumerable: true
    },
    createStatementList: {
      get: function() {
        return createStatementList;
      },
      enumerable: true
    },
    createBindingElement: {
      get: function() {
        return createBindingElement;
      },
      enumerable: true
    },
    createParameterList: {
      get: function() {
        return createParameterList;
      },
      enumerable: true
    },
    createParameterListWithRestParams: {
      get: function() {
        return createParameterListWithRestParams;
      },
      enumerable: true
    },
    createParameterReference: {
      get: function() {
        return createParameterReference;
      },
      enumerable: true
    },
    createEmptyParameterList: {
      get: function() {
        return createEmptyParameterList;
      },
      enumerable: true
    },
    createEmptyList: {
      get: function() {
        return createEmptyList;
      },
      enumerable: true
    },
    createArgumentList: {
      get: function() {
        return createArgumentList;
      },
      enumerable: true
    },
    createArgumentListFromParameterList: {
      get: function() {
        return createArgumentListFromParameterList;
      },
      enumerable: true
    },
    createEmptyArgumentList: {
      get: function() {
        return createEmptyArgumentList;
      },
      enumerable: true
    },
    createArrayLiteralExpression: {
      get: function() {
        return createArrayLiteralExpression;
      },
      enumerable: true
    },
    createEmptyArrayLiteralExpression: {
      get: function() {
        return createEmptyArrayLiteralExpression;
      },
      enumerable: true
    },
    createArrayPattern: {
      get: function() {
        return createArrayPattern;
      },
      enumerable: true
    },
    createAssignmentExpression: {
      get: function() {
        return createAssignmentExpression;
      },
      enumerable: true
    },
    createBinaryOperator: {
      get: function() {
        return createBinaryOperator;
      },
      enumerable: true
    },
    createBindingIdentifier: {
      get: function() {
        return createBindingIdentifier;
      },
      enumerable: true
    },
    createEmptyStatement: {
      get: function() {
        return createEmptyStatement;
      },
      enumerable: true
    },
    createEmptyBlock: {
      get: function() {
        return createEmptyBlock;
      },
      enumerable: true
    },
    createBlock: {
      get: function() {
        return createBlock;
      },
      enumerable: true
    },
    createScopedStatements: {
      get: function() {
        return createScopedStatements;
      },
      enumerable: true
    },
    createScopedBlock: {
      get: function() {
        return createScopedBlock;
      },
      enumerable: true
    },
    createScopedExpression: {
      get: function() {
        return createScopedExpression;
      },
      enumerable: true
    },
    createCallExpression: {
      get: function() {
        return createCallExpression;
      },
      enumerable: true
    },
    createBoundCall: {
      get: function() {
        return createBoundCall;
      },
      enumerable: true
    },
    createBreakStatement: {
      get: function() {
        return createBreakStatement;
      },
      enumerable: true
    },
    createCallCall: {
      get: function() {
        return createCallCall;
      },
      enumerable: true
    },
    createCallCallStatement: {
      get: function() {
        return createCallCallStatement;
      },
      enumerable: true
    },
    createCaseClause: {
      get: function() {
        return createCaseClause;
      },
      enumerable: true
    },
    createCatch: {
      get: function() {
        return createCatch;
      },
      enumerable: true
    },
    createCascadeExpression: {
      get: function() {
        return createCascadeExpression;
      },
      enumerable: true
    },
    createClassDeclaration: {
      get: function() {
        return createClassDeclaration;
      },
      enumerable: true
    },
    createCommaExpression: {
      get: function() {
        return createCommaExpression;
      },
      enumerable: true
    },
    createConditionalExpression: {
      get: function() {
        return createConditionalExpression;
      },
      enumerable: true
    },
    createContinueStatement: {
      get: function() {
        return createContinueStatement;
      },
      enumerable: true
    },
    createDefaultClause: {
      get: function() {
        return createDefaultClause;
      },
      enumerable: true
    },
    createDoWhileStatement: {
      get: function() {
        return createDoWhileStatement;
      },
      enumerable: true
    },
    createAssignmentStatement: {
      get: function() {
        return createAssignmentStatement;
      },
      enumerable: true
    },
    createCallStatement: {
      get: function() {
        return createCallStatement;
      },
      enumerable: true
    },
    createExpressionStatement: {
      get: function() {
        return createExpressionStatement;
      },
      enumerable: true
    },
    createFinally: {
      get: function() {
        return createFinally;
      },
      enumerable: true
    },
    createForOfStatement: {
      get: function() {
        return createForOfStatement;
      },
      enumerable: true
    },
    createForInStatement: {
      get: function() {
        return createForInStatement;
      },
      enumerable: true
    },
    createForStatement: {
      get: function() {
        return createForStatement;
      },
      enumerable: true
    },
    createFunctionExpression: {
      get: function() {
        return createFunctionExpression;
      },
      enumerable: true
    },
    createGetAccessor: {
      get: function() {
        return createGetAccessor;
      },
      enumerable: true
    },
    createIdentifierExpression: {
      get: function() {
        return createIdentifierExpression;
      },
      enumerable: true
    },
    createUndefinedExpression: {
      get: function() {
        return createUndefinedExpression;
      },
      enumerable: true
    },
    createIfStatement: {
      get: function() {
        return createIfStatement;
      },
      enumerable: true
    },
    createLabelledStatement: {
      get: function() {
        return createLabelledStatement;
      },
      enumerable: true
    },
    createStringLiteral: {
      get: function() {
        return createStringLiteral;
      },
      enumerable: true
    },
    createBooleanLiteral: {
      get: function() {
        return createBooleanLiteral;
      },
      enumerable: true
    },
    createTrueLiteral: {
      get: function() {
        return createTrueLiteral;
      },
      enumerable: true
    },
    createFalseLiteral: {
      get: function() {
        return createFalseLiteral;
      },
      enumerable: true
    },
    createNullLiteral: {
      get: function() {
        return createNullLiteral;
      },
      enumerable: true
    },
    createNumberLiteral: {
      get: function() {
        return createNumberLiteral;
      },
      enumerable: true
    },
    createMemberExpression: {
      get: function() {
        return createMemberExpression;
      },
      enumerable: true
    },
    createMemberLookupExpression: {
      get: function() {
        return createMemberLookupExpression;
      },
      enumerable: true
    },
    createThisExpression: {
      get: function() {
        return createThisExpression;
      },
      enumerable: true
    },
    createNewExpression: {
      get: function() {
        return createNewExpression;
      },
      enumerable: true
    },
    createObjectFreeze: {
      get: function() {
        return createObjectFreeze;
      },
      enumerable: true
    },
    createObjectPreventExtensions: {
      get: function() {
        return createObjectPreventExtensions;
      },
      enumerable: true
    },
    createObjectCreate: {
      get: function() {
        return createObjectCreate;
      },
      enumerable: true
    },
    createPropertyDescriptor: {
      get: function() {
        return createPropertyDescriptor;
      },
      enumerable: true
    },
    createDefineProperty: {
      get: function() {
        return createDefineProperty;
      },
      enumerable: true
    },
    createObjectLiteralExpression: {
      get: function() {
        return createObjectLiteralExpression;
      },
      enumerable: true
    },
    createObjectPattern: {
      get: function() {
        return createObjectPattern;
      },
      enumerable: true
    },
    createObjectPatternField: {
      get: function() {
        return createObjectPatternField;
      },
      enumerable: true
    },
    createParenExpression: {
      get: function() {
        return createParenExpression;
      },
      enumerable: true
    },
    createPostfixExpression: {
      get: function() {
        return createPostfixExpression;
      },
      enumerable: true
    },
    createProgram: {
      get: function() {
        return createProgram;
      },
      enumerable: true
    },
    createPropertyNameAssignment: {
      get: function() {
        return createPropertyNameAssignment;
      },
      enumerable: true
    },
    createRestParameter: {
      get: function() {
        return createRestParameter;
      },
      enumerable: true
    },
    createReturnStatement: {
      get: function() {
        return createReturnStatement;
      },
      enumerable: true
    },
    createYieldStatement: {
      get: function() {
        return createYieldStatement;
      },
      enumerable: true
    },
    createSetAccessor: {
      get: function() {
        return createSetAccessor;
      },
      enumerable: true
    },
    createSpreadExpression: {
      get: function() {
        return createSpreadExpression;
      },
      enumerable: true
    },
    createSpreadPatternElement: {
      get: function() {
        return createSpreadPatternElement;
      },
      enumerable: true
    },
    createSwitchStatement: {
      get: function() {
        return createSwitchStatement;
      },
      enumerable: true
    },
    createThrowStatement: {
      get: function() {
        return createThrowStatement;
      },
      enumerable: true
    },
    createTryStatement: {
      get: function() {
        return createTryStatement;
      },
      enumerable: true
    },
    createUnaryExpression: {
      get: function() {
        return createUnaryExpression;
      },
      enumerable: true
    },
    createUseStrictDirective: {
      get: function() {
        return createUseStrictDirective;
      },
      enumerable: true
    },
    createVariableDeclarationList: {
      get: function() {
        return createVariableDeclarationList;
      },
      enumerable: true
    },
    createVariableDeclaration: {
      get: function() {
        return createVariableDeclaration;
      },
      enumerable: true
    },
    createVariableStatement: {
      get: function() {
        return createVariableStatement;
      },
      enumerable: true
    },
    createVoid0: {
      get: function() {
        return createVoid0;
      },
      enumerable: true
    },
    createWhileStatement: {
      get: function() {
        return createWhileStatement;
      },
      enumerable: true
    },
    createWithStatement: {
      get: function() {
        return createWithStatement;
      },
      enumerable: true
    },
    createAssignStateStatement: {
      get: function() {
        return createAssignStateStatement;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_semantics_VariableBinder_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, Block = $__9.Block, Catch = $__9.Catch, ForInStatement = $__9.ForInStatement, ForStatement = $__9.ForStatement, ObjectPatternField = $__9.ObjectPatternField, VariableDeclarationList = $__9.VariableDeclarationList, VariableDeclaration = $__9.VariableDeclaration;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, ARRAY_PATTERN = $__9.ARRAY_PATTERN, BINDING_IDENTIFIER = $__9.BINDING_IDENTIFIER, OBJECT_PATTERN = $__9.OBJECT_PATTERN, OBJECT_PATTERN_FIELD = $__9.OBJECT_PATTERN_FIELD, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, SPREAD_PATTERN_ELEMENT = $__9.SPREAD_PATTERN_ELEMENT;
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var VAR = $__src_syntax_TokenType_js.VAR;
  function variablesInBlock(tree, includeFunctionScope) {
    var binder = new VariableBinder(includeFunctionScope, tree);
    binder.visitAny(tree);
    return binder.identifiers_;
  }
  ;
  function variablesInFunction(tree) {
    var binder = new VariableBinder(true, tree.functionBody);
    binder.bindVariablesInFunction_(tree);
    return binder.identifiers_;
  }
  ;
  var VariableBinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $VariableBinder = ($__createClass)({
      constructor: function(includeFunctionScope, scope) {
        $__superCall(this, $__proto, "constructor", []);
        this.includeFunctionScope_ = includeFunctionScope;
        this.scope_ = scope || null;
        this.block_ = null;
        this.identifiers_ = Object.create(null);
      },
      bindVariablesInFunction_: function(tree) {
        var parameters = tree.formalParameterList.parameters;
        for (var i = 0; i < parameters.length; i++) {
          this.bindParameter_(parameters[i]);
        }
        this.visitAny(tree.functionBody);
      },
      visitBlock: function(tree) {
        var parentBlock = this.block_;
        this.block_ = tree;
        this.visitList(tree.statements);
        this.block_ = parentBlock;
      },
      visitFunctionDeclaration: function(tree) {
        if (this.block_ == this.scope_) this.bind_(tree.name.identifierToken);
      },
      visitFunctionExpression: function(tree) {},
      visitVariableDeclarationList: function(tree) {
        if ((tree.declarationType == VAR && this.includeFunctionScope_) || (tree.declarationType != VAR && this.block_ == this.scope_)) {
          $__superCall(this, $__proto, "visitVariableDeclarationList", [tree]);
        } else {
          var decls = tree.declarations;
          for (var i = 0; i < decls.length; i++) {
            this.visitAny(decls[i].initializer);
          }
        }
      },
      visitVariableDeclaration: function(tree) {
        this.bindVariableDeclaration_(tree.lvalue);
        $__superCall(this, $__proto, "visitVariableDeclaration", [tree]);
      },
      bind_: function(identifier) {
        traceur.assert(typeof identifier.value == 'string');
        this.identifiers_[identifier.value] = true;
      },
      bindParameter_: function(parameter) {
        if (parameter.isRestParameter()) {
          this.bind_(parameter.identifier);
        } else {
          this.bindVariableDeclaration_(parameter.binding);
        }
      },
      bindVariableDeclaration_: function(tree) {
        switch (tree.type) {
          case BINDING_IDENTIFIER:
            this.bind_(tree.identifierToken);
            break;
          case ARRAY_PATTERN:
            var elements = tree.elements;
            for (var i = 0; i < elements.length; i++) {
              this.bindVariableDeclaration_(elements[i]);
            }
            break;
          case SPREAD_PATTERN_ELEMENT:
            this.bindVariableDeclaration_(tree.lvalue);
            break;
          case OBJECT_PATTERN:
            var fields = tree.fields;
            for (var i = 0; i < fields.length; i++) {
              this.bindVariableDeclaration_(fields[i]);
            }
            break;
          case OBJECT_PATTERN_FIELD:
            var field = tree;
            if (field.element == null) {
              this.bind_(field.identifier);
            } else {
              this.bindVariableDeclaration_(field.element);
            }
            break;
          case PAREN_EXPRESSION:
            this.bindVariableDeclaration_(tree.expression);
            break;
          default:
            throw new Error('unreachable');
        }
      }
    }, $__proto, $__super, true);
    return $VariableBinder;
  }(ParseTreeVisitor);
  return Object.preventExtensions(Object.create(null, {
    variablesInBlock: {
      get: function() {
        return variablesInBlock;
      },
      enumerable: true
    },
    variablesInFunction: {
      get: function() {
        return variablesInFunction;
      },
      enumerable: true
    },
    VariableBinder: {
      get: function() {
        return VariableBinder;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_AlphaRenamer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, Block = $__9.Block, Catch = $__9.Catch, IdentifierExpression = $__9.IdentifierExpression;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_PredefinedName_js, ARGUMENTS = $__9.ARGUMENTS, THIS = $__9.THIS;
  var createIdentifierExpression = $__src_codegeneration_ParseTreeFactory_js.createIdentifierExpression;
  var $__9 = $__src_semantics_VariableBinder_js, variablesInBlock = $__9.variablesInBlock, variablesInFunction = $__9.variablesInFunction;
  var AlphaRenamer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AlphaRenamer = ($__createClass)({
      constructor: function(oldName, newName) {
        $__superCall(this, $__proto, "constructor", []);
        this.oldName_ = oldName;
        this.newName_ = newName;
      },
      transformBlock: function(tree) {
        if (this.oldName_ in variablesInBlock(tree)) {
          return tree;
        } else {
          return $__superCall(this, $__proto, "transformBlock", [tree]);
        }
      },
      transformIdentifierExpression: function(tree) {
        if (this.oldName_ == tree.identifierToken.value) {
          return createIdentifierExpression(this.newName_);
        } else {
          return tree;
        }
      },
      transformThisExpression: function(tree) {
        if (this.oldName_ !== THIS) return tree;
        return createIdentifierExpression(this.newName_);
      },
      transformFunction: function(tree) {
        if (this.oldName_ == tree.name) {
          tree = new tree.constructor(tree.location, this.newName_, tree.isGenerator, tree.formalParameterList, tree.functionBody);
        }
        var doNotRecurse = this.oldName_ === ARGUMENTS || this.oldName_ === THIS || this.oldName_ in variablesInFunction(tree);
        if (doNotRecurse) return tree;
        return $__superCall(this, $__proto, "transformFunction", [tree]);
      },
      transformCatch: function(tree) {
        if (!tree.binding.isPattern() && this.oldName_ === tree.binding.identifierToken.value) {
          return tree;
        }
        return $__superCall(this, $__proto, "transformCatch", [tree]);
      }
    }, $__proto, $__super, true);
    return $AlphaRenamer;
  }(ParseTreeTransformer);
  AlphaRenamer.rename = function(tree, oldName, newName) {
    return new AlphaRenamer(oldName, newName).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {AlphaRenamer: {
      get: function() {
        return AlphaRenamer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_FindVisitor_js = (function() {
  "use strict";
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var foundSentinel = {};
  var FindVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FindVisitor = ($__createClass)({
      constructor: function(tree, keepOnGoing) {
        this.found_ = false;
        this.keepOnGoing_ = keepOnGoing;
        try {
          this.visitAny(tree);
        } catch (ex) {
          if (ex !== foundSentinel) throw ex;
        }
      },
      get found() {
        return this.found_;
      },
      set found(v) {
        if (v) {
          this.found_ = true;
          if (!this.keepOnGoing_) throw foundSentinel;
        }
      }
    }, $__proto, $__super, true);
    return $FindVisitor;
  }(ParseTreeVisitor);
  return Object.preventExtensions(Object.create(null, {FindVisitor: {
      get: function() {
        return FindVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_FindInFunctionScope_js = (function() {
  "use strict";
  var FindVisitor = $__src_codegeneration_FindVisitor_js.FindVisitor;
  var FindInFunctionScope = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FindInFunctionScope = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      visitFunction: function(tree) {},
      visitSetAccessor: function(tree) {},
      visitGetAccessor: function(tree) {},
      visitPropertyMethodAssignment: function(tree) {}
    }, $__proto, $__super, false);
    return $FindInFunctionScope;
  }(FindVisitor);
  return Object.preventExtensions(Object.create(null, {FindInFunctionScope: {
      get: function() {
        return FindInFunctionScope;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_PrependStatements_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION;
  var STRING = $__src_syntax_TokenType_js.STRING;
  function isStringExpressionStatement(tree) {
    return tree.type === EXPRESSION_STATEMENT && tree.expression.type === LITERAL_EXPRESSION && tree.expression.literalToken.type === STRING;
  }
  function prependStatements(statements) {
    for (var statementsToPrepend = [], $__7 = 1; $__7 < arguments.length; $__7++) statementsToPrepend[$__7 - 1] = arguments[$__7];
    if (!statements.length) return statementsToPrepend;
    if (!statementsToPrepend.length) return statements;
    var transformed = [];
    var inProlog = true;
    statements.forEach((function(statement) {
      var $__10;
      if (inProlog && !isStringExpressionStatement(statement)) {
        ($__10 = transformed).push.apply($__10, $__toObject(statementsToPrepend));
        inProlog = false;
      }
      transformed.push(statement);
    }));
    return transformed;
  }
  return Object.preventExtensions(Object.create(null, {prependStatements: {
      get: function() {
        return prependStatements;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_TempVarTransformer_js = (function() {
  "use strict";
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_trees_ParseTrees_js, ModuleDefinition = $__9.ModuleDefinition, Program = $__9.Program;
  var VAR = $__src_syntax_TokenType_js.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBlock = $__9.createBlock, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var prependStatements = $__src_codegeneration_PrependStatements_js.prependStatements;
  function getVars(self) {
    var vars = self.tempVarStack_[self.tempVarStack_.length - 1];
    if (!vars) throw new Error('Invalid use of addTempVar');
    return vars;
  }
  var TempVarStatement = function() {
    var $TempVarStatement = ($__createClassNoExtends)({constructor: function(name, initializer) {
        this.name = name;
        this.initializer = initializer;
      }});
    return $TempVarStatement;
  }();
  var TempVarTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TempVarTransformer = ($__createClass)({
      constructor: function(identifierGenerator) {
        $__superCall(this, $__proto, "constructor", []);
        this.identifierGenerator = identifierGenerator;
        this.tempVarStack_ = [[]];
        this.tempIdentifierStack_ = [[]];
        this.pool_ = [];
      },
      transformStatements_: function(statements) {
        this.tempVarStack_.push([]);
        var transformedStatements = this.transformList(statements);
        var vars = this.tempVarStack_.pop();
        if (!vars.length) return transformedStatements;
        var seenNames = Object.create(null);
        vars = vars.filter((function(tempVarStatement) {
          var $__9 = tempVarStatement, name = $__9.name, initializer = $__9.initializer;
          if (name in seenNames) {
            if (seenNames[name].initializer || initializer) throw new Error('Invalid use of TempVarTransformer');
            return false;
          }
          seenNames[name] = tempVarStatement;
          return true;
        }));
        var variableStatement = createVariableStatement(createVariableDeclarationList(VAR, vars.map((function($__9) {
          var name = $__9.name, initializer = $__9.initializer;
          return createVariableDeclaration(name, initializer);
        }))));
        return prependStatements(transformedStatements, variableStatement);
      },
      transformProgram: function(tree) {
        var programElements = this.transformStatements_(tree.programElements);
        if (programElements == tree.programElements) {
          return tree;
        }
        return new Program(tree.location, programElements);
      },
      transformFunctionBody: function(tree) {
        this.pushTempVarState();
        var statements = this.transformStatements_(tree.statements);
        this.popTempVarState();
        if (statements == tree.statements) return tree;
        return createBlock(statements);
      },
      transformModuleDefinition: function(tree) {
        this.pushTempVarState();
        var elements = this.transformStatements_(tree.elements);
        this.popTempVarState();
        if (elements == tree.elements) return tree;
        return new ModuleDefinition(tree.location, tree.name, elements);
      },
      getTempIdentifier: function() {
        var name = this.pool_.length ? this.pool_.pop(): this.identifierGenerator.generateUniqueIdentifier();
        this.tempIdentifierStack_[this.tempIdentifierStack_.length - 1].push(name);
        return name;
      },
      addTempVar: function(opt_initializer) {
        var vars = getVars(this);
        var uid = this.getTempIdentifier();
        vars.push(new TempVarStatement(uid, opt_initializer || null));
        return uid;
      },
      pushTempVarState: function() {
        this.tempIdentifierStack_.push([]);
      },
      popTempVarState: function() {
        this.tempIdentifierStack_.pop().forEach(this.release_, this);
      },
      release_: function(name) {
        this.pool_.push(name);
      }
    }, $__proto, $__super, true);
    return $TempVarTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {TempVarTransformer: {
      get: function() {
        return TempVarTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ComprehensionTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, ARGUMENTS = $__9.ARGUMENTS, THIS = $__9.THIS;
  var AlphaRenamer = $__src_codegeneration_AlphaRenamer_js.AlphaRenamer;
  var FindInFunctionScope = $__src_codegeneration_FindInFunctionScope_js.FindInFunctionScope;
  var FunctionExpression = $__src_syntax_trees_ParseTrees_js.FunctionExpression;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, LET = $__9.LET, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createEmptyParameterList = $__9.createEmptyParameterList, createForOfStatement = $__9.createForOfStatement, createIdentifierExpression = $__9.createIdentifierExpression, createIfStatement = $__9.createIfStatement, createParenExpression = $__9.createParenExpression, createThisExpression = $__9.createThisExpression, createVariableDeclarationList = $__9.createVariableDeclarationList;
  var ThisFinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ThisFinder = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      visitThisExpression: function(tree) {
        this.found = true;
      }
    }, $__proto, $__super, false);
    return $ThisFinder;
  }(FindInFunctionScope);
  var ArgumentsFinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArgumentsFinder = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      visitIdentifierExpression: function(tree) {
        if (tree.identifierToken.value === ARGUMENTS) this.found = true;
      }
    }, $__proto, $__super, false);
    return $ArgumentsFinder;
  }(FindInFunctionScope);
  var ComprehensionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ComprehensionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformComprehension: function(tree, statement, isGenerator, returnStatement) {
        var bindingKind = isGenerator ? VAR: LET;
        if (tree.ifExpression) {
          var ifExpression = this.transformAny(tree.ifExpression);
          statement = createIfStatement(ifExpression, statement);
        }
        for (var i = tree.comprehensionForList.length - 1; i >= 0; i--) {
          var item = tree.comprehensionForList[i];
          var left = this.transformAny(item.left);
          var iterator = this.transformAny(item.iterator);
          var initializer = createVariableDeclarationList(bindingKind, left, null);
          statement = createForOfStatement(initializer, iterator, statement);
        }
        var argumentsFinder = new ArgumentsFinder(statement);
        if (argumentsFinder.found) {
          var tempVar = this.addTempVar(createIdentifierExpression(ARGUMENTS));
          statement = AlphaRenamer.rename(statement, ARGUMENTS, tempVar);
        }
        var thisFinder = new ThisFinder(statement);
        if (thisFinder.found) {
          var tempVar = this.addTempVar(createThisExpression());
          statement = AlphaRenamer.rename(statement, THIS, tempVar);
        }
        var statements = [statement];
        if (returnStatement) statements.push(returnStatement);
        var func = new FunctionExpression(null, null, isGenerator, createEmptyParameterList(), createBlock(statements));
        return createParenExpression(createCallExpression(func));
      }
    }, $__proto, $__super, false);
    return $ComprehensionTransformer;
  }(TempVarTransformer);
  return Object.preventExtensions(Object.create(null, {ComprehensionTransformer: {
      get: function() {
        return ComprehensionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ArrayComprehensionTransformer_js = (function() {
  "use strict";
  var ComprehensionTransformer = $__src_codegeneration_ComprehensionTransformer_js.ComprehensionTransformer;
  var PLUS_PLUS = $__src_syntax_TokenType_js.PLUS_PLUS;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArrayLiteralExpression = $__9.createArrayLiteralExpression, createAssignmentStatement = $__9.createAssignmentStatement, createIdentifierExpression = $__9.createIdentifierExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createNumberLiteral = $__9.createNumberLiteral, createPostfixExpression = $__9.createPostfixExpression, createReturnStatement = $__9.createReturnStatement, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var ArrayComprehensionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrayComprehensionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformArrayComprehension: function(tree) {
        var expression = this.transformAny(tree.expression);
        var indexName = this.addTempVar(createNumberLiteral(0));
        var resultName = this.addTempVar(createArrayLiteralExpression([]));
        var resultIdentifier = createIdentifierExpression(resultName);
        var statement = createAssignmentStatement(createMemberLookupExpression(resultIdentifier, createPostfixExpression(createIdentifierExpression(indexName), PLUS_PLUS)), expression);
        var returnStatement = createReturnStatement(resultIdentifier);
        var isGenerator = false;
        return this.transformComprehension(tree, statement, isGenerator, returnStatement);
      }
    }, $__proto, $__super, false);
    return $ArrayComprehensionTransformer;
  }(ComprehensionTransformer);
  ArrayComprehensionTransformer.transformTree = function(identifierGenerator, tree) {
    return new ArrayComprehensionTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ArrayComprehensionTransformer: {
      get: function() {
        return ArrayComprehensionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ArrowFunctionTransformer_js = (function() {
  "use strict";
  var BIND = $__src_syntax_PredefinedName_js.BIND;
  var FindInFunctionScope = $__src_codegeneration_FindInFunctionScope_js.FindInFunctionScope;
  var $__9 = $__src_syntax_trees_ParseTrees_js, FormalParameterList = $__9.FormalParameterList, ThisExpression = $__9.ThisExpression;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var BLOCK = $__src_syntax_trees_ParseTreeType_js.BLOCK;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createFunctionExpression = $__9.createFunctionExpression, createMemberExpression = $__9.createMemberExpression, createParenExpression = $__9.createParenExpression, createReturnStatement = $__9.createReturnStatement, createThisExpression = $__9.createThisExpression;
  var ThisFinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ThisFinder = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      visitThisExpression: function(tree) {
        this.found = true;
      }
    }, $__proto, $__super, false);
    return $ThisFinder;
  }(FindInFunctionScope);
  var ArrowFunctionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ArrowFunctionTransformer = ($__createClass)({
      constructor: function(reporter) {
        $__superCall(this, $__proto, "constructor", []);
        this.reporter_ = reporter;
      },
      transformArrowFunctionExpression: function(tree) {
        var parameters;
        if (tree.formalParameters) {
          parameters = this.transformAny(tree.formalParameters).parameters;
        } else {
          parameters = [];
        }
        var functionBody = this.transformAny(tree.functionBody);
        if (functionBody.type != BLOCK) {
          functionBody = createBlock(createReturnStatement(functionBody));
        }
        var result = createParenExpression(createFunctionExpression(new FormalParameterList(null, parameters), functionBody));
        var finder = new ThisFinder(functionBody);
        if (finder.found) {
          return createCallExpression(createMemberExpression(result, BIND), createArgumentList(createThisExpression()));
        }
        return result;
      }
    }, $__proto, $__super, true);
    return $ArrowFunctionTransformer;
  }(ParseTreeTransformer);
  ArrowFunctionTransformer.transformTree = function(reporter, tree) {
    return new ArrowFunctionTransformer(reporter).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ArrowFunctionTransformer: {
      get: function() {
        return ArrowFunctionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_OperatorExpander_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, SUPER_EXPRESSION = $__9.SUPER_EXPRESSION;
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND = $__9.AMPERSAND, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, BAR = $__9.BAR, BAR_EQUAL = $__9.BAR_EQUAL, CARET = $__9.CARET, CARET_EQUAL = $__9.CARET_EQUAL, LEFT_SHIFT = $__9.LEFT_SHIFT, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, MINUS = $__9.MINUS, MINUS_EQUAL = $__9.MINUS_EQUAL, PERCENT = $__9.PERCENT, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PLUS = $__9.PLUS, PLUS_EQUAL = $__9.PLUS_EQUAL, RIGHT_SHIFT = $__9.RIGHT_SHIFT, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SLASH = $__9.SLASH, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR = $__9.STAR, STAR_EQUAL = $__9.STAR_EQUAL, UNSIGNED_RIGHT_SHIFT = $__9.UNSIGNED_RIGHT_SHIFT, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignmentExpression = $__9.createAssignmentExpression, createBinaryOperator = $__9.createBinaryOperator, createCommaExpression = $__9.createCommaExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createOperatorToken = $__9.createOperatorToken, createParenExpression = $__9.createParenExpression;
  function getBinaryOperator(type) {
    switch (type) {
      case STAR_EQUAL:
        return STAR;
      case SLASH_EQUAL:
        return SLASH;
      case PERCENT_EQUAL:
        return PERCENT;
      case PLUS_EQUAL:
        return PLUS;
      case MINUS_EQUAL:
        return MINUS;
      case LEFT_SHIFT_EQUAL:
        return LEFT_SHIFT;
      case RIGHT_SHIFT_EQUAL:
        return RIGHT_SHIFT;
      case UNSIGNED_RIGHT_SHIFT_EQUAL:
        return UNSIGNED_RIGHT_SHIFT;
      case AMPERSAND_EQUAL:
        return AMPERSAND;
      case CARET_EQUAL:
        return CARET;
      case BAR_EQUAL:
        return BAR;
      default:
        throw Error('unreachable');
    }
  }
  function expandMemberLookupExpression(tree, tempVarTransformer) {
    var tmp1;
    var expressions = [];
    if (tree.left.operand.type == SUPER_EXPRESSION || tree.left.operand.type == IDENTIFIER_EXPRESSION) {
      tmp1 = tree.left.operand;
    } else {
      tmp1 = createIdentifierExpression(tempVarTransformer.addTempVar());
      expressions.push(createAssignmentExpression(tmp1, tree.left.operand));
    }
    var tmp2 = createIdentifierExpression(tempVarTransformer.addTempVar());
    expressions.push(createAssignmentExpression(tmp2, tree.left.memberExpression), createAssignmentExpression(createMemberLookupExpression(tmp1, tmp2), createBinaryOperator(createMemberLookupExpression(tmp1, tmp2), createOperatorToken(getBinaryOperator(tree.operator.type)), tree.right)));
    return createParenExpression(createCommaExpression(expressions));
  }
  function expandMemberExpression(tree, tempVarTransformer) {
    var tmp;
    var expressions = [];
    if (tree.left.operand.type == SUPER_EXPRESSION || tree.left.operand.type == IDENTIFIER_EXPRESSION) {
      tmp = tree.left.operand;
    } else {
      tmp = createIdentifierExpression(tempVarTransformer.addTempVar());
      expressions.push(createAssignmentExpression(tmp, tree.left.operand));
    }
    expressions.push(createAssignmentExpression(createMemberExpression(tmp, tree.left.memberName), createBinaryOperator(createMemberExpression(tmp, tree.left.memberName), createOperatorToken(getBinaryOperator(tree.operator.type)), tree.right)));
    return createParenExpression(createCommaExpression(expressions));
  }
  return Object.preventExtensions(Object.create(null, {
    expandMemberLookupExpression: {
      get: function() {
        return expandMemberLookupExpression;
      },
      enumerable: true
    },
    expandMemberExpression: {
      get: function() {
        return expandMemberExpression;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_AtNameMemberTransformer_js = (function() {
  "use strict";
  var AtNameExpression = $__src_syntax_trees_ParseTrees_js.AtNameExpression;
  var $__9 = $__src_syntax_PredefinedName_js, DELETE_PROPERTY = $__9.DELETE_PROPERTY, GET_PROPERTY = $__9.GET_PROPERTY, RUNTIME = $__9.RUNTIME, SET_PROPERTY = $__9.SET_PROPERTY, TRACEUR = $__9.TRACEUR;
  var MEMBER_EXPRESSION = $__src_syntax_trees_ParseTreeType_js.MEMBER_EXPRESSION;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, AT_NAME = $__9.AT_NAME, DELETE = $__9.DELETE, EQUAL = $__9.EQUAL;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createCallCall = $__9.createCallCall, createCallExpression = $__9.createCallExpression, createCommaExpression = $__9.createCommaExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createParenExpression = $__9.createParenExpression;
  var expandMemberExpression = $__src_codegeneration_OperatorExpander_js.expandMemberExpression;
  var AtNameMemberTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AtNameMemberTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformBinaryOperator: function(tree) {
        if (tree.left.type === MEMBER_EXPRESSION && tree.left.memberName.type === AT_NAME && tree.operator.isAssignmentOperator()) {
          if (tree.operator.type !== EQUAL) {
            tree = expandMemberExpression(tree, this);
            return this.transformAny(tree);
          }
          var operand = this.transformAny(tree.left.operand);
          var memberName = tree.left.memberName;
          var atNameExpression = new AtNameExpression(memberName.location, memberName);
          var value = this.transformAny(tree.right);
          return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, SET_PROPERTY), createArgumentList(operand, atNameExpression, value));
        }
        return $__superCall(this, $__proto, "transformBinaryOperator", [tree]);
      },
      transformCallExpression: function(tree) {
        if (tree.operand.type !== MEMBER_EXPRESSION || tree.operand.memberName.type !== AT_NAME) return $__superCall(this, $__proto, "transformCallExpression", [tree]);
        var operand = this.transformAny(tree.operand.operand);
        var memberName = tree.operand.memberName;
        var ident = createIdentifierExpression(this.addTempVar());
        var elements = tree.args.args.map(this.transformAny, this);
        var atNameExpression = new AtNameExpression(memberName.location, memberName);
        var callExpr = createCallCall(createCallExpression(createMemberExpression(TRACEUR, RUNTIME, GET_PROPERTY), createArgumentList(ident, atNameExpression)), ident, elements);
        var expressions = [createAssignmentExpression(ident, operand), callExpr];
        return createParenExpression(createCommaExpression(expressions));
      },
      transformMemberExpression: function(tree) {
        if (tree.memberName.type !== AT_NAME) return $__superCall(this, $__proto, "transformMemberExpression", [tree]);
        var atNameExpression = new AtNameExpression(tree.memberName.location, tree.memberName);
        return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, GET_PROPERTY), createArgumentList(tree.operand, atNameExpression));
      },
      transformUnaryExpression: function(tree) {
        if (tree.operator.type !== DELETE || tree.operand.type !== MEMBER_EXPRESSION || tree.operand.memberName.type !== AT_NAME) {
          return $__superCall(this, $__proto, "transformUnaryExpression", [tree]);
        }
        var operand = this.transformAny(tree.operand.operand);
        var memberName = tree.operand.memberName;
        var atNameExpression = new AtNameExpression(memberName.location, memberName);
        return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, DELETE_PROPERTY), createArgumentList(operand, atNameExpression));
      }
    }, $__proto, $__super, false);
    return $AtNameMemberTransformer;
  }(TempVarTransformer);
  AtNameMemberTransformer.transformTree = function(identifierGenerator, tree) {
    return new AtNameMemberTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {AtNameMemberTransformer: {
      get: function() {
        return AtNameMemberTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_BlockBindingTransformer_js = (function() {
  "use strict";
  var AlphaRenamer = $__src_codegeneration_AlphaRenamer_js.AlphaRenamer;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BINDING_IDENTIFIER = $__9.BINDING_IDENTIFIER, BLOCK = $__9.BLOCK, FUNCTION_DECLARATION = $__9.FUNCTION_DECLARATION, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST;
  var $__9 = $__src_syntax_trees_ParseTrees_js, Block = $__9.Block, ClassDeclaration = $__9.ClassDeclaration, ForInStatement = $__9.ForInStatement, ForStatement = $__9.ForStatement, FunctionDeclaration = $__9.FunctionDeclaration, FunctionExpression = $__9.FunctionExpression, GetAccessor = $__9.GetAccessor, Program = $__9.Program, SetAccessor = $__9.SetAccessor, VariableDeclaration = $__9.VariableDeclaration, VariableDeclarationList = $__9.VariableDeclarationList, VariableStatement = $__9.VariableStatement;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_TokenType_js, CONST = $__9.CONST, LET = $__9.LET, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignmentExpression = $__9.createAssignmentExpression, createBindingIdentifier = $__9.createBindingIdentifier, createBlock = $__9.createBlock, createCatch = $__9.createCatch, createEmptyStatement = $__9.createEmptyStatement, createExpressionStatement = $__9.createExpressionStatement, createFinally = $__9.createFinally, createForInStatement = $__9.createForInStatement, createForStatement = $__9.createForStatement, createGetAccessor = $__9.createGetAccessor, createIdentifierExpression = $__9.createIdentifierExpression, createIdentifierToken = $__9.createIdentifierToken, createSetAccessor = $__9.createSetAccessor, createThrowStatement = $__9.createThrowStatement, createTryStatement = $__9.createTryStatement, createUndefinedExpression = $__9.createUndefinedExpression, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var ScopeType = {
    PROGRAM: 'PROGRAM',
    FUNCTION: 'FUNCTION',
    BLOCK: 'BLOCK'
  };
  var Scope = function() {
    var $Scope = ($__createClassNoExtends)({
      constructor: function(parent, type) {
        this.parent = parent;
        this.type = type;
        this.blockVariables = null;
      },
      addBlockScopedVariable: function(value) {
        if (!this.blockVariables) {
          this.blockVariables = Object.create(null);
        }
        this.blockVariables[value] = true;
      }
    });
    return $Scope;
  }();
  ;
  var Rename = function() {
    var $Rename = ($__createClassNoExtends)({constructor: function(oldName, newName) {
        this.oldName = oldName;
        this.newName = newName;
      }});
    return $Rename;
  }();
  function renameAll(renames, tree) {
    renames.forEach((function(rename) {
      tree = AlphaRenamer.rename(tree, rename.oldName, rename.newName);
    }));
    return tree;
  }
  function toBlock(statement) {
    return statement.type == BLOCK ? statement: createBlock(statement);
  }
  var BlockBindingTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BlockBindingTransformer = ($__createClass)({
      constructor: function(stateAllocator) {
        $__superCall(this, $__proto, "constructor", []);
        this.scope_ = null;
      },
      createProgramScope_: function() {
        return new Scope(this.scope_, ScopeType.PROGRAM);
      },
      createFunctionScope_: function() {
        if (this.scope_ == null) {
          throw new Error('Top level function scope found.');
        }
        return new Scope(this.scope_, ScopeType.FUNCTION);
      },
      createBlockScope_: function() {
        if (this.scope_ == null) {
          throw new Error('Top level block scope found.');
        }
        return new Scope(this.scope_, ScopeType.BLOCK);
      },
      push_: function(scope) {
        this.scope_ = scope;
        return scope;
      },
      pop_: function(scope) {
        if (this.scope_ != scope) {
          throw new Error('BlockBindingTransformer scope mismatch');
        }
        this.scope_ = scope.parent;
      },
      transformBlock: function(tree) {
        var scope = this.push_(this.createBlockScope_());
        var statements = this.transformList(tree.statements);
        if (scope.blockVariables != null) {
          tree = toBlock(this.rewriteAsCatch_(scope.blockVariables, createBlock(statements)));
        } else if (statements != tree.statements) {
          tree = createBlock(statements);
        }
        this.pop_(scope);
        return tree;
      },
      rewriteAsCatch_: function(blockVariables, statement) {
        for (var variable in blockVariables) {
          statement = createTryStatement(createBlock(createThrowStatement(createUndefinedExpression())), createCatch(createBindingIdentifier(variable), toBlock(statement)), null);
        }
        return statement;
      },
      transformClassDeclaration: function(tree) {
        throw new Error('ClassDeclaration should be transformed away.');
      },
      transformForInStatement: function(tree) {
        var treeBody = tree.body;
        var initializer;
        if (tree.initializer != null && tree.initializer.type == VARIABLE_DECLARATION_LIST) {
          var variables = tree.initializer;
          if (variables.declarations.length != 1) {
            throw new Error('for .. in has != 1 variables');
          }
          var variable = variables.declarations[0];
          var variableName = this.getVariableName_(variable);
          switch (variables.declarationType) {
            case LET:
            case CONST:
              {
                if (variable.initializer != null) {
                  throw new Error('const/let in for-in may not have an initializer');
                }
                initializer = createVariableDeclarationList(VAR, ("$" + variableName), null);
                treeBody = this.prependToBlock_(createVariableStatement(LET, variableName, createIdentifierExpression(("$" + variableName))), treeBody);
                break;
              }
            case VAR:
              initializer = this.transformVariables_(variables);
              break;
            default:
              throw new Error('Unreachable.');
          }
        } else {
          initializer = this.transformAny(tree.initializer);
        }
        var result = tree;
        var collection = this.transformAny(tree.collection);
        var body = this.transformAny(treeBody);
        if (initializer != tree.initializer || collection != tree.collection || body != tree.body) {
          result = createForInStatement(initializer, collection, body);
        }
        return result;
      },
      prependToBlock_: function(statement, body) {
        if (body.type == BLOCK) {
          var block = body;
          var list = $__spread([statement], block.statements);
          return createBlock(list);
        } else {
          return createBlock(statement, body);
        }
      },
      transformForStatement: function(tree) {
        var initializer;
        if (tree.initializer != null && tree.initializer.type == VARIABLE_DECLARATION_LIST) {
          var variables = tree.initializer;
          switch (variables.declarationType) {
            case LET:
            case CONST:
              return this.transformForLet_(tree, variables);
            case VAR:
              initializer = this.transformVariables_(variables);
              break;
            default:
              throw new Error('Reached unreachable.');
          }
        } else {
          initializer = this.transformAny(tree.initializer);
        }
        var condition = this.transformAny(tree.condition);
        var increment = this.transformAny(tree.increment);
        var body = this.transformAny(tree.body);
        var result = tree;
        if (initializer != tree.initializer || condition != tree.condition || increment != tree.increment || body != tree.body) {
          result = createForStatement(initializer, condition, increment, body);
        }
        return result;
      },
      transformForLet_: function(tree, variables) {
        var copyFwd = [];
        var copyBak = [];
        var hoisted = [];
        var renames = [];
        variables.declarations.forEach((function(variable) {
          var variableName = this.getVariableName_(variable);
          var hoistedName = ("$" + variableName);
          var initializer = renameAll(renames, variable.initializer);
          hoisted.push(createVariableDeclaration(hoistedName, initializer));
          copyFwd.push(createVariableDeclaration(variableName, createIdentifierExpression(hoistedName)));
          copyBak.push(createExpressionStatement(createAssignmentExpression(createIdentifierExpression(hoistedName), createIdentifierExpression(variableName))));
          renames.push(new Rename(variableName, hoistedName));
        }).bind(this));
        var condition = renameAll(renames, tree.condition);
        var increment = renameAll(renames, tree.increment);
        var transformedForLoop = createBlock(createVariableStatement(createVariableDeclarationList(LET, hoisted)), createForStatement(null, condition, increment, createBlock(createVariableStatement(createVariableDeclarationList(LET, copyFwd)), createTryStatement(tree.body, null, createFinally(createBlock(copyBak))))));
        return this.transformAny(transformedForLoop);
      },
      transformFunctionDeclaration: function(tree) {
        var body = this.transformFunctionBody(tree.functionBody);
        var formalParameterList = this.transformAny(tree.formalParameterList);
        if (this.scope_.type === ScopeType.BLOCK) {
          this.scope_.addBlockScopedVariable(tree.name.identifierToken.value);
          return createExpressionStatement(createAssignmentExpression(createIdentifierExpression(tree.name.identifierToken), new FunctionExpression(tree.location, null, tree.isGenerator, formalParameterList, body)));
        }
        if (body === tree.functionBody && formalParameterList === tree.formalParameterList) {
          return tree;
        }
        return new FunctionDeclaration(tree.location, tree.name, tree.isGenerator, formalParameterList, body);
      },
      transformProgram: function(tree) {
        var scope = this.push_(this.createProgramScope_());
        var result = $__superCall(this, $__proto, "transformProgram", [tree]);
        this.pop_(scope);
        return result;
      },
      transformVariableDeclaration: function(tree) {
        throw new Error('Should never see variable declaration tree.');
      },
      transformVariableDeclarationList: function(tree) {
        throw new Error('Should never see variable declaration list.');
      },
      transformVariableStatement: function(tree) {
        if (this.scope_.type == ScopeType.BLOCK) {
          switch (tree.declarations.declarationType) {
            case CONST:
            case LET:
              return this.transformBlockVariables_(tree.declarations);
            default:
              break;
          }
        }
        var variables = this.transformVariables_(tree.declarations);
        if (variables != tree.declarations) {
          tree = createVariableStatement(variables);
        }
        return tree;
      },
      transformBlockVariables_: function(tree) {
        var variables = tree.declarations;
        var comma = [];
        variables.forEach((function(variable) {
          switch (tree.declarationType) {
            case LET:
            case CONST:
              break;
            default:
              throw new Error('Only let/const allowed here.');
          }
          var variableName = this.getVariableName_(variable);
          this.scope_.addBlockScopedVariable(variableName);
          var initializer = this.transformAny(variable.initializer);
          if (initializer != null) {
            comma.push(createAssignmentExpression(createIdentifierExpression(variableName), initializer));
          }
        }).bind(this));
        switch (comma.length) {
          case 0:
            return createEmptyStatement();
          case 1:
            return createExpressionStatement(comma[0]);
          default:
            for (var i = 0; i < comma.length; i++) {
              comma[i] = createExpressionStatement(comma[i]);
            }
            return createBlock(comma);
        }
      },
      transformVariables_: function(tree) {
        var variables = tree.declarations;
        var transformed = null;
        for (var index = 0; index < variables.length; index++) {
          var variable = variables[index];
          var variableName = this.getVariableName_(variable);
          var initializer = this.transformAny(variable.initializer);
          if (transformed != null || initializer != variable.initializer) {
            if (transformed == null) {
              transformed = variables.slice(0, index);
            }
            transformed.push(createVariableDeclaration(createIdentifierToken(variableName), initializer));
          }
        }
        if (transformed != null || tree.declarationType != VAR) {
          var declarations = transformed != null ? transformed: tree.declarations;
          var declarationType = tree.declarationType != VAR ? VAR: tree.declarationType;
          tree = createVariableDeclarationList(declarationType, declarations);
        }
        return tree;
      },
      transformFunctionBody: function(body) {
        var scope = this.push_(this.createFunctionScope_());
        body = this.transformBlockStatements_(body);
        this.pop_(scope);
        return body;
      },
      transformBlockStatements_: function(tree) {
        var statements = this.transformSourceElements(tree.statements);
        if (this.scope_.blockVariables != null) {
          tree = toBlock(this.rewriteAsCatch_(this.scope_.blockVariables, createBlock(statements)));
        } else if (statements != tree.statements) {
          tree = createBlock(statements);
        }
        return tree;
      },
      getVariableName_: function(variable) {
        var lvalue = variable.lvalue;
        if (lvalue.type == BINDING_IDENTIFIER) {
          return lvalue.identifierToken.value;
        }
        throw new Error('Unexpected destructuring declaration found.');
      }
    }, $__proto, $__super, true);
    return $BlockBindingTransformer;
  }(ParseTreeTransformer);
  BlockBindingTransformer.transformTree = function(tree) {
    return new BlockBindingTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {BlockBindingTransformer: {
      get: function() {
        return BlockBindingTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_CascadeExpressionTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BINARY_OPERATOR = $__9.BINARY_OPERATOR, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION;
  var BinaryOperator = $__src_syntax_trees_ParseTrees_js.BinaryOperator;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignmentExpression = $__9.createAssignmentExpression, createBinaryOperator = $__9.createBinaryOperator, createCallExpression = $__9.createCallExpression, createCascadeExpression = $__9.createCascadeExpression, createCommaExpression = $__9.createCommaExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createParenExpression = $__9.createParenExpression;
  function prependMemberExpression(name, rest) {
    switch (rest.type) {
      case MEMBER_EXPRESSION:
        return createMemberExpression(prependMemberExpression(name, rest.operand), rest.memberName);
      case MEMBER_LOOKUP_EXPRESSION:
        return createMemberLookupExpression(prependMemberExpression(name, rest.operand), rest.memberExpression);
      case IDENTIFIER_EXPRESSION:
        return createMemberExpression(name, rest.identifierToken);
      case CALL_EXPRESSION:
        return createCallExpression(prependMemberExpression(name, rest.operand), rest.args);
      case CASCADE_EXPRESSION:
        return createCascadeExpression(prependMemberExpression(name, rest.operand), rest.expressions);
      default:
        throw Error('Not reachable');
    }
  }
  var CascadeExpressionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CascadeExpressionTransformer = ($__createClass)({
      constructor: function(identifierGenerator, reporter) {
        $__superCall(this, $__proto, "constructor", [identifierGenerator]);
        this.reporter_ = reporter;
      },
      transformCascadeExpression: function(tree) {
        var operand = this.transformAny(tree.operand);
        var ident = createIdentifierExpression(this.addTempVar());
        var expressions = this.transformList(tree.expressions.map(this.desugarExpression_.bind(this, ident)));
        expressions.unshift(createAssignmentExpression(ident, operand));
        expressions.push(ident);
        return createParenExpression(createCommaExpression(expressions));
      },
      desugarExpression_: function(ident, tree) {
        switch (tree.type) {
          case BINARY_OPERATOR:
            return this.desugarBinaryExpression_(ident, tree);
          case CALL_EXPRESSION:
            return this.desugarCallExpression_(ident, tree);
          case CASCADE_EXPRESSION:
            return this.desugarCascadeExpression_(ident, tree);
          default:
            this.reporter_.reportError(tree.location.start, 'Unsupported expression type in cascade: %s', tree.type);
        }
      },
      desugarBinaryExpression_: function(ident, tree) {
        return createBinaryOperator(prependMemberExpression(ident, tree.left), tree.operator, tree.right);
      },
      desugarCallExpression_: function(ident, tree) {
        var newOperand = prependMemberExpression(ident, tree.operand);
        return createCallExpression(newOperand, tree.args);
      },
      desugarCascadeExpression_: function(ident, tree) {
        var newOperand = prependMemberExpression(ident, tree.operand);
        return createCascadeExpression(newOperand, tree.expressions);
      }
    }, $__proto, $__super, true);
    return $CascadeExpressionTransformer;
  }(TempVarTransformer);
  CascadeExpressionTransformer.transformTree = function(identifierGenerator, reporter, tree) {
    return new CascadeExpressionTransformer(identifierGenerator, reporter).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {CascadeExpressionTransformer: {
      get: function() {
        return CascadeExpressionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_ArrayMap_js = (function() {
  "use strict";
  var ArrayMap = function() {
    var $ArrayMap = ($__createClassNoExtends)({
      constructor: function() {
        this.values_ = [];
        this.keys_ = [];
      },
      has: function(key) {
        return this.keys_.indexOf(key) != - 1;
      },
      get: function(key) {
        var index = this.keys_.indexOf(key);
        if (index == - 1) {
          return undefined;
        }
        return this.values_[index];
      },
      set: function(key, value) {
        var index = this.keys_.indexOf(key);
        if (index == - 1) {
          this.keys_.push(key);
          this.values_.push(value);
        } else {
          this.values_[index] = value;
        }
      },
      addAll: function(other) {
        var keys = other.keys();
        var values = other.values();
        for (var i = 0; i < keys.length; i++) {
          this.set(keys[i], values[i]);
        }
      },
      remove: function(key) {
        var index = this.keys_.indexOf(key);
        if (index == - 1) {
          return;
        }
        this.keys_.splice(index, 1);
        this.values_.splice(index, 1);
      },
      keys: function() {
        return this.keys_.concat();
      },
      values: function() {
        return this.values_.concat();
      }
    });
    return $ArrayMap;
  }();
  return Object.preventExtensions(Object.create(null, {ArrayMap: {
      get: function() {
        return ArrayMap;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_LineNumberTable_js = (function() {
  "use strict";
  var SourcePosition = $__src_util_SourcePosition_js.SourcePosition;
  var SourceRange = $__src_util_SourceRange_js.SourceRange;
  var isLineTerminator = $__src_syntax_Scanner_js.isLineTerminator;
  var MAX_INT_REPRESENTATION = 9007199254740992;
  function computeLineStartOffsets(source) {
    var lineStartOffsets = [0];
    var k = 1;
    for (var index = 0; index < source.length; index++) {
      var code = source.charCodeAt(index);
      if (isLineTerminator(code)) {
        if (code === 13 && source.charCodeAt(index + 1) === 10) {
          index++;
        }
        lineStartOffsets[k++] = index + 1;
      }
    }
    lineStartOffsets[k++] = MAX_INT_REPRESENTATION;
    return lineStartOffsets;
  }
  var LineNumberTable = function() {
    var $LineNumberTable = ($__createClassNoExtends)({
      constructor: function(sourceFile) {
        this.sourceFile_ = sourceFile;
        this.lineStartOffsets_ = null;
        this.lastLine_ = 0;
        this.lastOffset_ = - 1;
      },
      ensureLineStartOffsets_: function() {
        if (!this.lineStartOffsets_) {
          this.lineStartOffsets_ = computeLineStartOffsets(this.sourceFile_.contents);
        }
      },
      getSourcePosition: function(offset) {
        return new SourcePosition(this.sourceFile_, offset);
      },
      getLine: function(offset) {
        if (offset === this.lastOffset_) return this.lastLine_;
        this.ensureLineStartOffsets_();
        var line;
        if (offset < this.lastOffset_) {
          for (var i = this.lastLine_; i >= 0; i--) {
            if (this.lineStartOffsets_[i] <= offset) {
              line = i;
              break;
            }
          }
        } else {
          for (var i = this.lastLine_; true; i++) {
            if (this.lineStartOffsets_[i] > offset) {
              line = i - 1;
              break;
            }
          }
        }
        this.lastLine_ = line;
        this.lastOffset_ = offset;
        return line;
      },
      offsetOfLine: function(line) {
        this.ensureLineStartOffsets_();
        return this.lineStartOffsets_[line];
      },
      getColumn: function(offset) {
        var line = this.getLine(offset);
        return offset - this.lineStartOffsets_[line];
      },
      getSourceRange: function(startOffset, endOffset) {
        return new SourceRange(this.getSourcePosition(startOffset), this.getSourcePosition(endOffset));
      }
    });
    return $LineNumberTable;
  }();
  return Object.preventExtensions(Object.create(null, {LineNumberTable: {
      get: function() {
        return LineNumberTable;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_SourceFile_js = (function() {
  "use strict";
  var LineNumberTable = $__src_syntax_LineNumberTable_js.LineNumberTable;
  var SourceFile = function() {
    var $SourceFile = ($__createClassNoExtends)({constructor: function(name, contents) {
        this.name = name;
        this.contents = contents;
        this.lineNumberTable = new LineNumberTable(this);
        this.uid = traceur.getUid();
      }});
    return $SourceFile;
  }();
  return Object.preventExtensions(Object.create(null, {SourceFile: {
      get: function() {
        return SourceFile;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_PlaceholderParser_js = (function() {
  "use strict";
  var ArrayMap = $__src_util_ArrayMap_js.ArrayMap;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BLOCK = $__9.BLOCK, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION;
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var MutedErrorReporter = $__src_util_MutedErrorReporter_js.MutedErrorReporter;
  var ParseTree = $__src_syntax_trees_ParseTree_js.ParseTree;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var Parser = $__src_syntax_Parser_js.Parser;
  var $__9 = $__src_syntax_trees_ParseTrees_js, PropertyMethodAssignment = $__9.PropertyMethodAssignment, PropertyNameAssignment = $__9.PropertyNameAssignment, PropertyNameShorthand = $__9.PropertyNameShorthand;
  var Scanner = $__src_syntax_Scanner_js.Scanner;
  var SourceFile = $__src_syntax_SourceFile_js.SourceFile;
  var IDENTIFIER = $__src_syntax_TokenType_js.IDENTIFIER;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBindingIdentifier = $__9.createBindingIdentifier, createBooleanLiteral = $__9.createBooleanLiteral, createExpressionStatement = $__9.createExpressionStatement, createIdentifierExpression = $__9.createIdentifierExpression, createIdentifierToken = $__9.createIdentifierToken, createMemberExpression = $__9.createMemberExpression, createNullLiteral = $__9.createNullLiteral, createNumberLiteral = $__9.createNumberLiteral, createStringLiteral = $__9.createStringLiteral, createVoid0 = $__9.createVoid0;
  var NOT_FOUND = {};
  var PREFIX = '$__placeholder__';
  var cache = new ArrayMap();
  function parseExpression(sourceLiterals) {
    for (var values = [], $__7 = 1; $__7 < arguments.length; $__7++) values[$__7 - 1] = arguments[$__7];
    return parse(sourceLiterals, values, (function() {
      return new PlaceholderParser().parseExpression(sourceLiterals);
    }));
  }
  function parseStatement(sourceLiterals) {
    for (var values = [], $__6 = 1; $__6 < arguments.length; $__6++) values[$__6 - 1] = arguments[$__6];
    return parse(sourceLiterals, values, (function() {
      return new PlaceholderParser().parseStatement(sourceLiterals);
    }));
  }
  function parsePropertyDefinition(sourceLiterals) {
    for (var values = [], $__8 = 1; $__8 < arguments.length; $__8++) values[$__8 - 1] = arguments[$__8];
    return parse(sourceLiterals, values, (function() {
      return new PlaceholderParser().parsePropertyDefinition(sourceLiterals);
    }));
  }
  function parse(sourceLiterals, values, doParse) {
    var tree = cache.get(sourceLiterals);
    if (!tree) {
      tree = doParse();
      cache.set(sourceLiterals, tree);
    }
    if (!values.length) return tree;
    return new PlaceholderTransformer(values).transformAny(tree);
  }
  var PlaceholderParser = function() {
    var $PlaceholderParser = ($__createClassNoExtends)({
      constructor: function() {},
      parseExpression: function(sourceLiterals) {
        return this.parse_(sourceLiterals, (function(p) {
          return p.parseExpression();
        }));
      },
      parseStatement: function(sourceLiterals) {
        return this.parse_(sourceLiterals, (function(p) {
          return p.parseStatement();
        }));
      },
      parsePropertyDefinition: function(sourceLiterals) {
        return this.parse_(sourceLiterals, (function(p) {
          return p.parsePropertyDefinition();
        }));
      },
      parse_: function(sourceLiterals, doParse) {
        var source = sourceLiterals[0];
        for (var i = 1; i < sourceLiterals.length; i++) {
          source += PREFIX + (i - 1) + sourceLiterals[i];
        }
        var file = new SourceFile('parse@TemplateParser', source);
        var errorReporter = new MutedErrorReporter();
        var parser = new Parser(errorReporter, file);
        var tree = doParse(parser);
        if (errorReporter.hadError() || !tree || !parser.isAtEnd()) throw new Error(("Internal error trying to parse:\n\n" + source));
        return tree;
      }
    });
    return $PlaceholderParser;
  }();
  function convertValueToExpression(value) {
    if (value instanceof ParseTree) return value;
    if (value instanceof IdentifierToken) return createIdentifierExpression(value);
    if (value === null) return createNullLiteral();
    if (value === undefined) return createVoid0();
    switch (typeof value) {
      case 'string':
        return createStringLiteral(value);
      case 'boolean':
        return createBooleanLiteral(value);
      case 'number':
        return createNumberLiteral(value);
    }
    throw new Error('Not implemented');
  }
  function convertValueToIdentifierToken(value) {
    if (value instanceof IdentifierToken) return value;
    return createIdentifierToken(value);
  }
  var PlaceholderTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PlaceholderTransformer = ($__createClass)({
      constructor: function(values) {
        $__superCall(this, $__proto, "constructor", []);
        this.values = values;
      },
      getValueAt: function(index) {
        return this.values[index];
      },
      getValue_: function(str) {
        if (str.indexOf(PREFIX) !== 0) return NOT_FOUND;
        return this.getValueAt(Number(str.slice(PREFIX.length)));
      },
      transformIdentifierExpression: function(tree) {
        var value = this.getValue_(tree.identifierToken.value);
        if (value === NOT_FOUND) return tree;
        return convertValueToExpression(value);
      },
      transformBindingIdentifier: function(tree) {
        var value = this.getValue_(tree.identifierToken.value);
        if (value === NOT_FOUND) return tree;
        return createBindingIdentifier(value);
      },
      transformExpressionStatement: function(tree) {
        if (tree.expression.type === IDENTIFIER_EXPRESSION) {
          var transformedExpression = this.transformIdentifierExpression(tree.expression);
          if (transformedExpression === tree.expression) return tree;
          if (transformedExpression.isStatement()) return transformedExpression;
          return createExpressionStatement(transformedExpression);
        }
        return $__superCall(this, $__proto, "transformExpressionStatement", [tree]);
      },
      transformBlock: function(tree) {
        if (tree.statements.length === 1 && tree.statements[0].type === EXPRESSION_STATEMENT) {
          var transformedStatement = this.transformExpressionStatement(tree.statements[0]);
          if (transformedStatement === tree.statements[0]) return tree;
          if (transformedStatement.type === BLOCK) return transformedStatement;
        }
        return $__superCall(this, $__proto, "transformBlock", [tree]);
      },
      transformMemberExpression: function(tree) {
        var value = this.getValue_(tree.memberName.value);
        if (value === NOT_FOUND) return $__superCall(this, $__proto, "transformMemberExpression", [tree]);
        var operand = this.transformAny(tree.operand);
        return createMemberExpression(operand, value);
      },
      transformPropertyMethodAssignment: function(tree) {
        if (tree.name.type === IDENTIFIER) {
          var value = this.getValue_(tree.name.value);
          if (value !== NOT_FOUND) {
            return new PropertyMethodAssignment(null, convertValueToIdentifierToken(value), tree.isGenerator, this.transformAny(tree.formalParameterList), this.transformAny(tree.functionBody));
          }
        }
        return $__superCall(this, $__proto, "transformPropertyMethodAssignment", [tree]);
      },
      transformPropertyNameAssignment: function(tree) {
        if (tree.name.type === IDENTIFIER) {
          var value = this.getValue_(tree.name.value);
          if (value !== NOT_FOUND) {
            return new PropertyNameAssignment(null, convertValueToIdentifierToken(value), this.transformAny(tree.value));
          }
        }
        return $__superCall(this, $__proto, "transformPropertyNameAssignment", [tree]);
      },
      transformPropertyNameShorthand: function(tree) {
        var value = this.getValue_(tree.name.value);
        if (value !== NOT_FOUND) {
          if (value instanceof ParseTree) return value;
          return new PropertyNameShorthand(null, convertValueToIdentifierToken(value));
        }
        return $__superCall(this, $__proto, "transformPropertyNameShorthand", [tree]);
      }
    }, $__proto, $__super, true);
    return $PlaceholderTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {
    parseExpression: {
      get: function() {
        return parseExpression;
      },
      enumerable: true
    },
    parseStatement: {
      get: function() {
        return parseStatement;
      },
      enumerable: true
    },
    parsePropertyDefinition: {
      get: function() {
        return parsePropertyDefinition;
      },
      enumerable: true
    },
    PlaceholderParser: {
      get: function() {
        return PlaceholderParser;
      },
      enumerable: true
    },
    PlaceholderTransformer: {
      get: function() {
        return PlaceholderTransformer;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_SuperTransformer_js = (function() {
  "use strict";
  var $__0 = Object.freeze(Object.defineProperties(["", "(", ",\n                                               ", ",\n                                               ", ",\n                                               ", ")"], {raw: {value: Object.freeze(["", "(", ",\n                                               ", ",\n                                               ", ",\n                                               ", ")"])}})), $__1 = Object.freeze(Object.defineProperties(["", "(", ",\n                                              ", ",\n                                              ", ")"], {raw: {value: Object.freeze(["", "(", ",\n                                              ", ",\n                                              ", ")"])}})), $__2 = Object.freeze(Object.defineProperties(["", "(", ",\n                                                ", ",\n                                                ", ",\n                                                ", ")"], {raw: {value: Object.freeze(["", "(", ",\n                                                ", ",\n                                                ", ",\n                                                ", ")"])}}));
  var $__9 = $__src_syntax_trees_ParseTreeType_js, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, SUPER_EXPRESSION = $__9.SUPER_EXPRESSION;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_PredefinedName_js, RUNTIME = $__9.RUNTIME, SUPER_CALL = $__9.SUPER_CALL, SUPER_GET = $__9.SUPER_GET, SUPER_SET = $__9.SUPER_SET, TRACEUR = $__9.TRACEUR;
  var EQUAL = $__src_syntax_TokenType_js.EQUAL;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createArrayLiteralExpression = $__9.createArrayLiteralExpression, createCallExpression = $__9.createCallExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createStringLiteral = $__9.createStringLiteral, createThisExpression = $__9.createThisExpression;
  var $__9 = $__src_codegeneration_OperatorExpander_js, expandMemberExpression = $__9.expandMemberExpression, expandMemberLookupExpression = $__9.expandMemberLookupExpression;
  var parseExpression = $__src_codegeneration_PlaceholderParser_js.parseExpression;
  var SUPER_DESCRIPTOR_CODE = "function (proto, name) {\n      if (!proto)\n        throw new TypeError('super is null');\n      return Object.getPropertyDescriptor(proto, name);\n    }";
  var SUPER_CALL_CODE = "function(self, proto, name, args) {\n      var descriptor = %superDescriptor(proto, name);\n      if (descriptor) {\n        if ('value' in descriptor)\n          return descriptor.value.apply(self, args);\n        if (descriptor.get)\n          return descriptor.get.call(self).apply(self, args);\n      }\n      throw new TypeError(\"Object has no method '\" + name + \"'.\");\n    }";
  var SUPER_GET_CODE = "function(self, proto, name) {\n      var descriptor = %superDescriptor(proto, name);\n      if (descriptor) {\n        if (descriptor.get)\n          return descriptor.get.call(self);\n        else if ('value' in descriptor)\n          return descriptor.value;\n      }\n      return undefined;\n    }";
  var SUPER_SET_CODE = "function(self, proto, name, value) {\n      var descriptor = %superDescriptor(proto, name);\n      if (descriptor && descriptor.set) {\n        descriptor.set.call(self, value);\n        return;\n      }\n      throw new TypeError(\"Object has no setter '\" + name + \"'.\");\n    }";
  var SuperTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SuperTransformer = ($__createClass)({
      constructor: function(tempVarTransformer, runtimeInliner, reporter, protoName, methodTree, thisName) {
        this.tempVarTransformer_ = tempVarTransformer;
        this.runtimeInliner_ = runtimeInliner;
        this.reporter_ = reporter;
        this.protoName_ = protoName;
        this.method_ = methodTree;
        this.superCount_ = 0;
        this.thisVar_ = createIdentifierExpression(thisName);
        this.inNestedFunc_ = 0;
        this.nestedSuperCount_ = 0;
      },
      get hasSuper() {
        return this.superCount_ > 0;
      },
      get nestedSuper() {
        return this.nestedSuperCount_ > 0;
      },
      transformFunction: function(tree) {
        var oldSuperCount = this.superCount_;
        this.inNestedFunc_++;
        var transformedTree = $__superCall(this, $__proto, "transformFunction", [tree]);
        this.inNestedFunc_--;
        if (oldSuperCount !== this.superCount_) this.nestedSuperCount_ += this.superCount_ - oldSuperCount;
        return transformedTree;
      },
      transformGetAccessor: function(tree) {
        return tree;
      },
      transformSetAccessor: function(tree) {
        return tree;
      },
      transformPropertyMethodAssignMent: function(tree) {
        return tree;
      },
      transformCallExpression: function(tree) {
        if (this.method_ && tree.operand.type == SUPER_EXPRESSION) {
          this.superCount_++;
          var methodName = this.method_.name.value;
          return this.createSuperCallExpression_(methodName, tree);
        }
        if ((tree.operand.type == MEMBER_EXPRESSION || tree.operand.type == MEMBER_LOOKUP_EXPRESSION) && tree.operand.operand.type == SUPER_EXPRESSION) {
          this.superCount_++;
          var name;
          if (tree.operand.type == MEMBER_EXPRESSION) name = tree.operand.memberName.value; else name = tree.operand.memberExpression;
          return this.createSuperCallExpression_(name, tree);
        }
        return $__superCall(this, $__proto, "transformCallExpression", [tree]);
      },
      createSuperCallExpression_: function(methodName, tree) {
        var thisExpr = this.inNestedFunc_ ? this.thisVar_: createThisExpression();
        var args = createArrayLiteralExpression(tree.args.args);
        return this.createSuperCallExpression(thisExpr, this.protoName_, methodName, args);
      },
      createSuperCallExpression: function(thisExpr, protoName, methodName, args) {
        return parseExpression($__0, this.superCall_, thisExpr, protoName, methodName, args);
      },
      get superGet_() {
        this.runtimeInliner_.register('superDescriptor', SUPER_DESCRIPTOR_CODE);
        return this.runtimeInliner_.get('superGet', SUPER_GET_CODE);
      },
      get superSet_() {
        this.runtimeInliner_.register('superDescriptor', SUPER_DESCRIPTOR_CODE);
        return this.runtimeInliner_.get('superSet', SUPER_SET_CODE);
      },
      get superCall_() {
        this.runtimeInliner_.register('superDescriptor', SUPER_DESCRIPTOR_CODE);
        return this.runtimeInliner_.get('superCall', SUPER_CALL_CODE);
      },
      transformMemberShared_: function(tree, name) {
        var thisExpr = this.inNestedFunc_ ? this.thisVar_: createThisExpression();
        return parseExpression($__1, this.superGet_, thisExpr, this.protoName_, name);
      },
      transformMemberExpression: function(tree) {
        if (tree.operand.type === SUPER_EXPRESSION) {
          this.superCount_++;
          return this.transformMemberShared_(tree, createStringLiteral(tree.memberName.value));
        }
        return $__superCall(this, $__proto, "transformMemberExpression", [tree]);
      },
      transformMemberLookupExpression: function(tree) {
        if (tree.operand.type === SUPER_EXPRESSION) return this.transformMemberShared_(tree, tree.memberExpression);
        return $__superCall(this, $__proto, "transformMemberLookupExpression", [tree]);
      },
      transformBinaryOperator: function(tree) {
        if (tree.operator.isAssignmentOperator() && (tree.left.type === MEMBER_EXPRESSION || tree.left.type === MEMBER_LOOKUP_EXPRESSION) && tree.left.operand.type === SUPER_EXPRESSION) {
          if (tree.operator.type !== EQUAL) {
            if (tree.left.type === MEMBER_LOOKUP_EXPRESSION) {
              tree = expandMemberLookupExpression(tree, this.tempVarTransformer_);
            } else {
              tree = expandMemberExpression(tree, this.tempVarTransformer_);
            }
            return this.transformAny(tree);
          }
          this.superCount_++;
          var name = tree.left.type === MEMBER_LOOKUP_EXPRESSION ? tree.left.memberExpression: createStringLiteral(tree.left.memberName.value);
          var thisExpr = this.inNestedFunc_ ? this.thisVar_: createThisExpression();
          var right = this.transformAny(tree.right);
          return parseExpression($__2, this.superSet_, thisExpr, this.protoName_, name, right);
        }
        return $__superCall(this, $__proto, "transformBinaryOperator", [tree]);
      },
      transformSuperExpression: function(tree) {
        this.reportError_(tree, '"super" may only be used on the LHS of a member ' + 'access expression before a call (TODO wording)');
        return tree;
      },
      reportError_: function(tree) {
        var $__10;
        for (var args = [], $__8 = 1; $__8 < arguments.length; $__8++) args[$__8 - 1] = arguments[$__8];
        ($__10 = this.reporter_).reportError.apply($__10, $__spread([tree.location.start], args));
      }
    }, $__proto, $__super, true);
    return $SuperTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {SuperTransformer: {
      get: function() {
        return SuperTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ClassTransformer_js = (function() {
  "use strict";
  var $__2 = Object.freeze(Object.defineProperties(["function($__super) {\n        var $__proto = ", "($__super);\n        var ", " =\n            (", ")(", ", $__proto, $__super, ", ");\n        return ", ";\n      }(", ")"], {raw: {value: Object.freeze(["function($__super) {\n        var $__proto = ", "($__super);\n        var ", " =\n            (", ")(", ", $__proto, $__super, ", ");\n        return ", ";\n      }(", ")"])}})), $__1 = Object.freeze(Object.defineProperties(["function() {\n      var ", " = (", ")(", ");\n      return ", ";\n    }()"], {raw: {value: Object.freeze(["function() {\n      var ", " = (", ")(", ");\n      return ", ";\n    }()"])}})), $__0 = Object.freeze(Object.defineProperties(["constructor: function() {}"], {raw: {value: Object.freeze(["constructor: function() {}"])}})), $__3 = Object.freeze(Object.defineProperties(["constructor: function() {\n      ", ";\n    }"], {raw: {value: Object.freeze(["constructor: function() {\n      ", ";\n    }"])}}));
  var $__9 = $__src_syntax_PredefinedName_js, CONSTRUCTOR = $__9.CONSTRUCTOR, CREATE_CLASS = $__9.CREATE_CLASS, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var $__9 = $__src_syntax_trees_ParseTrees_js, FormalParameterList = $__9.FormalParameterList, GetAccessor = $__9.GetAccessor, PropertyMethodAssignment = $__9.PropertyMethodAssignment, PropertyNameAssignment = $__9.PropertyNameAssignment, SetAccessor = $__9.SetAccessor, SuperExpression = $__9.SuperExpression;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, GET_ACCESSOR = $__9.GET_ACCESSOR, PROPERTY_METHOD_ASSIGNMENT = $__9.PROPERTY_METHOD_ASSIGNMENT, SET_ACCESSOR = $__9.SET_ACCESSOR;
  var SuperTransformer = $__src_codegeneration_SuperTransformer_js.SuperTransformer;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, LET = $__9.LET, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createBlock = $__9.createBlock, createBooleanLiteral = $__9.createBooleanLiteral, createCallExpression = $__9.createCallExpression, createExpressionStatement = $__9.createExpressionStatement, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createIdentifierToken = $__9.createIdentifierToken, createMemberExpression = $__9.createMemberExpression, createNullLiteral = $__9.createNullLiteral, createObjectLiteralExpression = $__9.createObjectLiteralExpression, createParenExpression = $__9.createParenExpression, createPropertyNameAssignment = $__9.createPropertyNameAssignment, createRestParameter = $__9.createRestParameter, createSpreadExpression = $__9.createSpreadExpression, createThisExpression = $__9.createThisExpression, createVariableStatement = $__9.createVariableStatement;
  var transformOptions = $__src_options_js.transformOptions;
  var $__9 = $__src_codegeneration_PlaceholderParser_js, parseExpression = $__9.parseExpression, parsePropertyDefinition = $__9.parsePropertyDefinition;
  var CREATE_CLASS_CODE = "function(object, protoParent, superClass, hasConstructor) {\n      var ctor = object.constructor;\n      if (typeof superClass === 'function') {\n        if (protoParent === null)\n          throw new TypeError();\n        ctor.__proto__ = superClass;\n      } else if (superClass === null && !hasConstructor) {\n        ctor = object.constructor = function() {};\n      }\n\n      var descriptors = {}, name, names = Object.getOwnPropertyNames(object);\n      for (var i = 0; i < names.length; i++) {\n        var name = names[i];\n        descriptors[name] = Object.getOwnPropertyDescriptor(object, name);\n      }\n      descriptors.constructor.enumerable = false;\n      ctor.prototype = Object.create(protoParent, descriptors);\n\n      return ctor;\n    }";
  var GET_PROTO_PARENT_CODE = "function(superClass) {\n      if (typeof superClass === 'function')\n        return superClass.prototype;\n      if (superClass === null)\n        return null;\n      if (Object(superClass) === superClass)\n        return superClass;\n      throw new TypeError();\n    }";
  var CREATE_CLASS_NO_EXTENDS_CODE = "function(object) {\n      var ctor = object.constructor;\n      Object.defineProperty(object, 'constructor', {enumerable: false});\n      ctor.prototype = object;\n      return ctor;\n    }";
  var ClassTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ClassTransformer = ($__createClass)({
      constructor: function(identifierGenerator, runtimeInliner, reporter) {
        $__superCall(this, $__proto, "constructor", [identifierGenerator]);
        this.runtimeInliner_ = runtimeInliner;
        this.reporter_ = reporter;
      },
      transformClassShared_: function(tree, name) {
        var superClass = this.transformAny(tree.superClass);
        var nameIdent = createIdentifierExpression(name);
        var protoName = createIdentifierExpression('$__proto');
        var hasConstructor = false;
        var elements = tree.elements.map((function(tree) {
          switch (tree.type) {
            case GET_ACCESSOR:
              return this.transformGetAccessor_(tree, protoName);
            case SET_ACCESSOR:
              return this.transformSetAccessor_(tree, protoName);
            case PROPERTY_METHOD_ASSIGNMENT:
              if (tree.name.value === CONSTRUCTOR) hasConstructor = true;
              return this.transformPropertyMethodAssignment_(tree, protoName);
            default:
              throw new Error(("Unexpected class element: " + tree.type));
          }
        }).bind(this));
        if (!hasConstructor) elements.unshift(this.getDefaultConstructor_(tree, superClass, protoName));
        var object = createObjectLiteralExpression(elements);
        if (superClass) {
          return parseExpression($__2, this.getProtoParent_, nameIdent, this.createClass_, object, hasConstructor, nameIdent, superClass);
        }
        return parseExpression($__1, nameIdent, this.createClassNoExtends_, object, nameIdent);
      },
      get createClass_() {
        return this.runtimeInliner_.get('createClass', CREATE_CLASS_CODE);
      },
      get getProtoParent_() {
        return this.runtimeInliner_.get('getProtoParent', GET_PROTO_PARENT_CODE);
      },
      get createClassNoExtends_() {
        return this.runtimeInliner_.get('createClassNoExtends', CREATE_CLASS_NO_EXTENDS_CODE);
      },
      transformClassDeclaration: function(tree) {
        var name = '$' + tree.name.identifierToken.value;
        return createVariableStatement(transformOptions.blockBinding ? LET: VAR, tree.name, this.transformClassShared_(tree, name));
      },
      transformClassExpression: function(tree) {
        var ident = tree.name ? tree.name.identifierToken.value: this.addTempVar();
        return this.transformClassShared_(tree, ident);
      },
      transformPropertyMethodAssignment_: function(tree, protoName) {
        var formalParameterList = this.transformAny(tree.formalParameterList);
        var functionBody = this.transformSuperInBlock_(tree, tree.functionBody, protoName);
        if (formalParameterList === tree.formalParameterList && functionBody === tree.functionBody) {
          return tree;
        }
        return new PropertyMethodAssignment(tree.location, tree.name, tree.isGenerator, formalParameterList, functionBody);
      },
      transformGetAccessor_: function(tree, protoName) {
        var body = this.transformSuperInBlock_(tree, tree.body, protoName);
        if (body === tree.body) return tree;
        return new GetAccessor(tree.location, tree.name, body);
      },
      transformSetAccessor_: function(tree, protoName) {
        var parameter = this.transformAny(tree.parameter);
        var body = this.transformSuperInBlock_(tree, tree.body, protoName);
        if (body === tree.body) return tree;
        return new SetAccessor(tree.location, tree.name, parameter, body);
      },
      transformSuperInBlock_: function(methodTree, tree, protoName) {
        this.pushTempVarState();
        var thisName = this.getTempIdentifier();
        var thisDecl = createVariableStatement(VAR, thisName, createThisExpression());
        var superTransformer = new SuperTransformer(this, this.runtimeInliner_, this.reporter_, protoName, methodTree, thisName);
        var transformedTree = superTransformer.transformBlock(this.transformBlock(tree));
        this.popTempVarState();
        if (superTransformer.nestedSuper) return createBlock([thisDecl].concat(transformedTree.statements));
        return transformedTree;
      },
      getDefaultConstructor_: function(tree, hasSuper, protoName) {
        if (!hasSuper) return parsePropertyDefinition($__0);
        var superTransformer = new SuperTransformer(this, this.runtimeInliner_, this.reporter_, protoName, null, null);
        var superCall = superTransformer.createSuperCallExpression(createThisExpression(), protoName, 'constructor', createIdentifierExpression('arguments'));
        return parsePropertyDefinition($__3, superCall);
      }
    }, $__proto, $__super, true);
    return $ClassTransformer;
  }(TempVarTransformer);
  ClassTransformer.transform = function(identifierGenerator, runtimeInliner, reporter, tree) {
    return new ClassTransformer(identifierGenerator, runtimeInliner, reporter).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ClassTransformer: {
      get: function() {
        return ClassTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_CollectionTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, ELEMENT_DELETE = $__9.ELEMENT_DELETE, ELEMENT_GET = $__9.ELEMENT_GET, ELEMENT_HAS = $__9.ELEMENT_HAS, ELEMENT_SET = $__9.ELEMENT_SET, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var MEMBER_LOOKUP_EXPRESSION = $__src_syntax_trees_ParseTreeType_js.MEMBER_LOOKUP_EXPRESSION;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, DELETE = $__9.DELETE, EQUAL = $__9.EQUAL, IN = $__9.IN;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createCallCall = $__9.createCallCall, createCallExpression = $__9.createCallExpression, createCommaExpression = $__9.createCommaExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createParenExpression = $__9.createParenExpression;
  var expandMemberLookupExpression = $__src_codegeneration_OperatorExpander_js.expandMemberLookupExpression;
  var CollectionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CollectionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformBinaryOperator: function(tree) {
        if (tree.operator.type === IN) {
          var name = this.transformAny(tree.left);
          var object = this.transformAny(tree.right);
          return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ELEMENT_HAS), createArgumentList(object, name));
        }
        if (tree.left.type === MEMBER_LOOKUP_EXPRESSION && tree.operator.isAssignmentOperator()) {
          if (tree.operator.type !== EQUAL) {
            tree = expandMemberLookupExpression(tree, this);
            return this.transformAny(tree);
          }
          var operand = this.transformAny(tree.left.operand);
          var memberExpression = this.transformAny(tree.left.memberExpression);
          var value = this.transformAny(tree.right);
          return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ELEMENT_SET), createArgumentList(operand, memberExpression, value));
        }
        return $__superCall(this, $__proto, "transformBinaryOperator", [tree]);
      },
      transformCallExpression: function(tree) {
        if (tree.operand.type !== MEMBER_LOOKUP_EXPRESSION) return $__superCall(this, $__proto, "transformCallExpression", [tree]);
        var operand = this.transformAny(tree.operand.operand);
        var memberExpression = this.transformAny(tree.operand.memberExpression);
        var ident = createIdentifierExpression(this.addTempVar());
        var elements = tree.args.args.map(this.transformAny, this);
        var callExpr = createCallCall(createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ELEMENT_GET), createArgumentList(ident, memberExpression)), ident, elements);
        var expressions = [createAssignmentExpression(ident, operand), callExpr];
        return createParenExpression(createCommaExpression(expressions));
      },
      transformMemberLookupExpression: function(tree) {
        return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ELEMENT_GET), createArgumentList(tree.operand, tree.memberExpression));
      },
      transformUnaryExpression: function(tree) {
        if (tree.operator.type !== DELETE || tree.operand.type !== MEMBER_LOOKUP_EXPRESSION) {
          return $__superCall(this, $__proto, "transformUnaryExpression", [tree]);
        }
        var operand = this.transformAny(tree.operand.operand);
        var memberExpression = this.transformAny(tree.operand.memberExpression);
        return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ELEMENT_DELETE), createArgumentList(operand, memberExpression));
      }
    }, $__proto, $__super, false);
    return $CollectionTransformer;
  }(TempVarTransformer);
  CollectionTransformer.transformTree = function(identifierGenerator, tree) {
    return new CollectionTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {CollectionTransformer: {
      get: function() {
        return CollectionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_DefaultParametersTransformer_js = (function() {
  "use strict";
  var FormalParameterList = $__src_syntax_trees_ParseTrees_js.FormalParameterList;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var ARGUMENTS = $__src_syntax_PredefinedName_js.ARGUMENTS;
  var REST_PARAMETER = $__src_syntax_trees_ParseTreeType_js.REST_PARAMETER;
  var $__9 = $__src_syntax_TokenType_js, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBinaryOperator = $__9.createBinaryOperator, createBlock = $__9.createBlock, createConditionalExpression = $__9.createConditionalExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createNumberLiteral = $__9.createNumberLiteral, createOperatorToken = $__9.createOperatorToken, createVariableStatement = $__9.createVariableStatement, createVoid0 = $__9.createVoid0;
  var prependStatements = $__src_codegeneration_PrependStatements_js.prependStatements;
  var stack = [];
  var DefaultParametersTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $DefaultParametersTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformFunction: function(tree) {
        stack.push([]);
        var transformedTree = $__superCall(this, $__proto, "transformFunction", [tree]);
        var statements = stack.pop();
        if (!statements.length) return transformedTree;
        statements = prependStatements.apply(null, $__spread([transformedTree.functionBody.statements], statements));
        return new tree.constructor(transformedTree.location, transformedTree.name, transformedTree.isGenerator, transformedTree.formalParameterList, createBlock(statements));
      },
      transformFormalParameterList: function(tree) {
        var parameters = [];
        var statements = stack[stack.length - 1];
        var changed = false;
        var defaultToUndefined = false;
        for (var i = 0; i < tree.parameters.length; i++) {
          var param = this.transformAny(tree.parameters[i]);
          if (param !== tree.parameters[i]) changed = true;
          if (param.type === REST_PARAMETER || !param.initializer && !defaultToUndefined) {
            parameters.push(param);
          } else {
            defaultToUndefined = true;
            changed = true;
            statements.push(createVariableStatement(VAR, param.binding, createConditionalExpression(createBinaryOperator(createMemberLookupExpression(createIdentifierExpression(ARGUMENTS), createNumberLiteral(i)), createOperatorToken(NOT_EQUAL_EQUAL), createVoid0()), createMemberLookupExpression(createIdentifierExpression(ARGUMENTS), createNumberLiteral(i)), param.initializer || createVoid0())));
          }
        }
        if (!changed) return tree;
        return new FormalParameterList(tree.location, parameters);
      }
    }, $__proto, $__super, false);
    return $DefaultParametersTransformer;
  }(ParseTreeTransformer);
  DefaultParametersTransformer.transformTree = function(tree) {
    return new DefaultParametersTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {DefaultParametersTransformer: {
      get: function() {
        return DefaultParametersTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_DestructuringTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, ARRAY = $__9.ARRAY, CALL = $__9.CALL, PROTOTYPE = $__9.PROTOTYPE, SLICE = $__9.SLICE;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, ARRAY_LITERAL_EXPRESSION = $__9.ARRAY_LITERAL_EXPRESSION, ARRAY_PATTERN = $__9.ARRAY_PATTERN, BINDING_ELEMENT = $__9.BINDING_ELEMENT, BLOCK = $__9.BLOCK, CALL_EXPRESSION = $__9.CALL_EXPRESSION, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, OBJECT_LITERAL_EXPRESSION = $__9.OBJECT_LITERAL_EXPRESSION, OBJECT_PATTERN = $__9.OBJECT_PATTERN, OBJECT_PATTERN_FIELD = $__9.OBJECT_PATTERN_FIELD, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST;
  var $__9 = $__src_syntax_trees_ParseTrees_js, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, Catch = $__9.Catch, ForInStatement = $__9.ForInStatement, ForOfStatement = $__9.ForOfStatement, LiteralExpression = $__9.LiteralExpression, SetAccessor = $__9.SetAccessor, VariableDeclaration = $__9.VariableDeclaration, VariableDeclarationList = $__9.VariableDeclarationList;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, EQUAL = $__9.EQUAL, IDENTIFIER = $__9.IDENTIFIER, IN = $__9.IN, LET = $__9.LET, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createBinaryOperator = $__9.createBinaryOperator, createBindingIdentifier = $__9.createBindingIdentifier, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createCommaExpression = $__9.createCommaExpression, createConditionalExpression = $__9.createConditionalExpression, createExpressionStatement = $__9.createExpressionStatement, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createNumberLiteral = $__9.createNumberLiteral, createOperatorToken = $__9.createOperatorToken, createParenExpression = $__9.createParenExpression, createStringLiteral = $__9.createStringLiteral, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var prependStatements = $__src_codegeneration_PrependStatements_js.prependStatements;
  var stack = [];
  var Desugaring = function() {
    var $Desugaring = ($__createClassNoExtends)({constructor: function(rvalue) {
        this.rvalue = rvalue;
      }});
    return $Desugaring;
  }();
  var AssignmentExpressionDesugaring = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AssignmentExpressionDesugaring = ($__createClass)({
      constructor: function(rvalue) {
        $__superCall(this, $__proto, "constructor", [rvalue]);
        this.expressions = [];
      },
      assign: function(lvalue, rvalue) {
        this.expressions.push(createAssignmentExpression(lvalue, rvalue));
      }
    }, $__proto, $__super, true);
    return $AssignmentExpressionDesugaring;
  }(Desugaring);
  var VariableDeclarationDesugaring = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $VariableDeclarationDesugaring = ($__createClass)({
      constructor: function(rvalue) {
        $__superCall(this, $__proto, "constructor", [rvalue]);
        this.declarations = [];
      },
      assign: function(lvalue, rvalue) {
        if (lvalue.type === BINDING_ELEMENT) {
          this.declarations.push(createVariableDeclaration(lvalue.binding, rvalue));
          return;
        }
        if (lvalue.type == IDENTIFIER_EXPRESSION) lvalue = createBindingIdentifier(lvalue);
        this.declarations.push(createVariableDeclaration(lvalue, rvalue));
      }
    }, $__proto, $__super, true);
    return $VariableDeclarationDesugaring;
  }(Desugaring);
  function createConditionalMemberExpression(rvalue, identToken, initializer) {
    if (identToken.type !== IDENTIFIER) {
      return createConditionalMemberLookupExpression(rvalue, new LiteralExpression(null, identToken), initializer);
    }
    if (!initializer) return createMemberExpression(rvalue, identToken);
    return createConditionalExpression(createBinaryOperator(createStringLiteral(identToken.value), createOperatorToken(IN), rvalue), createMemberExpression(rvalue, identToken), initializer);
  }
  function createConditionalMemberLookupExpression(rvalue, index, initializer) {
    if (!initializer) return createMemberLookupExpression(rvalue, index);
    return createConditionalExpression(createBinaryOperator(index, createOperatorToken(IN), rvalue), createMemberLookupExpression(rvalue, index), initializer);
  }
  var DestructuringTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $DestructuringTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformArrayPattern: function(tree) {
        throw new Error('unreachable');
      },
      transformObjectPattern: function(tree) {
        throw new Error('unreachable');
      },
      transformBinaryOperator: function(tree) {
        if (tree.operator.type == EQUAL && tree.left.isPattern()) {
          return this.transformAny(this.desugarAssignment_(tree.left, tree.right));
        } else {
          return $__superCall(this, $__proto, "transformBinaryOperator", [tree]);
        }
      },
      desugarAssignment_: function(lvalue, rvalue) {
        var tempIdent = createIdentifierExpression(this.addTempVar());
        var desugaring = new AssignmentExpressionDesugaring(tempIdent);
        this.desugarPattern_(desugaring, lvalue);
        desugaring.expressions.unshift(createAssignmentExpression(tempIdent, rvalue));
        desugaring.expressions.push(tempIdent);
        return createParenExpression(createCommaExpression(desugaring.expressions));
      },
      transformVariableDeclarationList: function(tree) {
        if (!this.destructuringInDeclaration_(tree)) {
          return $__superCall(this, $__proto, "transformVariableDeclarationList", [tree]);
        }
        this.pushTempVarState();
        var desugaredDeclarations = [];
        tree.declarations.forEach((function(declaration) {
          var $__10;
          if (declaration.lvalue.isPattern()) {
            ($__10 = desugaredDeclarations).push.apply($__10, $__toObject(this.desugarVariableDeclaration_(declaration)));
          } else {
            desugaredDeclarations.push(declaration);
          }
        }).bind(this));
        var transformedTree = this.transformVariableDeclarationList(createVariableDeclarationList(tree.declarationType, desugaredDeclarations));
        this.popTempVarState();
        return transformedTree;
      },
      transformForInStatement: function(tree) {
        return this.transformForInOrOf_(tree, $__superGet(this, $__proto, "transformForInStatement"), ForInStatement);
      },
      transformForOfStatement: function(tree) {
        return this.transformForInOrOf_(tree, $__superGet(this, $__proto, "transformForOfStatement"), ForOfStatement);
      },
      transformForInOrOf_: function(tree, superMethod, constr) {
        var $__10;
        if (!tree.initializer.isPattern() && (tree.initializer.type !== VARIABLE_DECLARATION_LIST || !this.destructuringInDeclaration_(tree.initializer))) {
          return superMethod.call(this, tree);
        }
        this.pushTempVarState();
        var declarationType, lvalue;
        if (tree.initializer.isPattern()) {
          declarationType = null;
          lvalue = tree.initializer;
        } else {
          declarationType = tree.initializer.declarationType;
          lvalue = tree.initializer.declarations[0].lvalue;
        }
        var statements = [];
        var binding = this.desugarBinding_(lvalue, statements, declarationType);
        var initializer = createVariableDeclarationList(VAR, binding, null);
        var collection = this.transformAny(tree.collection);
        var body = this.transformAny(tree.body);
        if (body.type !== BLOCK) body = createBlock(body);
        ($__10 = statements).push.apply($__10, $__toObject(body.statements));
        body = createBlock(statements);
        this.popTempVarState();
        return new constr(tree.location, initializer, collection, body);
      },
      transformFunction: function(tree) {
        stack.push([]);
        var transformedTree = $__superCall(this, $__proto, "transformFunction", [tree]);
        var statements = stack.pop();
        if (!statements.length) return transformedTree;
        statements = prependStatements.apply(null, $__spread([transformedTree.functionBody.statements], statements));
        return new tree.constructor(transformedTree.location, transformedTree.name, transformedTree.isGenerator, transformedTree.formalParameterList, createBlock(statements));
      },
      transformSetAccessor: function(tree) {
        var $__10;
        stack.push([]);
        var transformedTree = $__superCall(this, $__proto, "transformSetAccessor", [tree]);
        var statements = stack.pop();
        if (!statements.length) return transformedTree;
        ($__10 = statements).push.apply($__10, $__toObject(transformedTree.body.statements));
        return new SetAccessor(transformedTree.location, transformedTree.name, transformedTree.parameter, createBlock(statements));
      },
      transformBindingElement: function(tree) {
        if (!tree.binding.isPattern() || tree.initializer) return tree;
        var statements = stack[stack.length - 1];
        var binding = this.desugarBinding_(tree.binding, statements, VAR);
        return new BindingElement(null, binding, null);
      },
      transformCatch: function(tree) {
        var $__10;
        if (!tree.binding.isPattern()) return $__superCall(this, $__proto, "transformCatch", [tree]);
        var body = this.transformAny(tree.catchBody);
        var statements = [];
        var binding = this.desugarBinding_(tree.binding, statements, LET);
        ($__10 = statements).push.apply($__10, $__toObject(body.statements));
        return new Catch(tree.location, binding, createBlock(statements));
      },
      desugarBinding_: function(bindingTree, statements, declarationType) {
        var varName = this.getTempIdentifier();
        var binding = createBindingIdentifier(varName);
        var idExpr = createIdentifierExpression(varName);
        var desugaring;
        if (declarationType === null) desugaring = new AssignmentExpressionDesugaring(idExpr); else desugaring = new VariableDeclarationDesugaring(idExpr);
        this.desugarPattern_(desugaring, bindingTree);
        if (declarationType === null) {
          statements.push(createExpressionStatement(createCommaExpression(desugaring.expressions)));
        } else {
          statements.push(createVariableStatement(this.transformVariableDeclarationList(createVariableDeclarationList(declarationType, desugaring.declarations))));
        }
        return binding;
      },
      destructuringInDeclaration_: function(tree) {
        return tree.declarations.some((function(declaration) {
          return declaration.lvalue.isPattern();
        }));
      },
      desugarVariableDeclaration_: function(tree) {
        var tempRValueName = this.getTempIdentifier();
        var tempRValueIdent = createIdentifierExpression(tempRValueName);
        var desugaring;
        var initializer;
        switch (tree.initializer.type) {
          case ARRAY_LITERAL_EXPRESSION:
          case CALL_EXPRESSION:
          case IDENTIFIER_EXPRESSION:
          case LITERAL_EXPRESSION:
          case MEMBER_EXPRESSION:
          case MEMBER_LOOKUP_EXPRESSION:
          case OBJECT_LITERAL_EXPRESSION:
          case PAREN_EXPRESSION:
            initializer = tree.initializer;
          default:
            desugaring = new VariableDeclarationDesugaring(tempRValueIdent);
            desugaring.assign(desugaring.rvalue, tree.initializer);
            this.desugarPattern_(desugaring, tree.lvalue);
            if (desugaring.declarations.length > 2) return desugaring.declarations;
            initializer = initializer || createParenExpression(tree.initializer);
            desugaring = new VariableDeclarationDesugaring(initializer);
            this.desugarPattern_(desugaring, tree.lvalue);
            return desugaring.declarations;
        }
      },
      desugarPattern_: function(desugaring, tree) {
        switch (tree.type) {
          case ARRAY_PATTERN:
            {
              var pattern = tree;
              for (var i = 0; i < pattern.elements.length; i++) {
                var lvalue = pattern.elements[i];
                if (lvalue === null) {
                  continue;
                } else if (lvalue.isSpreadPatternElement()) {
                  desugaring.assign(lvalue.lvalue, createCallExpression(createMemberExpression(ARRAY, PROTOTYPE, SLICE, CALL), createArgumentList(desugaring.rvalue, createNumberLiteral(i))));
                } else {
                  desugaring.assign(lvalue, createConditionalMemberLookupExpression(desugaring.rvalue, createNumberLiteral(i), lvalue.initializer));
                }
              }
              break;
            }
          case OBJECT_PATTERN:
            {
              var pattern = tree;
              pattern.fields.forEach((function(field) {
                var lookup;
                switch (field.type) {
                  case BINDING_ELEMENT:
                    lookup = createConditionalMemberExpression(desugaring.rvalue, field.binding.identifierToken, field.initializer);
                    desugaring.assign(createIdentifierExpression(field.binding), lookup);
                    break;
                  case OBJECT_PATTERN_FIELD:
                    lookup = createConditionalMemberExpression(desugaring.rvalue, field.identifier, field.element.initializer);
                    desugaring.assign(field.element, lookup);
                    break;
                  case IDENTIFIER_EXPRESSION:
                    lookup = createMemberExpression(desugaring.rvalue, field.identifierToken);
                    desugaring.assign(field, lookup);
                    break;
                  default:
                    throw Error('unreachable');
                }
              }));
              break;
            }
          case PAREN_EXPRESSION:
            this.desugarPattern_(desugaring, tree.expression);
            break;
          default:
            throw new Error('unreachable');
        }
      }
    }, $__proto, $__super, false);
    return $DestructuringTransformer;
  }(TempVarTransformer);
  DestructuringTransformer.transformTree = function(identifierGenerator, tree) {
    return new DestructuringTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {DestructuringTransformer: {
      get: function() {
        return DestructuringTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ForOfTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, CLOSE = $__9.CLOSE, CURRENT = $__9.CURRENT, GET_ITERATOR = $__9.GET_ITERATOR, MOVE_NEXT = $__9.MOVE_NEXT, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var VARIABLE_DECLARATION_LIST = $__src_syntax_trees_ParseTreeType_js.VARIABLE_DECLARATION_LIST;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var VAR = $__src_syntax_TokenType_js.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createCallStatement = $__9.createCallStatement, createExpressionStatement = $__9.createExpressionStatement, createFinally = $__9.createFinally, createIfStatement = $__9.createIfStatement, createMemberExpression = $__9.createMemberExpression, createStringLiteral = $__9.createStringLiteral, createTryStatement = $__9.createTryStatement, createVariableStatement = $__9.createVariableStatement, createWhileStatement = $__9.createWhileStatement;
  var ForOfTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ForOfTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformForOfStatement: function(original) {
        var tree = $__superCall(this, $__proto, "transformForOfStatement", [original]);
        var iter = this.getTempIdentifier();
        var initializer = createVariableStatement(VAR, iter, createCallExpression(createMemberExpression(TRACEUR, RUNTIME, GET_ITERATOR), createArgumentList(tree.collection)));
        var statement;
        if (tree.initializer.type === VARIABLE_DECLARATION_LIST) {
          statement = createVariableStatement(tree.initializer.declarationType, tree.initializer.declarations[0].lvalue, createMemberExpression(iter, CURRENT));
        } else {
          statement = createExpressionStatement(createAssignmentExpression(tree.initializer, createMemberExpression(iter, CURRENT)));
        }
        var body = createBlock(statement, tree.body);
        var loop = createWhileStatement(createCallExpression(createMemberExpression(iter, MOVE_NEXT)), body);
        var finallyBody = createIfStatement(createMemberExpression(iter, CLOSE), createCallStatement(createMemberExpression(iter, CLOSE)));
        return createBlock(initializer, createTryStatement(createBlock(loop), null, createFinally(createBlock(finallyBody))));
      }
    }, $__proto, $__super, false);
    return $ForOfTransformer;
  }(TempVarTransformer);
  ForOfTransformer.transformTree = function(identifierGenerator, tree) {
    return new ForOfTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ForOfTransformer: {
      get: function() {
        return ForOfTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_FreeVariableChecker_js = (function() {
  "use strict";
  var ARGUMENTS = $__src_syntax_PredefinedName_js.ARGUMENTS;
  var $__9 = $__src_syntax_trees_ParseTrees_js, BindingIdentifier = $__9.BindingIdentifier, IdentifierExpression = $__9.IdentifierExpression;
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var IDENTIFIER_EXPRESSION = $__src_syntax_trees_ParseTreeType_js.IDENTIFIER_EXPRESSION;
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var SourcePosition = $__src_util_SourcePosition_js.SourcePosition;
  var TYPEOF = $__src_syntax_TokenType_js.TYPEOF;
  var Scope = function() {
    var $Scope = ($__createClassNoExtends)({constructor: function(parent) {
        this.parent = parent;
        this.references = Object.create(null);
        this.declarations = Object.create(null);
      }});
    return $Scope;
  }();
  function getVariableName(name) {
    if (name instanceof IdentifierExpression) {
      name = name.identifierToken;
    } else if (name instanceof BindingIdentifier) {
      name = name.identifierToken;
    }
    if (name instanceof IdentifierToken) {
      name = name.value;
    }
    return name;
  }
  var FreeVariableChecker = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FreeVariableChecker = ($__createClass)({
      constructor: function(reporter) {
        $__superCall(this, $__proto, "constructor", []);
        this.reporter_ = reporter;
        this.scope_ = null;
      },
      pushScope_: function() {
        return this.scope_ = new Scope(this.scope_);
      },
      pop_: function(scope) {
        if (this.scope_ != scope) {
          throw new Error('FreeVariableChecker scope mismatch');
        }
        this.validateScope_();
        this.scope_ = scope.parent;
      },
      visitProgram: function(tree, global) {
        var scope = this.pushScope_();
        var object = global;
        while (object) {
          Object.getOwnPropertyNames(object).forEach(this.declareVariable_, this);
          object = Object.getPrototypeOf(object);
        }
        this.visitList(tree.programElements);
        this.pop_(scope);
      },
      visitFunction_: function(name, formalParameterList, body) {
        var scope = this.pushScope_();
        this.visitAny(name);
        this.declareVariable_(ARGUMENTS);
        this.visitAny(formalParameterList);
        this.visitAny(body);
        this.pop_(scope);
      },
      visitFunctionDeclaration: function(tree) {
        this.declareVariable_(tree.name);
        this.visitFunction_(null, tree.formalParameterList, tree.functionBody);
      },
      visitFunctionExpression: function(tree) {
        this.visitFunction_(tree.name, tree.formalParameterList, tree.functionBody);
      },
      visitArrowFunctionExpression: function(tree) {
        this.visitFunction_(null, tree.formalParameters, tree.functionBody);
      },
      visitGetAccessor: function(tree) {
        var scope = this.pushScope_();
        $__superCall(this, $__proto, "visitGetAccessor", [tree]);
        this.pop_(scope);
      },
      visitSetAccessor: function(tree) {
        var scope = this.pushScope_();
        $__superCall(this, $__proto, "visitSetAccessor", [tree]);
        this.pop_(scope);
      },
      visitCatch: function(tree) {
        var scope = this.pushScope_();
        $__superCall(this, $__proto, "visitCatch", [tree]);
        this.pop_(scope);
      },
      visitBindingIdentifier: function(tree) {
        this.declareVariable_(tree);
      },
      visitIdentifierExpression: function(tree) {
        var name = getVariableName(tree);
        var scope = this.scope_;
        if (!(name in scope.references)) {
          scope.references[name] = tree.location;
        }
      },
      visitUnaryExpression: function(tree) {
        if (tree.operator.type === TYPEOF && tree.operand.type === IDENTIFIER_EXPRESSION) {
          this.declareVariable_(tree.operand);
        } else {
          $__superCall(this, $__proto, "visitUnaryExpression", [tree]);
        }
      },
      declareVariable_: function(tree) {
        var name = getVariableName(tree);
        if (name) {
          var scope = this.scope_;
          if (!(name in scope.declarations)) {
            scope.declarations[name] = tree.location;
          }
        }
      },
      validateScope_: function() {
        var scope = this.scope_;
        var errors = [];
        for (var name in scope.references) {
          if (!(name in scope.declarations)) {
            var location = scope.references[name];
            if (!scope.parent) {
              if (!location) {
                throw new Error(("generated variable " + name + " is not defined"));
              }
              errors.push([location.start, '%s is not defined', name]);
            } else if (!(name in scope.parent.references)) {
              scope.parent.references[name] = location;
            }
          }
        }
        if (errors.length) {
          errors.sort((function(x, y) {
            return x[0].offset - y[0].offset;
          }));
          errors.forEach((function(e) {
            var $__10;
            ($__10 = this).reportError_.apply($__10, $__toObject(e));
          }).bind(this));
        }
      },
      reportError_: function() {
        var $__10;
        for (var args = [], $__8 = 0; $__8 < arguments.length; $__8++) args[$__8] = arguments[$__8];
        ($__10 = this.reporter_).reportError.apply($__10, $__toObject(args));
      }
    }, $__proto, $__super, true);
    return $FreeVariableChecker;
  }(ParseTreeVisitor);
  var global = this;
  FreeVariableChecker.checkProgram = function(reporter, tree) {
    new FreeVariableChecker(reporter).visitProgram(tree, global);
  };
  return Object.preventExtensions(Object.create(null, {FreeVariableChecker: {
      get: function() {
        return FreeVariableChecker;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_GeneratorComprehensionTransformer_js = (function() {
  "use strict";
  var ComprehensionTransformer = $__src_codegeneration_ComprehensionTransformer_js.ComprehensionTransformer;
  var createYieldStatement = $__src_codegeneration_ParseTreeFactory_js.createYieldStatement;
  var GeneratorComprehensionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $GeneratorComprehensionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformGeneratorComprehension: function(tree) {
        var expression = this.transformAny(tree.expression);
        var statement = createYieldStatement(expression);
        var isGenerator = true;
        return this.transformComprehension(tree, statement, isGenerator);
      }
    }, $__proto, $__super, false);
    return $GeneratorComprehensionTransformer;
  }(ComprehensionTransformer);
  GeneratorComprehensionTransformer.transformTree = function(identifierGenerator, tree) {
    return new GeneratorComprehensionTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {GeneratorComprehensionTransformer: {
      get: function() {
        return GeneratorComprehensionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_State_js = (function() {
  "use strict";
  var FINALLY_FALL_THROUGH = $__src_syntax_PredefinedName_js.FINALLY_FALL_THROUGH;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignStateStatement = $__9.createAssignStateStatement, createAssignmentStatement = $__9.createAssignmentStatement, createBreakStatement = $__9.createBreakStatement, createCaseClause = $__9.createCaseClause, createIdentifierExpression = $__9.createIdentifierExpression, createNumberLiteral = $__9.createNumberLiteral, createStatementList = $__9.createStatementList, createStatementList = $__9.createStatementList;
  var State = function() {
    var $State = ($__createClassNoExtends)({
      constructor: function(id) {
        this.id = id;
      },
      transformMachineState: function(enclosingFinally, machineEndState, reporter) {
        return createCaseClause(createNumberLiteral(this.id), this.transform(enclosingFinally, machineEndState, reporter));
      },
      transformBreak: function(labelSet, breakState) {
        return this;
      },
      transformBreakOrContinue: function(labelSet, breakState, continueState) {
        return this;
      }
    });
    return $State;
  }();
  ;
  State.INVALID_STATE = - 1;
  State.generateJump = function(enclosingFinally, fallThroughState) {
    return createStatementList(State.generateAssignState(enclosingFinally, fallThroughState), createBreakStatement());
  };
  State.generateJumpThroughFinally = function(finallyState, destination) {
    return createStatementList(State.generateAssignStateOutOfFinally_(destination, finallyState), createBreakStatement());
  };
  State.generateAssignState = function(enclosingFinally, fallThroughState) {
    var assignState;
    if (isFinallyExit(enclosingFinally, fallThroughState)) {
      assignState = State.generateAssignStateOutOfFinally(enclosingFinally, fallThroughState);
    } else {
      assignState = createStatementList(createAssignStateStatement(fallThroughState));
    }
    return assignState;
  };
  function isFinallyExit(enclosingFinally, destination) {
    return enclosingFinally != null && enclosingFinally.tryStates.indexOf(destination) < 0;
  }
  State.generateAssignStateOutOfFinally = function(enclosingFinally, destination) {
    return State.generateAssignStateOutOfFinally_(destination, enclosingFinally.finallyState);
  };
  State.generateAssignStateOutOfFinally_ = function(destination, finallyState) {
    return createStatementList(createAssignStateStatement(finallyState), createAssignmentStatement(createIdentifierExpression(FINALLY_FALL_THROUGH), createNumberLiteral(destination)));
  };
  State.replaceStateList = function(oldStates, oldState, newState) {
    var states = [];
    for (var i = 0; i < oldStates.length; i++) {
      states.push(State.replaceStateId(oldStates[i], oldState, newState));
    }
    return states;
  };
  State.replaceStateId = function(current, oldState, newState) {
    return current == oldState ? newState: current;
  };
  State.replaceAllStates = function(exceptionBlocks, oldState, newState) {
    var result = [];
    for (var i = 0; i < exceptionBlocks.length; i++) {
      result.push(exceptionBlocks[i].replaceState(oldState, newState));
    }
    return result;
  };
  return Object.preventExtensions(Object.create(null, {State: {
      get: function() {
        return State;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_FallThroughState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var FallThroughState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FallThroughState = ($__createClass)({
      constructor: function(id, fallThroughState, statements) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.fallThroughState = fallThroughState;
        this.statements = statements;
      },
      replaceState: function(oldState, newState) {
        return new FallThroughState(State.replaceStateId(this.id, oldState, newState), State.replaceStateId(this.fallThroughState, oldState, newState), this.statements);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        return $__spread(this.statements, State.generateJump(enclosingFinally, this.fallThroughState));
      }
    }, $__proto, $__super, true);
    return $FallThroughState;
  }(State);
  return Object.preventExtensions(Object.create(null, {FallThroughState: {
      get: function() {
        return FallThroughState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_BreakState_js = (function() {
  "use strict";
  var FallThroughState = $__src_codegeneration_generator_FallThroughState_js.FallThroughState;
  var State = $__src_codegeneration_generator_State_js.State;
  var createStatementList = $__src_codegeneration_ParseTreeFactory_js.createStatementList;
  var BreakState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BreakState = ($__createClass)({
      constructor: function(id, label) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.label = label;
      },
      replaceState: function(oldState, newState) {
        return new BreakState(State.replaceStateId(this.id, oldState, newState), this.label);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        throw new Error('These should be removed before the transform step');
      },
      transformBreak: function(labelSet, breakState) {
        if (this.label == null || this.label in labelSet) {
          return new FallThroughState(this.id, breakState, createStatementList());
        }
        return this;
      },
      transformBreakOrContinue: function(labelSet, breakState, continueState) {
        return this.transformBreak(labelSet, breakState);
      }
    }, $__proto, $__super, true);
    return $BreakState;
  }(State);
  return Object.preventExtensions(Object.create(null, {BreakState: {
      get: function() {
        return BreakState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_ContinueState_js = (function() {
  "use strict";
  var FallThroughState = $__src_codegeneration_generator_FallThroughState_js.FallThroughState;
  var State = $__src_codegeneration_generator_State_js.State;
  var createStatementList = $__src_codegeneration_ParseTreeFactory_js.createStatementList;
  var ContinueState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ContinueState = ($__createClass)({
      constructor: function(id, label) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.label = label;
      },
      replaceState: function(oldState, newState) {
        return new ContinueState(State.replaceStateId(this.id, oldState, newState), this.label);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        throw new Error('These should be removed before the transform step');
      },
      transformBreakOrContinue: function(labelSet, breakState, continueState) {
        if (this.label == null || this.label in labelSet) {
          return new FallThroughState(this.id, continueState, createStatementList());
        }
        return this;
      }
    }, $__proto, $__super, true);
    return $ContinueState;
  }(State);
  return Object.preventExtensions(Object.create(null, {ContinueState: {
      get: function() {
        return ContinueState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_TryState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var Kind = {
    CATCH: 'catch',
    FINALLY: 'finally'
  };
  var TryState = function() {
    var $TryState = ($__createClassNoExtends)({
      constructor: function(kind, tryStates, nestedTrys) {
        this.kind = kind;
        this.tryStates = tryStates;
        this.nestedTrys = nestedTrys;
      },
      replaceAllStates: function(oldState, newState) {
        return State.replaceStateList(this.tryStates, oldState, newState);
      },
      replaceNestedTrys: function(oldState, newState) {
        var states = [];
        for (var i = 0; i < this.nestedTrys.length; i++) {
          states.push(this.nestedTrys[i].replaceState(oldState, newState));
        }
        return states;
      }
    });
    return $TryState;
  }();
  TryState.Kind = Kind;
  return Object.preventExtensions(Object.create(null, {TryState: {
      get: function() {
        return TryState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_trees_StateMachine_js = (function() {
  "use strict";
  var ParseTree = $__src_syntax_trees_ParseTree_js.ParseTree;
  var STATE_MACHINE = $__src_syntax_trees_ParseTreeType_js.STATE_MACHINE;
  var TryState = $__src_codegeneration_generator_TryState_js.TryState;
  function addCatchOrFinallyStates(kind, enclosingMap, tryStates) {
    for (var i = 0; i < tryStates.length; i++) {
      var tryState = tryStates[i];
      if (tryState.kind == kind) {
        for (var j = 0; j < tryState.tryStates.length; j++) {
          var id = tryState.tryStates[j];
          enclosingMap[id] = tryState;
        }
      }
      addCatchOrFinallyStates(kind, enclosingMap, tryState.nestedTrys);
    }
  }
  function addAllCatchStates(tryStates, catches) {
    for (var i = 0; i < tryStates.length; i++) {
      var tryState = tryStates[i];
      if (tryState.kind == TryState.Kind.CATCH) {
        catches.push(tryState);
      }
      addAllCatchStates(tryState.nestedTrys, catches);
    }
  }
  var StateMachine = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $StateMachine = ($__createClass)({
      constructor: function(startState, fallThroughState, states, exceptionBlocks) {
        $__superCall(this, $__proto, "constructor", [STATE_MACHINE, null]);
        this.startState = startState;
        this.fallThroughState = fallThroughState;
        this.states = states;
        this.exceptionBlocks = exceptionBlocks;
      },
      transform: function(transformer) {
        return transformer.transformStateMachine(this);
      },
      visit: function(visitor) {
        visitor.visitStateMachine(this);
      },
      hasExceptionBlocks: function() {
        return this.exceptionBlocks.length > 0;
      },
      getAllStateIDs: function() {
        var result = [];
        for (var i = 0; i < this.states.length; i++) {
          result.push(this.states[i].id);
        }
        return result;
      },
      getEnclosingFinallyMap: function() {
        var enclosingMap = Object.create(null);
        addCatchOrFinallyStates(TryState.Kind.FINALLY, enclosingMap, this.exceptionBlocks);
        return enclosingMap;
      },
      getEnclosingCatchMap: function() {
        var enclosingMap = Object.create(null);
        addCatchOrFinallyStates(TryState.Kind.CATCH, enclosingMap, this.exceptionBlocks);
        return enclosingMap;
      },
      allCatchStates: function() {
        var catches = [];
        addAllCatchStates(this.exceptionBlocks, catches);
        return catches;
      }
    }, $__proto, $__super, true);
    return $StateMachine;
  }(ParseTree);
  return Object.preventExtensions(Object.create(null, {StateMachine: {
      get: function() {
        return StateMachine;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_BreakContinueTransformer_js = (function() {
  "use strict";
  var BreakState = $__src_codegeneration_generator_BreakState_js.BreakState;
  var $__9 = $__src_syntax_trees_ParseTrees_js, BreakStatement = $__9.BreakStatement, ContinueStatement = $__9.ContinueStatement, DoWhileStatement = $__9.DoWhileStatement, ForOfStatement = $__9.ForOfStatement, ForStatement = $__9.ForStatement, SwitchStatement = $__9.SwitchStatement, WhileStatement = $__9.WhileStatement;
  var ContinueState = $__src_codegeneration_generator_ContinueState_js.ContinueState;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var StateMachine = $__src_syntax_trees_StateMachine_js.StateMachine;
  function safeGetLabel(tree) {
    return tree.name ? tree.name.value: null;
  }
  var BreakContinueTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $BreakContinueTransformer = ($__createClass)({
      constructor: function(stateAllocator) {
        $__superCall(this, $__proto, "constructor", []);
        this.transformBreaks_ = true;
        this.stateAllocator_ = stateAllocator;
      },
      allocateState_: function() {
        return this.stateAllocator_.allocateState();
      },
      stateToStateMachine_: function(newState) {
        var fallThroughState = this.allocateState_();
        return new StateMachine(newState.id, fallThroughState, [newState], []);
      },
      transformBreakStatement: function(tree) {
        return this.transformBreaks_ ? this.stateToStateMachine_(new BreakState(this.allocateState_(), safeGetLabel(tree))): tree;
      },
      transformContinueStatement: function(tree) {
        return this.stateToStateMachine_(new ContinueState(this.allocateState_(), safeGetLabel(tree)));
      },
      transformDoWhileStatement: function(tree) {
        return tree;
      },
      transformForOfStatement: function(tree) {
        return tree;
      },
      transformForStatement: function(tree) {
        return tree;
      },
      transformFunction: function(tree) {
        return tree;
      },
      transformStateMachine: function(tree) {
        return tree;
      },
      transformSwitchStatement: function(tree) {
        var oldState = this.transformBreaks_;
        this.transformBreaks = false;
        var result = $__superCall(this, $__proto, "transformSwitchStatement", [tree]);
        this.transformBreaks_ = oldState;
        return result;
      },
      transformWhileStatement: function(tree) {
        return tree;
      }
    }, $__proto, $__super, true);
    return $BreakContinueTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {BreakContinueTransformer: {
      get: function() {
        return BreakContinueTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_CatchState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var TryState = $__src_codegeneration_generator_TryState_js.TryState;
  var CatchState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CatchState = ($__createClass)({
      constructor: function(identifier, catchState, fallThroughState, allStates, nestedTrys) {
        $__superCall(this, $__proto, "constructor", [TryState.Kind.CATCH, allStates, nestedTrys]);
        this.identifier = identifier;
        this.catchState = catchState;
        this.fallThroughState = fallThroughState;
      },
      replaceState: function(oldState, newState) {
        return new CatchState(this.identifier, State.replaceStateId(this.catchState, oldState, newState), State.replaceStateId(this.fallThroughState, oldState, newState), this.replaceAllStates(oldState, newState), this.replaceNestedTrys(oldState, newState));
      }
    }, $__proto, $__super, true);
    return $CatchState;
  }(TryState);
  return Object.preventExtensions(Object.create(null, {CatchState: {
      get: function() {
        return CatchState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_ConditionalState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBlock = $__9.createBlock, createIfStatement = $__9.createIfStatement;
  var ConditionalState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ConditionalState = ($__createClass)({
      constructor: function(id, ifState, elseState, condition) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.ifState = ifState;
        this.elseState = elseState;
        this.condition = condition;
      },
      replaceState: function(oldState, newState) {
        return new ConditionalState(State.replaceStateId(this.id, oldState, newState), State.replaceStateId(this.ifState, oldState, newState), State.replaceStateId(this.elseState, oldState, newState), this.condition);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        return [createIfStatement(this.condition, createBlock(State.generateJump(enclosingFinally, this.ifState)), createBlock(State.generateJump(enclosingFinally, this.elseState)))];
      }
    }, $__proto, $__super, true);
    return $ConditionalState;
  }(State);
  return Object.preventExtensions(Object.create(null, {ConditionalState: {
      get: function() {
        return ConditionalState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_FinallyFallThroughState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var FinallyFallThroughState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FinallyFallThroughState = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      replaceState: function(oldState, newState) {
        return new FinallyFallThroughState(State.replaceStateId(this.id, oldState, newState));
      },
      transformMachineState: function(enclosingFinally, machineEndState, reporter) {
        return null;
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        throw new Error('these are generated in addFinallyFallThroughDispatches');
      }
    }, $__proto, $__super, false);
    return $FinallyFallThroughState;
  }(State);
  return Object.preventExtensions(Object.create(null, {FinallyFallThroughState: {
      get: function() {
        return FinallyFallThroughState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_FinallyState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var TryState = $__src_codegeneration_generator_TryState_js.TryState;
  var FinallyState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $FinallyState = ($__createClass)({
      constructor: function(finallyState, fallThroughState, allStates, nestedTrys) {
        $__superCall(this, $__proto, "constructor", [TryState.Kind.FINALLY, allStates, nestedTrys]);
        this.finallyState = finallyState;
        this.fallThroughState = fallThroughState;
      },
      replaceState: function(oldState, newState) {
        return new FinallyState(State.replaceStateId(this.finallyState, oldState, newState), State.replaceStateId(this.fallThroughState, oldState, newState), this.replaceAllStates(oldState, newState), this.replaceNestedTrys(oldState, newState));
      }
    }, $__proto, $__super, true);
    return $FinallyState;
  }(TryState);
  return Object.preventExtensions(Object.create(null, {FinallyState: {
      get: function() {
        return FinallyState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_StateAllocator_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var StateAllocator = function() {
    var $StateAllocator = ($__createClassNoExtends)({
      constructor: function() {
        this.nextState_ = State.INVALID_STATE + 1;
      },
      allocateState: function() {
        return this.nextState_++;
      }
    });
    return $StateAllocator;
  }();
  return Object.preventExtensions(Object.create(null, {StateAllocator: {
      get: function() {
        return StateAllocator;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_SwitchState_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, CaseClause = $__9.CaseClause, DefaultClause = $__9.DefaultClause, SwitchStatement = $__9.SwitchStatement;
  var State = $__src_codegeneration_generator_State_js.State;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBreakStatement = $__9.createBreakStatement, createStatementList = $__9.createStatementList;
  var SwitchClause = function() {
    var $SwitchClause = ($__createClassNoExtends)({constructor: function(first, second) {
        this.first = first;
        this.second = second;
      }});
    return $SwitchClause;
  }();
  var SwitchState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SwitchState = ($__createClass)({
      constructor: function(id, expression, clauses) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.expression = expression;
        this.clauses = clauses;
      },
      replaceState: function(oldState, newState) {
        var clauses = this.clauses.map((function(clause) {
          return new SwitchClause(clause.first, State.replaceStateId(clause.second, oldState, newState));
        }));
        return new SwitchState(State.replaceStateId(this.id, oldState, newState), this.expression, clauses);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        var clauses = [];
        for (var i = 0; i < this.clauses.length; i++) {
          var clause = this.clauses[i];
          if (clause.first == null) {
            clauses.push(new DefaultClause(null, State.generateJump(enclosingFinally, clause.second)));
          } else {
            clauses.push(new CaseClause(null, clause.first, State.generateJump(enclosingFinally, clause.second)));
          }
        }
        return createStatementList(new SwitchStatement(null, this.expression, clauses), createBreakStatement());
      }
    }, $__proto, $__super, true);
    return $SwitchState;
  }(State);
  return Object.preventExtensions(Object.create(null, {
    SwitchClause: {
      get: function() {
        return SwitchClause;
      },
      enumerable: true
    },
    SwitchState: {
      get: function() {
        return SwitchState;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_generator_CPSTransformer_js = (function() {
  "use strict";
  var BreakContinueTransformer = $__src_codegeneration_generator_BreakContinueTransformer_js.BreakContinueTransformer;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, CASE_CLAUSE = $__9.CASE_CLAUSE, STATE_MACHINE = $__9.STATE_MACHINE, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST, VARIABLE_STATEMENT = $__9.VARIABLE_STATEMENT;
  var $__9 = $__src_syntax_trees_ParseTrees_js, CaseClause = $__9.CaseClause, IdentifierExpression = $__9.IdentifierExpression, SwitchStatement = $__9.SwitchStatement;
  var CatchState = $__src_codegeneration_generator_CatchState_js.CatchState;
  var ConditionalState = $__src_codegeneration_generator_ConditionalState_js.ConditionalState;
  var FallThroughState = $__src_codegeneration_generator_FallThroughState_js.FallThroughState;
  var FinallyFallThroughState = $__src_codegeneration_generator_FinallyFallThroughState_js.FinallyFallThroughState;
  var FinallyState = $__src_codegeneration_generator_FinallyState_js.FinallyState;
  var IdentifierToken = $__src_syntax_IdentifierToken_js.IdentifierToken;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_PredefinedName_js, $ARGUMENTS = $__9.$ARGUMENTS, $THAT = $__9.$THAT, ARGUMENTS = $__9.ARGUMENTS, CAUGHT_EXCEPTION = $__9.CAUGHT_EXCEPTION, FINALLY_FALL_THROUGH = $__9.FINALLY_FALL_THROUGH, STATE = $__9.STATE, STORED_EXCEPTION = $__9.STORED_EXCEPTION, YIELD_SENT = $__9.YIELD_SENT;
  var State = $__src_codegeneration_generator_State_js.State;
  var StateAllocator = $__src_codegeneration_generator_StateAllocator_js.StateAllocator;
  var StateMachine = $__src_syntax_trees_StateMachine_js.StateMachine;
  var $__9 = $__src_codegeneration_generator_SwitchState_js, SwitchClause = $__9.SwitchClause, SwitchState = $__9.SwitchState;
  var $__9 = $__src_syntax_TokenType_js, PLUS = $__9.PLUS, VAR = $__9.VAR;
  var TryState = $__src_codegeneration_generator_TryState_js.TryState;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArrayLiteralExpression = $__9.createArrayLiteralExpression, createAssignStateStatement = $__9.createAssignStateStatement, createAssignmentExpression = $__9.createAssignmentExpression, createAssignmentStatement = $__9.createAssignmentStatement, createBinaryOperator = $__9.createBinaryOperator, createBindingIdentifier = $__9.createBindingIdentifier, createBlock = $__9.createBlock, createBoundCall = $__9.createBoundCall, createBreakStatement = $__9.createBreakStatement, createCaseClause = $__9.createCaseClause, createCatch = $__9.createCatch, createDefaultClause = $__9.createDefaultClause, createEmptyParameterList = $__9.createEmptyParameterList, createEmptyStatement = $__9.createEmptyStatement, createExpressionStatement = $__9.createExpressionStatement, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createIdentifierToken = $__9.createIdentifierToken, createNumberLiteral = $__9.createNumberLiteral, createOperatorToken = $__9.createOperatorToken, createParameterList = $__9.createParameterList, createStatementList = $__9.createStatementList, createStringLiteral = $__9.createStringLiteral, createSwitchStatement = $__9.createSwitchStatement, createThisExpression = $__9.createThisExpression, createThrowStatement = $__9.createThrowStatement, createTrueLiteral = $__9.createTrueLiteral, createTryStatement = $__9.createTryStatement, createVariableStatement = $__9.createVariableStatement, createWhileStatement = $__9.createWhileStatement;
  var variablesInBlock = $__src_semantics_VariableBinder_js.variablesInBlock;
  var CPSTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CPSTransformer = ($__createClass)({
      constructor: function(reporter) {
        $__superCall(this, $__proto, "constructor", []);
        this.reporter = reporter;
        this.stateAllocator_ = new StateAllocator();
        this.labelSet_ = Object.create(null);
      },
      allocateState: function() {
        return this.stateAllocator_.allocateState();
      },
      transformBlock: function(tree) {
        this.clearLabels_();
        var transformedTree = $__superCall(this, $__proto, "transformBlock", [tree]);
        var machine = this.transformStatementList_(transformedTree.statements);
        return machine == null ? transformedTree: machine;
      },
      transformStatementList_: function(someTransformed) {
        if (!this.containsStateMachine_(someTransformed)) {
          return null;
        }
        var currentMachine = this.ensureTransformed_(someTransformed[0]);
        for (var index = 1; index < someTransformed.length; index++) {
          currentMachine = this.createSequence_(currentMachine, this.ensureTransformed_(someTransformed[index]));
        }
        return currentMachine;
      },
      containsStateMachine_: function(statements) {
        if (statements instanceof Array) {
          for (var i = 0; i < statements.length; i++) {
            if (statements[i].type == STATE_MACHINE) {
              return true;
            }
          }
          return false;
        }
        traceur.assert(statements instanceof SwitchStatement);
        for (var i = 0; i < statements.caseClauses.length; i++) {
          var clause = statements.caseClauses[i];
          if (clause.type == CASE_CLAUSE) {
            if (this.containsStateMachine_(clause.statements)) {
              return true;
            }
          } else {
            if (this.containsStateMachine_(clause.statements)) {
              return true;
            }
          }
        }
        return false;
      },
      transformCaseClause: function(tree) {
        var result = $__superCall(this, $__proto, "transformCaseClause", [tree]);
        var machine = this.transformStatementList_(result.statements);
        return machine == null ? result: new CaseClause(null, result.expression, createStatementList(machine));
      },
      transformDoWhileStatement: function(tree) {
        var labels = this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformDoWhileStatement", [tree]);
        if (result.body.type != STATE_MACHINE) {
          return result;
        }
        var loopBodyMachine = result.body;
        var startState = loopBodyMachine.startState;
        var conditionState = loopBodyMachine.fallThroughState;
        var fallThroughState = this.allocateState();
        var states = [];
        this.addLoopBodyStates_(loopBodyMachine, conditionState, fallThroughState, labels, states);
        states.push(new ConditionalState(conditionState, startState, fallThroughState, result.condition));
        return new StateMachine(startState, fallThroughState, states, loopBodyMachine.exceptionBlocks);
      },
      addLoopBodyStates_: function(loopBodyMachine, continueState, breakState, labels, states) {
        for (var i = 0; i < loopBodyMachine.states.length; i++) {
          var state = loopBodyMachine.states[i];
          states.push(state.transformBreakOrContinue(labels, breakState, continueState));
        }
      },
      transformForStatement: function(tree) {
        var labels = this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformForStatement", [tree]);
        if (result.body.type != STATE_MACHINE) {
          return result;
        }
        var loopBodyMachine = result.body;
        var incrementState = loopBodyMachine.fallThroughState;
        var conditionState = result.increment == null && result.condition != null ? incrementState: this.allocateState();
        var startState = result.initializer == null ? conditionState: this.allocateState();
        var fallThroughState = this.allocateState();
        var states = [];
        if (result.initializer != null) {
          states.push(new FallThroughState(startState, conditionState, createStatementList(createExpressionStatement(result.initializer))));
        }
        if (result.condition != null) {
          states.push(new ConditionalState(conditionState, loopBodyMachine.startState, fallThroughState, result.condition));
        } else {
          states.push(new FallThroughState(conditionState, loopBodyMachine.startState, createStatementList()));
        }
        if (result.increment != null) {
          states.push(new FallThroughState(incrementState, conditionState, createStatementList(createExpressionStatement(result.increment))));
        }
        this.addLoopBodyStates_(loopBodyMachine, incrementState, fallThroughState, labels, states);
        return new StateMachine(startState, fallThroughState, states, loopBodyMachine.exceptionBlocks);
      },
      transformForInStatement: function(tree) {
        return tree;
      },
      transformForOfStatement: function(tree) {
        throw new Error('for of statements should be transformed before this pass');
      },
      transformIfStatement: function(tree) {
        var $__10, $__11, $__12;
        this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformIfStatement", [tree]);
        if (result.ifClause.type != STATE_MACHINE && (result.elseClause == null || result.elseClause.type != STATE_MACHINE)) {
          return result;
        }
        var ifClause = this.ensureTransformed_(result.ifClause);
        var elseClause = this.ensureTransformed_(result.elseClause);
        var startState = this.allocateState();
        var fallThroughState = ifClause.fallThroughState;
        var ifState = ifClause.startState;
        var elseState = elseClause == null ? fallThroughState: elseClause.startState;
        var states = [];
        var exceptionBlocks = [];
        states.push(new ConditionalState(startState, ifState, elseState, result.condition));
        ($__10 = states).push.apply($__10, $__toObject(ifClause.states));
        ($__11 = exceptionBlocks).push.apply($__11, $__toObject(ifClause.exceptionBlocks));
        if (elseClause != null) {
          this.replaceAndAddStates_(elseClause.states, elseClause.fallThroughState, fallThroughState, states);
          ($__12 = exceptionBlocks).push.apply($__12, $__toObject(State.replaceAllStates(elseClause.exceptionBlocks, elseClause.fallThroughState, fallThroughState)));
        }
        return new StateMachine(startState, fallThroughState, states, exceptionBlocks);
      },
      replaceAndAddStates_: function(oldStates, oldState, newState, newStates) {
        for (var i = 0; i < oldStates.length; i++) {
          newStates.push(oldStates[i].replaceState(oldState, newState));
        }
      },
      transformLabelledStatement: function(tree) {
        var oldLabels = this.addLabel_(tree.name.value);
        var result = this.transformAny(tree.statement);
        this.restoreLabels_(oldLabels);
        return result;
      },
      clearLabels_: function() {
        var result = this.labelSet_;
        this.labelSet_ = Object.create(null);
        return result;
      },
      restoreLabels_: function(oldLabels) {
        this.labelSet_ = oldLabels;
      },
      addLabel_: function(label) {
        var oldLabels = this.labelSet_;
        var labelSet = Object.create(null);
        for (var k in this.labelSet_) {
          labelSet[k] = k;
        }
        labelSet[label] = label;
        this.labelSet_ = labelSet;
        return oldLabels;
      },
      transformSwitchStatement: function(tree) {
        var labels = this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformSwitchStatement", [tree]);
        if (!this.containsStateMachine_(result)) {
          return result;
        }
        var startState = this.allocateState();
        var fallThroughState = this.allocateState();
        var nextState = fallThroughState;
        var states = [];
        var clauses = [];
        var tryStates = [];
        var hasDefault = false;
        for (var index = result.caseClauses.length - 1; index >= 0; index--) {
          var clause = result.caseClauses[index];
          if (clause.type == CASE_CLAUSE) {
            var caseClause = clause;
            nextState = this.addSwitchClauseStates_(nextState, fallThroughState, labels, caseClause.statements, states, tryStates);
            clauses.push(new SwitchClause(caseClause.expression, nextState));
          } else {
            hasDefault = true;
            var defaultClause = clause;
            nextState = this.addSwitchClauseStates_(nextState, fallThroughState, labels, defaultClause.statements, states, tryStates);
            clauses.push(new SwitchClause(null, nextState));
          }
        }
        if (!hasDefault) {
          clauses.push(new SwitchClause(null, fallThroughState));
        }
        states.push(new SwitchState(startState, result.expression, clauses.reverse()));
        return new StateMachine(startState, fallThroughState, states.reverse(), tryStates);
      },
      addSwitchClauseStates_: function(nextState, fallThroughState, labels, statements, states, tryStates) {
        var $__12;
        var machine = this.ensureTransformedList_(statements);
        for (var i = 0; i < machine.states.length; i++) {
          var state = machine.states[i];
          var transformedState = state.transformBreak(labels, fallThroughState);
          states.push(transformedState.replaceState(machine.fallThroughState, nextState));
        }
        ($__12 = tryStates).push.apply($__12, $__toObject(machine.exceptionBlocks));
        return machine.startState;
      },
      transformTryStatement: function(tree) {
        this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformTryStatement", [tree]);
        if (result.body.type != STATE_MACHINE && (result.catchBlock == null || result.catchBlock.catchBody.type != STATE_MACHINE)) {
          return result;
        }
        var tryMachine = this.ensureTransformed_(result.body);
        if (result.catchBlock != null) {
          var catchBlock = result.catchBlock;
          var exceptionName = catchBlock.binding.identifierToken.value;
          var catchMachine = this.ensureTransformed_(catchBlock.catchBody);
          var startState = tryMachine.startState;
          var fallThroughState = tryMachine.fallThroughState;
          var catchStart = this.allocateState();
          var states = $__spread(tryMachine.states);
          states.push(new FallThroughState(catchStart, catchMachine.startState, createStatementList(createAssignmentStatement(createIdentifierExpression(exceptionName), createIdentifierExpression(STORED_EXCEPTION)))));
          this.replaceAndAddStates_(catchMachine.states, catchMachine.fallThroughState, fallThroughState, states);
          tryMachine = new StateMachine(startState, fallThroughState, states, [new CatchState(exceptionName, catchStart, fallThroughState, tryMachine.getAllStateIDs(), tryMachine.exceptionBlocks)]);
        }
        if (result.finallyBlock != null) {
          var finallyBlock = result.finallyBlock;
          var finallyMachine = this.ensureTransformed_(finallyBlock.block);
          var startState = tryMachine.startState;
          var fallThroughState = tryMachine.fallThroughState;
          var states = $__spread(tryMachine.states, finallyMachine.states, [new FinallyFallThroughState(finallyMachine.fallThroughState)]);
          tryMachine = new StateMachine(startState, fallThroughState, states, [new FinallyState(finallyMachine.startState, finallyMachine.fallThroughState, tryMachine.getAllStateIDs(), tryMachine.exceptionBlocks)]);
        }
        return tryMachine;
      },
      transformVariableStatement: function(tree) {
        var declarations = this.transformVariableDeclarationList(tree.declarations);
        if (declarations == tree.declarations) {
          return tree;
        }
        if (declarations == null) {
          return createEmptyStatement();
        }
        if (declarations.type == VARIABLE_DECLARATION_LIST) {
          return createVariableStatement(declarations);
        }
        return createExpressionStatement(declarations);
      },
      transformVariableDeclarationList: function(tree) {
        if (tree.declarationType == VAR) {
          var expressions = [];
          for (var i = 0; i < tree.declarations.length; i++) {
            var declaration = tree.declarations[i];
            if (declaration.initializer != null) {
              expressions.push(createAssignmentExpression(createIdentifierExpression(this.transformAny(declaration.lvalue)), this.transformAny(declaration.initializer)));
            }
          }
          var list = expressions;
          if (list.length == 0) {
            return null;
          } else if (list.length == 1) {
            return list[0];
          } else {
            return createArrayLiteralExpression(expressions);
          }
        }
        return $__superCall(this, $__proto, "transformVariableDeclarationList", [tree]);
      },
      transformWhileStatement: function(tree) {
        var labels = this.clearLabels_();
        var result = $__superCall(this, $__proto, "transformWhileStatement", [tree]);
        if (result.body.type != STATE_MACHINE) {
          return result;
        }
        var loopBodyMachine = result.body;
        var startState = loopBodyMachine.fallThroughState;
        var fallThroughState = this.allocateState();
        var states = [];
        states.push(new ConditionalState(startState, loopBodyMachine.startState, fallThroughState, result.condition));
        this.addLoopBodyStates_(loopBodyMachine, startState, fallThroughState, labels, states);
        return new StateMachine(startState, fallThroughState, states, loopBodyMachine.exceptionBlocks);
      },
      transformWithStatement: function(tree) {
        var result = $__superCall(this, $__proto, "transformWithStatement", [tree]);
        if (result.body.type != STATE_MACHINE) {
          return result;
        }
        throw new Error('Unreachable - with statement not allowed in strict mode/harmony');
      },
      transformThisExpression: function(tree) {
        return new IdentifierExpression(tree.location, new IdentifierToken(tree.location, $THAT));
      },
      transformIdentifierExpression: function(tree) {
        if (tree.identifierToken.value === ARGUMENTS) {
          return new IdentifierExpression(tree.location, new IdentifierToken(tree.location, $ARGUMENTS));
        }
        return tree;
      },
      generateMachineMethod: function(machine) {
        return createFunctionExpression(createParameterList(YIELD_SENT), createBlock(createWhileStatement(createTrueLiteral(), this.generateMachine(machine))));
      },
      generateHoistedThis: function() {
        return createVariableStatement(VAR, $THAT, createThisExpression());
      },
      generateHoistedArguments: function() {
        return createVariableStatement(VAR, $ARGUMENTS, createIdentifierExpression(ARGUMENTS));
      },
      generateMachine: function(machine) {
        var enclosingFinallyState = machine.getEnclosingFinallyMap();
        var enclosingCatchState = machine.getEnclosingCatchMap();
        var rethrowState = this.allocateState();
        var machineEndState = this.allocateState();
        var body = createSwitchStatement(createIdentifierExpression(STATE), this.transformMachineStates(machine, machineEndState, rethrowState, enclosingFinallyState));
        var caseClauses = [];
        this.addExceptionCases_(rethrowState, enclosingFinallyState, enclosingCatchState, machine.getAllStateIDs(), caseClauses);
        caseClauses.push(createDefaultClause(this.machineUncaughtExceptionStatements(rethrowState)));
        body = createTryStatement(createBlock(body), createCatch(createBindingIdentifier(CAUGHT_EXCEPTION), createBlock(createAssignmentStatement(createIdentifierExpression(STORED_EXCEPTION), createIdentifierExpression(CAUGHT_EXCEPTION)), createSwitchStatement(createIdentifierExpression(STATE), caseClauses))), null);
        return body;
      },
      getMachineVariables: function(tree, machine) {
        var statements = [];
        statements.push(createVariableStatement(VAR, STATE, createNumberLiteral(machine.startState)));
        statements.push(createVariableStatement(VAR, STORED_EXCEPTION, null));
        statements.push(createVariableStatement(VAR, FINALLY_FALL_THROUGH, null));
        var liftedIdentifiers = variablesInBlock(tree, true);
        var allCatchStates = machine.allCatchStates();
        for (var i = 0; i < allCatchStates.length; i++) {
          liftedIdentifiers[allCatchStates[i].identifier] = true;
        }
        var liftedIdentifierList = Object.keys(liftedIdentifiers).sort();
        for (var i = 0; i < liftedIdentifierList.length; i++) {
          var liftedIdentifier = liftedIdentifierList[i];
          statements.push(createVariableStatement(VAR, liftedIdentifier, null));
        }
        return statements;
      },
      addExceptionCases_: function(rethrowState, enclosingFinallyState, enclosingCatchState, allStates, caseClauses) {
        for (var i = 0; i < allStates.length; i++) {
          var state = allStates[i];
          var finallyState = enclosingFinallyState[state];
          var catchState = enclosingCatchState[state];
          if (catchState != null && finallyState != null && catchState.tryStates.indexOf(finallyState.finallyState) >= 0) {
            caseClauses.push(createCaseClause(createNumberLiteral(state), State.generateJumpThroughFinally(finallyState.finallyState, catchState.catchState)));
          } else if (catchState != null) {
            caseClauses.push(createCaseClause(createNumberLiteral(state), createStatementList(createAssignStateStatement(catchState.catchState), createBreakStatement())));
          } else if (finallyState != null) {
            caseClauses.push(createCaseClause(createNumberLiteral(state), State.generateJumpThroughFinally(finallyState.finallyState, rethrowState)));
          } else {}
        }
      },
      transformFunction: function(tree) {
        this.clearLabels_();
        return tree;
      },
      transformGetAccessor: function(tree) {
        return tree;
      },
      transformSetAccessor: function(tree) {
        return tree;
      },
      transformStateMachine: function(tree) {
        return tree;
      },
      statementToStateMachine_: function(statement) {
        return this.statementsToStateMachine_([statement]);
      },
      statementsToStateMachine_: function(statements) {
        var startState = this.allocateState();
        var fallThroughState = this.allocateState();
        return this.stateToStateMachine_(new FallThroughState(startState, fallThroughState, statements), fallThroughState);
      },
      stateToStateMachine_: function(newState, fallThroughState) {
        return new StateMachine(newState.id, fallThroughState, [newState], []);
      },
      transformMachineStates: function(machine, machineEndState, rethrowState, enclosingFinallyState) {
        var cases = [];
        for (var i = 0; i < machine.states.length; i++) {
          var state = machine.states[i];
          var stateCase = state.transformMachineState(enclosingFinallyState[state.id], machineEndState, this.reporter);
          if (stateCase != null) {
            cases.push(stateCase);
          }
        }
        this.addFinallyFallThroughDispatches(null, machine.exceptionBlocks, cases);
        cases.push(createCaseClause(createNumberLiteral(machine.fallThroughState), this.machineFallThroughStatements(machineEndState)));
        cases.push(createCaseClause(createNumberLiteral(machineEndState), this.machineEndStatements()));
        cases.push(createCaseClause(createNumberLiteral(rethrowState), this.machineRethrowStatements(machineEndState)));
        cases.push(createDefaultClause([createThrowStatement(createBinaryOperator(createStringLiteral('traceur compiler bug: invalid state in state machine'), createOperatorToken(PLUS), createIdentifierExpression(STATE)))]));
        return cases;
      },
      addFinallyFallThroughDispatches: function(enclosingFinallyState, tryStates, cases) {
        for (var i = 0; i < tryStates.length; i++) {
          var tryState = tryStates[i];
          if (tryState.kind == TryState.Kind.FINALLY) {
            var finallyState = tryState;
            if (enclosingFinallyState != null) {
              var caseClauses = [];
              var index = 0;
              for (var j = 0; j < enclosingFinallyState.tryStates.length; j++) {
                var destination = enclosingFinallyState.tryStates[j];
                index++;
                var statements;
                if (index < enclosingFinallyState.tryStates.length) {
                  statements = createStatementList();
                } else {
                  statements = createStatementList(createAssignmentStatement(createIdentifierExpression(STATE), createIdentifierExpression(FINALLY_FALL_THROUGH)), createAssignmentStatement(createIdentifierExpression(FINALLY_FALL_THROUGH), createNumberLiteral(State.INVALID_STATE)), createBreakStatement());
                }
                caseClauses.push(createCaseClause(createNumberLiteral(destination), statements));
              }
              caseClauses.push(createDefaultClause(createStatementList(createAssignStateStatement(enclosingFinallyState.finallyState), createBreakStatement())));
              cases.push(createCaseClause(createNumberLiteral(finallyState.fallThroughState), createStatementList(createSwitchStatement(createIdentifierExpression(FINALLY_FALL_THROUGH), caseClauses), createBreakStatement())));
            } else {
              cases.push(createCaseClause(createNumberLiteral(finallyState.fallThroughState), createStatementList(createAssignmentStatement(createIdentifierExpression(STATE), createIdentifierExpression(FINALLY_FALL_THROUGH)), createBreakStatement())));
            }
            this.addFinallyFallThroughDispatches(finallyState, finallyState.nestedTrys, cases);
          } else {
            this.addFinallyFallThroughDispatches(enclosingFinallyState, tryState.nestedTrys, cases);
          }
        }
      },
      createSequence_: function(head, tail) {
        var states = $__spread(head.states);
        for (var i = 0; i < tail.states.length; i++) {
          var tailState = tail.states[i];
          states.push(tailState.replaceState(tail.startState, head.fallThroughState));
        }
        var exceptionBlocks = $__spread(head.exceptionBlocks);
        for (var i = 0; i < tail.exceptionBlocks.length; i++) {
          var tryState = tail.exceptionBlocks[i];
          exceptionBlocks.push(tryState.replaceState(tail.startState, head.fallThroughState));
        }
        return new StateMachine(head.startState, tail.fallThroughState, states, exceptionBlocks);
      },
      maybeTransformStatement_: function(maybeTransformedStatement) {
        if (maybeTransformedStatement.type == VARIABLE_STATEMENT && maybeTransformedStatement.declarations.declarationType != VAR) {
          this.reporter.reportError(maybeTransformedStatement.location != null ? maybeTransformedStatement.location.start: null, 'traceur: const/let declaration may not be ' + 'in a block containing a yield.');
        }
        var breakContinueTransformed = new BreakContinueTransformer(this.stateAllocator_).transformAny(maybeTransformedStatement);
        if (breakContinueTransformed != maybeTransformedStatement) {
          breakContinueTransformed = this.transformAny(breakContinueTransformed);
        }
        return breakContinueTransformed;
      },
      ensureTransformed_: function(statement) {
        if (statement == null) {
          return null;
        }
        var maybeTransformed = this.maybeTransformStatement_(statement);
        return maybeTransformed.type == STATE_MACHINE ? maybeTransformed: this.statementToStateMachine_(maybeTransformed);
      },
      ensureTransformedList_: function(statements) {
        var maybeTransformedStatements = [];
        var foundMachine = false;
        for (var i = 0; i < statements.length; i++) {
          var statement = statements[i];
          var maybeTransformedStatement = this.maybeTransformStatement_(statement);
          maybeTransformedStatements.push(maybeTransformedStatement);
          if (maybeTransformedStatement.type == STATE_MACHINE) {
            foundMachine = true;
          }
        }
        if (!foundMachine) {
          return this.statementsToStateMachine_(statements);
        }
        return this.transformStatementList_(maybeTransformedStatements);
      }
    }, $__proto, $__super, true);
    return $CPSTransformer;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {CPSTransformer: {
      get: function() {
        return CPSTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_EndState_js = (function() {
  "use strict";
  var State = $__src_codegeneration_generator_State_js.State;
  var EndState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $EndState = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      replaceState: function(oldState, newState) {
        return new EndState(State.replaceStateId(this.id, oldState, newState));
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        return State.generateJump(enclosingFinally, machineEndState);
      }
    }, $__proto, $__super, false);
    return $EndState;
  }(State);
  return Object.preventExtensions(Object.create(null, {EndState: {
      get: function() {
        return EndState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_AsyncTransformer_js = (function() {
  "use strict";
  var CPSTransformer = $__src_codegeneration_generator_CPSTransformer_js.CPSTransformer;
  var EndState = $__src_codegeneration_generator_EndState_js.EndState;
  var FallThroughState = $__src_codegeneration_generator_FallThroughState_js.FallThroughState;
  var $__9 = $__src_syntax_PredefinedName_js, $VALUE = $__9.$VALUE, CALLBACK = $__9.CALLBACK, CONTINUATION = $__9.CONTINUATION, CREATE_CALLBACK = $__9.CREATE_CALLBACK, CREATE_ERRBACK = $__9.CREATE_ERRBACK, CREATE_PROMISE = $__9.CREATE_PROMISE, DEFERRED = $__9.DEFERRED, ERR = $__9.ERR, ERRBACK = $__9.ERRBACK, NEW_STATE = $__9.NEW_STATE, RESULT = $__9.RESULT, STATE = $__9.STATE, STORED_EXCEPTION = $__9.STORED_EXCEPTION, THEN = $__9.THEN, WAIT_TASK = $__9.WAIT_TASK;
  var STATE_MACHINE = $__src_syntax_trees_ParseTreeType_js.STATE_MACHINE;
  var StateMachine = $__src_syntax_trees_StateMachine_js.StateMachine;
  var VAR = $__src_syntax_TokenType_js.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignStateStatement = $__9.createAssignStateStatement, createAssignmentStatement = $__9.createAssignmentStatement, createBlock = $__9.createBlock, createBreakStatement = $__9.createBreakStatement, createCallExpression = $__9.createCallExpression, createCallStatement = $__9.createCallStatement, createEmptyArgumentList = $__9.createEmptyArgumentList, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createNewExpression = $__9.createNewExpression, createNumberLiteral = $__9.createNumberLiteral, createParameterList = $__9.createParameterList, createParameterReference = $__9.createParameterReference, createReturnStatement = $__9.createReturnStatement, createStatementList = $__9.createStatementList, createThrowStatement = $__9.createThrowStatement, createUndefinedExpression = $__9.createUndefinedExpression, createVariableStatement = $__9.createVariableStatement;
  var AsyncTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AsyncTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformYieldExpression: function(tree) {
        this.reporter.reportError(tree.location.start, 'Async function may not have a yield expression.');
        return tree;
      },
      transformAwaitStatement: function(tree) {
        var createTaskState = this.allocateState();
        var callbackState = this.allocateState();
        var errbackState = this.allocateState();
        var fallThroughState = this.allocateState();
        var states = [];
        states.push(new FallThroughState(createTaskState, callbackState, createStatementList(createAssignmentStatement(createIdentifierExpression(WAIT_TASK), tree.expression), createCallStatement(createMemberExpression(WAIT_TASK, THEN), createArgumentList(createCallExpression(createIdentifierExpression(CREATE_CALLBACK), createArgumentList(createNumberLiteral(callbackState))), createCallExpression(createIdentifierExpression(CREATE_ERRBACK), createArgumentList(createNumberLiteral(errbackState))))), createReturnStatement(null))));
        var assignment;
        if (tree.identifier != null) {
          assignment = createStatementList(createAssignmentStatement(createIdentifierExpression(tree.identifier), createIdentifierExpression($VALUE)));
        } else {
          assignment = createStatementList();
        }
        states.push(new FallThroughState(callbackState, fallThroughState, assignment));
        states.push(new FallThroughState(errbackState, fallThroughState, createStatementList(createThrowStatement(createIdentifierExpression(ERR)))));
        return new StateMachine(createTaskState, fallThroughState, states, []);
      },
      transformFinally: function(tree) {
        var result = $__superCall(this, $__proto, "transformFinally", [tree]);
        if (result.block.type != STATE_MACHINE) {
          return result;
        }
        this.reporter.reportError(tree.location.start, 'async not permitted within a finally block.');
        return result;
      },
      transformReturnStatement: function(tree) {
        var result = tree.expression;
        if (result == null) {
          result = createUndefinedExpression();
        }
        var startState = this.allocateState();
        var endState = this.allocateState();
        var completeState = new FallThroughState(startState, endState, createStatementList(this.createCompleteTask_(result)));
        var end = new EndState(endState);
        return new StateMachine(startState, this.allocateState(), [completeState, end], []);
      },
      createCompleteTask_: function(result) {
        return createCallStatement(createMemberExpression(RESULT, CALLBACK), createArgumentList(result));
      },
      transformAsyncBody: function(tree) {
        var $__12;
        var transformedTree = this.transformAny(tree);
        if (this.reporter.hadError()) {
          return tree;
        }
        var machine = transformedTree;
        var statements = [];
        statements.push(this.generateHoistedThis());
        ($__12 = statements).push.apply($__12, $__toObject(this.getMachineVariables(tree, machine)));
        statements.push(createVariableStatement(VAR, $VALUE, null));
        statements.push(createVariableStatement(VAR, ERR, null));
        statements.push(createVariableStatement(VAR, RESULT, createNewExpression(createIdentifierExpression(DEFERRED), createEmptyArgumentList())));
        statements.push(createVariableStatement(VAR, WAIT_TASK, null));
        statements.push(createVariableStatement(VAR, CONTINUATION, this.generateMachineMethod(machine)));
        statements.push(createVariableStatement(VAR, CREATE_CALLBACK, createFunctionExpression(createParameterList(NEW_STATE), createBlock(createReturnStatement(createFunctionExpression(createParameterList(1), createBlock(createAssignmentStatement(createIdentifierExpression(STATE), createIdentifierExpression(NEW_STATE)), createAssignmentStatement(createIdentifierExpression($VALUE), createParameterReference(0)), createCallStatement(createIdentifierExpression(CONTINUATION)))))))));
        statements.push(createVariableStatement(VAR, CREATE_ERRBACK, createFunctionExpression(createParameterList(NEW_STATE), createBlock(createReturnStatement(createFunctionExpression(createParameterList(1), createBlock(createAssignmentStatement(createIdentifierExpression(STATE), createIdentifierExpression(NEW_STATE)), createAssignmentStatement(createIdentifierExpression(ERR), createParameterReference(0)), createCallStatement(createIdentifierExpression(CONTINUATION)))))))));
        statements.push(createCallStatement(createIdentifierExpression(CONTINUATION)));
        statements.push(createReturnStatement(createCallExpression(createMemberExpression(RESULT, CREATE_PROMISE))));
        return createBlock(statements);
      },
      machineUncaughtExceptionStatements: function(rethrowState) {
        return createStatementList(createAssignStateStatement(rethrowState), createBreakStatement());
      },
      machineEndStatements: function() {
        return createStatementList(createReturnStatement(null));
      },
      machineFallThroughStatements: function(machineEndState) {
        return createStatementList(this.createCompleteTask_(createUndefinedExpression()), createAssignStateStatement(machineEndState), createBreakStatement());
      },
      machineRethrowStatements: function(machineEndState) {
        return createStatementList(createCallStatement(createMemberExpression(RESULT, ERRBACK), createArgumentList(createIdentifierExpression(STORED_EXCEPTION))), createAssignStateStatement(machineEndState), createBreakStatement());
      }
    }, $__proto, $__super, false);
    return $AsyncTransformer;
  }(CPSTransformer);
  AsyncTransformer.transformAsyncBody = function(reporter, body) {
    return new AsyncTransformer(reporter).transformAsyncBody(body);
  };
  return Object.preventExtensions(Object.create(null, {AsyncTransformer: {
      get: function() {
        return AsyncTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_ForInTransformPass_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BLOCK = $__9.BLOCK, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION;
  var IdentifierExpression = $__src_syntax_trees_ParseTrees_js.IdentifierExpression;
  var $__9 = $__src_syntax_PredefinedName_js, LENGTH = $__9.LENGTH, PUSH = $__9.PUSH;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, BANG = $__9.BANG, IN = $__9.IN, OPEN_ANGLE = $__9.OPEN_ANGLE, PLUS_PLUS = $__9.PLUS_PLUS, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentStatement = $__9.createAssignmentStatement, createBinaryOperator = $__9.createBinaryOperator, createBlock = $__9.createBlock, createCallStatement = $__9.createCallStatement, createContinueStatement = $__9.createContinueStatement, createEmptyArrayLiteralExpression = $__9.createEmptyArrayLiteralExpression, createForInStatement = $__9.createForInStatement, createForStatement = $__9.createForStatement, createIdentifierExpression = $__9.createIdentifierExpression, createIfStatement = $__9.createIfStatement, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createNumberLiteral = $__9.createNumberLiteral, createOperatorToken = $__9.createOperatorToken, createParenExpression = $__9.createParenExpression, createPostfixExpression = $__9.createPostfixExpression, createUnaryExpression = $__9.createUnaryExpression, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var ForInTransformPass = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ForInTransformPass = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformForInStatement: function(original) {
        var $__12, $__11;
        var tree = original;
        var bodyStatements = [];
        var body = this.transformAny(tree.body);
        if (body.type == BLOCK) {
          ($__12 = bodyStatements).push.apply($__12, $__toObject(body.statements));
        } else {
          bodyStatements.push(body);
        }
        var elements = [];
        var keys = this.getTempIdentifier();
        elements.push(createVariableStatement(VAR, keys, createEmptyArrayLiteralExpression()));
        var collection = this.getTempIdentifier();
        elements.push(createVariableStatement(VAR, collection, tree.collection));
        var p = this.getTempIdentifier();
        elements.push(createForInStatement(createVariableDeclarationList(VAR, p, null), createIdentifierExpression(collection), createCallStatement(createMemberExpression(keys, PUSH), createArgumentList(createIdentifierExpression(p)))));
        var i = this.getTempIdentifier();
        var lookup = createMemberLookupExpression(createIdentifierExpression(keys), createIdentifierExpression(i));
        var originalKey, assignOriginalKey;
        if (tree.initializer.type == VARIABLE_DECLARATION_LIST) {
          var decList = tree.initializer;
          originalKey = createIdentifierExpression(decList.declarations[0].lvalue);
          assignOriginalKey = createVariableStatement(decList.declarationType, originalKey.identifierToken, lookup);
        } else if (tree.initializer.type == IDENTIFIER_EXPRESSION) {
          originalKey = tree.initializer;
          assignOriginalKey = createAssignmentStatement(tree.initializer, lookup);
        } else {
          throw new Error('Invalid left hand side of for in loop');
        }
        var innerBlock = [];
        innerBlock.push(assignOriginalKey);
        innerBlock.push(createIfStatement(createUnaryExpression(createOperatorToken(BANG), createParenExpression(createBinaryOperator(originalKey, createOperatorToken(IN), createIdentifierExpression(collection)))), createContinueStatement(), null));
        ($__11 = innerBlock).push.apply($__11, $__toObject(bodyStatements));
        elements.push(createForStatement(createVariableDeclarationList(VAR, i, createNumberLiteral(0)), createBinaryOperator(createIdentifierExpression(i), createOperatorToken(OPEN_ANGLE), createMemberExpression(keys, LENGTH)), createPostfixExpression(createIdentifierExpression(i), createOperatorToken(PLUS_PLUS)), createBlock(innerBlock)));
        return createBlock(elements);
      }
    }, $__proto, $__super, false);
    return $ForInTransformPass;
  }(TempVarTransformer);
  ForInTransformPass.transformTree = function(identifierGenerator, tree) {
    return new ForInTransformPass(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ForInTransformPass: {
      get: function() {
        return ForInTransformPass;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_YieldState_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, CURRENT = $__9.CURRENT, RESULT = $__9.RESULT;
  var State = $__src_codegeneration_generator_State_js.State;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignmentStatement = $__9.createAssignmentStatement, createMemberExpression = $__9.createMemberExpression, createReturnStatement = $__9.createReturnStatement, createTrueLiteral = $__9.createTrueLiteral;
  var YieldState = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $YieldState = ($__createClass)({
      constructor: function(id, fallThroughState, expression) {
        $__superCall(this, $__proto, "constructor", [id]);
        this.fallThroughState = fallThroughState;
        this.expression = expression;
      },
      replaceState: function(oldState, newState) {
        return new YieldState(State.replaceStateId(this.id, oldState, newState), State.replaceStateId(this.fallThroughState, oldState, newState), this.expression);
      },
      transform: function(enclosingFinally, machineEndState, reporter) {
        return $__spread([createAssignmentStatement(createMemberExpression(RESULT, CURRENT), this.expression)], State.generateAssignState(enclosingFinally, this.fallThroughState), [createReturnStatement(createTrueLiteral())]);
      }
    }, $__proto, $__super, true);
    return $YieldState;
  }(State);
  return Object.preventExtensions(Object.create(null, {YieldState: {
      get: function() {
        return YieldState;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_generator_GeneratorTransformer_js = (function() {
  "use strict";
  var CPSTransformer = $__src_codegeneration_generator_CPSTransformer_js.CPSTransformer;
  var EndState = $__src_codegeneration_generator_EndState_js.EndState;
  var $__9 = $__src_syntax_PredefinedName_js, ADD_ITERATOR = $__9.ADD_ITERATOR, MOVE_NEXT = $__9.MOVE_NEXT, RESULT = $__9.RESULT, RUNTIME = $__9.RUNTIME, STORED_EXCEPTION = $__9.STORED_EXCEPTION, TRACEUR = $__9.TRACEUR;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, STATE_MACHINE = $__9.STATE_MACHINE, YIELD_EXPRESSION = $__9.YIELD_EXPRESSION;
  var StateMachine = $__src_syntax_trees_StateMachine_js.StateMachine;
  var VAR = $__src_syntax_TokenType_js.VAR;
  var YieldState = $__src_codegeneration_generator_YieldState_js.YieldState;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignStateStatement = $__9.createAssignStateStatement, createAssignmentStatement = $__9.createAssignmentStatement, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createEmptyParameterList = $__9.createEmptyParameterList, createExpressionStatement = $__9.createExpressionStatement, createFalseLiteral = $__9.createFalseLiteral, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createObjectLiteralExpression = $__9.createObjectLiteralExpression, createPropertyNameAssignment = $__9.createPropertyNameAssignment, createReturnStatement = $__9.createReturnStatement, createStatementList = $__9.createStatementList, createStringLiteral = $__9.createStringLiteral, createThisExpression = $__9.createThisExpression, createThrowStatement = $__9.createThrowStatement, createVariableStatement = $__9.createVariableStatement;
  var GeneratorTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $GeneratorTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformYieldExpression_: function(tree) {
        if (tree.expression != null) {
          var startState = this.allocateState();
          var fallThroughState = this.allocateState();
          return this.stateToStateMachine_(new YieldState(startState, fallThroughState, this.transformAny(tree.expression)), fallThroughState);
        }
        var stateId = this.allocateState();
        return new StateMachine(stateId, this.allocateState(), [new EndState(stateId)], []);
      },
      transformExpressionStatement: function(tree) {
        var e = tree.expression;
        if (e.type === YIELD_EXPRESSION) return this.transformYieldExpression_(e);
        return $__superCall(this, $__proto, "transformExpressionStatement", [tree]);
      },
      transformAwaitStatement: function(tree) {
        this.reporter.reportError(tree.location.start, 'Generator function may not have an async statement.');
        return tree;
      },
      transformFinally: function(tree) {
        var result = $__superCall(this, $__proto, "transformFinally", [tree]);
        if (result.block.type != STATE_MACHINE) {
          return result;
        }
        this.reporter.reportError(tree.location.start, 'yield not permitted from within a finally block.');
        return result;
      },
      transformReturnStatement: function(tree) {
        this.reporter.reportError(tree.location.start, 'Generator function may not have a return statement.');
        return tree;
      },
      transformGeneratorBody: function(tree) {
        var $__11;
        var transformedTree = this.transformAny(tree);
        if (this.reporter.hadError()) {
          return tree;
        }
        var machine = transformedTree;
        var statements = [];
        statements.push(this.generateHoistedThis());
        statements.push(this.generateHoistedArguments());
        ($__11 = statements).push.apply($__11, $__toObject(this.getMachineVariables(tree, machine)));
        statements.push(createVariableStatement(VAR, RESULT, createObjectLiteralExpression(createPropertyNameAssignment(MOVE_NEXT, this.generateMachineMethod(machine)))));
        statements.push(createExpressionStatement(createCallExpression(createMemberExpression(TRACEUR, RUNTIME, ADD_ITERATOR), createArgumentList(createIdentifierExpression(RESULT)))));
        statements.push(createReturnStatement(createIdentifierExpression(RESULT)));
        return createBlock(statements);
      },
      machineUncaughtExceptionStatements: function(rethrowState) {
        return createStatementList(createThrowStatement(createIdentifierExpression(STORED_EXCEPTION)));
      },
      machineRethrowStatements: function(machineEndState) {
        return createStatementList(createThrowStatement(createIdentifierExpression(STORED_EXCEPTION)));
      },
      machineFallThroughStatements: function(machineEndState) {
        return createStatementList(createAssignStateStatement(machineEndState));
      },
      machineEndStatements: function() {
        return [createReturnStatement(createFalseLiteral())];
      }
    }, $__proto, $__super, false);
    return $GeneratorTransformer;
  }(CPSTransformer);
  GeneratorTransformer.transformGeneratorBody = function(reporter, body) {
    return new GeneratorTransformer(reporter).transformGeneratorBody(body);
  };
  return Object.preventExtensions(Object.create(null, {GeneratorTransformer: {
      get: function() {
        return GeneratorTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_GeneratorTransformPass_js = (function() {
  "use strict";
  var AsyncTransformer = $__src_codegeneration_generator_AsyncTransformer_js.AsyncTransformer;
  var ForInTransformPass = $__src_codegeneration_generator_ForInTransformPass_js.ForInTransformPass;
  var ForOfTransformer = $__src_codegeneration_ForOfTransformer_js.ForOfTransformer;
  var $__9 = $__src_syntax_trees_ParseTrees_js, GetAccessor = $__9.GetAccessor, SetAccessor = $__9.SetAccessor;
  var GeneratorTransformer = $__src_codegeneration_generator_GeneratorTransformer_js.GeneratorTransformer;
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_TokenType_js, EQUAL = $__9.EQUAL, VAR = $__9.VAR;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BINARY_OPERATOR = $__9.BINARY_OPERATOR, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, VARIABLE_DECLARATION = $__9.VARIABLE_DECLARATION, YIELD_EXPRESSION = $__9.YIELD_EXPRESSION;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createAssignmentExpression = $__9.createAssignmentExpression, createAssignmentStatement = $__9.createAssignmentStatement, createBlock = $__9.createBlock, createCommaExpression = $__9.createCommaExpression, createExpressionStatement = $__9.createExpressionStatement, createForOfStatement = $__9.createForOfStatement, createIdentifierExpression = $__9.createIdentifierExpression, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement, createYieldStatement = $__9.createYieldStatement;
  var YIELD_SENT = $__src_syntax_PredefinedName_js.YIELD_SENT;
  var transformOptions = $__src_options_js.transformOptions;
  function isYieldAssign(tree) {
    return tree.operator.type === EQUAL && tree.right.type === YIELD_EXPRESSION && tree.left.type === IDENTIFIER_EXPRESSION;
  }
  var YieldFinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $YieldFinder = ($__createClass)({
      constructor: function(tree) {
        this.hasYield = false;
        this.hasYieldFor = false;
        this.hasForIn = false;
        this.hasAsync = false;
        this.visitAny(tree);
      },
      hasAnyGenerator: function() {
        return this.hasYield || this.hasAsync;
      },
      visitYieldExpression: function(tree) {
        this.hasYield = true;
        this.hasYieldFor = tree.isYieldFor;
      },
      visitAwaitStatement: function(tree) {
        this.hasAsync = true;
      },
      visitForInStatement: function(tree) {
        this.hasForIn = true;
        $__superCall(this, $__proto, "visitForInStatement", [tree]);
      },
      visitFunction: function(tree) {},
      visitSetAccessor: function(tree) {},
      visitGetAccessor: function(tree) {}
    }, $__proto, $__super, true);
    return $YieldFinder;
  }(ParseTreeVisitor);
  var YieldForTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $YieldForTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformYieldForExpression_: function(tree) {
        var idTemp = createIdentifierExpression(this.getTempIdentifier());
        var varTemp = createVariableDeclarationList(VAR, idTemp, null);
        var expression = tree.expression;
        var yieldTemp = createYieldStatement(idTemp, false);
        var forEach = createForOfStatement(varTemp, expression, yieldTemp);
        return ForOfTransformer.transformTree(this.identifierGenerator, forEach);
      },
      transformExpressionStatement: function(tree) {
        var e = tree.expression;
        if (e.type === YIELD_EXPRESSION && e.isYieldFor) return this.transformYieldForExpression_(e);
        return tree;
      }
    }, $__proto, $__super, false);
    return $YieldForTransformer;
  }(TempVarTransformer);
  YieldForTransformer.transformTree = function(identifierGenerator, tree) {
    return new YieldForTransformer(identifierGenerator).transformAny(tree);
  };
  var YieldExpressionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $YieldExpressionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", []);
        this.sentId = createIdentifierExpression(YIELD_SENT);
      },
      transformExpressionStatement: function(tree) {
        var e = tree.expression, ex;
        while (e.type === PAREN_EXPRESSION) {
          e = e.expression;
        }
        function commaWrap(lhs, rhs) {
          return createExpressionStatement(createCommaExpression($__spread([createAssignmentExpression(lhs, rhs)], ex.slice(1))));
        }
        switch (e.type) {
          case BINARY_OPERATOR:
            if (isYieldAssign(e)) return this.factor_(e.left, e.right, createAssignmentStatement);
            break;
          case COMMA_EXPRESSION:
            ex = e.expressions;
            if (ex[0].type === BINARY_OPERATOR && isYieldAssign(ex[0])) return this.factor_(ex[0].left, ex[0].right, commaWrap);
        }
        return tree;
      },
      transformVariableStatement: function(tree) {
        var tdd = tree.declarations.declarations;
        function isYieldVarAssign(tree) {
          return tree.initializer && tree.initializer.type === YIELD_EXPRESSION;
        }
        function varWrap(lhs, rhs) {
          return createVariableStatement(createVariableDeclarationList(tree.declarations.declarationType, $__spread([createVariableDeclaration(lhs, rhs)], tdd.slice(1))));
        }
        if (isYieldVarAssign(tdd[0])) return this.factor_(tdd[0].lvalue, tdd[0].initializer, varWrap);
        return tree;
      },
      factor_: function(lhs, rhs, wrap) {
        return createBlock([createExpressionStatement(rhs), wrap(lhs, this.sentId)]);
      }
    }, $__proto, $__super, true);
    return $YieldExpressionTransformer;
  }(ParseTreeTransformer);
  YieldExpressionTransformer.transformTree = function(tree) {
    return new YieldExpressionTransformer().transformAny(tree);
  };
  var GeneratorTransformPass = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $GeneratorTransformPass = ($__createClass)({
      constructor: function(identifierGenerator, reporter) {
        $__superCall(this, $__proto, "constructor", [identifierGenerator]);
        this.reporter_ = reporter;
      },
      transformFunction: function(tree) {
        var body = this.transformBody_(tree.functionBody);
        if (body === tree.functionBody) return tree;
        var isGenerator = false;
        return new tree.constructor(null, tree.name, isGenerator, tree.formalParameterList, body);
      },
      transformBody_: function(tree) {
        var finder = new YieldFinder(tree);
        var body = $__superCall(this, $__proto, "transformBlock", [tree]);
        if (!finder.hasAnyGenerator()) {
          return body;
        }
        body = YieldExpressionTransformer.transformTree(body);
        if (finder.hasForIn && (transformOptions.generators || transformOptions.deferredFunctions)) {
          body = ForInTransformPass.transformTree(this.identifierGenerator, body);
        }
        if (finder.hasYieldFor && transformOptions.generators) {
          body = YieldForTransformer.transformTree(this.identifierGenerator, body);
        }
        if (finder.hasYield) {
          if (transformOptions.generators) {
            body = GeneratorTransformer.transformGeneratorBody(this.reporter_, body);
          }
        } else if (transformOptions.deferredFunctions) {
          body = AsyncTransformer.transformAsyncBody(this.reporter_, body);
        }
        return body;
      },
      transformGetAccessor: function(tree) {
        var body = this.transformBody_(tree.body);
        if (body == tree.body) {
          return tree;
        }
        return new GetAccessor(null, tree.name, body);
      },
      transformSetAccessor: function(tree) {
        var body = this.transformBody_(tree.body);
        if (body == tree.body) {
          return tree;
        }
        return new SetAccessor(null, tree.name, tree.parameter, body);
      }
    }, $__proto, $__super, true);
    return $GeneratorTransformPass;
  }(TempVarTransformer);
  GeneratorTransformPass.transformTree = function(identifierGenerator, reporter, tree) {
    return new GeneratorTransformPass(identifierGenerator, reporter).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {GeneratorTransformPass: {
      get: function() {
        return GeneratorTransformPass;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_IsExpressionTransformer_js = (function() {
  "use strict";
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_PredefinedName_js, IS = $__9.IS, ISNT = $__9.ISNT, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var LITERAL_EXPRESSION = $__src_syntax_trees_ParseTreeType_js.LITERAL_EXPRESSION;
  var $__9 = $__src_syntax_TokenType_js, EQUAL_EQUAL_EQUAL = $__9.EQUAL_EQUAL_EQUAL, IDENTIFIER = $__9.IDENTIFIER, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, NUMBER = $__9.NUMBER;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createBinaryOperator = $__9.createBinaryOperator, createCallExpression = $__9.createCallExpression, createMemberExpression = $__9.createMemberExpression, createOperatorToken = $__9.createOperatorToken;
  function isGoodLiteral(tree) {
    if (tree.type !== LITERAL_EXPRESSION) return false;
    var token = tree.literalToken;
    if (token.type === NUMBER) return Number(token.value) !== 0;
    return true;
  }
  var IsExpressionTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $IsExpressionTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformBinaryOperator: function(tree) {
        var operator = tree.operator;
        if (operator.type !== IDENTIFIER || operator.value !== IS && operator.value !== ISNT) {
          return $__superCall(this, $__proto, "transformBinaryOperator", [tree]);
        }
        var left = this.transformAny(tree.left);
        var right = this.transformAny(tree.right);
        if (isGoodLiteral(left) || isGoodLiteral(right)) {
          var op = operator.value === IS ? EQUAL_EQUAL_EQUAL: NOT_EQUAL_EQUAL;
          return createBinaryOperator(left, createOperatorToken(op), right);
        }
        return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, operator.value), createArgumentList(left, right));
      }
    }, $__proto, $__super, false);
    return $IsExpressionTransformer;
  }(ParseTreeTransformer);
  IsExpressionTransformer.transformTree = function(tree) {
    return new IsExpressionTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {IsExpressionTransformer: {
      get: function() {
        return IsExpressionTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_util_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION;
  var STRING = $__src_syntax_TokenType_js.STRING;
  function hasUseStrict(list) {
    var li;
    if (!list || !list.length || !(li = list[0])) return false;
    if (li.type !== EXPRESSION_STATEMENT || !(li = li.expression)) return false;
    if (li.type !== LITERAL_EXPRESSION || !(li = li.literalToken)) return false;
    if (li.type !== STRING) return false;
    return li.processedValue === 'use strict';
  }
  return Object.preventExtensions(Object.create(null, {hasUseStrict: {
      get: function() {
        return hasUseStrict;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ModuleTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, BindingElement = $__9.BindingElement, BindingIdentifier = $__9.BindingIdentifier, IdentifierExpression = $__9.IdentifierExpression, LiteralExpression = $__9.LiteralExpression, ObjectPattern = $__9.ObjectPattern, ObjectPatternField = $__9.ObjectPatternField, Program = $__9.Program;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_PredefinedName_js, GET_MODULE_INSTANCE_BY_URL = $__9.GET_MODULE_INSTANCE_BY_URL, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, CLASS_DECLARATION = $__9.CLASS_DECLARATION, EXPORT_DECLARATION = $__9.EXPORT_DECLARATION, EXPORT_MAPPING_LIST = $__9.EXPORT_MAPPING_LIST, EXPORT_SPECIFIER = $__9.EXPORT_SPECIFIER, EXPORT_STAR = $__9.EXPORT_STAR, FUNCTION_DECLARATION = $__9.FUNCTION_DECLARATION, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, IMPORT_DECLARATION = $__9.IMPORT_DECLARATION, MODULE_DECLARATION = $__9.MODULE_DECLARATION, MODULE_DEFINITION = $__9.MODULE_DEFINITION, MODULE_REQUIRE = $__9.MODULE_REQUIRE, VARIABLE_STATEMENT = $__9.VARIABLE_STATEMENT;
  var $__9 = $__src_syntax_TokenType_js, STAR = $__9.STAR, VAR = $__9.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createBindingIdentifier = $__9.createBindingIdentifier, createBlock = $__9.createBlock, createCallExpression = $__9.createCallExpression, createEmptyParameterList = $__9.createEmptyParameterList, createExpressionStatement = $__9.createExpressionStatement, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createIdentifierToken = $__9.createIdentifierToken, createMemberExpression = $__9.createMemberExpression, createNullLiteral = $__9.createNullLiteral, createObjectCreate = $__9.createObjectCreate, createObjectLiteralExpression = $__9.createObjectLiteralExpression, createObjectPreventExtensions = $__9.createObjectPreventExtensions, createProgram = $__9.createProgram, createPropertyDescriptor = $__9.createPropertyDescriptor, createPropertyNameAssignment = $__9.createPropertyNameAssignment, createReturnStatement = $__9.createReturnStatement, createScopedExpression = $__9.createScopedExpression, createUseStrictDirective = $__9.createUseStrictDirective, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var hasUseStrict = $__src_semantics_util_js.hasUseStrict;
  function toBindingIdentifier(tree) {
    return new BindingIdentifier(tree.location, tree.identifierToken);
  }
  function getGetterExport(project, symbol) {
    var name = symbol.name;
    var tree = symbol.tree;
    var returnExpression;
    switch (tree.type) {
      case EXPORT_SPECIFIER:
        returnExpression = transformSpecifier(project, tree.lhs, symbol.relatedTree);
        break;
      case EXPORT_STAR:
        traceur.assert(symbol.relatedTree);
        returnExpression = transformSpecifier(project, createIdentifierToken(symbol.name), symbol.relatedTree);
        break;
      case IDENTIFIER_EXPRESSION:
        if (!symbol.relatedTree) {
          returnExpression = tree;
        } else {
          returnExpression = transformSpecifier(project, tree.identifierToken, symbol.relatedTree);
        }
        break;
      default:
        returnExpression = createIdentifierExpression(name);
        break;
    }
    var fun = createFunctionExpression(createEmptyParameterList(), createBlock(createReturnStatement(returnExpression)));
    var descriptor = createPropertyDescriptor({
      get: fun,
      enumerable: true
    });
    return createPropertyNameAssignment(name, descriptor);
  }
  function transformSpecifier(project, identifierToken, moduleExpression) {
    if (moduleExpression) {
      var operand = new ModuleTransformer(project).transformAny(moduleExpression);
      return createMemberExpression(operand, identifierToken);
    }
    return createIdentifierExpression(identifierToken);
  }
  var ModuleTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleTransformer = ($__createClass)({
      constructor: function(project) {
        $__superCall(this, $__proto, "constructor", []);
        this.project_ = project;
      },
      transformModuleExpression: function(tree) {
        var reference = tree.reference;
        if (reference.type == MODULE_REQUIRE) {
          return createCallExpression(createMemberExpression(TRACEUR, RUNTIME, GET_MODULE_INSTANCE_BY_URL), createArgumentList(new LiteralExpression(null, reference.url)));
        }
        if (tree.identifiers.length == 0) return reference;
        return createMemberExpression(reference, tree.identifiers);
      },
      transformModuleSpecifier: function(tree) {
        var expression = this.transformAny(tree.expression);
        return createVariableDeclaration(tree.identifier, expression);
      },
      transformImportDeclaration: function(tree) {
        var declarations = this.transformList(tree.importPathList);
        return createVariableStatement(createVariableDeclarationList(VAR, declarations));
      },
      transformImportBinding: function(tree) {
        var importSpecifierSet;
        if (tree.importSpecifierSet.type == IDENTIFIER_EXPRESSION) {
          var field = new BindingElement(tree.location, createBindingIdentifier(tree.importSpecifierSet.identifierToken), null);
          importSpecifierSet = new ObjectPattern(tree.location, [field]);
        } else {
          importSpecifierSet = this.transformAny(tree.importSpecifierSet);
        }
        var moduleExpression = this.transformAny(tree.moduleExpression);
        return createVariableDeclaration(importSpecifierSet, moduleExpression);
      },
      transformImportSpecifierSet: function(tree) {
        var fields;
        if (tree.specifiers.type === STAR) {
          var module = this.project_.getModuleForStarTree(tree);
          var fields = module.getExports().map((function(exportSymbol) {
            return new BindingElement(tree.location, createBindingIdentifier(exportSymbol.name), null);
          }));
        } else {
          fields = this.transformList(tree.specifiers);
        }
        return new ObjectPattern(null, fields);
      },
      transformImportSpecifier: function(tree) {
        if (tree.rhs) {
          var binding = new BindingIdentifier(tree.location, tree.rhs);
          var bindingElement = new BindingElement(tree.location, binding, null);
          return new ObjectPatternField(tree.location, tree.lhs, bindingElement);
        }
        return new BindingElement(tree.location, createBindingIdentifier(tree.lhs), null);
      }
    }, $__proto, $__super, true);
    return $ModuleTransformer;
  }(ParseTreeTransformer);
  ModuleTransformer.transform = function(project, tree) {
    var module = project.getRootModule();
    var useStrictCount = hasUseStrict(tree.programElements) ? 1: 0;
    var elements = tree.programElements.map((function(element) {
      switch (element.type) {
        case MODULE_DEFINITION:
          return transformDefinition(project, module, element, useStrictCount);
        case MODULE_DECLARATION:
          return transformDeclaration(project, module, element);
        case IMPORT_DECLARATION:
          return new ModuleTransformer(project).transformAny(element);
        default:
          return element;
      }
    }));
    return new Program(tree.location, elements);
  };
  ModuleTransformer.transformAsModule = function(project, module, tree) {
    var callExpression = transformModuleElements(project, module, tree.programElements);
    return createProgram([createExpressionStatement(callExpression)]);
  };
  function transformModuleElements(project, module, elements, useStrictCount) {
    var statements = [];
    useStrictCount = useStrictCount || 0;
    if (!useStrictCount) statements.push(createUseStrictDirective());
    elements.forEach((function(element) {
      switch (element.type) {
        case MODULE_DECLARATION:
          statements.push(transformDeclaration(project, module, element));
          break;
        case MODULE_DEFINITION:
          statements.push(transformDefinition(project, module, element, useStrictCount + 1));
          break;
        case EXPORT_DECLARATION:
          var declaration = element.declaration;
          switch (declaration.type) {
            case MODULE_DEFINITION:
              statements.push(transformDefinition(project, module, declaration, useStrictCount + 1));
              break;
            case MODULE_DECLARATION:
              statements.push(transformDeclaration(project, module, declaration));
              break;
            case EXPORT_MAPPING_LIST:
              break;
            case CLASS_DECLARATION:
            case FUNCTION_DECLARATION:
            case VARIABLE_STATEMENT:
              statements.push(declaration);
              break;
            default:
              throw new Error('unreachable');
          }
          break;
        case IMPORT_DECLARATION:
          var transformer = new ModuleTransformer(project);
          statements.push(transformer.transformAny(element));
          break;
        default:
          statements.push(element);
      }
    }));
    var properties = module.getExports().map((function(exp) {
      return getGetterExport(project, exp);
    }));
    var descriptors = createObjectLiteralExpression(properties);
    statements.push(createReturnStatement(createObjectPreventExtensions(createObjectCreate(createNullLiteral(), descriptors))));
    return createScopedExpression(createBlock(statements));
  }
  function transformDefinition(project, parent, tree, useStrictCount) {
    var module = parent.getModule(tree.name.value);
    var callExpression = transformModuleElements(project, module, tree.elements, useStrictCount);
    return createVariableStatement(VAR, module.name, callExpression);
  }
  function transformDeclaration(project, parent, tree) {
    var transformer = new ModuleTransformer(project);
    var list = tree.specifiers.map(transformer.transformAny, transformer);
    var variableDeclarationList = createVariableDeclarationList(VAR, list);
    return createVariableStatement(variableDeclarationList);
  }
  return Object.preventExtensions(Object.create(null, {ModuleTransformer: {
      get: function() {
        return ModuleTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ObjectLiteralTransformer_js = (function() {
  "use strict";
  var FindVisitor = $__src_codegeneration_FindVisitor_js.FindVisitor;
  var $__9 = $__src_syntax_trees_ParseTrees_js, FormalParameterList = $__9.FormalParameterList, FunctionExpression = $__9.FunctionExpression, IdentifierExpression = $__9.IdentifierExpression, LiteralExpression = $__9.LiteralExpression;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, AT_NAME = $__9.AT_NAME, IDENTIFIER = $__9.IDENTIFIER, STRING = $__9.STRING;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createAssignmentExpression = $__9.createAssignmentExpression, createBindingIdentifier = $__9.createBindingIdentifier, createCallExpression = $__9.createCallExpression, createCommaExpression = $__9.createCommaExpression, createDefineProperty = $__9.createDefineProperty, createEmptyParameterList = $__9.createEmptyParameterList, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createObjectCreate = $__9.createObjectCreate, createObjectLiteralExpression = $__9.createObjectLiteralExpression, createParenExpression = $__9.createParenExpression, createPropertyDescriptor = $__9.createPropertyDescriptor, createPropertyNameAssignment = $__9.createPropertyNameAssignment, createStringLiteral = $__9.createStringLiteral;
  var transformOptions = $__src_options_js.transformOptions;
  function findAtNameInProperty(propertyName) {
    return function(tree) {
      if (transformOptions.privateNameSyntax && tree[propertyName].type === AT_NAME) {
        this.found = true;
      }
    };
  }
  var AtNameFinder = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $AtNameFinder = ($__createClass)({
      constructor: function(tree) {
        this.protoExpression = null;
        $__superCall(this, $__proto, "constructor", [tree, true]);
      },
      checkAtName_: function(tree) {
        if (transformOptions.privateNameSyntax && tree.name.type === AT_NAME) {
          return this.found = true;
        }
        return false;
      },
      visitPropertyNameAssignment: function(tree) {
        if (this.checkAtName_(tree)) return;
        if (getPropertyNameForToken(tree.name) === '__proto__') {
          this.protoExpression = tree.value;
        }
      },
      visitGetAccessor: function(tree) {
        this.checkAtName_(tree);
      },
      visitSetAccessor: function(tree) {
        this.checkAtName_(tree);
      },
      visitPropertyMethodAssignment: function(tree) {
        this.checkAtName_(tree);
      },
      visitPropertyNameShorthand: function(tree) {
        this.checkAtName_(tree);
      }
    }, $__proto, $__super, true);
    return $AtNameFinder;
  }(FindVisitor);
  function getPropertyNameForToken(nameToken) {
    if (nameToken.type === STRING) return nameToken.processedValue;
    return nameToken.value;
  }
  var ObjectLiteralTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ObjectLiteralTransformer = ($__createClass)({
      constructor: function(identifierGenerator) {
        $__superCall(this, $__proto, "constructor", [identifierGenerator]);
        this.protoExpression = null;
        this.needsAtNameTransform = false;
        this.seenAccessors = null;
      },
      createProperty_: function(name, descr) {
        if (descr.get || descr.set) {
          var lookupName = getPropertyNameForToken(name);
          var oldAccessor = this.seenAccessors[lookupName];
          if (oldAccessor) {
            oldAccessor.get = descr.get || oldAccessor.get;
            oldAccessor.set = descr.set || oldAccessor.set;
            delete this.seenAccessors[lookupName];
            return null;
          } else {
            this.seenAccessors[lookupName] = descr;
          }
        }
        return [name, descr];
      },
      getPropertyName_: function(token) {
        switch (token.type) {
          case AT_NAME:
            return createIdentifierExpression(this.identifierGenerator.getUniqueIdentifier(token.value));
          case IDENTIFIER:
            return createStringLiteral(token.value);
          default:
            if (token.isKeyword()) return createStringLiteral(token.type);
            return new LiteralExpression(token.location, token);
        }
      },
      transformObjectLiteralExpression: function(tree) {
        var oldNeedsTransform = this.needsAtNameTransform;
        var oldSeenAccessors = this.seenAccessors;
        try {
          var finder = new AtNameFinder(tree);
          if (!finder.found) {
            this.needsAtNameTransform = false;
            return $__superCall(this, $__proto, "transformObjectLiteralExpression", [tree]);
          }
          this.needsAtNameTransform = true;
          this.seenAccessors = Object.create(null);
          var properties = this.transformList(tree.propertyNameAndValues);
          properties = properties.filter((function(tree) {
            return tree;
          }));
          var tempVar = this.addTempVar();
          var tempVarIdentifierExpression = createIdentifierExpression(tempVar);
          var expressions = properties.map((function(property) {
            var name = property[0];
            var descr = property[1];
            return createDefineProperty(tempVarIdentifierExpression, this.getPropertyName_(name), descr);
          }).bind(this));
          var protoExpression = this.transformAny(finder.protoExpression);
          var objectExpression;
          if (protoExpression) objectExpression = createObjectCreate(protoExpression); else objectExpression = createObjectLiteralExpression([]);
          expressions.unshift(createAssignmentExpression(tempVarIdentifierExpression, objectExpression));
          expressions.push(tempVarIdentifierExpression);
          return createParenExpression(createCommaExpression(expressions));
        } finally {
          this.needsAtNameTransform = oldNeedsTransform;
          this.seenAccessors = oldSeenAccessors;
        }
      },
      transformPropertyNameAssignment: function(tree) {
        if (!this.needsAtNameTransform) return $__superCall(this, $__proto, "transformPropertyNameAssignment", [tree]);
        if (getPropertyNameForToken(tree.name) === '__proto__') return null;
        return this.createProperty_(tree.name, {
          value: this.transformAny(tree.value),
          configurable: true,
          enumerable: true,
          writable: true
        });
      },
      transformGetAccessor: function(tree) {
        if (!this.needsAtNameTransform) return $__superCall(this, $__proto, "transformGetAccessor", [tree]);
        var body = this.transformAny(tree.body);
        var func = createFunctionExpression(createEmptyParameterList(), body);
        return this.createProperty_(tree.name, {
          get: func,
          configurable: true,
          enumerable: true
        });
      },
      transformSetAccessor: function(tree) {
        if (!this.needsAtNameTransform) return $__superCall(this, $__proto, "transformSetAccessor", [tree]);
        var body = this.transformAny(tree.body);
        var parameter = this.transformAny(tree.parameter);
        var parameterList = new FormalParameterList(parameter.location, [parameter]);
        var func = createFunctionExpression(parameterList, body);
        return this.createProperty_(tree.name, {
          set: func,
          configurable: true,
          enumerable: true
        });
      },
      transformPropertyMethodAssignment: function(tree) {
        var func = new FunctionExpression(tree.location, null, tree.isGenerator, this.transformAny(tree.formalParameterList), this.transformAny(tree.functionBody));
        if (!this.needsAtNameTransform) {
          return createPropertyNameAssignment(tree.name, func);
        }
        var body = this.transformAny(tree.functionBody);
        var parameters = this.transformAny(tree.formalParameterList);
        return this.createProperty_(tree.name, {
          value: func,
          configurable: true,
          enumerable: true,
          writable: true
        });
      },
      transformPropertyNameShorthand: function(tree) {
        if (!this.needsAtNameTransform) return $__superCall(this, $__proto, "transformPropertyNameShorthand", [tree]);
        return this.createProperty_(tree.name, {
          value: new IdentifierExpression(tree.location, tree.name),
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
    }, $__proto, $__super, true);
    return $ObjectLiteralTransformer;
  }(TempVarTransformer);
  ObjectLiteralTransformer.transformTree = function(identifierGenerator, tree) {
    return new ObjectLiteralTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {ObjectLiteralTransformer: {
      get: function() {
        return ObjectLiteralTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_ObjectMap_js = (function() {
  "use strict";
  var ObjectMap = function() {
    var $ObjectMap = ($__createClassNoExtends)({
      constructor: function() {
        this.keys_ = Object.create(null);
        this.values_ = Object.create(null);
      },
      set: function(key, value) {
        var uid = key.uid;
        this.keys_[uid] = key;
        this.values_[uid] = value;
      },
      get: function(key) {
        return this.values_[key.uid];
      },
      has: function(key) {
        return key.uid in this.keys_;
      },
      addAll: function(other) {
        for (var uid in other.keys_) {
          this.keys_[uid] = other.keys_[uid];
          this.values_[uid] = other.values_[uid];
        }
      },
      keys: function() {
        return Object.keys(this.keys_).map((function(uid) {
          return this.keys_[uid];
        }).bind(this));
      },
      values: function() {
        return Object.keys(this.values_).map((function(uid) {
          return this.values_[uid];
        }).bind(this));
      },
      remove: function(key) {
        var uid = key.uid;
        delete this.keys_[uid];
        delete this.values_[uid];
      }
    });
    return $ObjectMap;
  }();
  return Object.preventExtensions(Object.create(null, {ObjectMap: {
      get: function() {
        return ObjectMap;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_outputgeneration_ParseTreeWriter_js = (function() {
  "use strict";
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var $__9 = $__src_syntax_PredefinedName_js, FROM = $__9.FROM, GET = $__9.GET, OF = $__9.OF, MODULE = $__9.MODULE, REQUIRES = $__9.REQUIRES, SET = $__9.SET;
  var Token = $__src_syntax_Token_js.Token;
  var isKeyword = $__src_syntax_Keywords_js.isKeyword;
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND = $__9.AMPERSAND, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, AND = $__9.AND, ARROW = $__9.ARROW, AT_NAME = $__9.AT_NAME, AWAIT = $__9.AWAIT, BACK_QUOTE = $__9.BACK_QUOTE, BANG = $__9.BANG, BAR = $__9.BAR, BAR_EQUAL = $__9.BAR_EQUAL, BREAK = $__9.BREAK, CARET = $__9.CARET, CARET_EQUAL = $__9.CARET_EQUAL, CASE = $__9.CASE, CATCH = $__9.CATCH, CLASS = $__9.CLASS, CLOSE_ANGLE = $__9.CLOSE_ANGLE, CLOSE_CURLY = $__9.CLOSE_CURLY, CLOSE_PAREN = $__9.CLOSE_PAREN, CLOSE_SQUARE = $__9.CLOSE_SQUARE, COLON = $__9.COLON, COMMA = $__9.COMMA, CONST = $__9.CONST, CONTINUE = $__9.CONTINUE, DEBUGGER = $__9.DEBUGGER, DEFAULT = $__9.DEFAULT, DELETE = $__9.DELETE, DO = $__9.DO, DOLLAR = $__9.DOLLAR, DOT_DOT_DOT = $__9.DOT_DOT_DOT, ELSE = $__9.ELSE, END_OF_FILE = $__9.END_OF_FILE, ENUM = $__9.ENUM, EQUAL = $__9.EQUAL, EQUAL_EQUAL = $__9.EQUAL_EQUAL, EQUAL_EQUAL_EQUAL = $__9.EQUAL_EQUAL_EQUAL, ERROR = $__9.ERROR, EXPORT = $__9.EXPORT, EXTENDS = $__9.EXTENDS, FALSE = $__9.FALSE, FINALLY = $__9.FINALLY, FOR = $__9.FOR, FUNCTION = $__9.FUNCTION, GREATER_EQUAL = $__9.GREATER_EQUAL, IDENTIFIER = $__9.IDENTIFIER, IF = $__9.IF, IMPLEMENTS = $__9.IMPLEMENTS, IMPORT = $__9.IMPORT, IN = $__9.IN, INSTANCEOF = $__9.INSTANCEOF, INTERFACE = $__9.INTERFACE, LEFT_SHIFT = $__9.LEFT_SHIFT, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, LESS_EQUAL = $__9.LESS_EQUAL, LET = $__9.LET, MINUS = $__9.MINUS, MINUS_EQUAL = $__9.MINUS_EQUAL, MINUS_MINUS = $__9.MINUS_MINUS, NEW = $__9.NEW, NO_SUBSTITUTION_TEMPLATE = $__9.NO_SUBSTITUTION_TEMPLATE, NOT_EQUAL = $__9.NOT_EQUAL, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, NULL = $__9.NULL, NUMBER = $__9.NUMBER, OPEN_ANGLE = $__9.OPEN_ANGLE, OPEN_CURLY = $__9.OPEN_CURLY, OPEN_PAREN = $__9.OPEN_PAREN, OPEN_SQUARE = $__9.OPEN_SQUARE, OR = $__9.OR, PACKAGE = $__9.PACKAGE, PERCENT = $__9.PERCENT, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PERIOD = $__9.PERIOD, PERIOD_OPEN_CURLY = $__9.PERIOD_OPEN_CURLY, PLUS = $__9.PLUS, PLUS_EQUAL = $__9.PLUS_EQUAL, PLUS_PLUS = $__9.PLUS_PLUS, PRIVATE = $__9.PRIVATE, PROTECTED = $__9.PROTECTED, PUBLIC = $__9.PUBLIC, QUESTION = $__9.QUESTION, REGULAR_EXPRESSION = $__9.REGULAR_EXPRESSION, RETURN = $__9.RETURN, RIGHT_SHIFT = $__9.RIGHT_SHIFT, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SEMI_COLON = $__9.SEMI_COLON, SLASH = $__9.SLASH, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR = $__9.STAR, STAR_EQUAL = $__9.STAR_EQUAL, STATIC = $__9.STATIC, STRING = $__9.STRING, SUPER = $__9.SUPER, SWITCH = $__9.SWITCH, TEMPLATE_HEAD = $__9.TEMPLATE_HEAD, TEMPLATE_MIDDLE = $__9.TEMPLATE_MIDDLE, TEMPLATE_TAIL = $__9.TEMPLATE_TAIL, THIS = $__9.THIS, THROW = $__9.THROW, TILDE = $__9.TILDE, TRUE = $__9.TRUE, TRY = $__9.TRY, TYPEOF = $__9.TYPEOF, UNSIGNED_RIGHT_SHIFT = $__9.UNSIGNED_RIGHT_SHIFT, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL, VAR = $__9.VAR, VOID = $__9.VOID, WHILE = $__9.WHILE, WITH = $__9.WITH, YIELD = $__9.YIELD;
  var NEW_LINE = '\n';
  var PRETTY_PRINT = true;
  var ParseTreeWriter = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ParseTreeWriter = ($__createClass)({
      constructor: function(highlighted, showLineNumbers) {
        $__superCall(this, $__proto, "constructor", []);
        this.highlighted_ = highlighted;
        this.showLineNumbers_ = showLineNumbers;
        this.result_ = '';
        this.currentLine_ = '';
        this.currentLineComment_ = null;
        this.indentDepth_ = 0;
        this.lastToken_ = null;
      },
      visitAny: function(tree) {
        if (!tree) {
          return;
        }
        if (tree === this.highlighted_) {
          this.write_('\x1B[41m');
        }
        if (tree.location !== null && tree.location.start !== null && this.showLineNumbers_) {
          var line = tree.location.start.line + 1;
          var column = tree.location.start.column;
          this.currentLineComment_ = ("Line: " + line + "." + column);
        }
        this.currentLocation = tree.location;
        $__superCall(this, $__proto, "visitAny", [tree]);
        if (tree === this.highlighted_) {
          this.write_('\x1B[0m');
        }
      },
      visitArgumentList: function(tree) {
        this.write_(OPEN_PAREN);
        this.writeList_(tree.args, COMMA, false);
        this.write_(CLOSE_PAREN);
      },
      visitArrayComprehension: function(tree) {
        this.write_(OPEN_SQUARE);
        this.visitAny(tree.expression);
        this.visitList(tree.comprehensionForList);
        if (tree.ifExpression) {
          this.write_(IF);
          this.visitAny(tree.ifExpression);
        }
        this.write_(CLOSE_SQUARE);
      },
      visitArrayLiteralExpression: function(tree) {
        this.write_(OPEN_SQUARE);
        this.writeList_(tree.elements, COMMA, false);
        this.write_(CLOSE_SQUARE);
      },
      visitArrayPattern: function(tree) {
        this.write_(OPEN_SQUARE);
        this.writeList_(tree.elements, COMMA, false);
        this.write_(CLOSE_SQUARE);
      },
      visitArrowFunctionExpression: function(tree) {
        this.write_(OPEN_PAREN);
        this.visitAny(tree.formalParameters);
        this.write_(CLOSE_PAREN);
        this.write_(ARROW);
        this.visitAny(tree.functionBody);
      },
      visitAtNameExpression: function(tree) {
        this.write_(tree.atNameToken);
      },
      visitAtNameDeclaration: function(tree) {
        this.write_(tree.atNameToken);
        if (tree.initializer) {
          this.write_(EQUAL);
          this.visitAny(tree.initializer);
        }
      },
      visitAwaitStatement: function(tree) {
        this.write_(AWAIT);
        if (tree.identifier !== null) {
          this.write_(tree.identifier);
          this.write_(EQUAL);
        }
        this.visitAny(tree.expression);
        this.write_(SEMI_COLON);
      },
      visitBinaryOperator: function(tree) {
        this.visitAny(tree.left);
        this.write_(tree.operator);
        this.visitAny(tree.right);
      },
      visitBindingElement: function(tree) {
        this.visitAny(tree.binding);
        if (tree.initializer) {
          this.write_(EQUAL);
          this.visitAny(tree.initializer);
        }
      },
      visitBindingIdentifier: function(tree) {
        this.write_(tree.identifierToken);
      },
      visitBlock: function(tree) {
        this.write_(OPEN_CURLY);
        this.writelnList_(tree.statements);
        this.write_(CLOSE_CURLY);
      },
      visitBreakStatement: function(tree) {
        this.write_(BREAK);
        if (tree.name !== null) {
          this.write_(tree.name);
        }
        this.write_(SEMI_COLON);
      },
      visitCallExpression: function(tree) {
        this.visitAny(tree.operand);
        this.visitAny(tree.args);
      },
      visitCaseClause: function(tree) {
        this.write_(CASE);
        this.visitAny(tree.expression);
        this.write_(COLON);
        this.indentDepth_++;
        this.writelnList_(tree.statements);
        this.indentDepth_--;
      },
      visitCatch: function(tree) {
        this.write_(CATCH);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.binding);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.catchBody);
      },
      visitCascadeExpression: function(tree) {
        this.visitAny(tree.operand);
        this.write_(PERIOD_OPEN_CURLY);
        this.writelnList_(tree.expressions, SEMI_COLON, false);
        this.write_(CLOSE_CURLY);
      },
      visitClassShared_: function(tree) {
        this.write_(CLASS);
        this.visitAny(tree.name);
        if (tree.superClass !== null) {
          this.write_(EXTENDS);
          this.visitAny(tree.superClass);
        }
        this.write_(OPEN_CURLY);
        this.writelnList_(tree.elements);
        this.write_(CLOSE_CURLY);
      },
      visitClassDeclaration: function(tree) {
        this.visitClassShared_(tree);
      },
      visitClassExpression: function(tree) {
        this.visitClassShared_(tree);
      },
      visitCommaExpression: function(tree) {
        this.writeList_(tree.expressions, COMMA, false);
      },
      visitComprehensionFor: function(tree) {
        this.write_(FOR);
        this.visitAny(tree.left);
        this.write_(OF);
        this.visitAny(tree.iterator);
      },
      visitConditionalExpression: function(tree) {
        this.visitAny(tree.condition);
        this.write_(QUESTION);
        this.visitAny(tree.left);
        this.write_(COLON);
        this.visitAny(tree.right);
      },
      visitContinueStatement: function(tree) {
        this.write_(CONTINUE);
        if (tree.name !== null) {
          this.write_(tree.name);
        }
        this.write_(SEMI_COLON);
      },
      visitDebuggerStatement: function(tree) {
        this.write_(DEBUGGER);
        this.write_(SEMI_COLON);
      },
      visitDefaultClause: function(tree) {
        this.write_(DEFAULT);
        this.write_(COLON);
        this.indentDepth_++;
        this.writelnList_(tree.statements);
        this.indentDepth_--;
      },
      visitDoWhileStatement: function(tree) {
        this.write_(DO);
        this.visitAny(tree.body);
        this.write_(WHILE);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.condition);
        this.write_(CLOSE_PAREN);
        this.write_(SEMI_COLON);
      },
      visitEmptyStatement: function(tree) {
        this.write_(SEMI_COLON);
      },
      visitExportDeclaration: function(tree) {
        this.write_(EXPORT);
        this.visitAny(tree.declaration);
      },
      visitExportMappingList: function(tree) {
        this.writeList_(tree.paths, COMMA, false);
      },
      visitExportMapping: function(tree) {
        this.visitAny(tree.specifierSet);
        if (tree.moduleExpression) {
          this.write_(FROM);
          this.visitAny(tree.moduleExpression);
        }
      },
      visitExportSpecifier: function(tree) {
        this.write_(tree.lhs);
        if (tree.rhs) {
          this.write_(COLON);
          this.write_(tree.rhs);
        }
      },
      visitExportSpecifierSet: function(tree) {
        this.write_(OPEN_CURLY);
        this.writeList_(tree.specifiers, COMMA, false);
        this.write_(CLOSE_CURLY);
      },
      visitExportStar: function(tree) {
        this.write_(STAR);
      },
      visitExpressionStatement: function(tree) {
        this.visitAny(tree.expression);
        this.write_(SEMI_COLON);
      },
      visitFinally: function(tree) {
        this.write_(FINALLY);
        this.visitAny(tree.block);
      },
      visitForOfStatement: function(tree) {
        this.write_(FOR);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.initializer);
        this.write_(OF);
        this.visitAny(tree.collection);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitForInStatement: function(tree) {
        this.write_(FOR);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.initializer);
        this.write_(IN);
        this.visitAny(tree.collection);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitForStatement: function(tree) {
        this.write_(FOR);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.initializer);
        this.write_(SEMI_COLON);
        this.visitAny(tree.condition);
        this.write_(SEMI_COLON);
        this.visitAny(tree.increment);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitFormalParameterList: function(tree) {
        var first = true;
        for (var i = 0; i < tree.parameters.length; i++) {
          var parameter = tree.parameters[i];
          if (first) {
            first = false;
          } else {
            this.write_(COMMA);
          }
          this.visitAny(parameter);
        }
      },
      visitFunction: function(tree) {
        this.write_(FUNCTION);
        if (tree.isGenerator) {
          this.write_(STAR);
        }
        this.visitAny(tree.name);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.formalParameterList);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.functionBody);
      },
      visitGeneratorComprehension: function(tree) {
        this.write_(OPEN_PAREN);
        this.visitAny(tree.expression);
        this.visitList(tree.comprehensionForList);
        if (tree.ifExpression) {
          this.write_(IF);
          this.visitAny(tree.ifExpression);
        }
        this.write_(CLOSE_PAREN);
      },
      visitGetAccessor: function(tree) {
        this.write_(GET);
        this.write_(tree.name);
        this.write_(OPEN_PAREN);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitIdentifierExpression: function(tree) {
        this.write_(tree.identifierToken);
      },
      visitIfStatement: function(tree) {
        this.write_(IF);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.condition);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.ifClause);
        if (tree.elseClause) {
          this.write_(ELSE);
          this.visitAny(tree.elseClause);
        }
      },
      visitImportDeclaration: function(tree) {
        this.write_(IMPORT);
        this.writeList_(tree.importPathList, COMMA, false);
        this.write_(SEMI_COLON);
      },
      visitImportBinding: function(tree) {
        this.visitAny(tree.importSpecifierSet);
        if (tree.moduleExpression) {
          this.write_(FROM);
          this.visitAny(tree.moduleExpression);
        }
      },
      visitImportSpecifier: function(tree) {
        this.write_(tree.importedName);
        if (tree.destinationName !== null) {
          this.write_(COLON);
          this.write_(tree.destinationName);
        }
      },
      visitImportSpecifierSet: function(tree) {
        if (tree.specifiers.type == STAR) this.write_(STAR); else this.visitList(tree.specifiers);
      },
      visitLabelledStatement: function(tree) {
        this.write_(tree.name);
        this.write_(COLON);
        this.visitAny(tree.statement);
      },
      visitLiteralExpression: function(tree) {
        this.write_(tree.literalToken);
      },
      visitMemberExpression: function(tree) {
        this.visitAny(tree.operand);
        this.write_(PERIOD);
        this.write_(tree.memberName);
      },
      visitMemberLookupExpression: function(tree) {
        this.visitAny(tree.operand);
        this.write_(OPEN_SQUARE);
        this.visitAny(tree.memberExpression);
        this.write_(CLOSE_SQUARE);
      },
      visitMissingPrimaryExpression: function(tree) {
        this.write_('MissingPrimaryExpression');
      },
      visitModuleDeclaration: function(tree) {
        this.write_(MODULE);
        this.writeList_(tree.specifiers, COMMA, false);
        this.write_(SEMI_COLON);
      },
      visitModuleDefinition: function(tree) {
        this.write_(MODULE);
        this.write_(tree.name);
        this.write_(OPEN_CURLY);
        this.writeln_();
        this.writeList_(tree.elements, null, true);
        this.write_(CLOSE_CURLY);
        this.writeln_();
      },
      visitModuleExpression: function(tree) {
        this.visitAny(tree.reference);
        for (var i = 0; i < tree.identifiers.length; i++) {
          this.write_(PERIOD);
          this.write_(tree.identifiers[i]);
        }
      },
      visitModuleRequire: function(tree) {
        this.write_(tree.url);
      },
      visitModuleSpecifier: function(tree) {
        this.write_(tree.identifier);
        this.write_(FROM);
        this.visitAny(tree.expression);
      },
      visitNameStatement: function(tree) {
        this.write_(PRIVATE);
        this.writeList_(tree.declarations, COMMA, false);
        this.write_(SEMI_COLON);
      },
      visitNewExpression: function(tree) {
        this.write_(NEW);
        this.visitAny(tree.operand);
        this.visitAny(tree.args);
      },
      visitObjectLiteralExpression: function(tree) {
        this.write_(OPEN_CURLY);
        if (tree.propertyNameAndValues.length > 1) this.writeln_();
        this.writelnList_(tree.propertyNameAndValues, COMMA);
        if (tree.propertyNameAndValues.length > 1) this.writeln_();
        this.write_(CLOSE_CURLY);
      },
      visitObjectPattern: function(tree) {
        this.write_(OPEN_CURLY);
        this.writelnList_(tree.fields, COMMA);
        this.write_(CLOSE_CURLY);
      },
      visitObjectPatternField: function(tree) {
        this.write_(tree.identifier);
        if (tree.element !== null) {
          this.write_(COLON);
          this.visitAny(tree.element);
        }
      },
      visitParenExpression: function(tree) {
        this.write_(OPEN_PAREN);
        $__superCall(this, $__proto, "visitParenExpression", [tree]);
        this.write_(CLOSE_PAREN);
      },
      visitPostfixExpression: function(tree) {
        this.visitAny(tree.operand);
        this.write_(tree.operator);
      },
      visitPredefinedType: function(tree) {
        this.write_(tree.typeToken);
      },
      visitProgram: function(tree) {
        this.writelnList_(tree.programElements, null, true);
      },
      visitPropertyMethodAssignment: function(tree) {
        if (tree.isGenerator) this.write_(STAR);
        this.write_(tree.name);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.formalParameterList);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.functionBody);
      },
      visitPropertyNameAssignment: function(tree) {
        this.write_(tree.name);
        this.write_(COLON);
        this.visitAny(tree.value);
      },
      visitPropertyNameShorthand: function(tree) {
        this.write_(tree.name);
      },
      visitTemplateLiteralExpression: function(tree) {
        this.visitAny(tree.operand);
        this.writeRaw_(BACK_QUOTE);
        this.visitList(tree.elements);
        this.writeRaw_(BACK_QUOTE);
      },
      visitTemplateLiteralPortion: function(tree) {
        this.writeRaw_(tree.value);
      },
      visitTemplateSubstitution: function(tree) {
        this.writeRaw_(DOLLAR);
        this.writeRaw_(OPEN_CURLY);
        this.visitAny(tree.expression);
        this.writeRaw_(CLOSE_CURLY);
      },
      visitReturnStatement: function(tree) {
        this.write_(RETURN);
        this.visitAny(tree.expression);
        this.write_(SEMI_COLON);
      },
      visitRestParameter: function(tree) {
        this.write_(DOT_DOT_DOT);
        this.write_(tree.identifier.identifierToken);
      },
      visitSetAccessor: function(tree) {
        this.write_(SET);
        this.write_(tree.name);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.parameter);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitSpreadExpression: function(tree) {
        this.write_(DOT_DOT_DOT);
        this.visitAny(tree.expression);
      },
      visitSpreadPatternElement: function(tree) {
        this.write_(DOT_DOT_DOT);
        this.visitAny(tree.lvalue);
      },
      visitStateMachine: function(tree) {
        throw new Error('State machines cannot be converted to source');
      },
      visitSuperExpression: function(tree) {
        this.write_(SUPER);
      },
      visitSwitchStatement: function(tree) {
        this.write_(SWITCH);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.expression);
        this.write_(CLOSE_PAREN);
        this.write_(OPEN_CURLY);
        this.writelnList_(tree.caseClauses);
        this.write_(CLOSE_CURLY);
      },
      visitThisExpression: function(tree) {
        this.write_(THIS);
      },
      visitThrowStatement: function(tree) {
        this.write_(THROW);
        this.visitAny(tree.value);
        this.write_(SEMI_COLON);
      },
      visitTryStatement: function(tree) {
        this.write_(TRY);
        this.visitAny(tree.body);
        this.visitAny(tree.catchBlock);
        this.visitAny(tree.finallyBlock);
      },
      visitTypeName: function(tree) {
        if (tree.moduleName) {
          this.visitAny(tree.moduleName);
          this.write_(PERIOD);
        }
        this.write_(tree.name);
      },
      visitUnaryExpression: function(tree) {
        this.write_(tree.operator);
        this.visitAny(tree.operand);
      },
      visitVariableDeclarationList: function(tree) {
        this.write_(tree.declarationType);
        this.writeList_(tree.declarations, COMMA, false);
      },
      visitVariableDeclaration: function(tree) {
        this.visitAny(tree.lvalue);
        if (tree.typeAnnotation !== null) {
          this.write_(COLON);
          this.visitAny(tree.typeAnnotation);
        }
        if (tree.initializer !== null) {
          this.write_(EQUAL);
          this.visitAny(tree.initializer);
        }
      },
      visitVariableStatement: function(tree) {
        $__superCall(this, $__proto, "visitVariableStatement", [tree]);
        this.write_(SEMI_COLON);
      },
      visitWhileStatement: function(tree) {
        this.write_(WHILE);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.condition);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitWithStatement: function(tree) {
        this.write_(WITH);
        this.write_(OPEN_PAREN);
        this.visitAny(tree.expression);
        this.write_(CLOSE_PAREN);
        this.visitAny(tree.body);
      },
      visitYieldExpression: function(tree) {
        this.write_(YIELD);
        if (tree.isYieldFor) {
          this.write_(STAR);
        }
        this.visitAny(tree.expression);
      },
      writeCurrentln_: function() {
        this.result_ += this.currentLine_ + NEW_LINE;
      },
      writeln_: function() {
        if (this.currentLineComment_) {
          while (this.currentLine_.length < 80) {
            this.currentLine_ += ' ';
          }
          this.currentLine_ += ' // ' + this.currentLineComment_;
          this.currentLineComment_ = null;
        }
        if (this.currentLine_) this.writeCurrentln_();
        this.currentLine_ = '';
      },
      writelnList_: function(list, delimiter) {
        if (delimiter) {
          this.writeList_(list, delimiter, true);
        } else {
          if (list.length > 0) this.writeln_();
          this.writeList_(list, null, true);
          if (list.length > 0) this.writeln_();
        }
      },
      writeList_: function(list, delimiter, writeNewLine) {
        var first = true;
        for (var i = 0; i < list.length; i++) {
          var element = list[i];
          if (first) {
            first = false;
          } else {
            if (delimiter !== null) {
              this.write_(delimiter);
            }
            if (writeNewLine) {
              this.writeln_();
            }
          }
          this.visitAny(element);
        }
      },
      writeRaw_: function(value) {
        if (value !== null) this.currentLine_ += value;
      },
      write_: function(value) {
        if (value === CLOSE_CURLY) {
          this.indentDepth_--;
        }
        if (value !== null) {
          if (PRETTY_PRINT) {
            if (!this.currentLine_) {
              this.lastToken_ = '';
              for (var i = 0, indent = this.indentDepth_; i < indent; i++) {
                this.currentLine_ += '  ';
              }
            }
          }
          if (this.needsSpace_(value)) this.currentLine_ += ' ';
          this.lastToken_ = value;
          this.currentLine_ += value;
        }
        if (value === OPEN_CURLY) {
          this.indentDepth_++;
        }
      },
      isIdentifierNameOrNumber_: function(token) {
        if (token instanceof Token) {
          if (token.isKeyword()) return true;
          switch (token.type) {
            case IDENTIFIER:
            case NUMBER:
              return true;
          }
        }
        var value = token.toString();
        switch (value) {
          case FROM:
          case GET:
          case OF:
          case MODULE:
          case REQUIRES:
          case SET:
            return true;
        }
        return isKeyword(value);
      },
      needsSpace_: function(token) {
        if (!this.lastToken_) return false;
        var value = token.toString();
        var lastValue = this.lastToken_.toString();
        switch (value) {
          case CLOSE_CURLY:
          case CLOSE_PAREN:
          case CLOSE_SQUARE:
          case COLON:
          case COMMA:
          case PERIOD:
          case PERIOD_OPEN_CURLY:
          case SEMI_COLON:
            return false;
          case CATCH:
          case ELSE:
          case FINALLY:
          case WHILE:
            return PRETTY_PRINT;
          case OPEN_CURLY:
            switch (lastValue) {
              case OPEN_CURLY:
              case OPEN_PAREN:
              case OPEN_SQUARE:
                return false;
            }
            return PRETTY_PRINT;
        }
        switch (lastValue) {
          case OPEN_CURLY:
          case OPEN_PAREN:
          case OPEN_SQUARE:
            return false;
          case CATCH:
          case COLON:
          case COMMA:
          case DO:
          case FINALLY:
          case FOR:
          case IF:
          case SEMI_COLON:
          case SWITCH:
          case TRY:
          case WHILE:
          case WITH:
            return PRETTY_PRINT;
          case CASE:
          case CLASS:
          case CONST:
          case DELETE:
          case ELSE:
          case ENUM:
          case EXPORT:
          case EXTENDS:
          case IMPLEMENTS:
          case IMPORT:
          case IN:
          case INSTANCEOF:
          case INTERFACE:
          case LET:
          case NEW:
          case PACKAGE:
          case PRIVATE:
          case PROTECTED:
          case PUBLIC:
          case RETURN:
          case STATIC:
          case THROW:
          case TYPEOF:
          case VAR:
          case VOID:
          case YIELD:
          case FROM:
          case OF:
          case MODULE:
          case REQUIRES:
            return PRETTY_PRINT || this.isIdentifierNameOrNumber_(token);
        }
        if ((lastValue == PLUS || lastValue == PLUS_PLUS) && (value == PLUS || value == PLUS_PLUS) || (lastValue == MINUS || lastValue == MINUS_MINUS) && (value == MINUS || value == MINUS_MINUS)) {
          return true;
        }
        if (this.spaceArround_(lastValue) || this.spaceArround_(value)) return true;
        if (this.isIdentifierNameOrNumber_(token)) {
          if (lastValue === CLOSE_PAREN) return PRETTY_PRINT;
          return this.isIdentifierNameOrNumber_(this.lastToken_);
        }
        return false;
      },
      spaceArround_: function(value) {
        switch (value) {
          case AMPERSAND:
          case AMPERSAND_EQUAL:
          case AND:
          case ARROW:
          case AWAIT:
          case BAR:
          case BAR_EQUAL:
          case CARET_EQUAL:
          case CLOSE_ANGLE:
          case EQUAL:
          case EQUAL_EQUAL:
          case EQUAL_EQUAL_EQUAL:
          case GREATER_EQUAL:
          case LEFT_SHIFT:
          case LEFT_SHIFT_EQUAL:
          case LESS_EQUAL:
          case MINUS:
          case MINUS_EQUAL:
          case NOT_EQUAL:
          case NOT_EQUAL_EQUAL:
          case OPEN_ANGLE:
          case OR:
          case PERCENT:
          case PERCENT_EQUAL:
          case PLUS:
          case PLUS_EQUAL:
          case QUESTION:
          case RIGHT_SHIFT:
          case RIGHT_SHIFT_EQUAL:
          case SLASH:
          case SLASH_EQUAL:
          case STAR:
          case STAR_EQUAL:
          case UNSIGNED_RIGHT_SHIFT:
          case UNSIGNED_RIGHT_SHIFT_EQUAL:
            return PRETTY_PRINT;
        }
        return false;
      }
    }, $__proto, $__super, true);
    return $ParseTreeWriter;
  }(ParseTreeVisitor);
  return Object.preventExtensions(Object.create(null, {ParseTreeWriter: {
      get: function() {
        return ParseTreeWriter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_outputgeneration_ParseTreeMapWriter_js = (function() {
  "use strict";
  var ParseTreeWriter = $__src_outputgeneration_ParseTreeWriter_js.ParseTreeWriter;
  var ParseTreeMapWriter = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ParseTreeMapWriter = ($__createClass)({
      constructor: function(highlighted, showLineNumbers, sourceMapGenerator) {
        $__superCall(this, $__proto, "constructor", [highlighted, showLineNumbers]);
        this.sourceMapGenerator_ = sourceMapGenerator;
        this.outputLineCount_ = 1;
      },
      write_: function(value) {
        if (this.currentLocation) {
          this.addMapping();
        }
        $__superCall(this, $__proto, "write_", [value]);
      },
      writeCurrentln_: function() {
        $__superCall(this, $__proto, "writeCurrentln_", []);
        this.outputLineCount_++;
      },
      addMapping: function() {
        var mapping = {
          generated: {
            line: this.outputLineCount_,
            column: this.currentLine_.length
          },
          original: {
            line: this.currentLocation.start.line + 1,
            column: this.currentLocation.start.column
          },
          source: this.currentLocation.start.source.name
        };
        this.sourceMapGenerator_.addMapping(mapping);
      }
    }, $__proto, $__super, true);
    return $ParseTreeMapWriter;
  }(ParseTreeWriter);
  return Object.preventExtensions(Object.create(null, {ParseTreeMapWriter: {
      get: function() {
        return ParseTreeMapWriter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_outputgeneration_TreeWriter_js = (function() {
  "use strict";
  var ParseTreeMapWriter = $__src_outputgeneration_ParseTreeMapWriter_js.ParseTreeMapWriter;
  var ParseTreeWriter = $__src_outputgeneration_ParseTreeWriter_js.ParseTreeWriter;
  var TreeWriter = function() {
    var $TreeWriter = ($__createClassNoExtends)({constructor: function() {}});
    return $TreeWriter;
  }();
  TreeWriter.write = function(tree, opt_options) {
    var showLineNumbers;
    var highlighted = null;
    var sourceMapGenerator;
    if (opt_options) {
      showLineNumbers = opt_options.showLineNumbers;
      highlighted = opt_options.highlighted || null;
      sourceMapGenerator = opt_options.sourceMapGenerator;
    }
    var writer;
    if (sourceMapGenerator) {
      writer = new ParseTreeMapWriter(highlighted, showLineNumbers, sourceMapGenerator);
    } else {
      writer = new ParseTreeWriter(highlighted, showLineNumbers);
    }
    writer.visitAny(tree);
    if (writer.currentLine_.length > 0) {
      writer.writeln_();
    }
    if (sourceMapGenerator) {
      opt_options.sourceMap = sourceMapGenerator.toString();
    }
    return writer.result_.toString();
  };
  return Object.preventExtensions(Object.create(null, {TreeWriter: {
      get: function() {
        return TreeWriter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_syntax_ParseTreeValidator_js = (function() {
  "use strict";
  var NewExpression = $__src_syntax_trees_ParseTrees_js.NewExpression;
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var $__9 = $__src_syntax_PredefinedName_js, IS = $__9.IS, ISNT = $__9.ISNT;
  var TreeWriter = $__src_outputgeneration_TreeWriter_js.TreeWriter;
  var $__9 = $__src_syntax_TokenType_js, AMPERSAND = $__9.AMPERSAND, AMPERSAND_EQUAL = $__9.AMPERSAND_EQUAL, AND = $__9.AND, ARROW = $__9.ARROW, AT_NAME = $__9.AT_NAME, AWAIT = $__9.AWAIT, BACK_QUOTE = $__9.BACK_QUOTE, BANG = $__9.BANG, BAR = $__9.BAR, BAR_EQUAL = $__9.BAR_EQUAL, BREAK = $__9.BREAK, CARET = $__9.CARET, CARET_EQUAL = $__9.CARET_EQUAL, CASE = $__9.CASE, CATCH = $__9.CATCH, CLASS = $__9.CLASS, CLOSE_ANGLE = $__9.CLOSE_ANGLE, CLOSE_CURLY = $__9.CLOSE_CURLY, CLOSE_PAREN = $__9.CLOSE_PAREN, CLOSE_SQUARE = $__9.CLOSE_SQUARE, COLON = $__9.COLON, COMMA = $__9.COMMA, CONST = $__9.CONST, CONTINUE = $__9.CONTINUE, DEBUGGER = $__9.DEBUGGER, DEFAULT = $__9.DEFAULT, DELETE = $__9.DELETE, DO = $__9.DO, DOLLAR = $__9.DOLLAR, DOT_DOT_DOT = $__9.DOT_DOT_DOT, ELSE = $__9.ELSE, END_OF_FILE = $__9.END_OF_FILE, ENUM = $__9.ENUM, EQUAL = $__9.EQUAL, EQUAL_EQUAL = $__9.EQUAL_EQUAL, EQUAL_EQUAL_EQUAL = $__9.EQUAL_EQUAL_EQUAL, ERROR = $__9.ERROR, EXPORT = $__9.EXPORT, EXTENDS = $__9.EXTENDS, FALSE = $__9.FALSE, FINALLY = $__9.FINALLY, FOR = $__9.FOR, FUNCTION = $__9.FUNCTION, GREATER_EQUAL = $__9.GREATER_EQUAL, IDENTIFIER = $__9.IDENTIFIER, IF = $__9.IF, IMPLEMENTS = $__9.IMPLEMENTS, IMPORT = $__9.IMPORT, IN = $__9.IN, INSTANCEOF = $__9.INSTANCEOF, INTERFACE = $__9.INTERFACE, LEFT_SHIFT = $__9.LEFT_SHIFT, LEFT_SHIFT_EQUAL = $__9.LEFT_SHIFT_EQUAL, LESS_EQUAL = $__9.LESS_EQUAL, LET = $__9.LET, MINUS = $__9.MINUS, MINUS_EQUAL = $__9.MINUS_EQUAL, MINUS_MINUS = $__9.MINUS_MINUS, NEW = $__9.NEW, NO_SUBSTITUTION_TEMPLATE = $__9.NO_SUBSTITUTION_TEMPLATE, NOT_EQUAL = $__9.NOT_EQUAL, NOT_EQUAL_EQUAL = $__9.NOT_EQUAL_EQUAL, NULL = $__9.NULL, NUMBER = $__9.NUMBER, OPEN_ANGLE = $__9.OPEN_ANGLE, OPEN_CURLY = $__9.OPEN_CURLY, OPEN_PAREN = $__9.OPEN_PAREN, OPEN_SQUARE = $__9.OPEN_SQUARE, OR = $__9.OR, PACKAGE = $__9.PACKAGE, PERCENT = $__9.PERCENT, PERCENT_EQUAL = $__9.PERCENT_EQUAL, PERIOD = $__9.PERIOD, PERIOD_OPEN_CURLY = $__9.PERIOD_OPEN_CURLY, PLUS = $__9.PLUS, PLUS_EQUAL = $__9.PLUS_EQUAL, PLUS_PLUS = $__9.PLUS_PLUS, PRIVATE = $__9.PRIVATE, PROTECTED = $__9.PROTECTED, PUBLIC = $__9.PUBLIC, QUESTION = $__9.QUESTION, REGULAR_EXPRESSION = $__9.REGULAR_EXPRESSION, RETURN = $__9.RETURN, RIGHT_SHIFT = $__9.RIGHT_SHIFT, RIGHT_SHIFT_EQUAL = $__9.RIGHT_SHIFT_EQUAL, SEMI_COLON = $__9.SEMI_COLON, SLASH = $__9.SLASH, SLASH_EQUAL = $__9.SLASH_EQUAL, STAR = $__9.STAR, STAR_EQUAL = $__9.STAR_EQUAL, STATIC = $__9.STATIC, STRING = $__9.STRING, SUPER = $__9.SUPER, SWITCH = $__9.SWITCH, TEMPLATE_HEAD = $__9.TEMPLATE_HEAD, TEMPLATE_MIDDLE = $__9.TEMPLATE_MIDDLE, TEMPLATE_TAIL = $__9.TEMPLATE_TAIL, THIS = $__9.THIS, THROW = $__9.THROW, TILDE = $__9.TILDE, TRUE = $__9.TRUE, TRY = $__9.TRY, TYPEOF = $__9.TYPEOF, UNSIGNED_RIGHT_SHIFT = $__9.UNSIGNED_RIGHT_SHIFT, UNSIGNED_RIGHT_SHIFT_EQUAL = $__9.UNSIGNED_RIGHT_SHIFT_EQUAL, VAR = $__9.VAR, VOID = $__9.VOID, WHILE = $__9.WHILE, WITH = $__9.WITH, YIELD = $__9.YIELD;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, ARGUMENT_LIST = $__9.ARGUMENT_LIST, ARRAY_COMPREHENSION = $__9.ARRAY_COMPREHENSION, ARRAY_LITERAL_EXPRESSION = $__9.ARRAY_LITERAL_EXPRESSION, ARRAY_PATTERN = $__9.ARRAY_PATTERN, ARROW_FUNCTION_EXPRESSION = $__9.ARROW_FUNCTION_EXPRESSION, AT_NAME_DECLARATION = $__9.AT_NAME_DECLARATION, AT_NAME_EXPRESSION = $__9.AT_NAME_EXPRESSION, AWAIT_STATEMENT = $__9.AWAIT_STATEMENT, BINARY_OPERATOR = $__9.BINARY_OPERATOR, BINDING_ELEMENT = $__9.BINDING_ELEMENT, BINDING_IDENTIFIER = $__9.BINDING_IDENTIFIER, BLOCK = $__9.BLOCK, BREAK_STATEMENT = $__9.BREAK_STATEMENT, CALL_EXPRESSION = $__9.CALL_EXPRESSION, CASCADE_EXPRESSION = $__9.CASCADE_EXPRESSION, CASE_CLAUSE = $__9.CASE_CLAUSE, CATCH = $__9.CATCH, CLASS_DECLARATION = $__9.CLASS_DECLARATION, CLASS_EXPRESSION = $__9.CLASS_EXPRESSION, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, COMPREHENSION_FOR = $__9.COMPREHENSION_FOR, CONDITIONAL_EXPRESSION = $__9.CONDITIONAL_EXPRESSION, CONTINUE_STATEMENT = $__9.CONTINUE_STATEMENT, COVER_FORMALS = $__9.COVER_FORMALS, DEBUGGER_STATEMENT = $__9.DEBUGGER_STATEMENT, DEFAULT_CLAUSE = $__9.DEFAULT_CLAUSE, DO_WHILE_STATEMENT = $__9.DO_WHILE_STATEMENT, EMPTY_STATEMENT = $__9.EMPTY_STATEMENT, EXPORT_DECLARATION = $__9.EXPORT_DECLARATION, EXPORT_MAPPING = $__9.EXPORT_MAPPING, EXPORT_MAPPING_LIST = $__9.EXPORT_MAPPING_LIST, EXPORT_SPECIFIER = $__9.EXPORT_SPECIFIER, EXPORT_SPECIFIER_SET = $__9.EXPORT_SPECIFIER_SET, EXPORT_STAR = $__9.EXPORT_STAR, EXPRESSION_STATEMENT = $__9.EXPRESSION_STATEMENT, FINALLY = $__9.FINALLY, FOR_IN_STATEMENT = $__9.FOR_IN_STATEMENT, FOR_OF_STATEMENT = $__9.FOR_OF_STATEMENT, FOR_STATEMENT = $__9.FOR_STATEMENT, FORMAL_PARAMETER_LIST = $__9.FORMAL_PARAMETER_LIST, FUNCTION_DECLARATION = $__9.FUNCTION_DECLARATION, FUNCTION_EXPRESSION = $__9.FUNCTION_EXPRESSION, GENERATOR_COMPREHENSION = $__9.GENERATOR_COMPREHENSION, GET_ACCESSOR = $__9.GET_ACCESSOR, IDENTIFIER_EXPRESSION = $__9.IDENTIFIER_EXPRESSION, IF_STATEMENT = $__9.IF_STATEMENT, IMPORT_BINDING = $__9.IMPORT_BINDING, IMPORT_DECLARATION = $__9.IMPORT_DECLARATION, IMPORT_SPECIFIER = $__9.IMPORT_SPECIFIER, IMPORT_SPECIFIER_SET = $__9.IMPORT_SPECIFIER_SET, LABELLED_STATEMENT = $__9.LABELLED_STATEMENT, LITERAL_EXPRESSION = $__9.LITERAL_EXPRESSION, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, MISSING_PRIMARY_EXPRESSION = $__9.MISSING_PRIMARY_EXPRESSION, MODULE_DECLARATION = $__9.MODULE_DECLARATION, MODULE_DEFINITION = $__9.MODULE_DEFINITION, MODULE_EXPRESSION = $__9.MODULE_EXPRESSION, MODULE_REQUIRE = $__9.MODULE_REQUIRE, MODULE_SPECIFIER = $__9.MODULE_SPECIFIER, NAME_STATEMENT = $__9.NAME_STATEMENT, NEW_EXPRESSION = $__9.NEW_EXPRESSION, OBJECT_LITERAL_EXPRESSION = $__9.OBJECT_LITERAL_EXPRESSION, OBJECT_PATTERN = $__9.OBJECT_PATTERN, OBJECT_PATTERN_FIELD = $__9.OBJECT_PATTERN_FIELD, PAREN_EXPRESSION = $__9.PAREN_EXPRESSION, POSTFIX_EXPRESSION = $__9.POSTFIX_EXPRESSION, PREDEFINED_TYPE = $__9.PREDEFINED_TYPE, PROGRAM = $__9.PROGRAM, PROPERTY_METHOD_ASSIGNMENT = $__9.PROPERTY_METHOD_ASSIGNMENT, PROPERTY_NAME_ASSIGNMENT = $__9.PROPERTY_NAME_ASSIGNMENT, PROPERTY_NAME_SHORTHAND = $__9.PROPERTY_NAME_SHORTHAND, REST_PARAMETER = $__9.REST_PARAMETER, RETURN_STATEMENT = $__9.RETURN_STATEMENT, SET_ACCESSOR = $__9.SET_ACCESSOR, SPREAD_EXPRESSION = $__9.SPREAD_EXPRESSION, SPREAD_PATTERN_ELEMENT = $__9.SPREAD_PATTERN_ELEMENT, STATE_MACHINE = $__9.STATE_MACHINE, SUPER_EXPRESSION = $__9.SUPER_EXPRESSION, SWITCH_STATEMENT = $__9.SWITCH_STATEMENT, TEMPLATE_LITERAL_EXPRESSION = $__9.TEMPLATE_LITERAL_EXPRESSION, TEMPLATE_LITERAL_PORTION = $__9.TEMPLATE_LITERAL_PORTION, TEMPLATE_SUBSTITUTION = $__9.TEMPLATE_SUBSTITUTION, THIS_EXPRESSION = $__9.THIS_EXPRESSION, THROW_STATEMENT = $__9.THROW_STATEMENT, TRY_STATEMENT = $__9.TRY_STATEMENT, TYPE_NAME = $__9.TYPE_NAME, UNARY_EXPRESSION = $__9.UNARY_EXPRESSION, VARIABLE_DECLARATION = $__9.VARIABLE_DECLARATION, VARIABLE_DECLARATION_LIST = $__9.VARIABLE_DECLARATION_LIST, VARIABLE_STATEMENT = $__9.VARIABLE_STATEMENT, WHILE_STATEMENT = $__9.WHILE_STATEMENT, WITH_STATEMENT = $__9.WITH_STATEMENT, YIELD_EXPRESSION = $__9.YIELD_EXPRESSION;
  var ValidationError = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ValidationError = ($__createClass)({constructor: function(tree, message) {
        this.tree = tree;
        this.message = message;
      }}, $__proto, $__super, true);
    return $ValidationError;
  }(Error);
  var ParseTreeValidator = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ParseTreeValidator = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      fail_: function(tree, message) {
        throw new ValidationError(tree, message);
      },
      check_: function(condition, tree, message) {
        if (!condition) {
          this.fail_(tree, message);
        }
      },
      checkVisit_: function(condition, tree, message) {
        this.check_(condition, tree, message);
        this.visitAny(tree);
      },
      checkType_: function(type, tree, message) {
        this.checkVisit_(tree.type === type, tree, message);
      },
      visitArgumentList: function(tree) {
        for (var i = 0; i < tree.args.length; i++) {
          var argument = tree.args[i];
          this.checkVisit_(argument.isAssignmentOrSpread(), argument, 'assignment or spread expected');
        }
      },
      visitArrayLiteralExpression: function(tree) {
        for (var i = 0; i < tree.elements.length; i++) {
          var element = tree.elements[i];
          this.checkVisit_(element === null || element.isAssignmentOrSpread(), element, 'assignment or spread expected');
        }
      },
      visitArrayPattern: function(tree) {
        for (var i = 0; i < tree.elements.length; i++) {
          var element = tree.elements[i];
          this.checkVisit_(element === null || element.type === BINDING_ELEMENT || element.type == IDENTIFIER_EXPRESSION || element.isLeftHandSideExpression() || element.isPattern() || element.isSpreadPatternElement(), element, 'null, sub pattern, left hand side expression or spread expected');
          if (element && element.isSpreadPatternElement()) {
            this.check_(i === (tree.elements.length - 1), element, 'spread in array patterns must be the last element');
          }
        }
      },
      visitAwaitStatement: function(tree) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'await must be expression');
      },
      visitBinaryOperator: function(tree) {
        switch (tree.operator.type) {
          case EQUAL:
          case STAR_EQUAL:
          case SLASH_EQUAL:
          case PERCENT_EQUAL:
          case PLUS_EQUAL:
          case MINUS_EQUAL:
          case LEFT_SHIFT_EQUAL:
          case RIGHT_SHIFT_EQUAL:
          case UNSIGNED_RIGHT_SHIFT_EQUAL:
          case AMPERSAND_EQUAL:
          case CARET_EQUAL:
          case BAR_EQUAL:
            this.check_(tree.left.isLeftHandSideExpression() || tree.left.isPattern(), tree.left, 'left hand side expression or pattern expected');
            this.check_(tree.right.isArrowFunctionExpression(), tree.right, 'assignment expression expected');
            break;
          case AND:
          case OR:
          case BAR:
          case CARET:
          case AMPERSAND:
          case EQUAL_EQUAL:
          case NOT_EQUAL:
          case EQUAL_EQUAL_EQUAL:
          case NOT_EQUAL_EQUAL:
          case OPEN_ANGLE:
          case CLOSE_ANGLE:
          case GREATER_EQUAL:
          case LESS_EQUAL:
          case INSTANCEOF:
          case IN:
          case LEFT_SHIFT:
          case RIGHT_SHIFT:
          case UNSIGNED_RIGHT_SHIFT:
          case PLUS:
          case MINUS:
          case STAR:
          case SLASH:
          case PERCENT:
            this.check_(tree.left.isArrowFunctionExpression(), tree.left, 'assignment expression expected');
            this.check_(tree.right.isArrowFunctionExpression(), tree.right, 'assignment expression expected');
            break;
          case IDENTIFIER:
            var foundIsIdentifier = false;
            switch (tree.operator.value) {
              case IS:
              case ISNT:
                foundIsIdentifier = true;
            }
            if (foundIsIdentifier) break;
          default:
            this.fail_(tree, 'unexpected binary operator');
        }
        this.visitAny(tree.left);
        this.visitAny(tree.right);
      },
      visitBindingElement: function(tree) {
        var binding = tree.binding;
        this.checkVisit_(binding.type == BINDING_IDENTIFIER || binding.type == OBJECT_PATTERN || binding.type == ARRAY_PATTERN, binding, 'expected valid binding element');
        this.visitAny(tree.initializer);
      },
      visitBlock: function(tree) {
        for (var i = 0; i < tree.statements.length; i++) {
          var statement = tree.statements[i];
          this.checkVisit_(statement.isSourceElement(), statement, 'statement or function declaration expected');
        }
      },
      visitCallExpression: function(tree) {
        this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
        if (tree.operand instanceof NewExpression) {
          this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
        }
        this.visitAny(tree.operand);
        this.visitAny(tree.args);
      },
      visitCaseClause: function(tree) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        for (var i = 0; i < tree.statements.length; i++) {
          var statement = tree.statements[i];
          this.checkVisit_(statement.isStatement(), statement, 'statement expected');
        }
      },
      visitCatch: function(tree) {
        this.checkVisit_(tree.binding.isPattern() || tree.binding.type == BINDING_IDENTIFIER, tree.binding, 'binding identifier expected');
        this.checkVisit_(tree.catchBody.type === BLOCK, tree.catchBody, 'block expected');
      },
      visitClassDeclaration: function(tree) {
        for (var i = 0; i < tree.elements.length; i++) {
          var element = tree.elements[i];
          switch (element.type) {
            case GET_ACCESSOR:
            case SET_ACCESSOR:
            case PROPERTY_METHOD_ASSIGNMENT:
              break;
            default:
              this.fail_(element, 'class element expected');
          }
          this.visitAny(element);
        }
      },
      visitCommaExpression: function(tree) {
        for (var i = 0; i < tree.expressions.length; i++) {
          var expression = tree.expressions[i];
          this.checkVisit_(expression.isArrowFunctionExpression(), expression, 'expression expected');
        }
      },
      visitConditionalExpression: function(tree) {
        this.checkVisit_(tree.condition.isArrowFunctionExpression(), tree.condition, 'expression expected');
        this.checkVisit_(tree.left.isArrowFunctionExpression(), tree.left, 'expression expected');
        this.checkVisit_(tree.right.isArrowFunctionExpression(), tree.right, 'expression expected');
      },
      visitDefaultClause: function(tree) {
        for (var i = 0; i < tree.statements.length; i++) {
          var statement = tree.statements[i];
          this.checkVisit_(statement.isStatement(), statement, 'statement expected');
        }
      },
      visitDoWhileStatement: function(tree) {
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
        this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
      },
      visitExportDeclaration: function(tree) {
        var declType = tree.declaration.type;
        this.checkVisit_(declType == VARIABLE_STATEMENT || declType == FUNCTION_DECLARATION || declType == MODULE_DEFINITION || declType == MODULE_DECLARATION || declType == CLASS_DECLARATION || declType == EXPORT_MAPPING_LIST, tree.declaration, 'expected valid export tree');
      },
      visitExportMapping: function(tree) {
        if (tree.moduleExpression) {
          this.checkVisit_(tree.moduleExpression.type == MODULE_EXPRESSION, tree.moduleExpression, 'module expression expected');
        }
        var specifierType = tree.specifierSet.type;
        this.checkVisit_(specifierType == EXPORT_SPECIFIER_SET || specifierType == EXPORT_STAR || specifierType == IDENTIFIER_EXPRESSION, tree.specifierSet, 'specifier set or identifier expected');
      },
      visitExportMappingList: function(tree) {
        this.check_(tree.paths.length > 0, tree, 'expected at least one path');
        for (var i = 0; i < tree.paths.length; i++) {
          var path = tree.paths[i];
          var type = path.type;
          this.checkVisit_(type == EXPORT_MAPPING, path, 'expected export mapping');
        }
      },
      visitExportSpecifierSet: function(tree) {
        this.check_(tree.specifiers.length > 0, tree, 'expected at least one identifier');
        for (var i = 0; i < tree.specifiers.length; i++) {
          var specifier = tree.specifiers[i];
          this.checkVisit_(specifier.type == EXPORT_SPECIFIER || specifier.type == IDENTIFIER_EXPRESSION, specifier, 'expected valid export specifier');
        }
      },
      visitExpressionStatement: function(tree) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
      },
      visitFinally: function(tree) {
        this.checkVisit_(tree.block.type === BLOCK, tree.block, 'block expected');
      },
      visitForOfStatement: function(tree) {
        this.checkVisit_(tree.initializer.isPattern() || tree.initializer.type === IDENTIFIER_EXPRESSION || tree.initializer.type === VARIABLE_DECLARATION_LIST && tree.initializer.declarations.length === 1, tree.initializer, 'for-each statement may not have more than one variable declaration');
        this.checkVisit_(tree.collection.isExpression(), tree.collection, 'expression expected');
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      },
      visitForInStatement: function(tree) {
        if (tree.initializer.type === VARIABLE_DECLARATION_LIST) {
          this.checkVisit_(tree.initializer.declarations.length <= 1, tree.initializer, 'for-in statement may not have more than one variable declaration');
        } else {
          this.checkVisit_(tree.initializer.isPattern() || tree.initializer.isExpression(), tree.initializer, 'variable declaration, expression or ' + 'pattern expected');
        }
        this.checkVisit_(tree.collection.isExpression(), tree.collection, 'expression expected');
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      },
      visitFormalParameterList: function(tree) {
        for (var i = 0; i < tree.parameters.length; i++) {
          var parameter = tree.parameters[i];
          switch (parameter.type) {
            case BINDING_ELEMENT:
              break;
            case REST_PARAMETER:
              this.checkVisit_(i === tree.parameters.length - 1, parameter, 'rest parameters must be the last parameter in a parameter list');
              this.checkType_(BINDING_IDENTIFIER, parameter.identifier, 'binding identifier expected');
              break;
            default:
              this.fail_(parameter, 'parameters must be identifiers or rest' + (" parameters. Found: " + parameter.type));
              break;
          }
          this.visitAny(parameter);
        }
      },
      visitForStatement: function(tree) {
        if (tree.initializer !== null) {
          this.checkVisit_(tree.initializer.isExpression() || tree.initializer.type === VARIABLE_DECLARATION_LIST, tree.initializer, 'variable declaration list or expression expected');
        }
        if (tree.condition !== null) {
          this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
        }
        if (tree.increment !== null) {
          this.checkVisit_(tree.condition.isExpression(), tree.increment, 'expression expected');
        }
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      },
      visitFunction: function(tree) {
        this.checkType_(FORMAL_PARAMETER_LIST, tree.formalParameterList, 'formal parameters expected');
        this.checkType_(BLOCK, tree.functionBody, 'block expected');
      },
      visitFunctionDeclaration: function(tree) {
        this.checkType_(BINDING_IDENTIFIER, tree.name, 'binding identifier expected');
        this.visitFunction(tree);
      },
      visitFunctionExpression: function(tree) {
        if (tree.name !== null) {
          this.checkType_(BINDING_IDENTIFIER, tree.name, 'binding identifier expected');
        }
        this.visitFunction(tree);
      },
      visitGetAccessor: function(tree) {
        this.checkType_(BLOCK, tree.body, 'block expected');
      },
      visitIfStatement: function(tree) {
        this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
        this.checkVisit_(tree.ifClause.isStatement(), tree.ifClause, 'statement expected');
        if (tree.elseClause !== null) {
          this.checkVisit_(tree.elseClause.isStatement(), tree.elseClause, 'statement expected');
        }
      },
      visitLabelledStatement: function(tree) {
        this.checkVisit_(tree.statement.isStatement(), tree.statement, 'statement expected');
      },
      visitMemberExpression: function(tree) {
        this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
        if (tree.operand instanceof NewExpression) {
          this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
        }
        this.visitAny(tree.operand);
      },
      visitMemberLookupExpression: function(tree) {
        this.check_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
        if (tree.operand instanceof NewExpression) {
          this.check_(tree.operand.args !== null, tree.operand, 'new args expected');
        }
        this.visitAny(tree.operand);
      },
      visitMissingPrimaryExpression: function(tree) {
        this.fail_(tree, 'parse tree contains errors');
      },
      visitModuleDeclaration: function(tree) {
        for (var i = 0; i < tree.specifiers.length; i++) {
          var specifier = tree.specifiers[i];
          this.checkType_(MODULE_SPECIFIER, specifier, 'module specifier expected');
        }
      },
      visitModuleDefinition: function(tree) {
        for (var i = 0; i < tree.elements.length; i++) {
          var element = tree.elements[i];
          this.checkVisit_((element.isStatement() && element.type !== BLOCK) || element.type === CLASS_DECLARATION || element.type === EXPORT_DECLARATION || element.type === IMPORT_DECLARATION || element.type === MODULE_DEFINITION || element.type === MODULE_DECLARATION, element, 'module element expected');
        }
      },
      visitModuleRequire: function(tree) {
        this.check_(tree.url.type == STRING, tree.url, 'string expected');
      },
      visitModuleSpecifier: function(tree) {
        this.checkType_(MODULE_EXPRESSION, tree.expression, 'module expression expected');
      },
      visitNewExpression: function(tree) {
        this.checkVisit_(tree.operand.isMemberExpression(), tree.operand, 'member expression expected');
        this.visitAny(tree.args);
      },
      visitObjectLiteralExpression: function(tree) {
        for (var i = 0; i < tree.propertyNameAndValues.length; i++) {
          var propertyNameAndValue = tree.propertyNameAndValues[i];
          switch (propertyNameAndValue.type) {
            case GET_ACCESSOR:
            case SET_ACCESSOR:
            case PROPERTY_METHOD_ASSIGNMENT:
            case PROPERTY_NAME_ASSIGNMENT:
            case PROPERTY_NAME_SHORTHAND:
              break;
            default:
              this.fail_(propertyNameAndValue, 'accessor, property name assignment or property method assigment expected');
          }
          this.visitAny(propertyNameAndValue);
        }
      },
      visitObjectPattern: function(tree) {
        for (var i = 0; i < tree.fields.length; i++) {
          var field = tree.fields[i];
          this.checkVisit_(field.type === OBJECT_PATTERN_FIELD || field.type === BINDING_ELEMENT || field.type === IDENTIFIER_EXPRESSION, field, 'object pattern field expected');
        }
      },
      visitObjectPatternField: function(tree) {
        this.checkVisit_(tree.element.type === BINDING_ELEMENT || tree.element.isPattern() || tree.element.isLeftHandSideExpression(), tree.element, 'binding element expected');
      },
      visitParenExpression: function(tree) {
        if (tree.expression.isPattern()) {
          this.visitAny(tree.expression);
        } else {
          this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        }
      },
      visitPostfixExpression: function(tree) {
        this.checkVisit_(tree.operand.isArrowFunctionExpression(), tree.operand, 'assignment expression expected');
      },
      visitPredefinedType: function(tree) {},
      visitProgram: function(tree) {
        for (var i = 0; i < tree.programElements.length; i++) {
          var programElement = tree.programElements[i];
          this.checkVisit_(programElement.isProgramElement(), programElement, 'global program element expected');
        }
      },
      visitPropertyNameAssignment: function(tree) {
        this.checkVisit_(tree.value.isArrowFunctionExpression(), tree.value, 'assignment expression expected');
      },
      visitPropertyNameShorthand: function(tree) {},
      visitTemplateLiteralExpression: function(tree) {
        if (tree.operand) {
          this.checkVisit_(tree.operand.isMemberExpression(), tree.operand, 'member or call expression expected');
        }
        for (var i = 0; i < tree.elements.length; i++) {
          var element = tree.elements[i];
          if (i % 2) {
            this.checkType_(TEMPLATE_SUBSTITUTION, element, 'Template literal substitution expected');
          } else {
            this.checkType_(TEMPLATE_LITERAL_PORTION, element, 'Template literal portion expected');
          }
        }
      },
      visitReturnStatement: function(tree) {
        if (tree.expression !== null) {
          this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        }
      },
      visitSetAccessor: function(tree) {
        this.checkType_(BLOCK, tree.body, 'block expected');
      },
      visitSpreadExpression: function(tree) {
        this.checkVisit_(tree.expression.isArrowFunctionExpression(), tree.expression, 'assignment expression expected');
      },
      visitStateMachine: function(tree) {
        this.fail_(tree, 'State machines are never valid outside of the ' + 'GeneratorTransformer pass.');
      },
      visitSwitchStatement: function(tree) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        var defaultCount = 0;
        for (var i = 0; i < tree.caseClauses.length; i++) {
          var caseClause = tree.caseClauses[i];
          if (caseClause.type === DEFAULT_CLAUSE) {
            ++defaultCount;
            this.checkVisit_(defaultCount <= 1, caseClause, 'no more than one default clause allowed');
          } else {
            this.checkType_(CASE_CLAUSE, caseClause, 'case or default clause expected');
          }
        }
      },
      visitThrowStatement: function(tree) {
        if (tree.value === null) {
          return;
        }
        this.checkVisit_(tree.value.isExpression(), tree.value, 'expression expected');
      },
      visitTryStatement: function(tree) {
        this.checkType_(BLOCK, tree.body, 'block expected');
        if (tree.catchBlock !== null) {
          this.checkType_(CATCH, tree.catchBlock, 'catch block expected');
        }
        if (tree.finallyBlock !== null) {
          this.checkType_(FINALLY, tree.finallyBlock, 'finally block expected');
        }
        if (tree.catchBlock === null && tree.finallyBlock === null) {
          this.fail_(tree, 'either catch or finally must be present');
        }
      },
      visitTypeName: function(tree) {},
      visitUnaryExpression: function(tree) {
        this.checkVisit_(tree.operand.isArrowFunctionExpression(), tree.operand, 'assignment expression expected');
      },
      visitVariableDeclaration: function(tree) {
        this.checkVisit_(tree.lvalue.isPattern() || tree.lvalue.type == BINDING_IDENTIFIER, tree.lvalue, 'binding identifier expected, found: ' + tree.lvalue.type);
        if (tree.initializer !== null) {
          this.checkVisit_(tree.initializer.isArrowFunctionExpression(), tree.initializer, 'assignment expression expected');
        }
      },
      visitWhileStatement: function(tree) {
        this.checkVisit_(tree.condition.isExpression(), tree.condition, 'expression expected');
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      },
      visitWithStatement: function(tree) {
        this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        this.checkVisit_(tree.body.isStatement(), tree.body, 'statement expected');
      },
      visitYieldExpression: function(tree) {
        if (tree.expression !== null) {
          this.checkVisit_(tree.expression.isExpression(), tree.expression, 'expression expected');
        }
      }
    }, $__proto, $__super, false);
    return $ParseTreeValidator;
  }(ParseTreeVisitor);
  ParseTreeValidator.validate = function(tree) {
    var validator = new ParseTreeValidator();
    try {
      validator.visitAny(tree);
    } catch (e) {
      if (!(e instanceof ValidationError)) {
        throw e;
      }
      var location = null;
      if (e.tree !== null) {
        location = e.tree.location;
      }
      if (location === null) {
        location = tree.location;
      }
      var locationString = location !== null ? location.start.toString(): '(unknown)';
      throw new Error(("Parse tree validation failure '" + e.message + "' at " + locationString + ":") + '\n\n' + TreeWriter.write(tree, {
        highlighted: e.tree,
        showLineNumbers: true
      }) + '\n');
    }
  };
  return Object.preventExtensions(Object.create(null, {ParseTreeValidator: {
      get: function() {
        return ParseTreeValidator;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_PrivateNameSyntaxTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, ASSERT_NAME = $__9.ASSERT_NAME, CREATE_NAME = $__9.CREATE_NAME, RUNTIME = $__9.RUNTIME, TRACEUR = $__9.TRACEUR;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var CONST = $__src_syntax_TokenType_js.CONST;
  var $__9 = $__src_syntax_trees_ParseTrees_js, VariableDeclarationList = $__9.VariableDeclarationList, VariableStatement = $__9.VariableStatement;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createCallExpression = $__9.createCallExpression, createEmptyArgumentList = $__9.createEmptyArgumentList, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createVariableDeclaration = $__9.createVariableDeclaration;
  var PrivateNameSyntaxTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PrivateNameSyntaxTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      getTransformedName_: function(token) {
        return this.identifierGenerator.getUniqueIdentifier(token.value);
      },
      transformAtNameExpression: function(tree) {
        var transformedName = this.getTransformedName_(tree.atNameToken);
        return createIdentifierExpression(transformedName);
      },
      transformNameStatement: function(tree) {
        var declarations = this.transformList(tree.declarations);
        return new VariableStatement(tree.location, new VariableDeclarationList(tree.location, CONST, declarations));
      },
      transformAtNameDeclaration: function(tree) {
        var transformedName = this.getTransformedName_(tree.atNameToken);
        var args, name;
        if (tree.initializer) {
          args = createArgumentList(this.transformAny(tree.initializer));
          name = ASSERT_NAME;
        } else {
          args = createEmptyArgumentList();
          name = CREATE_NAME;
        }
        return createVariableDeclaration(transformedName, createCallExpression(createMemberExpression(TRACEUR, RUNTIME, name), args));
      }
    }, $__proto, $__super, false);
    return $PrivateNameSyntaxTransformer;
  }(TempVarTransformer);
  PrivateNameSyntaxTransformer.transformTree = function(identifierGenerator, tree) {
    return new PrivateNameSyntaxTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {PrivateNameSyntaxTransformer: {
      get: function() {
        return PrivateNameSyntaxTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_PropertyNameShorthandTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTrees_js, IdentifierExpression = $__9.IdentifierExpression, PropertyNameAssignment = $__9.PropertyNameAssignment;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var PropertyNameShorthandTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $PropertyNameShorthandTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformPropertyNameShorthand: function(tree) {
        return new PropertyNameAssignment(tree.location, tree.name, new IdentifierExpression(tree.location, tree.name));
      }
    }, $__proto, $__super, false);
    return $PropertyNameShorthandTransformer;
  }(ParseTreeTransformer);
  PropertyNameShorthandTransformer.transformTree = function(tree) {
    return new PropertyNameShorthandTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {PropertyNameShorthandTransformer: {
      get: function() {
        return PropertyNameShorthandTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_TemplateLiteralTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_trees_ParseTreeType_js, BINARY_OPERATOR = $__9.BINARY_OPERATOR, COMMA_EXPRESSION = $__9.COMMA_EXPRESSION, CONDITIONAL_EXPRESSION = $__9.CONDITIONAL_EXPRESSION, TEMPLATE_LITERAL_PORTION = $__9.TEMPLATE_LITERAL_PORTION;
  var $__9 = $__src_syntax_trees_ParseTrees_js, LiteralExpression = $__9.LiteralExpression, ParenExpression = $__9.ParenExpression;
  var LiteralToken = $__src_syntax_LiteralToken_js.LiteralToken;
  var $__9 = $__src_syntax_PredefinedName_js, DEFINE_PROPERTIES = $__9.DEFINE_PROPERTIES, OBJECT = $__9.OBJECT, RAW = $__9.RAW;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_syntax_TokenType_js, PERCENT = $__9.PERCENT, PLUS = $__9.PLUS, SLASH = $__9.SLASH, STAR = $__9.STAR, STRING = $__9.STRING;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createArrayLiteralExpression = $__9.createArrayLiteralExpression, createBinaryOperator = $__9.createBinaryOperator, createCallExpression = $__9.createCallExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createObjectFreeze = $__9.createObjectFreeze, createObjectLiteralExpression = $__9.createObjectLiteralExpression, createOperatorToken = $__9.createOperatorToken, createPropertyDescriptor = $__9.createPropertyDescriptor, createPropertyNameAssignment = $__9.createPropertyNameAssignment, createStringLiteral = $__9.createStringLiteral;
  function createCallSiteIdObject(tree) {
    var elements = tree.elements;
    return createObjectFreeze(createCallExpression(createMemberExpression(OBJECT, DEFINE_PROPERTIES), createArgumentList(createCookedStringArray(elements), createObjectLiteralExpression(createPropertyNameAssignment(RAW, createPropertyDescriptor({value: createObjectFreeze(createRawStringArray(elements))}))))));
  }
  function maybeAddEmptyStringAtEnd(elements, items) {
    var length = elements.length;
    if (!length || elements[length - 1].type !== TEMPLATE_LITERAL_PORTION) items.push(createStringLiteral(''));
  }
  function createRawStringArray(elements) {
    var items = [];
    for (var i = 0; i < elements.length; i += 2) {
      var str = replaceRaw(JSON.stringify(elements[i].value.value));
      var loc = elements[i].location;
      var expr = new LiteralExpression(loc, new LiteralToken(STRING, str, loc));
      items.push(expr);
    }
    maybeAddEmptyStringAtEnd(elements, items);
    return createArrayLiteralExpression(items);
  }
  function createCookedStringLiteralExpression(tree) {
    var str = cookString(tree.value.value);
    var loc = tree.location;
    return new LiteralExpression(loc, new LiteralToken(STRING, str, loc));
  }
  function createCookedStringArray(elements) {
    var items = [];
    for (var i = 0; i < elements.length; i += 2) {
      items.push(createCookedStringLiteralExpression(elements[i]));
    }
    maybeAddEmptyStringAtEnd(elements, items);
    return createArrayLiteralExpression(items);
  }
  function replaceRaw(s) {
    return s.replace(/\u2028|\u2029/g, function(c) {
      switch (c) {
        case '\u2028':
          return '\\u2028';
        case '\u2029':
          return '\\u2029';
        default:
          throw Error('Not reachable');
      }
    });
  }
  function cookString(s) {
    var sb = ['"'];
    var i = 0, k = 1, c, c2;
    while (i < s.length) {
      c = s[i++];
      switch (c) {
        case '\\':
          c2 = s[i++];
          switch (c2) {
            case '\n':
            case '\u2028':
            case '\u2029':
              break;
            case '\r':
              if (s[i + 1] === '\n') {
                i++;
              }
              break;
            default:
              sb[k++] = c;
              sb[k++] = c2;
          }
          break;
        case '"':
          sb[k++] = '\\"';
          break;
        case '\n':
          sb[k++] = '\\n';
          break;
        case '\r':
          sb[k++] = '\\r';
          break;
        case '\t':
          sb[k++] = '\\t';
          break;
        case '\f':
          sb[k++] = '\\f';
          break;
        case '\b':
          sb[k++] = '\\b';
          break;
        case '\u2028':
          sb[k++] = '\\u2028';
          break;
        case '\u2029':
          sb[k++] = '\\u2029';
          break;
        default:
          sb[k++] = c;
      }
    }
    sb[k++] = '"';
    return sb.join('');
  }
  var TemplateLiteralTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TemplateLiteralTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformFunctionBody: function(tree) {
        return this.transformBlock(tree);
      },
      transformTemplateLiteralExpression: function(tree) {
        if (!tree.operand) return this.createDefaultTemplateLiteral(tree);
        var operand = this.transformAny(tree.operand);
        var elements = tree.elements;
        var callsiteIdObject = createCallSiteIdObject(tree);
        var idName = this.addTempVar(callsiteIdObject);
        var args = [createIdentifierExpression(idName)];
        for (var i = 1; i < elements.length; i += 2) {
          args.push(this.transformAny(elements[i]));
        }
        return createCallExpression(operand, createArgumentList(args));
      },
      transformTemplateSubstitution: function(tree) {
        var transformedTree = this.transformAny(tree.expression);
        switch (transformedTree.type) {
          case BINARY_OPERATOR:
            switch (transformedTree.operator.type) {
              case STAR:
              case PERCENT:
              case SLASH:
                return transformedTree;
            }
          case COMMA_EXPRESSION:
          case CONDITIONAL_EXPRESSION:
            return new ParenExpression(null, transformedTree);
        }
        return transformedTree;
      },
      transformTemplateLiteralPortion: function(tree) {
        return createCookedStringLiteralExpression(tree);
      },
      createDefaultTemplateLiteral: function(tree) {
        var length = tree.elements.length;
        if (length === 0) {
          var loc = tree.location;
          return new LiteralExpression(loc, new LiteralToken(STRING, '""', loc));
        }
        var firstNonEmpty = tree.elements[0].value.value === '' ? - 1: 0;
        var binaryExpression = this.transformAny(tree.elements[0]);
        if (length == 1) return binaryExpression;
        var plusToken = createOperatorToken(PLUS);
        for (var i = 1; i < length; i++) {
          var element = tree.elements[i];
          if (element.type === TEMPLATE_LITERAL_PORTION) {
            if (element.value.value === '') continue; else if (firstNonEmpty < 0 && i === 2) binaryExpression = binaryExpression.right;
          }
          var transformedTree = this.transformAny(tree.elements[i]);
          binaryExpression = createBinaryOperator(binaryExpression, plusToken, transformedTree);
        }
        return new ParenExpression(null, binaryExpression);
      }
    }, $__proto, $__super, false);
    return $TemplateLiteralTransformer;
  }(TempVarTransformer);
  TemplateLiteralTransformer.transformTree = function(identifierGenerator, tree) {
    return new TemplateLiteralTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {TemplateLiteralTransformer: {
      get: function() {
        return TemplateLiteralTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_RestParameterTransformer_js = (function() {
  "use strict";
  var $__3 = Object.freeze(Object.defineProperties(["\n          for (var ", " = [], ", " = ", ";\n               ", " < arguments.length; ", "++)\n            ", "[", " - ", "] = arguments[", "];"], {raw: {value: Object.freeze(["\n          for (var ", " = [], ", " = ", ";\n               ", " < arguments.length; ", "++)\n            ", "[", " - ", "] = arguments[", "];"])}})), $__0 = Object.freeze(Object.defineProperties(["\n          for (var ", " = [], ", " = 0;\n               ", " < arguments.length; ", "++)\n            ", "[", "] = arguments[", "];"], {raw: {value: Object.freeze(["\n          for (var ", " = [], ", " = 0;\n               ", " < arguments.length; ", "++)\n            ", "[", "] = arguments[", "];"])}}));
  var FormalParameterList = $__src_syntax_trees_ParseTrees_js.FormalParameterList;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createBlock = $__9.createBlock, createIdentifierToken = $__9.createIdentifierToken;
  var parseStatement = $__src_codegeneration_PlaceholderParser_js.parseStatement;
  var prependStatements = $__src_codegeneration_PrependStatements_js.prependStatements;
  function hasRestParameter(formalParameterList) {
    var parameters = formalParameterList.parameters;
    return parameters.length > 0 && parameters[parameters.length - 1].isRestParameter();
  }
  function getRestParameterLiteralToken(formalParameterList) {
    var parameters = formalParameterList.parameters;
    return parameters[parameters.length - 1].identifier.identifierToken;
  }
  var RestParameterTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $RestParameterTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformFunction: function(tree) {
        if (hasRestParameter(tree.formalParameterList)) return this.desugarRestParameters_(tree);
        return $__superCall(this, $__proto, "transformFunction", [tree]);
      },
      desugarRestParameters_: function(tree) {
        var formalParameterList = this.transformAny(tree.formalParameterList);
        var parametersWithoutRestParam = new FormalParameterList(formalParameterList.location, formalParameterList.parameters.slice(0, - 1));
        var startIndex = tree.formalParameterList.parameters.length - 1;
        var i = createIdentifierToken(this.getTempIdentifier());
        var name = getRestParameterLiteralToken(tree.formalParameterList);
        var loop;
        if (startIndex) {
          loop = parseStatement($__3, name, i, startIndex, i, i, name, i, startIndex, i);
        } else {
          loop = parseStatement($__0, name, i, i, i, name, i, i);
        }
        var statements = prependStatements(tree.functionBody.statements, loop);
        var functionBody = this.transformAny(createBlock(statements));
        return new tree.constructor(tree.location, tree.name, tree.isGenerator, parametersWithoutRestParam, functionBody);
      }
    }, $__proto, $__super, false);
    return $RestParameterTransformer;
  }(TempVarTransformer);
  RestParameterTransformer.transformTree = function(identifierGenerator, tree) {
    return new RestParameterTransformer(identifierGenerator).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {RestParameterTransformer: {
      get: function() {
        return RestParameterTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_SpreadTransformer_js = (function() {
  "use strict";
  var $__9 = $__src_syntax_PredefinedName_js, APPLY = $__9.APPLY, BIND = $__9.BIND, FUNCTION = $__9.FUNCTION, PROTOTYPE = $__9.PROTOTYPE;
  var $__9 = $__src_syntax_trees_ParseTreeType_js, MEMBER_EXPRESSION = $__9.MEMBER_EXPRESSION, MEMBER_LOOKUP_EXPRESSION = $__9.MEMBER_LOOKUP_EXPRESSION, SPREAD_EXPRESSION = $__9.SPREAD_EXPRESSION;
  var TempVarTransformer = $__src_codegeneration_TempVarTransformer_js.TempVarTransformer;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createArgumentList = $__9.createArgumentList, createArrayLiteralExpression = $__9.createArrayLiteralExpression, createAssignmentExpression = $__9.createAssignmentExpression, createBlock = $__9.createBlock, createBooleanLiteral = $__9.createBooleanLiteral, createCallExpression = $__9.createCallExpression, createEmptyArgumentList = $__9.createEmptyArgumentList, createFunctionExpression = $__9.createFunctionExpression, createIdentifierExpression = $__9.createIdentifierExpression, createMemberExpression = $__9.createMemberExpression, createMemberLookupExpression = $__9.createMemberLookupExpression, createNewExpression = $__9.createNewExpression, createNullLiteral = $__9.createNullLiteral, createParameterList = $__9.createParameterList, createParameterReference = $__9.createParameterReference, createParenExpression = $__9.createParenExpression, createReturnStatement = $__9.createReturnStatement;
  var SPREAD_CODE = "\n    function() {\n      var rv = [], k = 0;\n      for (var i = 0; i < arguments.length; i++) {\n        var value = %toObject(arguments[i]);\n        for (var j = 0; j < value.length; j++) {\n          rv[k++] = value[j];\n        }\n      }\n      return rv;\n    }";
  function hasSpreadMember(trees) {
    return trees.some((function(tree) {
      return tree && tree.type == SPREAD_EXPRESSION;
    }));
  }
  var SpreadTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $SpreadTransformer = ($__createClass)({
      constructor: function(identifierGenerator, runtimeInliner) {
        $__superCall(this, $__proto, "constructor", [identifierGenerator]);
        this.runtimeInliner_ = runtimeInliner;
      },
      get spread_() {
        return this.runtimeInliner_.get('spread', SPREAD_CODE);
      },
      get toObject_() {
        return this.runtimeInliner_.get('toObject');
      },
      createArrayFromElements_: function(elements, needsNewArray) {
        var length = elements.length;
        if (length === 1 && !needsNewArray) {
          return createCallExpression(this.toObject_, createArgumentList(this.transformAny(elements[0].expression)));
        }
        var args = [];
        var lastArray;
        for (var i = 0; i < length; i++) {
          if (elements[i] && elements[i].type === SPREAD_EXPRESSION) {
            if (lastArray) {
              args.push(createArrayLiteralExpression(lastArray));
              lastArray = null;
            }
            args.push(this.transformAny(elements[i].expression));
          } else {
            if (!lastArray) lastArray = [];
            lastArray.push(this.transformAny(elements[i]));
          }
        }
        if (lastArray) args.push(createArrayLiteralExpression(lastArray));
        return createCallExpression(this.spread_, createArgumentList(args));
      },
      desugarCallSpread_: function(tree) {
        var operand = this.transformAny(tree.operand);
        var functionObject, contextObject;
        if (operand.type == MEMBER_EXPRESSION) {
          var tempIdent = createIdentifierExpression(this.addTempVar());
          var parenExpression = createParenExpression(createAssignmentExpression(tempIdent, operand.operand));
          var memberName = operand.memberName;
          contextObject = tempIdent;
          functionObject = createMemberExpression(parenExpression, memberName);
        } else if (tree.operand.type == MEMBER_LOOKUP_EXPRESSION) {
          var tempIdent = createIdentifierExpression(this.addTempVar());
          var parenExpression = createParenExpression(createAssignmentExpression(tempIdent, operand.operand));
          var memberExpression = this.transformAny(operand.memberExpression);
          contextObject = tempIdent;
          functionObject = createMemberLookupExpression(parenExpression, memberExpression);
        } else {
          contextObject = createNullLiteral();
          functionObject = operand;
        }
        var arrayExpression = this.createArrayFromElements_(tree.args.args, false);
        return createCallExpression(createMemberExpression(functionObject, APPLY), createArgumentList(contextObject, arrayExpression));
      },
      desugarNewSpread_: function(tree) {
        var arrayExpression = $__spread([createNullLiteral()], tree.args.args);
        arrayExpression = this.createArrayFromElements_(arrayExpression, false);
        return createNewExpression(createParenExpression(createCallExpression(createMemberExpression(FUNCTION, PROTOTYPE, BIND, APPLY), createArgumentList(this.transformAny(tree.operand), arrayExpression))), createEmptyArgumentList());
      },
      transformArrayLiteralExpression: function(tree) {
        if (hasSpreadMember(tree.elements)) {
          return this.createArrayFromElements_(tree.elements, true);
        }
        return $__superCall(this, $__proto, "transformArrayLiteralExpression", [tree]);
      },
      transformCallExpression: function(tree) {
        if (hasSpreadMember(tree.args.args)) {
          return this.desugarCallSpread_(tree);
        }
        return $__superCall(this, $__proto, "transformCallExpression", [tree]);
      },
      transformNewExpression: function(tree) {
        if (tree.args != null && hasSpreadMember(tree.args.args)) {
          return this.desugarNewSpread_(tree);
        }
        return $__superCall(this, $__proto, "transformNewExpression", [tree]);
      }
    }, $__proto, $__super, true);
    return $SpreadTransformer;
  }(TempVarTransformer);
  SpreadTransformer.transformTree = function(identifierGenerator, runtimeInliner, tree) {
    return new SpreadTransformer(identifierGenerator, runtimeInliner).transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {SpreadTransformer: {
      get: function() {
        return SpreadTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_TypeTransformer_js = (function() {
  "use strict";
  var VariableDeclaration = $__src_syntax_trees_ParseTrees_js.VariableDeclaration;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var TypeTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TypeTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformVariableDeclaration: function(tree) {
        if (tree.typeAnnotation) {
          tree = new VariableDeclaration(tree.location, tree.lvalue, null, tree.initializer);
        }
        return $__superCall(this, $__proto, "transformVariableDeclaration", [tree]);
      }
    }, $__proto, $__super, false);
    return $TypeTransformer;
  }(ParseTreeTransformer);
  TypeTransformer.transformTree = function(tree) {
    return new TypeTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {TypeTransformer: {
      get: function() {
        return TypeTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_ProgramTransformer_js = (function() {
  "use strict";
  var ArrayComprehensionTransformer = $__src_codegeneration_ArrayComprehensionTransformer_js.ArrayComprehensionTransformer;
  var ArrowFunctionTransformer = $__src_codegeneration_ArrowFunctionTransformer_js.ArrowFunctionTransformer;
  var AtNameMemberTransformer = $__src_codegeneration_AtNameMemberTransformer_js.AtNameMemberTransformer;
  var BlockBindingTransformer = $__src_codegeneration_BlockBindingTransformer_js.BlockBindingTransformer;
  var CascadeExpressionTransformer = $__src_codegeneration_CascadeExpressionTransformer_js.CascadeExpressionTransformer;
  var ClassTransformer = $__src_codegeneration_ClassTransformer_js.ClassTransformer;
  var CollectionTransformer = $__src_codegeneration_CollectionTransformer_js.CollectionTransformer;
  var DefaultParametersTransformer = $__src_codegeneration_DefaultParametersTransformer_js.DefaultParametersTransformer;
  var DestructuringTransformer = $__src_codegeneration_DestructuringTransformer_js.DestructuringTransformer;
  var ForOfTransformer = $__src_codegeneration_ForOfTransformer_js.ForOfTransformer;
  var FreeVariableChecker = $__src_semantics_FreeVariableChecker_js.FreeVariableChecker;
  var GeneratorComprehensionTransformer = $__src_codegeneration_GeneratorComprehensionTransformer_js.GeneratorComprehensionTransformer;
  var GeneratorTransformPass = $__src_codegeneration_GeneratorTransformPass_js.GeneratorTransformPass;
  var IsExpressionTransformer = $__src_codegeneration_IsExpressionTransformer_js.IsExpressionTransformer;
  var ModuleTransformer = $__src_codegeneration_ModuleTransformer_js.ModuleTransformer;
  var ObjectLiteralTransformer = $__src_codegeneration_ObjectLiteralTransformer_js.ObjectLiteralTransformer;
  var ObjectMap = $__src_util_ObjectMap_js.ObjectMap;
  var ParseTreeValidator = $__src_syntax_ParseTreeValidator_js.ParseTreeValidator;
  var PrivateNameSyntaxTransformer = $__src_codegeneration_PrivateNameSyntaxTransformer_js.PrivateNameSyntaxTransformer;
  var PropertyNameShorthandTransformer = $__src_codegeneration_PropertyNameShorthandTransformer_js.PropertyNameShorthandTransformer;
  var TemplateLiteralTransformer = $__src_codegeneration_TemplateLiteralTransformer_js.TemplateLiteralTransformer;
  var RestParameterTransformer = $__src_codegeneration_RestParameterTransformer_js.RestParameterTransformer;
  var SpreadTransformer = $__src_codegeneration_SpreadTransformer_js.SpreadTransformer;
  var TypeTransformer = $__src_codegeneration_TypeTransformer_js.TypeTransformer;
  var $__9 = $__src_options_js, options = $__9.options, transformOptions = $__9.transformOptions;
  var ProgramTransformer = function() {
    var $ProgramTransformer = ($__createClassNoExtends)({
      constructor: function(reporter, project) {
        this.project_ = project;
        this.reporter_ = reporter;
        this.results_ = new ObjectMap();
      },
      transform_: function() {
        this.project_.getSourceFiles().forEach((function(file) {
          this.transformFile_(file);
        }).bind(this));
      },
      transformFile_: function(file) {
        var result = this.transform(this.project_.getParseTree(file));
        this.results_.set(file, result);
      },
      transformFileAsModule_: function(module, file) {
        var result = this.transformTree_(this.project_.getParseTree(file), module);
        this.results_.set(file, result);
      },
      transform: function(tree) {
        return this.transformTree_(tree);
      },
      transformTree_: function(tree, opt_module) {
        var identifierGenerator = this.project_.identifierGenerator;
        var runtimeInliner = this.project_.runtimeInliner;
        var reporter = this.reporter_;
        function chain(enabled, transformer) {
          for (var args = [], $__8 = 2; $__8 < arguments.length; $__8++) args[$__8 - 2] = arguments[$__8];
          if (!enabled) return;
          if (!reporter.hadError()) {
            if (options.validate) {
              ParseTreeValidator.validate(tree);
            }
            tree = transformer.apply(null, $__spread(args, [tree])) || tree;
          }
        }
        chain(transformOptions.types, TypeTransformer.transformTree);
        chain(transformOptions.templateLiterals, TemplateLiteralTransformer.transformTree, identifierGenerator);
        chain(transformOptions.modules, this.transformModules_.bind(this), tree, opt_module);
        chain(transformOptions.arrowFunctions, ArrowFunctionTransformer.transformTree, reporter);
        chain(transformOptions.classes, ClassTransformer.transform, identifierGenerator, runtimeInliner, reporter);
        chain(transformOptions.propertyNameShorthand, PropertyNameShorthandTransformer.transformTree);
        chain(transformOptions.propertyMethods || transformOptions.privateNameSyntax && transformOptions.privateNames, ObjectLiteralTransformer.transformTree, identifierGenerator);
        chain(transformOptions.isExpression, IsExpressionTransformer.transformTree);
        chain(transformOptions.generatorComprehension, GeneratorComprehensionTransformer.transformTree, identifierGenerator);
        chain(transformOptions.arrayComprehension, ArrayComprehensionTransformer.transformTree, identifierGenerator);
        chain(transformOptions.forOf, ForOfTransformer.transformTree, identifierGenerator);
        chain(transformOptions.restParameters, RestParameterTransformer.transformTree, identifierGenerator);
        chain(transformOptions.defaultParameters, DefaultParametersTransformer.transformTree);
        chain(transformOptions.destructuring, DestructuringTransformer.transformTree, identifierGenerator);
        chain(transformOptions.generators || transformOptions.deferredFunctions, GeneratorTransformPass.transformTree, identifierGenerator, reporter);
        chain(transformOptions.privateNames && transformOptions.privateNameSyntax, AtNameMemberTransformer.transformTree, identifierGenerator);
        chain(transformOptions.privateNames && transformOptions.privateNameSyntax, PrivateNameSyntaxTransformer.transformTree, identifierGenerator);
        chain(transformOptions.spread, SpreadTransformer.transformTree, identifierGenerator, runtimeInliner);
        chain(true, runtimeInliner.transformAny.bind(runtimeInliner));
        chain(transformOptions.blockBinding, BlockBindingTransformer.transformTree);
        chain(transformOptions.cascadeExpression, CascadeExpressionTransformer.transformTree, identifierGenerator, reporter);
        chain(transformOptions.trapMemberLookup || transformOptions.privateNames, CollectionTransformer.transformTree, identifierGenerator);
        chain(options.freeVariableChecker, FreeVariableChecker.checkProgram, reporter);
        return tree;
      },
      transformModules_: function(tree, opt_module) {
        if (opt_module) {
          return ModuleTransformer.transformAsModule(this.project_, opt_module, tree);
        } else {
          return ModuleTransformer.transform(this.project_, tree);
        }
      }
    });
    return $ProgramTransformer;
  }();
  ProgramTransformer.transform = function(reporter, project) {
    var transformer = new ProgramTransformer(reporter, project);
    transformer.transform_();
    return transformer.results_;
  };
  ProgramTransformer.transformFile = function(reporter, project, sourceFile) {
    var transformer = new ProgramTransformer(reporter, project);
    transformer.transformFile_(sourceFile);
    return transformer.results_;
  };
  ProgramTransformer.transformFileAsModule = function(reporter, project, module, sourceFile) {
    var transformer = new ProgramTransformer(reporter, project);
    transformer.transformFileAsModule_(module, sourceFile);
    return transformer.results_;
  };
  return Object.preventExtensions(Object.create(null, {ProgramTransformer: {
      get: function() {
        return ProgramTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_RuntimeInliner_js = (function() {
  "use strict";
  var MutedErrorReporter = $__src_util_MutedErrorReporter_js.MutedErrorReporter;
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var Parser = $__src_syntax_Parser_js.Parser;
  var Program = $__src_syntax_trees_ParseTrees_js.Program;
  var SourceFile = $__src_syntax_SourceFile_js.SourceFile;
  var VAR = $__src_syntax_TokenType_js.VAR;
  var $__9 = $__src_codegeneration_ParseTreeFactory_js, createIdentifierExpression = $__9.createIdentifierExpression, createVariableDeclaration = $__9.createVariableDeclaration, createVariableDeclarationList = $__9.createVariableDeclarationList, createVariableStatement = $__9.createVariableStatement;
  var prependStatements = $__src_codegeneration_PrependStatements_js.prependStatements;
  var shared = {toObject: "function(value) {\n        if (value == null)\n          throw TypeError();\n        return Object(value);\n      }"};
  function parse(source, name) {
    var file = new SourceFile(name + '@runtime', source);
    var errorReporter = new MutedErrorReporter();
    return new Parser(errorReporter, file).parseAssignmentExpression();
  }
  var RuntimeInliner = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $RuntimeInliner = ($__createClass)({
      constructor: function(identifierGenerator) {
        $__superCall(this, $__proto, "constructor", []);
        this.identifierGenerator = identifierGenerator;
        this.map_ = Object.create(null);
      },
      transformProgram: function(tree) {
        var names = Object.keys(this.map_);
        if (!names.length) return tree;
        var vars = names.filter(function(name) {
          return !this.map_[name].inserted;
        }, this).map(function(name) {
          var item = this.map_[name];
          item.inserted = true;
          return createVariableDeclaration(item.uid, item.expression);
        }, this);
        if (!vars.length) return tree;
        var variableStatement = createVariableStatement(createVariableDeclarationList(VAR, vars));
        var programElements = prependStatements(tree.programElements, variableStatement);
        return new Program(tree.location, programElements);
      },
      register: function(name, source) {
        if (name in this.map_) return;
        var self = this;
        source = source.replace(/%([a-zA-Z0-9_$]+)/g, function(_, name) {
          if (name in shared) {
            self.register(name, shared[name]);
          }
          return self.getAsString(name);
        });
        var uid = this.identifierGenerator.getUniqueIdentifier(name);
        this.map_[name] = {
          expression: parse(source, name),
          uid: uid,
          inserted: false
        };
      },
      getAsIdentifierExpression: function(name) {
        return createIdentifierExpression(this.map_[name].uid);
      },
      getAsString: function(name) {
        return this.map_[name].uid;
      },
      get: function(name, opt_source) {
        if (!(name in this.map_)) {
          if (name in shared) opt_source = shared[name];
          traceur.assert(opt_source);
          this.register(name, opt_source);
        }
        return this.getAsIdentifierExpression(name);
      }
    }, $__proto, $__super, true);
    return $RuntimeInliner;
  }(ParseTreeTransformer);
  return Object.preventExtensions(Object.create(null, {RuntimeInliner: {
      get: function() {
        return RuntimeInliner;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_UniqueIdentifierGenerator_js = (function() {
  "use strict";
  var UniqueIdentifierGenerator = function() {
    var $UniqueIdentifierGenerator = ($__createClassNoExtends)({
      constructor: function() {
        this.identifierIndex = 0;
      },
      generateUniqueIdentifier: function() {
        return ("$__" + this.identifierIndex++);
      },
      getUniqueIdentifier: function(name) {
        if (name[0] === '@') return ("$___" + name.slice(1));
        return ("$__" + name);
      }
    });
    return $UniqueIdentifierGenerator;
  }();
  return Object.preventExtensions(Object.create(null, {UniqueIdentifierGenerator: {
      get: function() {
        return UniqueIdentifierGenerator;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_semantics_symbols_Project_js = (function() {
  "use strict";
  var ArrayMap = $__src_util_ArrayMap_js.ArrayMap;
  var ExportSymbol = $__src_semantics_symbols_ExportSymbol_js.ExportSymbol;
  var ModuleSymbol = $__src_semantics_symbols_ModuleSymbol_js.ModuleSymbol;
  var ObjectMap = $__src_util_ObjectMap_js.ObjectMap;
  var RuntimeInliner = $__src_codegeneration_RuntimeInliner_js.RuntimeInliner;
  var UniqueIdentifierGenerator = $__src_codegeneration_UniqueIdentifierGenerator_js.UniqueIdentifierGenerator;
  var resolveUrl = $__src_util_url_js.resolveUrl;
  function addAll(self, other) {
    for (var key in other) {
      self[key] = other[key];
    }
  }
  function values(map) {
    return Object.keys(map).map((function(key) {
      return map[key];
    }));
  }
  var standardModuleUrlRegExp = /^@\w+$/;
  var standardModuleCache = Object.create(null);
  function getStandardModule(url) {
    if (!(url in standardModuleCache)) {
      var symbol = new ModuleSymbol(null, null, null, url);
      var moduleInstance = traceur.runtime.modules[url];
      Object.keys(moduleInstance).forEach((function(name) {
        symbol.addExport(name, new ExportSymbol(null, name, null));
      }));
      standardModuleCache[url] = symbol;
    }
    return standardModuleCache[url];
  }
  var Project = function() {
    var $Project = ($__createClassNoExtends)({
      constructor: function(url) {
        this.identifierGenerator = new UniqueIdentifierGenerator();
        this.runtimeInliner = new RuntimeInliner(this.identifierGenerator);
        this.sourceFiles_ = Object.create(null);
        this.parseTrees_ = new ObjectMap();
        this.rootModule_ = new ModuleSymbol(null, null, null, url);
        this.modulesByUrl_ = Object.create(null);
        this.moduleExports_ = new ArrayMap();
      },
      get url() {
        return this.rootModule_.url;
      },
      createClone: function() {
        var p = new Project(this.url);
        addAll(p.sourceFiles_, this.sourceFiles_);
        p.parseTrees_.addAll(this.parseTrees_);
        p.objectClass_ = this.objectClass_;
        return p;
      },
      hasFile: function(name) {
        return name in this.sourceFiles_;
      },
      addFile: function(file) {
        this.sourceFiles_[file.name] = file;
      },
      getFile: function(name) {
        return this.sourceFiles_[name];
      },
      getSourceFiles: function() {
        return values(this.sourceFiles_);
      },
      getParseTrees: function() {
        return this.parseTrees_.values();
      },
      setParseTree: function(file, tree) {
        if (this.sourceFiles_[file.name] != file) {
          throw new Error();
        }
        this.parseTrees_.set(file, tree);
      },
      getParseTree: function(file) {
        return this.parseTrees_.get(file);
      },
      getRootModule: function() {
        return this.rootModule_;
      },
      addExternalModule: function(module) {
        traceur.assert(!this.hasModuleForUrl(module.url));
        this.modulesByUrl_[module.url] = module;
      },
      getModuleForUrl: function(url) {
        url = resolveUrl(this.url, url);
        traceur.assert(this.hasModuleForUrl(url));
        if (standardModuleUrlRegExp.test(url)) return getStandardModule(url);
        return this.modulesByUrl_[url];
      },
      hasModuleForUrl: function(url) {
        if (standardModuleUrlRegExp.test(url)) return url in traceur.runtime.modules;
        url = resolveUrl(this.url, url);
        return url in this.modulesByUrl_;
      },
      setModuleForStarTree: function(tree, symbol) {
        this.moduleExports_.set(tree, symbol);
      },
      getModuleForStarTree: function(tree) {
        return this.moduleExports_.get(tree);
      }
    });
    return $Project;
  }();
  return Object.preventExtensions(Object.create(null, {Project: {
      get: function() {
        return Project;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_Compiler_js = (function() {
  "use strict";
  var ModuleAnalyzer = $__src_semantics_ModuleAnalyzer_js.ModuleAnalyzer;
  var Parser = $__src_syntax_Parser_js.Parser;
  var ProgramTransformer = $__src_codegeneration_ProgramTransformer_js.ProgramTransformer;
  var Project = $__src_semantics_symbols_Project_js.Project;
  var Compiler = function() {
    var $Compiler = ($__createClassNoExtends)({
      constructor: function(reporter, project) {
        this.reporter_ = reporter;
        this.project_ = project;
      },
      compile_: function() {
        this.parse_();
        this.analyze_();
        this.transform_();
        if (this.hadError_()) {
          return null;
        }
        return this.results_;
      },
      compileFile_: function(file) {
        this.parseFile_(file);
        this.analyzeFile_(file);
        this.transformFile_(file);
        if (this.hadError_()) {
          return null;
        }
        return this.results_.get(file);
      },
      transform_: function() {
        if (this.hadError_()) {
          return;
        }
        this.results_ = ProgramTransformer.transform(this.reporter_, this.project_);
      },
      transformFile_: function(sourceFile) {
        if (this.hadError_()) {
          return;
        }
        this.results_ = ProgramTransformer.transformFile(this.reporter_, this.project_, sourceFile);
      },
      analyze_: function() {
        if (this.hadError_()) {
          return;
        }
        var analyzer = new ModuleAnalyzer(this.reporter_, this.project_);
        analyzer.analyze();
      },
      analyzeFile_: function(sourceFile) {
        if (this.hadError_()) {
          return;
        }
        var analyzer = new ModuleAnalyzer(this.reporter_, this.project_);
        analyzer.analyzeFile(sourceFile);
      },
      parse_: function() {
        this.project_.getSourceFiles().forEach(this.parseFile_, this);
      },
      parseFile_: function(file) {
        if (this.hadError_()) {
          return;
        }
        this.project_.setParseTree(file, new Parser(this.reporter_, file).parseProgram(true));
      },
      hadError_: function() {
        return this.reporter_.hadError();
      }
    });
    return $Compiler;
  }();
  Compiler.compile = function(reporter, project) {
    return new Compiler(reporter, project).compile_();
  };
  Compiler.compileFile = function(reporter, sourceFile, url) {
    var project = new Project(url);
    project.addFile(sourceFile);
    return new Compiler(reporter, project).compileFile_(sourceFile);
  };
  return Object.preventExtensions(Object.create(null, {Compiler: {
      get: function() {
        return Compiler;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_WebPageProject_js = (function() {
  "use strict";
  var Compiler = $__src_codegeneration_Compiler_js.Compiler;
  var ErrorReporter = $__src_util_ErrorReporter_js.ErrorReporter;
  var Project = $__src_semantics_symbols_Project_js.Project;
  var SourceFile = $__src_syntax_SourceFile_js.SourceFile;
  var TreeWriter = $__src_outputgeneration_TreeWriter_js.TreeWriter;
  var WebPageProject = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $WebPageProject = ($__createClass)({
      constructor: function(url) {
        $__superCall(this, $__proto, "constructor", [url]);
        this.numPending_ = 0;
        this.numberInlined_ = 0;
      },
      asyncLoad_: function(url, fncOfContent, onScriptsReady) {
        this.numPending_++;
        this.loadResource(url, (function(content) {
          if (content) fncOfContent(content); else console.warn('Failed to load', url);
          if (--this.numPending_ <= 0) onScriptsReady();
        }).bind(this));
      },
      loadResource: function(url, fncOfContentOrNull) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', (function(e) {
          if (xhr.status == 200 || xhr.status == 0) fncOfContentOrNull(xhr.responseText);
        }));
        var onFailure = (function() {
          fncOfContentOrNull(null);
        });
        xhr.addEventListener('error', onFailure, false);
        xhr.addEventListener('abort', onFailure, false);
        xhr.send();
      },
      addFileFromScriptElement: function(scriptElement, name, content) {
        var file = new SourceFile(name, content);
        file.scriptElement = scriptElement;
        this.addFile(file);
      },
      nextInlineScriptName_: function() {
        this.numberInlined_ += 1;
        if (!this.inlineScriptNameBase_) {
          var segments = this.url.split('.');
          segments.pop();
          this.inlineScriptNameBase_ = segments.join('.');
        }
        return this.inlineScriptNameBase_ + '_' + this.numberInlined_ + '.js';
      },
      addFilesFromScriptElements: function(scriptElements, onScriptsReady) {
        for (var i = 0, length = scriptElements.length; i < length; i++) {
          var scriptElement = scriptElements[i];
          if (!scriptElement.src) {
            var name = this.nextInlineScriptName_();
            var content = scriptElement.textContent;
            this.addFileFromScriptElement(scriptElement, name, content);
          } else {
            var name = scriptElement.src;
            this.asyncLoad_(name, this.addFileFromScriptElement.bind(this, scriptElement, name), onScriptsReady);
          }
        }
        if (this.numPending_ <= 0) onScriptsReady();
      },
      get reporter() {
        if (!this.reporter_) {
          this.reporter_ = new ErrorReporter();
        }
        return this.reporter_;
      },
      get compiler() {
        if (!this.compiler_) {
          this.compiler_ = new Compiler(this.reporter, this);
        }
        return this.compiler_;
      },
      compile: function() {
        var trees = this.compiler.compile_();
        if (this.reporter.hadError()) {
          console.warn('Traceur compilation errors', this.reporter);
          return;
        }
        return trees;
      },
      putFile: function(file) {
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-traceur-src-url', file.name);
        scriptElement.textContent = file.generatedSource;
        var parent = file.scriptElement.parentNode;
        parent.insertBefore(scriptElement, file.scriptElement || null);
      },
      putFiles: function(files) {
        files.forEach(this.putFile, this);
      },
      runInWebPage: function(trees) {
        var files = this.generateSourceFromTrees(trees);
        this.putFiles(files);
      },
      generateSourceFromTrees: function(trees) {
        return trees.keys().map((function(file) {
          var tree = trees.get(file);
          var opts = {showLineNumbers: false};
          file.generatedSource = TreeWriter.write(tree, opts);
          return file;
        }));
      },
      run: function() {
        document.addEventListener('DOMContentLoaded', (function() {
          var selector = 'script[type="text/traceur"]';
          var scripts = document.querySelectorAll(selector);
          if (!scripts.length) {
            return;
          }
          this.addFilesFromScriptElements(scripts, (function() {
            var trees = this.compile();
            this.runInWebPage(trees);
          }).bind(this));
        }).bind(this), false);
      }
    }, $__proto, $__super, true);
    return $WebPageProject;
  }(Project);
  return Object.preventExtensions(Object.create(null, {WebPageProject: {
      get: function() {
        return WebPageProject;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_util_TestErrorReporter_js = (function() {
  "use strict";
  var ErrorReporter = $__src_util_ErrorReporter_js.ErrorReporter;
  var TestErrorReporter = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $TestErrorReporter = ($__createClass)({
      constructor: function() {
        this.errors = [];
      },
      reportMessageInternal: function(location, kind, format, args) {
        if (kind !== 'error') return;
        this.errors.push(ErrorReporter.format(location, format, args));
      },
      hasMatchingError: function(expected) {
        return this.errors.some((function(error) {
          return error.indexOf(expected) !== - 1;
        }));
      }
    }, $__proto, $__super, true);
    return $TestErrorReporter;
  }(ErrorReporter);
  return Object.preventExtensions(Object.create(null, {TestErrorReporter: {
      get: function() {
        return TestErrorReporter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_outputgeneration_ProjectWriter_js = (function() {
  "use strict";
  var TreeWriter = $__src_outputgeneration_TreeWriter_js.TreeWriter;
  var ProjectWriter = function() {
    var $ProjectWriter = ($__createClassNoExtends)({constructor: function() {}});
    return $ProjectWriter;
  }();
  ProjectWriter.write = function(results, opt_options) {
    return results.keys().map((function(file) {
      return TreeWriter.write(results.get(file), opt_options);
    })).join('');
  };
  return Object.preventExtensions(Object.create(null, {ProjectWriter: {
      get: function() {
        return ProjectWriter;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_outputgeneration_SourceMapIntegration_js = (function() {
  "use strict";
  var base64 = this.sourceMapModule['base64'];
  var base64Vlq = this.sourceMapModule['base64-vlq'];
  var binarySearch = this.sourceMapModule['binary-search'];
  var util = this.sourceMapModule['util'];
  var SourceMapGenerator = this.sourceMapModule['source-map-generator'];
  var SourceMapConsumer = this.sourceMapModule['source-map-consumer'];
  var SourceNode = this.sourceMapModule['source-node'];
  return Object.preventExtensions(Object.create(null, {
    base64: {
      get: function() {
        return base64;
      },
      enumerable: true
    },
    base64Vlq: {
      get: function() {
        return base64Vlq;
      },
      enumerable: true
    },
    binarySearch: {
      get: function() {
        return binarySearch;
      },
      enumerable: true
    },
    util: {
      get: function() {
        return util;
      },
      enumerable: true
    },
    SourceMapGenerator: {
      get: function() {
        return SourceMapGenerator;
      },
      enumerable: true
    },
    SourceMapConsumer: {
      get: function() {
        return SourceMapConsumer;
      },
      enumerable: true
    },
    SourceNode: {
      get: function() {
        return SourceNode;
      },
      enumerable: true
    }
  }));
}).call(this);
var $__src_codegeneration_CloneTreeTransformer_js = (function() {
  "use strict";
  var ParseTreeTransformer = $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
  var $__9 = $__src_syntax_trees_ParseTrees_js, AtNameExpression = $__9.AtNameExpression, BindingIdentifier = $__9.BindingIdentifier, BreakStatement = $__9.BreakStatement, ContinueStatement = $__9.ContinueStatement, DebuggerStatement = $__9.DebuggerStatement, EmptyStatement = $__9.EmptyStatement, ExportSpecifier = $__9.ExportSpecifier, ExportStar = $__9.ExportStar, IdentifierExpression = $__9.IdentifierExpression, ImportSpecifier = $__9.ImportSpecifier, LiteralExpression = $__9.LiteralExpression, ModuleRequire = $__9.ModuleRequire, PredefinedType = $__9.PredefinedType, PropertyNameShorthand = $__9.PropertyNameShorthand, TemplateLiteralPortion = $__9.TemplateLiteralPortion, RestParameter = $__9.RestParameter, SuperExpression = $__9.SuperExpression, ThisExpression = $__9.ThisExpression;
  var CloneTreeTransformer = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $CloneTreeTransformer = ($__createClass)({
      constructor: function() {
        $__superCall(this, $__proto, "constructor", arguments);
      },
      transformAtNameExpression: function(tree) {
        return new AtNameExpression(tree.location, tree.atNameToken);
      },
      transformBindingIdentifier: function(tree) {
        return new BindingIdentifier(tree.location, tree.identifierToken);
      },
      transformBreakStatement: function(tree) {
        return new BreakStatement(tree.location, tree.name);
      },
      transformContinueStatement: function(tree) {
        return new ContinueStatement(tree.location, tree.name);
      },
      transformDebuggerStatement: function(tree) {
        return new DebuggerStatement(tree.location);
      },
      transformEmptyStatement: function(tree) {
        return new EmptyStatement(tree.location);
      },
      transformExportSpecifier: function(tree) {
        return new ExportSpecifier(tree.location, tree.lhs, tree.rhs);
      },
      transformExportStar: function(tree) {
        return new ExportStar(tree.location);
      },
      transformIdentifierExpression: function(tree) {
        return new IdentifierExpression(tree.location, tree.identifierToken);
      },
      transformImportSpecifier: function(tree) {
        return new ImportSpecifier(tree.location, tree.lhs, tree.rhs);
      },
      transformLiteralExpression: function(tree) {
        return new LiteralExpression(tree.location, tree.literalToken);
      },
      transformModuleRequire: function(tree) {
        return new ModuleRequire(tree.location, tree.url);
      },
      transformPredefinedType: function(tree) {
        return new PredefinedType(tree.location, tree.token);
      },
      transformPropertyNameShorthand: function(tree) {
        return new PropertyNameShorthand(tree.location, tree.name);
      },
      transformTemplateLiteralPortion: function(tree) {
        return new TemplateLiteralPortion(tree.location, tree.token);
      },
      transformRestParameter: function(tree) {
        return new RestParameter(tree.location, tree.identifer);
      },
      transformSuperExpression: function(tree) {
        return new SuperExpression(tree.location);
      },
      transformThisExpression: function(tree) {
        return new ThisExpression(tree.location);
      }
    }, $__proto, $__super, false);
    return $CloneTreeTransformer;
  }(ParseTreeTransformer);
  CloneTreeTransformer.cloneTree = function(tree) {
    return new CloneTreeTransformer().transformAny(tree);
  };
  return Object.preventExtensions(Object.create(null, {CloneTreeTransformer: {
      get: function() {
        return CloneTreeTransformer;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_codegeneration_module_ModuleRequireVisitor_js = (function() {
  "use strict";
  var ParseTreeVisitor = $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
  var canonicalizeUrl = $__src_util_url_js.canonicalizeUrl;
  var ModuleRequireVisitor = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $ModuleRequireVisitor = ($__createClass)({
      constructor: function(reporter) {
        $__superCall(this, $__proto, "constructor", []);
        this.urls_ = Object.create(null);
      },
      get requireUrls() {
        return Object.keys(this.urls_);
      },
      visitModuleRequire: function(tree) {
        this.urls_[canonicalizeUrl(tree.url.processedValue)] = true;
      }
    }, $__proto, $__super, true);
    return $ModuleRequireVisitor;
  }(ParseTreeVisitor);
  return Object.preventExtensions(Object.create(null, {ModuleRequireVisitor: {
      get: function() {
        return ModuleRequireVisitor;
      },
      enumerable: true
    }}));
}).call(this);
var $__src_runtime_modules_js = (function() {
  "use strict";
  var ArrayMap = $__src_util_ArrayMap_js.ArrayMap;
  var ModuleAnalyzer = $__src_semantics_ModuleAnalyzer_js.ModuleAnalyzer;
  var ModuleRequireVisitor = $__src_codegeneration_module_ModuleRequireVisitor_js.ModuleRequireVisitor;
  var ModuleSymbol = $__src_semantics_symbols_ModuleSymbol_js.ModuleSymbol;
  var ObjectMap = $__src_util_ObjectMap_js.ObjectMap;
  var Parser = $__src_syntax_Parser_js.Parser;
  var ProgramTransformer = $__src_codegeneration_ProgramTransformer_js.ProgramTransformer;
  var Project = $__src_semantics_symbols_Project_js.Project;
  var SourceFile = $__src_syntax_SourceFile_js.SourceFile;
  var TreeWriter = $__src_outputgeneration_TreeWriter_js.TreeWriter;
  var $__9 = $__src_util_url_js, canonicalizeUrl = $__9.canonicalizeUrl, resolveUrl = $__9.resolveUrl;
  var base = Object.freeze(Object.create(null, {
    Array: {value: Array},
    Boolean: {value: Boolean},
    Date: {value: Date},
    Error: {value: Error},
    EvalError: {value: EvalError},
    Function: {value: Function},
    JSON: {value: JSON},
    Math: {value: Math},
    Number: {value: Number},
    Object: {value: Object},
    RangeError: {value: RangeError},
    ReferenceError: {value: ReferenceError},
    RegExp: {value: RegExp},
    String: {value: String},
    SyntaxError: {value: SyntaxError},
    TypeError: {value: TypeError},
    URIError: {value: URIError},
    undefined: {value: void 0}
  }));
  var NOT_STARTED = 0;
  var LOADING = 1;
  var LOADED = 2;
  var PARSED = 3;
  var TRANSFORMED = 4;
  var COMPLETE = 5;
  var ERROR = 6;
  var CodeUnit = function() {
    var $CodeUnit = ($__createClassNoExtends)({
      constructor: function(loader, url, state) {
        this.loader = loader;
        this.url = url;
        this.state = state;
        this.uid = traceur.getUid();
        this.state_ = NOT_STARTED;
      },
      get state() {
        return this.state_;
      },
      set state(state) {
        if (state < this.state_) {
          throw new Error('Invalid state change');
        }
        this.state_ = state;
      },
      get reporter() {
        return this.loader.reporter;
      },
      get project() {
        return this.loader.project;
      },
      get tree() {
        return this.project.getParseTree(this.file);
      },
      get moduleSymbol() {
        return this.project.getRootModule();
      },
      addListener: function(callback, errback) {
        if (!this.listeners) {
          this.listeners = [];
        }
        this.listeners.push(callback, errback);
      },
      dispatchError: function(value) {
        this.dispatch_(value, 1);
      },
      dispatchComplete: function(value) {
        this.dispatch_(value, 0);
      },
      dispatch_: function(value, error) {
        var listeners = this.listeners;
        if (!listeners) {
          return;
        }
        listeners = listeners.concat();
        this.listeners = [];
        for (var i = error; i < listeners.length; i += 2) {
          var f = listeners[i];
          if (f) {
            f(value);
          }
        }
      },
      parse: function() {
        var reporter = this.reporter;
        var project = this.project;
        var url = this.url;
        var program = this.text;
        var file = new SourceFile(url, program);
        project.addFile(file);
        this.file = file;
        var parser = new Parser(reporter, file);
        var tree = parser.parseProgram(this.allowLoad);
        if (reporter.hadError()) {
          this.error = 'Parse error';
          return false;
        }
        project.setParseTree(file, tree);
        this.state = PARSED;
        return true;
      },
      transform: function() {
        return ProgramTransformer.transformFile(this.reporter, this.project, this.file);
      }
    });
    return $CodeUnit;
  }();
  var LoadCodeUnit = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $LoadCodeUnit = ($__createClass)({
      constructor: function(loader, url) {
        $__superCall(this, $__proto, "constructor", [loader, url, NOT_STARTED]);
        this.allowLoad = true;
      },
      get moduleSymbol() {
        return this.project.getModuleForUrl(this.url);
      },
      parse: function() {
        if (!$__superCall(this, $__proto, "parse", [])) {
          return false;
        }
        var project = this.loader.project;
        var tree = this.tree;
        var url = this.url;
        var moduleSymbol = new ModuleSymbol(null, null, tree, url);
        project.addExternalModule(moduleSymbol);
        return true;
      },
      transform: function() {
        return ProgramTransformer.transformFileAsModule(this.reporter, this.project, this.moduleSymbol, this.file);
      }
    }, $__proto, $__super, true);
    return $LoadCodeUnit;
  }(CodeUnit);
  var EvalCodeUnit = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $EvalCodeUnit = ($__createClass)({constructor: function(loader, code) {
        $__superCall(this, $__proto, "constructor", [loader, loader.url, LOADED]);
        this.text = code;
        this.allowLoad = false;
      }}, $__proto, $__super, true);
    return $EvalCodeUnit;
  }(CodeUnit);
  var EvalLoadCodeUnit = function($__super) {
    var $__proto = $__getProtoParent($__super);
    var $EvalLoadCodeUnit = ($__createClass)({constructor: function(loader, code) {
        CodeUnit.call(this, loader, loader.url, LOADED);
        this.text = code;
        this.allowLoad = true;
      }}, $__proto, $__super, true);
    return $EvalLoadCodeUnit;
  }(CodeUnit);
  var InternalLoader = function() {
    var $InternalLoader = ($__createClassNoExtends)({
      constructor: function(reporter, project) {
        this.reporter = reporter;
        this.project = project;
        this.cache = new ArrayMap();
        this.urlToKey = Object.create(null);
      },
      get url() {
        return this.project.url;
      },
      loadTextFile: function(url, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (xhr.status == 200 || xhr.status == 0) {
            callback(xhr.responseText);
          } else {
            errback();
          }
          xhr = null;
        };
        xhr.onerror = function() {
          errback();
        };
        xhr.open('GET', url, true);
        xhr.send();
        return xhr;
      },
      load: function(url) {
        url = resolveUrl(this.url, url);
        var codeUnit = this.getCodeUnit(url);
        if (codeUnit.state != NOT_STARTED || codeUnit.state == ERROR) {
          return codeUnit;
        }
        codeUnit.state = LOADING;
        var loader = this;
        var xhr = codeUnit.xhr = this.loadTextFile(url, function(text) {
          codeUnit.text = text;
          codeUnit.state = LOADED;
          loader.handleCodeUnitLoaded(codeUnit);
        }, function() {
          codeUnit.state = ERROR;
          loader.handleCodeUnitLoadError(codeUnit);
        });
        return codeUnit;
      },
      evalLoad: function(code) {
        var codeUnit = new EvalLoadCodeUnit(this, code);
        this.cache.set({}, codeUnit);
        return codeUnit;
      },
      eval: function(code) {
        var codeUnit = new EvalCodeUnit(this, code);
        this.cache.set({}, codeUnit);
        this.handleCodeUnitLoaded(codeUnit);
        return codeUnit;
      },
      getKey: function(url) {
        if (url in this.urlToKey) {
          return this.urlToKey[url];
        }
        return this.urlToKey[url] = {};
      },
      getCodeUnit: function(url) {
        var key = this.getKey(url);
        var cacheObject = this.cache.get(key);
        if (!cacheObject) {
          cacheObject = new LoadCodeUnit(this, url);
          this.cache.set(key, cacheObject);
        }
        return cacheObject;
      },
      areAll: function(state) {
        return this.cache.values().every((function(codeUnit) {
          return codeUnit.state >= state;
        }));
      },
      handleCodeUnitLoaded: function(codeUnit) {
        if (!codeUnit.parse()) {
          this.abortAll();
          return;
        }
        var requireVisitor = new ModuleRequireVisitor(this.reporter);
        requireVisitor.visit(codeUnit.tree);
        var baseUrl = codeUnit.url;
        codeUnit.dependencies = requireVisitor.requireUrls.map((function(url) {
          url = resolveUrl(baseUrl, url);
          return this.load(url);
        }).bind(this));
        if (this.areAll(PARSED)) {
          this.analyze();
          this.transform();
          this.evaluate();
        }
      },
      handleCodeUnitLoadError: function(codeUnit) {
        this.error = codeUnit.error = 'Failed to load \'' + codeUnit.url + '\'';
        this.abortAll();
      },
      abortAll: function() {
        this.cache.values().forEach((function(codeUnit) {
          if (codeUnit.xhr) {
            codeUnit.xhr.abort();
            codeUnit.state = ERROR;
          }
        }));
        this.cache.values().forEach((function(codeUnit) {
          codeUnit.dispatchError(codeUnit.error);
        }));
      },
      analyze: function() {
        var project = this.project;
        var dependencies = this.cache.values();
        var trees = [];
        var modules = [];
        for (var i = 0; i < dependencies.length; i++) {
          var codeUnit = dependencies[i];
          traceur.assert(codeUnit.state >= PARSED);
          if (codeUnit.state == PARSED) {
            trees.push(codeUnit.tree);
            modules.push(codeUnit.moduleSymbol);
          }
        }
        var analyzer = new ModuleAnalyzer(this.reporter, this.project);
        analyzer.analyzeModuleTrees(trees, modules);
        if (this.reporter.hadError()) {
          for (var i = 0; i < dependencies.length; i++) {
            var codeUnit = dependencies[i];
            if (codeUnit.state >= COMPLETE) {
              continue;
            }
            codeUnit.state = ERROR;
          }
          for (var i = 0; i < dependencies.length; i++) {
            var codeUnit = dependencies[i];
            if (codeUnit.state == ERROR) {
              codeUnit.dispatchError('Failed to analyze');
            }
          }
        }
      },
      transform: function() {
        var dependencies = this.cache.values();
        for (var i = 0; i < dependencies.length; i++) {
          var codeUnit = dependencies[i];
          if (codeUnit.state >= TRANSFORMED) {
            continue;
          }
          codeUnit.transformedTree = this.transformCodeUnit(codeUnit);
          codeUnit.state = TRANSFORMED;
        }
      },
      transformCodeUnit: function(codeUnit) {
        var results = codeUnit.transform();
        return results.get(codeUnit.file);
      },
      evaluate: function() {
        var visited = new ObjectMap();
        var ordered = [];
        function orderCodeUnits(codeUnit) {
          if (visited.has(codeUnit)) {
            return;
          }
          visited.set(codeUnit, true);
          codeUnit.dependencies.forEach(orderCodeUnits);
          ordered.push(codeUnit);
        }
        this.cache.values().forEach(orderCodeUnits);
        var dependencies = ordered;
        for (var i = 0; i < dependencies.length; i++) {
          var codeUnit = dependencies[i];
          if (codeUnit.state >= COMPLETE) {
            continue;
          }
          traceur.assert(currentCodeUnit === undefined);
          currentCodeUnit = codeUnit;
          var result;
          try {
            result = this.evalCodeUnit(codeUnit);
          } catch (ex) {
            codeUnit.error = ex.message;
            this.abortAll();
            return;
          } finally {
            traceur.assert(currentCodeUnit === codeUnit);
            currentCodeUnit = undefined;
          }
          codeUnit.result = result;
          codeUnit.transformedTree = null;
          codeUnit.text = null;
        }
        for (var i = 0; i < dependencies.length; i++) {
          var codeUnit = dependencies[i];
          if (codeUnit.state >= COMPLETE) {
            continue;
          }
          codeUnit.state = COMPLETE;
          codeUnit.dispatchComplete(codeUnit.result);
        }
      },
      evalCodeUnit: function(codeUnit) {
        return ('global', eval)("'use strict';" + TreeWriter.write(codeUnit.transformedTree));
      }
    });
    return $InternalLoader;
  }();
  var currentCodeUnit;
  var standardModuleUrlRegExp = /^@\w+$/;
  function getModuleInstanceByUrl(url) {
    if (standardModuleUrlRegExp.test(url)) return traceur.runtime.modules[url] || null;
    traceur.assert(currentCodeUnit);
    url = resolveUrl(currentCodeUnit.url, url);
    for (var i = 0; i < currentCodeUnit.dependencies.length; i++) {
      if (currentCodeUnit.dependencies[i].url == url) {
        return currentCodeUnit.dependencies[i].result;
      }
    }
    return null;
  }
  var CodeLoader = function() {
    var $CodeLoader = ($__createClassNoExtends)({
      constructor: function(reporter, project, parentLoader, opt_resolver) {
        this.internalLoader_ = new InternalLoader(reporter, project);
      },
      load: function(url, callback, opt_errback) {
        var codeUnit = this.internalLoader_.load(url);
        codeUnit.addListener(callback, opt_errback);
      },
      eval: function(program) {
        var codeUnit = this.internalLoader_.eval(program);
        return codeUnit.result;
      },
      evalLoad: function(program, callback, opt_errback) {
        var codeUnit = this.internalLoader_.evalLoad(program);
        codeUnit.addListener(callback, opt_errback);
        this.internalLoader_.handleCodeUnitLoaded(codeUnit);
      },
      import: function(moduleInstanceObject) {
        throw Error('Not implemented');
      },
      defineGlobal: function(name, value) {
        throw Error('Not implemented');
      },
      defineModule: function(name, moduleInstanceObject, opt_cacheKey) {
        throw Error('Not implemented');
      },
      create: function(moduleInstanceObject, opt_resolver) {
        var url = this.project_.url;
        var project = new Project(url);
        var loader = new CodeLoader(this.reporter, project, this, opt_resolver);
        return loader;
      },
      createBase: function() {
        return base;
      }
    });
    return $CodeLoader;
  }();
  var internals = (function() {
    return Object.preventExtensions(Object.create(null, {
      CodeUnit: {
        get: function() {
          return CodeUnit;
        },
        enumerable: true
      },
      EvalCodeUnit: {
        get: function() {
          return EvalCodeUnit;
        },
        enumerable: true
      },
      EvalLoadCodeUnit: {
        get: function() {
          return EvalLoadCodeUnit;
        },
        enumerable: true
      },
      InternalLoader: {
        get: function() {
          return InternalLoader;
        },
        enumerable: true
      },
      LoadCodeUnit: {
        get: function() {
          return LoadCodeUnit;
        },
        enumerable: true
      }
    }));
  }).call(this);
  ;
  return Object.preventExtensions(Object.create(null, {
    getModuleInstanceByUrl: {
      get: function() {
        return getModuleInstanceByUrl;
      },
      enumerable: true
    },
    CodeLoader: {
      get: function() {
        return CodeLoader;
      },
      enumerable: true
    },
    internals: {
      get: function() {
        return internals;
      },
      enumerable: true
    }
  }));
}).call(this);
var traceur = (function() {
  "use strict";
  var global = this;
  var traceurRuntime = global.traceur.runtime;
  var runtime = traceurRuntime;
  var options = $__src_options_js.options;
  function generateNameForUrl(url, commonPath) {
    return '$__' + url.replace(commonPath, '').replace(/[^\d\w$]/g, '_');
  }
  function getModuleForTesting(path) {
    return global[generateNameForUrl(("src/" + path), '')];
  }
  function assert(b) {
    if (!b && options.debug) throw Error('Assertion failed');
  }
  var uidCounter = 0;
  function getUid() {
    return ++uidCounter;
  }
  var semantics = (function() {
    var symbols = (function() {
      return Object.preventExtensions(Object.create(null, {Project: {
          get: function() {
            return $__src_semantics_symbols_Project_js.Project;
          },
          enumerable: true
        }}));
    }).call(this);
    return Object.preventExtensions(Object.create(null, {
      FreeVariableChecker: {
        get: function() {
          return $__src_semantics_FreeVariableChecker_js.FreeVariableChecker;
        },
        enumerable: true
      },
      ModuleAnalyzer: {
        get: function() {
          return $__src_semantics_ModuleAnalyzer_js.ModuleAnalyzer;
        },
        enumerable: true
      },
      VariableBinder: {
        get: function() {
          return $__src_semantics_VariableBinder_js.VariableBinder;
        },
        enumerable: true
      },
      symbols: {
        get: function() {
          return symbols;
        },
        enumerable: true
      }
    }));
  }).call(this);
  var util = (function() {
    return Object.preventExtensions(Object.create(null, {
      ErrorReporter: {
        get: function() {
          return $__src_util_ErrorReporter_js.ErrorReporter;
        },
        enumerable: true
      },
      MutedErrorReporter: {
        get: function() {
          return $__src_util_MutedErrorReporter_js.MutedErrorReporter;
        },
        enumerable: true
      },
      SourcePosition: {
        get: function() {
          return $__src_util_SourcePosition_js.SourcePosition;
        },
        enumerable: true
      },
      TestErrorReporter: {
        get: function() {
          return $__src_util_TestErrorReporter_js.TestErrorReporter;
        },
        enumerable: true
      },
      canonicalizeUrl: {
        get: function() {
          return $__src_util_url_js.canonicalizeUrl;
        },
        enumerable: true
      },
      resolveUrl: {
        get: function() {
          return $__src_util_url_js.resolveUrl;
        },
        enumerable: true
      },
      removeDotSegments: {
        get: function() {
          return $__src_util_url_js.removeDotSegments;
        },
        enumerable: true
      }
    }));
  }).call(this);
  var syntax = (function() {
    var TokenType = $__src_syntax_TokenType_js;
    var trees = (function() {
      var ParseTreeType = $__src_syntax_trees_ParseTreeType_js;
      return Object.preventExtensions(Object.create(null, {
        ArgumentList: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ArgumentList;
          },
          enumerable: true
        },
        ArrayComprehension: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ArrayComprehension;
          },
          enumerable: true
        },
        ArrayLiteralExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ArrayLiteralExpression;
          },
          enumerable: true
        },
        ArrayPattern: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ArrayPattern;
          },
          enumerable: true
        },
        ArrowFunctionExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ArrowFunctionExpression;
          },
          enumerable: true
        },
        AtNameDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.AtNameDeclaration;
          },
          enumerable: true
        },
        AtNameExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.AtNameExpression;
          },
          enumerable: true
        },
        AwaitStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.AwaitStatement;
          },
          enumerable: true
        },
        BinaryOperator: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.BinaryOperator;
          },
          enumerable: true
        },
        BindingElement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.BindingElement;
          },
          enumerable: true
        },
        BindingIdentifier: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.BindingIdentifier;
          },
          enumerable: true
        },
        Block: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.Block;
          },
          enumerable: true
        },
        BreakStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.BreakStatement;
          },
          enumerable: true
        },
        CallExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.CallExpression;
          },
          enumerable: true
        },
        CascadeExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.CascadeExpression;
          },
          enumerable: true
        },
        CaseClause: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.CaseClause;
          },
          enumerable: true
        },
        Catch: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.Catch;
          },
          enumerable: true
        },
        ClassDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ClassDeclaration;
          },
          enumerable: true
        },
        ClassExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ClassExpression;
          },
          enumerable: true
        },
        CommaExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.CommaExpression;
          },
          enumerable: true
        },
        ComprehensionFor: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ComprehensionFor;
          },
          enumerable: true
        },
        ConditionalExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ConditionalExpression;
          },
          enumerable: true
        },
        ContinueStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ContinueStatement;
          },
          enumerable: true
        },
        CoverFormals: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.CoverFormals;
          },
          enumerable: true
        },
        DebuggerStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.DebuggerStatement;
          },
          enumerable: true
        },
        DefaultClause: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.DefaultClause;
          },
          enumerable: true
        },
        DoWhileStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.DoWhileStatement;
          },
          enumerable: true
        },
        EmptyStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.EmptyStatement;
          },
          enumerable: true
        },
        ExportDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportDeclaration;
          },
          enumerable: true
        },
        ExportMapping: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportMapping;
          },
          enumerable: true
        },
        ExportMappingList: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportMappingList;
          },
          enumerable: true
        },
        ExportSpecifier: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportSpecifier;
          },
          enumerable: true
        },
        ExportSpecifierSet: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportSpecifierSet;
          },
          enumerable: true
        },
        ExportStar: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExportStar;
          },
          enumerable: true
        },
        ExpressionStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ExpressionStatement;
          },
          enumerable: true
        },
        Finally: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.Finally;
          },
          enumerable: true
        },
        ForInStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ForInStatement;
          },
          enumerable: true
        },
        ForOfStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ForOfStatement;
          },
          enumerable: true
        },
        ForStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ForStatement;
          },
          enumerable: true
        },
        FormalParameterList: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.FormalParameterList;
          },
          enumerable: true
        },
        FunctionDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.FunctionDeclaration;
          },
          enumerable: true
        },
        FunctionExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.FunctionExpression;
          },
          enumerable: true
        },
        GeneratorComprehension: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.GeneratorComprehension;
          },
          enumerable: true
        },
        GetAccessor: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.GetAccessor;
          },
          enumerable: true
        },
        IdentifierExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.IdentifierExpression;
          },
          enumerable: true
        },
        IfStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.IfStatement;
          },
          enumerable: true
        },
        ImportBinding: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ImportBinding;
          },
          enumerable: true
        },
        ImportDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ImportDeclaration;
          },
          enumerable: true
        },
        ImportSpecifier: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ImportSpecifier;
          },
          enumerable: true
        },
        ImportSpecifierSet: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ImportSpecifierSet;
          },
          enumerable: true
        },
        LabelledStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.LabelledStatement;
          },
          enumerable: true
        },
        LiteralExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.LiteralExpression;
          },
          enumerable: true
        },
        MemberExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.MemberExpression;
          },
          enumerable: true
        },
        MemberLookupExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.MemberLookupExpression;
          },
          enumerable: true
        },
        MissingPrimaryExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.MissingPrimaryExpression;
          },
          enumerable: true
        },
        ModuleDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ModuleDeclaration;
          },
          enumerable: true
        },
        ModuleDefinition: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ModuleDefinition;
          },
          enumerable: true
        },
        ModuleExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ModuleExpression;
          },
          enumerable: true
        },
        ModuleRequire: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ModuleRequire;
          },
          enumerable: true
        },
        ModuleSpecifier: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ModuleSpecifier;
          },
          enumerable: true
        },
        NameStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.NameStatement;
          },
          enumerable: true
        },
        NewExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.NewExpression;
          },
          enumerable: true
        },
        ObjectLiteralExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ObjectLiteralExpression;
          },
          enumerable: true
        },
        ObjectPattern: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ObjectPattern;
          },
          enumerable: true
        },
        ObjectPatternField: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ObjectPatternField;
          },
          enumerable: true
        },
        ParenExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ParenExpression;
          },
          enumerable: true
        },
        PostfixExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.PostfixExpression;
          },
          enumerable: true
        },
        PredefinedType: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.PredefinedType;
          },
          enumerable: true
        },
        Program: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.Program;
          },
          enumerable: true
        },
        PropertyMethodAssignment: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.PropertyMethodAssignment;
          },
          enumerable: true
        },
        PropertyNameAssignment: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.PropertyNameAssignment;
          },
          enumerable: true
        },
        PropertyNameShorthand: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.PropertyNameShorthand;
          },
          enumerable: true
        },
        RestParameter: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.RestParameter;
          },
          enumerable: true
        },
        ReturnStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ReturnStatement;
          },
          enumerable: true
        },
        SetAccessor: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.SetAccessor;
          },
          enumerable: true
        },
        SpreadExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.SpreadExpression;
          },
          enumerable: true
        },
        SpreadPatternElement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.SpreadPatternElement;
          },
          enumerable: true
        },
        SuperExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.SuperExpression;
          },
          enumerable: true
        },
        SwitchStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.SwitchStatement;
          },
          enumerable: true
        },
        TemplateLiteralExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.TemplateLiteralExpression;
          },
          enumerable: true
        },
        TemplateLiteralPortion: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.TemplateLiteralPortion;
          },
          enumerable: true
        },
        TemplateSubstitution: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.TemplateSubstitution;
          },
          enumerable: true
        },
        ThisExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ThisExpression;
          },
          enumerable: true
        },
        ThrowStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.ThrowStatement;
          },
          enumerable: true
        },
        TryStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.TryStatement;
          },
          enumerable: true
        },
        TypeName: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.TypeName;
          },
          enumerable: true
        },
        UnaryExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.UnaryExpression;
          },
          enumerable: true
        },
        VariableDeclaration: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.VariableDeclaration;
          },
          enumerable: true
        },
        VariableDeclarationList: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.VariableDeclarationList;
          },
          enumerable: true
        },
        VariableStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.VariableStatement;
          },
          enumerable: true
        },
        WhileStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.WhileStatement;
          },
          enumerable: true
        },
        WithStatement: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.WithStatement;
          },
          enumerable: true
        },
        YieldExpression: {
          get: function() {
            return $__src_syntax_trees_ParseTrees_js.YieldExpression;
          },
          enumerable: true
        },
        ParseTree: {
          get: function() {
            return $__src_syntax_trees_ParseTree_js.ParseTree;
          },
          enumerable: true
        },
        ParseTreeType: {
          get: function() {
            return ParseTreeType;
          },
          enumerable: true
        }
      }));
    }).call(this);
    return Object.preventExtensions(Object.create(null, {
      IdentifierToken: {
        get: function() {
          return $__src_syntax_IdentifierToken_js.IdentifierToken;
        },
        enumerable: true
      },
      LiteralToken: {
        get: function() {
          return $__src_syntax_LiteralToken_js.LiteralToken;
        },
        enumerable: true
      },
      Parser: {
        get: function() {
          return $__src_syntax_Parser_js.Parser;
        },
        enumerable: true
      },
      ParseTreeValidator: {
        get: function() {
          return $__src_syntax_ParseTreeValidator_js.ParseTreeValidator;
        },
        enumerable: true
      },
      ParseTreeVisitor: {
        get: function() {
          return $__src_syntax_ParseTreeVisitor_js.ParseTreeVisitor;
        },
        enumerable: true
      },
      Scanner: {
        get: function() {
          return $__src_syntax_Scanner_js.Scanner;
        },
        enumerable: true
      },
      SourceFile: {
        get: function() {
          return $__src_syntax_SourceFile_js.SourceFile;
        },
        enumerable: true
      },
      Token: {
        get: function() {
          return $__src_syntax_Token_js.Token;
        },
        enumerable: true
      },
      TokenType: {
        get: function() {
          return TokenType;
        },
        enumerable: true
      },
      trees: {
        get: function() {
          return trees;
        },
        enumerable: true
      }
    }));
  }).call(this);
  var outputgeneration = (function() {
    return Object.preventExtensions(Object.create(null, {
      ParseTreeMapWriter: {
        get: function() {
          return $__src_outputgeneration_ParseTreeMapWriter_js.ParseTreeMapWriter;
        },
        enumerable: true
      },
      ProjectWriter: {
        get: function() {
          return $__src_outputgeneration_ProjectWriter_js.ProjectWriter;
        },
        enumerable: true
      },
      SourceMapConsumer: {
        get: function() {
          return $__src_outputgeneration_SourceMapIntegration_js.SourceMapConsumer;
        },
        enumerable: true
      },
      SourceMapGenerator: {
        get: function() {
          return $__src_outputgeneration_SourceMapIntegration_js.SourceMapGenerator;
        },
        enumerable: true
      },
      TreeWriter: {
        get: function() {
          return $__src_outputgeneration_TreeWriter_js.TreeWriter;
        },
        enumerable: true
      }
    }));
  }).call(this);
  var codegeneration = (function() {
    var ParseTreeFactory = $__src_codegeneration_ParseTreeFactory_js;
    var module = (function() {
      return Object.preventExtensions(Object.create(null, {ModuleRequireVisitor: {
          get: function() {
            return $__src_codegeneration_module_ModuleRequireVisitor_js.ModuleRequireVisitor;
          },
          enumerable: true
        }}));
    }).call(this);
    return Object.preventExtensions(Object.create(null, {
      Compiler: {
        get: function() {
          return $__src_codegeneration_Compiler_js.Compiler;
        },
        enumerable: true
      },
      ModuleTransformer: {
        get: function() {
          return $__src_codegeneration_ModuleTransformer_js.ModuleTransformer;
        },
        enumerable: true
      },
      ParseTreeTransformer: {
        get: function() {
          return $__src_codegeneration_ParseTreeTransformer_js.ParseTreeTransformer;
        },
        enumerable: true
      },
      ProgramTransformer: {
        get: function() {
          return $__src_codegeneration_ProgramTransformer_js.ProgramTransformer;
        },
        enumerable: true
      },
      CloneTreeTransformer: {
        get: function() {
          return $__src_codegeneration_CloneTreeTransformer_js.CloneTreeTransformer;
        },
        enumerable: true
      },
      ParseTreeFactory: {
        get: function() {
          return ParseTreeFactory;
        },
        enumerable: true
      },
      parseExpression: {
        get: function() {
          return $__src_codegeneration_PlaceholderParser_js.parseExpression;
        },
        enumerable: true
      },
      parseStatement: {
        get: function() {
          return $__src_codegeneration_PlaceholderParser_js.parseStatement;
        },
        enumerable: true
      },
      module: {
        get: function() {
          return module;
        },
        enumerable: true
      }
    }));
  }).call(this);
  var $__9 = $__src_runtime_modules_js, internals = $__9.internals, getModuleInstanceByUrl = $__9.getModuleInstanceByUrl, CodeLoader = $__9.CodeLoader;
  runtime.internals = internals;
  runtime.getModuleInstanceByUrl = getModuleInstanceByUrl;
  runtime.CodeLoader = CodeLoader;
  return Object.preventExtensions(Object.create(null, {
    runtime: {
      get: function() {
        return runtime;
      },
      enumerable: true
    },
    options: {
      get: function() {
        return options;
      },
      enumerable: true
    },
    generateNameForUrl: {
      get: function() {
        return generateNameForUrl;
      },
      enumerable: true
    },
    getModuleForTesting: {
      get: function() {
        return getModuleForTesting;
      },
      enumerable: true
    },
    assert: {
      get: function() {
        return assert;
      },
      enumerable: true
    },
    getUid: {
      get: function() {
        return getUid;
      },
      enumerable: true
    },
    WebPageProject: {
      get: function() {
        return $__src_WebPageProject_js.WebPageProject;
      },
      enumerable: true
    },
    semantics: {
      get: function() {
        return semantics;
      },
      enumerable: true
    },
    util: {
      get: function() {
        return util;
      },
      enumerable: true
    },
    syntax: {
      get: function() {
        return syntax;
      },
      enumerable: true
    },
    outputgeneration: {
      get: function() {
        return outputgeneration;
      },
      enumerable: true
    },
    codegeneration: {
      get: function() {
        return codegeneration;
      },
      enumerable: true
    }
  }));
}).call(this);
