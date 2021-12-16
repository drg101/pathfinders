
import {
    MinPriorityQueue,
} from '@datastructures-js/priority-queue';

export default class Grid {
    //size in wxh
    //range in min->max
    //random seed can just be int
    constructor(size, range, randomSeed, heurStrength) {
        // this.rng = new Math.seedrandom(randomSeed);
        this.heurStrength = heurStrength;
        this.noise = noise.seed(randomSeed);
        this.grid = []
        this.size = size
        this.range = range;
        this.span = range[1] - range[0]
        this.at = [0, 0]
        this.done = false;
        this.visited = new Set()
        this.parents = {}
        for (let r = 0; r < size[1]; r++) {
            this.grid.push([])
            for (let c = 0; c < size[0]; c++) {
                // console.log({yeet: (noise.perlin2(c / size[0], r / size[1]) + 1) / 2})
                this.grid[r].push(Math.floor((noise.perlin2(c / 100, r / 100) + 1) / 2 * this.span) + range[0])
            }
        }

        this.finishPoint = this.rowColToEncPoint(size[1] - 1, size[0] - 1)
        this.queue = new MinPriorityQueue({
            priority: (n) => {
                return n.weight + n.heuristic
            }
        });

        // this.visited.add(0)
        // this.weightTo[0] = 0
        this.queue.enqueue({ point: 0, weight: 0, heuristic: 0, parent: null })
    }

    render(ctx, topLeft, renderedSize) {
        const wpp = renderedSize[0] / this.size[0]
        const hpp = renderedSize[1] / this.size[1]

        for (let r = 0; r < this.size[1]; r++) {
            for (let c = 0; c < this.size[0]; c++) {
                ctx.fillStyle = `rgb(${255 - (this.grid[r][c] - this.range[0]) / this.span * 255},${255 - (this.grid[r][c] - this.range[0]) / this.span * 255}, ${255 - (this.grid[r][c] - this.range[0]) / this.span * 255})`;
                ctx.fillRect(topLeft[0] + c * wpp, topLeft[1] + r * hpp, wpp, hpp);
                ctx.globalAlpha = 1
            }
        }

        // ctx.fillStyle = `black`;
        // [...this.visited].forEach((p) => {
        //     const {r,c} = this.encPointToRowCol(p)
        //     ctx.fillRect(topLeft[0] + c * wpp, topLeft[1] + r * hpp, wpp, hpp);
        // })
    }

    encPointToRowCol(encPoint) {
        const r = Math.floor(encPoint / this.size[0])
        const c = encPoint % this.size[0]
        return { r, c }
    }

    rowColToEncPoint(r, c) {
        return this.size[0] * r + c
    }

    heurToGoal(r, c) {
        const y = Math.abs(this.size[0] - r)
        const x = Math.abs(this.size[1] - c)

        // console.log(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)))
        // return 1000
        return Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) * this.heurStrength
    }

    getUnvisitedAdjacent(cur) {
        // console.log({cur})
        const { r, c } = this.encPointToRowCol(cur.point)


        const points = []
        for (let tr of [-1, 0, 1]) {
            if (!(0 <= r + tr && r + tr < this.size[1])) {
                continue;
            }
            for (let tc of [-1, 0, 1]) {
                if (!(0 <= c + tc && c + tc < this.size[0])) {
                    continue;
                }
                if (tr === 0 && tc === 0) {
                    continue
                }
                const p = this.rowColToEncPoint(r + tr, c + tc)
                if (!this.visited.has(p)) {
                    points.push({ weight: cur.weight + Math.max(this.grid[r+tr][c+tc] - this.grid[r][c], 1), point: p, heuristic: this.heurToGoal(r+tr, c+tc) })
                }
            }
        }
        
        return points
    }

    step(ctx, renderedSize, topLeft) {
        if (this.done) {
            return;
        }
        const wpp = renderedSize[0] / this.size[0]
        const hpp = renderedSize[1] / this.size[1]
        if (!this.queue.isEmpty()) {
            // let arr = Object.entries(this.weightTo)
            // arr = arr.sort((a,b) => a[1] - b[1])
            let current = this.queue.dequeue()
            // console.log({current})
            while (this.visited.has(current.element.point)) {
                current = this.queue.dequeue()
            }
            this.parents[current.element.point] = current.element.parent;
            // console.log(this.queue.size())
            // console.log(arr[0])
            // const current = Number(arr[0][0])
            const { r, c } = this.encPointToRowCol(current.element.point)
            ctx.fillStyle = `cyan`;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(topLeft[0] + c * wpp, topLeft[1] + r * hpp, wpp, hpp);
            ctx.globalAlpha = 1
            // const weightCurrent = this.weightTo[arr[0][0]];
            // delete this.weightTo[arr[0][0]]
            // if(current.priority !== this.weightTo[current.element.point]){
            //     console.log("FUCK")
            // }
            this.visited.add(current.element.point)
            const adj = this.getUnvisitedAdjacent(current.element)
            for (const a of adj) {
                this.queue.enqueue({ point: a.point, weight: a.weight, heuristic: a.heuristic, parent: current.element.point })
                if (a.point === this.finishPoint) {
                    this.done = true;
                    this.parents[a.point] = current.element.point;
                    let backpath = a.point
                    ctx.fillStyle = `red`;
                    while (backpath != null) {
                        const { r, c } = this.encPointToRowCol(backpath)
                        const rb = r 
                        const cb = c
                        ctx.fillRect(topLeft[0] + cb * wpp, topLeft[1] + rb * hpp, wpp, hpp);
                        backpath = this.parents[backpath]
                    }
                    console.log(a.weight)
                    // console.log(this.parents[current.element.point])
                    
                }
            }
            // console.log(this.queue.size())
        }
    }
}