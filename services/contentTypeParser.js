const xmlParser = require('./xmlParser')

/**
 * Parses the response body based on the content-type header.
 * Supports json / xml (as requested)
 */
module.exports = (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType) {
        throw 'Unsupported content-type'
    }
    if (contentType.includes('application/json')) {
        return response.json()
    }
    else if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
        return response.text().then(data => {
            return xmlParser(data)
        })
    } else {
        throw 'Unsupported content-type'
    }
}