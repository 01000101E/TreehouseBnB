const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, ReviewImage, Spot, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrors403 } = require('../../utils/validation');
const router = express.Router();
// router.use(express.json());


//delete a spot image ***********************************************
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;

    const spotImageFromId = await SpotImage.findOne({
        where: {
            id: req.params.imageId
        },
    });

    if (!spotImageFromId) {
        res.status(404);
        return res.json({
            "message": "Spot Image couldn't be found"
          })
    }

    const spot = await Spot.findOne({
        where: {
            id: spotImageFromId.spotId
        }
    })

    if (spot.ownerId === user.id) {
        await spotImageFromId.destroy();
        res.status(200);
        return res.json({ "message": "Successfully deleted" })
    } else {
        res.status(403);
        return res.json({
            "message": "Forbidden"
          })
    }
})



module.exports = router;