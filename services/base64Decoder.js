/**
 * Simple Base64 Encode / Decode
 */
const encode = (txt) => {
    return new Buffer(txt).toString('base64')
}

const decode = (txt) => {
    return Buffer.from(txt, 'base64').toString()
}

module.exports = {
    encode,
    decode,
}
