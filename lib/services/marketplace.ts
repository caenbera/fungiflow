import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Provider {
  id: string;
  name: string; // Nombre comercial
  legalName: string; // Razón social
  nit: string;
  email: string;
  phone: string;
  city: string;
  state: string; // Departamento
  website: string;
  description?: string;
  logoUrl: string;
  coverage: string[]; // Departamentos donde despacha
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string; // Variedades, Sustratos, Equipos, Insumos, Empaques, Servicios
  subcategory: string;
  unit: string;
  presentation: string;
  weight: number;
  country: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  status: "active" | "inactive" | "draft";
  mainImage: string;
  additionalImages: string[];
  specSheetUrl?: string;
  manualUrl?: string;
  videoUrl?: string;
  catalogUrl?: string;
  price: number;
  priceDistributor?: number;
  priceWholesale?: number;
  priceVolume?: number;
  currency: "COP" | "USD" | "EUR";
  iva?: number;
  discount?: number;
  stock: number;
  minStock?: number;
  maxStock?: number;
  isAvailable: boolean;
  controlInventory: boolean;
  shippingTime?: string;
  shippingCost?: number;
  storePickup?: boolean;
  carrier?: string;
  shippingNotes?: string;
  seoKeywords: string[];
  seoSlug?: string;
  seoMetaDescription?: string;
  configVisible: boolean;
  configFeatured: boolean;
  configNew: boolean;
  configPromo: boolean;
  configRecommended: boolean;
  allowPurchase: boolean;
  allowQuotation: boolean;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  provider: Provider;
  quantity: number;
}

