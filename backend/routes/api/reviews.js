
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, SpotImage, Spot, Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
router.use(express.json());


//get all reviews owned/created by the current user ********************
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const userReviews = await Review.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: Spot,
                    attributes: {
                        exclude: ['description', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: ReviewImage,
                    attributes: {
                        exclude: ['reviewId', 'createdAt', 'updatedAt']
                    }
                }
            ]
        })
        const reviewedSpotsImage = await SpotImage.findAll({
            where: {
                preview: true
            }
        })


        let spotIds = [];
        let spotImages = []
        let userReviewsCopy = []

        for (let review of userReviews) {
            spotIds.push(review.Spot.id);
        }

        console.log(spotIds)

        for (let spotImage of reviewedSpotsImage) {
            if (spotIds.includes(spotImage.spotId)) {
                spotImages.push(spotImage)
            }
        }

        for (let review of userReviews) {
            let reviewCopy = review.toJSON();

            for (let previewImg of spotImages) {
                if (previewImg.spotId = review.Spot.id) {
                    reviewCopy.Spot.previewImage = previewImg.url;
                }
            }
            userReviewsCopy.push(reviewCopy);
        }

    // res.json(spotImages);
    return res.json({"Reviews": userReviewsCopy });
    // res.json(reviewedSpotsImage)

    } else return res.json({ user: null })
})

//add an image to a review based on the reviews's id *************************
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const { user } = req;

    const reviewForPic = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (!reviewForPic) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found"
          })
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    // return res.json(reviewImages.length)
    if (reviewImages.length >= 10) {
        res.status(403);
        return res.json({
            "message": "Maximum number of images for this resource was reached"
          })
    }

    const newReviewImage = await ReviewImage.create({ reviewId: req.params.reviewId, url })

    const newImageCopy = newReviewImage.toJSON();

    delete newImageCopy.reviewId;
    delete newImageCopy.updatedAt;
    delete newImageCopy.createdAt;

    res.status(201);
    return res.json(newImageCopy)
})

//edit a review ***********************************************************
const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({min: 1, max: 5})
      .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
  ];

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const { user } = req;

    const updatedReview = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    })

    if (!updatedReview) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found"
          })
    }

    updatedReview.set({
        review,
        stars
     });

    await updatedReview.save();

    return res.json(updatedReview);

})

//delete a review ***********************************************
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const reviewFromId = await Review.findOne({
        where: {
            id: req.params.reviewId
        },
    });

    if (!reviewFromId) {
        res.status(404);
        return res.json({
            "message": "Review couldn't be found"
          })
    }

    await reviewFromId.destroy();
    res.status(200);
    return res.json({ "message": "Successfully deleted" })

})
module.exports = router;