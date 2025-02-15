const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ItemController {
  async index(request, response) {
    const { group } = request.params;

    const items = await prisma.item.findMany({
      where: { group },
      orderBy: { name: 'asc' },
    });

    return response.json(items);
  }

  async show(request, response) {
    const { id } = request.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    return response.json(item);
  }

  async create(request, response) {
    const { name, group, series, repetitions, location } = request.body;
  
    const item = await prisma.item.create({
      data: {
        name,
        group,
        series,
        repetitions,
        location,
      },
    });
  
    return response.status(201).send(item);
  }
  
  async delete(request, response) {
    const { id } = request.params;
  
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });
  
    return response.send();
  }

  async update(request, response) {
    const { id } = request.params;
    const { group, series, repetitions } = request.body;
    
    await prisma.item.update({
      where: { id: parseInt(id) },
      data: { group, series, repetitions },
    });

    return response.send();
  }
}

module.exports = ItemController;