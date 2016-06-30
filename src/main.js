var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')

function spawner (role, count) {
  var existingRoles = _.filter(Game.creeps, (creep) => creep.memory.role === role)
  if (existingRoles.length >= count) {
    return
  }

  var spawn = Game.spawns.Hearth

  if (role === 'claimer') {
    spawn.createCreep([CLAIM, MOVE], '', {role: role})
    return
  }

  if (spawn.canCreateCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE]) === OK) {
    spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], '', {role: role})
    return
  }

  spawn.createCreep([WORK, CARRY, MOVE], '', {role: role})
}

exports.loop = function () {
  // spawn('claimer', 1)
  spawner('builder', 2)
  spawner('upgrader', 3)
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

  _.each(Game.creeps, (creep) => {
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep)
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep)
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep)
    }
  })
}
