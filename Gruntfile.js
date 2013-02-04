module.exports = function(grunt)

{ var md5sum = require('MD5')
    , fs = require('fs')
    , path = require('path')
    , root = process.cwd()

; var bustCache = function(url)
    { return url
        + '?z='
        + md5sum(fs.readFileSync(path.resolve(root, 'dist', url)))
    }

; var runTasks = function()
    { grunt.task.run(Array.prototype.filter.call(arguments, function(task) {return !!task}))
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
        , unuglified_js:
            { files:
                [ { dest: 'dist/main.js'
                  , src: ['tmp/concated.js']
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
                , 'www/js/lib/runtime.js'
                , 'tmp/compiled.js'
                ]
            , dest: 'tmp/concated.js'
            }
        }
    , uglify:
        { js:
            { files: {'dist/main.js': 'tmp/concated.js'}
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
        , appcache:
            { src: 'www/offline.appcache'
            , dest: 'dist/offline.appcache'
            , engine: 'ejs'
            , variables: {bustCache: bustCache}
            }
        }
    , traceur:
        { main:
            { in: 'www/js/app/start_nw.js'
            , out: 'tmp/compiled.js'
            , root: 'www/js/app'
            }
        , test:
            { in: 'test/all.js'
            , out: 'tmp/test.js'
            , root: 'www/js/app'
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
            , tasks: 'css'
            }
        , js:
            { files: 'www/**/*.js'
            , tasks: 'js'
            }
        , package:
            { files: 'www/package.json'
            , tasks: 'copy:package'
            }
        , html:
            { files: 'www/docs.html'
            , tasks: 'template:html'
            }
        , appcache:
            { files: 'www/offline.appcache'
            , tasks: 'template:appcache'
            }
        , tests:
            { files: 'www/**/*.js'
            , tasks: 'traceur:test testacular:unit:run'
            }
        }
    , testacular:
        { unit:
            { configFile: 'testacular.js'
            }
        , headless:
            { configFile: 'testacular.js'
            , browsers: ['PhantomJS']
            , singleRun: true
            }
        }
    })

; grunt.loadNpmTasks('grunt-contrib-stylus')
; grunt.loadNpmTasks('grunt-contrib-copy')
; grunt.loadNpmTasks('grunt-contrib-clean')
; grunt.loadNpmTasks('grunt-contrib-watch')
; grunt.loadNpmTasks('grunt-templater')
; grunt.loadNpmTasks('gruntacular')
; grunt.loadNpmTasks('grunt-contrib-uglify')
; grunt.loadNpmTasks('grunt-contrib-concat')
; grunt.loadNpmTasks('grunt-contrib-compress')

; grunt.registerMultiTask('traceur', '', function()
    { var done = this.async()
    ; var spawn = require('child_process').spawn
    ; fs.mkdir('tmp')
    ; var proc = spawn
        ( 'node'
        , [ './traceur/filecompiler.js'
          , '--inline-modules'
          , '--freeVariableChecker=false'
          , this.data.in
          , this.data.out
          , this.data.root
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

; grunt.registerTask('css', function(arg)
    { runTasks
        ( 'stylus'
        , 'copy:css'
        , arg === 'min' ? 'compress:css' : null
        )
    })

; grunt.registerTask('js', function(arg)
    { runTasks
        ( 'traceur:main'
        , 'concat:js'
        , 'copy:worker'
        , arg === 'min' ? 'uglify:js' : 'copy:unuglified_js'
        , arg === 'min' ? 'compress:js' : null
        )
    })

; grunt.registerTask('html', function(arg)
    { runTasks
        ( 'css:' + (arg || '')
        , 'js:' + (arg || '')
        , 'template:html'
        , arg === 'min' ? 'compress:html' : null
        )
    })

; grunt.registerTask('all', function(arg)
    { runTasks
        ( 'html'
        , 'template:appcache'
        , 'copy:package'
        , 'copy:worker'
        )
    ; if (arg === 'min') runTasks('uglify:js', 'compress')
    })

; grunt.registerTask('heroku', 'all:min')
; grunt.registerTask('test', 'traceur:test testacular:unit:run')

};
