import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { PageService } from 'src/app/services/page.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  listData!: MatTableDataSource<Customer>;
  customers!: Customer[];
  customerLength!: number;
  columns: string[] = ['image', 'userId', 'name', 'email','address', 'phone', 'gender', 'registerDate', 'view','hide' ,'delete'];
  nonPrimeColumns: string[] = ['image', 'userId', 'name', 'email','address', 'phone', 'gender', 'registerDate'];
  isPrimeAdmin: boolean = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  emailAdmin!:string;

  constructor(private pageService: PageService, private customerService: CustomerService, private toastr: ToastrService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.emailAdmin = this.sessionService.getUser();
    this.pageService.setPageActive('manager');
    this.getAll();
    if (localStorage.getItem('roleID') !== "2"){
      this.isPrimeAdmin = false;
    }
  }

  getAll() {
    this.customerService.getAllAdmin().subscribe(data => {
      this.customers = data as Customer[];
      this.customers = this.customers.filter(c=>c.roles[0].name !== 'ROLE_USER');
      this.customers = this.customers.filter(c=>c.email!=this.emailAdmin);

      this.listData = new MatTableDataSource(this.customers);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }

  delete(id: number, name: String) {
    Swal.fire({
      title: 'Delete user with name ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('successfully deleted!', 'System');
        }, error => {
          this.toastr.error('Delete failed!', 'System');
        })
      }
    })
  }

  hide(id: number, name: String, status: boolean) {
    if (status == true){
      this.customerService.hide(id).subscribe(data => {
        this.ngOnInit();
        this.toastr.success('successfully hidden!', 'System');
      }, error => {
        this.toastr.error('Hidden failed!', 'System');
      })
    }else{
      this.customerService.show(id).subscribe(data => {
        this.ngOnInit();
        this.toastr.success('Show successfully!', 'System');
      }, error => {
        this.toastr.error('Show failed!', 'System');
      })
    }
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();
  }

  finish() {
    this.ngOnInit();
  }



}
