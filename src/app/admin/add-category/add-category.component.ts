import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  postForm: FormGroup;
  isDuplicate = false;

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'categoryId': new FormControl(0),
      'categoryName': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'status': new FormControl(true)
    })
  }

  ngOnInit(): void {
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  save() {
    const categoryValue = this.postForm.controls['categoryName'].value;
    if (this.postForm.valid) {
      this.categoryService.getAll().subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].categoryName.toLowerCase().replace(/\s/g, "") == categoryValue.toLowerCase().replace(/\s/g, "")) {
            console.log(categoryValue.toLowerCase().replace(/\s/g, ""));
            console.log(data[i].categoryName.toLowerCase().replace(/\s/g, ""));

            this.isDuplicate = true;
            console.log(this.isDuplicate);
          }
        }

      if (this.isDuplicate === true) {
        this.isDuplicate = false;
        console.log(this.isDuplicate);
        this.toastr.error('Existed!', 'System');
      }
      else{
        this.postForm.controls['categoryName'].setValue(categoryValue);
        this.categoryService.post(this.postForm.value).subscribe(data => {
          this.modalService.dismissAll();
          this.toastr.success('Created successfully!', 'System');
          this.saveFinish.emit('done');
        })
      }

      })


    } else {
      this.toastr.error('Created failed!', 'System');
    }
    this.postForm = new FormGroup({
      'categoryId': new FormControl(0),
      'categoryName': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'status': new FormControl(true)
    })
  }

}
