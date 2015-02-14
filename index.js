'use strict';

var _ = require('underscore');

/*
 * Apply difference between two objects without without rewriting
 * destination object
 * @param source {object} - the source object. Destination should be exactly
 *   equal to this object after using applyDiff
 * @param destination {object} - the object that will get modified to be
 *   equal to source object.
*/
function applyDiff(source, destination) {

  // type check
  if (!_.isObject(source)) {
    throw new Error('source should be an object');
  }
  if (!_.isObject(destination)) {
    throw new Error('destination should be an object');
  }

  var sourceKeys = Object.keys(source);
  var destinationKeys = Object.keys(destination);
  var extraKeys;

  // if there are fewer keys in source, remove the extra keys from
  // destination
  if (sourceKeys.length < destinationKeys.length) {
    extraKeys = _.difference(destinationKeys, sourceKeys);

    extraKeys.forEach(function (key) {
      delete destination[key];
    });
  }

  // if there are more keys in source, add the extra keys to destination
  if (sourceKeys.length > destinationKeys.length) {
    extraKeys = _.difference(sourceKeys, destinationKeys);

    extraKeys.forEach(function (key) {
      destination[key] = source[key];
    });
  }

  // if sourceKeys and destinationKeys are not equal, but have the same
  // length then find the diff and apply it.
  //
  // example: source: ['one', 'two'] and destination: ['one', 'three']
  // remove 'three' from destination and add 'two' to source
  if (!_.isEqual(sourceKeys, destinationKeys)) {
    var newKeys = _.difference(sourceKeys, destinationKeys);

    newKeys.forEach(function (key) {
      destination[key] = source[key];
    });

    extraKeys = _.difference(destinationKeys, sourceKeys);
    extraKeys.forEach(function (key) {
      delete destination[key];
    });
  }

  // for each property in source check if the value of that property is
  // deeply equal to destination:
  //  if the value is deeply equal do nothing
  //  if the value is not deeply equal, call applyDiff with source value to
  //  destination value
  for (var property in source) {

    // if there is a difference between source and destination
    if (!_.isEqual(source[property], destination[property])) {

      // if source[property] is not an object, just override
      if (!_.isObject(source[property])) {
        destination[property] = source[property];
      } else {
        applyDiff(source[property], destination[property]);
      }
    }
  }
}

module.exports = applyDiff;
