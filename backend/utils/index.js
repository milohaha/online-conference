const crypto = require('crypto')

module.exports = {
  md5: (pwd) => {
    const md5 = crypto.createHash('md5')
    return md5.update(pwd).digest('hex')
  }
}
