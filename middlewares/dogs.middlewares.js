const catchAsync = require("../helpers/catchAsync");
const Dogs = require("../models/dogs.models");

const validateIfExistDogById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const dog = await Dogs.findOne({
        where: {
            id,
            status: true
        }
    })

    if (!dog) {
        return res.status(404).json({
            status: 'Error',
            message: 'Dog not found'
        })
    }

    req.dog = dog;
    next()
})

const validateIfExistDogByName = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const dog = await Dogs.findOne({
        where: {
            name
        }
    })

    if (dog) {
        return res.status(400).json({
            status: 'Error',
            message: 'Dog already exist'
        })
    }

    if (dog.status === false) {
        return res.status(400).json({
            status: 'Error',
            message: 'Dog already exist but is inactive'
        })
    }
    
    req.dog = dog;
    next()
})

module.exports = {
    validateIfExistDogById,
    validateIfExistDogByName
}