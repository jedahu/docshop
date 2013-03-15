; export const alertController = ($scope, alert) =>
    { $scope.alerts = alert.alerts
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
    , performAction(action)
        { (this.actions[action] || () => {})()
        }
    })
