import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    console.log('Attempting to connect to database...')
    try {
        await prisma.$connect()
        console.log('Successfully connected to database!')

        const userCount = await prisma.user.count()
        console.log(`Connection verified. Found ${userCount} users.`)

    } catch (error) {
        console.error('❌ Connection failed!')
        console.error('Error details:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
