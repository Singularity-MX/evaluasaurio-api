import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {

  // =========================
  // ROLES
  // =========================

  const adminRole = await prisma.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador del sistema',
    },
  });

  const moderatorRole = await prisma.role.upsert({
    where: {
      name: 'MODERATOR',
    },
    update: {},
    create: {
      name: 'MODERATOR',
      description: 'Moderador del sistema',
    },
  });

  const publicRole = await prisma.role.upsert({
    where: {
      name: 'PUBLIC',
    },
    update: {},
    create: {
      name: 'PUBLIC',
      description: 'Usuario público',
    },
  });

  // =========================
  // PERMISSIONS
  // =========================

  const viewReports = await prisma.permission.upsert({
    where: {
      permissionKey: 'VIEW_REPORTS',
    },
    update: {},
    create: {
      permissionKey: 'VIEW_REPORTS',
      description: 'Ver reportes',
    },
  });

  const manageUsers = await prisma.permission.upsert({
    where: {
      permissionKey: 'MANAGE_USERS',
    },
    update: {},
    create: {
      permissionKey: 'MANAGE_USERS',
      description: 'Administrar usuarios',
    },
  });

  const manageEvaluations = await prisma.permission.upsert({
    where: {
      permissionKey: 'MANAGE_EVALUATIONS',
    },
    update: {},
    create: {
      permissionKey: 'MANAGE_EVALUATIONS',
      description: 'Administrar evaluaciones',
    },
  });

  // =========================
  // ROLE PERMISSIONS
  // =========================

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: viewReports.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: viewReports.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageUsers.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageUsers.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageEvaluations.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageEvaluations.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: moderatorRole.id,
        permissionId: viewReports.id,
      },
    },
    update: {},
    create: {
      roleId: moderatorRole.id,
      permissionId: viewReports.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: moderatorRole.id,
        permissionId: manageEvaluations.id,
      },
    },
    update: {},
    create: {
      roleId: moderatorRole.id,
      permissionId: manageEvaluations.id,
    },
  });

  // =========================
  // SUPERADMIN
  // =========================

  const passwordHash = await bcrypt.hash(
    process.env.SUPERADMIN_PASSWORD!,
    10,
  );

  await prisma.user.upsert({
    where: {
      email: process.env.SUPERADMIN_EMAIL!,
    },
    update: {},
    create: {
      email: process.env.SUPERADMIN_EMAIL!,
      passwordHash,
      roleId: adminRole.id,
      active: true,
    },
  });
  // =========================
// EVALUATION DIMENSIONS
// =========================

const pedagical = await prisma.evaluationDimension.upsert({
  where: { name: 'PEDAGOGICAL' },
  update: {},
  create: {
    name: 'PEDAGOGICAL',
    description: 'Dimensión pedagógica del docente',
  },
});

const human = await prisma.evaluationDimension.upsert({
  where: { name: 'HUMAN' },
  update: {},
  create: {
    name: 'HUMAN',
    description: 'Dimensión humana del docente',
  },
});

const academic = await prisma.evaluationDimension.upsert({
  where: { name: 'ACADEMIC' },
  update: {},
  create: {
    name: 'ACADEMIC',
    description: 'Dimensión académica del docente',
  },
});

const global = await prisma.evaluationDimension.upsert({
  where: { name: 'GLOBAL' },
  update: {},
  create: {
    name: 'GLOBAL',
    description: 'Evaluación global',
  },
});

// =========================
// FINAL EVALUATION QUESTIONS
// =========================

await prisma.evaluationQuestion.createMany({
  data: [
    // PEDAGOGICAL
    {
      evaluationType: 'FINAL',
      dimensionId: pedagical.id,
      questionText: 'Claridad al explicar',
      questionOrder: 1,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: pedagical.id,
      questionText: 'Dominio del tema',
      questionOrder: 2,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: pedagical.id,
      questionText: 'Organización de la materia',
      questionOrder: 3,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: pedagical.id,
      questionText: 'Resolución de dudas',
      questionOrder: 4,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: pedagical.id,
      questionText: 'Calidad de retroalimentación',
      questionOrder: 5,
      questionType: 'INTEGER',
    },

    // HUMAN
    {
      evaluationType: 'FINAL',
      dimensionId: human.id,
      questionText: 'Respeto hacia estudiantes',
      questionOrder: 6,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: human.id,
      questionText: 'Disponibilidad',
      questionOrder: 7,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: human.id,
      questionText: 'Ambiente de aprendizaje',
      questionOrder: 8,
      questionType: 'INTEGER',
    },

    // ACADEMIC
    {
      evaluationType: 'FINAL',
      dimensionId: academic.id,
      questionText: 'Nivel de exigencia',
      questionOrder: 9,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: academic.id,
      questionText: 'Coherencia entre clases y evaluaciones',
      questionOrder: 10,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: academic.id,
      questionText: 'Carga académica percibida',
      questionOrder: 11,
      questionType: 'INTEGER',
    },

    // GLOBAL
    {
      evaluationType: 'FINAL',
      dimensionId: global.id,
      questionText: 'Evaluación general',
      questionOrder: 12,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'FINAL',
      dimensionId: global.id,
      questionText: '¿Recomendarías este docente?',
      questionOrder: 13,
      questionType: 'BOOLEAN',
    },
  ],
});
await prisma.evaluationQuestion.createMany({
  data: [
    {
      evaluationType: 'MONTHLY',
      dimensionId: pedagical.id,
      questionText: 'Claridad del docente',
      questionOrder: 1,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'MONTHLY',
      dimensionId: pedagical.id,
      questionText: 'Ritmo de clase',
      questionOrder: 2,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'MONTHLY',
      dimensionId: pedagical.id,
      questionText: 'Comprensión del contenido',
      questionOrder: 3,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'MONTHLY',
      dimensionId: human.id,
      questionText: 'Ambiente de clase',
      questionOrder: 4,
      questionType: 'INTEGER',
    },
    {
      evaluationType: 'MONTHLY',
      dimensionId: global.id,
      questionText: 'Comentario opcional',
      questionOrder: 5,
      questionType: 'TEXT',
    },
  ],
});
await prisma.departmentQuestion.createMany({
  data: [
    {
      questionText: 'Tiempo de resolución',
      questionOrder: 1,
      questionType: 'INTEGER',
    },
    {
      questionText: 'Trato administrativo',
      questionOrder: 2,
      questionType: 'INTEGER',
    },
    {
      questionText: 'Transparencia',
      questionOrder: 3,
      questionType: 'INTEGER',
    },
    {
      questionText: 'Comunicación',
      questionOrder: 4,
      questionType: 'INTEGER',
    },
    {
      questionText: 'Comentario general',
      questionOrder: 5,
      questionType: 'TEXT',
    },
  ],
});
await prisma.infrastructureCategory.createMany({
  data: [
    { name: 'Limpieza' },
    { name: 'Mobiliario' },
    { name: 'Red/internet' },
    { name: 'Laboratorio' },
    { name: 'Seguridad' },
    { name: 'Iluminación' },
    { name: 'Climatización' },
    { name: 'Accesibilidad' },
    { name: 'Otros' },
  ],
  skipDuplicates: true,
});

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });