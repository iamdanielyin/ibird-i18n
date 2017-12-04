/**
 * 导出声明
 */

const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'i18n_name',
        method: 'GET',
        path: '/i18n/:name',
        middleware: nameRoute
    };
};


/**
 * 根据名称查询接口
 * @param {object} ctx
 */
async function nameRoute(ctx) {
    const name = ctx.params.name;
    ctx.body = { data: name ? context.app.getLocale(name) : null };
}