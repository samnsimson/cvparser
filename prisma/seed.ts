import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";

class Seed {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    static seed = async () => {
        const seed = new Seed();
        await seed.clearTables();
        await seed.createUser();
        return "Seed complete!";
    };

    protected clearTables = async () => {
        const promises = [];
        promises.push(this.prisma.user.deleteMany());
        promises.push(this.prisma.profile.deleteMany());
        promises.push(this.prisma.job.deleteMany());
        promises.push(this.prisma.department.deleteMany());
        promises.push(this.prisma.candidate.deleteMany());
        promises.push(this.prisma.candidatesOnJobs.deleteMany());
        promises.push(this.prisma.shortListed.deleteMany());
        promises.push(this.prisma.resume.deleteMany());
        promises.push(this.prisma.jobsAndResumes.deleteMany());
        await Promise.all(promises);
    };

    protected createUser = async () => {
        return await this.prisma.user.create({
            data: {
                name: "samnsimson",
                email: "samnsimson@gmail.com",
                phone: "9049177058",
                password: hashSync("W3lcome!", genSaltSync(10)),
                profile: {
                    create: {
                        firstName: "Sam Nishanth",
                        lastName: "Simson",
                        address: "9745 Touchton Road",
                        city: "Jacksonville",
                        state: "Florida",
                        country: "USA",
                        zipCode: "32246",
                    },
                },
                departments: {
                    createMany: {
                        data: [
                            {
                                title: "Information Technology",
                                description: "Department for Information Technology Jobs",
                            },
                            {
                                title: "Quality Assurance",
                                description: "Department for Quality Assurance Jobs",
                            },
                        ],
                    },
                },
            },
        });
    };
}

Seed.seed().then(console.log).catch(console.log);
