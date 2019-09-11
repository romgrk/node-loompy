/*
 * index.js
 */

const hdf5 = require('@romgrk/hdf5').hdf5
const h5lt = require('@romgrk/hdf5').h5lt
const hdf5Globals = require('@romgrk/hdf5/lib/globals')
const Access = hdf5Globals.Access;
const H5Type = hdf5Globals.H5Type;

/*
 * | Type               | Corresponding C Type |
 * |--------------------|----------------------|
 * | H5T_NATIVE_CHAR    | char                 |
 * | H5T_NATIVE_SCHAR   | signed char          |
 * | H5T_NATIVE_UCHAR   | unsigned char        |
 * | H5T_NATIVE_SHORT   | short                |
 * | H5T_NATIVE_USHORT  | unsigned short       |
 * | H5T_NATIVE_INT     | int                  |
 * | H5T_NATIVE_UINT    | unsigned             |
 * | H5T_NATIVE_LONG    | long                 |
 * | H5T_NATIVE_ULONG   | unsigned long        |
 * | H5T_NATIVE_LLONG   | long long            |
 * | H5T_NATIVE_ULLONG  | unsigned long long   |
 * | H5T_NATIVE_FLOAT   | float                |
 * | H5T_NATIVE_DOUBLE  | double               |
 * | H5T_NATIVE_LDOUBLE | long double          |
 * | H5T_NATIVE_HSIZE   | hsize_t              |
 * | H5T_NATIVE_HSSIZE  | hssize_t             |
 * | H5T_NATIVE_HERR    | herr_t               |
 * | H5T_NATIVE_HBOOL   | hbool_t              |
 */

const TYPE = {
  INT8:    H5Type.H5T_NATIVE_CHAR, // char
  INT16:   H5Type.H5T_NATIVE_SHORT, // short
  INT32:   H5Type.H5T_NATIVE_INT, // int
  // INT64:   H5Type.H5T_NATIVE_LONG, // long
  UINT8:   H5Type.H5T_NATIVE_UCHAR, // unsigned char
  UINT16:  H5Type.H5T_NATIVE_USHORT, // unsigned short
  UINT32:  H5Type.H5T_NATIVE_UINT, // unsigned
  // UINT64:  H5Type.H5T_NATIVE_ULONG, // unsigned long
  FLOAT32: H5Type.H5T_NATIVE_FLOAT, // float
  FLOAT64: H5Type.H5T_NATIVE_DOUBLE, // double

  STRING:  H5Type.H5T_C_S1,
}

const TYPE_NAME = {
  [TYPE.INT8]: 'INT8', // char
  [TYPE.INT16]: 'INT16', // short
  [TYPE.INT32]: 'INT32', // int
  // [TYPE.INT64]: 'INT64', // long
  [TYPE.UINT8]: 'UINT8', // unsigned char
  [TYPE.UINT16]: 'UINT16', // unsigned short
  [TYPE.UINT32]: 'UINT32', // unsigned
  // [TYPE.UINT64]: 'UINT64', // unsigned long
  [TYPE.FLOAT32]: 'FLOAT32', // float
  [TYPE.FLOAT64]: 'FLOAT64', // double
  [TYPE.STRING]: 'STRING',
}

const SIZEOF = {
  [TYPE.INT8]:    1, // char
  [TYPE.INT16]:   2, // short
  [TYPE.INT32]:   4, // int
  // [TYPE.INT64]:   8, // long
  [TYPE.UINT8]:   1, // unsigned char
  [TYPE.UINT16]:  2, // unsigned short
  [TYPE.UINT32]:  4, // unsigned int
  // [TYPE.UINT64]:  8, // unsigned long
  [TYPE.FLOAT32]: 4, // float
  [TYPE.FLOAT64]: 8, // double
  [TYPE.STRING]:  undefined,
}

const WRITE_FUNCTION = {
  [TYPE.INT8]:    Buffer.prototype.writeInt8, // char
  [TYPE.INT16]:   Buffer.prototype.writeInt16LE, // short
  [TYPE.INT32]:   Buffer.prototype.writeInt32LE, // int
  // [TYPE.INT64]: undefined, // long
  [TYPE.UINT8]:   Buffer.prototype.writeUInt8, // unsigned char
  [TYPE.UINT16]:  Buffer.prototype.writeUInt16LE, // unsigned short
  [TYPE.UINT32]:  Buffer.prototype.writeUInt32LE, // unsigned int
  // [TYPE.UINT64]: undefined, // unsigned long
  [TYPE.FLOAT32]: Buffer.prototype.writeFloatLE, // float
  [TYPE.FLOAT64]: Buffer.prototype.writeDoubleLE, // double
  [TYPE.STRING]:  undefined,
}

