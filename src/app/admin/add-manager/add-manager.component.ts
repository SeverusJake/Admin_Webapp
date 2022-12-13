import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.css']
})
export class AddManagerComponent implements OnInit {

  customer!: Customer;
  selected: number = 1;
  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  selectFile!: File;
  url: string = 'https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png';
  image: string = this.url;

  postFormAdmin: FormGroup;

  roles = [
    { id: 3, label: "Manage comments" },
    { id: 4, label: "Manage orders" },
]

  constructor(private modalService: NgbModal, private customerService: CustomerService, private toastr: ToastrService, private uploadService: UploadService) {
    this.postFormAdmin = new FormGroup({
      'userId': new FormControl(0),
      'email': new FormControl(null, [Validators.minLength(4), Validators.email, Validators.required]),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'passwordConfirm': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'address': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'gender': new FormControl(true),
      'registerDate': new FormControl(new Date()),
      'status': new FormControl(1),
      'selected': new FormControl(3),
    })
  }

  ngOnInit(): void {
  }

  selectOption(id: any) {
    this.selected = id;
  }

  saveAdmin() {
    if (this.postFormAdmin.get('passwordConfirm')?.value != this.postFormAdmin.get('password')?.value){
      this.toastr.error('Password is not matched ', 'System');
      return;
    }
    if (this.postFormAdmin.valid) {
      this.customer = this.postFormAdmin.value;
      this.customer.image = this.image;
      if (this.selected == 4){
        this.customerService.postAdminOrder(this.customer).subscribe(data => {
          this.toastr.success('Created manage orders successfully', 'System');
          this.modalService.dismissAll();
          this.saveFinish.emit('done');
        }, error => {
          if (error.status === 404) {
            this.toastr.error('Email is already exists! ', 'System');
          } else {
            this.toastr.error('Created failed!', 'System');
          }
        })
      }else{
        this.customerService.postAdminComment(this.customer).subscribe(data => {
          this.toastr.success('Created manage comments successfully', 'System');
          this.modalService.dismissAll();
          this.saveFinish.emit('done');
        }, error => {
          if (error.status === 404) {
            this.toastr.error('Email is already exists! ', 'System');
          } else {
            this.toastr.error('Created failed!', 'System');
          }
        })
      }
    } else {
      this.toastr.error('Created failed!', 'System');
    }


    this.postFormAdmin = new FormGroup({
      'userId': new FormControl(0),
      'email': new FormControl(null, [Validators.minLength(4), Validators.email, Validators.required]),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'passwordConfirm': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'address': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'gender': new FormControl(true),
      'registerDate': new FormControl(new Date()),
      'status': new FormControl(1),
      'selected': new FormControl(1),
    })
    this.image = this.url;
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onFileSelect(event: any) {
    this.selectFile = event.target.files[0];
    this.uploadService.uploadCustomer(this.selectFile).subscribe(response => {
      if (response) {
        this.image = response.secure_url;
      }
    })
  }
}
