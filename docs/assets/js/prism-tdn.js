Prism.languages.tdn = {
  comment: {
    pattern: /(^|[^\\:])#.*/,
    lookbehind: true,
    greedy: true
  },
  selector: {
    pattern: /(^|\s)@[aser](\[([^\[\]\,]+=[^\[\]\,]+,\s*)*([^\[\]\,]+=[^\[\]\,]+)\])?/,
    inside: {
      keyword: {
        pattern: /[^\[\]\,]+=[^\[\]\,]+/,
        inside: {
          operator: /=/,
        }
      },
      punctuation: /[\[\]\,]/
    }
  },
  punctuation: /[\[\{\}\]\,]/,
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  important: [
    {
      pattern: /\bfunction\s[a-zA-z_0-9/:]+\b/,
      inside: {
        key: {
          pattern: /\b[a-zA-Z0-9_]+\s*:/,
          alias: "variable",
          inside: {
            punctuation: /:/
          }
        },
        name: {
          pattern: /\b(?!function\s)[a-zA-Z0-9_]/,
          alias: "keyword"
        },
        punctuation: /\//
      }
    },
    { // TODO: keywords
      pattern: /(execute|function|say|summon|scoreboard|setblock)/
    }
  ],
  keyword: [
    {
      pattern: /\b(as|block|players|add|tp|objective|at|run|store|result|score|if|entity)\b/
    },
    {
      pattern: /\balign\s(xyz|xy|yz|xz|x|y|z)\b/,
      inside: {
        statement: /(xyz|xy|yz|xz|x|y|z)/
      }
    },
  ],
  placeholder: /\b(armor_stand|hopper|stone)\b/,
  number: {
    pattern: /[+-]?(([0-9]+)(\.[0-9]+)?|(\.[0-9]+))[bdsl]?/,
  },
  coordinate: {
    pattern: /(\^|~)[+-]?([0-9]*)(\.[0-9]+)?/,
    alias: "number"
  },
  key: {
    pattern: /\b[a-zA-Z0-9_]+\s*:/,
    alias: "variable",
    inside: {
      punctuation: /:/
    }
  },
  control: {
    pattern: /\b(define|raw|var)\b/
  },
  verbatim: {
    pattern: /^\/.+/,
    greedy: true,
    inside: {
      variable: {
        pattern: /[\${}]/
      }
    }
  },
  operator: {
    pattern: /[$=+-/*]/
  },
  metadata: {
    pattern: /^@\s.*/m,
    alias: "entity",
    greedy: true,
    inside: {
      key: {
        pattern: /\b[a-zA-Z0-9_]+\s*:/,
        alias: "variable",
        inside: {
          punctuation: /:/
        }
      }
    }
  }
}