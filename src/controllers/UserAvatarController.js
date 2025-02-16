const { PrismaClient } = require('@prisma/client');
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../errors/AppError");

const prisma = new PrismaClient();

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await prisma.user.update({
      where: { id: user_id },
      data: { avatar: filename }
    });

    return response.json(user);
  }
}

module.exports = UserAvatarController;