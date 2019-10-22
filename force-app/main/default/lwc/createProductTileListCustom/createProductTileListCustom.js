import { LightningElement, api, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import {CurrentPageReference} from 'lightning/navigation'
import {registerListener, fireEvent, unregisterAllListeners} from 'c/pubsub';

export default class CreateProductTileListCustom extends LightningElement {
  @track filters = {};
  @track pageNumber = 1;

  @wire(getProducts, {filters: '$filters', pageNumber: '$pageNumber'})
  products;

  @wire(CurrentPageReference)
  pageRef;

  connectedCallback() {
    registerListener('filterChange', this.handleFilterChange, this);
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  handleFilterChange(filters){
    this.filters = {...filters}
    this.pageNumber = 1;
  }

  notifyproductselection(event) {
    let productId = event.detail;
    fireEvent(this.pageRef,'productSelected', productId);
  }

}