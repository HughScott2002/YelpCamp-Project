const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: String,
  error: String,
});

module.exports = mongoose.model("Report", ReportSchema);
