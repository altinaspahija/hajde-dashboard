const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const ProductSchema = new Schema({
  id: Schema.ObjectId,
  name: { type: String, min: 2, required: true },
  description: { type: String, min: 2, required: false },
  imageURL: { type: String, required: true },
  unit: { type: String, required: false },
  price: { type: Number, required: true },
  companyId: { type: Schema.ObjectId, required: true },
  productCode: { type: String, required: true },
  categoryId: {type: Schema.ObjectId, required: true},
  subcategoryId: {type: Schema.ObjectId, required: true},
  isAvailable: { type: Boolean, default: true },
  isRecommended : { type: Boolean, default: false }
},
{
  versionKey: false, timestamps: true
});

class ProductRepository {
  constructor () {
    this.productModel = Mongoose.model('Products', ProductSchema);
  }

  async createProduct (product) {
    return await new this.productModel(product).save();
  }

  async insertAll (products, productsTBD) {
    const dataToBeImported = [];
    for (const product of products) {
      dataToBeImported.push({
        updateOne: {
          filter: {
            productCode: product.productCode,
            companyId: Object(product.companyId)
          },
          update: product,
          upsert: true
        }
      });
    }

    if (productsTBD.length > 0) {
      for (const product of productsTBD) {
        if (product.outOfStock) {
          dataToBeImported.push({
            updateOne: {
              filter: {
                _id: ObjectId(product.productId),
                companyId: ObjectId(product.companyId),
              },
              update: { $set: { isAvailable: false } }
            }
          });
        } else {
          dataToBeImported.push({
            deleteOne: {
              filter: {
                _id: ObjectId(product.productId),
                companyId: ObjectId(product.companyId),
              }
            }
          });
        }
      }
    }
    return await this.productModel.bulkWrite(dataToBeImported);
  }

  async update (id, data) {
    return this.productModel.findByIdAndUpdate(id, { $set: data }, { new: false });
  }

  async delete (id) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async listAllPaginate (page, itemsPerPage, companyId, name, productCode, status) {
    const findData = { companyId: ObjectId(companyId) };
    if (name) findData.name = { $regex: name, $options: 'i' };
    if (productCode) findData.productCode = { $regex: productCode, $options: 'i' };
    if (status) findData.isAvailable = status;

    const products = await this.productModel.find(findData).sort({ isRecommended: -1, createdAt: -1 }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({ isRecommended: -1,'createdAt':-1});
    const total = await this.productModel.countDocuments(findData);

    return {
      products: products,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

  async listAllExport (page, itemsPerPage, companyId, name, productCode, status) {
    const findData = { companyId: ObjectId(companyId) };
    if (name) findData.name = { $regex: name, $options: 'i' };
    if (productCode) findData.productCode = { $regex: productCode, $options: 'i' };
    if (status) findData.isAvailable = status;

    const products = await this.productModel.find(findData).sort({isRecommended: 1, createdAt: -1 });
    const total = await this.productModel.countDocuments(findData);

    return {
      products: products,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

  async listAll (companyId) {
    const findData = { companyId: ObjectId(companyId) };
    const products = await this.productModel.find(findData);

    return {
      products: products
    };
  }

  async getProductById (id) {
    const data = await this.productModel.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      {$unwind: '$company'}
    ]);
    return data.pop();
  }

  async getProductByIdWithouLookup (id) {
    const data = await this.productModel.aggregate([
      { $match: { _id: ObjectId(id) } },
    ]);
    return data.pop();
  }

  async getProductByProductCode (code) {
    const data = await this.productModel.aggregate([
      { $match: { productCode: code } },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      }
    ]);

    return data.pop();
  }

  async getProductResById (id) {
    const data = await this.productModel.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      {$unwind: '$company'}
    ]);
    return data.pop();
  }

  async getProductByProductCode (code) {
    const data = await this.productModel.aggregate([
      { $match: { productCode: code } },
      
    ]);

    return data.pop();
  }


  async updateStatus (id, status) {
    return this.productModel.findByIdAndUpdate(id, { $set: { isAvailable: status } }, { new: false });
  }

  async getCountOfProductsOfCompany (companyId) {
    return this.productModel.countDocuments({ companyId: companyId });
  }

  async getCountOfProducts (country= '') {
    const findData = {}
    if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
    if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
    return this.productModel.count(findData);
  }

  async makeRecommended(id, value) {
    return this.productModel.findByIdAndUpdate(id, {$set:{isRecommended: value}}, {new: false});
  }
}

module.exports = ProductRepository;
