const asyncHandler = require( 'express-async-handler' );
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const factory = require( './handlersFactory' );
const Product = require( '../models/productModel' );
const { uploadsMixOfImages } = require('../middlewares/uploadImageMiddleware');
const { populate } = require( '../models/categoryModel' );


exports.uploadProductImages = uploadsMixOfImages( [ {
    name: 'imageCover',
    maxCount: 1
    },
    {
    name: 'images',
    maxCount: 4
    }
] );

exports.resizeProductImages = asyncHandler( async ( req, res, next ) => {
    // 1- image processing for cover image 
    if ( req.files.imageCover )
    {
        const imageCoverFileName = `product-${ uuidv4() }-${ Date.now() }-cover.jpeg`;
        await sharp( req.files.imageCover[ 0 ].buffer )
            .resize( 2000, 1333 )
            .toFormat( 'jpeg' )
            .jpeg({quality: 95})
            .toFile( `uploads/products/${ imageCoverFileName }` );
        
        // save image into our db
    req.body.imageCover = imageCoverFileName;
    }

    // 2- image processing for images
    if ( req.files.images )
    {
        req.body.images = [];
        await Promise.all(
            req.files.images.map( async ( img, index ) => {
                const imageName = `product-${ uuidv4() }-${ Date.now() }-${ index + 1 }.jpeg`;

                await sharp( img.buffer )
                    .resize( 600, 600 )
                    .toFormat( 'jpeg' )
                    .jpeg( { quality: 95 } )
                    .toFile( `uploads/products/${ imageName }` );
                
                // save image into our db
            req.body.images.push( imageName );
            } )
        );
        next();
    }
})

// @desc    get product
// @route   GET /api/v1/products
// @access  public
exports.getProducts = factory.getAll( Product, 'Products' );

// @desc    get specific product by id
// @route   GET /api/v1/products/:id
// @access  public
exports.getProduct = factory.getOne( Product, 'reviews' );

// @desc    Create product
// @route   POST /api/v1/products
// @access  private
exports.createProduct = factory.createOne( Product );


// @desc    update specific product by id
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne( Product );


// @desc    delete specific product by id
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne( Product );