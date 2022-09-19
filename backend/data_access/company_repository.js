const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const companySchema = new Schema({
  id: Schema.ObjectId,
  orderBy:{ type: Number, required: false},
  company: { type: String, min: 2, max: 100, required: true },
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
  isActive: { type: Boolean, required: true, default: true },
  deliveryTime: { type: String, required: true },
  availability: [{
    openHour: { type: Number },
    openMinutes: { type: Number },
    closeHour: { type: Number },
    closeMinutes: { type: Number },
    isOpen: {type: Boolean }
  }],
  fastDelivery: { type: Boolean, required: true, default: false },
  minimumValueOrder: { type: Number, required: true, default: 0 }
},
{
  versionKey: false, timestamps: true
});

class CompanyRepository {

  constructor() {
    this.companyModel = Mongoose.model('Companies', companySchema);
  }

  async createCompany(companyData) {
    try {
      let companyObject = {
        orderBy: companyData.orderBy,
        company: companyData.company,
        address: companyData.address,
        phone: companyData.phone,
        description: companyData.description,
        imageURL: companyData.logo || "",
        coverURL: companyData.cover || "",
        url: companyData.url,
        currency: companyData.currency,
        accountId: companyData.accountId,
        isActive: true,
        deliveryTime: companyData.deliveryTime,
        availability: companyData.availability ? companyData.availability : [],
        fast: companyData.fast || false,
        fastDelivery: companyData.fastDelivery || false,
        minimumValueOrder: companyData.minimumValueOrder || 0
      }

      return (await new this.companyModel(companyObject).save())._id;
    } catch (error) {
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


  async changeCompanyStatus(id, status) {
    try {

      return await this.companyModel.findByIdAndUpdate(id,
        { isActive: status },
        { new: false }
      )
    } catch (error) {
      throw error;
    }
  }


  async deleteCompany(id) {
    try {
      return await this.companyModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(id) {
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


  async findCompanyByName(name) {
    try {
      return await this.companyModel.findOne({ company: name });
    }
    catch (err) {
      throw err;
    }
  }

  async findCompanyByAccountId(id) {
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
            "company": { $regex: name, $options: "i" },
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

      let companies = await this.companyModel.find(findData).sort({ orderBy: 1 }).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({orderBy:1, isRecommended: 1});
      let total = await this.companyModel.countDocuments(findData);

      return {
        "companies": companies,
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
            "company": { $regex: name, $options: "i" },
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

      let companies = await this.companyModel.find(findData).sort({'createdAt':-1});
      let total = await this.companyModel.countDocuments(findData);

      return {
        "companies": companies,
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

  async countTotalCompany(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments(findData);
  }

  async countActiveCompany(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments({ isActive: true, ...findData });
  }

  async countInactiveCompany(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.countDocuments({ isActive: false, ...findData });
  }

  async getAllCompanies(country, city) {
    let findData = {};
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.companyModel.find({isActive: true, ...findData});
  }
}

module.exports = CompanyRepository;