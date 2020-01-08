import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataFieldsComponent } from './list-data-fields.component';
import { By } from '@angular/platform-browser';
import {NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('RightSidebarComponent', () => {
  let component: ListDataFieldsComponent;
  let fixture: ComponentFixture<ListDataFieldsComponent>;
  let element: any;
  let mock_data=[{selected:false,key:'name',value:[{key:'firstname'},{key:'middlename'},{key:'lastname'}]},{selected:false,key:'code'},{selected:false,key:'address',value:[{key:'permanent'},{key:'temporary'}]}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDataFieldsComponent ],
      schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataFieldsComponent);
    element = fixture.debugElement;
    component = fixture.componentInstance;
    component.data=mock_data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // var icon = element.query(By.css('#parentMatIcon'))
    // expect(icon).toBeTruthy();
    // var btnHeader=element.query(By.css('#parentFieldBtn'))
    // expect(btnHeader).toBeTruthy();
    // icon = element.query(By.css('#childFieldBtn'))
    // expect(icon).toBeTruthy();
    // var btnChild=element.query(By.css('#parentFieldBtn'))
    // expect(btnChild).toBeTruthy();
  });

  it('should contail 3 key button and 5 value buttons',()=>{
    let key=fixture.debugElement.queryAll(By.css("#parentFieldBtn"));
    expect(key.length).toBe(3);
    let key_values=fixture.debugElement.queryAll(By.css("#val"));
    expect(key_values.length).toBe(5);
  });

  it('should call valueSelected() when clikced on key',()=>{
    let key=fixture.debugElement.query(By.css("#parentFieldBtn"));
    spyOn(component,'valueSelected');
    key.triggerEventHandler('click',null);
    expect(component.valueSelected).toHaveBeenCalled();
  });

  it('should unselect key and values',()=>{
    component.data[0].selected=true;
    component.valueSelected(component.data[0], false);
    expect(component.data[0].selected).toEqual(false);
    fixture.detectChanges();
    let key=fixture.debugElement.query(By.css("#parentFieldBtn"));
    expect(key.nativeElement.classList).not.toContain('selected');
    let key_values=fixture.debugElement.queryAll(By.css("#childFieldBtn"));
    expect(key_values[0].nativeElement.classList).not.toContain('selected');
    expect(key_values[1].nativeElement.classList).not.toContain('selected');
    expect(key_values[2].nativeElement.classList).not.toContain('selected');
  });

  
  it('should select key and values',()=>{
    component.data[0].selected=false;
    component.valueSelected(component.data[0], false);
    expect(component.data[0].selected).toEqual(true);
    fixture.detectChanges();
    let key=fixture.debugElement.query(By.css("#parentFieldBtn"));
    expect(key.nativeElement.classList).toContain('selected');
    let key_values=fixture.debugElement.queryAll(By.css("#childFieldBtn"));
    expect(key_values[0].nativeElement.classList).toContain('selected');
    expect(key_values[1].nativeElement.classList).toContain('selected');
    expect(key_values[2].nativeElement.classList).toContain('selected');
  });

  

});
