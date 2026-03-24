let trajectoriesCanvas = [];
let animationIdCanvas = null;

window.onload = () => { initCanvas(); };

function getParams() {
    const x0 = parseFloat(document.getElementById('x0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const v0 = parseFloat(document.getElementById('v0').value);
    const a = parseFloat(document.getElementById('a').value);
    const angleRad = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
    
    return { 
        x0, y0, color: document.getElementById('color').value,
        v0x: v0 * Math.cos(angleRad), v0y: v0 * Math.sin(angleRad),
        ax: a * Math.cos(angleRad), ay: a * Math.sin(angleRad)
    };
}

function initCanvas() {
    const canvas = document.getElementById('myCanvas');
    drawAxesAndGrid(canvas.getContext('2d'), canvas.width, canvas.height);
}

function drawAxesAndGrid(ctx, width, height) {
    ctx.strokeStyle = "#e0e0e0"; ctx.setLineDash([5, 5]); 
    ctx.fillStyle = "#666"; ctx.font = "12px Arial";
    for (let x = 0; x <= width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        ctx.fillText(x, x + 5, height - 5);
    }
    for (let y = 0; y <= height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        if (y !== height) ctx.fillText(height - y, 5, y - 5);
    }
    ctx.setLineDash([]); 
}

function launchCanvas() {
    const params = getParams();
    trajectoriesCanvas.push({ params, points: [], x: params.x0, y: params.y0, t: 0, isActive: true });
    if (!animationIdCanvas) animateCanvas();
}

function animateCanvas() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxesAndGrid(ctx, canvas.width, canvas.height);

    let isAnyActive = false;
    trajectoriesCanvas.forEach(traj => {
        if (traj.isActive) {
            traj.t += 0.05;
            traj.x = traj.params.x0 + traj.params.v0x * traj.t + (traj.params.ax * traj.t * traj.t) / 2;
            traj.y = traj.params.y0 + traj.params.v0y * traj.t + (traj.params.ay * traj.t * traj.t) / 2;
            traj.points.push({ x: traj.x, y: traj.y });
            if (traj.x > canvas.width || traj.y > canvas.height || traj.y < 0) traj.isActive = false;
            else isAnyActive = true;
        }
        if (traj.points.length > 0) {
            ctx.beginPath(); ctx.moveTo(traj.params.x0, canvas.height - traj.params.y0);
            traj.points.forEach(p => ctx.lineTo(p.x, canvas.height - p.y));
            ctx.strokeStyle = traj.params.color; ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(traj.x, canvas.height - traj.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = traj.params.color; ctx.fill(); ctx.stroke();
    });

    animationIdCanvas = isAnyActive ? requestAnimationFrame(animateCanvas) : null;
}

function clearAll() {
    if (animationIdCanvas) cancelAnimationFrame(animationIdCanvas);
    animationIdCanvas = null; trajectoriesCanvas = [];
    const canvas = document.getElementById('myCanvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
}

function launchD3() { alert("D3 ще не реалізовано!"); }