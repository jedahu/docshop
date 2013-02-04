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
        { package:
            { files: {'dist/': 'www/package.json'}
            }
        , worker:
            { files: {'dist/': 'www/worker/**'}
            , options: {basePath: 'www'}
            }
        , css:
            { files:
                { 'dist/':
                    [ 'www/css/*.png'
                    , 'www/css/*.gif'
                    ]
                }
            }
        }
    , clean:
        { dist: 'dist'
        , tmp: 'tmp'
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
            , tasks: 'testacular:unit:run'
            }
        }
    , testacular:
        { unit:
            { configFile: 'testacular.js'
            }
        , headless:
            { configFile: 'testacular.js'
            , browsers: ['PhantomJS']
            }
        }
    })

; grunt.loadNpmTasks('grunt-stylus')
; grunt.loadNpmTasks('grunt-contrib-copy')
; grunt.loadNpmTasks('grunt-clean')
; grunt.loadNpmTasks('grunt-contrib-watch')
; grunt.loadNpmTasks('grunt-templater')
; grunt.loadNpmTasks('gruntacular')

; grunt.registerTask('traceur', function()
    { var done = this.async()
    ; var spawn = require('child_process').spawn
    ; fs.mkdir('tmp')
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

; grunt.registerTask('traceur-test', function()
    { var done = this.async()
    ; var spawn = require('child_process').spawn
    ; fs.mkdir('tmp')
    ; var proc = spawn
        ( 'node'
        , [ './traceur/filecompiler.js'
          , '--inline-modules'
          , '--freeVariableChecker=false'
          , 'test/all.js'
          , 'tmp/test.js'
          , 'www/js/app/'
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

; grunt.registerTask('css', 'stylus copy:css')
; grunt.registerTask('js', 'traceur concat:js copy:worker')
; grunt.registerTask('html', 'stylus traceur concat:js template')
; grunt.registerTask('all', 'stylus traceur concat copy template')
; grunt.registerTask('heroku', 'all')
; grunt.registerTask('test', 'js testacular:unit:run')

};
