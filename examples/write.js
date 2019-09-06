/*
 * write.js
 */


const loompy = require('../')

const filename = 'test-from-js.loom'

const matrix =
  Array(10)
    .fill(0)
    .map((_, i) =>
      new Float64Array(10)
        .map((_, j) =>
          j < 5 ? 1 : 2))

const row_attrs = { SomeRowAttr: Array(10).fill(0).map((n, i) => `Element ${i * i * i}`) }
const col_attrs = { SomeColAttr: new Float64Array(10).map((_, i) => i) }

loompy.create(filename, matrix, row_attrs, col_attrs)
