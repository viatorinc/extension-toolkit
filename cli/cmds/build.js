const fs = require("fs");
const Bundler = require("parcel-bundler");
const path = require("path");
const jsonminify = require("jsonminify");

exports.command = "build [input] [output]";
exports.desc = "Build the source files for production use";
exports.builder = {
  cacheDir: {
    default: '.cache'
  }
};
exports.handler = async function(argv) {
  let { input, output, cacheDir } = argv;
  input = input || "src";
  output = output || "dist";

  const entryFiles = path.join(input, "*.vue");

  const bundler = new Bundler(entryFiles, {
    outDir: output,
    watch: false,
    minify: true,
    global: "__DirectusExtension__",
    cacheDir,
    publicUrl: './'
  });

  await bundler.bundle();

  const metaFile = fs.readFileSync(path.join(input, "meta.json"), "utf8");
  fs.writeFileSync(path.join(output, "meta.json"), jsonminify(metaFile));
}
