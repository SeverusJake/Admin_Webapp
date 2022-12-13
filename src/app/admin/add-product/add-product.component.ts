import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  product!: Product;

  selectFile!: File;
  url: string = 'https://res.cloudinary.com/veggie-shop/image/upload/v1633434089/products/jq4drid7ttqsxwd15xn9.jpg';
  image: string = this.url;

  postForm: FormGroup;
  categories!: Category[];
  isDuplicate = false;

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private productService: ProductService, private toastr: ToastrService, private uploadService: UploadService) {
    this.postForm = new FormGroup({
      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'categoryId': new FormControl(1),
      'status': new FormControl(1),
      'sold': new FormControl(0),
    })
  }

  ngOnInit(): void {
    this.getCategories();
  }

  save() {
    if (this.image == "https://res.cloudinary.com/veggie-shop/image/upload/v1633434089/products/jq4drid7ttqsxwd15xn9.jpg"){
      this.toastr.warning('Must have image of product!', 'System');
      return;
    }
    const productName = this.postForm.controls['name'].value;
    const productQuantity = this.postForm.controls['quantity'].value;
    const productPrice = this.postForm.controls['price'].value;
    const productDiscount = this.postForm.controls['discount'].value;
    const productDescription = this.postForm.controls['description'].value;
    const productStatus = this.postForm.controls['status'].value;
    const productSold = this.postForm.controls['sold'].value;
    const productCategoryId = this.postForm.controls['categoryId'].value;
    if (this.postForm.valid) {
      this.productService.getAll().subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name.toLowerCase().replace(/\s/g, "") == productName.toLowerCase().replace(/\s/g, "")) {
            this.isDuplicate = true;
          }
        }

      if (this.isDuplicate === true) {
        this.isDuplicate = false;
        console.log(this.isDuplicate);
        this.toastr.error('Existed!', 'System');
      }
      else{
        this.postForm.controls['name'].setValue(productName);
        this.postForm.controls['quantity'].setValue(productQuantity);
        this.postForm.controls['price'].setValue(productPrice);
        this.postForm.controls['discount'].setValue(productDiscount);
        this.postForm.controls['description'].setValue(productDescription);
        this.postForm.controls['status'].setValue(productStatus);
        this.postForm.controls['sold'].setValue(productSold);
        this.postForm.controls['categoryId'].setValue(productCategoryId);
        this.product = this.postForm.value;
        this.product.category = new Category(this.postForm.value.categoryId, '');
        this.image = localStorage.getItem("productImage")!;
        this.product.image =  this.image;

        this.productService.save(this.product).subscribe(data => {
        this.toastr.success('Created successfully!', 'System');
        this.saveFinish.emit('done');
      })
      }

      })


    } else {
      this.toastr.error('Created failed!', 'System');
    }
    this.postForm = new FormGroup({
      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'categoryId': new FormControl(1),
      'status': new FormControl(1),
      'sold': new FormControl(0),
    })
    this.image = this.url;
    this.modalService.dismissAll();
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Data access error, please press f5!', 'System');
    })
  }

  onFileSelect(event: any) {
    this.selectFile = event.target.files[0];
    this.uploadService.uploadProduct(this.selectFile).subscribe(response => {
      if (response) {
        this.image = response.secure_url;
        localStorage.setItem("productImage", this.image)
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
