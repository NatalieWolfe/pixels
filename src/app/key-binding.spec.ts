import { KeyBinding } from './key-binding';

describe('KeyBinding', () => {
  it('should get and set items', () => {
    const keys = new KeyBinding();
    const item = () => {};
    const item2 = () => {};
    keys.set({code: 'foo'}, item);
    keys.set({ctrlKey: true, code: 'foo'}, item2);
    expect(keys.get({code: 'foo'})).toBe(item);
    expect(keys.get({ctrlKey: true, code: 'foo'})).toBe(item2);
  });

  it('should not error fetching unset items', () => {
    const keys = new KeyBinding();
    expect(keys.get({code: 'bar'})).toBeNull();
  });

  it('should delete items', () => {
    const keys = new KeyBinding();
    const item = () => {};
    keys.set({code: 'foo'}, item);
    expect(keys.delete({code: 'foo'})).toBeTrue();
    expect(keys.get({code: 'foo'})).toBeNull();
  });

  it('should be safe to delete unset keys', () => {
    const keys = new KeyBinding();
    expect(keys.delete({code: 'foo'})).toBeFalse();
    expect(keys.get({code: 'foo'})).toBeNull();
  });
});
