"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const manualPlease = (actualSchema, specificProp) => {
  if (!actualSchema) throw new Error('Pass a schema to retrieve documentation.');
  if (typeof actualSchema !== 'object') throw new Error('Schema must be passed as an object');
  if (specificProp && typeof specificProp !== 'string') throw new Error('To get documentation on a prop pass a string.');
  const graph = actualSchema['@graph'];
  if (!graph) throw new Error('No graph found on this schema.');
  let manual = '';
  graph.forEach((prop, i) => {
    Object.entries(prop).forEach(([key, value]) => {
      // ignore entries that aren't props of the schema
      if (key === '@type' && value !== 'Property') return; // with a label for this prop, we show what it is...

      if (key === 'rdfs:label') {
        if (specificProp && value !== specificProp) return;
        manual += `\t ${value} :  ${prop['rdfs:comment']} \n`;
      }
    });
  });

  _logger.default.trace(manual);

  return manual;
};

var _default = manualPlease;
exports.default = _default;