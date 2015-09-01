HTTP Playground
=====

This library is an attempt to learn about providing good library APIs in Javascript code. It's just a place to experiment and learn. Expect bugs and weird behavior.

### Current Issues

+    Every time a success/failure handler is added, it is stored as global state. Accross multiple calls to `HTTP.get`, appenders are not reset and will all be called on every request.