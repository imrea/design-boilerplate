import _ from 'lodash/core';

document.addEventListener('DOMContentLoaded', event => {
  console.log('DOM fully loaded and parsed');
  console.log(`Lodash version: ${_.VERSION}`);
});
