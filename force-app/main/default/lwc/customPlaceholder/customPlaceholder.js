import { LightningElement, api, track } from 'lwc';
import BIKE_PLACEHOLDER from '@salesforce/resourceUrl/bike_assets';

export default class CustomPlaceholder extends LightningElement {
  @api
  message = '';
  @track
  bikelogoUrl = BIKE_PLACEHOLDER + '/logo.svg';
}