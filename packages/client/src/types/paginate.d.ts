declare interface Paginate<T = any> {
    items: T[];
    links: {
        first: string;
        last: string;
        next: string;
        previous: string;
    };
    meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    };
}
