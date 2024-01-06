const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//REGISTER
router.post("/register", async (req, res) => {
    const { ten, email, dienThoai, username, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
    return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
    return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const existingTel = await User.findOne({ dienThoai });
    if (existingTel) {
    return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
    }

    const newUser = new User({ ten, email, dienThoai, username,
    password: CryptoJS.AES.encrypt(
        password,
        process.env.PASS_ESC
    ).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );

        if(!user) {
           return res.status(401).json("Wrong Email");
        } 
            
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_ESC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        if(originalPassword != inputPassword) {
           return res.status(401).json("Wrong Password");
        } 

        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_ESC,
            {expiresIn:"1d"}
        );
  
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err);
    }
})

//CHECK-EMAIL
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        // Email đã tồn tại trong MongoDB
        res.status(200).json({ exists: true });
      } else {
        // Email không tồn tại trong MongoDB
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//UPDATE-PASSWORD
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const Characters = '#?!@$%^&*-';
    const newPassword = randomstring.generate({
        length: 10,
        charset: 'alphabetic' + 'numeric' + Characters
    });

    await User.findOneAndUpdate({ email }, { 
        password: CryptoJS.AES.encrypt(
        newPassword,
        process.env.PASS_ESC
        ).toString() 
    })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'quangdangthai2k3@gmail.com',
          pass: process.env.PASSWORD_ESC,
        },
      });
    
      const mailOptions = {
        from: 'quangdangthai2k3@gmail.com',
        to: email,
        subject: 'ShopDunk. Password recovery',
        html: `
        <p>We welcome you to ShopDunk.</p>
        <p><strong>Your new password is:</strong> ${newPassword}</p>
        <p>Do not give this password to other users.</p>
        `,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send('Internal Server Error');
        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).json({ success: true, message: 'Password reset email sent successfully' });
        }
    });
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try{
    const user = await User.findById(req.params.id);

    if(req.body.oldPassword) {
      const isPasswordValid = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_ESC
      ).toString(CryptoJS.enc.Utf8);

      if(isPasswordValid !== req.body.oldPassword) {
        return res.status(401).json({ error: "Wrong password" });
      }
    }

    if(req.body.newPassword) {
      req.body.password = CryptoJS.AES.encrypt(
      req.body.newPassword,
      process.env.PASS_ESC
      ).toString();
    }

    if (req.body.username) {
      const existingUsername = await User.findOne({ username: req.body.username, _id: { $ne: req.params.id } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username đã tồn tại' });
      }
    }

    if (req.body.email) {
      const existingEmail = await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email đã tồn tại' });
      }
    }

    if (req.body.dienThoai) {
      const existingTel = await User.findOne({ dienThoai: req.body.dienThoai, _id: { $ne: req.params.id } });
      if (existingTel) {
        return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET USERID
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

