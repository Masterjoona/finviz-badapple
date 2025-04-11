import * as esbuild from "esbuild";

const banner = `
// ==UserScript==
// @name         Bad Apple on Finviz
// @version      0.1
// @description  Play bad Apple on Finviz
// @author       Joona
// @include      https://finviz.com/map.ashx*
// @grant        GM_addElement
// @run-at       document-start
// ==/UserScript==

// The code is minified. For the source code, visit https://github.com/Masterjoona/finviz-badapple

unsafeWindow.badAppleConfig = {
  customColors: false,
  negativeColor: "#000000",
  positiveColor: "#ffffff",
};

`

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: true,
  banner: {
    js: banner,
  },
  outfile: "dist/finviz_badapple.user.js",
  logLevel: "info",
  target: ["es2020"],
});
