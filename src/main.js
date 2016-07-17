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

exports.loop = () => {
  console.log(`Tick #${Game.time}`)

  Memory.rooms = Memory.rooms || {}
  _.each(Game.rooms, room => {
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
        if (!creep) {
          return
        }
        Game.notify(`Invaded by ${creep.owner.username} ${creep.body.join('\n')}`)
        tower.attack(creep)
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
}
