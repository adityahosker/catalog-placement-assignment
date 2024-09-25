const fs = require('fs');

// Helper function to decode y values from different bases
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Helper function to create the matrix for the system of equations
function createMatrix(points, degree) {
    const A = [];
    const Y = [];

    for (let i = 0; i < points.length; i++) {
        let x = points[i][0];
        let row = [];
        
        // Fill the row with x^m, x^(m-1), ..., x^1, 1 (for the constant term)
        for (let j = degree; j >= 0; j--) {
            row.push(Math.pow(x, j));
        }

        A.push(row); // Add row to matrix A
        Y.push(points[i][1]); // Add corresponding y value to vector Y
    }

    return { A, Y };
}

// Gaussian elimination to solve AX = Y
function gaussianElimination(A, Y) {
    const n = A.length;

    for (let i = 0; i < n; i++) {
        // Partial pivoting
        let max = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(A[j][i]) > Math.abs(A[max][i])) {
                max = j;
            }
        }

        // Swap rows in A and Y
        [A[i], A[max]] = [A[max], A[i]];
        [Y[i], Y[max]] = [Y[max], Y[i]];

        // Normalize row i
        for (let j = i + 1; j < n; j++) {
            let factor = A[j][i] / A[i][i];
            for (let k = i; k < n; k++) {
                A[j][k] -= factor * A[i][k];
            }
            Y[j] -= factor * Y[i];
        }
    }

    // Back substitution
    const X = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * X[j];
        }
        X[i] = (Y[i] - sum) / A[i][i];
    }

    return X;
}

// Main function to parse input, decode, and solve for the constant term
function findConstantTerm(inputFile) {
    // Read and parse JSON file
    const rawData = fs.readFileSync(inputFile);
    const inputData = JSON.parse(rawData);

    // Extract keys
    const n = inputData['keys']['n'];
    const k = inputData['keys']['k'];

    // Store the points (x, y) after decoding
    let points = [];

    for (let i = 1; i <= n; i++) {
        if (inputData[i]) {
            let x = parseInt(i);
            let base = parseInt(inputData[i]['base']);
            let yEncoded = inputData[i]['value'];
            let yDecoded = decodeValue(base, yEncoded);
            points.push([x, yDecoded]);
        }
    }

    // Degree of the polynomial is k-1
    const degree = k - 1;
    const { A, Y } = createMatrix(points.slice(0, k), degree);

    // Solve for the coefficients using Gaussian elimination
    const coefficients = gaussianElimination(A, Y);

    // The constant term is the last coefficient (c)
    const constantTerm = coefficients[coefficients.length - 1];
    console.log("The constant term (c) is:", constantTerm);
}

// Call the function with the input JSON file
findConstantTerm('input.json');
