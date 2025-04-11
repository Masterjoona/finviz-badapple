import Patcher from "./Patcher";
import { startBadApple, startBadAppleWithAudioAndVideo } from "./badAppler";

unsafeWindow.customColorScale = (value) => {
    if (!started) return unsafeWindow.treemapper.colorScale(value);
    return value < 0 ? unsafeWindow.badAppleConfig.negativeColor : unsafeWindow.badAppleConfig.positiveColor;
}

const patches = [
    {
        name: "React Updater",
        find: "window.MAP_EXPORT",
        replace: {
            match: /dataHash:\w}=\w;(?=.+?(\w)\.useState)/,
            replacement: "$&let [tick,setTick]=$1.useState(0);window.updateTick=setTick;"
        }

    },
    {
        name: "Expose Treemap",
        find: "this._updateIndustryPerf():this._resetIndustryPerf(),",
        replace: [
            {
                match: /;this.width=/,
                replacement: ";window.treemapper=this;$&",
            },
            {
                match: /this\.colorScale\((\w\.perf)\)/,
                predicate: unsafeWindow.badAppleConfig.customColors,
                replacement: "window.customColorScale($1)"
            }
        ]
    },
    {
        name: "Industry Header color",
        find: "&&this.renderSectorBorders",
        replace: {
            match: /fill:\w\.colorScale\((\w.perf)\)/,
            predicate: unsafeWindow.badAppleConfig.customColors,
            replacement: "fill:window.customColorScale($1)",
        }
    }
]

const patcher = new Patcher(patches);
patcher._interceptWebpackModern()

let started = false;

unsafeWindow.startBadApple = () => {
    if (!started) {
        started = true;
        startBadApple();
    }
    return started;
}

unsafeWindow.startBadAppleWithAudioAndVideo = async () => {
    if (!started) {
        started = true;
        await startBadAppleWithAudioAndVideo();
    }
    return started;
}