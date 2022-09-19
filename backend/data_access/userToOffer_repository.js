const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const userToOfferSchema = new Schema({
  userId: { type: Schema.ObjectId, required: true },
  offerId:  { type: Schema.ObjectId, required: true },
  orderId:  { type: Schema.ObjectId, required: true },
  totalBeforeDiscount: { type: Number, required: false },
  totalAfterDiscount: { type: Number, required: false },
  discount: { type: Number, required: false },
  productId: { type: Schema.ObjectId, required: false }
},
{
  versionKey: false, timestamps: false
})


class UserToOffer {
   constructor() {
     this.userToOfferModel = Mongoose.model('UserToOffer', userToOfferSchema);
   }

   async createUserToOffer(off) {
     return await this.userToOfferModel(off).save();
   }
   
   async updateUserToOffer(id, off) {
     return await this.userToOfferModel.findByIdAndUpdate(id, {$set: off});
   }
}


module.exports = UserToOffer;

