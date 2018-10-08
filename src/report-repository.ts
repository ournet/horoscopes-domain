import {
    Repository, RepositoryAccessOptions,
} from '@ournet/domain';
import { Report } from './report';

export interface ReportRepository extends Repository<Report> {
    getByTextHash(hash: string, options?: RepositoryAccessOptions<Report>): Promise<Report | null>
}
