const crypto = require('crypto')
module.exports = {
  md5: (password) => {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
  },
  checkString: function (string) {
    return !(typeof (string) === 'undefined' || string.toString() === '')
  },
  getObjectId: async function (Model, name) {
    if (!this.checkString(name)) {
      return 'Name Error'
    }
    Model.findAll({
      where: {
        name: name.toString()
      }
    }).then(data => {
      if (data.length !== 0) {
        return data[0].id.toString()
      } else {
        return ''
      }
    })
  }
}
