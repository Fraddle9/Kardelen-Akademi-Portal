const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Kişisel Gelişim" },
                { name: "Tasarım" },
                { name: "Yazılım" },
                { name: "Yabancı Dil" },
                { name: "Müzik" },
                { name: "Koçluk" },
                { name: "Sekreterlik" },
                { name: "Muhasebe" },
                { name: "Fitness" },
            ]
        });
        console.log("Database seeded successfully");
    } catch (error) {
        console.log("Error seeding database: ", error);
    } finally {
        await database.$disconnect();
    }
    
}

main();