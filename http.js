var HTTP = (function() {
    // todo: reset xhr between requests, handlers are appended and then all called on every request
    var xhr = new XMLHttpRequest(),
        method = 'GET'
        requestURI = null;

    var addHandler = function(event, handler) {
        var existingEvent = xhr[event];
        if (existingEvent) {
            xhr[event] = function() {
                existingEvent.call(xhr);
                handler.call(xhr);
            }
        } else {
            xhr[event] = handler;
        }
    };

    var sendAsync = function() {
        var async = true;
        xhr.open(method, requestURI, async);
        xhr.send();
        return xhr;
    };

    var sendNow = function(dataRetriever) {
        var async = false;
        xhr.open(method, requestURI, async);
        xhr.send();
        return dataRetriever.call(xhr, xhr);
    };

    var handlers = {
        xhr: xhr,
        success: function(callback) {
            addHandler('onload', function() {
                if (xhr.status > 199 && xhr.status < 300) {
                    callback.call(xhr, xhr.responseText, xhr.status);
                }
            });

            return handlers;
        },
        failure: function(callback) {
            addHandler('onload', function() {
                if (xhr.status < 200 || xhr.status > 299) {
                    callback.call(xhr, xhr.responseText, xhr.status);
                }
            });

            addHandler('onerror', function() {
                callback.call(xhr, xhr.responseText, xhr.status);
            });

            return handlers;
        },
        send: function() {
            sendAsync();
        },
        body: function() {
            return sendNow(function(xhr) {
                return xhr.responseText;
            });
        },
        status: function() {
            return sendNow(function(xhr) {
                xhr.status;
            });
        }
    };

    return {
        get: function(uri) {
            method = 'GET';
            requestURI = uri;
            return handlers;
        }
    };
})();
