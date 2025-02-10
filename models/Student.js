const studentProfileSchema = new Schema({
  fullName: String,
  age: Number,
  gender: String,
  address: String,
  schoolName: String,
  class: Number,
  schoolType: String,
  schoolLocation: String,
  schoolContact: String,
  parentOccupation: String,
  noOfSiblings: Number,
  resourceNeed: String,
  reason: String,
  otherSupport: ["scholarships", "donations"],
  supportReceived: String,
  whyConsidered: String,
  howResourceWillHelp: String,
  communityContribution: String,
  goals: String,
  otherInfo: String,
});
// save updated students info
// can view resources, request a resource, join communities, chat
// validation
