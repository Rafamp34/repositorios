import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupsPageRoutingModule } from './groups-routing.module';

import { GroupsPage } from './groups.page';
import { GroupModalComponent } from 'src/app/components/group-modal/group-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupsPageRoutingModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [GroupModalComponent, GroupsPage]
})
export class GroupsPageModule {}
