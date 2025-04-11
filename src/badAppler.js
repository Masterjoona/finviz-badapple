const FRAME_ROWS = 36;
const FRAME_COLS = 20;
const FRAME_INTERVAL = 1000 / 30;

class BadApplePlayer {
    constructor() {
        this.precalculatedFrames = [];
        this.badAppleFrames = null;
        this.frameIndex = 0;
        this.lastFrameTime = 0;
    }

    async fetchBadAppleFrames() {
        try {
            const response = await fetch(
                "https://pawst.eu/p/pigeon-spider-fly/f/all_new_frames.json"
            );
            this.badAppleFrames = await response.json();
        } catch (error) {
            console.error("Failed to fetch Bad Apple frames:", error);
        }
    }

    preCalculate() {
        const { width, height, nodes } = unsafeWindow.treemapper;

        this.badAppleFrames.forEach((frame, f) => {
            const nodeUpdates = nodes.map((n) => {
                const sector = unsafeWindow.treemapper.getParentSector(n);

                const centerX = n.x + n.dx / 2;
                const centerY = n.y + n.dy / 2;

                const col = Math.floor((centerX / width) * FRAME_COLS);
                const row = Math.floor((centerY / height) * FRAME_ROWS);

                const pixel = (frame[row] && frame[row][col]) === 1 ? 3 : -3;

                return {
                    name: n.name,
                    data: { sector },
                    perf: pixel,
                    additional: undefined,
                };
            });

            this.precalculatedFrames.push({
                hash: `frame-${f}`,
                nodes: nodeUpdates,
            });
        });
    }

    playPrecomputed(timestamp) {
        if (timestamp - this.lastFrameTime >= FRAME_INTERVAL) {
            unsafeWindow.treemapper.updatePerf(this.precalculatedFrames[this.frameIndex]);
            unsafeWindow.updateTick(v => v + 1);
            this.frameIndex = (this.frameIndex + 1) % this.precalculatedFrames.length;
            this.lastFrameTime = timestamp;
        }

        requestAnimationFrame(this.playPrecomputed.bind(this));
    }

    syncWithVideo(video) {
        const renderFromVideo = () => {
            if (!this.precalculatedFrames.length) return;

            const frameIndex = Math.floor(video.currentTime * 30);

            if (frameIndex < this.precalculatedFrames.length) {
                unsafeWindow.treemapper.updatePerf(this.precalculatedFrames[frameIndex]);
                unsafeWindow.updateTick(v => v + 1);
            }

            requestAnimationFrame(renderFromVideo);
        };

        requestAnimationFrame(renderFromVideo);
    }

    async start() {
        await this.fetchBadAppleFrames();
        if (this.badAppleFrames) {
            this.preCalculate();
            requestAnimationFrame(this.playPrecomputed.bind(this));
        }
        return true;
    }
}

export const startBadApple = () => {
    const player = new BadApplePlayer();
    player.start();
};

export const startBadAppleWithAudioAndVideo = async () => {
    const player = new BadApplePlayer();

    const video = document.createElement("video");
    video.src = "https://pawst.eu/p/pigeon-spider-fly/f/badapple.mp4";
    video.load();

    video.style.position = "fixed";
    video.style.bottom = "38px";
    video.style.left = "360px";
    video.style.width = "300px";
    video.style.height = "auto";
    video.style.zIndex = "9999";
    video.style.opacity = "0.5";

    document.body.appendChild(video);

    await player.start();
    await video.play();

    player.syncWithVideo(video);
};