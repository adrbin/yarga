import '@testing-library/jest-dom';

const storage = () => {
  let store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store = new Map<string, string>();
    }
  };
};

Object.defineProperty(window, 'localStorage', {
  value: storage(),
  writable: true
});

if (!window.PointerEvent) {
  // Basic pointer event shim for React tests.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.PointerEvent = window.MouseEvent as any;
}
