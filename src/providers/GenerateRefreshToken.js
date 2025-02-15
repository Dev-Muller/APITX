const { PrismaClient } = require('@prisma/client');
const dayjs = require("dayjs");
const uuid = require('uuid');
const { user } = require('../database/prisma');

const prisma = new PrismaClient();

class GenerateRefreshToken {
  async execute(userId) {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });

    const expiresIn = dayjs().add(15, "m").unix();
    
    const refreshToken = uuid.v4();
    
    await prisma.refreshToken.create({
      data: {
        userId,
        expiresIn,
        refreshToken
      }
    });

    return refreshToken;
  }
}

module.exports = GenerateRefreshToken;