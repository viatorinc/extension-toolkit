const fs = require("fs");
const Bundler = require("parcel-bundler");
const path = require("path");
const jsonminify = require("jsonminify");

exports.command = "watch [input|--input] [output|--output]";

exports.desc = "Watch the source files for changes and rebuild";
exports.handler = async function(argv) {
  let { input, output } = argv;
  input = input || "src";
  output = output || "dist";

  const entryFiles = path.join(input, "*.vue");

  const bundler = new Bundler(entryFiles, {
    outDir: output,
    watch: true,
    minify: false,
    global: "__DirectusExtension__",
    publicUrl: './'
  });

  await bundler.bundle();

  const metaFile = fs.readFileSync(path.join(input, "meta.json"), "utf8");
  fs.writeFileSync(path.join(output, "meta.json"), jsonminify(metaFile));
}
