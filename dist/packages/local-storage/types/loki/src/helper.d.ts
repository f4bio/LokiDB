export declare type RangedValueOperator = "$gt" | "$gte" | "$lt" | "$lte" | "$eq" | "$neq" | "$between";
export interface ILokiRangedComparer<T> {
    compare(val: T, val2: T): -1 | 0 | 1;
}
export interface IRangedIndexRequest<T> {
    op: RangedValueOperator;
    val: T;
    high?: T;
}
export interface IComparatorMap {
    [name: string]: ILokiRangedComparer<any>;
}
export declare let ComparatorMap: IComparatorMap;
export interface IRangedIndexFactoryMap {
    [name: string]: (name: string, comparator: ILokiRangedComparer<any>) => IRangedIndex<any>;
}
export declare let RangedIndexFactoryMap: IRangedIndexFactoryMap;
export interface IRangedIndex<T> {
    insert(id: number, val: T): void;
    update(id: number, val: T): void;
    remove(id: number): void;
    restore(tree: any): void;
    backup(): IRangedIndex<T>;
    rangeRequest(range?: IRangedIndexRequest<T>): number[];
    validateIndex(): boolean;
}
export declare function CreateJavascriptComparator<T>(): ILokiRangedComparer<T>;
export declare function CreateLokiComparator(): ILokiRangedComparer<any>;
/**
 * Helper function for determining 'loki' abstract equality which is a little more abstract than ==
 *     aeqHelper(5, '5') === true
 *     aeqHelper(5.0, '5') === true
 *     aeqHelper(new Date("1/1/2011"), new Date("1/1/2011")) === true
 *     aeqHelper({a:1}, {z:4}) === true (all objects sorted equally)
 *     aeqHelper([1, 2, 3], [1, 3]) === false
 *     aeqHelper([1, 2, 3], [1, 2, 3]) === true
 *     aeqHelper(undefined, null) === true
 * @param {any} prop1
 * @param {any} prop2
 * @returns {boolean}
 * @hidden
 */
export declare function aeqHelper(prop1: any, prop2: any): boolean;
/**
 * Helper function for determining 'less-than' conditions for ops, sorting, and binary indices.
 *     In the future we might want $lt and $gt ops to use their own functionality/helper.
 *     Since binary indices on a property might need to index [12, NaN, new Date(), Infinity], we
 *     need this function (as well as gtHelper) to always ensure one value is LT, GT, or EQ to another.
 * @hidden
 */
export declare function ltHelper(prop1: any, prop2: any, equal: boolean): boolean;
/**
 * @hidden
 * @param {any} prop1
 * @param {any} prop2
 * @param {boolean} equal
 * @returns {boolean}
 */
export declare function gtHelper(prop1: any, prop2: any, equal: boolean): boolean;
/**
 * @param {any} prop1
 * @param {any} prop2
 * @param {boolean} descending
 * @returns {number}
 * @hidden
 */
export declare function sortHelper(prop1: any, prop2: any, descending: boolean): number;
