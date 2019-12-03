
export class Cache {
  readonly namespace: string
  readonly storage: Storage

  constructor(namespace: string, storage: Storage = localStorage) {
    this.storage = storage;
    this.namespace = namespace;
  }

  createCacheKey(key: string) {
    return [this.namespace, key].join('/');
  }

  isCacheKey(key: string) {
    return key.startsWith(this.namespace + '/')
  }

  set(key: string, value: any) {
    return this.storage.setItem(this.createCacheKey(key), JSON.stringify(value))
  }

  get(key: string) {
    try {
      return JSON.parse(this.storage.getItem(this.createCacheKey(key)) || 'null')
    } catch (_) {
      return null
    }
  }

  clear(key?: string) {
    const keys = key
      ? [this.createCacheKey(key)]
      : new Array(this.storage.length).fill(null)
        .map((_, i) => this.storage.key(i))
        .filter(k => k && this.isCacheKey(k))

    for (const key of keys) {
      key && this.storage.removeItem(key);
    }
  }
}