const fetch = require('node-fetch');

module.exports = {
    api_fetch(options) {
        const url = 'http://127.0.0.1:8000/api/' + options.url;
        const method = options.method;
        const headers = options.headers;
        const body = options.body;

        return fetch(url, {
            method: method,
            headers: headers,
            body: body,
        }).then(response => response.text())
    }
}