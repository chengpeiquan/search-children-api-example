/** 
 * 一个代替 eval 的方法
 */
const evil = (fn) => {
  const Fn = Function;
  return new Fn('return ' + fn)();
}

module.exports = evil;