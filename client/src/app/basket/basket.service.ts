import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environements';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
    providedIn: 'root',
})
export class BasketService {
    baseUrl = environment.apiUrl;
    private basketSource = new BehaviorSubject<Basket | null>(null);
    basket$ = this.basketSource.asObservable();
    private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
    basketTotal$ = this.basketTotalSource.asObservable();

    constructor(private http: HttpClient) {}

    createPaymentIntent() {
        return this.http
            .post<Basket>(
                this.baseUrl + 'payments/' + this.getCurrentBasketValue()?.id,
                {}
            )
            .pipe(
                map((basket) => {
                    this.basketSource.next(basket);
                    console.log(basket);
                })
            );
    }

    setShippingPrice(deliveryMethod: DeliveryMethod) {
        const basket = this.getCurrentBasketValue();


        if (basket) {
            basket.deliveryMethodId = deliveryMethod.id;
            basket.shippingPrice = deliveryMethod.price;
            this.setBasket(basket);
        }
    }
    /**
     * Retrieves the basket with the specified ID from the server.
     * @param id The ID of the basket to retrieve.
     * @returns An Observable that emits the retrieved basket.
     */
    getBasket(id: string) {
        return this.http
            .get<Basket>(this.baseUrl + 'basket?id=' + id)
            .subscribe({
                next: (basket: Basket) => {
                    this.basketSource.next(basket);
                    this.calculateTotals();
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    /**
     * Sets the basket by making a POST request to the server.
     * @param basket The basket object to be set.
     * @returns An Observable that represents the HTTP POST request.
     */
    setBasket(basket: Basket) {
        return this.http.post(this.baseUrl + 'basket', basket).subscribe({
            next: (response: any) => {
                this.basketSource.next(basket);
                this.calculateTotals();
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    /**
     * Retrieves the current value of the basket.
     * @returns The current value of the basket.
     */
    getCurrentBasketValue() {
        return this.basketSource.value;
    }

    /**
     * Adds an item to the basket.
     * @param item The product item to add.
     * @param quantity The quantity of the item to add (default is 1).
     */
    addItemToBasket(item: Product | BasketItem, quantity = 1) {
        if (this.isProductItem(item))
            item = this.mapProductItemToBasketItem(item);

        const basket = this.getCurrentBasketValue() ?? this.createBasket();
        basket.items = this.addOrUpdateItem(basket.items, item, quantity);
        this.setBasket(basket);
    }

    /**
     * Removes an item from the basket.
     * @param id - The ID of the item to be removed.
     * @param quantity - The quantity of the item to be removed. Default is 1.
     */
    removeItemFromBasket(id: number, quantity = 1) {
        const basket = this.getCurrentBasketValue();
        if (!basket) return;
        const item = basket.items.find((x) => x.id === id);
        if (item) {
            item.quantity -= quantity;
            if (item.quantity === 0) {
                basket.items = basket.items.filter((x) => x.id !== id);
            }
            if (basket.items.length > 0) {
                this.setBasket(basket);
            } else {
                this.deleteBasket(basket);
            }
        }
    }

    /**
     * Deletes the specified basket.
     * @param basket The basket to be deleted.
     * @returns An Observable that completes when the basket is successfully deleted.
     */
    deleteBasket(basket: Basket) {
        return this.http
            .delete(this.baseUrl + 'basket?id=' + basket.id)
            .subscribe({
                next: () => {
                    this.deleteLocalBasket();
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    /**
     * Deletes the basket from local storage.
     */
    deleteLocalBasket() {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
    }

    /**
     * Adds or updates an item in the basket.
     * If the item already exists in the basket, the quantity is updated.
     * If the item does not exist, it is added to the basket with the specified quantity.
     *
     * @param items - The array of basket items.
     * @param itemToAdd - The item to add or update.
     * @param quantity - The quantity of the item to add or update.
     * @returns The updated array of basket items.
     */
    private addOrUpdateItem(
        items: BasketItem[],
        itemToAdd: BasketItem,
        quantity: number
    ): BasketItem[] {
        const item = items.find((x) => x.id === itemToAdd.id);
        if (item) {
            item.quantity += quantity;
        } else {
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
        }
        return items;
    }

    /**
     * Creates a new basket.
     * @returns The newly created basket.
     */
    private createBasket(): Basket {
        const basket = new Basket();
        localStorage.setItem('basket_id', basket.id);
        return basket;
    }

    /**
     * Maps a product item to a basket item.
     *
     * @param item - The product item to be mapped.
     * @returns The mapped basket item.
     */
    private mapProductItemToBasketItem(item: Product): BasketItem {
        return {
            id: item.id,
            productName: item.name,
            price: item.price,
            quantity: 0,
            pictureUrl: item.pictureUrl,
            brand: item.productBrand,
            type: item.productType,
        };
    }

    /**
     * Calculates the totals for the current basket.
     */
    private calculateTotals() {
        const basket = this.getCurrentBasketValue();
        if (!basket) {
            return;
        }
        const subtotal = basket.items.reduce(
            (a, b) => b.price * b.quantity + a,
            0
        );
        const total = basket.shippingPrice + subtotal;
        this.basketTotalSource.next({
            shipping: basket.shippingPrice,
            total,
            subtotal,
        });
    }

    /**
     * Checks if the given item is a Product.
     * @param item - The item to be checked.
     * @returns True if the item is a Product, false otherwise.
     */
    private isProductItem(item: Product | BasketItem): item is Product {
        return (item as Product).productBrand !== undefined;
    }
}
