import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/common/Product';
import { PageService } from 'src/app/services/page.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  productsLength!: number;
  columns: string[] = ['image', 'productId', 'name', 'price', 'discount', 'category', 'enteredDate', 'view', 'hide' ,'delete'];
  nonPrimeColumns: string[] = ['image', 'productId', 'name', 'price', 'discount', 'category', 'enteredDate'];
  isChecked!: boolean;
  isPrimeAdmin: boolean = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('product');
    this.getAll();
    if (localStorage.getItem('roleID') !== "2"){
      this.isPrimeAdmin = false;
    }
  }

  onSaveUsernameChanged(value:boolean){
    this.isChecked = value;
}
  getAll() {
    this.productService.getAllAdmin().subscribe(data => {
      this.products = data as Product[];
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Do you want to delete ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Delete successfully!', 'System');
        },error=>{
          this.toastr.error('Delete failed, An unexpected error occurred!', 'System');
        })
      }
    })
  }

  hide(id: number, name: string, status: boolean) {
        if (status == true){
          this.productService.hide(id).subscribe(data=>{
            this.ngOnInit();
            this.toastr.success('Hide successfully!', 'System');
          },error=>{
            this.toastr.error('Hide failed, An unexpected error occurred!', 'System');
          })
        }else{
          this.productService.show(id).subscribe(data=>{
            this.ngOnInit();
            this.toastr.success('Show successfully!', 'System');
          },error=>{
            this.toastr.error('Show failed, An unexpected error occurred!', 'System');
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
