const {
  Provinces,
  District,
  SubDistrict,
  Geography,
  sequelize,
} = require("../model/index.model");
const json_data = require("../public/asset/sub-districts.json");
module.exports = {
  getProvinces: async (req, res) => {
    try {
      const lang = req.params.lang
      console.log(req.params.lang);
      const response = await Provinces.findAll({
        order: [[ lang == 'th' ? "name_th" : "name_en", "ASC"]],
        attributes: ["id", "name_th", "name_en"],
      });
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message); 
    }
  },
  getDistricts: async (req, res) => {
    try {
      const lang = req.params.lang
      const response = await District.findAll({
        where: {
          provinceId: req.params.id,
        },
        attributes: ["id", "name_th", "name_en", "ProvinceId"],
        order: [[ lang == 'th' ? "name_th" : "name_en", "ASC"]]
      });
      res.send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getSubDistricts: async (req, res) => {
    try {
      const lang = req.params.lang
      const response = await SubDistrict.findAll({
        where: {
          districtId: req.params.id,
        },
        attributes: ["id", "name_th", "name_en"],
        order: [[ lang == 'th' ? "name_th" : "name_en", "ASC"]]
      });
      res.send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getGeo: async (req, res) => {
    try {
      const response = await Geography.findAll({
        attributes: ["name"],
        include: [{ model: Provinces, attributes: ["name_th"] }],
      });
      res.send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getProvinceLatLng: async(req, res) => {
    try {
      const response = await Provinces.findOne({
        attributes: ['lat', 'lng'],
        where: {
          id: req.params.id
        }
      })
      res.send(response)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
};
