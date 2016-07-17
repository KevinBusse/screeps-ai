# Screeps AI w/ Behavior Trees

**☐ todo | ☑ done | ☒ postponed**

## Creeps

### Worker Behavior ☑

This is a generic unit created to get going in an empty room, it does all the 
basic work.

* ☑ Identify sources with most energy/ticks and open access and go harvest
* ☑ Remember selected source to reduce cpu usage
* ☑ Work on construction sites
* ☑ Charge Spawn
* ☑ Charge Extension
* ☑ Upgrade Controller

### Harvester Behavior ☐

There should always be one harvester per source, which sole purpose is to empty
the source during the 300 tick refresh cycle.

* ☑ Goto dedicated source and harvest
* ☐ Step onto the container build next to source
* ☐ Repair container when container is low
* ☑ Idle

### Carrier Behavior ☐

* ☐ Collect energy / resource from energy heaps 
* ☐ Collect energy / resource from overflowing containers (next to sources) 
* ☐ bring it to possible structures, falls back to storage

### Courier Behavior ☐

This is a fast carrier intended for energy that gets dropped from defeated 
invaders.

Should be CARRY, MOVE for regular rooms and CARRY, MOVE, MOVE, MOVE, MOVE, MOVE 
for swampy rooms.

* ☐ Find energy that is farthest away from containers/roads
* ☐ Bring to closest structure that can contain energy

## Rooms

### Basic Behavior

* ☑ Spawn Worker
* ☑ Scale Workers
* ☑ Auto-Build Extensions
* ☑ Spawn Harvester
* ☐ Scale Harvesters up to 6 WORK
* ☐ Add Harvester dieing detection to create new harvester before the old one dies
* ☐ Spawn Carrier
* ☐ Auto-Build Tower
* ☐ Auto-Build Roads
* ☐ Spawn Long Range Harvester
* ☐ Spawn Long Carrier
* ☐ Auto-Start long range Harvesting
* ☐ Auto-Build Links



