const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const ObjectId = Mongoose.Types.ObjectId;

const orderSchema = new Schema({
  id: Schema.ObjectId,
  orderNumber: { type: String, max: 7, required: true },
  offerId: [{ type: Schema.ObjectId, required: false}],
  discount: {type: Number, required: false},
  transport: {type: Number, required: false},
  receiver: {
    firstName: { type: String, max: 60, required: false },
    lastName: { type: String, max: 60, required: false },
    receiverId: { type: Schema.ObjectId, required: false },
    phone: { type: String, required: false }
  },
  address: {
    country: { type: String, required: false },
    city: { type: String, required: false },
    street: { type: String, min: 2, max: 150, required: false },
    longitude: { type: Number, required: false },
    latitude: { type: Number, required: false }
  },
  total: { type: Number, required: false },
  products: [{
    productId: { type: Schema.ObjectId, required: false },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    offerFreeProduct: { type: Boolean, required: false }
  }],
  typedProducts: [{
    _id: {type: Schema.ObjectId, required: false},
    name: {type: String, required: false},
    quantity: {type: Number, required: false}
  }],
  courier: {
    name: { type: String, required: false },
    courierId: { type: Schema.ObjectId, required: false },
    phone: { type: String, required: false }
  },
  supplier: {
    name: { type: String, required: true },
    supplierId: { type: Schema.ObjectId, required: true }
  },
  orderDate: { type: Date, required: true, default: Date.now },
  lastUpdate: { type: Date, required: true, default: Date.now },
  estimatedArrival: { type: Date, required: false },
  status: { type: String, required: true },
  issue: { type: String, required: false },
  currency: { type: String, required: true },
  clientComment: { type: String, required: false },
  courierComment: { type: String, required: false },
  isConfirmed: {type: Boolean, required: false, default: false},
  type:{ type: String, required: true },
  whoOrder: {type: String, required: false}
},
{
  versionKey: false, timestamps: false
});

class OrderRepository {
  constructor () {
    this.orderModel = Mongoose.model('Orders', orderSchema);
  }

