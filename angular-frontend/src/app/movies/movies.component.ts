import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  searchTerm = '';
  movies: any[] = [];
  selectedMovie: any = null;

  constructor(private http: HttpClient) {} 

  onSearch() {
    this.http.get<any[]>(`http://localhost:3000/search-movies?searchTerm=${this.searchTerm}`).subscribe(
      (results) => {
        this.movies = results;
      },
      (error) => {
        console.error('Error fetching search results', error);
      }
    );
  }
  selectMovie(movie: any) {
    this.selectedMovie = this.selectedMovie === movie ? null : movie;
  }
}
