import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'edf-list-data-fields',
  templateUrl: './list-data-fields.component.html',
  styleUrls: ['./list-data-fields.component.scss']
})
export class ListDataFieldsComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() nameSelected = new EventEmitter();
  @Input() prevState;
  observeable = new Observable<any>();
  showLevelOne = false;
  selectedField: any;
  imagesPath ;// = ImagesPath;
  public expandKey;
  constructor() {
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.prevState.length > 0) {
      this.setupPreviousState();
    }

  }
  isArray(obj: any) {
    return Array.isArray(obj);
  }

  saveDataField(event: any, isChild = null, label?: string) {
    this.selectedField = { ...event };
    if (label && label != '') {
      this.selectedField.key = label + '.' + event.key;      // in case of parent property
    }
    this.valueSelected(event, isChild);
  }
  valueSelected(event: any, isChild = null) {
    if (!event.selected) {
      event.selected = true;
      this.selectedField.selected = true;
      this.nameSelected.emit(this.selectedField);
    } else {
      event.selected = false;
      this.selectedField.selected = false;

      this.nameSelected.emit(this.selectedField);
    }
    if (this.isArray(event.value)) {
      event.value.forEach(field => {
        if (!isChild && !event.selected) { field.selected = true }
        else if (!isChild && event.selected) { field.selected = false }
        this.valueSelected(field, isChild);
      });
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
    this.setDefaultFielsSelected(name, 0, this.data, name.length, dataField); //  pass initial values
    return;
  }

  setDefaultFielsSelected(name: [], index: number, fields, levelIndex, dataField) {
    let _fields = [];
    if (name.length > index) {
      if (levelIndex < 2) {   // final step to mark as selected
        fields.forEach(field => {
          if (field.key === name[index]) {
            field.selected = true;
            this.nameSelected.emit({ dataField, status: true, selected: true })
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
        this.setDefaultFielsSelected(name, index, _fields, levelIndex, dataField);
      }

    }

  }
  private setDefaultFields(event) {
    const status = true;
    this.prevState.forEach((field) => {
      if (field.name === event.key) {
        this.nameSelected.emit({ field, status });
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
  toggleLevelOne(nameToExpand) {
    if (!nameToExpand.isOpen) {
      nameToExpand.isOpen = true;
    } else {
      nameToExpand.isOpen = false;
    }
  }


}
