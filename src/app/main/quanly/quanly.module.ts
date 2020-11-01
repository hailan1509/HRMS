import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChucvuComponent } from './chucvu/chucvu.component';
import { PhongbanComponent } from './phongban/phongban.component';
@NgModule({
  declarations: [ ChucvuComponent, PhongbanComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'chucvu',
        component: ChucvuComponent,
      },
      {
        path: 'phongban',
        component: PhongbanComponent,
      },
  ]),  
  ]
})
export class QuanlyModule { }