import { Module} from "@nestjs/common";
import { InstitutionService } from "src/service/institution.service";
import { FirestoreModule } from "src/firestore/firestore.module";
import { InstitutionController } from "src/controller/institution.controller";

@Module({
    imports: [FirestoreModule],
    providers: [InstitutionService],
    controllers: [InstitutionController],
})
export class InstitutionModule {}


