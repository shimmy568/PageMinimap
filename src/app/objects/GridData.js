
/**
 * The class for the griddata used in the gallery component
 */
class GridData{

    /**
     * The default constuctor
     * @author Owen Anderson
     * @throws If the data is malformed or the indexs are arranged in a non rectanular format
     * 
     * @param {Array<string|number>} columSizes - The sizes of the colums, if a number it defaults to px
     * @param {Array<string|number>} rowSizes - The sizes for the rows, same format as colums
     * @param {Array<Array<number>>} indexs - The image index that will be contained in the grid
     */
    constructor(columSizes, rowSizes, indexs){
        this.colSizes = columSizes;
        this.rowSizes = rowSizes;

        this.__convertNumbers();

        this.imageStyleInfo = this.__convertIndexsToStyleInfo(indexs);
    }

    /**
     * Converts the number values in colSizes and rowSizes to strings with the px suffex
     * @author Owen Anderson
     * 
     * @returns {void}
     */
    __convertNumbers(){

        //Convert all colsize values to string
        for (let i = 0; i < this.colSizes.length; i++) {
            if(typeof this.colSizes[i] === 'number'){
                this.colSizes[i] = this.colSizes[i] + 'px';
            } else if(typeof this.colSizes[i] !== 'string'){
                throw new Error('The colum sizes must be either a string or a number');
            }
        }

        //Do the same for rows
        for (let i = 0; i < this.rowSizes.length; i++) {
            if(typeof this.rowSizes[i] === 'number'){
                this.rowSizes[i] = this.rowSizes[i] + 'px';
            }else if(typeof this.rowSizes[i] !== 'string'){
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
    __convertIndexsToStyleInfo(indexs){
        for(let i = 0; i < indexs.length; i++){
            
        }
    }
}