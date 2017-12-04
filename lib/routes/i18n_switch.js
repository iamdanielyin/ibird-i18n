/**
 * 导出声明
 */

const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'i18n_switch',
        method: 'GET',
        path: '/i18n/:name/switch',
        middleware: switchRoute
    };
};


/**
 * 切换接口
 * @param {object} ctx
 */
async function switchRoute(ctx) {
    const name = ctx.params.name;
    if (!name) {
        ctx.body = { errcode: 500, errmsg: `'name' is required.` };
        return;
    }
    if (ctx.session) {
        ctx.session['locale'] = name;
        ctx.body = { data: ctx.session['locale'] };
    } else {
        ctx.body = { errcode: 500, errmsg: 'No session support.' };
    }
}