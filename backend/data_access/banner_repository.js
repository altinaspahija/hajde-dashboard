const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const bannerSchema = new Schema({
    id: Schema.ObjectId,
    imageURL: {type: String, required: true},
    companyId: {type: Schema.ObjectId},
    isActive: {type: Boolean, default: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    type: {type: Number, required: true},
    title: {type: String, required: true}
},
{
    versionKey: false, timestamps: true
});

  

class Banner {
    constructor() {
        this.bannerModel = Mongoose.model('Banner', bannerSchema);
    }

    async createBanner(obj) {
       return await new this.bannerModel(obj).save();
    }

    async update(id, obj) {
      return await this.bannerModel.findByIdAndUpdate(id, {$set:obj}, {new: false})
    }

   async delete(id) {
     return await this.bannerModel.findByIdAndDelete(id);
   }
   
   async getById(id) {
    return await this.bannerModel.findById(id);
  }

   async changeStatus(id, status) {
    return await this.bannerModel.findByIdAndUpdate(id, {$set:{isActive: status}}, {new: false});
  }
   async listAll(page, itemsPerPage, status, country) {
    const findData = {}
    if (status) findData.isActive  = status;
    if (country) findData.country =country

    const products = await this.bannerModel.find(findData).sort({ createdAt: -1 }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({'createdAt':-1});
    const total = await this.bannerModel.countDocuments(findData);

    return {
      banners: products,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
   }
}

module.exports = Banner;