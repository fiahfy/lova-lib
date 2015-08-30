'use strict';

/* Filters */

var filters = angular.module('filters', []);

filters.filter('pad', function() {
  return function(input, length, string) {
    return ((new Array(length+1)).join(string) + input).slice(-length);
  };
});
filters.filter('default', function() {
  return function(input, string) {
    return (typeof input === 'undefined' || input == null) ? string : input;
  };
});
filters.filter('replace', function() {
  return function(input, regexp, newSubStr) {
    if (!input) {
      return input;
    }
    var reg = new RegExp(regexp);
    return input.replace(reg, newSubStr);
  };
});
filters.filter('skillDescription', function ($sce) {
  return function(skill) {
    var desc = skill.description;
    if (!desc) {
      return desc;
    }
    desc = desc
      .replace(/(^|\n)\d+\.\s/g, '$1')
      .replace(/\n/g, '<br/><br/>')
      .replace(/［([^］]+)］/g, '<br/>&nbsp;&nbsp;<b>- $1</b>')
      .replace(/：/g, ' : ');

    var cd = skill.cd;
    if (cd) {
      cd = '- クールダウン : ' + cd.replace(/,/g, ' / ');
      desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + cd + '</b><br/>');
    }

    var ap = skill.ap;
    if (ap) {
      ap = '- 消費AP : ' + ap.replace(/,/g, ' / ');
      desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + ap + '</b><br/>');
    }

    return $sce.trustAsHtml(desc);
  }
});
