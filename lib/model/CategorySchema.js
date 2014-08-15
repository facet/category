var tree = require('mongoose-tree'),
  _ = require('underscore');

var CategorySchema = function( options, CoreSchema ){

  var Schema = options.db.Schema;

  var CategorySchema = new CoreSchema({
    'key': { type: String, required: 'The key is required.' },
    'label': { type: String, required: 'The label field is required.' },
    'description': { type: String },
    'custom': { type: Schema.Types.Mixed, default: function(){ return {}; } },
    'date_created': { type: Date, default: Date.now },
    'date_modified': { type: Date, default: Date.now },
    'date_deleted': { type: Date, default: null }
  });

  CategorySchema.plugin(tree);

  CategorySchema.pre('save', function(next, done) {
    // if this is a child, make sure the app_id matches parent's
    if( !_.isEmpty(this.parent_id) && !_.isEmpty(parent.app_id) ) {
      this.collection.findOne({_id: this.parent_id}).select('app_id').exec(function(err, parent) {
        if(err) return next(err);

        if( this.app_id !== parent.app_id ) {
          done(new Error('A child categories app_id must match the parent\'s app_id.'))
        }
        else {
          next();
        }
      });
    }

    next();
  });

  return CategorySchema;
};

module.exports = exports = CategorySchema;
