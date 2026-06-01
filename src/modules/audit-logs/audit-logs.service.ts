import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditLogsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createLog(
        data: {
            userId?: bigint;
            action: string;
            entityType?: string;
            entityId?: bigint;
            metadata?: any;
            ipAddress?: string;
        },
    ) {
        return this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                metadataJson: data.metadata,
                ipAddress: data.ipAddress,
            },
        });
    }
}
