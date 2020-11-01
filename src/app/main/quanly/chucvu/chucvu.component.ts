import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-chucvu',
  templateUrl: './chucvu.component.html',
  styleUrls: ['./chucvu.component.css']
})
export class ChucvuComponent extends BaseComponent implements OnInit {
  public chucvus:any;
  public chucvu:any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tencv': ['']
    });
    this.search();
  }
  loadPage(page) {
    this._api.post('/api/chucvus/search',{page: page, pageSize: this.pageSize,tencv: this.formsearch.get('tencv').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chucvus = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
   }
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/chucvus/search',{page: this.page, pageSize: this.pageSize, tencv: this.formsearch.get('tencv').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.chucvus = res.data;
      console.log(res.data);
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }
  get f() { return this.formdata.controls; }
  Reset() { }
  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      
        let tmp = {
          
           tencv:value.tencv,
                   
          };
        this._api.post('/api/chucvus/create-chucvu',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
     
    }else { 
     
        let tmp = {
           
           tencv:value.tencv,
           
           macv:this.chucvu.macv,          
          };
        this._api.post('/api/chucvus/update-chucvu',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }

  }
  onDelete(row) {
    this._api.post('/api/chucvus/delete-chucvu',{macv:row.macv}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
   }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.chucvu = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tencv': ['', Validators.required],
       
      });
      
      this.doneSetupForm = true;
    });
  }
  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/chucvus/get-by-id/'+ row.macv).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.chucvu = res; 
       
          this.formdata = this.fb.group({
            'tencv': [this.chucvu.tencv, Validators.required],
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
