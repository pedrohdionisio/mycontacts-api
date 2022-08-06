const AuthRepository = require('../repositories/AuthRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async authenticate(request, response) {
    const { email, password } = request.body;

    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      return response.status(404).json({
        error: 'User not found',
        message: 'Usuário não encontrado'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response.status(401).json({
        error: 'Ivalid password',
        message: 'Senha incorreta'
      });
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });

    delete user.password;

    response.json({ user, token });
  }
}

module.exports = new AuthController();