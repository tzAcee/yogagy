const IncomingForm = require('formidable').IncomingForm
const sq = require('./sqlite');



module.exports = function upload(req, res) {
  var form = new IncomingForm()

  form.on('file', (field, file) => {
      sq.set_blob(JSON.stringify(file));
  })
  form.on('end', () => {
    res.json()
  })
  form.parse(req)
}