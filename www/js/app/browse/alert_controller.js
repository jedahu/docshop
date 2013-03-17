; export const alertController = ($scope, alert) =>
    { $scope.alert = alert
    }

; alertController.$inject = ['$scope', 'alert']

; export const alertService = () => (
    { alerts: []
    , actions: {}
    , addError(err)
        { this.alerts.push(
            { type: 'error'
            , msg: err.message
            , action: err.action
            })
        }
    , remove(index)
        { this.alerts.splice(index, 1)
        }
    , addAction(id, fn)
        { this.actions[id] = fn
        }
    , performAction(index, action)
        { this.remove(index)
        ; (this.actions[action] || () => {})()
        }
    })
