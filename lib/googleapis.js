// Copyright 2012-2016, Google, Inc.
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

var Discovery = require('./discovery');
var discovery = new Discovery({ debug: false, includePrivate: false });

/**
 * Load the apis from apis index file
 * This file holds all version information
 * @private
 */
var apis = {};

/**
 * GoogleApis constructor.
 *
 * @example
 * var GoogleApis = require('googleapis').GoogleApis;
 * var google = new GoogleApis();
 *
 * @class GoogleApis
 * @param {Object} [options] Configuration options.
 */
function GoogleApis (options) {
  this.options(options);
  this.addAPIs(apis);

  /**
   * A reference to an instance of GoogleAuth.
   *
   * @name GoogleApis#auth
   * @type {GoogleAuth}
   */
  // this.auth = new GoogleAuth();
  this.auth = null;

  /**
   * A reference to the GoogleApis constructor function.
   *
   * @name GoogleApis#GoogleApis
   * @type {Function}
   */
  this.GoogleApis = GoogleApis;
}

/**
 * Set options.
 *
 * @param  {Object} [options] Configuration options.
 */
GoogleApis.prototype.options = function (options) {
  this._options = options || {};
};

/**
 * Add APIs endpoints to googleapis object
 * E.g. googleapis.drive and googleapis.datastore
 *
 * @name GoogleApis#addAPIs
 * @method
 * @param {Object} apis Apis to be added to this GoogleApis instance.
 * @private
 */
GoogleApis.prototype.addAPIs = function (apis) {
  for (var apiName in apis) {
    this[apiName] = apis[apiName].bind(this);
  }
};

/**
 * Dynamically generate an apis object that can provide Endpoint objects for the
 * discovered APIs.
 *
 * @example
 * var google = require('googleapis');
 * var discoveryUrl = 'https://myapp.appspot.com/_ah/api/discovery/v1/apis/';
 * google.discover(discoveryUrl, function (err) {
 *   var someapi = google.someapi('v1');
 * });
 *
 * @name GoogleApis#discover
 * @method
 * @param {string} url Url to the discovery service for a set of APIs. e.g.,
 * https://www.googleapis.com/discovery/v1/apis
 * @param {Function} callback Callback function.
 */
GoogleApis.prototype.discover = function (url, callback) {
  var self = this;

  discovery.discoverAllAPIs(url, function (err, apis) {
    if (err) {
      return callback(err);
    }
    self.addAPIs(apis);
    callback();
  });
};

/**
 * Dynamically generate an Endpoint object from a discovery doc.
 *
 * @example
 * var google = require('google');
 * var discoveryDocUrl = 'https://myapp.appspot.com/_ah/api/discovery/v1/apis/someapi/v1/rest';
 * google.discoverApi(discoveryDocUrl, function (err, someapi) {
 *   // use someapi
 * });
 *
 * @name GoogleApis#discoverAPI
 * @method
 * @param {string} path Url or file path to discover doc for a single API.
 * @param {object} [options] Options to configure the Endpoint object generated
 * from the discovery doc.
 * @param {Function} callback Callback function.
 */
GoogleApis.prototype.discoverAPI = function (path, options, callback) {
  var self = this;
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!options) {
    options = {};
  }
  discovery.discoverAPI(path, function (err, Endpoint) {
    if (err) {
      return callback(err);
    }
    var ep = new Endpoint(options);
    ep.google = self; // for drive.google.transporter
    return callback(null, Object.freeze(ep)); // create new & freeze
  });
};

/**
 * @example
 * var google = require('googleapis');
 *
 * @name google
 * @type {GoogleApis}
 */
module.exports = new GoogleApis();
