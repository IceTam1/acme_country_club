const express = require('express')
const routes = express.Router()



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
