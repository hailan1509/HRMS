import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-phongban',
  templateUrl: './phongban.component.html',
  styleUrls: ['./phongban.component.css']
})
export class PhongbanComponent extends BaseComponent implements OnInit {

  public phongbans:any;
  public phongban:any;
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
      'tenpb': ['']
    });
    this.search();
  }
  loadPage(page) {
    this._api.post('/api/phongbans/search',{page: page, pageSize: this.pageSize,tenpb: this.formsearch.get('tenpb').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.phongbans = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
   }
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/phongbans/search',{page: this.page, pageSize: this.pageSize, tenpb: this.formsearch.get('tenpb').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.phongbans = res.data;
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
          
           tenpb:value.tenpb,
           sdt:value.sdt,
           truongphong:value.truongphong
                   
          };
        this._api.post('/api/phongbans/create-phongban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
     
    }else { 
     
        let tmp = {
           
          tenpb:value.tenpb,
          sdt:value.sdt,
          truongphong:value.truongphong,
           
           mapb:this.phongban.mapb,          
          };
        this._api.post('/api/phongbans/update-phongban',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      
    }

  }
  onDelete(row) {
    this._api.post('/api/phongbans/delete-phongban',{macv:row.mapb}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
   }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.phongban = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'tenpb': ['', Validators.required],
        'sdt': ['', Validators.required],
        'truongphong': ['', Validators.required],
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
      this._api.get('/api/phongbans/get-by-id/'+ row.mapb).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.phongban = res; 
       
          this.formdata = this.fb.group({
            'tenpb': [this.phongban.tenpb, Validators.required],
            'sdt': [this.phongban.sdt, Validators.required],
            'truongphong': [this.phongban.truongphong, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
