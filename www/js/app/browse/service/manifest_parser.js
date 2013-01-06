define(Object.freeze(

{ normalizeExt: function(ext)
  { if (ext.constructor === Array)
    { return {lang: ext[0], comment: ext.slice(1)}
    }
  ; return ext
  }

, normalizeExtensions: function(exts)
  { var norm = {}
      , keys = Object.keys(exts)
      , i = null
  ; for (i in keys)
    { norm[keys[i]] = this.normalizeExt(exts[keys[i]])
    }
  ; return norm
  }

, normalizeFile: function(file)
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

, normalizeFiles: function(files)
  { var map = {}
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
      { norm1 = this.normalizeFile(paths[k])
      ; sublist.push(norm1)
      ; map[norm1.path] = norm1
      }
    }
  ; return {map: map, list: list}
  }

, parse: function(str)
  { var j = JSON.parse(str)
      , x = this.normalizeFiles(j.files)
  ; j.extensions = this.normalizeExtensions(j.extensions)
  ; j.files = x.list
  ; j.fileMap = x.map
  ; return j
  }

}));
