/** 
 * 路由规则
 * @description 除了静态页面外的访问路径在这里定义
 */
const express = require('express');
const router = express.Router();
const getSearchChildrenData = require('../api/getSearchChildrenData');

// 接口：宝贝回家
router.get('/api/searchChildren', async (req, res) => {
  const data = await getSearchChildrenData();
  res.send(data);
})

module.exports = router;
