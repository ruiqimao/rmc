"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uniqueId;
var id = 0;

/*
 * Generate a unique id.
 */
function uniqueId() {
  // Return the next unique id.
  return id++;
}