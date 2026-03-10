import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRM, VRMUtils, VRMExpressionPresetName } from '@pixiv/three-vrm';

export class AvatarService {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private currentVrm: VRM | null = null; // .vrm dosyaları için özel referans
    private model: THREE.Group | null = null; // .glb fallback
    private customContainer: HTMLElement;
    private morphMeshes: THREE.Mesh[] = [];
    private animationId: number = 0;
    private resizeObserver: ResizeObserver | null = null;
    private basePositionY: number = -1;
    private baseRotationY: number = 0;

    // Yerel Klasördeki Modeller (.vrm öncelikli)
    // Eğer elinde klasöre attığın bir "Avatar.vrm" dosyası varsa adını buraya girmelisin. 
    // Örnek: private FEMALE_MODEL_URL = '/models/benimki.vrm';
    private MALE_MODEL_URL = '/models/default_avatar.vrm';
    private FEMALE_MODEL_URL = '/models/default_avatar.vrm';

    constructor(container: HTMLElement) {
        this.customContainer = container;

        this.scene = new THREE.Scene();

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        // Kamerayı geçici olarak geriye (Z=3) alıyoruz ki model kadrajdan çıktıysa tamamen görelim.
        this.camera.position.set(0, 1.0, 3.0);
        this.camera.lookAt(0, 1.0, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        container.appendChild(this.renderer.domElement);

        this.setupLighting();

        // Ekran Gizliyken (display: none) oluşan 0x0 boyut hatasını önlemek için ResizeObserver
        this.resizeObserver = new ResizeObserver(() => {
            this.onWindowResize();
        });
        this.resizeObserver.observe(this.customContainer);
    }

    private setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(0, 2, 2);
        this.scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight.position.set(-2, 1, -2);
        this.scene.add(fillLight);
    }

    public async loadAvatar(gender: string) {
        // Varsa eskisini temizle
        if (this.model) {
            this.scene.remove(this.model);
            this.morphMeshes = [];
        }

        const url = gender === 'female' ? this.FEMALE_MODEL_URL : this.MALE_MODEL_URL;

        const loader = new GLTFLoader();

        // VRM Eklentisini Yükleyiciye Tanıt
        loader.register((parser) => {
            return new VRMLoaderPlugin(parser);
        });

        return new Promise<void>((resolve, reject) => {
            loader.load(
                url,
                (gltf: any) => {
                    const vrm = gltf.userData.vrm;
                    if (vrm) {
                        // .vrm Dosyası Algılandı!
                        this.currentVrm = vrm;
                        VRMUtils.removeUnnecessaryVertices(gltf.scene);
                        VRMUtils.combineSkeletons(gltf.scene);

                        this.model = vrm.scene as THREE.Group;

                        this.basePositionY = 0; // VRM modeli orjinde dursun
                        this.baseRotationY = Math.PI; // VRM modeli 180 derece dönsün

                        // Modeli yere sabitle (0 noktası)
                        this.model.position.set(0, this.basePositionY, 0);
                        this.model.rotation.y = this.baseRotationY;

                        this.scene.add(this.model);

                    } else {
                        // Normal .glb Modeli
                        this.model = gltf.scene as THREE.Group;
                        if (this.model) {
                            this.basePositionY = -1;
                            this.baseRotationY = 0;
                            this.model.position.set(0, this.basePositionY, 0);
                            this.model.rotation.y = this.baseRotationY;
                            this.scene.add(this.model);

                            this.model.traverse((child) => {
                                if ((child as THREE.Mesh).isMesh) {
                                    const mesh = child as THREE.Mesh;
                                    if (mesh.morphTargetDictionary) {
                                        this.morphMeshes.push(mesh);
                                    }
                                }
                            });
                        }
                    }

                    this.startAnimationLoop();
                    resolve();
                },
                undefined,
                (error: any) => {
                    console.error('Error loading Avatar:', error);
                    reject(error);
                }
            );
        });
    }

