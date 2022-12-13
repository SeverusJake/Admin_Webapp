import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { CategoryService } from 'src/app/services/category.service';
import { PageService } from 'src/app/services/page.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  listData!: MatTableDataSource<Category>;
  categories!: Category[];
  categoriesLength!: number;
  columns: string[] = ['categoryId', 'categoryName', 'view', 'hide', 'delete'];
  nonPrimeColumns: string[] = ['categoryId', 'categoryName'];
  isPrimeAdmin: boolean = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private toastr: ToastrService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('category');
    this.getAll();
    if (localStorage.getItem('roleID') !== "2"){
      this.isPrimeAdmin = false;
    }
  }

  getAll() {
    this.categoryService.getAllAdmin().subscribe(data => {
      this.categories = data as Category[];
      this.listData = new MatTableDataSource(this.categories);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.categoriesLength = this.categories.length;
    }, error => {
      console.log('loi' + error);
    })
  }

  finish() {
    this.ngOnInit();
  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Do you want to delete category with name ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(id).subscribe(data => {
          this.ngOnInit();
          this.toastr.success('Delete successfully!', 'System');
        }, error => {
          this.toastr.error('Existing product in this category. You need to delete product first!', 'System');
        })
      }
    })
  }

  hide(id: number, name: string, status: boolean) {
    if (status == true){
      this.categoryService.hide(id).subscribe(data => {
        this.ngOnInit();
        this.toastr.success('Hide successfully!', 'System');
      }, error => {
        this.toastr.error('Hide failed, An unexpected error occurred!', 'System');
      })
    }else{
      this.categoryService.show(id).subscribe(data => {
        this.ngOnInit();
        this.toastr.success('Show successfully!', 'System');
      }, error => {
        this.toastr.error('Show failed, An unexpected error occurred!', 'System');
      })
    }
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();
  }

}
