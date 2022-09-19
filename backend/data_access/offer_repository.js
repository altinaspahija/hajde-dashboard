const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;


const offerSchema = new Schema({
  offerType: {type: String, required: true},
  offerProvider: {type: String, required: true},
  companyIds: [
    {
      _id: {
        type: Schema.ObjectId,
        ref:"Company"
      },
      name: {
        type: String
      },
      type: {
        type: String
      }
    }
  ],
  allProviders: {type: Boolean, default: false},
  productOffer: {
    _id: {
      type: Schema.ObjectId,
      ref:"Products"
    },
    name: {
      type: String
    },
    minValue: {type: Number},
  },
  products: [String],
  amountOffer: {
    discountAmount: {type: Number},
    minValue: {type: Number},
    maxDiscount: {type: Number}
  },
  description: {type: String},
  targetGroup: {type: String},
  userId: {type: Schema.ObjectId},
  hasPeriod: {type: Boolean, default: false},
  startDate: {type: Date},
  endDate: {type: Date},
  dateCreated: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: true},
  country: {type: String},
  freeDelivery: { type: Boolean, default: false}
}, {versionKey: false});

class OfferRepository {

  constructor() {
    this.offerModel = Mongoose.model('Offers',offerSchema);
  }

  async getOfferByCompanyId(id) {
    return await this.offerModel.find({companyId: ObjectId(id), targetGroup: {$ne:'SingleUser'}});
  }

  async getOfferByUserId(id) {
    return await this.offerModel.find({userId: ObjectId(id)});
  }

  async getHajdeOffers() {
    return await this.offerModel.find({offerProvider: 'hajde', targetGroup: {$ne:'SingleUser'}});
  }

  async getOfferById(id) {
    return await this.offerModel.findById(id);
  }

  async deleteById(id) {
    return await this.offerModel.findByIdAndDelete(id);
  }

  async createOffer(offer) {
    let result = await this.offerModel(offer).save();
    return result
  }

  async updateOffer(id, offer) {
    return await this.offerModel.findByIdAndUpdate(id, {$set:offer}, {new: false});
  }

  async changeStatus(id, status) {
    return await this.offerModel.findByIdAndUpdate(id, {$set:{isActive: status}}, {new: false});
  }

  async listAllPaginate (page, itemsPerPage, offerType, status, fromDate, toDate,  country) {
    let findData = {};
    if (offerType) findData.offerType = { $regex: offerType, $options: 'i' };
    if (status) findData.isActive = status;
  

    if(country) findData['country'] = country
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };

    const offers = await this.offerModel.aggregate(
      [
        {
          '$lookup': {
            'from': 'companies', 
            'localField': 'companyId', 
            'foreignField': '_id', 
            'as': 'company'
          }
        }, 
        {
          '$unwind': {
            'path': '$company', 
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$lookup': {
            'from': 'restaurants', 
            'localField': 'companyId', 
            'foreignField': '_id', 
            'as': 'restaurant'
          }
        }, 
        {
          '$unwind': {
            'path': '$restaurant', 
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$lookup': {
            'from': 'clients', 
            'localField': 'userId', 
            'foreignField': '_id', 
            'as': 'client'
          }
        }, 
        {
          '$unwind': {
            'path': '$client', 
            'preserveNullAndEmptyArrays': true
          }
        },
        {$match:findData},
        {$skip:(parseInt(page)-1)*(parseInt(itemsPerPage))}
      ]
    );
    
    const total = await this.offerModel.countDocuments(findData);

    return {
      offers: offers,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }
  
}

module.exports = OfferRepository;