"use client";

import { createElement, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Plus,
  Save,
  ShoppingCart,
  Trash2,
  Truck,
  X,
  FileText,
  HelpCircle,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMarketplaceProduct,
  listProviders,
  saveMarketplaceProduct,
  saveProvider,
  type MarketplaceProduct,
  type Provider,
} from "@/lib/services/marketplace";

const DEPARTMENTS = [
  "Antioquia",
  "Cundinamarca",
  "Boyacá",
  "Santander",
  "Valle",
  "Meta",
  "Tolima",
  "Huila",
  "Cauca",
  "Nariño",
];

const CATEGORIES = ["Variedades", "Sustratos", "Equipos", "Insumos", "Empaques", "Servicios"];

export default function SuperAdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const isNew = productId === "nuevo";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  // Form Fields State
  const [productData, setProductData] = useState<Omit<MarketplaceProduct, "createdAt" | "updatedAt">>({
    id: isNew ? `prod-${Math.random().toString(36).substr(2, 9)}` : productId,
    name: "",
    brand: "",
    sku: "",
    category: "Variedades",
    subcategory: "",
    unit: "Kilogramo (kg)",
    presentation: "",
    weight: 0,
    country: "Colombia",
    shortDescription: "",
    fullDescription: "",
    tags: [],
    status: "active",
    mainImage: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=300&fit=crop",
    additionalImages: [],
    price: 0,
    currency: "COP",
    stock: 0,
    isAvailable: true,
    controlInventory: true,
    providerId: "",
    configVisible: true,
    configFeatured: false,
    configNew: true,
    configPromo: false,
    configRecommended: false,
    allowPurchase: true,
    allowQuotation: true,
    seoKeywords: [],
  });

  const [providerLogo, setProviderLogo] = useState("");

  // Provider creation modal state
  const [isNewProviderOpen, setIsNewProviderOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<Omit<Provider, "createdAt" | "updatedAt">>({
    id: `prov-${Math.random().toString(36).substr(2, 9)}`,
    name: "",
    legalName: "",
    nit: "",
    email: "",
    phone: "",
    city: "",
    state: "Antioquia",
    website: "",
    description: "",
    logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop",
    coverage: ["Antioquia", "Cundinamarca", "Boyacá"],
  });

  // Dynamic input states
  const [newAddImageUrl, setNewAddImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const provsData = await listProviders();
      setProviders(provsData);

      if (!isNew) {
        const prod = await getMarketplaceProduct(productId);
        if (prod) {
          setProductData(prod);
          const currentProv = provsData.find((p) => p.id === prod.providerId);
          if (currentProv) {
            setProviderLogo(currentProv.logoUrl);
          }
        } else {
          toast.error("Producto no encontrado.");
          router.push("/superadmin/marketplace");
        }
      } else {
        if (provsData.length > 0) {
          setProductData((prev) => ({
            ...prev,
            providerId: provsData[0].id,
          }));
          setProviderLogo(provsData[0].logoUrl);
        }
      }
    } catch (err) {
      toast.error("Error al cargar la información.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [productId]);

  // Sync provider logo when selected provider changes
  useEffect(() => {
    const activeProv = providers.find((p) => p.id === productData.providerId);
    if (activeProv) {
      setProviderLogo(activeProv.logoUrl);
    }
  }, [productData.providerId, providers]);

  // Handle provider creation
  async function handleCreateProvider() {
    if (!newProvider.name.trim()) {
      toast.error("El nombre del proveedor es obligatorio.");
      return;
    }
    try {
      const fullProvider: Provider = {
        ...newProvider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveProvider(fullProvider);
      toast.success("Proveedor creado.");
      setProviders((prev) => [...prev, fullProvider]);
      setProductData((prev) => ({ ...prev, providerId: fullProvider.id }));
      setIsNewProviderOpen(false);
    } catch (err) {
      toast.error("Error al crear proveedor.");
    }
  }

  // Handle product save
  async function handleSaveProduct() {
    if (!productData.name.trim() || !productData.providerId) {
      toast.error("Por favor completa los campos obligatorios (*).");
      return;
    }
    setSaving(true);
    try {
      const fullProduct: MarketplaceProduct = {
        ...productData,
        createdAt: isNew ? new Date().toISOString() : (productData as MarketplaceProduct).createdAt,
        updatedAt: new Date().toISOString(),
      };
      await saveMarketplaceProduct(fullProduct);
      toast.success("Producto guardado exitosamente.");
      router.push("/superadmin/marketplace");
    } catch (err) {
      toast.error("Error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  // Add additional image URL
  function handleAddImageUrl() {
    if (!newAddImageUrl.trim()) return;
    setProductData((prev) => ({
      ...prev,
      additionalImages: [...prev.additionalImages, newAddImageUrl.trim()],
    }));
    setNewAddImageUrl("");
  }

  // Remove additional image URL
  function handleRemoveImageUrl(idx: number) {
    setProductData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== idx),
    }));
  }

  // Add tag
  function handleAddTag() {
    if (!newTag.trim()) return;
    if (productData.tags.includes(newTag.trim())) return;
    setProductData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag("");
  }

  // Remove tag
  function handleRemoveTag(tag: string) {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  const selectedProvider = providers.find((prov) => prov.id === productData.providerId);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/superadmin/marketplace")}
            className="hover:bg-[#ECE4DA]/70 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[#705e4b]" />
          </button>
          <nav className="text-xs flex items-center gap-1.5 text-[#705e4b] font-medium">
            <Link href="/superadmin" className="hover:text-[#2b1b10]">
              Super Admin
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/superadmin/marketplace" className="hover:text-[#2b1b10]">
              Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#2b1b10] font-bold">
              {isNew ? "Nuevo producto" : "Editar producto"}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/superadmin/marketplace")}>
            Cancelar
          </Button>
          <Button onClick={handleSaveProduct} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
            <Save className="h-4 w-4 mr-1.5" />
            Guardar producto
          </Button>
        </div>
      </div>

      {/* Grid: Form (col-span-2) and Live Preview (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form fields (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Proveedor */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Información del Proveedor
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label className="font-bold">
                  Proveedor <span className="text-[#a52c26]">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={productData.providerId}
                    onValueChange={(val) =>
                      setProductData((prev) => ({ ...prev, providerId: val || "" }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un proveedor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewProviderOpen(true)}
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Logo preview */}
              <div className="space-y-1.5">
                <Label className="font-bold">Logotipo del proveedor</Label>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      providerLogo ||
                      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop"
                    }
                    alt="Logo"
                    className="h-12 w-12 rounded-xl object-cover bg-stone-100 border border-[#84582a]/20"
                  />
                  <p className="text-[10px] text-[#705e4b] leading-relaxed max-w-[200px]">
                    El logotipo se muestra en la tarjeta del catálogo del cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Información de Producto */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Detalles del Producto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-name" className="font-bold">
                  Nombre del producto <span className="text-[#a52c26]">*</span>
                </Label>
                <Input
                  id="prod-name"
                  value={productData.name}
                  onChange={(e) => setProductData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Sustrato Premium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-brand" className="font-bold">
                  Marca
                </Label>
                <Input
                  id="prod-brand"
                  value={productData.brand}
                  onChange={(e) => setProductData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Ej: Mush Supply"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold">Categoría</Label>
                <Select
                  value={productData.category}
                  onValueChange={(val) =>
                    setProductData((prev) => ({ ...prev, category: val || "Variedades" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-sku" className="font-bold">
                  SKU (Código interno)
                </Label>
                <Input
                  id="prod-sku"
                  value={productData.sku}
                  onChange={(e) => setProductData((prev) => ({ ...prev, sku: e.target.value }))}
                  placeholder="Ej: MSP-SU-10KG"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold">Unidad de medida</Label>
                <Select
                  value={productData.unit}
                  onValueChange={(val) => setProductData((prev) => ({ ...prev, unit: val || "Kilogramo (kg)" }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kilogramo (kg)">Kilogramo (kg)</SelectItem>
                    <SelectItem value="Litros">Litros (L)</SelectItem>
                    <SelectItem value="Unidades">Unidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-weight" className="font-bold">
                  Peso neto
                </Label>
                <Input
                  id="prod-weight"
                  type="number"
                  value={productData.weight || ""}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, weight: Number(e.target.value) }))
                  }
                  placeholder="Ej: 10"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prod-short" className="font-bold">
                  Descripción corta <span className="text-[#a52c26]">*</span>
                </Label>
                <Input
                  id="prod-short"
                  value={productData.shortDescription}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, shortDescription: e.target.value }))
                  }
                  placeholder="Ej: Mezcla balanceada para un crecimiento óptimo y sostenible."
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="prod-full" className="font-bold">
                  Descripción detallada
                </Label>
                <Textarea
                  id="prod-full"
                  value={productData.fullDescription}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, fullDescription: e.target.value }))
                  }
                  placeholder="Especifica el método de uso, nutrientes, o especificaciones técnicas completas..."
                  className="min-h-24 text-xs"
                />
              </div>

              {/* Tags block */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="font-bold">Etiquetas</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Escribe etiqueta y pulsa Enter"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Añadir
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {productData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 bg-[#879652]/10 text-[#879652]"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Imágenes del Producto */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Imágenes del Producto (URLs)
            </h3>

            <div className="bg-[#FFF9F1] border border-[rgba(130,92,55,0.14)] rounded-xl p-3 flex gap-2 text-[10px] text-[#705e4b] leading-relaxed">
              <HelpCircle className="h-4.5 w-4.5 text-[#CA9318] shrink-0" />
              <span>
                Para mantener el rendimiento y portabilidad, FungiFlow consume imágenes mediante enlaces externos (URLs). Sube tu imagen a un hosting y coloca el link abajo.
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="main-img" className="font-bold">
                  URL de la imagen principal <span className="text-[#a52c26]">*</span>
                </Label>
                <Input
                  id="main-img"
                  value={productData.mainImage}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, mainImage: e.target.value }))
                  }
                  placeholder="https://proveedor.com/imagen.jpg"
                />
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <Label className="font-bold">Imágenes adicionales (opcional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAddImageUrl}
                    onChange={(e) => setNewAddImageUrl(e.target.value)}
                    placeholder="https://proveedor.com/imagen-galeria.jpg"
                  />
                  <Button type="button" variant="outline" onClick={handleAddImageUrl}>
                    Añadir URL
                  </Button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {productData.additionalImages.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#84582a]/8 text-xs">
                      <img src={img} alt="Miniatura" className="h-8 w-8 rounded object-cover shrink-0" />
                      <span className="truncate flex-1 text-[#705e4b]">{img}</span>
                      <button
                        onClick={() => handleRemoveImageUrl(idx)}
                        className="text-[#a52c26] hover:bg-[#a52c26]/10 p-1 rounded-md"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Precios e Inventario */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Precios e Inventario
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price" className="font-bold">
                  Precio unitario (COP) <span className="text-[#a52c26]">*</span>
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  value={productData.price || ""}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, price: Number(e.target.value) }))
                  }
                  placeholder="Ej: 8500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold">Moneda</Label>
                <Select
                  value={productData.currency}
                  onValueChange={(val) =>
                    setProductData((prev) => ({ ...prev, currency: (val || "COP") as "COP" | "USD" | "EUR" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP ($)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-stock" className="font-bold">
                  Stock disponible
                </Label>
                <Input
                  id="prod-stock"
                  type="number"
                  value={productData.stock || ""}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, stock: Number(e.target.value) }))
                  }
                  placeholder="Ej: 1250"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="ctl-inv"
                  checked={productData.controlInventory}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, controlInventory: e.target.checked }))
                  }
                  className="h-4.5 w-4.5 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0 cursor-pointer"
                />
                <Label htmlFor="ctl-inv" className="font-bold cursor-pointer">
                  Manejar inventario
                </Label>
              </div>
            </div>
          </div>

          {/* Section 5: Cobertura geográfica */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Cobertura de Despacho
            </h3>
            <p className="text-[10px] text-[#705e4b]">
              Selecciona los departamentos a los que este proveedor puede despachar este producto.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedProvider?.coverage.includes(dept) ?? false;
                return (
                  <div
                    key={dept}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs select-none ${
                      isSelected
                        ? "bg-[#879652]/10 border-[#879652] text-[#879652]"
                        : "bg-[#FAF7F2]/60 border-[#84582a]/12 text-[#705e4b] opacity-60"
                    }`}
                  >
                    {dept}
                    <p className="text-[8px] font-medium mt-0.5">
                      {isSelected ? "Disponible" : "Sin cobertura"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Estado y visibilidad */}
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
            <h3
              className="text-base font-bold text-[#2a1408]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Estado y Visibilidad
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold">Estado del producto</Label>
                <Select
                  value={productData.status}
                  onValueChange={(val) =>
                    setProductData((prev) => ({ ...prev, status: (val || "active") as "active" | "inactive" | "draft" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="vis-plat"
                  checked={productData.configVisible}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, configVisible: e.target.checked }))
                  }
                  className="h-4.5 w-4.5 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0 cursor-pointer"
                />
                <Label htmlFor="vis-plat" className="font-bold cursor-pointer">
                  Visible en la plataforma para administradores
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Card Preview on the right (col-span-1) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-[#A56F40] mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Vista Previa en Tiempo Real
            </h3>

            {/* Simulated Card exactly replicating the Marketplace Card */}
            <div className="surface-raised rounded-2xl overflow-hidden border border-[rgba(132,88,42,0.18)] shadow-xl flex flex-col bg-[#FFF9F1]">
              <div className="relative aspect-[4/3] bg-stone-100 shrink-0">
                <img
                  src={productData.mainImage}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback image if URL is broken or empty
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=300&fit=crop";
                  }}
                />
                <Badge className="absolute top-3 left-3 bg-[#5A3519]/72 backdrop-blur-sm text-white">
                  {productData.category}
                </Badge>
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-white/90 shadow-md backdrop-blur-sm text-[#705e4b]">
                  <Heart className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={
                        providerLogo ||
                        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&h=128&fit=crop"
                      }
                      alt="Logo proveedor"
                      className="h-4 w-4 rounded-full object-cover border border-[#84582a]/20"
                    />
                    <span className="text-[10px] font-bold text-[#A56F40]">
                      {selectedProvider?.name || "Proveedor no seleccionado"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#2a1408] line-clamp-1">
                    {productData.name || "Nombre del producto"}
                  </h3>
                  <p className="text-xs text-[#705e4b] line-clamp-2 leading-relaxed">
                    {productData.shortDescription || "Agrega una descripción corta."}
                  </p>
                </div>

                <div className="space-y-2 border-t border-[#84582a]/8 pt-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-[#2b1b10]">
                      ${(productData.price || 0).toLocaleString("es-CO")}
                    </span>
                    <span className="text-[10px] text-[#705e4b] font-medium">
                      / {productData.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#705e4b] font-semibold">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3 text-[#879652]" /> Despacha desde:
                    </span>
                    <span className="text-[#2b1b10]">{selectedProvider?.state || "N/A"}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full mt-2" disabled>
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* CREATE NEW PROVIDER INLINE DIALOG MODAL */}
      {isNewProviderOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFF9F1] border border-[rgba(132,88,42,0.18)] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-[#84582a]/12 flex justify-between items-center bg-[#FAF7F2]">
              <h3
                className="font-bold text-base text-[#2a1408]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Nuevo Proveedor
              </h3>
              <button onClick={() => setIsNewProviderOpen(false)}>
                <X className="h-5 w-5 text-[#705e4b]" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 max-h-[80vh]">
              <div className="space-y-1.5">
                <Label htmlFor="prov-name" className="font-bold">
                  Nombre Comercial <span className="text-[#a52c26]">*</span>
                </Label>
                <Input
                  id="prov-name"
                  value={newProvider.name}
                  onChange={(e) =>
                    setNewProvider((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ej: MycoGen"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prov-legal" className="font-bold">
                  Razón Social
                </Label>
                <Input
                  id="prov-legal"
                  value={newProvider.legalName}
                  onChange={(e) =>
                    setNewProvider((prev) => ({ ...prev, legalName: e.target.value }))
                  }
                  placeholder="Ej: MycoGen Biotech S.A.S."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prov-nit" className="font-bold">
                  NIT
                </Label>
                <Input
                  id="prov-nit"
                  value={newProvider.nit}
                  onChange={(e) =>
                    setNewProvider((prev) => ({ ...prev, nit: e.target.value }))
                  }
                  placeholder="Ej: 901.456.789-1"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prov-state" className="font-bold">
                  Departamento de origen
                </Label>
                <Select
                  value={newProvider.state}
                  onValueChange={(val) =>
                    setNewProvider((prev) => ({ ...prev, state: val || "Antioquia" }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prov-logo" className="font-bold">
                  URL del Logo del Proveedor
                </Label>
                <Input
                  id="prov-logo"
                  value={newProvider.logoUrl}
                  onChange={(e) =>
                    setNewProvider((prev) => ({ ...prev, logoUrl: e.target.value }))
                  }
                  placeholder="https://proveedor.com/logo.png"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsNewProviderOpen(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleCreateProvider}>
                  Crear Proveedor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
