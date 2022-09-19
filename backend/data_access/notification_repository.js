const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;


const notificationSchema = new Schema({
  id: Schema.ObjectId,
  type: { type: String, required: true },
  target: { type: String, required: true },
  message: { type: String, required: true },
  metaData: {type: Object, required: false},
  isSeen: { type: Boolean, required: true},
  date: { type: Date, required: true }
},
{
  versionKey: false, timestamps: false
});


class NotificationRepository {
   
  constructor() {
     this.notifiationModel =  Mongoose.model('notification', notificationSchema)
  }


  async storeNotification(data) {
    try
    {
      return await this.notifiationModel.create(data);
    }
    catch(err) {
      throw err;
    }
  }

  async getAdminNotification(){
    try {
      return await this.notifiationModel.find({target: 'dashboard-admin'}).sort([['date', 'descending']]);
    } catch(error) {
      throw error;
    }
  }

  async getNotificationById(id) {
    try {
      return await this.notifiationModel.findById(id);
    } catch(error) {
      throw error;
    }
  }

  async setSeenNotification(id) {
    try {
      return await this.notifiationModel.findByIdAndUpdate(id, {$set:{isSeen: true}}, {new: false})
    } catch (error) {
     
      throw error;
    }
  }

  async getCountSeenNotification() {
    try {
      return await this.notifiationModel.count({target: 'dashboard-admin'})
    } catch(error) {
      throw error;
    }
  }

}

module.exports = NotificationRepository;