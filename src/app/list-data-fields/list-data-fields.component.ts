import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { EmitterService } from '../shared/emitter.service';
@Component({
  selector: 'edf-list-data-fields',
  templateUrl: './list-data-fields.component.html',
  styleUrls: ['./list-data-fields.component.scss']
})
export class ListDataFieldsComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() parentName = '';
  @Input() isParent: boolean;
  @Input() prevState;
  showLevelOne = false;
  selectedField: any;
  imagesPath;// = ImagesPath;
  public expandKey;
  isParentClicked = false;
  renderHtml: any;


  emitter = EmitterService.get("channel_1");

  constructor() {

  }

  ngOnInit() {
    console.log(this.parentName);
  }
  ngOnChanges(changes: SimpleChanges) {
  }

  /**
   * 
   * @param event key-value pair
   */
  onParentFieldClick(event) {

    let fieldLen;
    if (event.selected && event.value) {
      this.isParentClicked = true;

      /////////////////////////////////////////////////////////****************************** */
      event.value.forEach(field => {
        if (this.isArray(field.value)) {
          fieldLen = field.value.length;
        }
        if (!field.selected) {               // if chile field is already selected

          field.selected = true;               // set field status
          if (!field.isParent) {           // update parent name
            field.parentName = this.parentName + '.' + event.key;
          }
          this.emitter.emit(field);
        }
        if (fieldLen > 0) {
          field.isParent = true;
          this.parentName = field.parentName;
          this.onParentFieldClick(field);
        }

      })
    } else if (!event.selected && event.value) {

      this.isParentClicked = false;
      /////////////////////////////////////////////////////////****************************** */
      event.value.forEach(field => {

        if (this.isArray(field.value)) {
          fieldLen = field.value.length;
        }
        /////////////////////////////////////////////////////////****************************** */
        if (field.selected) {               // if chile field is already not-selected
          field.selected = false;
          if (!field.isParent) {
            field.parentName = this.parentName + '.' + event.key;
          }
          this.emitter.emit(field);
        }

        if (fieldLen > 0) {
          this.parentName = field.parentName;

          field.isParent = true;
          this.onParentFieldClick(field);
        }
      })
    }
  }


  isArray(obj: any) {
    return Array.isArray(obj);
  }
  isObject(obj: any): boolean {
    return typeof (obj) === 'object' ? true : false;
  }

  saveDataField(event: any) {
    this.selectedField = { ...event };
    event.parentName = this.parentName;
    this.emitter.emit(event);
    this.valueSelected(event);
  }

  /**
   * @param event 
   */
  valueSelected(event: any) {
    let fieldLen = 0;
    if (this.isArray(event.value)) {
      fieldLen = event.value.length;
    }
    if (!event.selected) {
      event.selected = true;
      this.selectedField.selected = true;
      //     this.emitter.emit(this.selectedField);                   // re-evaluate abou ti 
    } else {
      event.selected = false;
      this.selectedField.selected = false;
    }
    if (fieldLen > 0) {
      event.isParent = true;
      this.onParentFieldClick(event);
    }
    return;
  }
  private setupPreviousState() {
    if (!this.prevState || !(this.prevState.length > 0) || !(this.data)) {
      return;
    }
    this.prevState.forEach(event => {
      this.setDefaultField(event);
    });

  }

  private setDefaultField(dataField) {
    var name = dataField.name.split(".");
    this.setDefaultFieldsSelected(name, 0, this.data, name.length, dataField); //  pass initial values
    return;
  }

  setDefaultFieldsSelected(name: [], index: number, fields, levelIndex, dataField) {
    let _fields = [];
    if (name.length > index) {
      if (levelIndex < 2) {   // final step to mark as selected
        fields.forEach(field => {
          if (field.key === name[index]) {
            field.selected = true;
            this.emitter.emit({ dataField, status: true, selected: true })    // re-evaluate
            return;
            // mark as selected
          }
        });
        return;
      } else {    // repeat on json, until heirarchy
        fields.forEach(field => {
          if (field.key === name[index]) {
            _fields = field.value;
          }
        });
        index += 1;
        levelIndex -= 1;
        this.setDefaultFieldsSelected(name, index, _fields, levelIndex, dataField);
      }

    }

  }

  /**
   * @param event 
   */
  private setDefaultFields(event) {
    const status = true;
    this.prevState.forEach((field) => {
      if (field.name === event.key) {
        this.emitter.emit({ field, status });              // re-evaluate....
        event.selected = true;
        return;
      }
    });

    if (this.isArray(event.value)) {
      event.value.forEach(child => {
        this.setDefaultFields(child);
      });
    }
    return;
  }

  /**
   * @param nameToExpand On json-field, toggle expand
   */
  toggleLevel(nameToExpand) {
    if (!nameToExpand.isOpen) {
      nameToExpand.isOpen = true;
    } else {
      nameToExpand.isOpen = false;
    }
  }


}
