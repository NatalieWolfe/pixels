import { Tool } from "./tools";

export type Key = {
  ctrlKey?: boolean;
  altKey?: boolean;
  code: string;
};

export type BoundItem = Tool | ((...args: any) => any);

export class KeyBinding {
  private _bindings = new Map<boolean, Map<boolean, Map<string, BoundItem>>>();

  has(key: Key): boolean {
    return this._get(key) !== null;
  }

  get(key: Key): BoundItem | null {
    return this._get(key);
  }

  set(key: Key, item: BoundItem): void {
    this._set(key, item);
  }

  delete(key: Key): boolean {
    const altMap = this._softGetMap(key);
    if (altMap) return altMap.delete(key.code);
    return false;
  }

  private _softGetMap(key: Key): Map<string, BoundItem> | undefined {
    const altMap = this._bindings.get(key.ctrlKey || false);
    if (altMap) return altMap.get(key.altKey || false);
    return; // undefined
  }

  private _get(key: Key): BoundItem | null {
    const keyMap = this._softGetMap(key);
    if (keyMap) return keyMap.get(key.code) || null;
    return null;
  }

  private _set(key: Key, item: BoundItem): void {
    let altMap = this._bindings.get(key.ctrlKey || false);
    if (!altMap) {
      altMap = new Map<boolean, Map<string, BoundItem>>();
      this._bindings.set(key.ctrlKey || false, altMap);
    }
    let keyMap = altMap.get(key.altKey || false);
    if (!keyMap) {
      keyMap = new Map<string, BoundItem>();
      altMap.set(key.altKey || false, keyMap);
    }
    keyMap.set(key.code, item);
  }
}
