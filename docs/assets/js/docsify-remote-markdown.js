// Origin: https://github.com/JerryC8080/docsify-remote-markdown

function getFile(target, vm) {
  const reg = new RegExp("https?://")
  if (!target.match(reg)) {
    target = vm.router.getFile(target, true);
  }
  let request = new XMLHttpRequest();
  request.open("GET", target, false);
  request.send(null);
  if (request.status != 200) {
    return `['${target}' = ${request.status}]`;
  } else {
    return request.responseText;
  }
}

window.$docsify.plugins = (window.$docsify.plugins || []).concat(
  function (hook, vm) {
    const config = Object.assign({}, {
      tag: 'remoteMarkdownUrl',
    }, vm.config.remoteMarkdown);

    hook.beforeEach(function (content, next) {
      const reg = new RegExp(`\\[${config.tag}\\]\\((.+)\\)`, "g");
      let result = content.replace(reg, (substring, args) => getFile(args, vm));
      next(result);
    });
  }
);