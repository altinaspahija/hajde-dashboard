const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const importerSchema = new Schema({
  sheetUrl: { type: String, required: true },
  companyId: { type: ObjectId, required: true, unique: true }
}, { versionKey: false, timestamps: true });

class ImporterRepository {
  constructor () {
    this.importerModel = Mongoose.model('Importers', importerSchema);
  }

  async saveImporter (data) {
    return await this.importerModel.findOneAndUpdate({ companyId: data.companyId }, { $set: data }, { new: false, upsert: true });
  }

  async getImporter (companyId) {
    return await this.importerModel.findOne({ companyId: companyId });
  }
}

module.exports = ImporterRepository;
