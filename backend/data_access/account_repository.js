const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;

const accountSchema = new Schema({
  _id: Schema.ObjectId,
  firstName: { type: String, min: 2, max: 30, required: true },
  lastName: { type: String, min: 2, max: 30, required: true },
  email: { type: String, max: 120, required: true },
  password: { type: String, max: 128, required: true },
  role: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  country: { type: String },
  city: { type: String },
  verified: { type: Boolean },
  otp: { type: String }
},
  {
    versionKey: false, timestamps: true
  });

accountSchema.options.toJSON = {
  transform: ret => {
    delete ret.password;
  }
};

accountSchema.pre("save", async function (next) {
  try {
    const user = this;
    const SALT_ROTATIONS = 10;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_ROTATIONS);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

  } catch (err) {
    throw err;
  }
});


class AccountRepository {

  constructor() {
    this.accountModel = Mongoose.model("Accounts", accountSchema);
  }

  async createAccount(account) {
    try {
      let accountObj = {
        _id: new ObjectId(),
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password: account.password,
        role: account.role,
        isActive: true
      };

      if (account.country) {
        accountObj["country"] = account.country;
      }

      return (await new this.accountModel(accountObj).save())._id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAccountByEmail(email) {
    try {
      return await this.accountModel.findOne({ "email": email })
    } catch (error) {
      throw error;
    }
  }

  async getAccountById(id) {
    try {
      return await this.accountModel.findById(id)
    } catch (error) {
      throw error;
    }
  }

  async changeAccountStatus(id, status) {
    try {
      return await this.accountModel.findByIdAndUpdate(id,
        { isActive: status },
        { new: false }
      )
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(id) {
    try {
      return await this.accountModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(id, password) {
    try {
      const SALT_ROTATIONS = 10;

      const salt = await bcrypt.genSalt(SALT_ROTATIONS);
      const hash = await bcrypt.hash(password, salt);

      return await this.accountModel.findByIdAndUpdate(id, { password: hash }, { new: false });
    }
    catch (err) {
      throw err;
    }
  }

  async updateInfo(id, data) {
    try {
      return await this.accountModel.findByIdAndUpdate(id,
        { firstName: data.firstName, lastName: data.lastName },
        { new: false }
      );
    }
    catch (err) {
      throw err;
    }
  }

  async updateCompanyInfo(id, data) {
    try {
      return await this.accountModel.findByIdAndUpdate(id,
        { firstName: data.firstName, lastName: data.lastName, email:data.email },
        { new: false }
      );
    }
    catch (err) {
      throw err;
    }
  }

  async updateOtp(email, token) {
    try {
      return await this.accountModel.findOneAndUpdate({
        email: email
      },
      { otp: token }
      );
    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = AccountRepository;