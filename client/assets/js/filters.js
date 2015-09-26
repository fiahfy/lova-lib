/// <reference path="_all.ts" />
var lova;
(function (lova) {
    'use strict';
    function pad() {
        return function (input, length, str) {
            return ((new Array(length + 1)).join(str) + input).slice(-length);
        };
    }
    lova.pad = pad;
    function def() {
        return function (input, value) {
            return (typeof input === 'undefined' || input == null) ? value : input;
        };
    }
    lova.def = def;
    function replace() {
        return function (input, regexp, newSubStr) {
            if (!input) {
                return input;
            }
            var reg = new RegExp(regexp);
            return input.replace(reg, newSubStr);
        };
    }
    lova.replace = replace;
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
    lova.skillDescription = skillDescription;
})(lova || (lova = {}));
//# sourceMappingURL=filters.js.map