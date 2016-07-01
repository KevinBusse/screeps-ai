var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var creepKeeper = require('creepKeeper');
var structureKeeper = require('structureKeeper');
var stats = require('roomStats');

function spawn(role, count) {
  var existingRoles = _.filter(Game.creeps, (creep) => creep.memory.role === role);
  var primarySpawn =  Game.spawns[Object.keys(Game.spawns)[0]];
  if (existingRoles.length >= count) {
    return;
  }

  if (role === 'claimer') {
    primarySpawn.createCreep([CLAIM, MOVE], '', {role: role});
    return;
  }



  if (primarySpawn.canCreateCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]) === OK) {
    primarySpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], '', {role: role});
    return;
  }

  primarySpawn.createCreep([WORK,WORK,WORK, CARRY, CARRY, MOVE,MOVE], '', {role: role});
}

exports.loop = function () {
  // spawn('claimer', 1);
  spawn('builder', 7);
  spawn('upgrader', 8);
  spawn('harvester', 7);

  stats.status();
  structureKeeper.run();


  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if ( creepKeeper.recycle(creep) ) {
      continue;
    }


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