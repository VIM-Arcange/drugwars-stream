
var dbConnection = require('../lib/dbconn');
var player = require('./operations/player_handler')

const building_handler = {
    AddLevelToPlayerBuilding:function (player, building_id, cb) {
        dbConnection.getConnection(function (err, connection) {
            var query = `SELECT * FROM character_buildings WHERE character_id=${player.user_id}`
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(error)
                    cb(null)
                }
                else {
                    var buildings = result[0]
                    var building ={}
                    for (var i in buildings) {
                        if (i === 'building_' + building_id + '_level')
                        {
                            building.level = buildings[i]
                        }
                        else{
                            building.level = 1
                        }
                        if (i === 'building_' + building_id + '_last_update')
                        {
                            building.last_update = buildings[i]
                        }
                        else{
                            building.last_update = new Date()
                        }
                    }
                    console.log(building)  
                    var query = "SELECT * FROM buildings"
                    connection.query(query, function (err, result) {
                        if (err) {
                            console.log(error)
                            cb(null)
                        }
                        var buildings = result
                        var timer = 900;
                        var cost = 100000000;
                        if(building.level<1)
                        building.level=1
                        for (i = 0; buildings.length > i; i++) {
                            if (buildings[i].building_id === building_id) {
                                timer =  15 * (building.level * buildings[i].building_coeff)
                                var z = building.level * buildings[i].building_base_price
                                cost = (z*(level*buildings[i].building_coeff))
                            }
                        }
                        if(cost>player.drugs)
                        {
                            connection.release()
                            cb('User doesnt have enough drugs')
                        }
                        
                        if(building.last_update< new Date())
                        {
                            var d = new Date();
                            d.setSeconds(d.getSeconds() + timer);
                            console.log('brooo')
                            console.log('next update' + d)
                            var query = `UPDATE \`character\` SET drugs=-${cost} WHERE  character_id=${player.user_id}`
                            connection.query(query, function (err, result) {
                                if (err) throw err;
                                else {
                                    console.log("Updated character " + player.username + 'new drug balance : ' + drug_balance + 'new weapon balance : ' + weapon_balance)
                                    connection.release();
                                    cb(player)
                                }
                            })
                        } 
                    })
                }
            })
        })

    },
    checkForBuildingTime: function (id, level, cb) {
        dbConnection.getConnection(function (err, connection) {
            var query = "SELECT * FROM buildings"
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(error)
                    cb(null)
                }
                var buildings = result
                if(level<1)
                level=1
                for (i = 0; buildings.length > i; i++) {
                    if (buildings[i].building_id === id) {
                        connection.release()
                        cb(15 * (level * buildings[i].building_coeff))
                    }
                }
            })
        })
    },
    checkPlayerBuildingLevel: function (character_id, building_id, cb) {
       
    },
}
module.exports = building_handler;