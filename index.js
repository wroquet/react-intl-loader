var loaderUtils = require('loader-utils')

module.exports = function () {}
module.exports.pitch = function (remainingRequest) {
  if (typeof this.cacheable === 'function') {
    this.cacheable()
  }

  var query = loaderUtils.parseQuery(this.query)
  var locale = query.locale
  var req = loaderUtils.stringifyRequest(this, '!!' + remainingRequest)

  return [
    'var addLocaleData = require("react-intl").addLocaleData;',
    'var areIntlLocalesSupported = require("intl-locales-supported");',
    'areIntlLocalesSupported = typeof areIntlLocalesSupported === "function" ? areIntlLocalesSupported : areIntlLocalesSupported.default',
    'module.exports = function (cb) {',
    '  if (areIntlLocalesSupported && areIntlLocalesSupported("' + locale + '")) {',
    '    require.ensure([',
    '      "react-intl/locale-data/' + locale + '",',
    '      ' + req,
    '    ], function (require) {',
    '      addLocaleData(require("react-intl/locale-data/' + locale + '"));',
    '      cb(require(' + req + '));',
    '    }, "locale-' + locale + '-no-intl");',
    '  } else {',
    '    require.ensure([',
    '      "intl/locale-data/jsonp/' + locale + '",',
    '      "react-intl/locale-data/' + locale + '",',
    '      ' + req,
    '    ], function (require) {',
    '      require("intl/locale-data/jsonp/' + locale + '");',
    '      addLocaleData(require("react-intl/locale-data/' + locale + '"));',
    '      cb(require(' + req + '));',
    '    }, "locale-' + locale + '");',
    '  }',
    '};'
  ].join('\n')
}
