const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club')
const UUID = Sequelize.UUID
const UUIDV4 = Sequelize.UUIDV4





const Member = sequelize.define('member', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
      },
    name: {
        type: Sequelize.STRING(20)
    }
});


const Facility = sequelize.define('facility', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: Sequelize.STRING(20)
    }
});

const Booking = sequelize.define('booking', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    }
});

Member.belongsTo(Member, { as: 'sponsor' });
Member.hasMany(Member, { foreignKey: 'sponsorId', as: 'sponsored' })
Booking.belongsTo(Member)
Member.hasMany(Booking)
Booking.belongsTo(Facility)
Facility.hasMany(Booking)



const express = require('express')
const app = express();

app.get('/api/facilities', async(req, res, next) => {
    try {
      const facilities = await Facility.findAll({
          include: Booking 
      }); 


     res.send(facilities)
    }
    catch (ex) {
      next(ex)
    }


}); 


app.get('/api/members', async(req, res, next) => {
   try {
     const members = await Member.findAll({
       include: [
          { model: Member, as: 'sponsor'},
          { model: Member, as: 'sponsored'} 
       ]
     })
     res.send(members)
   }
   catch (ex) {
     next(ex)
   }
})




const init = async() => {
   await sequelize.sync({force:true})
   const lucy = await Member.create({ name: 'lucy'})
   const moe = await Member.create({ name: 'moe', sponsorId: lucy.id })
   const ethyl = await Member.create({ name: 'ethyl', sponsorId: moe.id})
   const larry = await Member.create({ name: 'larry', sponsorId: lucy.id})
  
   const tennis = await Facility.create({ name: 'tennis' })
   const ping = await Facility.create({ name: 'ping pong'})
   const marbles = await Facility.create({ name: 'marbles'})

   await Booking.create({ memberId: lucy.id, facilityId: marbles.id })
   await Booking.create({ memberId: lucy.id, facilityId: marbles.id })
   await Booking.create({ memberId: moe.id, facilityId: tennis.id })

   const port = process.env.PORT || 3000
   app.listen(port, ()=> console.log(`App listening on port ${port}`))

  console.log('connected!')
}
init();



