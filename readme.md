
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

const row_attrs = { someTextAttributes: Array.from({ length: 10 }, (_, i) => `Element ${i * i * i}`) }
const col_attrs = { someDoubleAttributes: new Float64Array(10).map((_, i) => i) }

loompy.create(filename, matrix, row_attrs, col_attrs)
```

## Installation

This package depends on [hdf5.node](https://github.com/HDF-NI/hdf5.node), you need to specify
your libhdf5 location when installing for this dependency to compile correctly.
Read their readme for more details.

Example:
```
npm install loompy --hdf5_home_linux=/usr/lib/x86_64-linux-gnu/hdf5/serial
```
