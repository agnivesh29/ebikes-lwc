import { LightningElement, wire, track } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import {CurrentPageReference} from 'lightning/navigation';
import {registerListener, unregisterAllListeners} from 'c/pubsub';

import NAME from '@salesforce/schema/product__c.Name';
import CATEGORY from '@salesforce/schema/product__c.Category__c';
import MSRP from '@salesforce/schema/product__c.MSRP__c';
import PICTURE_URL from '@salesforce/schema/product__c.Picture_URL__c';
import BATTERY from '@salesforce/schema/product__c.Battery__c';
import CHARGER from '@salesforce/schema/product__c.Charger__c';
import MOTOR from '@salesforce/schema/product__c.Motor__c';
import MATERIAL from '@salesforce/schema/product__c.Material__c';
import FORK from '@salesforce/schema/product__c.Fork__c';
import FRONT_BRAKE from '@salesforce/schema/product__c.Front_Brakes__c';
import REAR_BRAKE from '@salesforce/schema/product__c.Rear_Brakes__c';

const fields = [
  NAME,
  CATEGORY,
  MSRP,
  PICTURE_URL,
  BATTERY,
  CHARGER,
  MOTOR,
  MATERIAL,
  FORK,
  FRONT_BRAKE,
  REAR_BRAKE
];

export default class ProductCardCustom extends LightningElement {
    @track
    productId;
    product;
    productErr;
    @track
    productString;
    @wire(CurrentPageReference)
    pageRef;
    placeholderImage = ''

    @wire(getRecord, {'recordId': '$productId', 'fields': fields})
    product;
    // wiredGetProduct({data,error}) {
    //   if(data)
    //     this.product = data;
    //   else if(error)
    //     this.productErr = error;
    // }

    handleProductSelection(event) {
      this.productId = event;
    }

    connectedCallback() {
      registerListener('productSelected', this.handleProductSelection, this);
    }

    disconnectedCallback() {
      unregisterAllListeners(this);
    }
}