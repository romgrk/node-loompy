import loompy

with loompy.connect('test-from-js.loom', validate=True) as ds:
    print("File is ok")
