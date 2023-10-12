import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  searchResults: any[] = [];
  customer: any[] = [];
  searchTerm : string = '';
  newCustomer = {
    firstName: '',
    lastName: '',
    email: '',
    address_id: ''
   };
  selectedCustomer : any | null = null;

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

  editInfo(customer: any) {
    this.selectedCustomer = { ...customer };  // Populate form
  }

  updateCustomer() {
    const dataToSend = {
      customerId: this.selectedCustomer.customer_id,
      firstName: this.selectedCustomer.firstName,
      lastName: this.selectedCustomer.lastName,
      email: this.selectedCustomer.email,
      address_id: this.selectedCustomer.address_id
  };
    this.http.put<any>('http://localhost:3000/editCustomer', dataToSend)
        .subscribe(
            (response) => {
                alert(response.message);
                const index = this.customer.findIndex(c => c.customer_id === this.selectedCustomer.customer_id);
                this.customer[index] = { ...this.selectedCustomer };
                this.selectedCustomer = null;
            },
            (error) => {
                console.error('Error updating customer:', error);
            }
        );
}
  deleteCustomer(customer: any) {
    console.log(customer);
    if (confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}?`)) {
      this.http.delete<any>(`http://localhost:3000/deleteCustomer/${customer.customer_id}`)
        .subscribe(
          (response) => {
            alert(response.message);
            const index = this.searchResults.findIndex(c => c.customer_id === customer.customer_id);
            if (index > -1) {
              this.searchResults.splice(index, 1);
            }
          },
          (error) => {
            console.error('Error deleting customer:', error);
          }
        );
    }
  }
}
