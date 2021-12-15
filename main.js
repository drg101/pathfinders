import './style.css'
import Grid from './src/Grid'

const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const djGrid = new Grid([500,500], [1,50], 42)


// for (let i = 0; i < 10; i++){

// }
djGrid.render(ctx, [0,0], [ctx.canvas.width / 2, ctx.canvas.height])
setInterval(() => {
    for (let i = 0; i < 40; i++){
        djGrid.step(ctx, [ctx.canvas.width / 2, ctx.canvas.height])
    }
    // djGrid.render(ctx, [0,0], [ctx.canvas.width / 2, ctx.canvas.height])
},1)
// for (let i =0; i < 100000; i++){
//     djGrid.step(ctx, [ctx.canvas.width / 2, ctx.canvas.height])
// }
