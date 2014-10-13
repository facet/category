"use strict";
var util = require('util'),
  Category = require('./model/category'),
  ApiCore = require('facet-core').ApiCore;

/**
 * Category API constructor
 *
 * @param   {Object}  options   Options object - must contain 'db' (mongoose instance)
 *                              and 'intercom' (EventEmitter instance) keys.
 *                              
 * @return  {void} 
 */
var CategoryAPI = function ( options ){
  
  // set the options
  // this.setCommonAttributes( options );
  
  // set the api event type
  this.apiEventType = this.options.apiEventType || 'category';
  
  CategoryAPI.super_.call(this, options);

  // set the model
  this.Model = new Category( this.options );

  // set the router for automation
  this.setupRouterManifest();

  // register the api events
  this.registerEvents();
};


/**
 * Category API inherits from Core API
 */
util.inherits(CategoryAPI, ApiCore);


/**
 * Sets up the router manifest for route automation
 *
 * @return   {void}
 */
CategoryAPI.prototype.setupRouterManifest = function () {

  // update the router manifest 
  this.routerManifest
    .setApiEventType(this.apiEventType)
    .setApiModelId('categoryId')
    .setRouteBase('/categories')
    .setRoutes([
      { verb: 'GET',    route: '/:categoryId', emit: 'facet:' + this.apiEventType + ':findone' },  // GET a single Category by id
      { verb: 'GET',    route: '',             emit: 'facet:' + this.apiEventType + ':find'    },  // GET an array of Category objects 
      { verb: 'POST',   route: '',             emit: 'facet:' + this.apiEventType + ':create'  },  // POST new Category
      { verb: 'PUT',    route: '/:categoryId', emit: 'facet:' + this.apiEventType + ':update'  },  // PUT single/multiple Categories
      { verb: 'DELETE', route: '/:categoryId', emit: 'facet:' + this.apiEventType + ':remove'  },  // DELETE a single Category resource
    ])
    .extendRouteErrorMessages({
      conditions: 'No query conditions were specified',
      query: 'Error querying for category(ies): ',
      notFound: 'No category was found.',
      find: 'No category(ies) matched your criteria.',
      findOne: 'No category matched your criteria.',
      update: 'No updates were specified.',
      updateMatch: 'No categories were updated based on your criteria.',
      create: 'No data supplied for creating new category.',
      createMatch: 'No category was created based on your criteria.',
      remove: 'No data supplied for removing category.',
      removeMatch: 'No category was removed based on your criteria.'
    });
};


/**
 * Registers the Category API event listeners
 *
 * @return   {void}
 */
CategoryAPI.prototype.registerEvents = function () {  
  var _this = this;

  this.intercom.on('facet:' + this.apiEventType + ':data', function handleCategoryData( data, nodeStack ) {
    data.then( function( categoryData ) {
      if( null === categoryData ){
        _this.intercom.emit('facet:response:error', 404, 'Category was not found.');
      }
      else {
        _this.intercom.emit('facet:response:' + this.apiEventType + ':data', categoryData);
      }
    },
    function( err ) {
      _this.intercom.emit('facet:response:error', 404, 'Error querying for category(s): ' + err.message);
    }).end();
  });
  this.intercom.on( 'facet:' + this.apiEventType + ':find',    this.find.bind(this)    );
  this.intercom.on( 'facet:' + this.apiEventType + ':findone', this.findOne.bind(this) );
  this.intercom.on( 'facet:' + this.apiEventType + ':create',  this.create.bind(this)  );
  this.intercom.on( 'facet:' + this.apiEventType + ':update',  this.update.bind(this)  );
  this.intercom.on( 'facet:' + this.apiEventType + ':remove',  this.remove.bind(this)  );
};


/**
 * Exports the Category API
 *
 * @type   {Object}
 */
exports = module.exports = CategoryAPI;
