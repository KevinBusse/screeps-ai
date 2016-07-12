global.SUCCESS = 'SUCCESS'
global.FAILURE = 'FAILURE'
global.RUNNING = 'RUNNING'

require('creep.actions')
require('room.actions')

const tick = (tree, room, memory) => {
  memory.trees = memory.trees || {}
  memory.trees[tree.id] = memory.trees[tree.id] || {}

  var context = {actor: room, memory: memory, tree: tree}
  tree.root.execute(context)
}

exports.loop = () => {
  console.log(Game.time)

  Memory.rooms = Memory.rooms || {}
  _.each(Game.rooms, room => {
    var memory = Memory.rooms[room.name] = Memory.rooms[room.name] || {behavior: 'basic'}
    try {
      var tree = require(`room.behavior.${memory.behavior}`)
      tick(tree, room, memory)
    } catch (err) {
      console.log(err)
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
      console.log(err)
    }
  })
}
