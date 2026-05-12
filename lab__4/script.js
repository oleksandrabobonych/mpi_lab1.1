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