window.$docsify.plugins = (window.$docsify.plugins || []).concat(
  function (hook, vm) {
    hook.beforeEach(function (content, next) {
      const reg = /^(:+) *(.+)/gm;
      let result = content.replace(reg, ($0, $1, $2) =>
        `<span class="hatnote" style="padding-left: ${$1.length * 2}em;">${$2}</span>`)
      next(result);
    });
  }
);