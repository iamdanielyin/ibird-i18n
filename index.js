/**
 * 国际化模块
 */


/**
 * 语言环境集合
 */
const locales = {};

/**
 * 当前启用的语言环境
 */
const enabled = {
    name: null,
    locale: {}
};

/**
 * 设置语言环境
 * @param name 名称
 * @param locale 配置对象
 * @param autoSwitch 是否自动切换
 */
function setLocale(name, locale, autoSwitch) {
    if (!name || !locale) return;
    locales[name] = locale;
    autoSwitch = (typeof autoSwitch === 'boolean') ? autoSwitch : true;
    if (autoSwitch) {
        switchLocale(name);
    }
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
 * 加载插件
 * @param app
 */
function onLoad(app) {
    const config = app.c();
    // 注册所有配置
    if (config.locales && Object.keys(config.locales).length > 0) {
        Object.assign(locales, config.locales);
    }
    // 切换默认环境
    switchLocale(config.defaultLocale);
}

/**
 * 导出模块
 */
module.exports = {
    namespace: 'ibird-i18n',
    onLoad,
    enable: {
        setLocale,
        switchLocale,
        removeLocale,
        getLocale,
        getLocaleString
    }
};