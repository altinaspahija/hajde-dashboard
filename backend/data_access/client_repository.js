const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const bcrypt = require("bcrypt");
const Order = require("../data_access/order_repository");

const clientSchema = new Schema(
  {
    id: Schema.ObjectId,
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    fullName: { type: String, required: false },
    phone: { type: String, required: true },
    password: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
    virtual: { type: Boolean, required: false, default: false },
    addresses: [
      {
        id: { type: Schema.ObjectId, required: false },
        addressId: { type: String, required: false },
        street: { type: String, min: 2, required: false },
        city: { type: String, min: 2, required: false },
        country: { type: String, required: false },
        coordinates: {
          longitude: { type: String, required: false },
          latitude: { type: String, required: false },
        },
        isDefault: { type: Boolean, required: false, default: false },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

clientSchema.options.toJSON = {
  transform: (ret) => {
    delete ret.password;
  },
};

clientSchema.pre("save", async function (next) {
  try {
    const client = this;
    const SALT_ROTATIONS = 10;

    if (!client.password) {
      return next();
    }

    const salt = await bcrypt.genSalt(SALT_ROTATIONS);
    const haShqipëria = await bcrypt.haShqipëria(client.password, salt);
    client.password = haShqipëria;
  } catch (err) {
    throw err;
  }
});

class CourierRepository {
  constructor() {
    this.clientModel = Mongoose.model("Clients", clientSchema);
  }

  async getClientByPhone(phone) {
    try {
      return await this.clientModel.findOne({ phone: phone });
    } catch (error) {
      throw error;
    }
  }

  async getClientById(id) {
    try {
      return await this.clientModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findUserByPhone(phone) {
    try {
      return await this.clientModel.findOne({ phone: phone });
    } catch (error) {
      throw error;
    }
  }

  async changeClientStatus(id, status) {
    try {
      return await this.clientModel.findByIdAndUpdate(
        id,
        { isActive: status },
        { new: false }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      return await this.clientModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async listAllPaginate(
    page,
    itemsPerPage,
    name,
    status,
    phone,
    country,
    city
  ) {
    try {
      let findData = {};

      if (name) findData["fullName"] = { $regex: name, $options: "i" };
      if (status) findData["isActive"] = status;
      if (phone) findData["phone"] = { $regex: phone, $options: "i" };

      if (country) findData["addresses.country"] = country;
      if (city) findData["addresses.city"] = city;

      findData["isVerified"] = true;

      let couriers = await this.clientModel
        .find(findData)
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({ createdAt: -1 });
      let total = await this.clientModel.countDocuments(findData);

      return {
        clients: couriers,
        total: total,
        skip: page - 1,
        pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
        itemsPerPage: itemsPerPage,
      };
    } catch (err) {
      throw err;
    }
  }

  async listAllExport(page, itemsPerPage, name, status, phone, country, city) {
    try {
      let findData = {};
      if (name) findData["fullName"] = { $regex: name, $options: "i" };
      if (status) findData["isActive"] = status;
      if (phone) findData["phone"] = { $regex: phone, $options: "i" };

      if (country) findData["addresses.country"] = country;
      if (city) findData["addresses.city"] = city;

      let couriers = await this.clientModel
        .find(findData)
        .sort({ createdAt: -1 });
      let total = await this.clientModel.countDocuments(findData);

      return {
        clients: couriers,
        total: total,
        skip: page - 1,
        pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
        itemsPerPage: itemsPerPage,
      };
    } catch (err) {
      throw err;
    }
  }

  async countTotalClient(country, city) {
    let findData = {};

    if (country) findData["addresses.country"] = country;
    if (city) findData["addresses.city"] = city;

    return await this.clientModel.countDocuments(findData);
  }

  async countActiveClient(country, city) {
    let findData = {};

    if (country) findData["addresses.country"] = country;
    if (city) findData["addresses.city"] = city;

    return await this.clientModel.countDocuments({
      isActive: true,
      ...findData,
    });
  }

  async countInactiveClient(country, city) {
    let findData = {};

    if (country) findData["addresses.country"] = country;
    if (city) findData["addresses.city"] = city;

    return await this.clientModel.countDocuments({
      isActive: false,
      ...findData,
    });
  }

  async getAll(country, city) {
    let findData = {};

    if (country) findData["addresses.country"] = country;
    if (city) findData["addresses.city"] = city;

    return await this.clientModel.find({ isActive: true, ...findData });
  }

  async getClientsByRestaurant(restaurantId, country, city) {
    let findData = {};

    const orderRepo = new Order();
    const restaurantOrders = await orderRepo.getOrdersOfCompany(restaurantId);

    const clientIDs = restaurantOrders.map((obj) => {
      return obj.receiver.receiverId;
    });

    if (country) findData["addresses.country"] = country;
    if (city) findData["addresses.city"] = city;

    return await this.clientModel.find({
      isActive: true,
      ...findData,
      _id: { $in: clientIDs },
    });
  }

  async create(data) {
    try {
      return await this.clientModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getTokensByPhone(phone) {
    return this.clientModel.aggregate([
      {
        $match: {
          phone: phone,
        },
      },
      {
        $project: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $lookup: {
          from: "fcm-tokens",
          localField: "id",
          foreignField: "userId",
          as: "tokens",
        },
      },
      {
        $unwind: {
          path: "$tokens",
          includeArrayIndex: "tId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "tokens.isEnabled": true,
        },
      },
      {
        $project: {
          fcmToken: "$tokens.fcmToken",
        },
      },
    ]);
  }
}

module.exports = CourierRepository;
