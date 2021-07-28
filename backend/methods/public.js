const crypto = require('crypto')
module.exports = {
  sha512: (password) => {
    if (password === undefined) {
      password = ''
    }
    const sha512 = crypto.createHash('sha512')
    return sha512.update(password).digest('hex')
  },
  checkString: function (string) {
    return !(string === undefined || string.toString() === '')
  },
  getObjectId: async function (Model, condition) {
    if (Model === undefined || condition === undefined) {
      return ''
    }
    Object.keys(condition).forEach(key => {
      if (!this.checkString(condition[key])) {
        return ''
      }
    })
    const objects = await Model.findAll({
      where: condition
    })
    if (objects.length !== 0) {
      return objects[0].id
    } else {
      return ''
    }
  }
}
