import _ from 'lodash';


export const attachProperties = (element, args) => {
  _.each(args, (pair) => element.property(...pair));
}


export const validateProperty = (key, value) => {
  if (!value) {
    throw new Error('Property value must exist');
  }

  if (!key) {
    throw new Error('Property key must exist');
  }

  if (key === '') {
    throw new Error('Property value cannot be an empty string');
  }
};
