const assert = require('assert');
const path = require('path');
const i18nAddon = require('../index');
const zh_CN = require('./locales/zh_CN.json');
const zh_TW = require('./locales/zh_TW.json');
const en_US = require('./locales/en_US.json');

describe('i18n', function () {
    let app;
    beforeEach(function () {
        i18nAddon.enable.clearLocale();
        app = require('ibird').newApp();
    })

    it('options.locales', function () {
        app.import(i18nAddon, {
            locales: {
                zh_CN,
                zh_TW,
                en_US
            }
        });
        app.play(null);
        assert.deepEqual(Object.keys(app.getLocaleList()).length, 3, 'length:' + Object.keys(app.getLocaleList()).length);
        assert.deepEqual(app.getLocaleList()['zh_TW'].locale, '繁體中文', 'zh_TW:' + JSON.stringify(app.getLocaleList()['zh_TW'], null, 2));
    });

    it('options.localesDir', function () {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);
        assert.deepEqual(Object.keys(app.getLocaleList()).length, 3, 'length:' + Object.keys(app.getLocaleList()).length);
        assert.deepEqual(app.getLocaleList()['en_US'].version, '1.0.0', 'en_US:' + JSON.stringify(app.getLocaleList()['en_US'], null, 2));
    });

    it('app.addLocale', function () {
        app.import(i18nAddon, {
            locales: {
                zh_CN,
                zh_TW
            }
        });
        app.play(null);
        app.addLocale('en_US', en_US);
        assert.deepEqual(app.getLocaleList()['en_US'].app, 'ibird', 'en_US:' + JSON.stringify(app.getLocaleList()['en_US'], null, 2));
    });

    it('app.removeLocale', function () {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);
        app.removeLocale('en_US');
        assert.deepEqual(app.getLocale('en_US'), null, 'getLocaleList:' + JSON.stringify(app.getLocaleList(), null, 2));
    });

    it('app.getLocaleString', function () {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);
        assert.deepEqual(app.getLocaleString('keywords', { name: 'ibird' }, 'ibird,node,koa'), null, 'getLocaleList:' + JSON.stringify(app.getLocaleList(), null, 2));
    });
});