const CategoriesRepository = require('../repositories/CategoriesRepository');
const isValidUUID = require('../utils/isValidUUID');
const capitalizeString = require('../utils/capitalizeString');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    const userId = request.userId;

    const categories = await CategoriesRepository.findAll(orderBy, {
      user_id: userId,
    });
    response.json(categories);
  }

  async show(request, response) {
    const { id } = request.params;
    const userId = request.userId;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid category id',
        message: 'ID da categoria inválido'
      });
    }

    const category = await CategoriesRepository.findById(id, {
      user_id: userId,
    });

    if (!category) {
      return response.status(404).json({
        error: 'Category not found',
        message: 'Categoria não encontrada'
      });
    }

    response.json(category);
  }

  async store(request, response) {
    const { name } = request.body;
    const userId = request.userId;

    if (!name) {
      return response.status(400).json({
        error: 'Name is required',
        message: "Nome é obrigatório"
      });
    }

    const categoryExists = await CategoriesRepository.findByName(
      capitalizeString(name), {
      user_id: userId
    }
    );

    if (categoryExists) {
      return response.status(400).json({
        error: 'Category already exists',
        message: "Categoria já existe"
      });
    }

    const category = await CategoriesRepository.create(
      { name: capitalizeString(name), user_id: userId },
    );

    response.json(category);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    const userId = request.userId;


    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid category id',
        message: 'ID da categoria inválido'
      });
    }

    const categoryExists = await CategoriesRepository.findById(id, {
      user_id: userId
    });

    if (!categoryExists) {
      return response.status(404).json({
        error: 'Category not found',
        message: 'Categoria não encontrada'
      });
    }

    if (!name) {
      return response.status(400).json({
        error: 'Name is required',
        message: "Nome é obrigatório"
      });
    }

    const categoryAlreadyExists = await CategoriesRepository.findByName(
      capitalizeString(name), {
      user_id: userId
    }
    );

    if (categoryAlreadyExists) {
      return response.status(400).json({
        error: 'Category already exists',
        message: "Categoria já existe"
      });
    }

    const category = await CategoriesRepository.update(
      id,
      { name: capitalizeString(name), user_id: userId }
    );

    response.json(category);
  }

  async delete(request, response) {
    const { id } = request.params;
    const userId = request.userId;

    await CategoriesRepository.delete(id, {
      user_id: userId
    });
    response.sendStatus(204);
  }
}

module.exports = new CategoryController();