/**
 * 国际化模块
 */

const utility = require('ibird-utils');
const namespace = 'ibird-i18n';

/**
 * 语言环境集合
 */
const locales = {};
const ctx = {};

/**
 * 当前启用的语言环境
 */
const enabled = {
    name: null,
    locale: {}
};

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
    if (config.locales && Object.keys(config.locales).length > 0) {
        Object.assign(locales, config.locales);
    }
    // 切换默认环境
    switchLocale(config.defaultLocale);
}

/**
 * 设置语言环境
 * @param name 名称
 * @param locale 配置对象
 * @param autoSwitch 是否自动切换
 */
function setLocale(name, locale, autoSwitch) {
    if (!name) return;
    if (typeof name === 'string' && !locale) return;
    if (typeof name === 'object') {
        locale = name.locale;
        autoSwitch = name.autoSwitch;
        name = name.name;
    }
    locales[name] = locale;
    autoSwitch = (typeof autoSwitch === 'boolean') ? autoSwitch : true;
    if (autoSwitch) {
        switchLocale(name);
    }
}
/**
 * 自动挂载国际化资源目录
 * @param dir 文件目录
 */
function setLocaleDir(dir) {
    utility.recursiveDir(dir, (obj, parse) => {
        if (obj.name) {
            setLocale(obj.name, obj.locale, obj.autoSwitch);
        } else {
            setLocale(parse.name, obj, false);
        }
    });
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
 * 切换语言环境
 * @param name 名称
 * @param locale 配置对象
 */
function switchLocale(name) {
    if (!name) return;
    enabled.name = name;
    enabled.locale = locales[name] || {};
}

/**
 * 获取语言环境
 * @param name 名称
 */
function getLocale(name) {
    return name ? (locales[name] || null) : null;
}

/**
 * 获取国际化值
 * @param key
 * @param args
 */
function getLocaleString(key, ...args) {
    if (!key || !enabled.locale[key]) return null;

    const value = enabled.locale[key];
    return (typeof value === 'function') ? value.call(null, args) : value;
}

/**
 * 导出模块
 */
module.exports = {
    namespace,
    onLoad,
    enable: {
        setLocale,
        setLocaleDir,
        switchLocale,
        removeLocale,
        getLocale,
        getLocaleString
    }
};