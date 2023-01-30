const express = require( 'express' );



const { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon } = require( '../services/couponService' );
const authService = require( '../services/authService' );
      

const router = express.Router();

router.use( authService.protect, authService.allowedTo('admin', 'manger') );

router.route( '/' )
    .get( getCoupons )
    .post( createCoupon );

router.route( '/:id' )
    .get( getCoupon )
    .put( updateCoupon )
    .delete( deleteCoupon )

module.exports = router