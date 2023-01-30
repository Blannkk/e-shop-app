const express = require( 'express' );
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } =
    require( '../utils/validators/categoryValidator' );


const { getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeImage,
} = require( '../services/categoryService' );
const authService = require( '../services/authService' );

const subCategoryRoute = require( './subCategoryRoute' );

const router = express.Router();

router.use( '/:categoryId/subcategories', subCategoryRoute );

router.route( '/' )
    .get( getCategories )
    .post( authService.protect, authService.allowedTo('admin', 'manger'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory );

router.route( '/:id' )
    .get( getCategoryValidator, getCategory )
    .put(authService.protect, authService.allowedTo('admin', 'manger'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory )
    .delete( authService.protect, authService.allowedTo('admin'), deleteCategoryValidator, deleteCategory );

module.exports = router;