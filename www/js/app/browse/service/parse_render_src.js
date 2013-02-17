; import HTMLOutline from '/util/HTMLOutliner.js'
; import htmlVar from '/util/html_var.js'

; export const parseRenderSrcService =
    ($q, $http, $rootScope, $timeout, $injector, srcParser) =>
      (repo, file) =>
        parseRenderSrc($q, $http, $rootScope, $timeout, $injector, srcParser, repo, file)

; const processResult = (html, meta) =>
    { const wrapper = angular.element('<div>')
    ; let idCount = 0
    ; wrapper.html(html)
    ; HTMLOutline(wrapper[0])
    ; const elems = wrapper.find('pre > code')
    ; for (let i = 0; i < elems.length; ++i)
        { const elem = elems[i]
        ; if (elem.innerHTML.match(/^(?:\s*\n)*$/))
            { elem.remove()
            ; continue
            }
        ; elem.innerHTML = elem.innerHTML
            .replace(/^(?:\s*\n)*/, '')
            .replace(/(?:\n\s*)*$/, '')
        }
    ; const names = [].map.call
        ( wrapper.find('[id^="name:"]')
        , (elm) => elm.getAttribute('id').slice('name:'.length)
        )
        .sort()
    ; const toc = [].slice.call(wrapper.find('h1,h2,h3,h4'), 0)
    ; toc.forEach((h) =>
        { if (!h.id)
            { h.id = 'ds-h-' + idCount++
            }
        })
    ; return (
        { html: wrapper
        , names: names
        , toc: toc
        , meta: meta || {}
        })
    }

; const parseMeta = (text) =>
    { const matcher =
        /^(\S+)\s+!meta\b.*\n([\s\S]*?\n)(\s*\S*?)\s*?\.\.\.\n(\S+)/
    ; const [_, open, content, middle, close] = matcher.exec(text) || []
    ; if (!_) return null
    ; const metaStr = ''
    ; for (let line of content.split(/\n/))
        { metaStr += line.slice(middle.length) + '\n'
        }
    ; const meta = jsyaml.load(metaStr)
    ; meta.lang =
        { name: meta.lang
        , open
        , middle
        , close
        }
    ; return meta
    }

; const readFile = (repo, file) =>
    repo.readFile(file.path).then((text) =>
      { const meta = parseMeta(text)
      ; if (meta)
          { file.meta = meta
          ; file = Object.create(file)
          ; if (meta.lang) meta.lang.name = meta.lang.name || file.lang.name
          ; file.lang = meta.lang || file.lang
          ; file.markup = file.markup || meta.markup
          }
      ; file.text = text
      ; return file
      })

; const jobs = []

; const parseRenderSrc =
    ($q, $http, $rootScope, $timeout, $injector, srcParser, repo, file) =>
      readFile(repo, file).then((file) =>
        { const parser = srcParser(file.lang, file.text)
        ; let html = ''
        ; const renderer = $injector.get(file.markup + 'Renderer')
        ; const render = (...args) =>
            { try
                { return renderer(...args)
                }
              catch(e)
                { parser.events.offAll()
                ; $rootScope.$broadcast('renderer-error', file, e)
                }
            }
        ; const handle = (evt, ...args) =>
            { switch (evt)
                { case 'html'
                    : html += args[0]
                    ; break
                  case 'comment'
                    : html += render(...args)
                    ; break
                  case 'end'
                    : parser.events.offAll()
                    ; $rootScope.$broadcast
                        ( 'renderer-result'
                        , file
                        , processResult(html, file.meta)
                        )
                    ; break
                }
            }
        ; while (jobs.length > 0)
            { let job = jobs.pop()
            ; job.parser.events.offAll()
            ; $rootScope.$broadcast('renderer-cancel', file)
            }
        ; jobs.push({parser, file})
        ; parser.events.onAll(handle)
        ; $timeout
            ( () => $rootScope.$broadcast('renderer-timeout', file)
            , 10000 // TODO parameterise
            )
        ; parser.parse().then(null, (err) =>
            { $rootScope.$broadcast('parser-error', file, err)
            })
        })

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope', '$timeout', '$injector', 'srcParser']

; export module _test
    { export processResult
    ; export parseMeta
    ; export readFile
    }
