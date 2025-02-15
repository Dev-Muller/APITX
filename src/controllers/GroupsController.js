const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class GroupsController {
  async index(request, response) {
    const groups = await prisma.item.findMany({
      select: {
        group: true,
      },
      distinct: ['group'],
      orderBy: {
        group: 'asc',
      },
    });

    const formattedGroups = groups.map(item => item.group);
    
    return response.json(formattedGroups);
  }
}

module.exports = GroupsController;