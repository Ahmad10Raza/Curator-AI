import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const topics = [
        {
            name: 'JavaScript Basics',
            category: 'Frontend',
            description: 'The core language of the web.',
            difficulty: 'BEGINNER',
        },
        {
            name: 'React Fundamentals',
            category: 'Frontend',
            description: 'A JavaScript library for building user interfaces.',
            difficulty: 'BEGINNER',
        },
        {
            name: 'Next.js App Router',
            category: 'Fullstack',
            description: 'The React Framework for the Web.',
            difficulty: 'INTERMEDIATE',
        },
        {
            name: 'TypeScript',
            category: 'Language',
            description: 'JavaScript with syntax for types.',
            difficulty: 'INTERMEDIATE',
        },
        {
            name: 'Node.js',
            category: 'Backend',
            description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
            difficulty: 'INTERMEDIATE',
        },
        {
            name: 'Prisma ORM',
            category: 'Backend',
            description: 'Next-generation Node.js and TypeScript ORM.',
            difficulty: 'INTERMEDIATE',
        },
        {
            name: 'Tailwind CSS',
            category: 'Styling',
            description: 'A utility-first CSS framework.',
            difficulty: 'BEGINNER',
        },
        {
            name: 'PostgreSQL',
            category: 'Database',
            description: 'The World\'s Most Advanced Open Source Relational Database.',
            difficulty: 'INTERMEDIATE',
        },
    ]

    for (const topic of topics) {
        await prisma.techTopic.upsert({
            where: { name: topic.name },
            update: {},
            create: topic,
        })
    }

    console.log('Seed data inserted!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
