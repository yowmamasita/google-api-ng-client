// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var googleapis = require('./lib/googleapis');

function getDiscoveryUrl (name, version) {
  return 'https://www.googleapis.com/discovery/v1/apis/' + name +
    '/' + version + '/rest';
}

function loadApi (name, version, discoveryUrl, options, cb) {
  var google = new googleapis.GoogleApis();
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  return google.discoverAPI(discoveryUrl ? discoveryUrl : getDiscoveryUrl(name, version), options, cb);
}

exports.getDiscoveryUrl = getDiscoveryUrl;
exports.loadApi = loadApi;
exports.noop = function () {};
