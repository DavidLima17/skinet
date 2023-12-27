import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { Observable, map, of } from 'rxjs';

/**
 * Service responsible for handling shop-related operations.
 */
@Injectable({
    providedIn: 'root',
})
export class ShopService {
    baseUrl = 'https://localhost:5001/api/';
    products: Product[] = [];
    brands: Brand[] = [];
    types: Type[] = [];
    pagination?: Pagination<Product[]>;
    shopParams = new ShopParams();
    productCache = new Map<string, Pagination<Product[]>>();

    constructor(private http: HttpClient) {}

    /**
     * Retrieves a list of products based on the specified shop parameters.
     * @param shopParams The shop parameters used to filter and sort the products.
     * @returns An Observable of Pagination<Product[]> representing the paginated list of products.
     */
    getProducts(useCache = true): Observable<Pagination<Product[]>> {
        if (!useCache) this.productCache = new Map();

        if (this.productCache.size > 0 && useCache) {
            if (
                this.productCache.has(Object.values(this.shopParams).join('-'))
            ) {
                this.pagination = this.productCache.get(
                    Object.values(this.shopParams).join('-')
                );
                if (this.pagination) return of(this.pagination);
            }
        }

        let params = new HttpParams();

        if (this.shopParams.brandId > 0) {
            params = params.append('brandId', this.shopParams.brandId);
        }
        if (this.shopParams.typeId > 0) {
            params = params.append('typeId', this.shopParams.typeId);
        }
        params = params.append('sort', this.shopParams.sort);
        params = params.append('pageIndex', this.shopParams.pageNumber);
        params = params.append('pageSize', this.shopParams.pageSize);
        if (this.shopParams.search) {
            params = params.append('search', this.shopParams.search);
        }

        return this.http
            .get<Pagination<Product[]>>(this.baseUrl + 'products', {
                params,
            })
            .pipe(
                map((response) => {
                    this.productCache.set(
                        Object.values(this.shopParams).join('-'),
                        response
                    );
                    this.pagination = response;
                    return response;
                })
            );
    }

    setShopParams(params: ShopParams) {
        this.shopParams = params;
    }

    getShopParams() {
        return this.shopParams;
    }

    /**
     * Retrieves a product by its ID.
     * @param id The ID of the product to retrieve.
     * @returns An Observable of Product representing the retrieved product.
     */
    getProduct(id: number) {
        const product = [...this.productCache.values()].reduce(
            (acc, paginationResult) => {
                return {
                    ...acc,
                    ...paginationResult.data.find((p) => p.id === id),
                };
            },
            {} as Product
        );

        if (Object.keys(product).length > 0) return of(product);
        
        return this.http.get<Product>(this.baseUrl + 'products/' + id);
    }

    /**
     * Retrieves a list of brands.
     * @returns An Observable of Brand[] representing the list of brands.
     */
    getBrands() {
        if (this.brands.length > 0) {
            return of(this.brands);
        }

        return this.http
            .get<Brand[]>(this.baseUrl + 'products/brands')
            .pipe(map((brands) => (this.brands = brands)));
    }

    /**
     * Retrieves a list of types.
     * @returns An Observable of Type[] representing the list of types.
     */
    getTypes() {
        return this.http
            .get<Type[]>(this.baseUrl + 'products/types')
            .pipe(map((types) => (this.types = types)));
    }
}
