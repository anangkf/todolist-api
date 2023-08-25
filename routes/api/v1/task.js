const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const taskModule = require(`${__module_dir}/task.module.js`);

router.get('/', async function (req, res, next) {
  const list = await taskModule.show();
  console.log(list);
  helper.sendResponse(res, list);
});

module.exports = router;
