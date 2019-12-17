module.exports = function migration20190130000000() {
  this.createTable('articles', function() {
    this.string('name', {not_null: true});
    this.string('author');
    this.string('keyword');
    this.text('inhalt');
  })
};
