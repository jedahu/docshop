module.exports = function(grunt)

{ var md5sum = require('MD5')
    , fs = require('fs')

; var bustCache = function(url)
    { return url + '?z=' + md5sum(fs.readFileSync('dist/' + url, 'utf8'))
    }

; grunt.initConfig(
    { stylus:
        { compile:
            { options:
                { 'include css': true
                }
            , files:
                { 'dist/main.css': 'www/css/browse.styl'
                }
            }
        }
    , copy:
        { dist:
            { files:
                [ { dest: 'dist/'
                  , src:
                      [ 'www/package.json'
                      , 'www/worker/**'
                      ]
                  , flatten: true
                  }
                , { 'dist/':
                      [ 'www/css/*.png'
                      , 'www/css/*.gif'
                      ]
                  }
                ]
            }
        }
    , clean:
        { dist: 'dist'
        }
    , concat:
        { js:
            { src:
                [ 'www/js/lib/jquery.js'
                , 'www/js/lib/jquery-ui.js'
                , 'www/js/lib/select2.js'
                , 'www/js/lib/angular.js'
                , 'www/js/lib/angular-sanitize.js'
                , 'www/js/lib/angular-ui.js'
                , 'www/js/lib/js-yaml.js'
                , 'www/js/lib/runtime.js'
                , 'tmp/compiled.js'
                ]
            , dest: 'dist/main.js'
            }
        }
    , template:
        { index:
            { src: 'www/docs.html'
            , dest: 'dist/docs.html'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        , cachefile:
            { src: 'www/offline.appcache'
            , dest: 'dist/offline.appcache'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        }
    , watch:
        { css:
            { files:
                [ 'www/css/*‥css'
                , 'www/css/*.styl'
    ]
            , tasks: ['stylus']
            }
        , js:
            { files: 'www/js/app/**/*.js'
            , tasks: ['traceur concat:js']
            }
        , copy:
            { files:
                [ 'www/css/*.png'
                , 'www/css/*.gif'
                , 'www/package.json'
                , 'www/worker/**/*.js'
                ]
            , tasks: ['copy']
            }
        , template:
            { files:
                [ 'www/docs.html'
                , 'www/offline.appcache'
                ]
            , tasks: ['template']
            }
        }
    })

; grunt.loadNpmTasks('grunt-stylus')
; grunt.loadNpmTasks('grunt-contrib-copy')
; grunt.loadNpmTasks('grunt-clean')
; grunt.loadNpmTasks('grunt-contrib-watch')
; grunt.loadNpmTasks('grunt-templater')

; grunt.registerTask('traceur', function()
    { var done = this.async()
    ; var spawn = require('child_process').spawn
    ; var proc = spawn
        ( 'node'
        , [ './traceur/filecompiler.js'
          , '--inline-modules'
          , '--freeVariableChecker=false'
          , 'www/js/app/start_nw.js'
          , 'tmp/compiled.js'
          ]
        )
    ; proc.stdout.setEncoding('utf8')
    ; proc.stderr.setEncoding('utf8')
    ; proc.stdout.on('data', function(data) {process.stdout.write(data)})
    ; proc.stderr.on('data', function(data) {process.stderr.write(data)})
    ; proc.on('exit', function(code) {done(!code)})
    })

; grunt.registerTask('run', function()
    { var spawn = require('child_process').spawn
    ; spawn('nw', ['dist'])
    })

; grunt.registerTask('default', 'stylus traceur concat:js copy template')

};
