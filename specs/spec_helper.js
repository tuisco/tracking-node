var moduleSpies = {};
var originalJsLoader = require.extensions['.js'];

spyOnModule = function spyOnModule(module) {
  var path          = require.resolve(module);
  var spy           = createSpy("spy on module \"" + module + "\"");
  moduleSpies[path] = spy;
  delete require.cache[path];
  return spy;
};

require.extensions['.js'] = function (obj, path) {
  if (moduleSpies[path]) {
    obj.exports = moduleSpies[path];
  } else {
    return originalJsLoader(obj, path);
  }
};

afterEach(function() {
  for (var path in moduleSpies) {
    delete moduleSpies[path];
  }
});

exports.spyOnModule = spyOnModule;
