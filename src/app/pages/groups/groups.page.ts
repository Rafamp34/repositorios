import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AnimationController, InfiniteScrollCustomEvent, ModalController, AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupModalComponent } from 'src/app/components/group-modal/group-modal.component'; // Cambiar al modal de grupo
import { Paginated } from 'src/app/core/models/paginated.model';
import { Group } from 'src/app/core/models/group.model';
import { MyGroupsService } from 'src/app/core/services/my-groups.service'; // Cambiar al servicio de grupos

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  _groups: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  groups$: Observable<Group[]> = this._groups.asObservable();

  constructor(
    private animationCtrl: AnimationController,
    private groupSvc: MyGroupsService, // Cambia el servicio por el de grupos
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.getMoreGroups();
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedGroup: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  refresh() {
    this.page = 1;
    this.groupSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Group>) => {
        this._groups.next([...response.data]);
        this.page++;
      }
    });
  }

  getMoreGroups(notify: HTMLIonInfiniteScrollElement | null = null) {
    this.groupSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Group>) => {
        this._groups.next([...this._groups.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  } 

  // Función para confirmar la eliminación de un grupo
  async confirmDelete(group: Group) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el grupo ${group.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteGroup(group);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteGroup(group: Group) {
    this.groupSvc.delete(group.id).subscribe(() => {
      this._groups.next(this._groups.value.filter(g => g.id !== group.id));
    });
  }


  async openGroupDetail(group: any, index: number) {
    await this.presentModalGroup('edit', group);
    this.selectedGroup = group;
  }

  private async presentModalGroup(mode: 'new' | 'edit', group: Group | undefined = undefined) {
    const modal = await this.modalCtrl.create({
      component: GroupModalComponent,
      componentProps: (mode == 'edit' ? { group: group } : {})
    });
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          this.groupSvc.add(response.data).subscribe({
            next: res => {
              this.refresh();
            },
            error: err => { }
          });
          break;
        case 'edit':
          this.groupSvc.update(group!.id, response.data).subscribe({
            next: res => {
              this.refresh();
            },
            error: err => { }
          });
          break;
        default:
          break;
      }
    });
    await modal.present();
  }

  async onAddGroup() {
    await this.presentModalGroup('new');
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreGroups(ev.target);
  }
}
