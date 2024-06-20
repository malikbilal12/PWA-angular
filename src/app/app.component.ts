import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products: any[] = [];
  cart: any[] = [];
  private apiUrl = 'http://localhost:3000/products';
  private cartUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
    this.fetchCart();
  }

  fetchData() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.products = data;
    });
  }

  fetchCart() {
    this.http.get<any[]>(this.cartUrl).subscribe(data => {
      this.cart = data;
    });
  }

  addCart(product: any) {
    if (product.stock > 0) {
      product.stock -= 1;
      this.updateProduct(product);
      this.updateCart(product);
    } else {
      console.log('Product is out of stock');
    }
  }

  updateProduct(product: any) {
    const url = `${this.apiUrl}/${product.id}`;
    this.http.put(url, product).subscribe(updatedProduct => {
      console.log('Product updated:', updatedProduct);
      this.fetchData();
    }, error => {
      console.error('Error updating product:', error);
    });
  }

  updateCart(product: any) {
    const cartProduct = this.cart.find(p => p.id === product.id);
    if (cartProduct) {
      cartProduct.quantity += 1;
      this.http.put(`${this.cartUrl}/${cartProduct.id}`, cartProduct).subscribe(updatedCart => {
        console.log('Cart updated:', updatedCart);
        this.fetchCart();
      }, error => {
        console.error('Error updating cart:', error);
      });
    } else {
      const newCartProduct = { ...product, quantity: 1 };
      this.http.post(this.cartUrl, newCartProduct).subscribe(addedCart => {
        console.log('Product added to cart:', addedCart);
        this.fetchCart();
      }, error => {
        console.error('Error adding to cart:', error);
      });
    }
  }
}
