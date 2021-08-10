const timeFormat = function (dateTime) {
  const dateTimeNumber = parseInt(dateTime)
  if (dateTimeNumber < 10) {
    return '0' + dateTimeNumber.toString()
  } else {
    return dateTimeNumber.toString()
  }
}
export default {
  methods: {
    getTime (createdAt) {
      const dateTime = new Date(createdAt)
      return timeFormat(dateTime.getFullYear()) + '-' + timeFormat(dateTime.getMonth() + 1) + '-' +
              timeFormat(dateTime.getDate()) + ' ' + timeFormat(dateTime.getHours()) +
              ':' + timeFormat(dateTime.getMinutes()) +
              ':' + timeFormat(dateTime.getSeconds())
    },
    sortMemberByID (members, founderID) {
      return members.sort(function (a, b) {
        if (a.id === founderID) {
          return -1
        }
        if (b.id === founderID) {
          return 1
        }
        if (a.id < b.id) {
          return -1
        }
        return a.id > b.id ? 1 : 0
      })
    }
  }
}
