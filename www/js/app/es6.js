define(['lib/traceur'], function()

{ 'use strict'
;
    var fs, getXhr,
        fetchText = function () {
            throw new Error('Environment unsupported.');
        },
        buildMap = {};

    if (typeof process !== "undefined" &&
               process.versions &&
               !!process.versions.node &&
               typeof window === 'undefined') {
        //Using special require.nodeRequire, something added by r.js.
        fs = require('fs');
        fetchText = function (path, callback) {
            callback(fs.readFileSync(path, 'utf8'));
        };
    } else if ((typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined") {
        // Browser action
        getXhr = function () {
            var xhr;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            }

            if (!xhr) {
                throw new Error("getXhr(): XMLHttpRequest not available");
            }

            return xhr;
        };

        fetchText = function (url, callback) {
            var xhr = getXhr();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (evt) {
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(null);
        };
        // end browser.js adapters
    } else if (typeof Packages !== 'undefined') {
        //Why Java, why is this so awkward?
        fetchText = function (path, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(path),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return {
        //fetchText: fetchText,

        //get: function () {
        //    return CoffeeScript;
        //},

        write: function (pluginName, name, write) {
            if (buildMap.hasOwnProperty(name)) {
                var text = buildMap[name];
                write.asModule(pluginName + "!" + name, text);
            }
        },

        //version: '0.4.3',

        load: function(name, parentRequire, load, config)
        { var reporter = new traceur.util.ErrorReporter()
            , project = new traceur.semantics.symbols.Project('.')
            , path = parentRequire.toUrl(name + '.js')
        ; global.sourceMapModule = {}
        ; traceur.semantics.FreeVariableChecker.checkProgram = function() {}
        ; fetchText(path, function(text)
            { var srcFile = new traceur.syntax.SourceFile(path, text)
                , results
                , tree
                , result
            ; if (/^\/\/ es6$/.test(text))
              { load.fromText(text)
              }
              else
              { project.addFile(srcFile)
              ; results = traceur.codegeneration.Compiler.compile(reporter, project)

              if (reporter.hadError())
              { console.log('Compilation failed')
              ; throw new Error('Compilation failed')
              }

              ; tree = results.get(srcFile)
              ; result = traceur.outputgeneration.TreeWriter.write(tree, {sourceMapGenerator: false, sourceMap: {}})
              ; if (config.isBuild) buildMap[name] = result
              ; /*@if (!_jscript) @else @*/
              ; if (!config.isBuild)
                { result += '\r\n//@ sourceURL=' + path
                }
              ; /*@end@*/
              ; load.fromText(result)

              //; parentRequire([name], function(val) { load(val) })
              }
            })
        }

        //load_x: function (name, parentRequire, load, config) {
        //    var path = parentRequire.toUrl(name + '.coffee');
        //    fetchText(path, function (text) {

        //        //Do CoffeeScript transform.
        //        try {
        //            text = CoffeeScript.compile(text, config.CoffeeScript);
        //        } catch (err) {
        //            err.message = "In " + path + ", " + err.message;
        //            throw err;
        //        }

        //        //Hold on to the transformed text if a build.
        //        if (config.isBuild) {
        //            buildMap[name] = text;
        //        }

        //        //IE with conditional comments on cannot handle the
        //        //sourceURL trick, so skip it if enabled.
        //        /*@if (@_jscript) @else @*/
        //        if (!config.isBuild) {
        //            text += "\r\n//@ sourceURL=" + path;
        //        }
        //        /*@end@*/

        //        load.fromText(name, text);

        //        //Give result to load. Need to wait until the module
        //        //is fully parse, which will happen after this
        //        //execution.
        //        parentRequire([name], function (value) {
        //            load(value);
        //        });
        //    });
        //}
    };
});
