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
    // 当d不为空时返回所有信息，否则只返回必要信息
    const list = context.app.getLocaleList();
    let data = {};
    if (ctx.query.d) {
        data = list;
    } else {
        for (const key in list) {
            data[key] = list[key].locale || key;
        }
    }
    ctx.body = { data };
}