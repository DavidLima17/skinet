import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

/**
 * Service responsible for handling shop-related operations.
 */
@Injectable({
    providedIn: 'root',
})
export class ShopService {
    baseUrl = 'https://localhost:5001/api/';

    constructor(private http: HttpClient) {}

    /**
     * Retrieves a list of products based on the specified shop parameters.
     * @param shopParams The shop parameters used to filter and sort the products.
     * @returns An Observable of Pagination<Product[]> representing the paginated list of products.
     */
    getProducts(shopParams: ShopParams) {
        let params = new HttpParams();

        if (shopParams.brandId > 0) {
            params = params.append('brandId', shopParams.brandId);
        }
        if (shopParams.typeId > 0) {
            params = params.append('typeId', shopParams.typeId);
        }
        params = params.append('sort', shopParams.sort);
        params = params.append('pageIndex', shopParams.pageNumber);
        params = params.append('pageSize', shopParams.pageSize);
        if (shopParams.search) {
            params = params.append('search', shopParams.search);
        }

        return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {
            params,
        });
    }

    /**
     * Retrieves a product by its ID.
     * @param id The ID of the product to retrieve.
     * @returns An Observable of Product representing the retrieved product.
     */
    getProduct(id: number) {
        return this.http.get<Product>(this.baseUrl + 'products/' + id);
    }

    /**
     * Retrieves a list of brands.
     * @returns An Observable of Brand[] representing the list of brands.
     */
    getBrands() {
        return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
    }

    /**
     * Retrieves a list of types.
     * @returns An Observable of Type[] representing the list of types.
     */
    getTypes() {
        return this.http.get<Type[]>(this.baseUrl + 'products/types');
    }
}
