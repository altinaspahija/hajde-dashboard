const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const productSubcategorySchema = new Schema({
  id: Schema.ObjectId,
  categoryId: { type: Schema.ObjectId },
  name: { type: String, min: 2, required: true },
  isActive: { type: Boolean, required: true },
  type: { type: String, required: true }
}, 
{
  versionKey: false, timestamps:  true
});


class ProductSubcatergoryRepository {

  constructor() {
    this.productSubcategoryModel = Mongoose.model("product-subcategories", productSubcategorySchema);
  }

  async getSubcategoryById(id) {
    try {
      return await this.productSubcategoryModel.findById(id);
    } catch(error) {
      throw error;
    }
  }

  async getAllSubcategories(categoryId, type) {
    try {
      return await this.productSubcategoryModel.find({type: type});
    } catch(error) {
      throw error
    }
  }
}

module.exports = ProductSubcatergoryRepository;