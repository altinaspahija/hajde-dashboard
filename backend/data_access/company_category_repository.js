const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const compCategoriesSchema = new Schema({
    id: Schema.ObjectId,
    categoryId: { type: Schema.ObjectId, required: true },
    companyId: { type: Schema.ObjectId, required: true },
    isActive: { type: Boolean, required: true }
},
{
    versionKey: false, timestamps: false
});



class CompanyCategoryRepository {

  constructor() {
    this.companyCategoryModel = Mongoose.model('company-categories', compCategoriesSchema)
  }

  async changeStatus(id, status) {
    return await this,this.companyCategoryModel.findByIdAndUpdate(
      id, 
      { isActive: status },
      {new: false})
  }

  async getCategories(companyId, page, itemsPerPage, name, isActive ) {
    const query = {};

    if(name) {
      query['category.name'] = { $regex: name, $options: "i" };
    }
    
    if(isActive) {
      query.isActive = isActive == 'true';
    }

    const result = await this.companyCategoryModel.aggregate([
      {$match:{companyId: ObjectId(companyId)}},
      {$lookup: {
        from: 'product-categories',
        localField: 'categoryId',
        foreignField:'_id',
        as: 'category'
     }},
     {$unwind: '$category'},
     {$match:query},
     {$skip:(parseInt(page)-1)*(parseInt(itemsPerPage))},
     {$limit:parseInt(itemsPerPage)}
    ]);

    const total = await this.companyCategoryModel.aggregate([
      {$match:{companyId: ObjectId(companyId)}},
      {$lookup: {
        from: 'product-categories',
        localField: 'categoryId',
        foreignField:'_id',
        as: 'category'
     }},
     {$unwind: '$category'},
     {$match:query},
     { $group: { _id: null, count: { $sum: 1 } } } 
  ]);



    return {
        categories:result,
        skip:page-1,
        pages: total.length > 0 ?  Math.ceil( total[0].count / itemsPerPage) : 1,
        itemsPerPage:itemsPerPage
    }
  }

  async getAllCategoriesOfCompany(companyId) {
    const result = await this.companyCategoryModel.aggregate([
      {$match:{companyId: ObjectId(companyId), isActive: true}},
      {$lookup: {
        from: 'product-categories',
        localField: 'categoryId',
        foreignField:'_id',
        as: 'category'
     }},
     {$unwind: '$category'},
     {
       $project: {
        "_id": "$category._id",
        "name": "$category.name",
        "imageURL": "$category.imageURL",
        "isActive": "$category.isActive",
        "orderNo": "$category.orderNo",
        "type": "$category.type",
        "country": "$category.country",
       }
     }
    ]);

    return {
        categories:result,
    }
  }

  async addTheCategories(categories) {
   await this.companyCategoryModel.insertMany(categories)
  }

  async createOne(companyId, categoryId) {
      return await this.companyCategoryModel({
          companyId,
          categoryId,
          isActive: true
      }).save();
  }

  async findByCompanyId(companyId) {
      return await this.companyCategoryModel.find({companyId});
  }

  async updateCompanyCategory(companyId, categoryId) {
      return await this.companyCategoryModel.updateOne({companyId}, {$set: {categoryId}});
  }

}

module.exports = CompanyCategoryRepository;