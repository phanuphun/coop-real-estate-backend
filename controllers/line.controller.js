const line = require("@line/bot-sdk");
const {
  CHANNEL_ACCESS_TOKEN,
  CHANNEL_SECRET,
  NGROK,
  USER_PATH
} = require("../config/config");
const {
  UserSubProp,
  UserSubPropAddi,
  UserSubPropAddiFeat,
  PropertyAdditionalFeatures,
  SubDistrict,
  District,
  Provinces,
  PropertyType,
  PropertyPurpose,
  Sequelize,
  sequelize,
  UserSubPropGallery,
  UserFavorite,
  UserCompare,
  Users,
  Package,
  UserRequirement,
} = require("../model/index.model");
const { Op } = require("sequelize");
const config = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CHANNEL_SECRET,
};

const client = new line.Client(config);
const webhook = async (req, res) => {
  try {
    const event = req.body.events[0];
    // console.log(event);
    if (event.type !== "message" || event.message.type !== "text") {
      return res.end();
    } else if (event.type === "message" && event.message.type === "text") {
      const message = event.message;
      if (message.text === "newest" || message.text === "ใหม่ล่าสุด") {
        let prop = await sequelize.query(
          `select  user_sub_props.id as id,
                           user_sub_props.title as title,
                           user_sub_props.description as description,
                           user_sub_props.priceSale as priceSale,
                           user_sub_props.priceRent as priceRent,
                           
                           user_sub_props.lat as lat,
                           user_sub_props.lng as lng,
                           user_sub_props.houseNo as houseNo,
                           user_sub_props.createdAt as createdAt,
          
                           propPurpose.id as purpose_id,
                           propPurpose.name_th as purpose,
                          
                           propType.id as type_id,
                           propType.name_th as type,
                    
                           provinces.id as prov_id,
                           provinces.name_th as prov_name, 
          
                           districts.id as dist_id,
                           districts.name_th as dist_name,
          
                           subdistricts.id as subDist_id,
                           subdistricts.name_th as subDist_name, 
                           subdistricts.zip_code as zipcode,    
                                    
                           addi.bedrooms as bedrooms,
                           addi.bathrooms as bathrooms,       
                           addi.garages as garages,
                           addi.area as area,      
                           addi.floor as floor, 
                           addi.yearBuilt as yearBuilt
          
                  from user_sub_props
          
                  inner join property_purposes propPurpose on user_sub_props.propFor = propPurpose.id
                  inner join property_types propType on user_sub_props.propType = propType.id
                  inner join subdistricts on user_sub_props.addressId = subdistricts.id 
                  inner join districts on subdistricts.DistrictId = districts.id 
                  inner join provinces on districts.ProvinceId = provinces.id
                  inner join user_sub_prop_additionals addi on addi.propertyId = user_sub_props.id
             
                  order by createdAt desc limit 5   `
        );

        prop = prop[0];
        let propertyId = [];
        prop.forEach((res) => {
          res.gallery = [];
          propertyId.push(res.id);
        });

        let propGallery = await UserSubPropGallery.findAll({
          attributes: ["path", "propertyId"],
          where: {
            propertyId: { [Op.in]: propertyId },
          },
        });

        prop.forEach((res) => {
          propGallery.forEach((gallery) => {
            if (res.id == gallery.propertyId) {
              res.gallery.push(`${NGROK}/images/properties/` + gallery.path);
            }
          });
        });

        prop.forEach((res) => {
          res.gallery = res.gallery.reverse();
          res.gallery = res.gallery[0];
        });
        let contents = [];
        prop.forEach((res) => {
          res.address = `${res.houseNo}, ${res.subDist_name}, ${res.dist_name}, ${res.prov_name}, ${res.zipcode}`;
          res.link = `${USER_PATH}/properties/${res.id}`;

          if (res.purpose_id == 1) {
            res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}`;
          } else if (res.purpose_id == 2) {
            res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
          } else if (res.purpose_id == 3) {
            res.price = `฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}, ฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
          }
          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = [
          {
            type: 'text',
            text: 'รายการอสังหาฯใหม่ล่าสุด' 
          },
          {
          type: "flex",
          altText: "newest",
          contents: carousel,
          }
        ] ;
        return res.send(client.replyMessage(event.replyToken, response));
      } else if (
        message.text === "newest rent" ||
        message.text === "ใหม่ล่าสุด สำหรับเช่า"
      ) {
        let prop = await sequelize.query(
          `select  user_sub_props.id as id,
                           user_sub_props.title as title,
                           user_sub_props.description as description,
                           user_sub_props.priceSale as priceSale,
                           user_sub_props.priceRent as priceRent,
                           
                           user_sub_props.lat as lat,
                           user_sub_props.lng as lng,
                           user_sub_props.houseNo as houseNo,
                           user_sub_props.createdAt as createdAt,
          
                           propPurpose.id as purpose_id,
                           propPurpose.name_th as purpose,
                          
                           propType.id as type_id,
                           propType.name_th as type,
                    
                           provinces.id as prov_id,
                           provinces.name_th as prov_name, 
          
                           districts.id as dist_id,
                           districts.name_th as dist_name,
          
                           subdistricts.id as subDist_id,
                           subdistricts.name_th as subDist_name, 
                           subdistricts.zip_code as zipcode,    
                                    
                           addi.bedrooms as bedrooms,
                           addi.bathrooms as bathrooms,       
                           addi.garages as garages,
                           addi.area as area,      
                           addi.floor as floor, 
                           addi.yearBuilt as yearBuilt
          
                  from user_sub_props
          
                  inner join property_purposes propPurpose on user_sub_props.propFor = propPurpose.id
                  inner join property_types propType on user_sub_props.propType = propType.id
                  inner join subdistricts on user_sub_props.addressId = subdistricts.id 
                  inner join districts on subdistricts.DistrictId = districts.id 
                  inner join provinces on districts.ProvinceId = provinces.id
                  inner join user_sub_prop_additionals addi on addi.propertyId = user_sub_props.id

                  where user_sub_props.propFor = 2

                  order by createdAt desc limit 5   `
        );

        prop = prop[0];
        let propertyId = [];
        prop.forEach((res) => {
          res.gallery = [];
          propertyId.push(res.id);
        });

        let propGallery = await UserSubPropGallery.findAll({
          attributes: ["path", "propertyId"],
          where: {
            propertyId: { [Op.in]: propertyId },
          },
        });

        prop.forEach((res) => {
          propGallery.forEach((gallery) => {
            if (res.id == gallery.propertyId) {
              res.gallery.push(`${NGROK}/images/properties/` + gallery.path);
            }
          });
        });

        prop.forEach((res) => {
          res.gallery = res.gallery.reverse();
          res.gallery = res.gallery[0];
        });
        let contents = [];
        prop.forEach((res) => {
          res.address = `${res.houseNo}, ${res.subDist_name}, ${res.dist_name}, ${res.prov_name}, ${res.zipcode}`;
          res.link = `${USER_CLIENT_PATH}/properties/${res.id}`;

          res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;

          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = [
          {
            type: 'text',
            text: 'รายการอสังหาฯสำหรับเช่าใหม่ล่าสุด'
          },
          {
          type: "flex",
          altText: "newest rent",
          contents: carousel,
        }
        ] ;
        return res.send(client.replyMessage(event.replyToken, response));
      } else if (
        message.text === "newest sale" ||
        message.text === "ใหม่ล่าสุด สำหรับขาย"
      ) {
        let prop = await sequelize.query(
          `select  user_sub_props.id as id,
                           user_sub_props.title as title,
                           user_sub_props.description as description,
                           user_sub_props.priceSale as priceSale,
                           user_sub_props.priceRent as priceRent,
                           
                           user_sub_props.lat as lat,
                           user_sub_props.lng as lng,
                           user_sub_props.houseNo as houseNo,
                           user_sub_props.createdAt as createdAt,
          
                           propPurpose.id as purpose_id,
                           propPurpose.name_th as purpose,
                          
                           propType.id as type_id,
                           propType.name_th as type,
                    
                           provinces.id as prov_id,
                           provinces.name_th as prov_name, 
          
                           districts.id as dist_id,
                           districts.name_th as dist_name,
          
                           subdistricts.id as subDist_id,
                           subdistricts.name_th as subDist_name, 
                           subdistricts.zip_code as zipcode,    
                                    
                           addi.bedrooms as bedrooms,
                           addi.bathrooms as bathrooms,       
                           addi.garages as garages,
                           addi.area as area,      
                           addi.floor as floor, 
                           addi.yearBuilt as yearBuilt
          
                  from user_sub_props
          
                  inner join property_purposes propPurpose on user_sub_props.propFor = propPurpose.id
                  inner join property_types propType on user_sub_props.propType = propType.id
                  inner join subdistricts on user_sub_props.addressId = subdistricts.id 
                  inner join districts on subdistricts.DistrictId = districts.id 
                  inner join provinces on districts.ProvinceId = provinces.id
                  inner join user_sub_prop_additionals addi on addi.propertyId = user_sub_props.id

                  where user_sub_props.propFor = 1

                  order by createdAt desc limit 5   `
        );

        prop = prop[0];
        let propertyId = [];
        prop.forEach((res) => {
          res.gallery = [];
          propertyId.push(res.id);
        });

        let propGallery = await UserSubPropGallery.findAll({
          attributes: ["path", "propertyId"],
          where: {
            propertyId: { [Op.in]: propertyId },
          },
        });

        prop.forEach((res) => {
          propGallery.forEach((gallery) => {
            if (res.id == gallery.propertyId) {
              res.gallery.push(`${NGROK}/images/properties/` + gallery.path);
            }
          });
        });

        prop.forEach((res) => {
          res.gallery = res.gallery.reverse();
          res.gallery = res.gallery[0];
        });
        let contents = [];
        prop.forEach((res) => {
          res.address = `${res.houseNo}, ${res.subDist_name}, ${res.dist_name}, ${res.prov_name}, ${res.zipcode}`;
          res.link = `${USER_CLIENT_PATH}/properties/${res.id}`;

          res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}`;

          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = [
          {
            type: 'text',
            text: 'รายการอสังหาฯสำหรับขายใหม่ล่าสุด'
          },
          {
          type: "flex",
          altText: "newest sale",
          contents: carousel,
        }
        ] ;
        return res.send(client.replyMessage(event.replyToken, response));
      } else if (
        message.text === "my properties" ||
        message.text === "อสังหาของฉัน"
      ) {
        const userId = event.source.userId;
        // console.log(event.source.userId);
        const existUser = await Users.findOne({
          where: {
            userId: userId,
          },
          attributes: ["id"],
        });
        // console.log(existUser.id);
        if (!existUser) {
          return res.end();
        } else {
          let prop = await sequelize.query(
            `select  user_sub_props.id as id,
                             user_sub_props.title as title,
                             user_sub_props.description as description,
                             user_sub_props.priceSale as priceSale,
                             user_sub_props.priceRent as priceRent,
                             
                             user_sub_props.lat as lat,
                             user_sub_props.lng as lng,
                             user_sub_props.houseNo as houseNo,
                             user_sub_props.createdAt as createdAt,
            
                             propPurpose.id as purpose_id,
                             propPurpose.name_th as purpose,
                            
                             propType.id as type_id,
                             propType.name_th as type,
                      
                             provinces.id as prov_id,
                             provinces.name_th as prov_name, 
            
                             districts.id as dist_id,
                             districts.name_th as dist_name,
            
                             subdistricts.id as subDist_id,
                             subdistricts.name_th as subDist_name, 
                             subdistricts.zip_code as zipcode,    
                                      
                             addi.bedrooms as bedrooms,
                             addi.bathrooms as bathrooms,       
                             addi.garages as garages,
                             addi.area as area,      
                             addi.floor as floor, 
                             addi.yearBuilt as yearBuilt
            
                    from user_sub_props
            
                    inner join property_purposes propPurpose on user_sub_props.propFor = propPurpose.id
                    inner join property_types propType on user_sub_props.propType = propType.id
                    inner join subdistricts on user_sub_props.addressId = subdistricts.id 
                    inner join districts on subdistricts.DistrictId = districts.id 
                    inner join provinces on districts.ProvinceId = provinces.id
                    inner join user_sub_prop_additionals addi on addi.propertyId = user_sub_props.id
  
                    where user_sub_props.userId = ${existUser.id}
  
                    order by createdAt desc limit 10   `
          );

          prop = prop[0];
          let propertyId = [];
          prop.forEach((res) => {
            res.gallery = [];
            propertyId.push(res.id);
          });

          let propGallery = await UserSubPropGallery.findAll({
            attributes: ["path", "propertyId"],
            where: {
              propertyId: { [Op.in]: propertyId },
            },
          });

          prop.forEach((res) => {
            propGallery.forEach((gallery) => {
              if (res.id == gallery.propertyId) {
                res.gallery.push(`${NGROK}/images/properties/` + gallery.path);
              }
            });
          });

          prop.forEach((res) => {
            res.gallery = res.gallery.reverse();
            res.gallery = res.gallery[0];
          });
          let contents = [];
          prop.forEach((res) => {
            res.address = `${res.houseNo}, ${res.subDist_name}, ${res.dist_name}, ${res.prov_name}, ${res.zipcode}`;
            res.link = `${USER_CLIENT_PATH}/properties/${res.id}`;

            if (res.purpose_id == 1) {
              res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}`;
            } else if (res.purpose_id == 2) {
              res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
            } else if (res.purpose_id == 3) {
              res.price = `฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}, ฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
            }

            const temp = createFlexMessage(res);
            contents.push(temp);
          });
          const carousel = { type: "carousel", contents: contents };
          const response = [{
            type: 'text',
            text: 'รายการอสังหาฯของคุณ'
          },
            {
            type: "flex",
            altText: "newest rent",
            contents: carousel,
          }];
          return res.send(client.replyMessage(event.replyToken, response));
        }
      } else if (
        message.text === "avatar" ||
        message.text === "รูปโปรไฟล์ของฉัน"
      ) {
        const userId = event.source.userId;
        // console.log(event.source.userId);
        const existUser = await Users.findOne({
          where: {
            userId: userId,
          },
          attributes: ["id"],
        });
        // console.log(existUser.id);
        if (!existUser) {
          return res.end();
        } else {
          const img = await Users.findOne({
            where: {
              id: existUser.id,
            },
            attributes: ["pictureUrl"],
          });
          //  console.log(img.pictureUrl);

          if (img.pictureUrl.length <= 20) {
            let image = [
              {
                type: 'text',
                text: 'รูปโปรไฟล์บนเว็บไซต์ของคุณ'
              },
              {
              type: "image",
              originalContentUrl: `${NGROK}/images/avatar/${img.pictureUrl}`,
              previewImageUrl: `${NGROK}/images/avatar/${img.pictureUrl}`,
            }
            ];
            return res.send(client.replyMessage(event.replyToken, image));
          } else {
            let image = [
              {
                type: 'text',
                text: 'รูปโปรไฟล์บนเว็บไซต์ของคุณ'
              },
              {
              type: "image",
              originalContentUrl: img.pictureUrl,
              previewImageUrl: img.pictureUrl,
            }
            ];
            return res.send(client.replyMessage(event.replyToken, image));
          }

          
        }
      } else if (message.text === "requirement" || message.text === "ที่ฉันต้องการ") {
        const userId = event.source.userId;
        // console.log(event.source.userId);
        const existUser = await Users.findOne({
          where: {
            userId: userId,
          },
          attributes: ["id"],
        });

        if (!existUser) {
          return res.end();
        } else {
          let requirementPost = await UserRequirement.findAll({
            where: {
              userId: existUser.id,
            },
            attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
          });

          let purposeId = [];
          let typeId = [];
          let subDistrictId = [];

          requirementPost.forEach((post) => {
            purposeId.push(post.purposeId);
            typeId.push(post.typeId);
            subDistrictId.push(post.subDistrictId);
          });

          let property = await UserSubProp.findAll({ 
            attributes: ["id"],
            where: {
              userId: { [Op.ne]: existUser.id }
            },
            include: [
              {
                model: PropertyPurpose,
                attributes: ["id"],
                where: { id: { [Op.in]: purposeId } },
              },
              {
                model: PropertyType,
                attributes: ["id"],
                where: { id: { [Op.in]: typeId } },
              },
              {
                model: SubDistrict,
                attributes: ["id"],
                where: { id: { [Op.in]: subDistrictId } },
              },
            ],
          });

          let propertyId = [];
          property.forEach((prop) => {
            propertyId.push(prop.id);
          });

          property = await sequelize.query(
            `select  user_sub_props.id as id,
                             user_sub_props.title as title,
                             user_sub_props.description as description,
                             user_sub_props.priceSale as priceSale,
                             user_sub_props.priceRent as priceRent,
                             
                             user_sub_props.lat as lat,
                             user_sub_props.lng as lng,
                             user_sub_props.houseNo as houseNo,
                             user_sub_props.createdAt as createdAt,
            
                             propPurpose.id as purpose_id,
                             propPurpose.name_th as purpose,
                            
                             propType.id as type_id,
                             propType.name_th as type,
                      
                             provinces.id as prov_id,
                             provinces.name_th as prov_name, 
            
                             districts.id as dist_id,
                             districts.name_th as dist_name,
            
                             subdistricts.id as subDist_id,
                             subdistricts.name_th as subDist_name, 
                             subdistricts.zip_code as zipcode,    
                                      
                             addi.bedrooms as bedrooms,
                             addi.bathrooms as bathrooms,       
                             addi.garages as garages,
                             addi.area as area,      
                             addi.floor as floor, 
                             addi.yearBuilt as yearBuilt
            
                    from user_sub_props
            
                    inner join property_purposes propPurpose on user_sub_props.propFor = propPurpose.id
                    inner join property_types propType on user_sub_props.propType = propType.id
                    inner join subdistricts on user_sub_props.addressId = subdistricts.id 
                    inner join districts on subdistricts.DistrictId = districts.id 
                    inner join provinces on districts.ProvinceId = provinces.id
                    inner join user_sub_prop_additionals addi on addi.propertyId = user_sub_props.id
  
                    where user_sub_props.id IN (${propertyId})
  
                    order by createdAt desc limit 10   `
          );

          property = property[0];

          property.forEach((res) => {
            res.gallery = [];
          });

          let propGallery = await UserSubPropGallery.findAll({
            attributes: ["path", "propertyId"],
            where: {
              propertyId: { [Op.in]: propertyId },
            },
          });

          property.forEach((res) => {
            propGallery.forEach((gallery) => {
              if (res.id == gallery.propertyId) {
                res.gallery.push(`${NGROK}/images/avatar/` + gallery.path);
              }
            });
          });

          property.forEach((res) => {
            res.gallery = res.gallery.reverse();
            res.gallery = res.gallery[0];
          });
          let contents = [];
          property.forEach((res) => {
            res.address = `${res.houseNo}, ${res.subDist_name}, ${res.dist_name}, ${res.prov_name}, ${res.zipcode}`;
            res.link = `${USER_CLIENT_PATH}/properties/${res.id}`;

            if (res.purpose_id == 1) {
              res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}`;
            } else if (res.purpose_id == 2) {
              res.price = `${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
            } else if (res.purpose_id == 3) {
              res.price = `฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceSale)}, ฿ ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(res.priceRent)}/เดือน`;
            }

            const temp = createFlexMessage(res);
            contents.push(temp);
          });
          const carousel = { type: "carousel", contents: contents };
          const response = [
            {
              type: 'text',
              text: 'อสังหาริมทรัพย์ที่ตรงกับความต้องการของคุณ'
            },
            {
              type: "flex",
              altText: "newest rent",
              contents: carousel,
            },
          ];

          return res.send(client.replyMessage(event.replyToken, response));
        }
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createFlexMessage = (res) => {
  // console.log(data);
  let data = res;
  //return
  let bubble = {
    type: "bubble",
    hero: {
      type: "image",
      url: data.gallery,
      size: "full",
      aspectRatio: "4:3",
      aspectMode: "cover",
      action: {
        type: "uri",
        uri: res.link,
      },
      margin: "none",
      align: "center",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: data.title,
          weight: "bold",
          size: "xl",
        },
        {
          type: "text",
          text: data.price,
          weight: "bold",
          size: "xl",
          color: "#1976d2",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: data.type,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
                {
                  type: "text",
                  text: data.purpose,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: data.address,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "link",
          height: "sm",
          action: {
            type: "uri",
            label: "WEBSITE",
            uri: data.link,
          },
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };
  //  console.log(bubble);
  return bubble;
};

module.exports = {
  webhook: webhook,
};
