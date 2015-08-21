'use strict';

/* Filters */

var filters = angular.module('filters', []);

filters.filter('pad', function() {
  return function (input, length, string) {
    return ((new Array(length+1)).join(string) + input).slice(-length);
  };
});
