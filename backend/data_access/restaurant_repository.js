const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const restaurantSchema = new Schema({
  id: Schema.ObjectId,
  orderBy:{type:Number,required:false},
  name: { type: String, min: 2, max: 100, required: true },
  address: [
    {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, min: 2, max: 150, required: true },
      longitude: {type: String, required: true},
      latitude: {type: String, required: true}
    }
  ],
  phone: { type: String, max: 30, required: true },
  description: { type: String, required: true },
  url: { type: String, required: false },
  imageURL: { type: String },
  coverURL: { type: String, required: false },
  currency: { type: String, required: true },
  accountId: Schema.ObjectId,
  deliveryTime: { type: String, required: true },
  availability: [{
      openHour: { type: Number, required: true },
      openMinutes: { type: Number, required: true },
      closeHour: { type: Number, required: true },
      closeMinutes: { type: Number, required: true },
      isOpen: {type: Boolean, required: true}
  }],
  isActive: { type: Boolean, required: true, default: true },
  minimumValueOrder: { type: Number, required: true, default: 0 }
},
{
  versionKey: false, timestamps: true
});

class RestauranRepository {

  constructor() {
    this.companyModel = Mongoose.model('Restaurants', restaurantSchema);
  }

  async createRestaurant(companyData) {
    try {
      let companyObject = {
        orderBy: companyData.orderBy,
        name: companyData.name,
        address: companyData.address,
        phone: companyData.phone,
        description: companyData.description,
        imageURL: companyData.logo,
        coverURL: companyData.cover,
        url: companyData.url,
        currency: companyData.currency,
        accountId: companyData.accountId,
        isActive: true,
        deliveryTime: companyData.deliveryTime,
        availability: companyData.availability,
        minimumValueOrder: companyData.minimumValueOrder
      }

      return (await new this.companyModel(companyObject).save())._id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async update(id, companyData) {
    try {
      return this.companyModel.findByIdAndUpdate(id, { $set: companyData }, { new: false });
    } catch (error) {
      throw error;
    }
  }

async addCurrency(id, curr) {
  try {
    return this.companyModel.findByIdAndUpdate(id, { $set: { currencyType: curr}}, { new: false });
  } catch (error) {
    throw error;
  }
}


  async changeRestaurantStatus(id, status) {
    try {

      return await this.companyModel.findByIdAndUpdate(id,
        { isActive: status },
        { new: false }
      )
    } catch (error) {
      throw error;
    }
  }


  async deleteRestaurant(id) {
    try {
      return await this.companyModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async getRestaurantById(id) {
    try {
      let data = await this.companyModel.aggregate([
        { $match: { _id: ObjectId(id) } },
        {
          $lookup: {
            from: "accounts",
            localField: "accountId",
            foreignField: "_id",
            as: "account"
          }
        },
        { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } }
      ]);
      return data.pop();
    } catch (error) {
      throw error;
    }
  }


  async findRestaurantByName(name) {
    try {
      return await this.companyModel.findOne({ company: name });
    }
    catch (err) {
      throw err;
    }
  }

  async findRestaurantByAccountId(id) {
    try {
      return await this.companyModel.findOne({ accountId: id });
    }
    catch (err) {
      throw err;
    }
  }

  async listAllPaginate(page, itemsPerPage, name, status, country, city) {
    try {
      let findData = {};
      if (name != null) {
        if (status != undefined) {
          findData = {
            "name": { $regex: name, $options: "i" },
            "isActive": status
          };
        } else {
          findData = {
            "name": { $regex: name, $options: "i" },
          };
        }
      }
      else {
        if (status != null) {
          findData = {
            "isActive": status
          };
        }
      }

      if(country) findData["address.country"] = country;
      if(city) findData["address.city"] = city;

      let companies = await this.companyModel.find(findData).sort({ orderBy: 1 }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({orderBy:1, isRecommended: 1});
      let total = await this.companyModel.countDocuments(findData);

      return {
        "restaurants": companies,
        "total": total,
        "skip": page - 1,
        "pages": total > 0 ? Math.ceil(total / itemsPerPage) : 0,
        "itemsPerPage": itemsPerPage
      }
    }
    catch (err) {
      throw err;
    }
  }

  async listAllExport(page, itemsPerPage, name, status, country, city) {
    try {
      let findData = {};
      if (name != null) {
        if (status != undefined) {
          findData = {
            "name": { $regex: name, $options: "i" },
            "isActive": status
          };
        } else {
          findData = {
            "company": { $regex: name, $options: "i" },
          };
        }
      }
      else {
        if (status != null) {
          findData = {
            "isActive": status
          };
        }
      }

      if(country) findData["address.country"] = country;
      if(city) findData["address.city"] = city;

      let companies = await this.companyModel.find(findData).sort({'createdAt':-1, isRecommended: 1});
      let total = await this.companyModel.countDocuments(findData);

      return {
        "restaurants": companies,
        "total": total,
        "skip": page - 1,
        "pages": total > 0 ? Math.ceil(total / itemsPerPage) : 0,
        "itemsPerPage": itemsPerPage
      }
    }
    catch (err) {
      throw err;
    }
  }

  async countTotalRestaurant(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments(findData);
  }

  async countActiveRestaurant(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments({ isActive: true , ...findData});
  }

  async countInactiveRestaurant(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments({ isActive: false, ...findData });
  }

  async getAllRestaurant(country, city) {
    let findData = {isActive: true};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.find(findData);
  }
}

module.exports = RestauranRepository;