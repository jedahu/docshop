; import manifestParser from '/browse/service/manifest_parser.js'

; const assert = chai.assert

; const example1 = `
{ "markup": "markdown"
, "languages":
    { "javascript": ["/*", "", "*/"]
    , "python": ["#.", "#", "#."]
    }
, "extensions":
    { "js": "javascript"
    , "py": "python"
    }
, "prefix": "src/"
, "files":
    [ {"README": "../README"}
    , "string.js"
    , { "override":
          { "markup": "textile"
          , "lang": ["'''.", "", ".'''", "python"]
          , "path": "override.py"
          }
      }
    , { "Subheading @sub/dir/":
          [ "doc/README"
          , {"abspath": "/a/b/c/abspath.js"}
          ]
      }
    ]
}`

; const norm1 =
    { markup: 'markdown'
    , languages:
        { javascript:
            { name: 'javascript'
            , open: '/*'
            , middle: ''
            , close: '*/'
            }
        , python:
            { name: 'python'
            , open: '#.'
            , middle: '#'
            , close: '#.'
            }
        }
    , extensions:
        { js: 'javascript'
        , py: 'python'
        }
    , prefix: 'src/'
    , files:
        [ { name: 'README'
          , path: 'src/../README'
          , markup: 'markdown'
          , lang: null
          }
        , { name: 'string.js'
          , path: 'src/string.js'
          , markup: 'markdown'
          , lang:
              { name: 'javascript'
              , open: '/*'
              , middle: ''
              , close: '*/'
              }
          }
        , { name: 'override'
          , path: 'src/override.py'
          , markup: 'textile'
          , lang:
              { name: 'python'
              , open: "'''."
              , middle: ''
              , close: ".'''"
              }
          }
        , { Subheading:
              [ { name: 'doc/README'
                , path: 'src/sub/dir/doc/README'
                , markup: 'markdown'
                , lang: null
                }
              , { name: 'abspath'
                , path: 'a/b/c/abspath.js'
                , markup: 'markdown'
                , lang:
                    { name: 'javascript'
                    , open: '/*'
                    , middle: ''
                    , close: '*/'
                    }
                }
              ]
          }
        ]
    , fileMap:
        { 'src/../README':
            { name: 'README'
            , path: 'src/../README'
            , markup: 'markdown'
            , lang: null
            }
        , 'src/string.js':
            { name: 'string.js'
            , path: 'src/string.js'
            , markup: 'markdown'
            , lang:
                { name: 'javascript'
                , open: '/*'
                , middle: ''
                , close: '*/'
                }
            }
        , 'src/override.py':
            { name: 'override'
            , path: 'src/override.py'
            , markup: 'textile'
            , lang:
                { name: 'python'
                , open: "'''."
                , middle: ''
                , close: ".'''"
                }
            }
        , 'src/sub/dir/doc/README':
            { name: 'doc/README'
            , path: 'src/sub/dir/doc/README'
            , markup: 'markdown'
            , lang: null
            }
        , 'a/b/c/abspath.js':
            { name: 'abspath'
            , path: 'a/b/c/abspath.js'
            , markup: 'markdown'
            , lang:
                { name: 'javascript'
                , open: '/*'
                , middle: ''
                , close: '*/'
                }
            }
        }
    }

; describe('manifestParser', () =>
    { it('should normalize', () =>
        { const ex = Object.create(manifestParser).parse(example1)
        ; assert.deepEqual(norm1.languages, ex.languages)
        ; assert.deepEqual(norm1.files, ex.files)
        ; assert.deepEqual(norm1.fileMap, ex.fileMap)
        ; assert.deepEqual(norm1, ex)
        })
    })
