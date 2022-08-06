const UsersRepository = require('../repositories/UsersRepository');
const bcrypt = require('bcryptjs');

const isValidUUID = require('../utils/isValidUUID');
const capitalizeString = require('../utils/capitalizeString');

class UserController {
  async index(request, response) {
    const users = await UsersRepository.findAll();
    response.json(users);
  }

  async show(request, response) {
    const id = request.userId;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid user id',
        message: 'ID do usuário inválido'
      });
    }

    const user = await UsersRepository.findById(id);

    if (!id) {
      return response.status(400).json({
        error: 'User not found',
        message: 'Usuário não encontrado'
      });
    }

    delete user.password;

    response.json(user);
  }

  async store(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        error: 'All fields are required!',
        message: "Todos os campos são obrigatórios"
      });
    }

    const userExists = await UsersRepository.findByEmail(email);
    if (userExists) {
      return response.status(400).json({
        error: 'This e-mail is already in use',
        message: 'Esse e-mail já está sendo utilizado'
      });
    }

    const hashPassword = bcrypt.hashSync(password, 8);

    const user = await UsersRepository.create({
      name: capitalizeString(name),
      email,
      password: hashPassword
    });

    delete user.password

    response.json(user);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid user id',
        message: 'ID de usuário inválido'
      });
    }

    if (!name || !email) {
      return response.status(400).json({
        error: 'All fields are required!',
        message: 'Todos os campos são obrigatórios'
      });
    }

    const userExists = await UsersRepository.findById(id);

    if (!userExists) {
      return response.status(404).json({
        error: 'User not found',
        message: 'Usuário não encontrado'
      });
    }

    if (email) {
      const userByEmail = await UsersRepository.findByEmail(email);
      if (userByEmail && userByEmail.id !== id) {
        return response.status(400).json({
          error: 'This e-mail is already in use',
          message: 'Esse e-mail já está sendo utilizado'
        });
      }
    }

    const user = await UsersRepository.update(id, {
      name,
      email,
    });

    response.json(user);
  }

  async updatePassword(request, response) {
    const { id } = request.params;
    const { oldPassword, password } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid user id',
        message: 'ID de usuário inválido'
      });
    }

    if (!password) {
      return response.status(400).json({
        error: 'All fields are required!',
        message: 'Todos os campos são obrigatórios'
      });
    }

    const userExists = await UsersRepository.findById(id);

    if (!userExists) {
      return response.status(404).json({
        error: 'User not found',
        message: 'Usuário não encontrado'
      });
    }
    
    const passwordMatches = bcrypt.compareSync(oldPassword, userExists.password)
    if (!passwordMatches) {
      return response.status(400).json({
        error: 'The actual password its wrong',
        message: 'A senha atual está errada'
      });
    }

    const hashPassword = bcrypt.hashSync(password, 8);

    const user = await UsersRepository.updatePassword(id, {
      password: hashPassword,
    });

    delete user.password

    response.json(user);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid user id',
        message: 'ID de usuário inválido'
      });
    }

    const userExists = await UsersRepository.findById(id);

    if (!userExists) {
      return response.status(404).json({
        error: 'User not found',
        message: 'Usuário não encontrado'
      });
    }

    await UsersRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new UserController();