// @ts-check

function matchModule(moduleStr, queryArg) {
  const queryArray = queryArg instanceof Array ? queryArg : [queryArg];
  return !queryArray.some((query) => {
    // we like our microoptimizations https://jsben.ch/Zk8aw
    if (query instanceof RegExp) {
      return !query.test(moduleStr);
    } else {
      return !moduleStr.includes(query);
    }
  });
}

export default class Patcher {
  constructor(patches) {
    this.chunkObject = "webpackChunk_finviz_website";
    this.patches = patches;

    this.patchesToApply = new Set();
    if (this.patches) {
      for (const patch of this.patches) {
        if (patch.replace instanceof Array) {
          for (const index in patch.replace) {
            this.patchesToApply.add({
              name: patch.name + "_" + index,
              find: patch.find,
              replace: patch.replace[index],
            });
          }
          continue;
        }
        this.patchesToApply.add(patch);
      }
    }
  }

  _interceptWebpackModern() {
    let realChunkObject = unsafeWindow[this.chunkObject];
    const patcher = this;

    Object.defineProperty(unsafeWindow, this.chunkObject, {
      set: function set(value) {
        realChunkObject = value;
        if (!value.push.__wpt_injected) {
          realChunkObject = value;
          const realPush = value.push;

          value.push = function (chunk) {
            if (!chunk.__wpt_processed) {
              chunk.__wpt_processed = true;
              patcher._patchModules(chunk[1]);
            }
            return realPush.apply(this, arguments);
          };

          value.push.__wpt_injected = true;
          if (realPush === Array.prototype.push) {
            console.log("[patcher] FInjected " + patcher.chunkObject + " (before webpack runtime)");
          } else {
            console.log("[patcher] FInjected " + patcher.chunkObject + " (at webpack runtime)");
          }
        }
      },
      get: function get() {
        return realChunkObject;
      },
      configurable: true,
    });
  }


  _patchModules(modules) {
    for (const id in modules) {
      if (modules[id].__wpt_processed) {
        continue;
      }
      let funcStr = Function.prototype.toString.apply(modules[id]);

      const matchingPatches = [];
      for (const patch of this.patchesToApply) {
        if (matchModule(funcStr, patch.find) && (patch.replace.predicate === undefined || patch.replace.predicate)) {
          console.log("[patcher] Found patch: " + patch.name);
          matchingPatches.push(patch);
          this.patchesToApply.delete(patch);
        }
      }

      for (const patch of matchingPatches) {
        funcStr = funcStr.replace(patch.replace.match, patch.replace.replacement);
      }

      if (matchingPatches.length > 0) {
        let debugString = "";
        if (matchingPatches.length > 0) {
          debugString += "Patched by: " + matchingPatches.map((patch) => patch.name).join(", ");
        }

        modules[id] = new Function(
          "module",
          "exports",
          "webpackRequire",
          `(${funcStr}).apply(this, arguments)\n// ${debugString}\n//# sourceURL=${this.chunkObject}-Module-${id}`,
        );
        modules[id].__wpt_patched = true;
      }

      modules[id].__wpt_funcStr = funcStr;
      modules[id].__wpt_processed = true;
    }
  }
}
