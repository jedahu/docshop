/* !meta
{ "title": "A simple dev server"
, "author": "Jeremy Hughes <jedahu@gmail.com>"
, "date": "2013-01
}
*/
; var http = require('http')
    , fs = require('fs')
    , parseUrl = require('url').parse
    , appPath = 'www/docs.html'
    , contentTypes =
        { 'css': ['text/css', 'utf8']
        , 'js': ['text/javascript', 'utf8']
        , 'png': ['image/png', null]
        , 'gif': ['image/gif', null]
        , 'html': ['text/html', 'utf8']
        }
    , sendFile = function(path, response)
      { var ext = /\.([^.]+)$/.exec(path)[1]
          , type = contentTypes[ext]
      ; response.writeHead(200, {'Content-Type': type[0]})
      ; fs.createReadStream(path, {encoding: type[1]}).pipe(response)
      }
    , sendApp = sendFile.bind(null, appPath)

; http.createServer
    ( function(request, response)
      { var path = 'www' + parseUrl(request.url).pathname
      ; fs.exists(path, function(exists)
          { if (exists)
            { fs.stat(path, function(err, stats)
                { if (err || !stats.isFile())
                  { sendApp(response)
                  }
                  else
                  { sendFile(path, response)
                  }
                })
            }
            else
            { sendApp(response)
            }
          })
      }
    )
  . listen(process.env.PORT || 5000, '0.0.0.0')
