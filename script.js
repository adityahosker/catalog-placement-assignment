const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to calculate the coefficients of the polynomial using Lagrange interpolation
function calculateCoefficients(points) {
    const n = points.length;
    let coefficients = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let product = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                product *= (xi - points[j][0]);
            }
        }

        let lagrangeBasis = yi / product;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let factor = 1;
                for (let k = 0; k < n; k++) {
                    if (k !== i && k !== j) {
                        factor *= (points[j][0] - points[k][0]);
                    }
                }
                coefficients[j] += lagrangeBasis * factor;
            }
        }
        coefficients[i] += lagrangeBasis;
    }

    return coefficients;
}

// Function to find the constant term of the polynomial (c)
function findConstantTerm(points) {
    let coefficients = calculateCoefficients(points);
    return coefficients[0]; // The constant term c is the first coefficient
}

// Function to read JSON file and return parsed data
function readJsonFile(filename) {
    const data = fs.readFileSync(filename);
    return JSON.parse(data);
}

// Main function to handle the overall logic
function main() {
    // Read the first JSON file
    const data1 = readJsonFile('input.json');
    const points1 = [];

    // Decode the first set of points
    for (let i = 1; i <= data1.keys.n; i++) {
        if (data1[i]) {
            const base = parseInt(data1[i].base);
            const value = data1[i].value;
            const y = decodeValue(value, base);
            points1.push([i, y]); // Push (x, y) points
        }
    }

    // Calculate constant term for the first set
    const c1 = findConstantTerm(points1);
    console.log(`The constant term (c) from the first file is: ${c1}`);

    // Read the second JSON file
    const data2 = readJsonFile('input2.json');
    const points2 = [];

    // Decode the second set of points
    for (let i = 1; i <= data2.keys.n; i++) {
        if (data2[i]) {
            const base = parseInt(data2[i].base);
            const value = data2[i].value;
            const y = decodeValue(value, base);
            points2.push([i, y]); // Push (x, y) points
        }
    }

    // Calculate constant term for the second set
    const c2 = findConstantTerm(points2);
    console.log(`The constant term (c) from the second file is: ${c2}`);
}

// Run the main function
main();
