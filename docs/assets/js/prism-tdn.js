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
  important: { // TODO: keywords
    pattern: /(execute|say|summon)/
  },
  keyword: [
    {
      pattern: /\b(as|at|run|store|result|score|if|entity)\b/
    },
    {
      pattern: /\balign\s(xyz|xy|yz|xz|x|y|z)\b/,
      inside: {
        statement: /(xyz|xy|yz|xz|x|y|z)/
      }
    }
  ],
  placeholder: /(armor_stand)/,
  number: {
    pattern: /[+-]?(([0-9]+)(\.[0-9]+)?|(\.[0-9]+))[bdsl]?/,
  },
  coordinate: {
    pattern: /(\^|~)[+-]?([0-9]*)(\.[0-9]+)?/,
    alias: "number"
  },
  key: {
    pattern: /\w[a-zA-Z_]+\s*:/,
    alias: "variable",
    inside: {
      punctuation: /:/
    }
  },
  control: {
    pattern: /(define)/
  }
}