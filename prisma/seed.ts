import { PrismaClient, ContentStatus, LessonKind, TrackLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const track = await prisma.track.upsert({
    where: { slug: "gestao-da-renda" },
    update: {
      title: "Gestão da renda",
      description: "Organize o fluxo, proteja sua base e encontre um aporte sustentável.",
      level: TrackLevel.BEGINNER,
      category: "Fundamentos",
      status: ContentStatus.PUBLISHED,
      position: 1,
    },
    create: {
      slug: "gestao-da-renda",
      title: "Gestão da renda",
      description: "Organize o fluxo, proteja sua base e encontre um aporte sustentável.",
      level: TrackLevel.BEGINNER,
      category: "Fundamentos",
      status: ContentStatus.PUBLISHED,
      position: 1,
    },
  });

  const lessonModule = await prisma.module.upsert({
    where: { trackId_position: { trackId: track.id, position: 1 } },
    update: { title: "Do fluxo ao aporte", description: "Leia o seu mês antes de escolher o próximo passo." },
    create: { trackId: track.id, title: "Do fluxo ao aporte", description: "Leia o seu mês antes de escolher o próximo passo.", position: 1 },
  });

  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: lessonModule.id, slug: "renda-liquida-ponto-de-partida" } },
    update: {
      title: "Renda líquida: o ponto de partida.",
      summary: "Aprenda a enxergar o espaço real entre o que entra e o que sai.",
      kind: LessonKind.INTERACTIVE,
      status: ContentStatus.PUBLISHED,
      durationMinutes: 8,
      position: 1,
      interactiveKey: "income-flow-v1",
      reviewedAt: new Date("2026-10-01T00:00:00.000Z"),
    },
    create: {
      moduleId: lessonModule.id,
      slug: "renda-liquida-ponto-de-partida",
      title: "Renda líquida: o ponto de partida.",
      summary: "Aprenda a enxergar o espaço real entre o que entra e o que sai.",
      kind: LessonKind.INTERACTIVE,
      status: ContentStatus.PUBLISHED,
      durationMinutes: 8,
      position: 1,
      interactiveKey: "income-flow-v1",
      reviewedAt: new Date("2026-10-01T00:00:00.000Z"),
    },
  });

  const quiz = await prisma.quiz.upsert({
    where: { id: `${lesson.id}-quiz` },
    update: { title: "Quiz: renda líquida e capacidade", passingScore: 70 },
    create: { id: `${lesson.id}-quiz`, lessonId: lesson.id, title: "Quiz: renda líquida e capacidade", passingScore: 70 },
  });

  const questions = [
    {
      position: 1,
      prompt: "Como encontrar o saldo mensal em um primeiro diagnóstico?",
      options: ["Renda líquida menos despesas totais.", "Renda bruta multiplicada pela inflação.", "Reserva atual dividida pelo número de meses."],
      correctOption: 0,
      explanation: "O saldo mensal é uma fotografia do fluxo: tudo o que entra menos tudo o que sai no período.",
    },
    {
      position: 2,
      prompt: "Ao lidar com uma renda que varia, qual premissa é mais prudente para começar?",
      options: ["Usar o melhor mês do último ano.", "Usar uma média conservadora e revisar com frequência.", "Ignorar a renda variável até ela ficar estável."],
      correctOption: 1,
      explanation: "Uma média conservadora reduz o risco de assumir um compromisso que depende de um mês fora do padrão.",
    },
    {
      position: 3,
      prompt: "O que o resultado do simulador representa?",
      options: ["Uma indicação personalizada de qual ativo comprar.", "Uma previsão de rentabilidade para os próximos anos.", "Uma relação matemática entre as premissas informadas."],
      correctOption: 2,
      explanation: "O simulador organiza relações matemáticas e não indica ativos ou retornos futuros.",
    },
  ];

  for (const question of questions) {
    await prisma.quizQuestion.upsert({
      where: { quizId_position: { quizId: quiz.id, position: question.position } },
      update: question,
      create: { quizId: quiz.id, ...question },
    });
  }

  console.log(`Seed concluído: ${track.slug} -> ${lesson.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
