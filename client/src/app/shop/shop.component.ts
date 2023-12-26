/**
 * Represents the ShopComponent which is responsible for displaying the shop page.
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
    @ViewChild('search', { static: false }) searchTerm?: ElementRef;
    products: Product[] = [];
    brands: Brand[] = [];
    types: Type[] = [];
    shopParams = new ShopParams();
    sortOptions = [
        { name: 'Alphabetical', value: 'name' },
        { name: 'Price: Low - High', value: 'priceAsc' },
        { name: 'Price: High - Low', value: 'priceDesc' },
    ];
    totalCount = 0;

    constructor(private shopService: ShopService) {}

    /**
     * Initializes the component by calling the necessary methods to fetch products, brands, and types.
     */
    ngOnInit(): void {
        this.getProducts();
        this.getBrands();
        this.getTypes();
    }

    /**
     * Fetches the products based on the shop parameters.
     */
    getProducts(): void {
        this.shopService.getProducts(this.shopParams).subscribe({
            next: (response) => {
                this.products = response.data;
                this.shopParams.pageNumber = response.pageIndex;
                this.shopParams.pageSize = response.pageSize;
                this.totalCount = response.count;
            },
            error: (error) => console.log(error),
        });
    }

    /**
     * Fetches the brands.
     */
    getBrands(): void {
        this.shopService.getBrands().subscribe({
            next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
            error: (error) => console.log(error),
        });
    }

    /**
     * Fetches the types.
     */
    getTypes(): void {
        this.shopService.getTypes().subscribe({
            next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
            error: (error) => console.log(error),
        });
    }

    /**
     * Handles the selection of a brand and updates the shop parameters accordingly.
     * @param brandId The ID of the selected brand.
     */
    onBrandSelected(brandId: number): void {
        this.shopParams.brandId = brandId;
        this.shopParams.pageNumber = 1;
        this.getProducts();
    }

    /**
     * Handles the selection of a type and updates the shop parameters accordingly.
     * @param typeId The ID of the selected type.
     */
    onTypeSelected(typeId: number): void {
        this.shopParams.typeId = typeId;
        this.shopParams.pageNumber = 1;
        this.getProducts();
    }

    /**
     * Handles the selection of a sort option and updates the shop parameters accordingly.
     * @param event The event object containing the selected sort option.
     */
    onSortSelected(event: any): void {
        this.shopParams.sort = event.target.value;
        this.getProducts();
    }

    /**
     * Handles the page change event and updates the shop parameters accordingly.
     * @param event The event object containing the new page number.
     */
    onPageChanged(event: any): void {
        if (this.shopParams.pageNumber !== event) {
            this.shopParams.pageNumber = event;
            this.getProducts();
        }
    }

    /**
     * Handles the search action and updates the shop parameters accordingly.
     */
    onSearch(): void {
        this.shopParams.search = this.searchTerm?.nativeElement.value;
        this.shopParams.pageNumber = 1;
        this.getProducts();
    }

    /**
     * Resets the search and shop parameters to their initial values.
     */
    onReset(): void {
        if (this.searchTerm) {
            this.searchTerm.nativeElement.value = '';
        }
        this.shopParams = new ShopParams();
        this.getProducts();
    }
}
