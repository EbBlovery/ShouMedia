var { cry } = require('./lib/util');
var validUrpLogin = require('../../lib/core/validUrpLogin');

module.exports = async function(ctx, next) {
    try {
        var { username, urppassword, thirdSession } = ctx.request.body;
        var _id = cry().decode(thirdSession);
        var { data } = await validUrpLogin(username, urppassword);
        if (data.pass) {
            ctx.db.Wxapp.update({ _id }, { username }, { upsert: true }).exec();
            ctx.body = {
                data: {
                    pass: true
                }
            }
        } else {
            ctx.body = {
                data: {
                    pass: false
                }
            }
        }
    } catch (error) {
        await next();
    }
}