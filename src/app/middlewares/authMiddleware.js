const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      error: "Unauthorized",
      message: 'Não autorizado'
    });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = data;

    request.userId = id;
    next();
  } catch {
    return response.status(401).json({
      error: "Unauthorized",
      message: 'Não autorizado'
    });
  }
};