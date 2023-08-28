const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const authModule = require(`${__module_dir}/auth.module.js`);
const middleware = require(__middlewares_dir);

router.post('/register', async function (req, res, next) {
  const { body } = req;
  const user = await authModule.add(body);

  delete body.password;
  helper.sendResponse(res, { ...user, data: { ...user.data, user: body } });
});

module.exports = router;
