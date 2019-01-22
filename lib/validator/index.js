"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.delay = void 0;

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const delay = time => new Promise(resolve => setTimeout(resolve, time));
/**
 * Check all your properties exist on a given schema.
 */


exports.delay = delay;

const checkAllPropsExist = (referenceSchema, candidateSchemaObject) => {
  _logger.default.info('Checking props exist......... what do do when they dont?');

  if (!candidateSchemaObject) return new Error('No object to check passed in...');
  const graph = referenceSchema['@graph'];
  const candidateSchemaObjectKeysArray = candidateSchemaObject ? Object.keys(candidateSchemaObject) : null;
  const nonexistentPropsObject = { ...candidateSchemaObject
  }; // return nonexistent....

  graph.forEach((prop, i) => {
    Object.entries(prop).forEach(([key, value]) => {
      if (key === '@type' && value !== 'Property') return; // with a label for this prop, we show what it is...

      if (key === 'rdfs:label') {
        if (candidateSchemaObject && candidateSchemaObjectKeysArray.includes(value)) {
          delete nonexistentPropsObject[value];
        }
      }
    });
  }); // remove standard issue props

  delete nonexistentPropsObject['id'];
  delete nonexistentPropsObject['@id'];
  const invalidKeysArray = Object.keys(nonexistentPropsObject);

  if (invalidKeysArray && invalidKeysArray.length) {
    console.warn('There is some incompatability between your provided object and the schema...');
    const doDoes = invalidKeysArray.length === 1 ? 'does' : 'do';
    console.warn(`${invalidKeysArray.join(' , ')} ${doDoes} not exist on this schema`);
  }

  return;
};

const schemasWeCheck = ['Text', 'Number', 'Date', 'DateTime', 'URL', 'Integer', 'Boolean'].map(s => `schema:${s}`);
/**
 * Check that your property is of the correct type (so long as valid to check in schemas...)
 *
 * TODO: Add more validations for basic data types.
 *  Add validations of class etc also.
 * @param  {[type]} validType [description]
 * @param  {[type]} value     [description]
 * @return {[type]}           [description]
 */

const checkTypes = (validType, value) => {
  console.log('valid type passed in:::::', validType);
  let typeWeWant = validType;

  if (typeof typeWeWant === 'object') {
    typeWeWant = typeWeWant['@id'];
  }

  if (!value) {
    console.error('Problems with no value');
  }

  console.log('CHECKING ', value, 'SHOULD BE ', typeWeWant);

  if (schemasWeCheck.includes(typeWeWant)) {
    _logger.default.warn('actually checking ', value, 'is', typeWeWant);

    switch (typeWeWant) {
      case 'schema:Text':
        {
          _logger.default.warn('testing text');

          if (typeof value !== 'string') {
            console.error('Candidate data type error:', value, 'is type ', typeof value, 'should be: Text');
            return false;
          }

          break;
        }

      case 'schema:Integer':
        {
          if (!Number.isInteger(value)) {
            console.error('Candidate data type error:', value, 'is', typeof value, 'should be: Integer');
            return false;
          }

          break;
        }

      case 'schema:Number':
        {
          if (isNaN(value)) {
            console.error('Candidate data type error:', value, 'is', typeof value, 'should be: Number');
            return false;
          }

          break;
        }

      default:
        {
          console.warn('Cannot check the type of value:', value);
          return true; // do nothing
        }
    }
  }

  return true;
};
/**
 * Our actual validation function.
 * Takes a referenceSchema and compares the viability of a given object to map to that schema.
 * @param  {[type]}  referenceSchema [description]
 * @param  {[type]}  candidateSchemaObject    [description]
 * @return {Promise}                 [description]
 */


const checkThisMakesSensePlease = (referenceSchema, candidateSchemaObject) => {
  if (typeof referenceSchema !== 'object') throw new Error('A reference schema object must be passed.');
  if (typeof candidateSchemaObject !== 'object') throw new Error('A candidate object must be passed to validate.');
  checkAllPropsExist(referenceSchema, candidateSchemaObject);

  _logger.default.info('Validating......');

  if (!candidateSchemaObject) return new Error('No object to check passed in...');
  const graph = referenceSchema['@graph'];
  const candidateSchemaObjectKeysArray = candidateSchemaObject ? Object.keys(candidateSchemaObject) : null;
  let whollyValid = true;
  graph.forEach((prop, i) => {
    let thisProp = prop['rdfs:label'];

    if (!thisProp || typeof thisProp !== 'string') {
      // console.warn( 'No label provided for the schema property.' )
      return;
    } // console.log( 'ThisProp should be', prop['schema:rangeIncludes'] );


    let rangeIncludes = prop['schema:rangeIncludes'];
    let isValid = false;
    const candidateValueToCheck = candidateSchemaObject[thisProp];
    if (!candidateValueToCheck) return;

    if (Array.isArray(rangeIncludes)) {
      // console.log('that is an array, so doing each...')
      rangeIncludes.forEach(type => {
        // console.log('>>> from array tyoe to check', type)
        if (!isValid) {
          isValid = checkTypes(type, candidateValueToCheck);
        }
      });
    } else {
      isValid = checkTypes(rangeIncludes, candidateValueToCheck);
    }

    if (isValid) {
      _logger.default.info(thisProp + ' is not valid');
    }

    if (whollyValid) {
      // only set if still true...
      whollyValid = isValid;
    }
  });
  return whollyValid;
};

var _default = checkThisMakesSensePlease;
exports.default = _default;