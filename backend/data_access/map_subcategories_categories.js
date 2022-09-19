const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;
const Schema = Mongoose.Schema;
const mapSubcategoriesDataCategoriesSchema = new Schema({
  subcategoryId: {type: Schema.ObjectId, required: true },
  companyId: {type: Schema.ObjectId, required: true },
  categoryCode: {type: String, required: false },
  subCategoryCode: {type: String, required: false },
});

class mapSubcategoriesDataCategoriesRepository {

  constructor() {
    this.mapModel = Mongoose.model('map-subcategories-categories', mapSubcategoriesDataCategoriesSchema);
  }

  async getMapingByCategory(categoryCode, subCategoryCode, companyId) {
    try {
      return await this.mapModel.findOne({categoryCode: categoryCode, subCategoryCode: subCategoryCode, companyId: ObjectId(companyId)});
    } catch (error) {
      throw error;
    }
  }


  async getMapingByCompany(companyId) {
    try {
      return await this.mapModel.find({companyId: ObjectId(companyId)});
    } catch (error) {
      throw error;
    }
  }

  async getMappingById(id, companyId) {
    try {
      return await this.mapModel.find({_id: ObjectId(id), companyId});
    } catch (error) {
      throw error;
    }
  }

  async updateItem(id, data) {
    return this.mapModel.findByIdAndUpdate(id, { $set: data }, { new: false });
  }

  async delete(id) {
    return await this.mapModel.findByIdAndDelete(id);
  }

  async createItem(item) {
    return await new this.mapModel(item).save();
  }


}

module.exports = mapSubcategoriesDataCategoriesRepository;