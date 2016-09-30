const jobs = {
  'harvest': require('job.harvest'),
  'demolish': require('job.demolish'),
  'expand': require('job.expand'),
  'carry': require('job.carry'),
  'pipe': require('job.pipe'),
  'claim': require('job.claim'),
  'terminate': require('job.terminate'),
  'ranger': require('job.ranger'),
  'build': require('job.build'),
  'reserve': require('job.reserve'),
  'upgrade': require('job.upgrade')
}

const handleTower = (room, level, label) => {
  if (room.controller.level <= level) {
    return
  }

  const flag = Game.flags[room.name + label]
  if (!flag) {
    return
  }

  let tower
  if (flag.memory.tower) {
    tower = Game.getObjectById(flag.memory.tower)
  }

  if (!tower) {
    const towers = flag.pos.findInRange(FIND_STRUCTURES, 0)
    if (towers.length === 0) {
      room.createConstructionSite(flag, STRUCTURE_TOWER)
      return
    }

    tower = towers[0]
    flag.memory.tower = tower.id
  }

  var closestHostile = flag.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  if (closestHostile) {
    tower.attack(closestHostile)
    return
  }

  if (Game.time % 13) {
    var closestDamagedCreep = flag.pos.findClosestByRange(FIND_MY_CREEPS, {filter: creep => creep.hits < creep.hitMax})
    if (closestDamagedCreep) {
      tower.heal(closestDamagedCreep)
      return
    }
  }
}

exports.loop = () => {
  console.log(`<span style="color: hotpink">GCL: ${Game.gcl.level} ${Math.floor(Game.gcl.progress * 100 / Game.gcl.progressTotal)}%</span> Tick: ${Game.time} <span style="color: #82a1d6">Bucket: ${Game.cpu.bucket}</span>`)
  _.each(Game.rooms, room => {
    // console.log(`${room.name} start`)
    // Only rooms with controllers manage jobs
    if (!room.controller || !room.controller.my) {
      // console.log(`${room.name} skipped (not my own)`)
      return
    }

    handleTower(room, 3, 'Tower1')
    handleTower(room, 5, 'Tower2')
    handleTower(room, 7, 'Tower3')
    handleTower(room, 8, 'Tower4')
    handleTower(room, 8, 'Tower5')
    handleTower(room, 8, 'Tower6')
  })

  if (Game.cpu.bucket < 30) {
    return
  }

  _.each(Memory.links, link => {
    const source = Game.getObjectById(link.source)
    if (!source || !source.transferEnergy || source.energy === 0 || source.cooldown > 0) {
      return
    }

    const target = Game.getObjectById(link.target)
    if (!target || !target.transferEnergy || target.energy === target.energyCapacity) {
      return
    }

    source.transferEnergy(target)
  })

  _.each(Game.creeps, creep => {
    try {
      // console.log(`${creep.name} is ${creep.memory.job.type}ing`)
      jobs[creep.memory.job.type].execute(creep, creep.memory.job)
    } catch (e) {
      console.log(creep.name, creep.memory.job.type, e)
    }
  })

  // if (Game.time % 10 !== 0 || Game.cpu.bucket < 100) {
  //   // console.log(`${room.name} skipped (delay)`)
  //   return
  // }

  _.each(Game.rooms, room => {
    // console.log(`${room.name} start`)
    // Only rooms with controllers manage jobs
    if (!room.controller || !room.controller.my) {
      // console.log(`${room.name} skipped (not my own)`)
      return
    }

    // if (room.controller.level >= 4 && typeof room.storage === 'undefined') {
    //   room.createConstructionSite(Game.flags[room.name + 'Storage'], STRUCTURE_STORAGE)
    // }

    room.memory.jobs = room.memory.jobs || []
    console.log(`${room.name} checking jobs (${room.memory.jobs.length})`)
    let wait = false
    _.each(room.memory.jobs, (job, id) => {
      try {
        if (wait) {
          return
        }

        if (job.creep && Game.creeps[job.creep]) {
          // console.log(`#${id} ${job.creep} is ${job.type}ing`)
          return
        }

        if (job.flag && !Game.flags[job.flag]) {
          console.log(`#${id} flag is missing for ${job.type}ing`)
          return
        }

        console.log(`#${id} will spawn ${job.type}er next`)
        const body = jobs[job.type].getCreepBody(room, job)
        // console.log(body)
        const spawn = Game.spawns[room.name + 'Spawn1']

        if (!spawn) {
          return
        }

        if (spawn.canCreateCreep(body) !== OK) {
          wait = true
          // console.log(id, 'cannot create creep, yet')
          return
        }

        var creepName = spawn.createCreep(
          jobs[job.type].getCreepBody(room, job),
          null,
          {job: job}
        )

        if (_.isString(creepName)) {
          job.creep = creepName
        }

        wait = true
      } catch (e) {
        console.log(id, job.type, e)
      }
    })

    // if (Game.time % 100 !== 0) {
    //   console.log(`${room.name} skipped (delay)`)
    //   return
    // }

    // for (let i = 1; i <= CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level]; i++) {
    //   if (Game.flags[room.name + 'Extension' + i]) {
    //     room.createConstructionSite(Game.flags[room.name + 'Extension' + i], STRUCTURE_EXTENSION)
    //   } else {
    //     console.log('Flag is missing', room.name + 'Extension' + i)
    //   }
    // }
  })
}
