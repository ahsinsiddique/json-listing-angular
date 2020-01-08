import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmitterService } from './shared/emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data$;
  data;
  emitter = EmitterService.get("channel_1");

  constructor(private http: HttpClient) {
    this.emitter.subscribe(msg => {
      console.log(msg);
    });

  }
  ngOnInit() {
    let url = 'http://' + window.location.hostname + ':' + window.location.port + '/assets/2';
    this.data$ = this.http.get(url);
    this.data$.subscribe(resp => {
      this.data = this.mapJsonToArray(resp);
    })
  }

  isObject(obj: any): boolean {
    return typeof (obj) === 'object' ? true : false;
  }
  mapJsonToArray(object) {
    let arr: any;
    arr = Object.entries(object).map(([key, value]) => ({ key, value }));
    arr.forEach((item) => {
      if (this.isObject(item.value)) {
        item.value = this.mapJsonToArray(item.value);
      }
    })
    return arr;
  }
}
