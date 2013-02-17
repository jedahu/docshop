; export const ngIt = ($injector) =>
    (text, fn) =>
      it(text, (done) =>
        { const $rootScope = $injector.get('$rootScope')
        ; let fin
        ; const finished = (err) =>
            { fin = true
            ; done(err)
            }
        ; fn(finished)
        ; while (!fin) {$rootScope.$digest()}
        ; $rootScope.$digest()
        })
