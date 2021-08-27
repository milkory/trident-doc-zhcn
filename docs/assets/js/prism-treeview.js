window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
  hook.init(function () {
    (function () {
      Prism.languages.treeview = {
        'treeview-part': {
          pattern: /^.+/m,
          inside: {
            'entry-line': [
              {
                pattern: /\|--\s|├──\s/,
                alias: 'line-h'
              },
              {
                pattern: /\|\s{3}|│\s{3}/,
                alias: 'line-v'
              },
              {
                pattern: /`--\s|└──\s/,
                alias: 'line-v-last'
              },
              {
                pattern: /\s{4}/,
                alias: 'line-v-gap'
              }
            ],
            'entry-name': {
              pattern: /.*\S.*/,
              inside: {
                // symlink
                'operator': / -> /,
              }
            }
          }
        }
      };

      Prism.hooks.add('wrap', function (env) {
        if (env.language === 'treeview' && env.type === 'entry-name') {
          var classes = env.classes;

          var folderPattern = /(^|[^\\])\/\s*$/;
          if (folderPattern.test(env.content)) {
            // folder

            // remove trailing /
            env.content = env.content.replace(folderPattern, '$1');
            classes.push('dir');
          } else {
            // file

            // remove trailing file marker
            env.content = env.content.replace(/(^|[^\\])[=*|]\s*$/, '$1');
            var parts = env.content.toLowerCase().replace(/\s+/g, '').split('.');
            while (parts.length > 1) {
              parts.shift();
              // Ex. 'foo.min.js' would become '<span class="token keyword ext-min-js ext-js">foo.min.js</span>'
              classes.push('ext-' + parts.join('-'));
            }
          }

          if (env.content[0] === '.') {
            classes.push('dotfile');
          }
        }
      });
    }());
  });
  hook.ready(function() {
    var list = document.getElementsByClassName("language-treeview");
    for (let b of list) {
      b.className = "language-treeview no-line-number";
    }
  });
})