/** 
 * 宝贝回家
 * @description 404 页面提供走失儿童的信息
 * @see https://www.baobeihuijia.com/list.aspx?tid=1&photo=1&page=1
 */
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const shuffle = require('../libs/shuffle');

const __CONFIG__ = {
  domain: 'https://www.baobeihuijia.com',
  tid: 1,
  page: 1
};

/** 
 * 获取人物的详细信息
 * @description 缺失的信息统一处理为不详再返回
 */
const getInfo = async (url) => {
  // 要返回的基本信息格式
  const INFO = {
    photo: '',
    name: '不详',
    gender: '不详',
    birthday: '不详',
    missingDate: '不详',
    missingPlace: '不详',
    feature: '不详',
    url: url || __CONFIG__.domain
  };

  // 更新详情页里的字段数据
  try {
    const RES = await fetch(url);
    const RES_HTML = await RES.text();
    const DOM = new JSDOM(RES_HTML);
    const { window } = DOM;
    const { document } = window;

    // 提取照片
    const PHOTO_DOM = document.querySelector('#_table_1_photo img');
    const PHOTO = __CONFIG__.domain + PHOTO_DOM.getAttribute('src');
    INFO['photo'] = PHOTO;

    // 提取个人信息
    const INFO_DOM_LIST = document.querySelectorAll('#table_1_normaldivr li');
    INFO_DOM_LIST.forEach( (item, index) => {
      // 提取过滤掉标签后的文本
      const TEXT = item.innerHTML.replace(/<span>.*<\/span>/, '') || '不详';

      // 根据索引判断要存储的字段
      switch (index) {
        case 2:
          INFO['name'] = TEXT;
          break;
        case 3:
          INFO['gender'] = TEXT;
          break;
        case 4:
          INFO['birthday'] = TEXT;
          break;
        case 6:
          INFO['missingDate'] = TEXT;
          break;
        case 8:
          INFO['missingPlace'] = TEXT;
          break;
        case 10:
          INFO['feature'] = TEXT;
          break;
      }
    });
  } catch (e) {
    console.log(e);
  }

  return INFO;
}

/** 
 * 获取要查找的人物信息列表
 * @description 这里是最终要作为接口数据返回的列表
 */
const getResultList = async (domList) => {
  const RESULT_LIST = [];
  for (let i = 0; i < domList.length; i++) {
    // 拿到详情页的链接
    const A = domList[i];
    const URL = __CONFIG__.domain + A.getAttribute('href');

    // 需要再去详情页爬取详细的人员信息
    const INFO = await getInfo(URL);
    RESULT_LIST.push(INFO);
  }
  return RESULT_LIST;
}

/** 
 * 获取要查找的人物数据
 * @description 需要先从列表拿到人物详情页的链接，再去详情页爬取具体的数据回来
 */
const getSearchChildrenData = async () => {
  let result = [];

  try {
    const RES = await fetch(`${__CONFIG__.domain}/list.aspx?tid=${__CONFIG__.tid}&photo=1&page=${__CONFIG__.page}`);
    const RES_HTML = await RES.text();
    const DOM = new JSDOM(RES_HTML);
    const { window } = DOM;
    const { document } = window;

    // 提取列表的链接
    const LINK_LIST = document.querySelectorAll('#ti1 dt a');

    // 打乱顺序，提取被随机到的前三个
    const SHUFFLE_LIST = shuffle([...LINK_LIST]).slice(0, 3);

    // 因为还要继续请求，所以需要接受一个异步函数去继续处理
    result = await getResultList(SHUFFLE_LIST);
  } catch (e) {
    console.log(e);
  }

  return result;
}

module.exports = getSearchChildrenData;