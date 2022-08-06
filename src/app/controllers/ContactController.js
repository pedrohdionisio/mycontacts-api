const ContactsRepository = require('../repositories/ContactsRepository');

const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const userId = request.userId;

    const contacts = await ContactsRepository.findAll(
      orderBy,
      { user_id: userId },
    );
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;
    const userId = request.userId;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid contact id',
        message: 'ID de contato inválido'
      });
    }

    const contact = await ContactsRepository.findById(id, { user_id: userId });

    if (!contact) {
      return response.status(404).json({
        error: 'Contact not found',
        message: 'Contato não encontrado'
      });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    const userId = request.userId;

    if (!name) {
      return response.status(400).json({
        error: 'Name is required',
        message: 'Nome é obrigatório'
      });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({
        error: 'Invalid category',
        message: 'Categoria inválida'
      });
    }

    if (email) {
      const contactExists = await ContactsRepository.findByEmail(email, {
        user_id: userId
      });
      if (contactExists) {
        return response.status(400).json({
          error: 'This e-mail is already in use',
          message: 'Esse e-mail já está sendo utilizado'
        });
      }
    }

    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
      user_id: userId,
    });

    response.json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const userId = request.userId;

    const {
      name, email, phone, category_id,
    } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({
        error: 'Invalid contact id',
        message: 'ID de contato inválido'
      });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({
        error: 'Invalid category',
        message: 'Categoria inválida'
      });
    }

    if (!name) {
      return response.status(400).json({
        error: 'Name is required!',
        message: 'Nome é obrigatório'
      });
    }

    const contactExists = await ContactsRepository.findById(id, {
      user_id: userId
    });

    if (!contactExists) {
      return response.status(404).json({
        error: 'Contact not found',
        message: 'Contato não encontrado'
      });
    }

    if (email) {
      const contactByEmail = await ContactsRepository.findByEmail(email, {
        user_id: userId
      });
      if (contactByEmail && contactByEmail.id !== id) {
        return response.status(400).json({
          error: 'This e-mail is already in use',
          message: 'Esse e-mail já está sendo utilizado'
        });
      }
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
      user_id: userId,
    });

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;
    const userId = request.userId;

    await ContactsRepository.delete(id, {
      user_id: userId,
    });
    response.sendStatus(204);
  }
}

module.exports = new ContactController();
