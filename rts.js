const { userModel, emailFinder, totalclickssaver, refferalcodeFinder, reffersadder } = require('./mongoose/mongo')
const express = require('express')
const router = express.Router()
// const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const JWT_SIGNETURE = 'g7NRDSQQFWIOx1Lt1WdT3tiY7MP8oVbNVJ5nkNYLgotKe8sTl0'
// const db = require('./config/realtimeseason')
const { validationResult, body, } = require('express-validator')



router.get('/gts', async (req, res)=>{


      // for (let i = 0; i<10; i++) {


      res.json("api working)


})


router.post('/jwt_decoder', async (req, res) => {
   try {
      let cookiesigned = req.headers.cookie.split('token=')[1];
      let jwt_verify = jwt.verify(cookiesigned, JWT_SIGNETURE)
      let userdata = await userModel.findById(jwt_verify.user.user).exec()
      res.json({ name: userdata.email, clicks: userdata.clicks, reffers: userdata.reffers ,refferalcode: userdata.refferalcode , success: 'logged in' })

   } catch (error) {
      res.json({ error: "internal server error, try to re login" })
   }



})


router.post('/leaderboardgetter', async (req, res) => {
   try {


      res.json({ leaderboard: await totalclickssaver(), success: 'logged in' })

   } catch (error) {
      res.json({ error: "internal server error, try to re login" })
   }



})

router.post("/subbmitter", async (req, res) => {
   try {
      let cookiesigned = req.headers.cookie.split('token=')[1];
      let jwt_verify = jwt.verify(cookiesigned, JWT_SIGNETURE)
      let userdata = await userModel.findById(jwt_verify.user.user).exec()
      // let globaldata = await globalModel.findById("644129b8be2fb73873901ef6").exec()
      await userModel.updateOne({ _id: userdata._id }, { clicks: userdata.clicks + Number(req.body.newclicks) })
      res.json({ success: 'success' })
   } catch {

   }
})

router.post('/register',


   body('eaddress').not().isEmpty().withMessage("enter email")
      .isEmail().withMessage('not a valid email'),





   async (req, res) => {


      const errors = validationResult(req);

      if (!errors.isEmpty()) {

         for (var i = 0; i < 1; i++) {

            return res.status(400).json({ errors: errors.array()[i] });
            // res.send(errors.array().[i])

         }
      } else {

         try {
            const result = await emailFinder(req.body.eaddress)

            if (result === true) {
               const user = (await userModel.find({ email: req.body.eaddress }).exec()).pop()

               const data = {
                  user: {
                     user: user.id
                  }
               }
               const authtoken = jwt.sign(data, JWT_SIGNETURE)

               res.cookie('token', authtoken, { expires: new Date(Date.now() + 86400000), secure: true })
               res.json({ success: 'loggedin' });
            } else {

               const refferedby = await reffersadder(req.body.refferedby)


               const refferalcode = await Math.floor(Math.random() * 900000) + 100000

               const refferdata = await refferalcodeFinder(refferalcode + req.body.eaddress.slice(0, 3))

               const user = userModel({
                  email: req.body.eaddress,
                  clicks: 0,
                  refferalcode: refferdata,
                  reffers: 0,
                  refferedby: refferedby
               })

               user.save()

               const data = {
                  user: {
                     user: user.id
                  }
               }
               const authtoken = jwt.sign(data, JWT_SIGNETURE)

               res.cookie('token', authtoken, { expires: new Date(Date.now() + 86400000), secure: true })
               res.json({ success: 'loggedin' });

               res.json({ success: "new user created" })


            }


         } catch (error) {

         }








      }
   })










// router.post('/login',
//    // username must be an email
//    body('username').not().isEmpty().withMessage("username or password is empty").custom(async (value, { req }) => {

//       if (await nameFinder(value) === false) {
//          throw new Error('name or password must be wrong')
//       }
//       return true;
//    }),
//    // password must be at least 5 chars long
//    body('password').not().isEmpty().withMessage("email or password is empty"),



//    async (req, res) => {






//       const errors = validationResult(req);

//       if (!errors.isEmpty()) {

//          for (var i = 0; i < 1; i++) {
//             return res.status(400).json({ errors: errors.array()[i] })

//          }

//       }

//       try {
//          bcrypt.compare(req.body.password, await hashFinder(req.body.username), function (err, result) {
//             if (result === true) {
//                return res.status(200).json({ success: 'logged in' })
//             } else {
//                return res.status(400).json({ error: 'email or password must be wrong' })
//             }
//          });

//       } catch (error) {
//          return error
//       }










//       // else {

//       //    return res.status(200).json({ success: "logged in" });

//       // }



//    }


// );


// router.post('/logout', (req, res) => {
//    req.session.destroy()
//    res.redirect('/login')

// })



// router.get('*', (req, res) => {
//    res.redirect('/')
// })




module.exports = router;
