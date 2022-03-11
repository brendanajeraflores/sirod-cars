import { LightningElement,api } from 'lwc';

export default class ImageDataType extends LightningElement {
    @api url;
    @api altText;
}