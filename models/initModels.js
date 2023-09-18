const Dogs = require('./dogs.models');
const SubBreed = require('./subBreed.models');

const initModel = () => {
  Dogs.belongsToMany(SubBreed, { through: 'DogsSubBreeds' });
  SubBreed.belongsToMany(Dogs, { through: 'DogsSubBreeds' });
};

module.exports = initModel;
