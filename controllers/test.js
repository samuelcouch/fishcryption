exports.name = function(req, res) {
  res.send('Hello, ' + req.params.name)
};