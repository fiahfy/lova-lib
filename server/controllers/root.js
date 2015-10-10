'use strict';

function *root() {
  this.body = {node_version: process.version};
}

module.exports = root;
