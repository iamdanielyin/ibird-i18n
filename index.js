/**
 * 国际化模块
 */

const utility = require('ibird-utils');
const Mustache = require('mustache');
const namespace = 'ibird-i18n';

/**
 * 语言环境集合
 */
const locales = {};
const ctx = {};

/**
 * 加载插件
 * @param app
 * @param options
 */
function onLoad(app, options) {
    ctx.app = app;
    ctx.options = options || {};

    const config = app.c();
    // 注册所有配置
    if (options.locales && Object.keys(options.locales).length > 0) {
        Object.assign(locales, options.locales);
    }
    // 挂载目录
    if (options.localesDir) {
        addLocaleDir(options.localesDir);
    }
}

/**
 * 添加语言环境
 * @param name 名称
 * @param locale 配置对象
 */
function addLocale(name, locale) {
    if (!name) return;
    if (typeof name === 'string' && !locale) return;
    if (typeof name === 'object') {
        locale = name.localeConfig;
        name = name.localeName;
    }
    locales[name] = locale;
}
/**
 * 自动挂载国际化资源目录
 * @param dir 文件目录
 */
function addLocaleDir(dir) {
    utility.recursiveDir(dir, (obj, parse) => {
        if (obj.localeName && obj.localeConfig) {
            addLocale(obj);
        } else {
            addLocale(parse.name, obj);
        }
    }, parse => ['.js', '.json'].indexOf(parse.ext) >= 0);
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
    const locale = (typeof localeOrName === 'string') ? locales[localeOrName] : localeOrName;
    if (typeof locale !== 'object' || Object.keys(locale).length === 0) {
        return null;
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
    onLoad,
    enable: {
        addLocale,
        addLocaleDir,
        removeLocale,
        clearLocale,
        getLocale,
        getLocaleList,
        getLocaleString
    }
};