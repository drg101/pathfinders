import './style.css'
import Grid from './src/Grid'

const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const djGrid = new Grid([500,500], [1,50], 42)

djGrid.render(ctx, [0,0], [ctx.canvas.width / 2, ctx.canvas.height])