module.exports = {
  create,
  TYPE,
}


/**
 * Creates a new loom file
 * @param {string} filename Path of the new file
 * @param {TypedArray[]} matrix Matrix of data, as TypedArrays
 * @param {Object.<string, Array>} rowAttrs Row attributes
 * @param {Object.<string, Array>} colAttrs Column attributes
 */
function create(filename, matrix, rowAttrs, colAttrs) {
  if (matrix.length === 0 || matrix[0].length === 0)
    throw new Error('Matrix dimensions should both be larger than zero')

  const type = getArrayType(matrix[0])
  const cols = matrix.length
  const rows = matrix[0].length

  // Create file
  const file = new hdf5.File(filename, Access.ACC_TRUNC);
  const layersGroup    = file.createGroup('layers')
  const colAttrsGroup  = file.createGroup('col_attrs')
  const colGraphsGroup = file.createGroup('col_graphs')
  const rowAttrsGroup  = file.createGroup('row_attrs')
  const rowGraphsGroup = file.createGroup('row_graphs')

  // Add spec version number
  file.setAttribute('LOOM_SPEC_VERSION', '2.0.1', { padding: H5Type.H5T_STR_NULLPAD })

  // Write matrix
  h5lt.makeDataset(
    file.id,
    'matrix',
    matrixToBuffer(matrix, type),
    { type: type, rank: 2, rows: rows, columns: cols }
  )

  // Write col_attrs
  Object.keys(colAttrs).forEach(groupName => {
    const array = colAttrs[groupName]

    makeDataset(
      colAttrsGroup,
      groupName,
      array,
    )
  })

  // Write row_attrs
  Object.keys(rowAttrs).forEach(groupName => {
    const array = rowAttrs[groupName]

    makeDataset(
      rowAttrsGroup,
      groupName,
      array,
    )
  })

  // Close
  layersGroup.close()
  colAttrsGroup.close()
  colGraphsGroup.close()
  rowAttrsGroup.close()
  rowGraphsGroup.close()
  file.close()
}


// Helpers

function getArrayType(array) {
  if (array instanceof Int8Array)
    return TYPE.INT8
  if (array instanceof Uint8Array)
    return TYPE.UINT8
  if (array instanceof Int16Array)
    return TYPE.INT16
  if (array instanceof Uint16Array)
    return TYPE.UINT16
  if (array instanceof Int32Array)
    return TYPE.INT32
  if (array instanceof Uint32Array)
    return TYPE.UINT32
  if (array instanceof Float32Array)
    return TYPE.FLOAT32
  if (array instanceof Float64Array)
    return TYPE.FLOAT64
  if (array.every(e => typeof e === 'string'))
    return TYPE.STRING
  throw new Error('Array isn\'t a TypedArray instance')
}

function arrayToBuffer(array, type) {
  if (type === TYPE.STRING)
    return array

  const size = SIZEOF[type]
  const write = WRITE_FUNCTION[type]

  const buffer = Buffer.allocUnsafe(array.length * size)

  for (let i = 0; i < array.length; i++) {
    const value = array[i]

    write.call(buffer, value, i * size)
  }

  return buffer
}

function matrixToBuffer(matrix, type) {
  const name = TYPE_NAME[type]
  const size = SIZEOF[type]
  const write = WRITE_FUNCTION[type]

  const cols = matrix.length
  const rows = matrix[0].length
  const elements = cols * rows
  const buffer = Buffer.alloc(elements * size)

  /* console.log({ name, size, fn: write.name, type, intType: H5Type.H5T_NATIVE_INT, })
   * console.log(buffer.toString('hex')) */

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const value = matrix[i][j]
      const offset = size * (i * cols + j)

      // console.log(`[${i}][${j}]: ${value} @ ${offset}`)
      write.call(buffer, value, offset)
    }
  }

  // console.log(buffer.toString('hex'))

  return buffer
}

function makeDataset(parent, groupName, array, options) {
  const type = getArrayType(array)

  if (type === TYPE.STRING) {
    // All strings in Loom files are stored as fixed-length null-padded 7-bit ASCII.
    return h5lt.makeDataset(
      parent.id,
      groupName,
      array,
      { fixedSize: true, padding: H5Type.H5T_STR_NULLPAD, ...options },
    )
  }

  const buffer = arrayToBuffer(array, type)

  return h5lt.makeDataset(
    parent.id,
    groupName,
    buffer,
    { type: type, ...options }
  )
}
