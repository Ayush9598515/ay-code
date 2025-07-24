const mongoose = require('mongoose');

// Sub-schema for test cases
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: [true, 'Test case input is required']
  },
  expectedOutput: {
    type: String,
    required: [true, 'Test case expectedOutput is required']
  }
}, { _id: false });

// Sub-schema for examples
const exampleSchema = new mongoose.Schema({
  input: {
    type: String,
    required: [true, 'Example input is required']
  },
  output: {
    type: String,
    required: [true, 'Example output is required']
  }
}, { _id: false });

// Main problem schema
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  examples: {
    type: [exampleSchema],
    default: []
  },
  constraints: {
    type: [String],
    default: []
  },
  starterCode: {
    type: Map,
    of: String,
    default: () => new Map()
  },
  defaultInput: {
    type: String,
    default: ""
  },
  difficulty: {
    type: String,
    enum: {
      values: ["Easy", "Medium", "Hard"],
      message: '{VALUE} is not a valid difficulty'
    },
    required: [true, 'Difficulty is required']
  },
  testCases: {
    type: [testCaseSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);
