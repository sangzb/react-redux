import * as CONSTANTS from '../constants';

export default function contantize (constant) {
  if (!CONSTANTS.hasOwnProperty(constant)) {
    console.error(`CONSTANT: '${constant}' is not exists!`);
  }
  return CONSTANTS[constant];
}
