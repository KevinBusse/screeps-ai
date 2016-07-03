var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');

var roleDigger = require('role.digger');
var roleCarrier = require('role.carrier');
var roleSoldier = require('role.soldier');
var roleArtillery = require('role.artillery');

var creepKeeper = require('creepKeeper');
var structureKeeper = require('structureKeeper');
var stats = require('roomStats');

function spawn(role, count) {

  var existingRoles = _.filter(Game.creeps, (creep) => creep.memory.role === role);
  var primarySpawn = Game.spawns[Object.keys(Game.spawns)[0]];
  if (existingRoles.length >= count) {

    return;
  }


  switch (role) {
    case 'digger':
      roleDigger.spawn(count);
      break;
    case 'carrier':
      roleCarrier.spawn(count);
      break;
    case 'soldier':
      roleSoldier.spawn(count);
      break;
    case 'artillery':
      roleArtillery.spawn(count);

      break;
    case 'claimer':
      primarySpawn.createCreep([CLAIM, MOVE, MOVE, MOVE, TOUGH], '', {role: role});
      break;

    default:
      if (primarySpawn.canCreateCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]) === OK) {
        primarySpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], '', {role: role});
        return;
      }

      primarySpawn.createCreep([WORK, WORK, CARRY, MOVE], '', {role: role});

  }
}

exports.loop = function () {
  spawn('digger', 4);
  spawn('carrier', 4);

  if (Game.gcl.level > 1) {
    spawn('claimer', 1);
  }
  spawn('builder', 1);
  spawn('upgrader', 5);
  spawn('harvester', 2);

  stats.status();
  structureKeeper.run();


  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creepKeeper.recycle(creep)) {
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
    if (creep.memory.role === 'claimer') {
      roleClaimer.run(creep);
    }
    if (creep.memory.role === 'digger') {
      roleDigger.run(creep);
    }
    if (creep.memory.role === 'carrier') {
      roleCarrier.run(creep);
    }
    if (creep.memory.role === 'soldier') {
      roleSoldier.run(creep);
    }
    if (creep.memory.role === 'artillery') {
      roleArtillery.run(creep);
    }

  }
};