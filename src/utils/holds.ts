type Point = { x: number; y: number };

// Returns true if `point` is inside `polygon` (array of {x, y} vertices).
// Uses ray casting: shoot a ray to the right, count edge crossings.
// Odd number of crossings = inside.
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const straddles = (yi > point.y) !== (yj > point.y);
        const crossingX = xi + (point.y - yi) / (yj - yi) * (xj - xi);

        if (straddles && point.x < crossingX) {
            inside = !inside;
        }
    }

    return inside;
}

// Returns the hold whose polygon contains `point`, or null if none.
export function findHoldAtPoint<T extends { points: Point[] | null }>(point: Point, holds: T[]): T | null {
    for (const hold of holds) {
        if (!hold.points) continue;
        if (pointInPolygon(point, hold.points)) {
            return hold;
        }
    }
    return null;
}   
