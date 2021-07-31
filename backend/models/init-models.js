var DataTypes = require("sequelize").DataTypes;
var _Conference = require("./Conference");
var _Notice = require("./Notice");
var _SequelizeMeta = require("./SequelizeMeta");
var _Team = require("./Team");
var _User = require("./User");
var _UserConference = require("./UserConference");
var _UserNotice = require("./UserNotice");
var _UserTeam = require("./UserTeam");
var _UserVerification = require("./UserVerification");
var _Verification = require("./Verification");

function initModels(sequelize) {
  var Conference = _Conference(sequelize, DataTypes);
  var Notice = _Notice(sequelize, DataTypes);
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var Team = _Team(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var UserConference = _UserConference(sequelize, DataTypes);
  var UserNotice = _UserNotice(sequelize, DataTypes);
  var UserTeam = _UserTeam(sequelize, DataTypes);
  var UserVerification = _UserVerification(sequelize, DataTypes);
  var Verification = _Verification(sequelize, DataTypes);

  UserConference.belongsTo(Conference, { as: "conference", foreignKey: "conferenceID"});
  Conference.hasMany(UserConference, { as: "UserConferences", foreignKey: "conferenceID"});
  UserNotice.belongsTo(Notice, { as: "notice", foreignKey: "noticeID"});
  Notice.hasMany(UserNotice, { as: "UserNotices", foreignKey: "noticeID"});
  Conference.belongsTo(Team, { as: "team", foreignKey: "teamID"});
  Team.hasMany(Conference, { as: "Conferences", foreignKey: "teamID"});
  UserTeam.belongsTo(Team, { as: "team", foreignKey: "teamID"});
  Team.hasMany(UserTeam, { as: "UserTeams", foreignKey: "teamID"});
  Verification.belongsTo(Team, { as: "team", foreignKey: "teamID"});
  Team.hasMany(Verification, { as: "Verifications", foreignKey: "teamID"});
  Conference.belongsTo(User, { as: "founder", foreignKey: "founderID"});
  User.hasMany(Conference, { as: "Conferences", foreignKey: "founderID"});
  Team.belongsTo(User, { as: "founder", foreignKey: "founderID"});
  User.hasMany(Team, { as: "Teams", foreignKey: "founderID"});
  UserConference.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(UserConference, { as: "UserConferences", foreignKey: "userID"});
  UserNotice.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(UserNotice, { as: "UserNotices", foreignKey: "userID"});
  UserTeam.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(UserTeam, { as: "UserTeams", foreignKey: "userID"});
  UserVerification.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(UserVerification, { as: "UserVerifications", foreignKey: "userID"});
  Verification.belongsTo(User, { as: "sender", foreignKey: "senderID"});
  User.hasMany(Verification, { as: "Verifications", foreignKey: "senderID"});
  Verification.belongsTo(User, { as: "receiver", foreignKey: "receiverID"});
  User.hasMany(Verification, { as: "receiver_Verifications", foreignKey: "receiverID"});
  UserVerification.belongsTo(Verification, { as: "verification", foreignKey: "verificationID"});
  Verification.hasMany(UserVerification, { as: "UserVerifications", foreignKey: "verificationID"});

  return {
    Conference,
    Notice,
    SequelizeMeta,
    Team,
    User,
    UserConference,
    UserNotice,
    UserTeam,
    UserVerification,
    Verification,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
