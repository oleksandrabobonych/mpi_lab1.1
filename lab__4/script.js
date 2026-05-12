// Вхідні дані Варіанту 4 
const dataSets = {
    5: [
        {x: -2, y: 4.1}, {x: -1, y: 1.2}, {x: 0, y: 0.1}, {x: 1, y: 0.9}, {x: 2, y: 3.8}
    ],
    9: [
        {x: -4, y: 16}, {x: -3, y: 9.1}, {x: -2, y: 4.2}, {x: -1, y: 1.1}, {x: 0, y: 0.1},
        {x: 1, y: 1.2}, {x: 2, y: 4.3}, {x: 3, y: 9.2}, {x: 4, y: 16.1}
    ],
    20: [
        {x: 0, y: 0.0}, {x: 0.3, y: 0.3}, {x: 0.6, y: 0.56}, {x: 0.9, y: 0.78}, {x: 1.2, y: 0.93},
        {x: 1.5, y: 1.0}, {x: 1.8, y: 0.97}, {x: 2.1, y: 0.86}, {x: 2.4, y: 0.68}, {x: 2.7, y: 0.43},
        {x: 3.0, y: 0.14}, {x: 3.3, y: -0.16}, {x: 3.6, y: -0.44}, {x: 3.9, y: -0.69}, {x: 4.2, y: -0.87},
        {x: 4.5, y: -0.98}, {x: 4.8, y: -1.0}, {x: 5.1, y: -0.92}, {x: 5.4, y: -0.77}, {x: 5.7, y: -0.55}
    ]
};

let currentN = 5;

// 1. Інтерполяційний поліном Лагранжа
function lagrangeInterpolation(data, x) {
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        let term = data[i].y;
        for (let j = 0; j < data.length; j++) {
            if (i !== j) {
                term = term * (x - data[j].x) / (data[i].x - data[j].x);
            }
        }
        result += term;
    }
    return result;
}

// 2. Квадратичний МНК (m=2): y = ax^2 + bx + c
function solveQuadraticLSM(data) {
    const n = data.length;
    let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sxy = 0, sx2y = 0;

    data.forEach(p => {
        const x2 = p.x * p.x;
        sx += p.x; sx2 += x2; sx3 += x2 * p.x; sx4 += x2 * x2;
        sy += p.y; sxy += p.x * p.y; sx2y += x2 * p.y;
    });

    // Система лінійних рівнянь (Матриця 3x3)
    const A = [
        [sx4, sx3, sx2],
        [sx3, sx2, sx],
        [sx2, sx, n]
    ];
    const B = [sx2y, sxy, sy];

    // Розв'язок методом Крамера
    const det = (m) => 
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    const dMain = det(A);
    const d1 = det([ [B[0], A[0][1], A[0][2]], [B[1], A[1][1], A[1][2]], [B[2], A[2][1], A[2][2]] ]);
    const d2 = det([ [A[0][0], B[0], A[0][2]], [A[1][0], B[1], A[1][2]], [A[2][0], B[2], A[2][2]] ]);
    const d3 = det([ [A[0][0], A[0][1], B[0]], [A[1][0], A[1][1], B[1]], [A[2][0], A[2][1], B[2]] ]);

    return { a: d1/dMain, b: d2/dMain, c: d3/dMain };
}

function draw() {
    const data = dataSets[currentN];
    const mode = document.getElementById('modeSelect').value;
    const lsm = solveQuadraticLSM(data);
    
    const margin = {top: 30, right: 30, bottom: 50, left: 50},
          width = 850 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#chart").html("").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.x)).range([0, width]);
    const y = d3.scaleLinear().domain([d3.min(data, d => d.y)-1, d3.max(data, d => d.y)+1]).range([height, 0]);

    // Сітка
    svg.append("g").attr("class", "grid").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickSize(-height).tickFormat(""));
    svg.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const lineGen = d3.line().x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveMonotoneX);
    const steps = d3.range(d3.min(data, d => d.x), d3.max(data, d => d.x), 0.05);

    // 1. Інтерполяція
    if (mode === 'all' || mode === 'interpolation') {
        const interpPath = steps.map(px => ({x: px, y: lagrangeInterpolation(data, px)}));
        const path = svg.append("path").datum(interpPath).attr("class", "line-interp").attr("d", lineGen);
        
        const len = path.node().getTotalLength();
        path.attr("stroke-dasharray", len).attr("stroke-dashoffset", len)
            .transition().duration(2000).attr("stroke-dashoffset", 0);
    }

    // 2. МНК та Залишки
    if (mode === 'all' || mode === 'lsm') {
        const lsmPath = steps.map(px => ({x: px, y: lsm.a*px**2 + lsm.b*px + lsm.c}));
        svg.append("path").datum(lsmPath).attr("class", "line-lsm").attr("d", lineGen)
           .style("opacity", 0).transition().duration(1000).style("opacity", 1);

        // Залишки (Residuals)
        let totalError = 0;
        data.forEach(p => {
            const yPred = lsm.a*p.x**2 + lsm.b*p.x + lsm.c;
            totalError += Math.abs(p.y - yPred);
            svg.append("line").attr("class", "residual-line")
               .attr("x1", x(p.x)).attr("y1", y(p.y))
               .attr("x2", x(p.x)).attr("y2", y(p.y))
               .transition().delay(1000).duration(1000).attr("y2", y(yPred));
        });

        document.getElementById('formula-lsm').innerHTML = `y = ${lsm.a.toFixed(3)}x² + ${lsm.b.toFixed(3)}x + ${lsm.c.toFixed(3)}`;
        document.getElementById('metrics').innerText = `MAE (Середня похибка): ${(totalError/data.length).toFixed(4)}`;
    }

    // Точки та Tooltip
    const tooltip = d3.select("#tooltip");
    svg.selectAll(".dot").data(data).enter().append("circle")
        .attr("class", "dot").attr("cx", d => x(d.x)).attr("cy", d => y(d.y)).attr("r", 6)
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1).html(`X: ${d.x.toFixed(2)}<br>Y: ${d.y.toFixed(2)}`)
                   .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
}

function setData(n) { currentN = n; draw(); }
function updateView() { draw(); }
window.onload = draw;