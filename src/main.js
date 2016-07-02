var rooms = require('rooms')
var roles = require('roles')

exports.loop = () => {
  rooms()
  roles()
}
