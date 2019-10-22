import { LightningElement, api, wire } from 'lwc';
// import {fireEvent} from 'c/pubsub';
// import {CurrentPageReference } from 'lightning/navigation';
export default class ProductTileCustom extends LightningElement {
  _product;
  productName = '';
  pictureUrl = '';
  msrp = 0;

  @api
  get product() {
    return this._product;
  }

  set product(value) {
    this._product = value;
    this.productName = value.Name;
    this.pictureUrl = value.Picture_URL__c;
    this.msrp = value.MSRP__c;
  }

  // @wire(CurrentPageReference)
  // pageRef;

  handleOnClick(event) {
    console.log('Product clicked');

    this.dispatchEvent(new CustomEvent('selected', {
      detail: this._product.Id
    }));
  }


}