    // Ses seviyesini (0 ile 1 arası) ağız açıklığına uygula (Gerçek Mükemmel Lip Sync)
    public setMouthOpenness(value: number) {
        // --- 1. VRM Modeli ise Mükemmel Standart Dudak Hareketi ---
        if (this.currentVrm && this.currentVrm.expressionManager) {
            // "A" sesini kullanarak tüm ağzı sesin şiddetine göre esnetiriz
            const openness = Math.min(Math.max(value * 3.0, 0), 1);
            this.currentVrm.expressionManager.setValue(VRMExpressionPresetName.Aa, openness);
            return;
        }

        // --- 2. Normal GLB Modeli ise Manuel Arama ---
        if (this.morphMeshes.length === 0) return;
        const smoothedValue = Math.min(Math.max(value * 2.5, 0), 1);

        this.morphMeshes.forEach(mesh => {
            const dict = mesh.morphTargetDictionary;
            const inf = mesh.morphTargetInfluences;
            if (dict && inf) {
                // Yaygın ağız isimlerini dene
                if (dict['jawOpen'] !== undefined) inf[dict['jawOpen']] = smoothedValue;
                if (dict['mouthOpen'] !== undefined) inf[dict['mouthOpen']] = smoothedValue;
            }
        });
    }

    private startAnimationLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        let time = 0;
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            // Idle Animasyonu (Hafif kafa ve beden salınımı)
            if (this.model) {
                time += 0.02;
                // Hafif nefes alma efekti
                this.model.position.y = this.basePositionY + Math.sin(time) * 0.01;
                // Hafif sağa sola kafa hareketi
                this.model.rotation.y = this.baseRotationY + Math.sin(time * 0.5) * 0.05;

                // RPM/GLB için kemik okuma
                const head = this.model.getObjectByName('Head') || this.model.getObjectByName('J_Bip_C_Head'); // İkinci isim VRM kemik standardıdır
                if (head) {
                    head.rotation.x = Math.sin(time) * 0.02;
                    head.rotation.y = Math.cos(time * 0.7) * 0.03;
                }
                const spine = this.model.getObjectByName('Spine2') || this.model.getObjectByName('J_Bip_C_Spine');
                if (spine) {
                    spine.rotation.z = Math.sin(time * 0.5) * 0.01;
                }
            }

            // Göz Kırpma Algoritması (Blink)
            if (Math.random() > 0.99) {
                this.blink();
            }

            // VRM modelinin kendi fizik motoru, elbiselerin sallanmasını falan sağlar
            if (this.currentVrm) {
                this.currentVrm.update(16 / 1000); // Ortalama 60fps delta
            }

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    private blink() {
        // VRM Modeli için göz kırpma (Standart, hatasız)
        if (this.currentVrm && this.currentVrm.expressionManager) {
            let blinkValue = 1.0;
            this.currentVrm.expressionManager.setValue(VRMExpressionPresetName.Blink, blinkValue);

            // 150ms sonra gözü aç
            setTimeout(() => {
                if (this.currentVrm?.expressionManager) {
                    this.currentVrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0);
                }
            }, 150);
            return;
        }

        // GLB Modeli İçin Manuel Göz Kırpma Simülasyonu
        if (this.morphMeshes.length === 0) return;

        let blinkFrames = 0;
        const totalFrames = 10;

        const blinkInterval = setInterval(() => {
            blinkFrames++;
            let blinkValue = 0;
            if (blinkFrames <= totalFrames / 2) {
                blinkValue = blinkFrames / (totalFrames / 2); // Kapanış
            } else {
                blinkValue = 1 - ((blinkFrames - totalFrames / 2) / (totalFrames / 2)); // Açılış
            }

            this.morphMeshes.forEach(mesh => {
                const dict = mesh.morphTargetDictionary;
                const inf = mesh.morphTargetInfluences;
                if (dict && inf) {
                    if (dict['eyeBlinkLeft'] !== undefined) inf[dict['eyeBlinkLeft']] = blinkValue;
                    if (dict['eyeBlinkRight'] !== undefined) inf[dict['eyeBlinkRight']] = blinkValue;
                }
            });

            if (blinkFrames >= totalFrames) {
                clearInterval(blinkInterval);
            }
        }, 16);
    }

    private onWindowResize() {
        if (!this.customContainer || this.customContainer.clientWidth === 0 || this.customContainer.clientHeight === 0) return;
        this.camera.aspect = this.customContainer.clientWidth / this.customContainer.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.customContainer.clientWidth, this.customContainer.clientHeight);
    }

    public destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.model) this.scene.remove(this.model);
        this.renderer.dispose();
    }
}
