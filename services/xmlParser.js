var xml2js = require('xml2js');

/**
 * Wrapper for xml2js (with promises).
 */
module.exports = (input, options) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(input, options, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}