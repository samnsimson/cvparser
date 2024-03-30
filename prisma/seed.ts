import { JobType, PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";
import { faker } from "@faker-js/faker";
import moment from "moment";

class Utils {
    public getRandomJobType = (): string => {
        const jobType: string[] = ["FULL_TIME", "PART_TIME", "HYBRID", "REMOTE"];
        const randomIndex = Math.floor(Math.random() * jobType.length);
        return jobType[randomIndex] ?? "FULL_TIME";
    };
}

class Seed {
    private readonly prisma: PrismaClient;
    private readonly utils: Utils;

    constructor() {
        this.prisma = new PrismaClient();
        this.utils = new Utils();
    }

    public run = async () => {
        await this.clearTables();
        const user = await this.createUser();
        await this.createDepartment({ userId: user.id });
        const departments = await this.getDepartments();
        const jobs = departments.map((department) => this.createJobs({ departmentId: department.id, userId: user.id }));
        await Promise.all(jobs);
        return "Seed complete!";
    };

    protected getDepartments = async () => {
        return await this.prisma.department.findMany();
    };

    protected clearTables = async () => {
        const promises = [];
        promises.push(this.prisma.job.deleteMany());
        promises.push(this.prisma.department.deleteMany());
        promises.push(this.prisma.user.deleteMany());
        promises.push(this.prisma.profile.deleteMany());
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
            },
        });
    };

    protected createDepartment = async ({ userId }: { userId: string }) => {
        return await this.prisma.department.createMany({
            data: Array.from({ length: 5 }, () => ({ title: faker.person.jobTitle(), description: faker.person.jobDescriptor(), createdById: userId })),
        });
    };

    protected createJobs = async ({ userId, departmentId }: { departmentId: string; userId: string }) => {
        return await this.prisma.job.createMany({
            data: Array.from({ length: 2 }, () => ({
                title: faker.person.jobTitle(),
                description: faker.lorem.paragraph(),
                jobType: this.utils.getRandomJobType() as JobType,
                location: faker.location.country(),
                shiftType: "DAY",
                expiryDate: moment().add(1, "M").format(),
                departmentId: departmentId,
                createdById: userId,
            })),
        });
    };
}

const seed = new Seed();
seed.run().then(console.log).catch(console.log);
