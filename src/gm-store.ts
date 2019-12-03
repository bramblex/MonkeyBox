
export declare function GM_getValue(name: string, defaultValue: any): string | null
export declare function GM_setValue(name: string, value: any): void
export declare function GM_deleteValue(name: string): void
export declare function GM_listValues(): string[]
type Listener = (name: string, oldValue: any, newValue: any, remote: any) => void
export declare function GM_addValueChangeListener<T>(name: string, listener: Listener): number;
export declare function GM_removeValueChangeListener(listenerId: number): void

class GMStoreClass implements Storage {
  get length() {
    return GM_listValues().length
  }

  key(index: number) {
    return GM_listValues()[index]
  }

  getItem(key: string) {
    return GM_getValue(key, null)
  }

  setItem(key: string, value: any) {
    return GM_setValue(key, value)
  }

  removeItem(key: string) {
    return GM_deleteValue(key)
  }

  clear() {
    for (const key of GM_listValues()) {
      GM_deleteValue(key);
    }
  }

  watch(key: string, listener: Listener): number {
    return GM_addValueChangeListener(key, listener);
  }

  unwatch(listenerId: number) {
    return GM_removeValueChangeListener(listenerId);
  }
}

export const GMStore = new GMStoreClass()