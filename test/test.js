const assert = require('assert');
const http = require('http');
const request = require('supertest');
const path = require('path');
const session = require('koa-session');
const i18nAddon = require('../lib/index');
const zh_CN = require('./locales/zh_CN.json');
const zh_TW = require('./locales/zh_TW.json');
const en_US = require('./locales/en_US.json');

describe('i18n Import', function () {
    let app;
    beforeEach(function () {
        i18nAddon.api.clearLocale();
        app = require('ibird').newApp();
    });

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
});


describe('i18n APIs', function () {
    let app;
    beforeEach(function () {
        i18nAddon.api.clearLocale();
        app = require('ibird').newApp();
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
        assert.deepEqual(app.getLocaleString('keywords', { name: 'ibird' }, 'zh_TW'), 'ibird,node,koa', 'getLocaleList:' + JSON.stringify(app.getLocaleList(), null, 2));
    });
});

describe('i18n Routes', function () {
    let app;
    beforeEach(function () {
        i18nAddon.api.clearLocale();
        app = require('ibird').newApp();
    })

    it('GET /i18n/:name', function (done) {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);

        request(http.createServer(app.callback()))
            .get('/i18n/en_US')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const data = res.body.data;
                assert.deepEqual(data.app, 'ibird', 'GET /i18n/:name :' + JSON.stringify(res.body, null, 2));
                done();
            });
    });

    it('GET /i18n/:name/switch', function (done) {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.keys = ['ibird'];
        app.use(session({ key: 'ibird:sess' }, app));
        app.play(null);

        request(http.createServer(app.callback()))
            .get('/i18n/zh_CN/switch')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const data = res.body.data;
                assert.deepEqual(data, 'zh_CN', 'GET /i18n/:name/switch :' + JSON.stringify(res.body, null, 2));
                done();
            });
    });


    it('GET /i18n', function (done) {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);

        request(http.createServer(app.callback()))
            .get('/i18n')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const data = res.body.data;
                assert.deepEqual(Object.keys(data).length, 3, 'GET /i18n :' + JSON.stringify(res.body, null, 2));
                done();
            });
    });


    it('GET /i18n?d=1', function (done) {
        app.import(i18nAddon, {
            localesDir: path.resolve(__dirname, 'locales')
        });
        app.play(null);

        request(http.createServer(app.callback()))
            .get('/i18n')
            .query({ d: 1 })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                const data = res.body.data;
                assert.deepEqual(data['en_US'].app, 'ibird', 'GET /i18n?d=1 :' + JSON.stringify(res.body, null, 2));
                done();
            });
    });
})