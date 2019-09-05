
# loompy

This package provides a way to create [loompy](https://loompy.org/) files in Node.

## API

`loompy.create(filename: string, matrix: TypedArray[], rowAttrs: Object<string:Array>), colAttrs: Object<string:Array>)`

```javascript
const loompy = require('loompy')


const filename = 'example.loom'

const matrix =
  Array(10).fill(0).map((_, i) =>
      new Float64Array(10).map((_, j) => j < 5 ? 1 : 2))

const row_attrs = { SomeRowAttr: new Float64Array(10).map((_, i) => i) }
const col_attrs = { SomeColAttr: new Float64Array(10).map((_, i) => i) }

loompy.create(filename, matrix, row_attrs, col_attrs)
```
