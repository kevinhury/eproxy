const requestClient = require('../../services/request')

const eproxy = (parser, decoder) => {
    return {
        fetch: (req, res, next) => {
            const resType = req.params.resType
            const timeout = parseInt(req.query.timeout) || 0
            const errType = req.query.errors
            const urls = req.urls
            const requests = urls
                .map(url => makeRequest(url, errType, timeout, parser))

            return Promise.all(requests)
                .then(responses => {
                    return aggreagateResponses(urls, responses, resType)
                })
                .then(response => {
                    return res.send(response)
                })
                .catch(err => {
                    return res.status(400).send('failed')
                })
        },
        urlDecoder: (req, res, next) => {
            const encodedUrls = req.params.encodedUrls
            const urlsDecoded = decoder.decode(encodedUrls)
            req.urls = JSON.parse(urlsDecoded)
            next();
        },
        paramsValidator: (req, res, next) => {
            const resType = req.params.resType
            const errType = req.query.errors

            const resTypeInvalid = resType !== RES_TYPE_COMBINED && resType !== RES_TYPE_APPENDED
            const errTypeInvalid = errType !== ERR_TYPE_ANY && errType !== ERR_TYPE_REPLACE
            if (resTypeInvalid || errTypeInvalid) {
                return res.status(422).send({ error: 'Bad parameters.' })
            }
            next();
        },
    }
}

const makeRequest = (url, errType, timeout, responseParser) => {
    const req = requestClient(url, { timeout }).then(res => {
        return responseParser(res)
    })
    if (errType === ERR_TYPE_REPLACE) {
        return req.catch(err => {
            return 'failed'
        })
    }
    return req
}


const aggreagateResponses = (urls, responses, resType) => {
    if (resType === RES_TYPE_APPENDED) {
        return appendResponses(urls, responses)
    }
    else if (resType === RES_TYPE_COMBINED) {
        return combineResponses(urls, responses)
    }
    else {
        throw 'Invalid response type'
    }
}

const combineResponses = (urls, responses) => {
    const mapped = {}
    urls.forEach((url, index) =>
        mapped[url] = responses[index]
    )
    return mapped
}

const appendResponses = (urls, responses) => {
    return urls.map((url, index) => {
        return { url, body: responses[index] }
    })
}

const ERR_TYPE_ANY = 'fail_any'
const ERR_TYPE_REPLACE = 'replace'

const RES_TYPE_COMBINED = 'combined'
const RES_TYPE_APPENDED = 'appended'

module.exports = eproxy
