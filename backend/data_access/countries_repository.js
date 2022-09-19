const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const countrySchema = new Schema({
  _id: Schema.ObjectId,
  name: { type: String, required: true },
  abbv: { type: String, required: true },
  prefix: { type: String, required: true },
  capital: {
    name: { type: String, required: true },
    alternativeName: { type: String, required: false },
  },
  cities: [
    {
      name: { type: String, required: true },
      alternativeName: { type: String, required: false },
    },
  ],
  currency: { type: String, required: true },
  transportPrice: { type: Number, required: true },
});

class Countries {
  constructor() {
    this.countriesModel = Mongoose.model("countries", countrySchema);
  }

  async getAllCountries() {
      return this.countriesModel.find();
  }
}

module.exports = Countries;
