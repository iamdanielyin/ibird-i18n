/**
 * 导出声明
 */

const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'i18n_list',
        method: 'GET',
        path: '/i18n',
        middleware: listRoute
    };
};


/**
 * 列表查询接口
 * @param {object} ctx
 */
async function listRoute(ctx) {
    // 当d为1时返回所有信息，否则只返回key
    const d = ctx.query.d || -1;
    const list = context.app.getLocaleList();
    ctx.body = { data: (d == 1) ? list : Object.keys(list) };
}