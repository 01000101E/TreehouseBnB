const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, SpotImage, ReviewImage, Spot, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { DataTypes } = require('sequelize');
// const { default: spotReducer } = require('../../../frontend/src/store/spot');
const router = express.Router();
// router.use(express.json());


//get all spots ******************************************************
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                where: {
                    preview: true
                },
                attributes: {
                    exclude: ['id', 'spotId', 'preview', 'createdAt', 'updatedAt']
                }
            }
        ]
    });

    const allSpotsCopy = [];

    allSpots.forEach(spot => {
        let starsArr = [];
        let spotCopy = spot.toJSON();

        for (let review of spot.Reviews) {
            starsArr.push(review.stars);
        }

        if (starsArr.length) {
            const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

            spotCopy.avgRating = sumStars / spot.Reviews.length;
            delete spotCopy.Reviews;
        } else {
            spotCopy.avgRating = null;
            delete spotCopy.Reviews;
        }


        spotCopy.previewImage = spot.SpotImages[0].url;
        delete spotCopy.SpotImages;

        allSpotsCopy.push(spotCopy)
    })

    res.json({ "Spots": allSpotsCopy });

})

//get all spots owned/created by the current user ********************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userSpots = await Spot.findAll({
            where: {
                ownerId: user.id
            },
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    where: {
                        preview: true
                    },
                    attributes: {
                        exclude: ['id', 'spotId', 'preview', 'createdAt', 'updatedAt']
                    }
                }
            ]
        })

        const allSpotsCopy = [];

        userSpots.forEach(spot => {
            let starsArr = [];
            let spotCopy = spot.toJSON();

            for (let review of spot.Reviews) {
                starsArr.push(review.stars);
            }

            if (starsArr.length) {
                const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

                spotCopy.avgRating = sumStars / spot.Reviews.length;
                delete spotCopy.Reviews;
            } else {
                spotCopy.avgRating = null;
                delete spotCopy.Reviews;
            }

            spotCopy.previewImage = spot.SpotImages[0].url;
            delete spotCopy.SpotImages;

            allSpotsCopy.push(spotCopy)
        })

        res.json({ "Spots": allSpotsCopy });

    } else res.json({ user: null })
})

//get details of a spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [
            {
                model: SpotImage,
                required: false
            },
            User,
            {
                model: Review,
                required: false
            }
        ]
    });

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }
    const owner = await User.findOne({
        where: {
            id: spotFromId.ownerId
        },
        attributes: {
            exclude: ['username']
        }
    })

    const spotImages = await SpotImage.findAll({
        where: {
            spotId: req.params.spotId,
        },
        attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt']
        }
    });

    const spotCopy = spotFromId.toJSON();

    spotCopy.numReviews = spotFromId.Reviews.length;

    let starsArr = [];

    for (let review of spotFromId.Reviews) {
        starRating = review.stars;
        starsArr.push(starRating);
    }

    if (starsArr.length) {
        const sumStars = starsArr.reduce((acc, curr) => acc + curr,);

        spotCopy.avgRating = sumStars / spotCopy.Reviews.length;
        delete spotCopy.Reviews;
    } else {
        spotCopy.avgRating = null;
        delete spotCopy.Reviews;
    }

    spotCopy.SpotImages = spotImages
    delete spotCopy.Images

    spotCopy.Owner = owner
    delete spotCopy.User

    return res.json(spotCopy);
})

//get all reviews from an spot's id ***********************************
router.get('/:spotId/reviews', async (req, res, next) => {

    const spotFromId = await Spot.findByPk(req.params.spotId);

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }

    const reviewsOfSpot = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
            }
        },
        {
            model: ReviewImage,
            attributes: {
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
        }]
    });


    return res.json({ Reviews: reviewsOfSpot });
})

//Get all Bookings for a Spot based on the Spot's id*************
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const { user } = req;
    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
    });

    if (!spotFromId) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        })
    }

    // console.log(spotFromId.ownerId)
    // console.log(user.id)

    if (spotFromId.ownerId !== user.id) {
        const bookingsOfSpot = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: {
                exclude: ['userId', 'createdAt', 'updatedAt']
            }
        });

        return res.json({ Bookings: bookingsOfSpot });
    }

    if (spotFromId.ownerId === user.id) {
        const bookingsOfOwner = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: {
                include: ['id']
            }
        });


        const users = await User.findAll({
            attributes: {
                exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
            }
        })

        let userIds = [];
        // let bookingUsers = [];
        let bookingsOfOwnerCopy = [];
        let finalCopy = [];

        for (let bookings of bookingsOfOwner) {
            userIds.push(bookings.userId)
        }
        // console.log(userIds)

        for (let booking of bookingsOfOwner) {
            for (let bookingUser of users) {
                if (userIds.includes(bookingUser.id)) {
                    let bookingCopy = booking.toJSON();
                    let bookingUserCopy = bookingUser.toJSON();
                    bookingCopy.User = bookingUserCopy;
                    bookingsOfOwnerCopy.push(bookingCopy)
                }
            }
        }

        for (let i = 0; i < bookingsOfOwnerCopy.length; i++) {
            if (bookingsOfOwnerCopy[i].userId === bookingsOfOwnerCopy[i].User.id) {
                finalCopy.push(bookingsOfOwnerCopy[i]);
            }
        }


        // // return res.json(bookingUsers)
        return res.json({ Bookings: finalCopy })
        // return res.json({ Bookings: bookingsOfOwnerCopy})

    }




})


