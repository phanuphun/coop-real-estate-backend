
const Sequelize = require('sequelize')
const { HOST, PORT, USER, PASSWORD, DATABASE } = require('../config/config')
  

const sequelize = new Sequelize(
    'test',
    'root',
    '', {
  
        dialect: 'mysql',
        host: '127.0.0.1',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timezone:"+07:00"
    }
);
// const sequelize = new Sequelize(
//     'test',
//     'khem',
//     'DeltasofPassword', {
  
//         dialect: 'mysql',
//         host: '127.0.0.1',
//         charset: 'utf8',
//         collate: 'utf8_general_ci',
//         timezone:"+07:00"
//     }
// );
 
const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;


//property functional table
db.PropertyType = require('./schema/Property/property_type')(sequelize, Sequelize);
db.PropertyPurpose = require('./schema/Property/property_purpose')(sequelize, Sequelize);
db.PropertyAdditional = require('./schema/Property/property_additional')(sequelize, Sequelize);
db.PropertyAdditionalFeatures = require('./schema/Property/property_features')(sequelize, Sequelize);

//user submit property
db.UserSubProp = require('./schema/userProperty/user_sub_prop')(sequelize, Sequelize);
db.UserSubPropAddi = require('./schema/userProperty/user_sub_prop_addtional')(sequelize, Sequelize);
db.UserSubPropAddiFeat = require('./schema/userProperty/user_sub_prop_additional_features')(sequelize, Sequelize);
db.UserSubPropGallery = require('./schema/userProperty/user_sub_prop_galleries')(sequelize, Sequelize)


//address functional table
db.Provinces = require('./schema/Address/Provinces')(sequelize, Sequelize);
db.District = require('./schema/Address/District')(sequelize, Sequelize);
db.SubDistrict = require('./schema/Address/SubDistrict')(sequelize, Sequelize);
db.Geography = require('./schema/Address/Geography')(sequelize, Sequelize);

//Users and Roles table
db.Users = require('./schema/Users/Users')(sequelize, Sequelize)
db.Roles = require('./schema/Users/Roles')(sequelize, Sequelize)
db.UserAccountDetails = require('./schema/Users/UserAccountDetail')(sequelize, Sequelize)
db.UserFavorite = require('./schema/Users/UserFavorite')(sequelize, Sequelize)
db.UserCompare = require('./schema/Users/UserCompare')(sequelize, Sequelize)
db.UserRequirement = require('./schema/Users/UserRequirement')(sequelize, Sequelize)
db.UserReportProperty = require('./schema/Users/UserReportProperty')(sequelize, Sequelize)
db.UserReportUser = require('./schema/Users/UserReportUser')(sequelize, Sequelize)
db.MoneyTransfer = require('./schema/Users/MoneyTransfer')(sequelize, Sequelize)

//package
db.Package = require('./schema/Packages/Package')(sequelize, Sequelize)
db.SubscriptionPeriod = require('./schema/Packages/SubscriptionPeriod')(sequelize, Sequelize)

//detail report user and detail report property
db.DetailReportUser = require('./schema/DetailReport/detailReportUser')(sequelize, Sequelize)
db.DetailReportProperty = require('./schema/DetailReport/detailReportProperty')(sequelize, Sequelize)
//our services
db.OurService = require('./schema/ourServices/ourService')(sequelize, Sequelize) 

//about helpers 
db.Faq = require('./schema/Faq/faq')(sequelize, Sequelize)
db.FaqCategory = require('./schema/Faq/faqCategory')(sequelize, Sequelize)
db.FaqHelpful = require('./schema/Faq/faqHelpful')(sequelize, Sequelize)

//contact us 
db.ContactUs = require('./schema/Contact/Contact')(sequelize, Sequelize)

//feedbacks 
db.Feedback = require('./schema/Feedback/Feedback')(sequelize, Sequelize)

//helpers realtion
db.FaqCategory.hasMany(db.Faq, { foreignKey: 'category' })
db.Faq.belongsTo(db.FaqCategory, { foreignKey: 'category' })
db.Users.hasMany(db.FaqHelpful, { foreignKey: 'userId' })
db.FaqHelpful.belongsTo(db.Users, { foreignKey: 'userId' })
db.Faq.hasMany(db.FaqHelpful, { foreignKey: 'faqId' })
db.FaqHelpful.belongsTo(db.Faq, { foreignKey: 'faqId' })

//Users, memberStatus and Roles realations
db.Roles.hasMany(db.Users, { foreignKey: 'roleId' })
db.Users.belongsTo(db.Roles, { foreignKey: 'roleId' }) 
db.Package.hasMany(db.Users, { foreignKey: 'packageId' })
db.Users.belongsTo(db.Package, { foreignKey: 'packageId' }) 
db.SubscriptionPeriod.hasMany(db.Users, { foreignKey: 'subscriptionPeriodId' })
db.Users.belongsTo(db.SubscriptionPeriod, { foreignKey: 'subscriptionPeriodId' }) 
db.Users.hasOne(db.UserAccountDetails, { foreignKey: 'userId' })
db.UserAccountDetails.belongsTo(db.Users, { foreignKey: 'userId' }) 

db.Users.hasMany(db.UserFavorite, { foreignKey: 'userId' })
db.UserFavorite.belongsTo(db.Users, { foreignKey: 'userId' })
db.UserSubProp.hasMany(db.UserFavorite, { foreignKey: 'propertyId' })
db.UserFavorite.belongsTo(db.UserSubProp, { foreignKey: 'propertyId' })

