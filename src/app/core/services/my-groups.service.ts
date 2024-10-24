import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Group } from "../models/group.model";
import { Paginated } from "../models/paginated.model";

export interface PaginatedRaw<T> {
    first: number;
    prev: number | null;
    next: number | null;
    last: number;
    pages: number;
    items: number;
    data: T[];
}

export interface GroupRaw {
    id: string;
    nombre: string;
}

@Injectable({
    providedIn: 'root'
})
export class MyGroupsService {

    private apiUrl: string = "http://localhost:3000/grupos";

    constructor(
        private http: HttpClient
    ) {}

    // Obtener todos los grupos con paginación
    getAll(page: number, pageSize: number): Observable<Paginated<Group>> {
        return this.http.get<PaginatedRaw<GroupRaw>>(`${this.apiUrl}/?_page=${page}&_per_page=${pageSize}`).pipe(map(res => {
            return {
                page: page,
                pageSize: pageSize,
                pages: res.pages,
                data: res.data.map<Group>((d: GroupRaw) => {
                    return {
                        id: d.id,
                        name: d.nombre,
                    };
                })
            };
        }));
    }

    // Método para actualizar un grupo existente
    update(id: string, data: Group): Observable<Group> {
        return this.http.put<Group>(`${this.apiUrl}/${id}`, data);
    }

    // Método para agregar un nuevo grupo
    add(data: Group): Observable<Group> {
        return this.http.post<Group>(this.apiUrl, data);
    }

    // Método para eliminar un grupo (opcional si aún no lo has implementado)
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
