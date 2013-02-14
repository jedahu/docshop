module.exports = function(grunt)

{ var md5sum = require('MD5')
    , fs = require('fs')
    , path = require('path')
    , cp = require('child_process')
    , root = process.cwd()

; var bustCache = function(url)
    { return url
        + '?z='
        + md5sum(fs.readFileSync(path.resolve(root, 'dist', url)))
    }

; var runTasks = function()
    { grunt.task.run(Array.prototype.filter.call(arguments, function(task) {return !!task}))
    }

; var commonArgs = function(argsObj)
    { var args = Array.prototype.slice.call(argsObj)
    ; return (
        { min: args.indexOf('min') > -1
        , nw: args.indexOf('nw') > -1
        , gzip: args.indexOf('gzip') > -1
        })
    }

; var spawn = function(task, cmd, args)
    { var done = task.async()
    ; fs.mkdir('tmp')
    ; var proc = cp.spawn(cmd, args)
    ; proc.stdout.setEncoding('utf8')
    ; proc.stderr.setEncoding('utf8')
    ; proc.stdout.on('data', function(data) {process.stdout.write(data)})
    ; proc.stderr.on('data', function(data) {process.stderr.write(data)})
    ; proc.on('exit', function(code) {done(!code)})
    }

; grunt.initConfig(
    { stylus:
        { compile:
            { options:
                { 'include css': true
                , compress: true
                }
            , files:
                { 'dist/main.css': 'www/css/browse.styl'
                }
            }
        }
    , copy:
        { package:
            { files:
                [ { dest: 'dist/'
                  , src: ['package.json']
                  , cwd: 'www/'
                  , expand: true
                  }
                ]
            }
        , worker:
            { files:
                [ { dest: 'dist/'
                  , src: ['worker/**/*.js']
                  , cwd: 'www/'
                  , expand: true
                  }
                ]
            }
        , css:
            { files:
                [ { dest: 'dist/'
                  , src: ['*.png', '*.gif']
                  , cwd: 'www/css/'
                  , expand: true
                  }
                ]
            }
        , source_map:
            { files:
                [ { dest: 'dist/main.map'
                  , src: ['tmp/main.map']
                  }
                ]
            }
        , unuglified_js:
            { files:
                [ { dest: 'dist/'
                  , src: ['main.js', 'lib.js']
                  , cwd: 'tmp/'
                  , expand: true
                  }
                ]
            }
        }
    , clean: ['dist', 'tmp']
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
                , 'www/js/lib/evilstreak_markdown.js'
                , 'www/js/lib/runtime.js'
                ]
            , dest: 'tmp/lib.js'
            }
        }
    , uglify:
        { js:
            { files:
                { 'dist/main.js': 'tmp/main.js'
                , 'dist/lib.js': 'tmp/lib.js'
                }
            }
        }
    , compress:
        { html:
            { options:
                { mode: 'gzip'
                , archive: 'dist/docs.html.gz'
                }
            , files: {src: 'dist/docs.html'}
            }
        , not_found:
            { options:
                { mode: 'gzip'
                , archive: 'dist/404.html.gz'
                }
            , files: {src: 'dist/404.html'}
            }
        , js:
            { options:
                { mode: 'gzip'
                , archive: 'dist/main.js.gz'
                }
            , files: {src: 'dist/main.js'}
            }
        , css:
            { options:
                { mode: 'gzip'
                , archive: 'dist/main.css.gs'
                }
            , files: {src: 'dist/main.css'}
            }
        , appcache:
            { options:
                { mode: 'gzip'
                , archive: 'dist/offline.appcache.gz'
                }
            , files: {src: 'dist/offline.appcache'}
            }
        }
    , template:
        { html:
            { src: 'www/docs.html'
            , dest: 'dist/docs.html'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        , not_found:
            { src: 'www/404.html'
            , dest: 'dist/404.html'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        , appcache:
            { src: 'www/offline.appcache'
            , dest: 'dist/offline.appcache'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        }
    , traceur:
        { main_nw:
            { in: 'www/js/app/start_nw.js'
            , out: 'tmp/main.js'
            , root: 'www/js/app'
            , sourceMapPrefix: '../'
            }
        , main_browser:
            { in: 'www/js/app/start_browser.js'
            , out: 'tmp/main.js'
            , root: 'www/js/app'
            , sourceMapPrefix: '../'
            }
        , test:
            { in: 'test/all.js'
            , out: 'tmp/test.js'
            , root: 'www/js/app'
            , sourceMapPrefix: '../'
            }
        }
    , watch:
        { css:
            { files:
                [ 'www/css/*‥css'
                , 'www/css/*.styl'
                , 'www/css/*.png'
                , 'www/css/*.gif'
                ]
            , options: {interrupt: true}
            , tasks: 'css'
            }
        , js:
            { files: 'www/**/*.js'
            , options: {interrupt: true}
            , tasks: 'js:nw'
            }
        , package:
            { files: 'www/package.json'
            , options: {interrupt: true}
            , tasks: 'copy:package'
            }
        , html:
            { files: 'www/docs.html'
            , options: {interrupt: true}
            , tasks: ['template:html', 'template:not_found']
            }
        , appcache:
            { files: 'www/offline.appcache'
            , options: {interrupt: true}
            , tasks: 'template:appcache'
            }
        , tests:
            { files: '**/*.js'
            , options: {interrupt: true}
            , tasks: ['traceur:test', 'testem']
            }
        }
    })

; grunt.loadNpmTasks('grunt-contrib-stylus')
; grunt.loadNpmTasks('grunt-contrib-copy')
; grunt.loadNpmTasks('grunt-contrib-clean')
; grunt.loadNpmTasks('grunt-contrib-watch')
; grunt.loadNpmTasks('grunt-templater')
; grunt.loadNpmTasks('grunt-contrib-uglify')
; grunt.loadNpmTasks('grunt-contrib-concat')
; grunt.loadNpmTasks('grunt-contrib-compress')
; grunt.loadNpmTasks('grunt-bump')

; grunt.registerMultiTask('traceur', '', function()
    { spawn
        ( this
        , 'node'
        , [ './traceur/filecompiler.js'
          , '--inline-modules'
          , '--freeVariableChecker=false'
          , '--source-maps'
          , this.data.in
          , this.data.out
          , this.data.root
          , this.data.sourceMapPrefix
          ]
        )
    })

; grunt.registerTask('run', function()
    { cp.spawn('nw', ['dist'])
    })

; grunt.registerTask('css', ['stylus', 'copy:css'])

; grunt.registerTask('js', function(/* args */)
    { var args = commonArgs(arguments)
    ; runTasks
        ( args.nw ? 'traceur:main_nw' : 'traceur:main_browser'
        , 'concat:js'
        , 'copy:worker'
        , 'copy:source_map'
        , args.min ? 'uglify:js' : 'copy:unuglified_js'
        )
    })

; grunt.registerTask('html', function(/* args */)
    { var args = commonArgs(arguments)
    ; runTasks
        ( 'css'
        , 'js' + (args.min ? ':min' : '') + (args.nw ? ':nw' : '')
        , 'template:html'
        , 'template:not_found'
        )
    })

; grunt.registerTask('all', function(/* args */)
    { var args = commonArgs(arguments)
    ; runTasks
        ( 'html' + (args.min ? ':min' : '') + (args.nw ? ':nw' : '')
        , 'template:appcache'
        , 'copy:package'
        , 'copy:worker'
        , args.gzip ? 'compress' : null
        )
    })

; grunt.registerTask('test', ['traceur:test', 'testacular:unit:run'])
; grunt.registerTask('test:once', ['traceur:test', 'testacular:once'])

; grunt.registerTask('testem', function()
    { spawn(this, 'xvfb-run', ['-a', 'testem', 'ci'])
    })
};
