const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const productCategorySchema = new Schema({
  id: Schema.ObjectId,
  name: { type: String, min: 2, required: true },
  imageURL: { type: String, required: true },
  orderNo: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  type: { type: String, required: true },
}, {
  versionKey: false, timestamps: true
});


class ProductCategoryRepository {

  constructor() {
    this.pCategoryModel = Mongoose.model('product-categories', productCategorySchema);
  }

  
  async getCategoryByName(name, type) {
    try {
      return await this.pCategoryModel.findOne({name: name,  type: type });
    } catch (error) {
      throw (error);
    }
  }


  async getAllCategories(country) {
    try {
      return await this.pCategoryModel.find({country: country});
    } catch (error) {
      throw (error);
    }
  }

  async getAllCategoriesByType(type) {
    try {
      return await this.pCategoryModel.find({type: type});
    } catch (error) {
      throw (error);
    }
  }
}

module.exports = ProductCategoryRepository;