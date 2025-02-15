const knex = require("../database/connection");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const prisma = require('../database/prisma');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Informe todos os campos (nome, email e senha).");
    }

    const checkUserExists = await prisma.user.findUnique({
      where: { email }
    });

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return response.status(201).json(newUser);
  }

  async update(request, response) {
    const { name, password, oldPassword } = request.body;
    const user_id = 4;

    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    user.name = name ?? user.name;

    if (password && !oldPassword) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha.",
      );
    }

    if (!password && oldPassword) {
      throw new AppError(
        "Informe a nova senha.",
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await prisma.user.update({
      where: { id: user_id },
      data: user
    });

    return response.json();
  }
}

module.exports = UsersController;