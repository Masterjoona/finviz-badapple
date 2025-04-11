
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


(()=>{function A(s,e){return!(e instanceof Array?e:[e]).some(r=>r instanceof RegExp?!r.test(s):!s.includes(r))}var o=class{constructor(e){if(this.chunkObject="webpackChunk_finviz_website",this.patches=e,this.patchesToApply=new Set,this.patches)for(let t of this.patches){if(t.replace instanceof Array){for(let r in t.replace)this.patchesToApply.add({name:t.name+"_"+r,find:t.find,replace:t.replace[r]});continue}this.patchesToApply.add(t)}}_interceptWebpackModern(){let e=unsafeWindow[this.chunkObject],t=this;Object.defineProperty(unsafeWindow,this.chunkObject,{set:function(n){if(e=n,!n.push.__wpt_injected){e=n;let a=n.push;n.push=function(c){return c.__wpt_processed||(c.__wpt_processed=!0,t._patchModules(c[1])),a.apply(this,arguments)},n.push.__wpt_injected=!0,a===Array.prototype.push?console.log("[patcher] FInjected "+t.chunkObject+" (before webpack runtime)"):console.log("[patcher] FInjected "+t.chunkObject+" (at webpack runtime)")}},get:function(){return e},configurable:!0})}_patchModules(e){for(let t in e){if(e[t].__wpt_processed)continue;let r=Function.prototype.toString.apply(e[t]),n=[];for(let a of this.patchesToApply)A(r,a.find)&&(a.replace.predicate===void 0||a.replace.predicate)&&(console.log("[patcher] Found patch: "+a.name),n.push(a),this.patchesToApply.delete(a));for(let a of n)r=r.replace(a.replace.match,a.replace.replacement);if(n.length>0){let a="";n.length>0&&(a+="Patched by: "+n.map(c=>c.name).join(", ")),e[t]=new Function("module","exports","webpackRequire",`(${r}).apply(this, arguments)
// ${a}
//# sourceURL=${this.chunkObject}-Module-${t}`),e[t].__wpt_patched=!0}e[t].__wpt_funcStr=r,e[t].__wpt_processed=!0}}};var b=33.333333333333336,l=class{constructor(){this.precalculatedFrames=[],this.badAppleFrames=null,this.frameIndex=0,this.lastFrameTime=0}async fetchBadAppleFrames(){try{let e=await fetch("https://pawst.eu/p/pigeon-spider-fly/f/all_frames.json");this.badAppleFrames=await e.json()}catch(e){console.error("Failed to fetch Bad Apple frames:",e)}}preCalculate(){let{width:e,height:t,nodes:r}=unsafeWindow.treemapper;this.badAppleFrames.forEach((n,a)=>{let c=r.map(p=>{let f=unsafeWindow.treemapper.getParentSector(p),u=p.x+p.dx/2,m=p.y+p.dy/2,w=Math.floor(u/e*20),d=Math.floor(m/t*36),_=(n[d]&&n[d][w])===1?3:-3;return{name:p.name,data:{sector:f},perf:_,additional:void 0}});this.precalculatedFrames.push({hash:`frame-${a}`,nodes:c})})}playPrecomputed(e){e-this.lastFrameTime>=b&&(unsafeWindow.treemapper.updatePerf(this.precalculatedFrames[this.frameIndex]),unsafeWindow.updateTick(t=>t+1),this.frameIndex=(this.frameIndex+1)%this.precalculatedFrames.length,this.lastFrameTime=e),requestAnimationFrame(this.playPrecomputed.bind(this))}async start(){await this.fetchBadAppleFrames(),this.badAppleFrames&&(this.preCalculate(),requestAnimationFrame(this.playPrecomputed.bind(this)))}},h=()=>{new l().start()};unsafeWindow.customColorScale=s=>i?s<0?unsafeWindow.badAppleConfig.negativeColor:unsafeWindow.badAppleConfig.positiveColor:unsafeWindow.treemapper.colorScale(s);var y=[{name:"React Updater",find:"window.MAP_EXPORT",replace:{match:/dataHash:\w}=\w;(?=.+?(\w)\.useState)/,replacement:"$&let [tick,setTick]=$1.useState(0);window.updateTick=setTick;"}},{name:"Expose Treemap",find:"this._updateIndustryPerf():this._resetIndustryPerf(),",replace:[{match:/;this.width=/,replacement:";window.treemapper=this;$&"},{match:/this\.colorScale\((\w\.perf)\)/,predicate:unsafeWindow.badAppleConfig.customColors,replacement:"window.customColorScale($1)"}]},{name:"Industry Header color",find:"&&this.renderSectorBorders",replace:{match:/fill:\w\.colorScale\((\w.perf)\)/,predicate:unsafeWindow.badAppleConfig.customColors,replacement:"fill:window.customColorScale($1)"}}],F=new o(y);F._interceptWebpackModern();var i=!1;unsafeWindow.startBadApple=()=>(i||(i=!0,h()),i);})();