export interface MarketplaceOrder {
  id: string;
  orgId: string;
  items: {
    productId: string;
    productName: string;
    brand: string;
    quantity: number;
    price: number;
    providerId: string;
    providerName: string;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  department: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

// SEEDERS DATA
const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: "prov-mycogen",
    name: "MycoGen",
    legalName: "MycoGen Biotech S.A.S.",
    nit: "901.456.789-1",
    email: "contacto@mycogen.co",
    phone: "300 123 4567",
    city: "Medellín",
    state: "Antioquia",
    website: "https://mycogen.co",
    logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop",
    coverage: ["Antioquia", "Cundinamarca", "Boyacá", "Santander", "Valle"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-fungipro",
    name: "FungiPro",
    legalName: "Cultivos FungiPro S.A.S.",
    nit: "901.789.012-3",
    email: "ventas@fungipro.com",
    phone: "315 987 6543",
    city: "Bogotá",
    state: "Cundinamarca",
    website: "https://fungipro.com",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
    coverage: ["Cundinamarca", "Boyacá", "Meta", "Antioquia", "Santander"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-mushsupply",
    name: "Mush Supply",
    legalName: "Mush Supply S.A.S.",
    nit: "900.567.890-4",
    email: "soporte@mushsupply.com",
    phone: "310 456 7890",
    city: "Cali",
    state: "Valle",
    website: "https://mushsupply.com",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop",
    coverage: ["Valle", "Cauca", "Nariño", "Antioquia", "Cundinamarca"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-biofarm",
    name: "BioFarm Tech",
    legalName: "BioFarm Tech Equipos S.A.S.",
    nit: "901.234.567-8",
    email: "info@biofarmtech.com",
    phone: "318 765 4321",
    city: "Bucaramanga",
    state: "Santander",
    website: "https://biofarmtech.com",
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&h=128&fit=crop",
    coverage: ["Antioquia", "Cundinamarca", "Santander", "Boyacá", "Tolima", "Valle"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-mycosupplies",
    name: "Myco Supplies",
    legalName: "Myco Supplies de Colombia S.A.S.",
    nit: "900.890.123-5",
    email: "pedidos@mycosupplies.co",
    phone: "322 345 6789",
    city: "Manizales",
    state: "Caldas",
    website: "https://mycosupplies.co",
    logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop",
    coverage: ["Antioquia", "Cundinamarca", "Valle", "Santander", "Risaralda", "Caldas", "Quindío"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-cleanair",
    name: "CleanAir Systems",
    legalName: "Sistemas de Ventilación CleanAir S.A.S.",
    nit: "901.345.678-9",
    email: "ventas@cleanairsystems.com",
    phone: "312 456 0123",
    city: "Medellín",
    state: "Antioquia",
    website: "https://cleanairsystems.com",
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&h=128&fit=crop",
    coverage: ["Antioquia", "Cundinamarca", "Valle", "Santander", "Atlántico"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prov-weightech",
    name: "Weigh Tech",
    legalName: "Balanza Weigh Tech S.A.S.",
    nit: "900.123.456-7",
    email: "soporte@weightech.co",
    phone: "314 567 8901",
    city: "Pereira",
    state: "Risaralda",
    website: "https://weightech.co",
    logoUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&h=128&fit=crop",
    coverage: ["Risaralda", "Caldas", "Quindío", "Antioquia", "Cundinamarca", "Valle"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_PRODUCTS: MarketplaceProduct[] = [
  {
    id: "prod-orellana",
    name: "Orellana",
    brand: "MycoGen",
    sku: "MCG-OR-KG",
    category: "Variedades",
    subcategory: "Semillas",
    unit: "Kilogramo (kg)",
    presentation: "Bolsa de 1 kg",
    weight: 1,
    country: "Colombia",
    shortDescription: "Hongo comestible de alto rendimiento y excelente calidad.",
    fullDescription: "Micelio certificado para producción comercial de Pleurotus ostreatus (Orellana). Altamente vigoroso y adaptado a diversos sustratos de bagazo y viruta.",
    tags: ["Hongo", "Micelio", "Orellana"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 120000,
    currency: "COP",
    stock: 50,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-mycogen",
    configVisible: true,
    configFeatured: true,
    configNew: false,
    configPromo: false,
    configRecommended: true,
    allowPurchase: true,
    allowQuotation: true,
    seoKeywords: ["orellana", "hongo", "comestible", "micelio", "semilla"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-portabella",
    name: "Portabella Pro",
    brand: "FungiPro",
    sku: "FGP-PP-KG",
    category: "Variedades",
    subcategory: "Semillas",
    unit: "Kilogramo (kg)",
    presentation: "Bolsa de 1 kg",
    weight: 1,
    country: "Colombia",
    shortDescription: "Portabella de gran tamaño y excelente textura.",
    fullDescription: "Micelio de Agaricus bisporus (Portabella) cepa comercial de alta productividad, ideal para cultivos controlados en camas de compost.",
    tags: ["Portabella", "Semilla", "Premium"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 135000,
    currency: "COP",
    stock: 35,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-fungipro",
    configVisible: true,
    configFeatured: false,
    configNew: true,
    configPromo: false,
    configRecommended: false,
    allowPurchase: true,
    allowQuotation: true,
    seoKeywords: ["portabella", "semilla", "micelio", "hongo"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-sustrato",
    name: "Sustrato Premium",
    brand: "Mush Supply",
    sku: "MSP-SU-10KG",
    category: "Sustratos",
    subcategory: "Mezclas",
    unit: "Kilogramo (kg)",
    presentation: "Bloque de 10 kg",
    weight: 10,
    country: "Colombia",
    shortDescription: "Mezcla balanceada para un crecimiento óptimo y sostenible.",
    fullDescription: "Sustrato de alta calidad elaborado con una mezcla balanceada de materias primas seleccionadas, diseñado para promover un desarrollo saludable y uniforme del micelio y cuerpos fructíferos. Ideal para cultivos de hongos comestibles y medicinales.",
    tags: ["Sustrato", "Nutrientes", "Mezcla"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 8500,
    currency: "COP",
    stock: 1250,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-mushsupply",
    configVisible: true,
    configFeatured: true,
    configNew: false,
    configPromo: false,
    configRecommended: true,
    allowPurchase: true,
    allowQuotation: false,
    seoKeywords: ["sustrato", "bolsa", "cultivo", "tierra", "nutrientes"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-autoclave",
    name: "Autoclave Horizontal 200L",
    brand: "BioFarm Tech",
    sku: "BFT-AC-200L",
    category: "Equipos",
    subcategory: "Esterilización",
    unit: "Unidad",
    presentation: "Equipo industrial",
    weight: 180,
    country: "Colombia",
    shortDescription: "Esterilización eficiente y segura para cultivos de hongos.",
    fullDescription: "Autoclave horizontal con capacidad de 200 litros, control de temperatura digital hasta 121°C, válvula de seguridad y temporizador programable para la esterilización de sustratos y laboratorio.",
    tags: ["Autoclave", "Esterilización", "Equipo"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 4250000,
    currency: "COP",
    stock: 5,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-biofarm",
    configVisible: true,
    configFeatured: true,
    configNew: false,
    configPromo: false,
    configRecommended: true,
    allowPurchase: true,
    allowQuotation: true,
    seoKeywords: ["autoclave", "esterilizacion", "equipos", "laboratorio"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-bolsas",
    name: "Bolsas para Cultivo",
    brand: "Myco Supplies",
    sku: "MCS-B-100",
    category: "Empaques",
    subcategory: "Bolsas",
    unit: "Unidad",
    presentation: "Paquete de 100 unidades",
    weight: 1.5,
    country: "Colombia",
    shortDescription: "Con filtro de 0.2 micras. Resistentes y de alta calidad.",
    fullDescription: "Bolsas de polipropileno de alta densidad autoclavables con parche de filtro microporoso de 0.2 micras. Ideales para la incubación de micelio.",
    tags: ["Bolsas", "Filtro", "PP"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 280,
    currency: "COP",
    stock: 10000,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-mycosupplies",
    configVisible: true,
    configFeatured: false,
    configNew: false,
    configPromo: false,
    configRecommended: false,
    allowPurchase: true,
    allowQuotation: false,
    seoKeywords: ["bolsas", "empaque", "filtro", "cultivo"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-campana",
    name: "Campana de Flujo Laminar",
    brand: "CleanAir Systems",
    sku: "CAS-CF-120",
    category: "Equipos",
    subcategory: "Laboratorio",
    unit: "Unidad",
    presentation: "Estación de trabajo",
    weight: 65,
    country: "Colombia",
    shortDescription: "Protección óptima para inoculación y manejo de cultivos.",
    fullDescription: "Campana de flujo laminar horizontal con filtro HEPA certificado con eficiencia de 99.99% para partículas de 0.3 micras. Genera un ambiente estéril clase 100.",
    tags: ["Campana", "Laboratorio", "Estéril"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 1980000,
    currency: "COP",
    stock: 8,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-cleanair",
    configVisible: true,
    configFeatured: true,
    configNew: false,
    configPromo: false,
    configRecommended: true,
    allowPurchase: true,
    allowQuotation: true,
    seoKeywords: ["campana", "flujo", "laminar", "laboratorio", "esteril"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-balanza",
    name: "Balanza Digital Industrial",
    brand: "Weigh Tech",
    sku: "WTC-BD-10K",
    category: "Equipos",
    subcategory: "Pesaje",
    unit: "Unidad",
    presentation: "Balanza de precisión",
    weight: 3,
    country: "Colombia",
    shortDescription: "Precisión 0.01 g. Ideal para mediciones precisas.",
    fullDescription: "Balanza de mesa industrial con capacidad de pesaje de hasta 10 kg y precisión de 0.01 g. Pantalla LCD retroiluminada y batería recargable.",
    tags: ["Balanza", "Pesaje", "Precisión"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 210000,
    currency: "COP",
    stock: 15,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-weightech",
    configVisible: true,
    configFeatured: false,
    configNew: false,
    configPromo: false,
    configRecommended: false,
    allowPurchase: true,
    allowQuotation: false,
    seoKeywords: ["balanza", "pesaje", "peso", "precision", "industrial"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-cultivo-liquido",
    name: "Cultivo Líquido",
    brand: "MycoGen",
    sku: "MCG-CL-2L",
    category: "Insumos",
    subcategory: "Laboratorio",
    unit: "Litros",
    presentation: "Envase de 2 L",
    weight: 2,
    country: "Colombia",
    shortDescription: "Cultivo líquido listo para usar en diversos sustratos.",
    fullDescription: "Cepa de Pleurotus eryngii (Setas de Cardo) suspendida en solución nutritiva estéril de extracto de malta y dextrosa. Lista para inoculación rápida de granos.",
    tags: ["Líquido", "Cultivo", "Insumo"],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 25000,
    currency: "COP",
    stock: 120,
    isAvailable: true,
    controlInventory: true,
    providerId: "prov-mycogen",
    configVisible: true,
    configFeatured: false,
    configNew: false,
    configPromo: false,
    configRecommended: false,
    allowPurchase: true,
    allowQuotation: false,
    seoKeywords: ["liquido", "inoculacion", "jeringa", "micelio", "frasco"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// FIREBASE CRUD FUNCTIONS
export async function listProviders(): Promise<Provider[]> {
  const colRef = collection(db, "providers");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => d.data() as Provider);
}

export async function getProvider(id: string): Promise<Provider | null> {
  const docRef = doc(db, "providers", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Provider) : null;
}

export async function saveProvider(provider: Provider): Promise<void> {
  const docRef = doc(db, "providers", provider.id);
  provider.updatedAt = new Date().toISOString();
  await setDoc(docRef, provider, { merge: true });
}

export async function deleteProvider(id: string): Promise<void> {
  const docRef = doc(db, "providers", id);
  await deleteDoc(docRef);
}

export async function listMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  const colRef = collection(db, "marketplace_products");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => d.data() as MarketplaceProduct);
}

export async function getMarketplaceProduct(id: string): Promise<MarketplaceProduct | null> {
  const docRef = doc(db, "marketplace_products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as MarketplaceProduct) : null;
}

export async function saveMarketplaceProduct(product: MarketplaceProduct): Promise<void> {
  const docRef = doc(db, "marketplace_products", product.id);
  product.updatedAt = new Date().toISOString();
  await setDoc(docRef, product, { merge: true });
}

export async function deleteMarketplaceProduct(id: string): Promise<void> {
  const docRef = doc(db, "marketplace_products", id);
  await deleteDoc(docRef);
}

export async function createMarketplaceOrder(order: Omit<MarketplaceOrder, "id" | "createdAt">): Promise<string> {
  const orderId = `mord-${Math.random().toString(36).substr(2, 9)}`;
  const docRef = doc(db, "marketplace_orders", orderId);
  const fullOrder: MarketplaceOrder = {
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
  };
  await setDoc(docRef, fullOrder);
  return orderId;
}

// SEEDER EXECUTION
export async function seedMarketplace(): Promise<void> {
  const productsCol = collection(db, "marketplace_products");
  const snapshot = await getDocs(productsCol);

  if (snapshot.empty) {
    const batch = writeBatch(db);

    // Seed Providers
    for (const prov of DEFAULT_PROVIDERS) {
      const pDoc = doc(db, "providers", prov.id);
      batch.set(pDoc, prov);
    }

    // Seed Products
    for (const prod of DEFAULT_PRODUCTS) {
      const pDoc = doc(db, "marketplace_products", prod.id);
      batch.set(pDoc, prod);
    }

    await batch.commit();
    console.log("Marketplace seeded successfully!");
  }
}
