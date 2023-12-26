/**
 * Represents the component for displaying product details.
 */
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
    /**
     * The product being displayed.
     */
    product?: Product;

    /**
     * The quantity of the product.
     */
    quantity = 1;

    /**
     * The quantity of the product in the basket.
     */
    quantityInBasket = 0;

    /**
     * Constructs a new instance of the ProductDetailsComponent.
     * @param shopService The shop service.
     * @param activatedRoute The activated route.
     * @param bcService The breadcrumb service.
     * @param basketService The basket service.
     */
    constructor(
        private shopService: ShopService,
        private activatedRoute: ActivatedRoute,
        private bcService: BreadcrumbService,
        private basketService: BasketService
    ) {
        this.bcService.set('@productDetails', ' ');
    }

    /**
     * Initializes the component.
     */
    ngOnInit(): void {
        this.loadProduct();
    }

    /**
     * Loads the product details.
     */
    loadProduct(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id)
            this.shopService.getProduct(+id).subscribe({
                next: (product) => {
                    {
                        this.product = product;
                        this.bcService.set('@productDetails', product.name);
                        this.basketService.basket$.pipe(take(1)).subscribe({
                            next: (basket) => {
                                const item = basket?.items?.find(
                                    (x) => x.id === +id
                                );
                                if (item) {
                                    this.quantity = item.quantity;
                                    this.quantityInBasket = item.quantity;
                                }
                            },
                        });
                    }
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    /**
     * Increments the quantity of the product.
     */
    incrementQuantity(): void {
        this.quantity++;
    }

    /**
     * Decrements the quantity of the product.
     */
    decrementQuantity(): void {
        if (this.quantity > 0) this.quantity--;
    }

    /**
     * Updates the basket with the current quantity of the product.
     */
    updateBasket(): void {
        if (this.product) {
            if (this.quantity > this.quantityInBasket) {
                const itemsToAdd = this.quantity - this.quantityInBasket;
                this.quantityInBasket += itemsToAdd;
                this.basketService.addItemToBasket(this.product, itemsToAdd);
            } else {
                const itemsToRemove = this.quantityInBasket - this.quantity;
                this.quantityInBasket -= itemsToRemove;
                this.basketService.removeItemFromBasket(
                    this.product.id,
                    itemsToRemove
                );
            }
        }
    }

    /**
     * Gets the text for the button based on the quantity in the basket.
     */
    get buttonText() {
        return this.quantityInBasket === 0 ? 'Add to basket' : 'Update basket';
    }
}