db.Users.hasMany(db.UserCompare, { foreignKey: 'userId' })
db.UserCompare.belongsTo(db.Users, { foreignKey: 'userId' })
db.UserSubProp.hasMany(db.UserCompare, { foreignKey: 'propertyId' })
db.UserCompare.belongsTo(db.UserSubProp, { foreignKey: 'propertyId' })

db.Users.hasMany(db.UserReportProperty, { foreignKey: 'userId' })
db.UserReportProperty.belongsTo(db.Users, { foreignKey: 'userId' })
db.UserSubProp.hasMany(db.UserReportProperty, { foreignKey: 'propertyId' })
db.UserReportProperty.belongsTo(db.UserSubProp, { foreignKey: 'propertyId' })
db.DetailReportProperty.hasMany(db.UserReportProperty, { foreignKey: 'detailReportId' })
db.UserReportProperty.belongsTo(db.DetailReportProperty, { foreignKey: 'detailReportId' })

db.Users.hasMany(db.UserRequirement, { foreignKey: 'userId' })
db.UserRequirement.belongsTo(db.Users, { foreignKey: 'userId' })
db.PropertyPurpose.hasMany(db.UserRequirement, { foreignKey: 'purposeId' })
db.UserRequirement.belongsTo(db.PropertyPurpose, { foreignKey: 'purposeId' })
db.PropertyType.hasMany(db.UserRequirement, { foreignKey: 'typeId' })
db.UserRequirement.belongsTo(db.PropertyType, { foreignKey: 'typeId' })
db.SubDistrict.hasMany(db.UserRequirement, { foreignKey: 'subDistrictId' })
db.UserRequirement.belongsTo(db.SubDistrict, { foreignKey: 'subDistrictId' }) 

db.Users.hasMany(db.UserReportUser,{  foreignKey: 'userId'  })
db.UserReportUser.belongsTo(db.Users, { foreignKey: 'userId' })
db.Users.hasMany(db.UserReportUser, { foreignKey: 'userReportedId' })
db.UserReportUser.belongsTo(db.Users, { foreignKey: 'userReportedId' })
db.DetailReportUser.hasMany(db.UserReportUser, { foreignKey: 'detailReportId'  })
db.UserReportUser.belongsTo(db.DetailReportUser, { foreignKey: 'detailReportId'  })

db.Users.hasMany(db.MoneyTransfer, { foreignKey: 'userId' })
db.MoneyTransfer.belongsTo(db.Users, { foreignKey: 'userId' })
db.Package.hasMany(db.MoneyTransfer, {  foreignKey: 'packageId'})
db.MoneyTransfer.belongsTo(db.Package, {  foreignKey: 'packageId'})
db.SubscriptionPeriod.hasMany(db.MoneyTransfer, { foreignKey: 'periodId' })
db.MoneyTransfer.belongsTo(db.SubscriptionPeriod, { foreignKey: 'periodId' })


//user property relations
db.PropertyPurpose.hasMany(db.UserSubProp, { foreignKey: 'propFor'})//N:1
db.UserSubProp.belongsTo(db.PropertyPurpose, { foreignKey: 'propFor'})//1:N
db.PropertyType.hasMany(db.UserSubProp, { foreignKey: 'propType'})//N:1
db.UserSubProp.belongsTo(db.PropertyType, { foreignKey: 'propType'})//1:N
db.SubDistrict.hasMany(db.UserSubProp, { foreignKey: 'addressId' })//N:1
db.UserSubProp.belongsTo(db.SubDistrict, { foreignKey: 'addressId' })//1:N
// db.UserSubPropAddi.hasOne(db.UserSubProp, { foreignKey: "additionalId" })//1:1
// db.UserSubProp.belongsTo(db.UserSubPropAddi, { foreignKey: "additionalId" })//1:1
db.UserSubProp.hasOne(db.UserSubPropAddi, { foreignKey: 'propertyId' })
db.UserSubPropAddi.belongsTo(db.UserSubProp, { foreignKey: 'propertyId' })
db.UserSubPropAddi.hasMany(db.UserSubPropAddiFeat, { foreignKey: "additionalId" }) // N : 1
db.UserSubPropAddiFeat.belongsTo(db.UserSubPropAddi, { foreignKey: "additionalId" })//1 : N
db.PropertyAdditionalFeatures.hasMany(db.UserSubPropAddiFeat, { foreignKey: "featuresId" })// N : 1
db.UserSubPropAddiFeat.belongsTo(db.PropertyAdditionalFeatures, { foreignKey: "featuresId" })// 1 : N  
db.UserSubProp.hasMany(db.UserSubPropGallery, { foreignKey: 'propertyId' }) //1:N
db.UserSubPropGallery.belongsTo(db.UserSubProp, { foreignKey: 'propertyId' } ) //N:1 


//Users and Property Relations
db.Users.hasMany(db.UserSubProp, { foreignKey: 'userId'})
db.UserSubProp.belongsTo(db.Users, { foreignKey: 'userId'})

//address relations
db.Geography.hasMany(db.Provinces);
db.Provinces.belongsTo(db.Geography);
db.Provinces.hasMany(db.District);
db.District.belongsTo(db.Provinces); 
db.District.hasMany(db.SubDistrict);
db.SubDistrict.belongsTo(db.District);


module.exports = db
