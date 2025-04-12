# finviz-badapple

Userscript to play [Bad Apple!!](https://en.wikipedia.org/wiki/Bad_Apple!!#Use_of_video_as_a_graphical_and_audio_test) on the [Finviz](https://finviz.com/map.ashx) website.


[Video of Bad Apple playing on finviz](https://github.com/user-attachments/assets/d3351b54-c881-46bf-9b3b-9b3b859ce645)


## why?

I came across a [tweet](https://x.com/ZenithVal/status/1910214425966968857) where they used after effects to achieve this. i thought it could be quite fun do this with just js.

<details>
<summary>tweet</summary>

![Screenshot of the tweet which has a video reply to someone asking to make bad apple of "this"](https://github.com/user-attachments/assets/35cf5869-06e0-48cc-a6c1-9d5fbc659d71)

</details>

## how to Use

1. Install a userscript manager, i use[Violentmonkey](https://violentmonkey.github.io/get-it/).
2. open the [file](/dist/finviz_badapple.user.js) in the dist folder (yes i know dist is not a good way to do this, but i am lazy and this is a fun project).
</br>You can change the `badAppleConfig` to change the colors if you wish (if you do, reload the page if already had it open)
3. Navigate to [Finviz map](https://finviz.com/map.ashx) (and if you want to, you can select a different map from the sidebar) and open the browser console
4. Run `startBadApple()` in the console or `startBadAppleWithVideo()` if you want to have the original one playing as well (you can drag it around)
5. Sit back and enjoy

### notes about finviz Website

#### bypassing premium 

When i started making this i noticed global object `FinvizSettings` which has `hasUserPremium` property. if you turn that on you can get rid of ads and maybe some other premium features, kinda funny tbh.

<details>
<summary>Userscript</summary>

```javascript
// ==UserScript==
// @name        Bypass Finviz Premium
// @namespace   Violentmonkey Scripts
// @match       https://finviz.com/*
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-start
// @description 11.4.2025 klo 13.54.39
// ==/UserScript==

Object.defineProperty(window, "FinvizSettings", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: {
    versionImages: 18,
    hasUserPremium: true,
    name: "",
    email: "",
    nodeChartsDomain: "https://charts2-node.finviz.com",
    hasUserStickyHeader: true,
    adsProvider: Infinity,
    hasRedesignEnabled: true,
    hasDarkTheme: true,
    hasEliteRedesign: true,
    quoteSearchExt: "",
    isJoinBannerVisible: false,
    hasCustomExtendedHoursEnabled: true,
  }
});
```

</details>
</br>

Another global variable i noticed was `MAP_EXPORT` (for whatever reason they set this), can be used to change the node's `perf` value (without patching webpack) but even after rerendering, the node on the map doesnt update

#### source maps

They have source maps enabled, thanks lmao, they were quite helpful.

### Implementation Details

I used a stripped-down version of [moonlight's webpackTools](https://github.com/moonlight-mod/webpackTools), licensed under the [MIT License](https://github.com/moonlight-mod/webpackTools/blob/86f9f7cf99843dd69da86bcea63e7fd0d0a2f766/LICENSE).

- The scripts [first patch](/src/index.js#L4-12) introduces a way to trigger React updates, forcing a re-render to allow frame changes.
- The [second patch](/src/index.js#L13-20) exposes the `treemap` class, which manages the "nodes" (red and green elements you see on the map) and other map-related data.
- Then we fetch the frames which and precompute each node's `perf` value
