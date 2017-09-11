
/**
 * An object used to store the data for a rect, used in grid data as
 * a storage for the data processes from the indexs data
 * @author Owen Anderson
 */
export class ImageRectData{
    
    /**
     * The default constructor for the image rect data class
     * @author Owen Anderson
     * 
     * @param {number} index - The index of the image that this rect is for
     * @param {number} rowStart - The row that the image rect starts in
     * @param {number} rowEnd - The row that the image rect ends in
     * @param {number} colStart - The column that the image rect starts in
     * @param {number} colEnd - The column that the image rect ends in
     */
    constructor(index, rowStart, rowEnd, colStart, colEnd){
        this.index = index;
        this.rowStart = rowStart;
        this.rowEnd = rowEnd;
        this.colStart = colStart;
        this.colEnd = colEnd;
    }
}