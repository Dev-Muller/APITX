const { PrismaClient } = require('@prisma/client');
const DiskStorage = require("../providers/DiskStorage");

const prisma = new PrismaClient();

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    console.log("User Avatar Update", user_id);

    const diskStorage = new DiskStorage();

    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

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