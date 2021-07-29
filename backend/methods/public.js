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
  getObjects: async function (Model, condition) {
    if (Model === undefined || condition === undefined) {
      return {}
    }
    let objects
    try {
      Object.keys(condition).forEach(key => {
        condition[key] = condition[key].toString()
      })
      objects = await Model.findAll({
        where: condition
      })
    } catch (error) {
      return {}
    }
    return objects
  },
  getObjectId: async function (Model, condition) {
    const objects = await this.getObjects(Model, condition)
    try {
      return objects[0].id
    } catch (error) {
      return ''
    }
  }
}
