export default class Grid {
    //size in wxh
    //range in min->max
    //random seed can just be int
    constructor(size, range, randomSeed) {
        // this.rng = new Math.seedrandom(randomSeed);
        this.noise = noise.seed(randomSeed);
        this.grid = []
        this.weightGrid = []
        this.size = size
        this.range = range;
        this.span = range[1] - range[0]
        for (let r = 0; r < size[1]; r++) {
            this.grid.push([])
            this.weightGrid.push([])
            for (let c = 0; c < size[0]; c++) {
                // console.log({yeet: (noise.perlin2(c / size[0], r / size[1]) + 1) / 2})
                this.grid[r].push(Math.floor((noise.perlin2(c / 100, r / 100) + 1) / 2 * this.span) + range[0])
                this.weightGrid[r].push(Infinity)
            }
        }
    }

    render(ctx, topLeft, renderedSize) {
        const wpp = renderedSize[0] / this.size[0]
        const hpp = renderedSize[1] / this.size[1]

        for (let r = 0; r < this.size[1]; r++) {
            for (let c = 0; c < this.size[0]; c++) {
                ctx.fillStyle = `hsl(${(this.grid[r][c] - this.range[0]) / this.span * 360} 100% 60%)`;
                ctx.fillRect(topLeft[0] + c * wpp,topLeft[1] + r * hpp, wpp, hpp);
            }
        }
    }
}