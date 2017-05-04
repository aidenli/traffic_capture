/**
 *
 * @returns 一個擴展后的對象
 * @private 第一個參數是目標對象，後面可以加n個對象進行擴展
 */
function _extend(){
  // copy reference to target object
  var target = arguments[0] || {}, i = 1, length = arguments.length, options;
  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target != "object" && typeof target != "function" )
    target = {};
  for ( ; i < length; i++ )
      // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null )
    // Extend the base object
      for ( var name in options ) {
        var copy = options[ name ];
        // Prevent never-ending loop
        if ( target === copy )
          continue;
        if ( copy !== undefined )
          target[ name ] = copy;
      }
  // Return the modified object
  return target;
}

module.exports = _extend;