  async getOrderById (id) {
    try {
      const typeQuery = await this.orderModel.findById(id);
      const data = await this.orderModel.aggregate([
        { $match: { _id: ObjectId(id) } },
        { $unwind: {path: '$products', preserveNullAndEmptyArrays: true} },
        {
          $lookup: typeQuery.type == "restaurant" ?  {
            from: 'menus',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'product'
          } : {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: { path:'$product', preserveNullAndEmptyArrays: true }},
        {
          $group: {
            _id: {
              _id: '$_id',
              orderNumber: '$orderNumber',
              receiver: '$receiver',
              address: '$address',
              total: '$total',
              courier: '$courier',
              supplier: '$supplier',
              orderDate: '$orderDate',
              lastUpdate: '$lastUpdate',
              discount: '$discount',
              estimatedArrival: '$estimatedArrival',
              currency: '$currency',
              clientComment: '$clientComment',
              courierComment: '$courierComment',
              status: '$status',
              typedProducts: '$typedProducts',
              issue: '$issue',
              isConfirmed: '$isConfirmed',
              type: '$type',
              transport: '$transport'
            },
            products: {
              $push:
                {
                  _id: "$products._id",
                  product_id: '$product._id',
                  productCode: '$product.productCode',
                  name: '$product.name',
                  price: '$products.price',
                  unit: '$product.unit',
                  quantity: '$products.quantity',
                  imageURL: '$product.imageURL',
                  offerFreeProduct: '$products.offerFreeProduct'
                }
            }
          }
        },
        {
          $project: {
            _id: '$_id._id',
            orderNumber: '$_id.orderNumber',
            receiver: '$_id.receiver',
            address: '$_id.address',
            total: '$_id.total',
            courier: '$_id.courier',
            supplier: '$_id.supplier',
            orderDate: '$_id.orderDate',
            lastUpdate: '$_id.lastUpdate',
            estimatedArrival: '$_id.estimatedArrival',
            currency: '$_id.currency',
            clientComment: '$_id.clientComment',
            courierComment: '$_id.courierComment',
            status: '$_id.status',
            issue: '$_id.issue',
            typedProducts: '$_id.typedProducts',
            isConfirmed: '$_id.isConfirmed',
            products: 1,
            discount: '$_id.discount',
            type: '$_id.type',
            transport: '$_id.transport'
          }
        },
        {
          $lookup: typeQuery.type == "restaurant" ? {
            from: 'restaurants',
            localField: 'supplier.supplierId',
            foreignField: '_id',
            as: 'company'
          }
          :
          {
            from: 'companies',
            localField: 'supplier.supplierId',
            foreignField: '_id',
            as: 'company'
          }
        },
        { $unwind: '$company' },
        {
          '$lookup': {
            'from': 'usertooffers',
            'localField': '_id',
            'foreignField': 'orderId',
            'as': 'usrOffers'
          }
        }, {
          '$unwind': {
            'path': '$usrOffers',
            'preserveNullAndEmptyArrays':true
          }
        }, {
          '$lookup': {
            'from': 'offers',
            'localField': 'usrOffers.offerId',
            'foreignField': '_id',
            'as': 'usrOffers.offer'
          }
        }, {
          '$unwind': {
            'path': '$usrOffers.offer',
            'preserveNullAndEmptyArrays':true
          }
        }, {
          '$lookup': {
            'from': 'companies',
            'localField': 'usrOffers.offer.companyId',
            'foreignField': '_id',
            'as': 'usrOffers.offer.company'
          }
        }, {
          '$unwind': {
            'path': '$usrOffers.offer.company',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'restaurants',
            'localField': 'usrOffers.offer.companyId',
            'foreignField': '_id',
            'as': 'usrOffers.offer.restaurant'
          }
        }, {
          '$unwind': {
            'path': '$usrOffers.offer.restaurant',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$group': {
            '_id': {
              '_id': '$_id',
              'orderNumber': '$orderNumber',
              'receiver': '$receiver',
              'address': '$address',
              'total': '$total',
              'courier': '$courier',
              'supplier': '$supplier',
              'orderDate': '$orderDate',
              'lastUpdate': '$lastUpdate',
              'estimatedArrival': '$estimatedArrival',
              'currency': '$currency',
              'clientComment': '$clientComment',
              'courierComment': '$courierComment',
              'status': '$status',
              'typedProducts': '$typedProducts',
              'issue': '$issue',
              'discount': '$discount',
              'isConfirmed': '$isConfirmed',
              'type': '$type',
              'products': '$products',
              'company': '$company',
              'transport': '$transport'
            },
            'offers': {
              '$push': '$usrOffers'
            }
          }
        },
        {
          $project: {
            _id: '$_id._id',
            orderNumber: '$_id.orderNumber',
            receiver: '$_id.receiver',
            address: '$_id.address',
            total: '$_id.total',
            courier: '$_id.courier',
            supplier: '$_id.supplier',
            orderDate: '$_id.orderDate',
            lastUpdate: '$_id.lastUpdate',
            estimatedArrival: '$_id.estimatedArrival',
            currency: '$_id.currency',
            clientComment: '$_id.clientComment',
            courierComment: '$_id.courierComment',
            status: '$_id.status',
            issue: '$_id.issue',
            typedProducts: '$_id.typedProducts',
            isConfirmed: '$_id.isConfirmed',
            products:'$_id.products',
            offers:1,
            type: '$_id.type',
            discount: '$_id.discount',
            company: "$_id.company",
            transport: "$_id.transport"
          }
        },
      ]);
      return data.pop();
    } catch (error) {
      throw error;
    }
  }

  async getOrdersCountOfCompany (companyId) {
    return await this.orderModel.countDocuments({ 'supplier.supplierId': ObjectId(companyId)});
  }

  async getOrdersOfCompany (companyId) {
    return await this.orderModel.find({ 'supplier.supplierId': ObjectId(companyId)});
  }

  async getOrdersCount(country, city) {

    const findData = {}
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.orderModel.count(findData);
  }

  async getOrdersCountOfCourier (companyId) {
    return await this.orderModel.countDocuments({ 'courier.courierId': ObjectId(companyId) });
  }

  async getOrdersCountOfClient (companyId) {
    return await this.orderModel.countDocuments({ 'receiver.receiverId': ObjectId(companyId) });
  }

  async getOrderByOrderNr (nr) {
    return await this.orderModel.findOne({ orderNumber: nr });
  }

  async listAllPaginate (page, itemsPerPage, orderNumber, status, courier, company, fromDate, toDate, clientName, country, city) {
    let findData = {};
    if (orderNumber) findData.orderNumber = { $regex: orderNumber, $options: 'i' };
    if (status) findData.status = status;
    if (courier) findData['courier.name'] = { $regex: courier, $options: 'i' };
    if (company) findData['supplier.name'] = { $regex: company, $options: 'i' };
    if (clientName) {
      findData['$expr']  ={
        "$regexMatch": {
          "input": { "$concat": ["$receiver.firstName", " ", "$receiver.lastName"] },
          "regex": clientName,  
          "options": "i"
        }
      };
    }

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;
   
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };

    const orders = await this.orderModel.find(findData).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({'orderDate':-1});
    const total = await this.orderModel.countDocuments(findData);

    return {
      orders: orders,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

  async listAllExport (page, itemsPerPage, orderNumber, status, courier, company, fromDate, toDate, clientName, country, city) {
    let findData = {};
    if (orderNumber) findData.orderNumber = { $regex: orderNumber, $options: 'i' };
    if (status) findData.status = status;
    if (courier) findData['courier.name'] = { $regex: courier, $options: 'i' };
    if (company) findData['supplier.name'] = { $regex: company, $options: 'i' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    if (clientName) {
      findData['$expr']  ={
        "$regexMatch": {
          "input": { "$concat": ["$receiver.firstName", " ", "$receiver.lastName"] },
          "regex": clientName,  
          "options": "i"
        }
      };
    }

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    const orders = await this.orderModel.find(findData).sort({'orderDate':-1});
    const total = await this.orderModel.countDocuments(findData);

    return {
      orders: orders,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

  async listAllPaginateCompany (companyId, page, itemsPerPage, orderNumber, status, courier, fromDate, toDate, country, city) {
    const findData = {
      'supplier.supplierId': ObjectId(companyId)
    };

    if (orderNumber) findData.orderNumber = { $regex: orderNumber, $options: 'i' };
    if (status) findData.status = status;
    if (courier) findData['courier.phone'] = { $regex: courier, $options: 'i' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    const orders = await this.orderModel.find(findData).skip((page - 1) * itemsPerPage).limit(itemsPerPage).sort({'orderDate':-1});
    const total = await this.orderModel.countDocuments(findData);

    return {
      orders: orders,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }

   async listAllExportCompany (companyId, page, itemsPerPage, orderNumber, status, courier, fromDate, toDate, country, city) {
    const findData = {
      'supplier.supplierId': ObjectId(companyId)
    };

    if (orderNumber) findData.orderNumber = { $regex: orderNumber, $options: 'i' };
    if (status) findData.status = status;
    if (courier) findData['courier.phone'] = { $regex: courier, $options: 'i' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };


    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    const orders = await this.orderModel.find(findData).sort({'orderDate':-1});
    const total = await this.orderModel.countDocuments(findData);

    return {
      orders: orders,
      total: total,
      skip: page - 1,
      pages: total > 0 ? Math.ceil(total / itemsPerPage) : 0,
      itemsPerPage: itemsPerPage
    };
  }


  async getTotalRevenue (fromDate, toDate, country, city) {
    const queries = { status: 'COMPLETED', currency: 'Lekë' };

    if(country) queries["address.country"] = country;
    if(city) queries["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) queries.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.aggregate([
      { $match: queries },
      {
        $group: {
          _id: '',
          totalSum: { $sum: '$total' }
        }
      }
    ]);
  }

  async getTotalRevenueEur (fromDate, toDate, country, city) {
    const queries = { status: 'COMPLETED', currency: 'Euro' };

    if(country) queries["address.country"] = country;
    if(city) queries["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) queries.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.aggregate([
      { $match: queries },
      {
        $group: {
          _id: '',
          totalSum: { $sum: '$total' }
        }
      }
    ]);
  }

  async getCompanyTotalRevenue (companyId = undefined, fromDate = undefined, toDate = undefined) {
    const queries = { status: 'COMPLETED', currency:"Lekë" };
    if ((fromDate && toDate) && (fromDate < toDate)) queries.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    if (companyId) queries['supplier.supplierId'] = ObjectId(companyId);
    return await this.orderModel.aggregate([
      { $match: queries },
      {
        $group: {
          _id: '',
          totalSum: { $sum: '$total' }
        }
      }
    ]);
  }

  async getCourierTotalRevenueEur (courierId = undefined, fromDate = undefined, toDate = undefined) {
    const queries = { status: 'COMPLETED', currency: 'Euro' };
    if ((fromDate && toDate) && (fromDate < toDate)) queries.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    if (courierId) queries['courier.courierId'] = ObjectId(courierId);
    return await this.orderModel.aggregate([
      { $match: queries },
      {
        $group: {
          _id: '',
          totalSum: { $sum: '$total' }
        }
      }
    ]);
  }

  async getCourierTotalRevenue (courierId = undefined, fromDate = undefined, toDate = undefined) {
    const queries = { status: 'COMPLETED', currency:"Lekë" };
    if ((fromDate && toDate) && (fromDate < toDate)) queries.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    if (courierId) queries['courier.courierId'] = ObjectId(courierId);
    return await this.orderModel.aggregate([
      { $match: queries },
      {
        $group: {
          _id: '',
          totalSum: { $sum: '$total' }
        }
      }
    ]);
  }

  async countOrderAllTotal (fromDate, toDate, country, city) {
    const findData = {};
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyTotal (companyId, fromDate, toDate, country, city) {
    const findData = { 'supplier.supplierId': ObjectId(companyId) };

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierTotal (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId) };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllInProgess (fromDate, toDate, country, city) {
    const findData = { status: 'IN_PROGRESS' };

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyInProgess (companyId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(companyId), status: 'IN_PROGRESS' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierInProgess (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId), status: 'IN_PROGRESS' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllCompleted (fromDate, toDate, country, city) {
    const findData = { status: 'COMPLETED' };    

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyCompleted (companyId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(companyId), status: 'COMPLETED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierCompleted (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId), status: 'COMPLETED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllIssue (fromDate, toDate, country, city) {
    const findData = { status: 'ISSUE' };    

    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyIssue (companyId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(companyId), status: 'ISSUE' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierIssue (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId), status: 'ISSUE' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllRejected (fromDate, toDate, country, city) {
    const findData = { status: 'REJECTED' };
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyRejected (companyId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(companyId), status: 'REJECTED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierRejected (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId), status: 'REJECTED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllPending (fromDate, toDate, country, city) {
    const findData = { status: 'PENDING' };
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyPending (companyId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(companyId), status: 'PENDING' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCourierPending (companyId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(companyId), status: 'PENDING' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderAllCancelled (fromDate, toDate, country, city) {
    const findData = { status: 'CANCELLED' };
    
    if(country) findData["address.country"] = country;
    if(city) findData["address.city"] = city;

    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async countOrderCompanyCancelled (courierId, fromDate, toDate) {
    const findData = { 'supplier.supplierId': ObjectId(courierId), status: 'CANCELLED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  
  async countOrderCourierCancelled (courierId, fromDate, toDate) {
    const findData = { 'courier.courierId': ObjectId(courierId), status: 'CANCELLED' };
    if ((fromDate && toDate) && (fromDate < toDate)) findData.orderDate = { $gte: new Date(fromDate), $lt: new Date(toDate) };
    return await this.orderModel.countDocuments(findData);
  }

  async rejectedOrder (id, issue) {
    return await this.orderModel.findByIdAndUpdate(id, {$set: { status: 'ISSUE', issue: issue } }, { new: false });
  }


  async approveOrder (id) {
    return await this.orderModel.findByIdAndUpdate(id, {$set: { isConfirmed: true, status: 'CONFIRM' } }, { new: false });
  }

  async readyOrder(id) {
    return await this.orderModel.findByIdAndUpdate(id, {$set: { status: 'READY' } }, { new: false });
  }

  async findOrdersOfProduct (id, companyId) {
  
    const data = await this.orderModel.aggregate([{$match:{'supplier.supplierId': ObjectId(companyId)}},{ $unwind: '$products' }, { $match: { 'products.productId': ObjectId(id) } }]);
    return data;
  }

  async addProduct (id, data) {
      await this.orderModel.findByIdAndUpdate(id, 
        { 
          $inc: { 
           total: data.increaseValue
          }, 
          $pull: { 
            typedProducts: { 
              _id: data._id 
          }
        },
        $push:{
          products: {
            productId: data.productId,
            price: data.price,
            quantity: data.quantity
          }
        }
      });
  }


  async deleteTypeProduct(id, data) {
    await this.orderModel.findByIdAndUpdate(id, {
      $pull: { 
        typedProducts: { 
          _id: data._id 
        }
      }
    });
  }

  async getSpecificProduct(orderId, productId) {
    return await this.orderModel.aggregate([
      {$match:{_id: ObjectId(orderId)}},
      {$project: {
         products:{
           $filter: {
              input: '$products',
               as:'product',
               cond: {$eq:['$$product._id', ObjectId(productId)]}
          }    
        }
      }}
   ])
  }

  async removeProduct(orderId, data) {
    return await this.orderModel.findByIdAndUpdate(orderId, {
      $pull: { 
        products: { 
          _id: ObjectId(data.productId) 
        }
      },
      $inc: { 
        total: -data.decreaseValue
       }, 
    });
  }


  async updateProductinOrder(id, productId, data) {
    await this.orderModel.findByIdAndUpdate(id, {
      $pull: { 
        products: { 
          _id: ObjectId(productId) 
        }
      },
      $inc: { 
        total: -data.oldPrice
       }, 
    });
    return await this.orderModel.findOneAndUpdate({_id: ObjectId(id)}, {
      
        $inc: { 
          total: (data.price * data.quantity)
        },
        $addToSet:{
          products:  {
            _id: ObjectId(productId),
            "productId": ObjectId(data.productId),
            "price": data.price,
            "quantity": data.quantity,
          }
        }}, {new: false})
  }

  async addOrder(data) {
      try {
        await new this.orderModel(data).save()
      } catch(error) {
         throw(error);
      }
  }



  async getCountCompeltedOrdersById (userId) {
    let data =  await this.orderModel.aggregate([
      {
        '$match': {
          'receiver.receiverId': ObjectId(userId), 
          'status': 'COMPLETED'
        }
      }, {
        '$count': 'status'
      }
    ]);
    if (data && data.length > 0) {
      return data[0].status;
    }

    return [];
 }

 async getCountCompletedOrdersByIdWeekly(userId) {
   let data =  await this.orderModel.aggregate([
     {
       '$match': {
         'receiver.receiverId': ObjectId(userId),
         'status': 'COMPLETED'
       }
     }, {
       '$group': {
         '_id': {
           'week': {
             '$week': '$orderDate'
           }
         }, 
         'count': {
           '$sum': 1
         }
       }
     }
   ])
   if (data && data.length > 0) {
      return data[data.length - 1].count;
   }

    return []; 
 }

 async getPotentialWinners(from, to, country, minimumValue) {
  return await this.orderModel.aggregate([
    {
      '$match': {
        'orderDate': {
          '$gte': new Date(from), 
          '$lte': new Date(to)
        }
      }
    }, {
      '$lookup': {
        'from': 'clients', 
        'localField': 'receiver.receiverId', 
        'foreignField': '_id', 
        'as': 'client'
      }
    }, {
      '$unwind': {
        'path': '$client', 
        'includeArrayIndex': 'clientId', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$match': {
        'address.country': country
      }
    }, {
      '$group': {
        '_id': '$receiver.receiverId', 
        'total': {
          '$sum': 1
        }
      }
    }, {
      '$match': {
        'total': {
          '$gte': Number(minimumValue)
        }
      }
    }, {
      '$lookup': {
        'from': 'clients', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'cc'
      }
    }, {
      '$unwind': {
        'path': '$cc', 
        'includeArrayIndex': 'ccId', 
        'preserveNullAndEmptyArrays': true
      }
    }
  ]);
  }
}

module.exports = OrderRepository;
