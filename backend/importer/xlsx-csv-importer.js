module.exports.getData = async (data) => {
  const XLSX = require('xlsx');
  const workbook = XLSX.read(data, {type: 'buffer'});
  
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  const sheet = workbook.Sheets['Sheet1'];


  const jsonArr = [];
  for(let i = 2; i !== 999999; i++) {
    const obj = {}
    for (let col of columns) {
      if(sheet[`${col}${i}`] != undefined)
        obj[`${sheet[`${col}${1}`].v}`] = sheet[`${col}${i}`].v
    }
    if(Object.keys(obj).length > 2) jsonArr.push(obj);
  }

  return jsonArr
}

