var roles = require('roles')

function spawner (role, count) {
  var existingRoles = _.filter(Game.creeps, (creep) => creep.memory.role === role)
  if (existingRoles.length >= count) {
    return
  }

  var spawn = Game.spawns.Hearth

  var basicBody = [WORK, CARRY, MOVE]
  var body = []

  while (spawn.canCreateCreep(body.concat(basicBody))) {
    body = body.concat(basicBody)
  }

  spawn.createCreep(body, '', {role: role})
}

exports.loop = function () {
  // spawn('claimer', 1)
  spawner('builder', 2)
  spawner('upgrader', 4)
  spawner('harvester', 2)

  // TODO: extract tower logic
  // var tower = Game.getObjectById('TOWER_ID')
  // if (tower) {
  //   var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //     filter: (structure) => structure.hits < structure.hitsMax
  //   })
  //   if (closestDamagedStructure) {
  //     tower.repair(closestDamagedStructure)
  //   }
  //
  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  //   if (closestHostile) {
  //     tower.attack(closestHostile)
  //   }
  // }

  _.each(Game.creeps, (creep) => roles[creep.memory.role](creep))
}
