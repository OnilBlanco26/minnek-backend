const { Router } = require("express");
const { findAllDogs, findDogById, createDog, updateDog, deleteDog} = require("../controllers/dogs.controllers");
const { validateIfExistDogById } = require("../middlewares/dogs.middlewares");
const { protect } = require("../middlewares/auth.middlewares");


const router = Router();

router.get('/', findAllDogs)

router.get('/:id', validateIfExistDogById,  findDogById)

// router.use(protect)

router.post('/', createDog)

router.patch('/:id', validateIfExistDogById, updateDog)

router.delete('/:id', validateIfExistDogById, deleteDog)


module.exports = {
    dogsRouter: router
}
