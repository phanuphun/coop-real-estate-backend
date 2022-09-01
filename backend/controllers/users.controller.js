const { SECRET, HOST } = require("../config/config");
const {
  Users,
  Roles,
  Package,
  UserFavorite,
  UserCompare,
  UserAccountDetails,
  UserSubProp,
  UserRequirement,
  UserReportProperty,
} = require("../model/index.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { async } = require("rxjs");
module.exports = {
  login: async (req, res) => {
    // console.log(req.body);
    try {
      let existUser = await Users.findOne({
        where: { userId: req.body.userId },
      });

      let response;
      if (!existUser) {
        response = await Users.create({
          userId: req.body.userId,
          displayName: req.body.displayName,
          fname: "-",
          lname: "-",
          pictureUrl: req.body.pictureUrl,
          packageId: req.body.packageId,
          roleId: req.body.roleId,
          subscriptionPeriodId: req.body.subscriptionPeriodId,
          packageExpire: req.body.packageExpire,
        });

        let userLatest = await Users.findOne({
          where: {
            userId: req.body.userId
          },
          attributes: ['id']
        })


        let createDetail = await UserAccountDetails.create({
          userId: userLatest.id,
          email: null,
          phone: null,
          organization: null,
          lineID: null,
          facebook: null,
          instagram: null,
          website: null
        })

        let token = jwt.sign({ userId: response.id }, SECRET, {
          expiresIn: "2h",
        });
        res.send({ token: token });
      } else {
        let token = jwt.sign({ userId: existUser.id }, SECRET, {
          expiresIn: "2h",
        });
        res.send({ token: token });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  addToFavorite: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const existFavorite = await UserFavorite.findOne({
        where: {
          userId: userId,
          propertyId: req.params.propertyId,
        },
      });

      // console.log(existFavorite);
      if (existFavorite) {
        const del = await UserFavorite.destroy({
          where: {
            userId: userId,
            propertyId: req.params.propertyId,
          },
        });
        return res.send({
          message: "deleted from favorite list successfully",
          status: 2,
        }); // status 2 is for delete from favorite
      } else {
        const add = await UserFavorite.create({
          userId: userId,
          propertyId: req.params.propertyId,
        });
      }

      res.send({ message: `add to favorite list successfully`, status: 1 }); // status 1 is for add to favorite
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  addToCompare: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const existCompare = await UserCompare.findOne({
        where: {
          userId: userId,
          propertyId: req.params.propertyId,
        },
      });

      if (existCompare) {
        const del = await UserCompare.destroy({
          where: {
            userId: userId,
            propertyId: req.params.propertyId,
          },
        });
        return res.status(200).send({
          message: "deleted from compare list successfully",
          status: 2,
        }); // status 2 is for remove from compare list
      } else {
        const add = await UserCompare.create({
          userId: userId,
          propertyId: req.params.propertyId,
        });
      }

      res
        .status(201)
        .send({ message: `add to compare list successfully`, status: 1 }); // status 1 is for add to compare list
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getAgentById: async (req, res) => {
    try {
      const response = await Users.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["id", "displayName", "fname", "lname", "pictureUrl"],
        include: [
          {
            model: UserAccountDetails,
            attributes: [
              "email",
              "phone",
              "organization",
              "lineID",
              "facebook",
              "instagram",
              "website",
            ],
          },
        ],
      });
      let data = {};
      data.id = response.id;
      data.displayName = response.displayName;
      data.fname = response.fname;
      data.lname = response.lname;
      if (response.pictureUrl.length < 20) {
        data.picture = `${HOST}/images/${response.pictureUrl}`;
      } else {
        data.picture = response.pictureUrl;
      }
      data.email = response.user_account_detail["email"];
      data.phone = response.user_account_detail["phone"];
      data.organization = response.user_account_detail["organization"];
      data.lineID = response.user_account_detail["lineID"];
      data.facebook = response.user_account_detail["facebook"];
      data.instagram = response.user_account_detail["instagram"];
      data.website = response.user_account_detail["website"];

      const count = await UserSubProp.count({
        where: {
          userId: req.params.id,
        },
      });

      res.send({ data: data, count: count });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAgents: async (req, res) => {
    try {
      const response = await Users.findAll({
        attributes: ["id", "displayName", "fname", "lname", "pictureUrl"],
        include: [
          {
            model: UserAccountDetails,
            attributes: [
              "email",
              "phone",
              "organization",
              "lineID",
              "facebook",
              "instagram",
              "website",
            ],
          },
        ],
      });
      let agents = [];
      for (let i = 0; i < response.length; i++) {
        let data = {};
        data.id = response[i].id;
        data.displayName = response[i].displayName;
        data.fname = response[i].fname;
        data.lname = response[i].lname;
        if (response[i].pictureUrl.length < 20) {
          data.picture = `${HOST}/images/${response[i].pictureUrl}`;
        } else {
          data.picture = response[i].pictureUrl;
        }
        data.email = response[i].user_account_detail["email"];
        data.phone = response[i].user_account_detail["phone"];
        data.organization = response[i].user_account_detail["organization"];
        data.lineID = response[i].user_account_detail["lineID"];
        data.facebook = response[i].user_account_detail["facebook"];
        data.instagram = response[i].user_account_detail["instagram"];
        data.website = response[i].user_account_detail["website"];
        agents.push(data);
      }

      res.send({ data: agents });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const id = res.locals.userId;

      let response = await Users.findOne({
        where: {
          id: id,
        },
        attributes: ["id", "displayName", "fname", "lname", "pictureUrl"],
        include: [
          {
            model: Package,
            attributes: ["name"],
          },
        ],
      });

      let detail = await UserAccountDetails.findOne({
        where: {
          userId: id,
        },
        attributes: [
          "email",
          "phone",
          "organization",
          "lineID",
          "facebook",
          "instagram",
          "website",
        ],
      });

      let data = {};
      data.id = response.id;
      data.displayName = response.displayName;
      data.fname = response.fname;
      data.lname = response.lname;
      if (response.pictureUrl.length > 20) {
        data.picture = response.pictureUrl;
      } else {
        data.picture = `${HOST}/images/${response.pictureUrl}`;
      }
      if (detail) {
        data.email = detail.email
        data.phone = detail.phone
        data.organization = detail.organization
        data.lineID = detail.lineID
        data.facebook = detail.facebook
        data.instagram = detail.instagram
        data.website = detail.website
      } else {
        data.email = "";
        data.phone = "";
        data.organization = "";
        data.lineID = "";
        data.facebook = "";
        data.instagram = "";
        data.website = "";
      }

      const package = response.package.name;

      res.send({ data: data, package: package });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const id = res.locals.userId;

      const user = await Users.update(
        {
          displayName: req.body.displayName,
          fname: req.body.fname,
          lname: req.body.lname,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const existDetail = await UserAccountDetails.findOne({
        where: {
          userId: id,
        },
      });
      if (existDetail) {
        const detail = await UserAccountDetails.update(
          {
            email: req.body.email,
            phone: req.body.phone,
            organization: req.body.organization,
            facebook: req.body.facebook,
            lineID: req.body.lineID,
            instagram: req.body.instagram,
            website: req.body.website,
          },
          {
            where: {
              userId: id,
            },
          }
        );
      } else {
        const detail = await UserAccountDetails.create(
          {
            userId: id,
            email: req.body.email,
            phone: req.body.phone,
            organization: req.body.organization,
            facebook: req.body.facebook,
            lineID: req.body.lineID,
            instagram: req.body.instagram,
            website: req.body.website,
          }
        );
      }

      // test response
      res.send({ message: "update user profile successfully" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const id = res.locals.userId;
      const img = req.body.gallery[0];

      let oldPic = await Users.findOne({
        where: {
          id: id,
        },
        attributes: ["pictureUrl"],
      });

      if (oldPic.pictureUrl.length < 20) {
        try {
          let absolutePath = path.resolve("public/images/" + oldPic.pictureUrl);
          if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(String(absolutePath));
          }
        } catch (error) {
          console.log("image does not exist");
        }
      }

      const response = await Users.update(
        {
          pictureUrl: img,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.send({ message: "updated avatar successfully" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAccountBasic: async (req, res) => {
    try {
      const id = res.locals.userId;
      let response = await Users.findOne({
        where: {
          id: id,
        },
        attributes: ["displayName", "pictureUrl"],
      });

      if (response.pictureUrl.length < 20) {
        response.pictureUrl = `${HOST}/images/${response.pictureUrl}`;
      }

      res.send({ name: response.displayName, img: response.pictureUrl });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  checkFavorite: async (req, res) => {
    try {
      const id = res.locals.userId;

      const existFavorite = await UserFavorite.findOne({
        where: {
          userId: id,
          propertyId: req.params.propertyId,
        },
      });

      if (existFavorite) {
        res.send({ check: true });
      } else {
        res.send({ check: false });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  checkCompare: async (req, res) => {
    try {
      const id = res.locals.userId;

      const existCompare = await UserCompare.findOne({
        where: {
          userId: id,
          propertyId: req.params.propertyId,
        },
      });

      if (existCompare) {
        res.send({ check: true });
      } else {
        res.send({ check: false });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  addRequirement: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const existRequirement = await UserRequirement.findOne({
        where: {
          userId: userId,
          requirement: req.body.requirement,
        },
      });

      if (existRequirement) {
        res.send({
          status: 2,
          message: `your requirement "${req.body.requirement}" already exist `,
        }); //status 2 is for exist requirement
      } else {
        const addRequirement = await UserRequirement.create({
          userId: userId,
          requirement: req.body.requirement,
        });
        res.send({
          status: 1,
          message: `added "${req.body.requirement}" to your requirement`,
        }); // status 1 is for added requirement
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getRequirements: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const requirement = await UserRequirement.findAll({
        where: {
          userId: userId,
        },
        attributes: ["id", "requirement"],
        order: [["id", "desc"]],
      });
      res.send({ data: requirement });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  removeRequirement: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const remove = UserRequirement.destroy({
        where: {
          userId: userId,
          id: req.params.id,
        },
      });
      res.send({ status: 1, message: `remove successfully` });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  clearAllRequirement: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const clear = await UserRequirement.destroy({
        where: {
          userId: userId,
        },
      });
      res.send({ status: 1, message: "clear all requirements" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  reportProperty: async (req, res) => {
    try {
      const userId = res.locals.userId;
      const propertyId = req.params.propertyId;

      const existReport = await UserReportProperty.findOne({
        where: {
          userId: userId,
          propertyId: propertyId,
        },
      });

      if (existReport) {
        return res.send({ status: 2, message: "Your report already exists" }); //status 2 is for report already exists
      } else {
        const addReport = await UserReportProperty.create({
          userId: userId,
          propertyId: propertyId,
        });

        res.send({ status: 1, message: "Your report has been submitted" }); // status 1 is for submitted report successfully
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserPackageId: async (req, res) => {
    try {
      const userId = res.locals.userId;

      const getPackageIdandSubsctiprionPeriodId = await Users.findOne({
        where: {
          id: userId,
        },
        attributes: ["packageId", "subscriptionPeriodId"],
      });
      res.send({ status: 1, data: getPackageIdandSubsctiprionPeriodId });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
