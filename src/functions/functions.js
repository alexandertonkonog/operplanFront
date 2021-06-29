export let makeArrays = (obj, count) => {
    let innerData = {};
    let need = [];
    let sortObject = obj => {
      let needObj = {};
      Object.keys(obj).sort(compareNumbers).forEach(key => {
        needObj[key] = obj[key];
      });
      return needObj;
    }
    let compareNumbers = (a, b) => {
      return parseInt(a.replace(/[^\d]/g, '')) - parseInt(b.replace(/[^\d]/g, ''));
    }
    let cutArrays = arr => {
        if(arr.length<=count) need.push(arr);
        else {
            let pushArr = arr.slice(0, count);
            let newArr = arr.slice(count);
            need.push(pushArr);
            return cutArrays(newArr);
        }
    }
    innerData.cols = Object.values(sortObject(obj.meta.cols));
    cutArrays(obj.data.map(item => Object.values(sortObject(item))));
    innerData.rows = need;
    innerData.results = obj.meta.results.map(item => item.result);
    return innerData;
}
export let getSides = (cols, rows, res) => {
    let comWidth = 100/cols;
    let firstWidth = comWidth*1.5;
    let otherWidth = (100-firstWidth)/(cols-1);
    let comHeight = 100/(rows+2);
    let procerence = cols-res;
    let resWidth = procerence === 0 ? 0 : (procerence === 1 ? firstWidth : firstWidth+((procerence-1)*otherWidth));
    return {
      width: {
        first: firstWidth,
        other: otherWidth
      },
      height: comHeight,
      widthRes: resWidth
    };
}
export let getColor = (ind, arr) => {
  if (ind === 7) {
    let proc = arr[6]/10;
    if (arr[6] <= arr[7]) return 'table__item';
    else if (arr[6] - arr[7] > proc) return 'table__item table__item_ltp';
    else if (arr[6] - arr[7] <= proc) return 'table__item table__item_ltp10';
    else return 'table__item';
  } else if (ind === 5) {
    if(arr[5] >= 70) return 'table__item';
    else return 'table__item table__item_ltp';
  } else if (ind === 9) {
    if(arr[9] >= 100) return 'table__item table__item_btp';
    else return 'table__item'; 
  } else return 'table__item';
}