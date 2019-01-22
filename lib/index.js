"use strict";

var _manual = _interopRequireDefault(require("./manual"));

var _validator = _interopRequireDefault(require("./validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  man: _manual.default,
  validate: _validator.default
};