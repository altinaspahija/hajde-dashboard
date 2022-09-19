const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const MenuSchema = new Schema({
  id: Schema.ObjectId,
  name: { type: String, min: 2, required: true },
  description: { type: String, min: 2, required: false },
  imageURL: { type: String, required: true },
  unit: { type: String, required: false },
  price: { type: Number, required: true },
  restaurantId: { type: Schema.ObjectId, required: true },
  categoryId: { type: Schema.ObjectId, required: true },
  subcategoryId: { type: Schema.ObjectId, required: true },
  isAvailable: { type: Boolean, default: true},
  productCode: { type: String, required: true },
  isRecommended: { type: Boolean, default: false }
},
{
  versionKey: false, timestamps: true
}
);



class MenuRepository {
  constructor() {
    this.menuModel = Mongoose.model('Menus', MenuSchema);
  }

  async createProduct(product) {
    return await new this.menuModel(product).save();
  }

  async insertAll(products, productsTBD) {
    const dataToBeImported = [];
    for (const product of products) {
      dataToBeImported.push({
        updateOne: {
          filter: {
            productCode: product.productCode,
            restaurantId: Object(product.restaurantId)
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
                restaurantId: ObjectId(product.restaurantId),
              },
              update: { $set: { isAvailable: false } }
            }
          });
        } else {
          dataToBeImported.push({
            deleteOne: {
              filter: {
                _id: ObjectId(product.productId),
                restaurantId: ObjectId(product.restaurantId),
              }
            }
          });
        }
      }
    }
    return await this.menuModel.bulkWrite(dataToBeImported);
  }

  async update(id, data) {
    return this.menuModel.findByIdAndUpdate(id, { $set: data }, { new: false });
  }

  async delete(id) {
    return await this.menuModel.findByIdAndDelete(id);
  }

  async listAllPaginate(page, itemsPerPage, restaurantId, name, productCode, status) {
    const findData = {restaurantId: ObjectId(restaurantId)};
    if(name) findData.name  = {$regex: name, $options: 'i'};
    if(productCode) findData.productCode = {$regex: productCode, $options: 'i'};
    if(status) findData.isAvailable = status;


    const products = await this.menuModel.find(findData).sort({isRecommended: -1, createdAt: -1 }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({isRecommended: -1,'createdAt':-1});
    const total = await this.menuModel.countDocuments(findData);

    return {
      products: products,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };

  }

  async listAllExport (page, itemsPerPage, restaurantId, name, productCode, status) {
    const findData = { restaurantId: ObjectId(restaurantId) };
    if (name) findData.name = { $regex: name, $options: 'i' };
    if (productCode) findData.productCode = { $regex: productCode, $options: 'i' };
    if (status) findData.isAvailable = status;

    const products = await this.menuModel.find(findData).sort({isRecommended: -1, createdAt: -1 });
    const total = await this.menuModel.countDocuments(findData);

    return {
      products: products,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

  async listAll (restaurantId) {
    const findData = { restaurantId: ObjectId(restaurantId) };
    const products = await this.menuModel.find(findData);

    return {
      products: products
    };
  }

  async getProductById (id) {
    const data = await this.menuModel.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {$unwind: '$restaurant'}
    ]);
    return data.pop();
  }

  async getProductByIdWithouLookup (id) {
    const data = await this.menuModel.aggregate([
      { $match: { _id: ObjectId(id) } },
    ]);
    return data.pop();
  }
  
  async getProductByProductCode (code) {
    const data = await this.menuModel.aggregate([
      { $match: { productCode: code } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {$unwind: '$restaurant'}
    ]);

    return data.pop();
  }

  async getProductResById (id) {
    const data = await this.menuModel.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurantId',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {$unwind: '$restaurant'}
    ]);
    return data.pop();
  }

  async getProductByProductCode (code) {
    const data = await this.menuModel.aggregate([
      { $match: { productCode: code } },
      
    ]);

    return data.pop();
  }


  async updateStatus (id, status) {
    return this.menuModel.findByIdAndUpdate(id, { $set: { isAvailable: status } }, { new: false });
  }

  async getCountOfProductsOfCompany (restaurantId) {
    return this.menuModel.countDocuments({ restaurantId: companyId });
  }

  async getCountOfProducts () {
    return this.menuModel.count();
  }


  async makeRecommended(id, value) {
    return this.menuModel.findByIdAndUpdate(id, {$set:{isRecommended: value}}, { new: false });
  }
}

module.exports = MenuRepository;

