var Schema = require('./CategorySchema');

function CategoryModel(options) {
  var CategorySchema = new Schema(options)
    , CategoryModel = options.db.model('Category', CategorySchema);

  return CategoryModel;
};


module.exports = CategoryModel;
