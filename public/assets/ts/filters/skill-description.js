'use strict';
//import * as angular from 'angular';
var app = require('../app');
function skillDescription($sce) {
    return function (skill) {
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
        if (cd && cd.length) {
            cd = '- クールダウン : ' + cd.join(' / ');
            desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + cd + '</b><br/>');
        }
        var ap = skill.ap;
        if (ap && cd.length) {
            ap = '- 消費AP : ' + ap.join(' / ');
            desc = desc.replace(/<br\/>/, '<br/>&nbsp;&nbsp;<b>' + ap + '</b><br/>');
        }
        return $sce.trustAsHtml(desc);
    };
}
angular.module(app.appName).filter('skillDescription', skillDescription);
