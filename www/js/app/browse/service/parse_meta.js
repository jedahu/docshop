; export const parseMeta = (text) =>
    { const matcher =
        /^(\S+)\s+!meta\b.*\n([\s\S]*?\n)(\s*\S*?)\s*?\.\.\.\n(\S+)/
    ; const [_, open, content, middle, close] = matcher.exec(text) || []
    ; if (!_) return {}
    ; const metaStr = ''
    ; for (let line of content.split(/\n/))
        { metaStr += line.slice(middle.length) + '\n'
        }
    ; const meta = jsyaml.load(metaStr)
    ; meta.lang =
        { name: meta.lang
        , open
        , middle
        , close
        }
    ; return meta
    }

; export const parseMetaService = () => parseMeta
