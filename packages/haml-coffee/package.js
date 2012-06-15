Package.describe({
  summary: "Javascript template that uses HAML as markup and understands coffeescript"
});

var HamlCoffee = require("haml-coffee"),
    fs = require("fs"),
    path = require("path");

Package.register_extension(
  "hamlc", function (bundle, sourcePath, servePath, where) {
    if (where !== "client") return;

    var contents = fs.readFileSync(sourcePath).toString("utf8"),
        templateName = path.basename(servePath, ".hamlc"),
        type;

    switch (templateName) {
      case "body":
      case "head":
        type = templateName;
        contents = HamlCoffee.compile(contents)();
        servePath += ".html";
        break;
      default:
        type = "js";
        servePath += ".js";
        contents = new Buffer(HamlCoffee.template(contents, templateName).replace(/window\.HAML/g, "this.Template"));
    }    

    bundle.add_resource({
      type: type,
      path: servePath,
      data: contents,
      where: where
    });
  }
);

Package.on_use(function(api) {
  //bundle.add_resourcenew Buffer("var HAML = {};"));
});
