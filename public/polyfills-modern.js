// Minimal modern polyfills for baseline features
(function(){
  // Array.prototype.at
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
      value: function at(n) {
        n = Math.trunc(n) || 0;
        if (n < 0) n += this.length;
        if (n < 0 || n >= this.length) return undefined;
        return this[n];
      },
      configurable: true,
      writable: true
    });
  }

  // Array.prototype.flat
  if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
      value: function flat(depth) {
        const d = depth === undefined ? 1 : Number(depth) || 0;
        const result = [];
        (function flatten(arr, level){
          for (let i = 0; i < arr.length; i++) {
            const val = arr[i];
            if (Array.isArray(val) && level > 0) {
              flatten(val, level - 1);
            } else {
              result.push(val);
            }
          }
        })(this, d);
        return result;
      },
      configurable: true,
      writable: true
    });
  }

  // Array.prototype.flatMap
  if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
      value: function flatMap(fn, thisArg) {
        return this.map(fn, thisArg).flat(1);
      },
      configurable: true,
      writable: true
    });
  }

  // Object.fromEntries
  if (!Object.fromEntries) {
    Object.fromEntries = function fromEntries(iterable) {
      const obj = {};
      for (const [key, value] of iterable) {
        obj[key] = value;
      }
      return obj;
    };
  }

  // Object.hasOwn
  if (!Object.hasOwn) {
    Object.hasOwn = function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };
  }

  // String.prototype.trimStart / trimEnd
  if (!String.prototype.trimStart) {
    String.prototype.trimStart = function(){ return this.replace(/^\s+/, ''); };
  }
  if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function(){ return this.replace(/\s+$/, ''); };
  }
})();

export {};