import LightningDatatable from 'lightning/datatable';
import imageTableControl from './imageTableControl.html';

export default class ImageDataTable extends LightningDatatable  {
    static customTypes = {
        image: {
            template: imageTableControl
        }
    };
}