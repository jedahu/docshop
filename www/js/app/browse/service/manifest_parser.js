define(function() {

return {
  parse: function(manifest)
  { this._manifest = JSON.parse(manifest)
  ; this._manifest.fileMap = {}
  ; this.normalizeLanguages()
  ; this.normalizeFiles(this._manifest.files, this._manifest.prefix || '')
  ; return this._manifest
  }

, normalizeLang: function(lang)
  { if (lang.constructor === Array)
    { return {open: lang[0], middle: lang[1], close: lang[2], name: lang[3]}
    }
    return lang
  }

, normalizeLanguage: function(lang, syntax)
  { if (syntax.constructor === Array)
    { var norm = this.normalizeLang(syntax)
    ; norm.name = lang
    ; return norm
    }
    if (!syntax.name) syntax.name = lang
  ; return syntax
  }

, normalizeLanguages: function()
  { var map = this._manifest.languages
      , langs = Object.keys(map)
      , lang = null
      , i = null
  ; for (i in langs)
    { lang = langs[i]
    ; map[lang] = this.normalizeLanguage(lang, map[lang])
    }
  }

, isPair: function(obj)
  { return obj instanceof Object && Object.keys(obj).length === 1
  }

, pair: function(obj)
  { var key = Object.keys(obj)[0]
  ; return [key, obj[key]]
  }

, normalizeFile1: function(file)
  { var norm
      , pair
  ; if (file.constructor === String)
    { return {name: file, path: file}
    }
  ; if (this.isPair(file) && this.pair(file)[0] !== 'name')
    {
    ; pair = this.pair(file)
    ; if (pair[1].constructor === String)
      { return {name: pair[0], path: pair[1]}
      }
    ; norm = pair[1]
    ; norm.name = pair[0]
    ; return norm
    }
  ; return file
  }

, langFromExt: function(path)
  { var match = path.match(/\.([^.]+)$/)
      , ext = match && match[1]
  ; if (ext)
    { return this._manifest.languages[this._manifest.extensions[ext]]
    }
  ; return null
  }

, normalizeFile: function(file, prefix)
  { var norm = this.normalizeFile1(file)
  ; norm.markup = norm.markup || this._manifest.markup
  ; if (!norm.path) norm.path = norm.name
  ; if (prefix && norm.path[0] !== '/') norm.path = prefix + norm.path
  ; if (norm.path[0] === '/') norm.path = norm.path.slice(1)
  ; if (!norm.lang)
    { norm.lang = this.langFromExt(norm.path) || null
    }
    else if (norm.lang.constructor === String)
    { norm.lang = this._manifest.languages[norm.lang]
    }
    else if (norm.lang.constructor === Array)
    { norm.lang = this.normalizeLang(norm.lang)
    }
  ; this._manifest.fileMap[norm.path] = norm
  ; return norm
  }

, normalizeFiles: function(items, prefix)
  { var self = this
      , isSubList = function(x)
        { return self.isPair(x) && self.pair(x)[1].constructor === Array
        }
      , i
      , item
      , match
      , newPrefix
      , subPrefix
      , heading
      , subList
      , subItems
  ; for (i in items)
    { item = items[i]
    ; if (isSubList(item))
      { match = this.pair(item)[0].match(/(.+?)\s*@(.+)/)
      ; heading = match[1]
      ; subPrefix = match[2]
      ; subItems = this.pair(item)[1]
      ; subList = {}
      ; subList[heading] = subItems
      ; items[i] = subList
      ; newPrefix =
            subPrefix[0] === '/'
          ? subPrefix.slice(1)
          : prefix + subPrefix
      ; this.normalizeFiles(subItems, newPrefix)
      }
      else
      { items[i] = this.normalizeFile(item, prefix)
      }
    }
  }

, service: function()
  { return function(str)
    { return Object.create(this).parse(str)
    }
    . bind(this)
  }
}

});
