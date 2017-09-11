import {
    ImageRectData
} from './ImageRectData.js';

test('Properly give bounds for the rectangle', () => {
    let rectData = new ImageRectData(5, 2, 3, 2, 9);

    expect(rectData.index).toBe(5);
    expect(rectData.rowStart).toBe(2);
    expect(rectData.rowEnd).toBe(3);
    expect(rectData.colStart).toBe(2);
    expect(rectData.colEnd).toBe(9);
});