//create a review from an spot's id ***********************************
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {

    const { review, stars } = req.body;
    const { user } = req;

    const spotFromId = await Spot.findByPk(req.params.spotId);

    if (!spotFromId) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        })
    }

    const spotReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId,
            userId: user.id
        }
    })

    console.log(spotReviews);

    if (spotReviews.length) {
        res.status(500);
            return res.json({
                "message": "User already has a review for this spot"
            })
    }

    // for (let review of spotReviews) {
    //     if (review.userId === user.id) {
    //         res.status(500);
    //         return res.json({
    //             "message": "User already has a review for this spot"
    //         })
    //     }
    // }

    const newReview = await Review.create({
        userId: user.id,
        spotId: Number(req.params.spotId),
        review,
        stars,
        createdAt: new Date(),
        updatedAt: new Date()
    })

    res.status(201);
    return res.json(newReview);
})

//Create a Booking from a Spot based on the Spot's id*****************
const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isDate()
        .isAfter()
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists({ checkFalsy: true }),
    check('startDate')
        .custom((endDate, { req }) => (endDate >= req.body.startDate))
        .withMessage("endDate cannot be on or before startDate"),
    handleValidationErrors
];

router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const { user } = req;

    const spotFromId = await Spot.findByPk(req.params.spotId);

    if (!spotFromId) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found"
        })
    }

    const bookingCheck = await Booking.findAll({
        where: {
            spotId: spotFromId.id
        }
    });

    // return res.json(bookingCheck)
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

        //create error object for all scenarios
        const errors = {};
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

        if (newStartDate <= existingStartDate
            && newEndDate >= existingEndDate) {
            errors.startDate = "Start date conflicts with an existing booking";
            errors.endDate = "End date conflicts with an existing booking";
        }

        if (errors.startDate || errors.endDate) {
            throw err;
        }
    }

    // console.log('User id:', user.id)
    // console.log('_____________________')
    // console.log('Owner id:', spotFromId.ownerId)

    if (spotFromId.ownerId !== user.id) {
        const newBooking = await Booking.create({
            spotId: Number(req.params.spotId),
            userId: user.id,
            startDate,
            endDate,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        res.status(201);
        const newBookingWithId = await Booking.findOne({
            where: {
                spotId: newBooking.spotId,
                userId: newBooking.userId,
                startDate: newBooking.startDate,
                endDate: newBooking.endDate
            },
            attributes: {
                include: ['id']
            }
        })
        return res.json(newBookingWithId);
    } else {
        return res.json({ message: 'Owner cannot book their own spot' })
    }
})

//create a spot ******************************************************
//NOTE, might need to switch to express validators to get a 400 error code
const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

router.post('/', requireAuth, validateSpot,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const { user } = req;

        let userId;

        if (user) {
            userId = user.id;
        }
        const spot = await Spot.create({ ownerId: userId, address, city, state, country, lat, lng, name, description, price });

        res.status(201);
        return res.json(spot)
    }
)

//add an image to a spot based on the spot's id *************************
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const { user } = req;

    const spotForPic = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spotForPic) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }

    if (spotForPic.ownerId === user.id) {
        const newSpotImage = await SpotImage.create({ spotId: req.params.spotId, url, preview })

        newImageCopy = newSpotImage.toJSON();
        delete newImageCopy.spotId;
        delete newImageCopy.updatedAt;
        delete newImageCopy.createdAt;

        res.status(201);
        return res.json(newImageCopy)
    } else {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }

})

//edit a spot ***********************************************************
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;

    console.log('backend test ---- ', user, address)
    const updatedSpot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })

    if (!updatedSpot) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }


    if (updatedSpot.ownerId === user.id) {
        updatedSpot.set({ address, city, state, country, lat, lng, name, description, price });

        await updatedSpot.save();

        return res.json(updatedSpot);
    } else {
        res.status(403);
        return res.json({
            "message": "Forbidden"
        })
    }

})

//delete a spot ***********************************************
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;

    const spotFromId = await Spot.findOne({
        where: {
            id: req.params.spotId,
        },
    });

    if (!spotFromId) {
        res.status(404);
        res.json({
            "message": "Spot couldn't be found"
        })
    }

    if (spotFromId.ownerId === user.id) {
        await spotFromId.destroy();
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