/** 
 * 宝贝回家
 * @description 404 页面提供走失儿童的信息
 * @see https://www.qq.com/404/
 * @see https://qzone.qq.com/gy/404/data.js
 */
const fetch = require('node-fetch');
const evil = require('../libs/evil');

const getSearchChildrenData = async () => {
  let result = [];

  try {
    const RES = await fetch('https://qzone.qq.com/gy/404/data.js');
    const RES_HTML = await RES.text();

    // 过滤后转换为 JSON 
    const DATA = RES_HTML.replace(/\n|\t| /g, '')
                        .replace(/,}/g, '}')
                        .replace(/,]/g, ']')
                        .slice(18, -69);
    const JSON_DATA = evil(DATA);

    // 提取需要的数据
    result = JSON_DATA.map( item => {
      return {
        photo: item.child_pic || '',
        name: item.name || '不详',
        gender: item.sex || '不详',
        birthday: item.birth_time || '不详',
        missingDate: item.lost_time || '不详',
        missingPlace: item.lost_place || '不详',
        feature: item.child_feature || '不详',
        url: item.url || 'https://www.baobeihuijia.com/'
      }
    })
  } catch (e) {
    console.log(e);
  }

  return result;
}

module.exports = getSearchChildrenData;