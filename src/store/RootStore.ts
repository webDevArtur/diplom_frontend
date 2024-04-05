import AuthStore from './AuthStore';
import PatientStore from './PatientStore';
import DiagnosisStore from './DiagnosisStore';
import ImageStore from './ImageStore';

class RootStore {
    authStore: AuthStore;
    patientStore: PatientStore;
    diagnosisStore: DiagnosisStore;
    imageStore: ImageStore; // Добавляем поле для ImageStore

    constructor() {
        this.authStore = new AuthStore();
        this.patientStore = new PatientStore(this.authStore);
        this.diagnosisStore = new DiagnosisStore(this.authStore);
        this.imageStore = new ImageStore(); // Инициализируем ImageStore
    }
}

const rootStore = new RootStore();

export default rootStore;
