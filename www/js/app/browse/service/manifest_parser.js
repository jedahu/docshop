//define(['lib/js-yaml'], function(jsyaml) {
; export const manifestParser =
    { parse: function(manifest)
        { this._manifest = jsyaml.load(manifest)
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
            { const norm = this.normalizeLang(syntax)
            ; norm.name = lang
            ; return norm
            }
          if (!syntax.name) syntax.name = lang
        ; return syntax
        }

    , normalizeLanguages: function()
        { const map = this._manifest.languages
        ; const langs = Object.keys(map)
        ; for (const lang of langs)
            { map[lang] = this.normalizeLanguage(lang, map[lang])
            }
        }

    , isPair: function(obj)
        { return obj instanceof Object && Object.keys(obj).length === 1
        }

    , pair: function(obj)
        { const key = Object.keys(obj)[0]
        ; return [key, obj[key]]
        }

    , normalizeFile1: function(file)
        { if (file.constructor === String)
            { return {name: file, path: file}
            }
        ; if (this.isPair(file) && this.pair(file)[0] !== 'name')
            {
            ; const pair = this.pair(file)
            ; if (pair[1].constructor === String)
                { return {name: pair[0], path: pair[1]}
                }
            ; const norm = pair[1]
            ; norm.name = pair[0]
            ; return norm
            }
        ; return file
        }

    , langFromExt: function(path)
        { const match = path.match(/\.([^.]+)$/)
        ; const ext = match && match[1]
        ; if (ext)
            { return this._manifest.languages[this._manifest.extensions[ext]]
            }
        ; return null
        }

    , normalizeFile: function(file, prefix)
        { const norm = this.normalizeFile1(file)
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
        { const isSubList = (x) =>
            this.isPair(x) && this.pair(x)[1].constructor === Array
        ; for (const i in items)
            { const item = items[i]
            ; if (isSubList(item))
                { const match = this.pair(item)[0].match(/(.+?)\s*@(.+)/)
                ; const heading = match[1]
                ; const subPrefix = match[2]
                ; const subItems = this.pair(item)[1]
                ; const subList = {}
                ; subList[heading] = subItems
                ; items[i] = subList
                ; const newPrefix =
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
    }

; export const manifestParserService = () =>
    (str) => Object.create(manifestParser).parse(str)
