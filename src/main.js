const filterHostile = require('filter.hostile')

global.SUCCESS = 'SUCCESS'
global.FAILURE = 'FAILURE'
global.RUNNING = 'RUNNING'

const tick = (tree, actor, memory) => {
  memory.trees = memory.trees || {}
  memory.trees[tree.id] = memory.trees[tree.id] || {isOpen: {}, nodes: {}}

  Memory.trees = Memory.trees || {}
  Memory.trees[tree.id] = Memory.trees[tree.id] || {nodes: {}}

  tree.root.execute({
    actor: actor,
    memory: memory,
    treeMemory: memory.trees[tree.id],
    globalTreeMemory: Memory.trees[tree.id],
    tree: tree
  })
}

const log = function (...args) {
  if (Memory.debug !== true) {
    return
  }

  console.log('<span style="color: deepskyblue">', ...args, '</span>')
}

exports.loop = () => {
  log(`Tick #${Game.time} | GCL: ${Game.gcl.level} | Next Level: ${Math.floor(Game.gcl.progress / Game.gcl.progressTotal * 100)}% }`)

  Memory.rooms = Memory.rooms || {}
  _.each(Game.rooms, room => {
    log(`${room} RCL: ${room.controller.level} | Next Level: ${Math.floor(room.controller.progress / room.controller.progressTotal * 100)}%`)
    // primitive defense
    _.each(
      room.find(
        FIND_MY_STRUCTURES,
        {filter: structure => structure.structureType === STRUCTURE_TOWER}
      ),
      tower => {
        var creep = tower.pos.findClosestByRange(
          FIND_HOSTILE_CREEPS,
          {filter: filterHostile}
        )
        if (creep) {
          Game.notify(`Invaded by ${creep.owner.username} ${creep.body.join('\n')}`)
          tower.attack(creep)
          return
        }

        if (Game.time % 100 <= 10 && tower.energy > tower.energyCapacity * 0.9) {
          var defensive = tower.room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_WALL ||
            structure.structureType === STRUCTURE_RAMPART
          })

          if (defensive.length === 0) {
            return
          }

          defensive.sort((a, b) => b.hits - a.hits)

          tower.repair(defensive[0])
        }
      }
    )

    var memory = Memory.rooms[room.name] = Memory.rooms[room.name] || {behavior: 'basic'}
    try {
      var tree = require(`room.behavior.${memory.behavior}`)
      tick(tree, room, memory)
    } catch (err) {
      Game.notify(err)
    }
  })

  _.each(Game.creeps, creep => {
    var memory = creep.memory
    if (!memory.behavior) {
      return
    }
    try {
      var tree = require(`creep.behavior.${memory.behavior}`)
      tick(tree, creep, memory)
    } catch (err) {
      Game.notify(err)
    }
  })

  // Cleanup memory
  Object.keys(Memory.creeps).forEach((creep) => {
    if (Memory.creeps.hasOwnProperty(creep) && typeof Game.creeps[creep] === 'undefined') {
      delete Memory.creeps[creep]
    }
  })
}
