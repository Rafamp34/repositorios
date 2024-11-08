import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription, last, lastValueFrom, of } from 'rxjs';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-group-selectable',
  templateUrl: './group-selectable.component.html',
  styleUrls: ['./group-selectable.component.scss'],
})
export class GroupSelectableComponent implements OnInit {
  groupSelected: Group | null = null; // Inicializamos como null cuando no hay grupo seleccionado
  disabled: boolean = false; // Puedes establecerlo como true o false dependiendo del estado inicial

  groups$: Observable<Group[]> = of([]);  // Inicialización para evitar el error
  private allGroups: Group[] = [];
  private searchTerm = new BehaviorSubject<string>('');

  constructor(private groupsService: GroupsService) {}

  ngOnInit() {
    this.groupsService.getAll().subscribe((groups) => {
      this.allGroups = groups;
      this.updateGroups();
    });

    this.groups$ = this.searchTerm.pipe(
      map((term) => 
        this.allGroups.filter((group) =>
          group.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm.next(searchTerm);
  }

  updateGroups() {
    this.groups$ = this.searchTerm.pipe(
      map((term) => 
        this.allGroups.filter((group) =>
          group.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  clearSearch(search: IonInput) {
    search.value = ''; 
    this.searchTerm.next('');
    this.updateGroups();
  }

  deselect(popover: any) {
    this.groupSelected = null;
    popover.dismiss();
  }

  onGroupClicked(popover: any, group: Group) {
    this.groupSelected = group;
    popover.dismiss();
  }

  onLoadGroups() {
    this.groupsService.getAll().subscribe((groups) => {
      this.allGroups = groups;
      this.updateGroups();
    });
  }

  onFilter(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm.next(searchTerm);
  }

  
}