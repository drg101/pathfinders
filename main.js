import './style.css'
import Grid from './src/Grid'

const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
const GSIZE = 1000
const seed = Math.floor(Math.random() * 1000)
const djGrid = new Grid([GSIZE,GSIZE], [1,1000], seed, 0)
const astarGrid = new Grid([GSIZE,GSIZE], [1,1000], seed,1)



djGrid.render(ctx, [0,0], [ctx.canvas.width / 2, ctx.canvas.height])
astarGrid.render(ctx, [ctx.canvas.width / 2,0], [ctx.canvas.width / 2, ctx.canvas.height])

setInterval(() => {
    for (let i = 0; i < 400; i++){
        djGrid.step(ctx, [ctx.canvas.width / 2, ctx.canvas.height], [0,0])
        astarGrid.step(ctx, [ctx.canvas.width / 2, ctx.canvas.height], [ctx.canvas.width / 2,0])
    }
    // djGrid.render(ctx, [0,0], [ctx.canvas.width / 2, ctx.canvas.height])
},1)
