import {
    ImageRectData
} from './ImageRectData.js';

/**
 * The class for the griddata used in the gallery component
 */
export class GridData {

    /**
     * The default constuctor
     * @author Owen Anderson
     * @throws If the data is malformed or the indexs are arranged in a non rectanular format
     * 
     * @param {Array<string|number>} columSizes - The sizes of the colums, if a number it defaults to px
     * @param {Array<string|number>} rowSizes - The sizes for the rows, same format as colums
     * @param {Array<Array<number>>} indexs - The image index that will be contained in the grid
     */
    constructor(columSizes, rowSizes, indexs) {
        this.colSizes = columSizes;
        this.rowSizes = rowSizes;

        this.rectDatas = [];

        this.__convertNumbers(indexs.length, indexs[0].length);

        this.imageStyleInfo = this.__convertIndexsToStyleInfo(indexs);
    }

    /**
     * Converts the number values in colSizes and rowSizes to strings with the px suffex
     * @author Owen Anderson
     * 
     * @param {number} rowNum - The number of rows in the grid
     * @param {number} colNum - The number of columns in the grid
     * 
     * @returns {void}
     */
    __convertNumbers(rowNum, colNum) {

        //Replace any missing values with 1fr for both rowsizes and colsizes
        for(let i = 0; i < rowNum; i++){
            if(this.rowSizes[i] == null){
                this.rowSizes[i] = '1fr';
            }
        }
        for(let i = 0; i < colNum; i++){
            if(this.colSizes[i] == null){
                this.colSizes[i] = '1fr';
            }
        }

        //Convert all the row size values to string
        for (let i = 0; i < this.rowSizes.length; i++) {
            if (typeof this.rowSizes[i] === 'number') {
                this.rowSizes[i] = this.rowSizes[i] + 'px';
            } else if (typeof this.rowSizes[i] !== 'string') {
                throw new Error('The colum sizes must be either a string or a number');
            }
        }

        //Convert all colsize values to string
        for (let i = 0; i < this.colSizes.length; i++) {
            if (typeof this.colSizes[i] === 'number') {
                this.colSizes[i] = this.colSizes[i] + 'px';
            } else if (typeof this.colSizes[i] !== 'string') {
                throw new Error('The colum sizes must be either a string or a number');
            }
        }
    }

    /**
     * Converts the indexs data from the constuctor to style data to be applied to the jsx
     * elements
     * @author Owen Anderson
     * @throws If the index data places images in two diffrent non connected grid spots,
     * if the grid data makes the images non rectangular or if the indexs array is non rectangular
     * 
     * @param {Array<Array<number>>} indexs - The index data passed in from the construor 
     * 
     * @returns {Array<object>} - The style data to be applied to the images
     */
    __convertIndexsToStyleInfo(indexs) {
        let indexsWidth = indexs[0].length;

        for (let i = 0; i < indexs.length; i++) {
            if (indexs[i].length !== indexsWidth) {
                throw new Error('The indexs data needs to be an rectangular 2D array');
            }
            for (let o = 0; o < indexs[0].length; o++) {
                if(indexs[i][o] !== -1){
                    if(this.rectDatas[indexs[i][o]] == null ){
                        this.rectDatas[indexs[i][o]] = this.__getDimOfRectInIndexs(indexs, i, o);
                    }
                }
            }
        }
    }

    /**
     * Gets the start and end row and column values for the rect in the indexs data
     * @author Owen Anderson
     * 
     * @param {Array<Array<number>>} indexs - The indexs data
     * @param {number} rowNum - The row number for the top right corner of the rect
     * @param {number} colNum - The column number for the top left corner of the rect
     * 
     * @returns {ImageRectData} - An object containing the values for the image rect
     */
    __getDimOfRectInIndexs(indexs, rowNum, colNum) {
        
        let imageIndex = indexs[rowNum][colNum];
        let rectWidth = -1;
        let rectHeight = -1;
        
        for (let y = rowNum; y < indexs.length; y++) {
            let curWidth = -1;
            //Check if we have reached the end of the rect
            if (indexs[y][colNum] !== imageIndex) {
                break;
            }
            for (let x = colNum; x < indexs[0].length; x++) {
                if (imageIndex !== indexs[y][x]) {
                    break;
                }
                curWidth++;
            }
            
            if (y === rowNum) {
                //If this is the first row set the rectWidth value
                rectWidth = curWidth;
            } else if (rectWidth !== curWidth) {
                // If it is any other row make sure it's the same size as the first
                throw new Error('The index data must only contains rectangles');
            }
            rectHeight++;
        }

        //Create the rect data object and make sure everything is properly indexed for the css
        //NOTE the end colum is exclusive, so thats why it's plus 2
        let rectData = new ImageRectData(
            imageIndex,
            rowNum + 1,
            rowNum + (rectHeight + 2),
            colNum + 1,
            colNum + (rectWidth + 2)
        );
        return rectData;
    }

    /**
     * Gets the image data from the rect datas array with a given index
     * @author Owen Anderson
     * 
     * @param {number} index - The index of the image data that you are getting
     * 
     * @returns {ImageRectData} - The rect data
     */
    getImageData(index){
        for(let i = 0; i < this.rectDatas.length; i++){
            if(index === this.rectDatas[i].index){
                return this.rectDatas[i];
            }
        }
        return null;
    }
}