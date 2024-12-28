class LagrangeInterpolator {
    constructor(maxHistorySize = 5) {
        this.positionHistory = []; // Stores {x, y, heading} objects
        this.maxHistorySize = maxHistorySize;
    }

    addPosition(x, y, heading) {
        if (this.positionHistory.length >= this.maxHistorySize) {
            this.positionHistory.shift(); // Remove the oldest entry
        }
        this.positionHistory.push({ x, y, heading });
    }

    getSmoothedPosition(currentTime) {
        const n = this.positionHistory.length;
        if (n === 0) return { x: 0, y: 0, heading: 0 }; // No data

        let smoothedX = 0;
        let smoothedY = 0;
        let smoothedHeading = 0;

        for (let i = 0; i < n; i++) {
            const { x: xi, y: yiY, heading: yiHeading } = this.positionHistory[i];

            // Calculate the Lagrange basis polynomial
            let basis = 1;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    const xj = j; // Use index as the x value
                    basis *= (currentTime - xj) / (xi - xj);
                }
            }

            smoothedX += yiY * basis;
            smoothedY += this.positionHistory[i].y * basis;
            smoothedHeading += yiHeading * basis;
        }

        return { x: smoothedX, y: smoothedY, heading: smoothedHeading };
    }
}
