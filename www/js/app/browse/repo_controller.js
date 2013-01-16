define(function()

{ var RepoController = function
    ( $scope
    , $q
    , $location
    , createRepoObj
    , parseRenderSrc
    , scrollToHash
    )
  { var initialRepo = $q.defer()
  ; initialRepo.resolve(null)
  ; $scope.repo = null
  ; $scope.repoForm = {}
  ; $scope.renderedSrc = null

  ; $scope.refQuery =
      { initSelection: function(elem, cb)
        { cb($scope.repoForm.ref)
        }
      , query: function(q)
        { var data = {results: [{id: q.term, text: q.term}]}
        ; angular.forEach
            ( $scope.repo.refs || []
            , function(item, key)
              { if (q.term.toUpperCase() ===
                    item.substring(0, q.term.length)
                    . toUpperCase())
                { data.results.push({id: item, text: item})
                }
              }
            )
        ; q.callback(data)
        }
      }

  ; var fileFromPath = function(repo, path)
    { return repo.manifest.fileMap[path]
    }

  ; var parseRepoString = function(str)
    { var match = str && str.match(/([^@]+)(?:@([^:]+):?(.*))?/)
      return match
        ? {id: match[1], ref: {id: match[2], text: match[2]}, path: match[3]}
        : null
    }

  ; var setPath = function()
    { var repo = $scope.repo
    ; $location.path(repo.id + '@' + repo.ref + ':' + repo.path)
    }

  ; $scope.changeRepo = function()
    { if ($scope.repo && $scope.repoForm.ref.text && $scope.repo.ref !== $scope.repoForm.ref.text)
      { $scope.repo.ref = $scope.repoForm.ref.text
      ; changePath()
      }
      else if ($scope.repo && $scope.repo.id === $scope.repoForm.id)
      { // do nothing
      }
      else if ($scope.repoForm)
      { createRepoObj($scope.repoForm.id)
        . then
          ( function(repo)
            { var renderFile
            ; if (!repo) return $q.reject('No repo produced')
            ; renderFile = repo.ref !== $scope.repoForm.ref.text
                || repo.path !== $scope.repoForm.path
                || !repo.path
            ; repo.ref = $scope.repoForm.ref.text || repo.ref
            ; repo.path = $scope.repoForm.path
                || repo.path
                || repo.manifest.files[0].path
            ; $scope.repo = repo
            ; if (renderFile) changePath()
            }
          , function(err)
            { console.log('err:', err) // TODO handle error
            ; $scope.repo = null
            }
          )
      }
      else
      { // handle error
      ; console.log('err: no repo')
      }
    }

  ; var changePath = function()
    { parseRenderSrc
        ( $scope.repo
        , fileFromPath($scope.repo, $scope.repo.path)
        )
      . then
        ( function(result)
          { var hashElem
          ; $scope.renderedSrc = result
          ; result.html.prepend('<div id="ds-float-fix">&nbsp;</div>')
          ; angular.element('#ds-content').html('').append(result.html)
          ; return $location.hash()
          }
        )
      . then
        ( function(hash)
          { scrollToHash(hash, false)
          }
        , function(err)
          { angular.element('#ds-content').html('<b>ERROR</b>')
          }
        )
    ; setPath()
    ; $scope.repoForm.updateHack = new Date().getTime()
    }

  ; $scope.changePathTo = function(path)
    { if (!path || !$scope.repo) return
    ; $scope.repo.path = path
    ; changePath()
    }

  ; $scope.$on
      ( '$locationChangeSuccess'
      , function(_new, _old)
        { $scope.repoForm = parseRepoString($location.path().slice(1))
        ; $scope.changeRepo()
        }
      )

  ; $scope.$watch
      ( function() { return $scope.repoForm.ref }
      , function(newVal, _old)
        { if (newVal)
          { $scope.changeRepo()
          }
        }
      )

  ; $scope.scrollToHash = scrollToHash

  ; $scope.console = console

  ; $scope.resizeOpts = function(direction)
    { var content = jQuery('#ds-content')
        , originalWidth
        , originalOffset
    ; return {
        start: function(evt, ui)
        { originalWidth = content.width()
        ; originalOffset = content.offset().left
        }
      , resize: function(evt, ui)
        { var travel = ui.size.width - ui.originalSize.width
        ; if (direction === 'reverse')
          { content.offset({left: originalOffset + travel})
          }
        }
      , handles: direction === 'reverse' ? 'e' : 'w'
      }
    }
  }

; RepoController.$inject = ['$scope', '$q', '$location', 'createRepoObj', 'parseRenderSrc', 'scrollToHash']
; return RepoController

});
