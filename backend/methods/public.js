const crypto = require('crypto')
module.exports = {
  md5: (password) => {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
  },
  checkString: function (string) {
    return !(string === undefined || string.toString() === '')
  },
  getObjectId: async function (Model, name) {
    if (!this.checkString(name)) {
      return 'Name Error'
    }
    const objects = await Model.findAll({
      where: {
        username: name.toString()
      }
    })
    if (objects.length !== 0) {
      return objects[0].id
    } else {
      return ''
    }
  }
}
