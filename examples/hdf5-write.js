/*
 * write.js
 */

const hdf5 = require('hdf5').hdf5
const h5lt = require('hdf5').h5lt
const hdf5Globals = require('hdf5/lib/globals')
const Access = hdf5Globals.Access;
const H5Type = hdf5Globals.H5Type;


// const filepath = 'example.loom'
// const file = new hdf5.File(filepath, Access.ACC_RDWR)

console.log(H5Type)
const file = new hdf5.File('./hdf5-test.h5', Access.ACC_TRUNC);
console.log(file)

const group = file.createGroup('test');
{
  const SIZE = 2
  const GROUP_NAME = 'ints'
  const COLS = 10
  const ROWS = 8

  const buffer = Buffer.alloc(8 * 10 * SIZE);

  for (let j = 0; j < COLS; j++) {
    for (let i = 0; i < ROWS; i++){
      const value = j < (COLS / 2) ? 1 : 2
      const offset = SIZE * (i * COLS + j)

      // buffer.writeDoubleLE(value, ROWS * (i * COLS + j))
      buffer.writeInt16LE(value, offset)
      console.log({ value, offset: offset })
      console.log(buffer.toString('hex'))
    }
  }

  h5lt.makeDataset(group.id, GROUP_NAME, buffer, {
    type: H5Type.H5T_NATIVE_SHORT,
    rank: 2,
    rows: ROWS,
    columns: COLS
  })

  /* const dimensions = group.getDatasetDimensions(GROUP_NAME)
   *
   * console.log('dimensions.length: ', dimensions.length)
   * console.log('dimensions[0]:     ', dimensions[0])
   * console.log('dimensions[1]:     ', dimensions[1])
   *
   * const subsetBuffer = Buffer.alloc(3*4*8, '\0', 'binary')
   * subsetBuffer.type = H5Type.H5T_NATIVE_DOUBLE;
   *
   * for (let j = 0; j < 4; j++) {
   *   for (let i = 0; i < 3; i++){
   *     subsetBuffer.writeIntLE(5, SIZE * (i * 4 + j))
   *   }
   * }
   *
   * h5lt.writeDataset(group.id, GROUP_NAME, subsetBuffer, { start: [1, 2], stride: [1, 1], count: [3, 4] }) */
}
