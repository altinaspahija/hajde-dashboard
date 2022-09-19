const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const categoriesSchema = new Schema({
    parentId: { type: Schema.ObjectId, default: null, required: false },
    name: { type: String, min: 2, required: true },
    imageURL: { type: String, required: false },
    type: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    code: { type: String, required: true}
}, {
  versionKey: false, timestamps: true
});


class ProductCategoryRepository {

  constructor() {
    this.categoriesModel = Mongoose.model('categories', categoriesSchema);
  }

  async getCategoriesById(id) {
    try {
        return await this.categoriesModel.findById(id);
    } catch (err) {
        throw (err);
    }
}

    async getAllCategories(page, itemsPerPage, status) {
        try {
            if(page) {
                const findData = {};
                if(status) findData.isActive = status;
                const categories = await this.categoriesModel.find(findData).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({'createdAt':-1});
                const total = await this.categoriesModel.countDocuments(findData);
                return {
                    categories: categories,
                    total: total,
                    skip: page - 1,
                    pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
                    itemsPerPage: itemsPerPage
                  };
            } else {
                const categories = await this.categoriesModel.find({});
                return { categories: categories };
            }
        } catch (err) {
            throw (err);
        }
    }

    async updateCategories(id, data) {
        try {
            return await this.categoriesModel.updateOne({ _id: ObjectId(id) }, {
                $set: {
                    name: data.name,
                    imageURL: data.imageURL,
                    parentId: data.parentId,
                    type: data.type,
                    isActive: data.isActive,
                    code: data.code,
                }
            });
        } catch (err) {
            throw (err);
        }
    }

    async updateCategoryStatus(id, status) {
        try {
            return await this.categoriesModel.updateOne({ _id: Object(id)}, { $set: { isActive: status.status}})
        } catch (error) {
            throw (err);
        }
    }

    async createCategories(data) {
        try {
            let categoriesObj = {
                name: data.name,
                imageURL: data.imageURL,
                parentId: data.parentId,
                type: data.type,
                isActive: data.isActive,
                code: data.code,
            }

            return await this.categoriesModel.create(categoriesObj);
            
        } catch (err) {
            throw err
        }
    }

    async deleteCategoriesById(id) {
        try {
            return await this.categoriesModel.deleteOne({ _id: ObjectId(id) });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ProductCategoryRepository;