// const mongoose = require('mongoose');

// const clickLogSchema = new mongoose.Schema({
//   shortUrl: { type: String, required: true },
//   ipAddress: { type: String, required: true },
//   deviceType: { type: String, required: true },
//   browser: { type: String, required: true },
//   os: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ensure this references User model
// });

// const ClickLog = mongoose.model('ClickLog', clickLogSchema);

// module.exports = ClickLog;

// // const mongoose = require("mongoose");

// // const clickLogSchema = new mongoose.Schema({
// //   shortUrl: { type: String, required: true },
// //   ipAddress: { type: String, required: true },
// //   deviceType: { type: String, required: true },
// //   browser: { type: String, required: true },
// //   os: { type: String, required: true },
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // userId is optional
// // }, { timestamps: true });

// // const ClickLog = mongoose.model("ClickLog", clickLogSchema);

// // module.exports = ClickLog;


const mongoose = require("mongoose");

const clickLogSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true },
  ipAddress: { type: String },
  deviceType: { type: String, default: "Unknown Device" },
  browser: { type: String, default: "Unknown Browser" },
  os: { type: String, default: "Unknown OS" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("ClickLog", clickLogSchema);
