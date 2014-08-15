var ModelSchema = require('./CategorySchema'),
  CoreSchema = require('facet-core').CoreSchema;

function CategoryModel(options) {
  var CategorySchema = new ModelSchema(options, new CoreSchema(options)),
  	CategoryModel = options.db.model('Category', CategorySchema);

  return CategoryModel;
};


module.exports = CategoryModel;
