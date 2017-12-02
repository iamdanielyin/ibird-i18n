const i18n = require('../index');
const zh_CN = require('./locales/zh_CN.json');
const en_US = require('./locales/en_US.json');
const hello_i18n = require('./locales/hello_i18n.json');

function c() {
    return {
        defaultLocale: 'zh_CN',
        locales: {
            zh_CN,
            en_US
        }
    };
}

i18n.onLoad({ c });
const enable = i18n.enable;

console.log('==> 输出默认...');
console.log(JSON.stringify(enable.getLocale(c().defaultLocale), null, 2));
console.log();

console.log('==> 设置hello_i18n...');
enable.setLocale('hello_i18n', hello_i18n);
console.log(enable.getLocaleString('keywords', { name: 'ibird-i18n' }));
console.log();

console.log('==> 切换en_US...');
enable.switchLocale('en_US');
console.log(JSON.stringify(enable.getLocale('en_US'), null, 2));
console.log();

console.log('==> 删除zh_CN...');
enable.removeLocale('zh_CN');
console.log(JSON.stringify(enable.getLocale('zh_CN'), null, 2));
console.log();