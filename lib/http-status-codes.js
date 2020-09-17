////////////////////////////////////////////////////////////////////////////////
//
// httpStatusCodes.js
//
// This module defines a nested JS object. The purpose of the object is to
// mimic an enumeration as found in other languages in order to avoid 
// magic strings and number. It also avoids errors such as typing a 204
// when you meant 201 by using keys that read like English.
//
////////////////////////////////////////////////////////////////////////////////


const httpStatusCodes = {

    informational: {
        "continue": 100,
        "switchingProtocols": 101,
        "processing": 102,
        "earlyHints": 103

    },
    success: {
        "ok": 200,
        "created": 201,
        "accepted": 202,
        "nonAuthoratativeInfo": 203,
        "noContent": 204,
        "resetContent": 205,
        "partialContent": 206,
        "multiStatus": 207,
        "alreadyREported": 208,
        "imUsed": 226
    },
    redirection: {
        "multipleChoices": 300,
        "movedPermanently": 301,
        "found": 302,
        "seeOther": 303,
        "notModified": 304,
        "useProxy": 305,
        "switchProxy": 306,
        "temporaryRedirect": 307,
        "permanentRedirect": 308
    },
    clientErrors: {
        "badRequest": 400,
        "unauthorized": 401,
        "paymentsRequired": 402,
        "forbidden": 403,
        "notFound": 404,
        "methodNotAllowed": 405,
        "notAcceptable": 406,
        "proxyAuthenticationRequired": 407,
        "requestTimeout": 408,
        "conflict": 409,
        "gone": 410,
        "lengthRequired": 411,
        "preconditionFailed": 412,
        "payloadTooLarge": 413,
        "uriTooLong": 414,
        "unsupportedMediaType": 415,
        "rangeNotSatisfiable": 416,
        "expectationFailed": 417,
        "imATeapot": 418,
        "misdirectedRequest": 421,
        "unprocessableEntity": 422,
        "locked": 423,
        "failedDependency": 424,
        "tooEarly": 425,
        "upgradeRequired": 426,
        "preconditionRequired": 428,
        "tooManyRequests": 429,
        "requestHeaderFieldsTooLarge": 431,
        "unavailableForLegalReasons": 451

    },
    serverErrors: 
    {
        "internalServerError": 500,
        "notImplemented": 501,
        "badGateway": 502,
        "serviceUnavailable": 503,
        "gatewayTimeout": 504,
        "httpVersionNotSupported": 500,
        "variantAlsoNegotiates": 506,
        "insufficientStorage": 507,
        "loopDetected": 508,
        "notExtended": 510,
        "networkAuthenticationRequired": 511
    }
}


module.exports = httpStatusCodes;