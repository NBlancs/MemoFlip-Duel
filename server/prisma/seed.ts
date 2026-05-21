import { PrismaClient, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const player = await prisma.player.upsert({
    where: { email: 'demo@memoflip.dev' },
    update: {},
    create: {
      email: 'demo@memoflip.dev',
      displayName: 'Demo Player',
      passwordHash,
    },
  });

  const existingMatches = await prisma.matchSession.count({
    where: { playerId: player.id },
  });

  if (existingMatches === 0) {
    await prisma.matchSession.createMany({
      data: [
        {
          playerId: player.id,
          difficulty: Difficulty.EASY,
          moves: 12,
          elapsedSeconds: 32,
          gridRows: 4,
          gridCols: 4,
        },
        {
          playerId: player.id,
          difficulty: Difficulty.MEDIUM,
          moves: 26,
          elapsedSeconds: 78,
          gridRows: 6,
          gridCols: 6,
        },
      ],
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
