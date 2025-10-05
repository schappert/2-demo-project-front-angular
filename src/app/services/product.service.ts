import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([]);
  products = computed(() => this.productsSignal());
  private nextId = 1;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** 🟢 Charge les produits depuis l’API */
  loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (data) => {
        this.productsSignal.set(data);
        // Calcule le prochain ID (utile pour les ajouts locaux par la suite)
        this.nextId = data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1;
      },
      error: (err) => {
        console.error('Erreur chargement produits:', err);
      }
    });
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = { id: this.nextId++, ...product };
    this.productsSignal.set([...this.productsSignal(), newProduct]);
  }

  updateProduct(updated: Product) {
    const updatedList = this.productsSignal().map(p =>
      p.id === updated.id ? updated : p
    );
    this.productsSignal.set(updatedList);
  }

  deleteProduct(id: number) {
    this.productsSignal.set(this.productsSignal().filter(p => p.id !== id));
  }

  getProduct(id: number) {
    return this.productsSignal().find(p => p.id === id);
  }

  /** 🟢 Sauvegarde tous les produits actuels en BDD */
  saveAll() {
    return this.http.post(`${this.apiUrl}/bulk`, this.products());
  }
}
