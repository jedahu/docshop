/* !meta
{ "title": "A simple dev server"
, "author": "Jeremy Hughes <jedahu@gmail.com>"
, "date": "2013-01
}
*/
; var files =
        [ 'docs.html'
        , 'main.js'
        , 'main.css'
        , 'lib.js'
        , 'select2.png'
        , 'select2x2.png'
        , 'spinner.gif'
        , 'offline.appcache'
        , '404.html'
        ]
    , grunt = require('grunt')
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , zlib = require('zlib')
    , Q = require('q')
    , fork = require('child_process').fork
    , parseUrl = require('url').parse
    , contentTypes =
        { 'css': ['text/css', 'utf8']
        , 'js': ['text/javascript', 'utf8']
        , 'png': ['image/png', null]
        , 'gif': ['image/gif', null]
        , 'html': ['text/html', 'utf8']
        , 'appcache': ['text/cache-manifest', 'utf8']
        }
    , cache = {}
    , zcache = {}
    , sendFile = function(cache, urlPath, response, accept)
        { var code = urlPath === '404.html' ? 404 : 200
            , ext = /\.([^.]+)$/.exec(urlPath)[1]
            , type = contentTypes[ext]
            , gzip = accept && accept.match(/\bgzip\b/) && type[1] && 'gzip'
            , cache = gzip ? zcache : cache
            , headers = {'Content-Type': type[0]}
        ; urlPath = path.normalize(urlPath)
        ; if (gzip) headers['Content-Encoding'] = 'gzip'
        ; response.writeHead(code, headers)
        ; response._send('', 'utf8')
        ; cache[urlPath].promise.then(function(val)
            { response.end(val)
            })
        }

; files.forEach(function(file)
    { cache[file] = Q.defer()
    ; zcache[file] = Q.defer()
    })

; fork('./grunt', ['all:min']).on('exit', function()
    { files.forEach(function(file)
        { var data = cache[file]
            , zdata = zcache[file]
        ; fs.readFile('dist/' + file, function(err, val)
            { if (err)
                { data.reject(err)
                }
              else
                { data.resolve(val)
                }
            })
        ; data.promise
            .then(function(val)
              { zlib.gzip(val, function(err, zval)
                  { if (err)
                      { zdata.reject(err)
                      }
                    else
                      { zdata.resolve(zval)
                      }
                  })
              return zdata.promise
              })
            .then
              ( function(zval)
                  {
                  }
              , function(err)
                  { console.log(err)
                  ; process.exit(1)
                  }
              )
        })
    })

; http.createServer(function(request, response)
    { var urlPath = path.normalize(parseUrl(request.url).pathname).slice(1)
    ; if (urlPath && !cache[urlPath] || urlPath === '404.html' || urlPath === 'docs.html')
        { sendFile(cache, '404.html', response, request.headers['accept-encoding'])
        }
      else
        { sendFile(cache, urlPath || 'docs.html', response, request.headers['accept-encoding'])
        }
    })
    .listen(process.env.PORT || 5000, '0.0.0.0')
