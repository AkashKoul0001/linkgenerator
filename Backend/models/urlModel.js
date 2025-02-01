// const mongoose = require("mongoose");

// const clickDetailsSchema = new mongoose.Schema({
//   ipAddress: { type: String },
//   deviceType: { type: String }
// }, { timestamps: true });

// const urlSchema = new mongoose.Schema({
//   originalUrl: { type: String, required: true },
//   shortUrl: { type: String, unique: true, required: true },
//   remark: { type: String },
//   expiresAt: { type: Date },
//   clicks: { type: Number, default: 0 },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   clickDetails: [clickDetailsSchema]  // Array to store click details
// }, { timestamps: true });

// module.exports = mongoose.model("Url", urlSchema);

const mongoose = require("mongoose");

const clickDetailsSchema = new mongoose.Schema({
  ipAddress: { type: String },
  deviceType: { type: String }
}, { timestamps: true });

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true, required: true },
  remark: { type: String },
  expiresAt: { type: Date },
  clicks: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clickDetails: [clickDetailsSchema]  // Array to store click details
}, { timestamps: true });

module.exports = mongoose.model("Url", urlSchema);




// // const mongoose = require("mongoose");

// // const urlSchema = new mongoose.Schema({
// //   originalUrl: { type: String, required: true },
// //   shortUrl: { type: String, unique: true, required: true },
// //   remark: { type: String },
// //   expiresAt: { type: Date },
// //   clicks: { type: Number, default: 0 },
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
// // }, { timestamps: true });

// // module.exports = mongoose.model("Url", urlSchema);
