const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, ReviewImage, Spot, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrors403 } = require('../../utils/validation');
const router = express.Router();
// router.use(express.json());

//Get all Current User's Bookings ***********************************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userBookings = await Booking.findAll({
            where: {
                userId: user.id
            },
            attributes: {
                include: ['id']
            },
        })

        const allSpots = await Spot.findAll({
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: SpotImage,
                    attributes: {
                        exclude: ['id', 'spotId', 'preview', 'createdAt', 'updatedAt']
                    }
                }
            ]
        });

        let spotIds = [];
        let bookedSpots = [];
        let userBookingsCopy = [];

        for (let booking of userBookings) {
            spotIds.push(booking.spotId)
        }

        // console.log(spotIds);

        for (let spot of allSpots) {
            if (spotIds.includes(spot.id)) {
                bookedSpots.push(spot)
            }
        }

        for (let booking of userBookings) {
            let bookingCopy = booking.toJSON();

            for (let spot of bookedSpots) {
                let spotCopy = spot.toJSON();

                if (spot.id = booking.spotId) {
                    const { url } = spotCopy.SpotImages[0]
                    spotCopy.previewImage = url;
                }
                delete spotCopy.SpotImages;
                bookingCopy.Spot = spotCopy;
            }

            userBookingsCopy.push(bookingCopy);
        }


        return res.json({ Bookings: userBookingsCopy});

    } else return res.json({ user: null})

})

//Edit a Booking ********************************************************************
const validateBooking = [
    check('endDate')
    .exists({ checkFalsy: true })
    .isDate()
    .isAfter()
    .withMessage("Past bookings can't be modified"),
    handleValidationErrors403,
    check('startDate')
    .custom((endDate, { req }) => (endDate >= req.body.startDate))
    .withMessage("endDate cannot be on or before startDate"),
    check('startDate')
    .exists({ checkFalsy: true })
    .isDate()
    .isAfter()
    .withMessage('startDate cannot be in the past'),
    handleValidationErrors
];

router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
    const { startDate, endDate} = req.body;
    const { user } = req;

    const bookingFromId = await Booking.findOne({
        where: {
            id: req.params.bookingId
        }
    });


    if (!bookingFromId) {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found"
        })
    }

    const bookingCheck = await Booking.findAll({
        where: {
            spotId: bookingFromId.spotId
        }
    });

    for (let booking of bookingCheck) {
        // console.log('new booking start date:', Date.parse(startDate))
        // console.log(typeof startDate)
        // console.log('_____________________')
        // console.log('existing booking start date:', Date.parse(booking.startDate))
        // console.log(typeof booking.startDate)

        const newStartDate = Date.parse(startDate);
        const newEndDate = Date.parse(endDate);
        const existingStartDate = Date.parse(booking.startDate);
        const existingEndDate = Date.parse(booking.endDate);

        const errors =  {};
        const err = Error("Sorry, this spot is already booked for the specified dates");
        err.errors = errors;
        err.status = 403;
        err.title = "Bad request.";


        if (newStartDate >= existingStartDate
            && newStartDate <= existingEndDate) {
                errors.startDate = "Start date conflicts with an existing booking";
            }

        if (newEndDate >= existingStartDate
            && newEndDate <= existingEndDate) {
            errors.endDate = "End date conflicts with an existing booking";
        }

        if (errors.startDate || errors.endDate) {
            throw err;
        }
    }

    //     if (newStartDate >= existingStartDate
    //         && newStartDate <= existingEndDate) {
    //             res.status(403);
    //             return res.json({
    //                 message: "Sorry, this spot is already booked for the specified dates",
    //                 errors: {
    //                     startDate: "Start date conflicts with an existing booking"
    //                 }});
    //         } else if (newEndDate >= existingStartDate
    //             && newEndDate <= existingEndDate) {
    //             res.status(403);
    //             return res.json({
    //                 message: "Sorry, this spot is already booked for the specified dates",
    //                 errors: {
    //                     endDate: "End date conflicts with an existing booking"
    //                 }});
    //         }
    // }

    if (bookingFromId.userId === user.id) {
        const updatedBooking = bookingFromId.set({
            spotId: Number(req.params.spotId),
            userId: user.id,
            startDate,
            endDate,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await updatedBooking.save();

        const newBookingWithId = await Booking.findOne({
            where: {
                spotId: updatedBooking.spotId,
                userId: updatedBooking.userId,
                startDate: updatedBooking.startDate,
                endDate: updatedBooking.endDate
            },
            attributes: {
                include: ['id']
            }
        })
        return res.json(newBookingWithId);
    } else {
        return res.json({ message: 'You are not authorized to edit this booking' })
    }
})

//delete a booking ***********************************************
// const validateDeletion = [
//     check('startDate')
//     .exists({ checkFalsy: true })
//     .isDate()
//     .isAfter()
//     .withMessage("Bookings that have been started can't be deleted"),
//     handleValidationErrors403,
// ];

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { user } = req;

    const bookingFromId = await Booking.findOne({
        where: {
            id: req.params.bookingId
        },
        attributes: {
            include: ['id']
        }
    });

    // await bookingFromId.destroy();
    //     res.status(200);
    //     return res.json({ "message": "Successfully deleted" })

    // const bookingFromPk = await Booking.findByPk(req.params.bookingId, {
    //     attributes: {
    //         include: ['id']
    //     }
    // })
    // return res.json(bookingFromId)

    // return res.json(bookingFromPk)

    // const startDate = bookingFromId.startDate;
    // return res.json(startDate)

    if (!bookingFromId) {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found"
          })
    }

    const spot = await Spot.findOne({
        where: {
            id: bookingFromId.spotId
        }
    })

    if (bookingFromId.userId === user.id || spot.ownerId === user.id) {
        await bookingFromId.destroy();
        res.status(200);
        return res.json({ "message": "Successfully deleted" })
    } else {
        return res.json({ message: 'You are not authorized to delete this booking' })
    }
})

module.exports = router;