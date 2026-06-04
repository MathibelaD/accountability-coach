import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const coachPassword = await bcrypt.hash("coach123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  const coach = await prisma.user.upsert({
    where: { email: "coach@demo.com" },
    update: {},
    create: { name: "Coach Sarah", email: "coach@demo.com", password: coachPassword, role: "coach" },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@demo.com" },
    update: {},
    create: { name: "Alex Member", email: "member@demo.com", password: memberPassword, role: "member" },
  });

  const challenge = await prisma.challenge.create({
    data: {
      coachId: coach.id,
      title: "30-Day Flat Tummy Challenge",
      description: "Transform your body in 30 days with daily accountability",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tasks: {
        create: [
          { name: "Drink 2L water" },
          { name: "Walk 30 minutes" },
          { name: "Take supplement" },
          { name: "Exercise 20 minutes" },
          { name: "Upload progress photo" },
        ],
      },
      members: { create: { userId: member.id } },
    },
  });

  console.log("Seeded:", { coach: coach.email, member: member.email, challenge: challenge.title });
}

main().then(() => prisma.$disconnect());
