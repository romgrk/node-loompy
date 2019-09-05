import numpy as np
import loompy

filename = "test.loom"

matrix = np.arange(10000).reshape(100, 100)
row_attrs = {"SomeRowAttr": np.arange(100)}
col_attrs = {"SomeColAttr": np.arange(100)}

loompy.create(filename, matrix, row_attrs, col_attrs)
