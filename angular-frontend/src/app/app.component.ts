import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'Angular-Frontend';
    healthStatus!: string;
    topMovies: any[] = [];
    topActors: any[] = [];
    showTopMovies: boolean = true;
    selectedMovie: any = null;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}
    ngOnInit() {
      this.fetchHealthStatus();
      this.fetchData();
      this.fetchTop5Movies();
      this.fetchTopActors();

      this.router.events.subscribe(() => {
        const currentRoute = this.route.snapshot.firstChild;
        this.showTopMovies = !currentRoute || currentRoute?.routeConfig?.path === '';
      });
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
          this.healthStatus = response.status;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }

    fetchTop5Movies(){
      this.http.get<any>('http://localhost:3000/top-movies').subscribe(
        (response) => {
          this.topMovies = response;
          console.log("Success connection to Sakila DataBase");
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
    fetchTopActors(){
      this.http.get<any>('http://localhost:3000/top-actors').subscribe(
        (response) => {
          this.topActors = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
    selectMovie(movie: any) {
      // Toggle the selected movie when it's clicked
      this.selectedMovie = this.selectedMovie === movie ? null : movie;
    }
}
