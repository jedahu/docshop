define(Object.freeze(

{ normalizeLanguage: function(lang, syntax)
  { if (syntax.constructor === Array)
    { return {open: syntax[0], middle: syntax[1], close: syntax[2], lang: lang}
    }
    if (!syntax.lang) syntax.lang = lang
  ; return syntax
  }

, normalizeLanguages: function(manifest)
  { var map = manifest.languages
      , norm = {}
      , langs = Object.keys(map)
      , lang = null
      , i = null
  ; for (i in langs)
    { lang = langs[i]
    ; norm[lang] = this.normalizeLanguage(lang, map[lang])
    }
  ; return norm
  }

, normalizeFile1: function(file)
  { if (file.constructor === String)
    { return {name: file, path: file}
    }
  ; if (file[1].constructor === String)
    { return {name: file[0], path: file[1]}
    }
  ; if (file[1].path == null || file[1].path == undefined)
    { file[1].path = file[0]
    }
  ; file[1].name = file[0]
  ; return file[1]
  }

, langFromExt: function(exts, path)
  { var match = path.match(/\.([^.]+)$/)
      , ext = match && match[1]
  ; if (ext)
    { return exts[ext]
    }
  ; return null
  }

, normalizeFile: function(file, manifest)
  { var norm = this.normalizeFile1(file)
  ; norm.markup = norm.markup || manifest.markup
  ; if (!norm.lang)
    { norm.lang = this.langFromExt(manifest.extensions, norm.path)
    }
    else if (norm.lang.constructor === String)
    { norm.lang = manifest.languages[norm.lang]
    }
  ; return norm
  }

, normalizeFiles: function(manifest)
  { var files = manifest.files
      , map = {}
      , list = []
      , sublist = null
      , i = null
      , k = null
      , val = null
      , norm1 = null
      , heading = null
      , paths = null
  ; for (i in files)
    { val = files[i]
    ; heading = val[0]
    ; paths = val.slice(1)
    ; sublist = [heading]
    ; list.push(sublist)
    ; for (k in paths)
      { norm1 = this.normalizeFile(paths[k], manifest)
      ; sublist.push(norm1)
      ; map[norm1.path] = norm1
      }
    }
  ; return {map: map, list: list}
  }

, parse: function(str)
  { var j = JSON.parse(str)
      , l = null
      , x = null
  ; if (!j.languages) j.languages = {}
  ; if (!j.extensions) j.extensions = {}
  ; j.languages = this.normalizeLanguages(j)
  ; x = this.normalizeFiles(j)
  ; j.files = x.list
  ; j.fileMap = x.map
  ; return j
  }

}));
