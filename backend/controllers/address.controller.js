const db = require("../config/database");
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
      const response = await Provinces.findAll({
        order: [["GeographyId", "ASC"]],
        attributes: ["id", "name_th", "name_en"],
      });
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getProvincesss: async (req, res) => {
    try {
      const response = await Provinces.findAll({
        order: [["GeographyId", "ASC"]],
        where: { id: req.params.provinceId },
        include: [
          {
            model: District,
            where: { id: req.params.districtId },
            include: [
              { model: SubDistrict, where: { id: req.params.subDistrictId } },
            ],
          },
        ],
      });
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getDistricts: async (req, res) => {
    try {
      const response = await District.findAll({
        where: {
          provinceId: req.params.id,
        },
        attributes: ["id", "name_th", "name_en", "ProvinceId"],
      });
      res.send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getSubDistricts: async (req, res) => {
    try {
      const response = await SubDistrict.findAll({
        where: {
          districtId: req.params.id,
        },
        attributes: ["id", "name_th", "name_en"],
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

  testPage: async (req, res) => {
    try {
      const count = await sequelize.query(`
        select count(*) as length from subdistricts 
        order by id asc
      `);

      const response = await sequelize.query(`
      select * from subdistricts 
      order by id asc LIMIT ${req.params.perPage} OFFSET ${req.params.page}
      `);

      res.send({ count: count[0], data: response[0] });
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

  // setProvinceLatLng: async (req, res) => {
  //   try {
  //     const response = await Provinces.update(
  //       {
  //         lat: req.body.lat,
  //         lng: req.body.lng,
  //       },
  //       {
  //         where: {
  //           id: req.body.id,
  //         },
  //       }
  //     );

  //     res.send(response);
  //   } catch (err) {
  //     res.status(500).send(err.message);
  //   }
  // },
};
