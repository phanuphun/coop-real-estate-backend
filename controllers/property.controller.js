const {
  PropertyType,
  PropertyPurpose,
  PropertyAdditional,
  PropertyAdditionalFeatures,
} = require("../model/index.model");
module.exports = {
  getPropPurpose: async (req, res) => {
    try {
      const response = await PropertyPurpose.findAll();
      res.send(response);
    } catch (err) {
      res.status(500).send(err.message)
    }
      
  },

  getPropType: async(req, res) => {
    try {
      const response = await PropertyType.findAll();
      res.send(response)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  getPropAdditional: async(req, res) => {
    try {
      const response = await PropertyAdditional.findAll();
      res.send(response)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  getPropAdditionalFeatures: async(req, res) => {
    try {
      const response = await PropertyAdditionalFeatures.findAll();
      res.send(response)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
};
