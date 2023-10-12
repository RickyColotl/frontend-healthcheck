import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  searchResults: any[] = [];
  searchTerm : string = '';
  newCustomer = {
    firstName: '',
    lastName: '',
    email: '',
    address_id: ''
   };

  constructor(private http: HttpClient) {} 

  searchCustomers() {
    this.http.get<any[]>(`http://localhost:3000/searchCustomers?term=${this.searchTerm}`)
      .subscribe(
        (response) => {
          this.searchResults = response;
        },
        (error) => {
          console.error('Error fetching customers:', error);
        }
      );
  }

  addCustomer() {
    this.http.post<any>('http://localhost:3000/addCustomer', this.newCustomer)
      .subscribe(
        (response) => {
          alert(response.message);
          this.newCustomer = { firstName: '', lastName: '', email: '', address_id: '' };
        },
        (error) => {
          console.error('Error adding customer:', error);
        }
      );
  }
}
