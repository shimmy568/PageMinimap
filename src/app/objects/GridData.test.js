import {
    GridData
} from './GridData.js';

let indexs = [
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 2, 2, 2],
    [0, 0, 2, 2, 2]
];
let columSizes = [50, '50px', '50px', 100, '30%'];
let rowSizes = ['30%', 'auto', 150, '20px'];

//Basic test for the grid data
test('Creates Grid Data Object', () => {
    let data = new GridData(columSizes, rowSizes, indexs);

    expect(data.colSizes).toEqual(['50px', '50px', '50px', '100px', '30%']);
    expect(data.rowSizes).toEqual(['30%', 'auto', '150px', '20px', 'auto']);
    expect(data.rectDatas).toEqual([{
            index: 0,
            rowStart: 1,
            rowEnd: 6,
            colStart: 1,
            colEnd: 3
        },
        {
            index: 1,
            rowStart: 1,
            rowEnd: 4,
            colStart: 3,
            colEnd: 6
        },
        {
            index: 2,
            rowStart: 4,
            rowEnd: 6,
            colStart: 3,
            colEnd: 6
        }
    ]);
});