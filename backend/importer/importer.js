const { google } = require('googleapis');
const mappingSub = require('../data_access/map_subcategories_categories')
const Subcategories = require('../data_access/product_subcategory_repository')
const mappingSubS = new mappingSub();
const subcategories = new Subcategories();
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = async (body, id) => {
  const privatekey = require('../service_keys/service_key.json');
  const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const sheetUrl = new URL(body.sheetUrl);
  const sheetId = sheetUrl.pathname.split('/')[3];
   const ranges = [
    'A1:A99999',
    'B1:B99999',
    'C1:C99999',
    'D1:D99999',
    'E1:E99999',
    'F1:F99999',
    'G1:G99999',
    'H1:H99999',
  ];


  const sheets = google.sheets({ version: 'v4', auth: jwtClient });
  const resposne = (await sheets.spreadsheets.values.batchGet({
    spreadsheetId: sheetId,
    ranges: ranges
  })).data;
  let jsonArr = [];

  for (let y = 1; y !== resposne.valueRanges[0].values.length+1; y++) {
    let obj = {};
    for (const i in ranges) {
      if (resposne.valueRanges[i].values[y]) obj[resposne.valueRanges[i].values[0]] = resposne.valueRanges[i].values[y][0];
    }
    if (obj) jsonArr.push(obj);
  }

  let jsonArr2 = [];

  try {
    for(let obj of jsonArr) {
      if(Object.keys(obj).length == 0) break;
      console.log(obj['Category code'], obj['Group code']);
      let subcat = await mappingSubS.getMapingByCategory(obj['Category code'], obj['Group code'], id);
      if (!subcat) {
        throw new Error(`Kategoria ${obj['Category code']} - ${obj['Group code']} mungon mappingu ! `);
      }
      const cat = await subcategories.getSubcategoryById(subcat.subcategoryId);
      let dt;

      if(cat.type == "market") {
        dt = {
            productCode: obj.productCode,
            name: obj.name,
            price: parseFloat(obj.price),
            unit: obj.unit,
            description: obj.description,
            imageURL: obj.imageURL,
            subcategoryId: ObjectId(subcat.subcategoryId),
            categoryId: ObjectId(cat.categoryId),
            isAvailable: true,
            companyId:ObjectId(id)
        }
      } else {
        dt = {
          productCode: obj.productCode,
          name: obj.name,
          price: parseFloat(obj.price),
          unit: obj.unit,
          description: obj.description,
          imageURL: obj.imageURL,
          subcategoryId: ObjectId(subcat.subcategoryId),
          categoryId: ObjectId(cat.categoryId),
          isAvailable: true,
          restaurantId:ObjectId(id)
      }
      }
      jsonArr2.push(dt)
      
    }
  return jsonArr2;  
  } catch(error) {
    console.log("error =>",error);
    throw error;
  } 
};

class ImporterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'importerError';
    this.status = 500;
  }
}

function getKey (object, value) {
  return Object.keys(object).find(e => object[e] === value);
}
