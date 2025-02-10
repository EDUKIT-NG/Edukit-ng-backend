const resourceSchema = new Schema({
  total: Number,
  status: ["delivered", "shipped"],
  needsCategory: ["books", "uniform", "learning resources"],
  quantities: Number,
  description: String,
  condition: String,
  methodOfDelivery: ["pickup", "ship"],
  pickUpDetails: String,

  // Volunteer roles for the materials supplied
  role: ["collection", "sorting", "distribution"],
});
// admin will view resources, transactions, users
// save updated admin database
//can generate reports
