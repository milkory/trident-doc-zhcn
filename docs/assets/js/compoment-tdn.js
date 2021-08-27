Prism.languages.tdn = {
    comment: {
		pattern: /^#.*/,
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
    punctuation: /[\[\{\}\]\,:]/,
    number: /\s/,
    string: {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	keyword: {
		pattern: /^(execute)/
	}
}