const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;


const fcmTokenSchema = new Schema({
  id: Schema.ObjectId,
  fcmToken: { type: String, required: true },
  userId: { type: Schema.ObjectId, required: true },
  deviceId: { type: String, required: true },
  isEnabled: { type: Boolean, required: true }
},
{
    versionKey: false,
    timestamps: false
});


class FcmTokenRepository {
   
  constructor() {
     this.fcmTokenModel =  Mongoose.model('fcm-token', fcmTokenSchema)
  }


  async getTokens(isEnabled) {
    return await this.fcmTokenModel.find({isEnabled:isEnabled});
  }

}

module.exports = FcmTokenRepository;