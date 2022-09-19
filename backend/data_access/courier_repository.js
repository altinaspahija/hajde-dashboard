const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const bcrypt = require("bcrypt");
const core = require("file-type/core");

const courierSchema = new Schema({
  id: Schema.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  isOnline: {type: Boolean, required: true, default: true},
  courierId: {type: String, required: true}
}, {
  versionKey: false, timestamps: true
});

courierSchema.options.toJSON = {
  transform: ret => {
    delete ret.password;
  }
};

courierSchema.pre("save", async function (next) {
  try {
    const courier = this;
    const SALT_ROTATIONS = 10;

    if (!courier.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_ROTATIONS);
    const hash = await bcrypt.hash(courier.password, salt);
    courier.password = hash;

  } catch (err) {
    throw err;
  }
})

class CourierRepository {
  constructor() {
    this.courierModel = Mongoose.model("Couriers", courierSchema);
  }

  async createCourier(courier) {
    try {
      let accountObj = {
        courierId:1000000+(100000 + Math.random() * 900000),
        firstName: courier.firstName,
        lastName: courier.lastName,
        fullName: `${courier.firstName} ${courier.lastName}`,
        phone: courier.phone,
        password: courier.password,
        isActive: true
      }

      return (await new this.courierModel(accountObj).save())._id;
    } catch (error) {
      throw error;
    }
  }


  async updateCourier(id, courier) {
    try {
      let accountObj = {
        firstName: courier.firstName,
        lastName: courier.lastName,
        fullName: `${courier.firstName} ${courier.lastName}`,
        phone: courier.phone,
      }

      return await this.courierModel.findByIdAndUpdate(id, accountObj);
    } catch (error) {
      throw error;
    }
  }

  async getCourierByPhone(phone) {
    try {
      return await this.courierModel.findOne({ "phone": phone });
    } catch (error) {
      throw error;
    }
  }

  async getCourierById(id) {
    try {
      return await this.courierModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async changeCourierStatus(id, status) {
    try {
      return await this.courierModel.findByIdAndUpdate(id, { isActive: status }, { new: false });
    } catch (error) {
      throw error;
    }
  }


  async deleteCourier(id) {
    try {
      return await this.courierModel.findByIdAndDelete(id)
    } catch (error) {
      throw error;
    }
  }


  async listAllPaginate(page, itemsPerPage, name, status, phone, country) {
    try {
      let findData = {};

      if(name) findData['fullName'] = { $regex: name, $options: "i" };
      if(status) findData['isActive'] = status
      if(phone) findData['phone'] = { $regex: phone, $options: "i" }

      if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
      if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
      
      let couriers = await this.courierModel.find(findData).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({'createdAt':-1});
      let total = await this.courierModel.countDocuments(findData);

      return {
        "couriers": couriers,
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

  async listAllExport(page, itemsPerPage, name, status, phone, country) {
    try {
      let findData = {};

      if(name) findData['fullName'] = { $regex: name, $options: "i" };
      if(status) findData['isActive'] = status
      if(phone) findData['phone'] = { $regex: phone, $options: "i" }
      if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
      if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
      let couriers = await this.courierModel.find(findData).sort({'createdAt':-1});
      let total = await this.courierModel.countDocuments(findData);

      return {
        "couriers": couriers,
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

  async courierTotalCount (country = "") {
    let findData = {};
    if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
    if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
    return await this.courierModel.countDocuments(findData);
  }

  async courierInactiveCount (country = "") {
    let findData = {isActive: false};
    if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
    if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
    return await this.courierModel.countDocuments(findData);
  }

  async courierActiveCount (country = "") {
    let findData = {isActive: true};
    if(country && country == "Kosovë") findData['phone'] ={$regex:"\\+383"}
    if(country && country == "Shqiperië") findData['phone'] ={$regex:"\\+355"}
    return await this.courierModel.countDocuments(findData);
  }
}

module.exports = CourierRepository;