const express = require( 'express' );
const { getBrandValidator,
     createBrandValidator,
     updateBrandValidator,
     deleteBrandValidator } =
    require( '../utils/validators/brandValidator' );


const { getBrands,
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage
} = require( '../services/brandService' );
const authService = require( '../services/authService' );
      
const subCategoryRoute  = require( './subCategoryRoute' );

const router = express.Router();

router.use( '/:categoryId/subcategories', subCategoryRoute );

router.route( '/' )
    .get( getBrands )
    .post(authService.protect, authService.allowedTo('admin', 'manger'), uploadBrandImage, resizeImage ,createBrandValidator, createBrand );

router.route( '/:id' )
    .get( getBrandValidator, getBrand )
    .put(authService.protect, authService.allowedTo('admin', 'manger'), uploadBrandImage, resizeImage ,updateBrandValidator, updateBrand )
    .delete(authService.protect, authService.allowedTo('admin', 'manger'), deleteBrandValidator, deleteBrand )

module.exports = router