const line = require("@line/bot-sdk");
const {
  CHANNEL_ACCESS_TOKEN,
  CHANNEL_SECRET,
  NGROK,
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
              res.gallery.push(`${NGROK}/images/` + gallery.path);
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
          res.link = `https://127.0.0.1:4200/properties/${res.id}`;

          if (res.purpose_id == 1) {
            res.price = `฿ ${res.priceSale}`;
          } else if (res.purpose_id == 2) {
            res.price = `฿ ${res.priceRent}/เดือน`;
          } else if (res.purpose_id == 3) {
            res.price = `฿ ${res.priceSale}, ฿ ${res.priceRent}/เดือน`;
          }
          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = {
          type: "flex",
          altText: "newest",
          contents: carousel,
        };
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
              res.gallery.push(`${NGROK}/images/` + gallery.path);
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
          res.link = `https://127.0.0.1:4200/properties/${res.id}`;

          res.price = `฿ ${res.priceRent}/เดือน`;

          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = {
          type: "flex",
          altText: "newest rent",
          contents: carousel,
        };
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
              res.gallery.push(`${NGROK}/images/` + gallery.path);
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
          res.link = `https://127.0.0.1:4200/properties/${res.id}`;

          res.price = `฿ ${res.priceSale}`;

          const temp = createFlexMessage(res);
          contents.push(temp);
        });
        const carousel = { type: "carousel", contents: contents };
        const response = {
          type: "flex",
          altText: "newest sale",
          contents: carousel,
        };
        return res.send(client.replyMessage(event.replyToken, response));
      } else if (message.text === "my properties" || message.text === "อสังหาของฉัน") {
        const userId = event.source.userId;
        // console.log(event.source.userId);
        const existUser = await Users.findOne({
          where: {
            userId: userId,
          },
          attributes:['id']
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
                res.gallery.push(`${NGROK}/images/` + gallery.path);
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
            res.link = `https://127.0.0.1:4200/properties/${res.id}`;
  
            if (res.purpose_id == 1) {
              res.price = `฿ ${res.priceSale}`;
            } else if (res.purpose_id == 2) {
              res.price = `฿ ${res.priceRent}/เดือน`;
            } else if (res.purpose_id == 3) {
              res.price = `฿ ${res.priceSale}, ฿ ${res.priceRent}/เดือน`;
            }
  
            const temp = createFlexMessage(res);
            contents.push(temp);
          });
          const carousel = { type: "carousel", contents: contents };
          const response = {
            type: "flex",
            altText: "newest rent",
            contents: carousel,
          };
          return res.send(client.replyMessage(event.replyToken, response));
        }
      } else if (message.text === "avatar" || message.text === "รูปโปรไฟล์ของฉัน") {
        const userId = event.source.userId;
        // console.log(event.source.userId);
        const existUser = await Users.findOne({
          where: {
            userId: userId,
          },
          attributes:['id']
        });
        // console.log(existUser.id);
        if (!existUser) {
          return res.end();
        } else {
          const img = await Users.findOne({
            where: {
              id: existUser.id
            },
            attributes: ['pictureUrl']
          })
        //  console.log(img.pictureUrl); 
         let image = {
          type: 'image',
          originalContentUrl: `${NGROK}/images/${img.pictureUrl}`,
          previewImageUrl: `${NGROK}/images/${img.pictureUrl}`,
         }
         return res.send(client.replyMessage(event.replyToken, image));
        }
        
      } else if (message.text === "test" || message.text === "เทส") {
        // let user = await Users.findAll({
        //   attributes: ['userId']
        // })
        // let userId = []
        // user.forEach((u) => {
        //   userId.push(u.userId)
        // })
        // return res.send(client.multicast(userId, { type: 'text', text: 'ส่งหาทุกคน' }))
        // console.log(userId);

        let address = await SubDistrict.findOne({
          where: {
            id: 440310
          },
          attributes: ['name_th', 'zip_code'],
          include: [
            {
              model: District,
              attributes: ['name_th'],
              include: [
                {
                  model: Provinces,
                  attributes: ['name_th']
                }
              ]
            }
          ]
        })
        let zipCode = address.zip_code
        let subDist= address.name_th
        let dist = address.District.name_th
        let prov = address.District.Province.name_th
        // console.log(subDist, dist, prov, zipCode);
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
