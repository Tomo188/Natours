const express = require('express');
const router = express.Router();
const toursControler = require('../controlers/toursControlers');
const authControler = require('../controlers/authController');
const reviewController = require('../controlers/reviewsControlers');
const reviewRoutes = require('../routes/reviewRoutes');
// router.param('id', toursControler.checkId);
//calback function for urls
router
  .route('/top-5-cheap')
  .get(toursControler.aliasTopTours, toursControler.getAllTours);
router.route('/tour-stats').get(toursControler.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide', 'guide'),
    toursControler.getMonthlyPlan
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursControler.getToursWithin);
router.route("/distances/:latlng/unit/:unit").get(toursControler.getDistances)
router
  .route('/')
  .post(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    toursControler.createTour
  )
  .get(toursControler.getAllTours);
router
  .route('/:id')
  .get(toursControler.getTour)
  .delete(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    toursControler.deleteTour
  )
  .patch(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    toursControler.uploadTourImages,
    toursControler.resizeTourImages,
    toursControler.updateTour
  );
router.use('/:tourId/reviews', reviewRoutes);
// router.route("/:tourId/review").post(authControler.protect,authControler.restrictTo("user"),reviewController.createReview)
module.exports = router;
