; export const readFileService = (parseMeta) =>
    (repo, path) =>
      { const file = repo.manifest.fileMap[path]
      ; return repo.readFile(file.path).then((text) =>
          { const meta = parseMeta(text)
          ; if (meta)
              { file = Object.create(file)
              ; if (meta.lang) meta.lang.name = meta.lang.name || file.lang.name
              ; file.lang = meta.lang || file.lang
              ; file.markup = file.markup || meta.markup
              }
          ; return [file, text, meta]
          })
      }

readFileService.$inject = ['parseMeta']
