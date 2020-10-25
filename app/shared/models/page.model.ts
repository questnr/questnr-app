export class PaginationData {
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}

export class Page<T> extends PaginationData {
    content: T[];
}

export class Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: Sort;
    unpaged: boolean;
}

export class Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}