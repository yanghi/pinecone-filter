type Filter = Record<any, any>

export type FilterValueType = {
  equal: number | string | boolean
  notEqual: FilterValueType['equal']
  greaterThan: number
  greaterThanOrEqual: number,
  lessThan: number,
  lessThanOrEqual: number
  in: number | string | Array<string | number>
  notIn: FilterValueType['in'],
}
export enum Filters {
  equal = '$eq',
  notEqual = '$ne',
  greaterThan = '$gt',
  greaterThanOrEqual = '$gte',
  lessThan = '$lt',
  lessThanOrEqual = '$lte',
  in = '$in',
  notIn = '$nin',
}

export class PineconeFilterBuilder<Key extends string> {
  protected _filters: Filter
  constructor(init: Filter = {}) {
    this._filters = init
  }
  static isFilterDescription(o: unknown): boolean {
    return !!o && typeof o === 'object' && Object.keys(o).every(key => key in Filters)
  }
  static from(filter: Filter = {}) {
    return new PineconeFilterBuilder(filter)
  }
  protected _appendAsPrimitive<T extends string | number | boolean | undefined>(key: string, value: T, filterKey: Filters): T {

    if (value === undefined) return value

    const touchedProp = this._filters[key] || (this._filters[key] = {})

    touchedProp[filterKey] = value

    return touchedProp[filterKey]
  }
  protected _appendAsArray<T extends any[]>(key: string, value: T, filterKey: Filters): T {
    if (value === undefined) return value

    let touchedProp = this._filters[key] || (this._filters[key] = {})

    if (typeof touchedProp != 'object' || Array.isArray(touchedProp)) {
      touchedProp = this._filters[key] = { [filterKey]: touchedProp }
    }

    if (!touchedProp[filterKey]) {
      touchedProp[filterKey] = []
    } else if (!Array.isArray(touchedProp[filterKey])) {
      touchedProp[filterKey] = [touchedProp[filterKey]]
    }

    touchedProp[filterKey].push(...value)
    return touchedProp[filterKey]
  }
  protected _batchAppendAsArray(keyOrObj: any, value: any, filterKey: Filters) {
    if (typeof keyOrObj === 'string') {
      this._appendAsArray(keyOrObj, Array.isArray(value) ? value : [value], filterKey)
    } else {
      for (const key in keyOrObj) {
        value = keyOrObj[key]
        this._appendAsArray(key, Array.isArray(value) ? value : [value], filterKey)
      }
    }
  }
  protected _batchAppendAsPrimitive(keyOrObj: any, value: any, filterKey: Filters) {
    if (typeof keyOrObj === 'string') {
      this._appendAsPrimitive(keyOrObj, value, filterKey)
    } else {
      for (const key in keyOrObj) {
        this._appendAsPrimitive(key, keyOrObj[key], filterKey)
      }
    }
  }

  equal(key: Key, value: FilterValueType['equal'] | undefined): this
  equal(obj: Record<Key, FilterValueType['equal'] | undefined>): this
  equal(key: any, value?: FilterValueType['equal'] | undefined): this {
    this._batchAppendAsPrimitive(key, value, Filters.equal)
    return this
  }

  notIn(key: Key, value: FilterValueType['notIn'] | undefined): this
  notIn(obj: Record<Key, FilterValueType['notIn'] | undefined>): this
  notIn(key: any, value?: FilterValueType['notIn'] | undefined): this {
    this._batchAppendAsArray(key, value, Filters.notIn)
    return this
  }

  in(key: Key, value: FilterValueType['in'] | undefined): this
  in(obj: Record<Key, FilterValueType['in'] | undefined>): this
  in(key: any, value?: FilterValueType['in'] | undefined): this {
    this._batchAppendAsArray(key, value, Filters.in)
    return this
  }

  lessThan(key: Key, value: FilterValueType['lessThan'] | undefined): this
  lessThan(obj: Record<Key, FilterValueType['lessThan'] | undefined>): this
  lessThan(key: any, value?: FilterValueType['lessThan'] | undefined): this {
    this._batchAppendAsPrimitive(key, value, Filters.lessThan)
    return this
  }

  lessThanOrEqual(key: Key, value: FilterValueType['lessThanOrEqual'] | undefined): this
  lessThanOrEqual(obj: Record<Key, FilterValueType['lessThanOrEqual'] | undefined>): this
  lessThanOrEqual(key: any, value?: FilterValueType['lessThanOrEqual'] | undefined): this {
    this._batchAppendAsPrimitive(key, value, Filters.lessThanOrEqual)
    return this
  }

  greaterThan(key: Key, value: FilterValueType['greaterThan'] | undefined): this
  greaterThan(obj: Record<Key, FilterValueType['greaterThan'] | undefined>): this
  greaterThan(key: any, value?: FilterValueType['greaterThan'] | undefined): this {
    this._batchAppendAsPrimitive(key, value, Filters.greaterThan)
    return this
  }

  greaterThanOrEqual(key: Key, value: FilterValueType['greaterThanOrEqual'] | undefined): this
  greaterThanOrEqual(obj: Record<Key, FilterValueType['greaterThanOrEqual'] | undefined>): this
  greaterThanOrEqual(key: any, value?: FilterValueType['greaterThanOrEqual'] | undefined): this {
    this._batchAppendAsPrimitive(key, value, Filters.greaterThanOrEqual)
    return this
  }
  result() {
    return this._filters
  }
}

export default PineconeFilterBuilder

