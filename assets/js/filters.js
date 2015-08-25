'use strict';

/* Filters */

var filters = angular.module('filters', []);

filters.filter('pad', function() {
  return function(input, length, string) {
    return ((new Array(length+1)).join(string) + input).slice(-length);
  };
});
filters.filter('convert', function ($sce) {
  return function(text) {
    return $sce.trustAsHtml(!text ? text : text
      .replace(/\n/g, '<br/>')
      .replace(/(［[^］]+］)/g, '<b>$1</b>')
      .replace(/(<b>)/g, '<br/>&nbsp;&nbsp;$1'));
  }
});
