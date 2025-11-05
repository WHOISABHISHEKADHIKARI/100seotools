// Legacy polyfills (executed in browsers without ESM support via noModule)
(function(){
  // Same minimal baseline polyfills as modern
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
      value: function at(n) {
        n = Math.trunc(n) || 0;
        if (n < 0) n += this.length;
        if (n < 0 || n >= this.length) return undefined;
        return this[n];
      }, configurable: true, writable: true
    });
  }
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
      }, configurable: true, writable: true
    });
  }
  if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
      value: function flatMap(fn, thisArg) {
        return this.map(fn, thisArg).flat(1);
      }, configurable: true, writable: true
    });
  }
  if (!Object.fromEntries) {
    Object.fromEntries = function fromEntries(iterable) {
      var obj = {};
      for (var i = 0; i < iterable.length; i++) {
        var pair = iterable[i];
        obj[pair[0]] = pair[1];
      }
      return obj;
    };
  }
  if (!Object.hasOwn) {
    Object.hasOwn = function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    };
  }
  if (!String.prototype.trimStart) {
    String.prototype.trimStart = function(){ return this.replace(/^\s+/, ''); };
  }
  if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function(){ return this.replace(/\s+$/, ''); };
  }
})();