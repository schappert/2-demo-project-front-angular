import { Component, effect, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  products = this.productService.products;
  selectedProduct: Product | null = null;

  name = '';
  price: number | null = null;
  description = '';

  constructor() {
    // Pour debug, affiche à chaque changement
    effect(() => {
      console.log('Produits actuels:', this.products());
    });
  }

  ngOnInit() {
    this.productService.loadProducts();
  }

  addOrUpdate() {
    if (!this.name || !this.price) return;

    if (this.selectedProduct) {
      this.productService.updateProduct({
        ...this.selectedProduct,
        name: this.name,
        price: this.price,
        description: this.description
      });
    } else {
      this.productService.addProduct({
        name: this.name,
        price: this.price,
        description: this.description
      });
    }

    this.resetForm();
  }

  edit(product: Product) {
    this.selectedProduct = product;
    this.name = product.name;
    this.price = product.price;
    this.description = product.description || '';
  }

  delete(id: number) {
    this.productService.deleteProduct(id);
    if (this.selectedProduct?.id === id) this.resetForm();
  }

  resetForm() {
    this.selectedProduct = null;
    this.name = '';
    this.price = null;
    this.description = '';
  }

  saveAll() {
    this.productService.saveAll().subscribe({
      next: () => alert('Produits sauvegardés avec succès ✅'),
      error: (err) => alert('Erreur lors de la sauvegarde: ' + err.message),
    });
  }
}
