var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

function spawn(role, count) {
  var existingRoles = _.filter(Game.creeps, (creep) => creep.memory.role === role);
  if (existingRoles.length >= count) {
    return;
  }

  if (role === 'claimer') {
    Game.spawns.Hearth.createCreep([CLAIM, MOVE], '', {role: role});
    return;
  }

  if (Game.spawns.Hearth.canCreateCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE]) === OK) {
    Game.spawns.Hearth.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], '', {role: role});
    return;
  }

  Game.spawns.Hearth.createCreep([WORK, CARRY, MOVE], '', {role: role});
}

exports.loop = function () {
  // spawn('claimer', 1);
  spawn('builder', 2);
  spawn('upgrader', 3);
  spawn('harvester', 3);

  var tower = Game.getObjectById('TOWER_ID');
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
  })
    ;
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    }
  }
};