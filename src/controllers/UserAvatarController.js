const { PrismaClient } = require('@prisma/client');
const DiskStorage = require("../providers/DiskStorage");

const prisma = new PrismaClient();

class UserAvatarController {
  async update(request, response) {
    const file = request.file;
    const { id } = request.params;

    const diskStorage = new DiskStorage();

    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(file.path);
    console.log(filename);
    
    user.avatar = filename;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { avatar: filename }
    });

    return response.json(user);
  }
}

module.exports = UserAvatarController;
