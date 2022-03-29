import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://172.16.18.39:3000/';
  API_URL1 = 'http://202.21.41.138:3000/';
  constructor() { }
}