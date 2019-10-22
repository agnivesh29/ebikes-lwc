import { LightningElement, track, wire } from 'lwc';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import {CurrentPageReference} from 'lightning/navigation';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.level__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import {fireEvent} from 'c/pubsub';

const DELAY = 400;

export default class ProductFilterCustom extends LightningElement {
	// maxPrice = 10000;
	categoryValues = [];
	materialValues = [];
	levelValues = [];
	pageRef;

	@track categoryOptions = [];
	@track levelOptions = [];
	@track materialOptions = [];
	@track searchKey;
	@track maxPrice = 10000;

	filters = {
		"searchKey": "",
		"maxPrice": this.maxPrice,
		"categories": this.categoryValues,
		"levels": this.levelValues,
		"materials": this.materialValues
	}

	categoryValueFetchError;
	levelValuesFetchError;
	materialValuesFetchError;

	@wire(CurrentPageReference)
	pageRef;

	@wire(getPicklistValues, {recordTypeId: '012000000000000AAA', fieldApiName: CATEGORY_FIELD})
	wiredGetCategoryOptions({data, error}) {
		if(data) {
			let that = this;
			this.categoryOptions = this.getPicklistOptions(data.values);
			// all options should be selected on load.
			this.categoryOptions.forEach(function(option){
				that.categoryValues.push(option.value);
			});
			console.log('Get category wired options');
		} else if(error) {
			this.categoryValueFetchError = error
		}
	}

	@wire(getPicklistValues, {recordTypeId: '012000000000000AAA', fieldApiName: LEVEL_FIELD})
	wiredGetLevelOptions({data,error}) {
		if(data) {
			let that = this;
			this.levelOptions = this.getPicklistOptions(data.values);
			// all options should be selected on load.
			// this.levelValues = this.levelOptions;
			this.levelOptions.forEach(function(option){
				that.levelValues.push(option.value);
			});
		} else if(error) {
			this.levelValuesFetchError = error;
		}
	}

	@wire(getPicklistValues, {recordTypeId: '012000000000000AAA', fieldApiName: MATERIAL_FIELD})
	wiredGetMaterialOptions({data,error}) {
		if(data) {
			let that = this;
			this.materialOptions = this.getPicklistOptions(data.values);
			// all options should be selected on load.
			// this.materialValues = this.materialOptions;
			this.materialOptions.forEach(function(option){
				that.materialValues.push(option.value);
			});
		} else if(error) {
			this.materialValuesFetchError = error;
		}
	}

	getPicklistOptions(picklistItems) {
		let picklistOptions = [];
		picklistItems.forEach(function(picklist){
			picklistOptions.push({
				label: picklist.label,
				value: picklist.value
			});
		});
		return picklistOptions;
	}

	handleChange(event) {
		event.stopPropagation();
		event.preventDefault();

		console.log(event.target.name + ' value = '+event.detail.value + ' selected item count = '+ event.detail.value.length);
		
		if(event.target.name === "product-category") {
			this.categoryValues = event.detail.value;
			this.filters.categories = event.detail.value;
		}	else if(event.target.name === "material") {
			this.materialValues = event.detail.value;
			this.filters.materials = event.detail.value;
		} else if(event.target.name === "level") {
			this.levelValues = event.detail.value;
			this.filters.levels = event.detail.value;
		}
		
		fireEvent(this.pageRef, 'filterChange', this.filters);
	}

	handleMaxPriceChange(event) {
		event.stopPropagation();
		event.preventDefault();
		console.log('Max price value: '+ event.target.value);
		// update the max price of the filter object
		this.filters.maxPrice = event.target.value;
		// update selected max price on the reactive "maxPrice" property
		this.maxPrice = event.target.value;
		this.fireDelayedFilterChangeEvent();
	}

	handleBlur(event) {
		event.stopPropagation();
		event.preventDefault();

		//if(event.target.name === "enter-search")
		this.filters.searchKey = event.target.value;
		this.searchKey = event.target.value;
		this.fireDelayedFilterChangeEvent();
	}

	fireDelayedFilterChangeEvent() {
		window.clearTimeout(this.delayTimeout);
		
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			console.log('Fire delayed event');
			fireEvent(this.pageRef, 'filterChange', this.filters);
		}, DELAY)
	}

}