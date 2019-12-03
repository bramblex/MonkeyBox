
export class Cache {
  private namespace: string
  private storage: Storage

  private createNamespaceCacheKey(key: string) {
    return [this.namespace, key].join('/');
  }

  private isNamespaceCacheKey(key: string) {
    return key.startsWith(this.namespace + '/')
  }

  constructor(namespace: string, storage: Storage = localStorage) {
    this.storage = storage;
    this.namespace = namespace;
  }

  set(key: string, value: any) {
    return this.storage.setItem(this.createNamespaceCacheKey(key), JSON.stringify(value))
  }

  get(key: string) {
    try {
      return JSON.parse(this.storage.getItem(this.createNamespaceCacheKey(key)) || 'null')
    } catch (_) {
      return null
    }
  }

  clear(key?: string) {
    const keys = key
      ? [this.createNamespaceCacheKey(key)]
      : new Array(this.storage.length).fill(null)
        .map((_, i) => this.storage.key(i))
        .filter(k => k && this.isNamespaceCacheKey(k))

    for (const key of keys) {
      key && this.storage.removeItem(key);
    }
  }
}