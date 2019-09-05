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

/* const matrix =
 *   Array(10)
 *     .fill(0)
 *     .map((_, i) =>
 *       new Float64Array(10)
 *         .map((_, j) => (i === 0 && j === 0) ? 1 : 0)) */

// const row_attrs = { SomeRowAttr: new Float64Array(10).map((_, i) => i) }
const row_attrs = {
  SomeRowAttr: Array(10).fill(0).map((n, i) => `Element ${i}`),
  OtherAttr: new Float64Array(10).map((_, i) => i),
}
const col_attrs = { SomeColAttr: new Float64Array(10).map((_, i) => i) }

loompy.create(filename, matrix, row_attrs, col_attrs)
