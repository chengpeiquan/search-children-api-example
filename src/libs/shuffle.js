/** 
 * 一个洗牌函数，用于返回随机列表
 */
 const shuffle = (arr) => {
  for ( let i = arr.length - 1; i > 0; i-- ) {
    const j = Math.floor(Math.random() * (i + 1));
    const item = arr[i];
    arr[i] = arr[j];
    arr[j] = item;
  }

  return arr;
}

module.exports = shuffle;