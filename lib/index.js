/**
 * 国际化模块
 */

const utility = require('ibird-utils');
const Mustache = require('mustache');
const namespace = 'ibird-i18n';
const presetLocale = 'en_US';

const zh_CN = require('./locales/zh_CN.json');
const en_US = require('./locales/en_US.json');

/**
 * 当前启用的语言环境
 */
const enabled = {
    name: presetLocale,
    locale: en_US
};

/**
 * 全局变量
 */
var locales = {
    zh_CN,
    en_US
};
var ctx = {};
var routes = ['i18n_name', 'i18n_switch', 'i18n_list'];

/**
 * 加载插件
 * @param app
 * @param options
 */
function onload(app, options) {
    locales = {};
    ctx = {};

    ctx.app = app;
    ctx.options = options || {};

    const config = app.c();
    // 注册所有配置
    if (ctx.options.locales && Object.keys(ctx.options.locales).length > 0) {
        Object.assign(locales, ctx.options.locales);
    }
    ctx.options.defaultLocale = ctx.options.defaultLocale || presetLocale;
    // 切换默认环境
    switchLocale(ctx.options.defaultLocale);
    // 挂载目录
    if (ctx.options.dir) {
        addLocaleDir(ctx.options.dir);
    }
    // 加工路由
    for (const key of routes) {
        const item = require(`./routes/${key}`);
        routes[key] = item(ctx);
    }
    app.locales = locales;
    app.defaultLocale = ctx.options.defaultLocale;
}

/**
 * 添加语言环境
 * @param name 名称
 * @param locale 配置对象
 */
function addLocale(name, locale) {
    if (!name) return;
    if (typeof name !== 'string' && !locale) return;
    locales[name] = locale;
}
/**
 * 自动挂载国际化资源目录
 * @param dir 文件目录
 */
function addLocaleDir(dir) {
    utility.recursiveDir(dir, (obj, parse) => {
        addLocale(parse.name, obj);
    }, parse => ['.js', '.json'].indexOf(parse.ext) >= 0);
}

/**
 * 切换语言环境
 * @param name 名称
 * @param locale 配置对象
 */
function switchLocale(name) {
    if (!name) return;
    enabled.name = name;
    enabled.locale = locales[name] || {};
    return enabled.locale;
}

/**
 * 刪除语言环境
 * @param name 名称
 * @param locale 配置对象
 */
function removeLocale(name) {
    if (!name) return;
    delete locales[name];
}

/**
 * 清空所有语言环境
 */
function clearLocale() {
    for (const name in locales) {
        removeLocale(name)
    }
}

/**
 * 获取语言环境
 * @param name 名称
 */
function getLocale(name) {
    return name ? (locales[name] || null) : null;
}

/**
 * 获取所有语言环境
 */
function getLocaleList() {
    return locales;
}

/**
 * 获取国际化值
 * @param key
 * @param params
 * @param localeOrName
 */
function getLocaleString(key, params, localeOrName) {
    let locale = (typeof localeOrName === 'string') ? locales[localeOrName] : null;
    if (typeof locale !== 'object' || Object.keys(locale).length === 0) {
        localeOrName = presetLocale;
        locale = locales[localeOrName]
    }
    if (typeof locale !== 'object' || Object.keys(locale).length === 0) {
        localeOrName = ctx.options.defaultLocale;
        locale = locales[localeOrName]
    }
    if (typeof locale !== 'object' || Object.keys(locale).length === 0) {
        throw new Error('Invalid i18n settings.');
    }
    const value = locale[key];
    if (!key || !value) return null;
    return Mustache.render(value, params);
}

/**
 * 导出模块
 */
module.exports = {
    namespace,
    onload,
    api: {
        enabledLocale: enabled,
        addLocale,
        addLocaleDir,
        removeLocale,
        clearLocale,
        switchLocale,
        getLocale,
        getLocaleList,
        getLocaleString
    },
    routes
};