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
        , 'select2.png'
        , 'select2x2.png'
        , 'spinner.gif'
        , 'offline.appcache'
        , '404.html'
        ]
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , zlib = require('zlib')
    , Q = require('q')
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
        { var ext = /\.([^.]+)$/.exec(urlPath)[1]
            , type = contentTypes[ext]
            , gzip = accept && accept.match(/\bgzip\b/) && type[1] && 'gzip'
            , cache = gzip ? zcache : cache
        ; urlPath = path.normalize(urlPath)
        ; response.setHeader('Content-Type', type[0])
        ; if (gzip) response.setHeader('Content-Encoding', 'gzip')
        ; cache[urlPath].then(function(val)
            { response.end(val)
            })
        }

; files.forEach(function(file)
    { var data = Q.defer()
        , zdata = Q.defer()
    ; cache[file] = data.promise
    ; zcache[file] = zdata.promise
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

; http.createServer(function(request, response)
    { var urlPath = path.normalize(parseUrl(request.url).pathname).slice(1)
    ; if (urlPath && !cache[urlPath] || urlPath === '404.html' || urlPath === 'docs.html')
        { response.statusCode = 404
        ; sendFile(cache, '404.html', response, request.headers['accept-encoding'])
        }
      else
        { response.statusCode = 200
        ; sendFile(cache, urlPath || 'docs.html', response, request.headers['accept-encoding'])
        }
    })
    .listen(process.env.PORT || 5000, '0.0.0.0')
