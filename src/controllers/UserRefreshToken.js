const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppError");
const GenerateRefreshToken = require("../providers/GenerateRefreshToken");
const GenerateToken = require("../providers/GenerateToken");
const dayjs = require("dayjs");

const prisma = new PrismaClient();

class UserRefreshToken {
  async create(request, response) {
    const { refresh_token } = request.body;

    if (!refresh_token) {
      throw new AppError("Informe o token de autenticação.", 401);
    }
    console.log(refresh_token);
    

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { refreshToken },
    });

    if (!refreshToken) {
      throw new AppError("Refresh token não encontrado para este usuário.", 401);
    }

    const generateTokenProvider = new GenerateToken();
    const token = await generateTokenProvider.execute(refreshToken.userId);

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

    if (refreshTokenExpired) {
      await prisma.refreshToken.delete({
        where: { userId: refreshToken.userId },
      });

      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(refreshToken.userId, refreshToken);

      return response.json({ token, refreshToken: newRefreshToken });
    }

    return response.json({ token, refreshToken });
  }
}

module.exports = UserRefreshToken;