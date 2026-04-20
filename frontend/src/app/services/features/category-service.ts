import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../envs/env';
import { CategoryModel, CreateCategoryPayload } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);


  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/categories/`);
  }

  getCategoryById(categoryId : number) : Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${this.apiUrl}/categories/${categoryId}/`);
  }

  createCategory(payload: CreateCategoryPayload): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.apiUrl}/categories/`, {
      icon: 'dot',
      color: '#7c3aed',
      ...payload,
    });
  }
}

