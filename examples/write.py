import numpy as np
import loompy

filename = "test.loom"

matrix = np.arange(100).reshape(10, 10)
row_attrs = {
    "SomeRowAttr": np.arange(10),
    "SomeTextAttr": np.array(['Element ' + str(i * i * i) for i in range(10)]),
}
col_attrs = {"SomeColAttr": np.arange(10)}

loompy.create(filename, matrix, row_attrs, col_attrs)
