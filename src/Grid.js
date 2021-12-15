
import {
    MinPriorityQueue,
} from '@datastructures-js/priority-queue';

export default class Grid {
    //size in wxh
    //range in min->max
    //random seed can just be int
    constructor(size, range, randomSeed) {
        // this.rng = new Math.seedrandom(randomSeed);
        this.noise = noise.seed(randomSeed);
        this.grid = []
        this.size = size
        this.range = range;
        this.span = range[1] - range[0]
        this.at = [0, 0]
        this.done = false;
        this.visited = new Set()
        this.weightTo = {}
        for (let r = 0; r < size[1]; r++) {
            this.grid.push([])
            for (let c = 0; c < size[0]; c++) {
                // console.log({yeet: (noise.perlin2(c / size[0], r / size[1]) + 1) / 2})
                this.grid[r].push(Math.floor((noise.perlin2(c / 20, r / 20) + 1) / 2 * this.span) + range[0])
            }
        }

        this.queue = new MinPriorityQueue({
            priority: (n) => {
                return n.weight
            }
        });

        // this.visited.add(0)
        // this.weightTo[0] = 0
        this.queue.enqueue({ point: 0, weight: 0 })
    }

    render(ctx, topLeft, renderedSize) {
        const wpp = renderedSize[0] / this.size[0]
        const hpp = renderedSize[1] / this.size[1]

        for (let r = 0; r < this.size[1]; r++) {
            for (let c = 0; c < this.size[0]; c++) {
                ctx.fillStyle = `hsl(${(this.grid[r][c] - this.range[0]) / this.span * 360} 100% 60%)`;
                ctx.fillRect(topLeft[0] + c * wpp, topLeft[1] + r * hpp, wpp, hpp);
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
        
        // return 0
        return (x+y) / 5000
    }

    getUnvisitedAdjacent(cur) {
        // console.log({cur})
        const { r, c } = this.encPointToRowCol(cur.point)


        const points = []
        if (1 <= r) {
            const p = this.rowColToEncPoint(r - 1, c)
            if (!this.visited.has(p)) {
                points.push({ weight: cur.weight + (this.grid[r - 1][c] - this.grid[r][c]) + this.heurToGoal(r-1,c), point: p })
            }
        }
        if (r < this.size[1] - 1) {
            const p = this.rowColToEncPoint(r + 1, c)
            if (!this.visited.has(p)) {
                points.push({ weight: cur.weight + (this.grid[r + 1][c] - this.grid[r][c]) + this.heurToGoal(r+1,c), point: p })
            }
        }

        if (1 <= c) {
            const p = this.rowColToEncPoint(r, c - 1)
            if (!this.visited.has(p)) {
                points.push({ weight: cur.weight + (this.grid[r][c-1] - this.grid[r][c]) + this.heurToGoal(r,c-1), point: p })
            }
        }
        if (c < this.size[0] - 1) {
            const p = this.rowColToEncPoint(r, c+1)
            if (!this.visited.has(p)) {
                points.push({ weight: cur.weight + (this.grid[r][c+1] - this.grid[r][c]) + this.heurToGoal(r,c+1), point: p })
            }
        }
        return points
    }

    step(ctx, renderedSize) {
        const wpp = renderedSize[0] / this.size[0]
        const hpp = renderedSize[1] / this.size[1]
        if (!this.queue.isEmpty()) {
            // let arr = Object.entries(this.weightTo)
            // arr = arr.sort((a,b) => a[1] - b[1])
            let current = this.queue.dequeue()
            // console.log({current})
            while(this.visited.has(current.element.point)) {
                current = this.queue.dequeue()
            }
            // console.log(this.queue.size())
            // console.log(arr[0])
            // const current = Number(arr[0][0])
            const {r,c} = this.encPointToRowCol(current.element.point)
            ctx.fillStyle = `black`;
            ctx.fillRect(c * wpp, r * hpp, wpp, hpp);
            // const weightCurrent = this.weightTo[arr[0][0]];
            // delete this.weightTo[arr[0][0]]
            // if(current.priority !== this.weightTo[current.element.point]){
            //     console.log("FUCK")
            // }
            this.visited.add(current.element.point)
            const adj = this.getUnvisitedAdjacent(current.element)
            for(const a of adj){
                this.queue.enqueue({point: a.point, weight: a.weight})
            }
            // console.log(this.queue.size())
        }
    }
}