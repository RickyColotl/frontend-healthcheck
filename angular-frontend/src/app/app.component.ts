// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'Angular-Frontend';
    healthStatus!: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchHealthStatus();
    this.fetchData();
  }

  fetchHealthStatus() {
    this.http.get<any>('http://localhost:3000/hello').subscribe(
      (response) => {
        this.healthStatus = response.status;
      },
      (error) => {
        console.error('Error:', error);
        this.healthStatus = 'Failed to fetch health status :(';
      }
    );
  }
  fetchData() {
    this.http.get<any>('http://localhost:3000/hello').subscribe(
      (response) => {
        // Process and display data in the frontend
        this.healthStatus = response.status;
        console.log("Success connection to DataBase");
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
