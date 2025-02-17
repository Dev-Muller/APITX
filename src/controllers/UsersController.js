const knex = require("../database/connection");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    const { id, password, name } = request.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.update({
      where: { id },
      data: {
        name,
        password: hashedPassword
      }
    });

    return response.json({ message: "Usuário atualizado com sucesso." });
  }
}

module.exports = UsersController;
