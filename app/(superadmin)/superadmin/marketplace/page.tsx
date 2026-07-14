"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  Loader2,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  seedMarketplace,
  listMarketplaceProducts,
  listProviders,
  deleteMarketplaceProduct,
  type MarketplaceProduct,
  type Provider,
} from "@/lib/services/marketplace";

export default function SuperAdminMarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function reload() {
    setLoading(true);
    try {
      await seedMarketplace();
      const [prodsData, provsData] = await Promise.all([
        listMarketplaceProducts(),
        listProviders(),
      ]);
      setProducts(prodsData);
      setProviders(provsData);
    } catch (err) {
      toast.error("Error al cargar datos del marketplace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto del marketplace?")) return;
    try {
      await deleteMarketplaceProduct(id);
      toast.success("Producto eliminado.");
      void reload();
    } catch (err) {
      toast.error("Error al eliminar el producto.");
    }
  }

  const filteredProducts = products.filter((p) => {
    const provider = providers.find((prov) => prov.id === p.providerId);
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      (provider?.name || "").toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <nav className="text-xs flex items-center gap-1.5 text-[#705e4b] font-medium mb-1">
            <Link href="/superadmin" className="hover:text-[#2b1b10]">
              Super Admin
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#2b1b10] font-bold">Administración de Marketplace</span>
          </nav>
          <h1
            className="text-3xl font-extrabold text-[#2a1408] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Administración de Marketplace
          </h1>
          <p className="text-xs text-[#705e4b] mt-0.5">
            Gestiona el catálogo global de productos, marcas, inventario y proveedores del Marketplace de FungiFlow.
          </p>
        </div>

        <Button onClick={() => router.push("/superadmin/marketplace/nuevo")} className="shadow-md">
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo producto
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-raised rounded-2xl p-4 flex items-center gap-3.5 border border-[rgba(132,88,42,0.08)]">
          <div className="bg-[#879652]/10 text-[#879652] h-10 w-10 rounded-xl flex items-center justify-center">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#705e4b]">Total Productos</p>
            <h3 className="text-lg font-bold text-[#2b1b10]">{products.length}</h3>
          </div>
        </div>

        <div className="surface-raised rounded-2xl p-4 flex items-center gap-3.5 border border-[rgba(132,88,42,0.08)]">
          <div className="bg-[#5A3519]/10 text-[#5A3519] h-10 w-10 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#705e4b]">Proveedores Activos</p>
            <h3 className="text-lg font-bold text-[#2b1b10]">{providers.length}</h3>
          </div>
        </div>

        <div className="surface-raised rounded-2xl p-4 flex items-center gap-3.5 border border-[rgba(132,88,42,0.08)]">
          <div className="bg-[#CA9318]/10 text-[#CA9318] h-10 w-10 rounded-xl flex items-center justify-center font-bold text-base">
            $
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#705e4b]">Marcas Asociadas</p>
            <h3 className="text-lg font-bold text-[#2b1b10]">
              {new Set(products.map((p) => p.brand)).size}
            </h3>
          </div>
        </div>
      </div>

      {/* Main product management block */}
      <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)]">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#705e4b]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, SKU, marca o proveedor..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto border border-[#84582a]/12 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#84582a]/12 text-[#705e4b] font-bold">
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Visible</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#84582a]/8 text-[#302D28]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#705e4b] italic">
                    No se encontraron productos registrados en el marketplace.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const provider = providers.find((prov) => prov.id === p.providerId);
                  const statusColors = {
                    active: "secondary",
                    inactive: "destructive",
                    draft: "outline",
                  } as const;

                  const statusLabels = {
                    active: "Activo",
                    inactive: "Inactivo",
                    draft: "Borrador",
                  };

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                      <td className="px-4 py-3.5 flex items-center gap-2.5 font-bold">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="h-9 w-9 rounded-lg object-cover bg-stone-100 shrink-0 border border-[#84582a]/10"
                        />
                        <div className="min-w-0">
                          <p className="text-[#2b1b10] line-clamp-1">{p.name}</p>
                          <span className="text-[9px] text-[#705e4b] uppercase font-bold tracking-wider">
                            SKU: {p.sku} | Marca: {p.brand}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-[#705e4b]">
                        {provider?.name || "Sin proveedor"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="border-[rgba(132,88,42,0.18)]">
                          {p.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-[#2b1b10]">
                        ${p.price.toLocaleString("es-CO")} {p.currency}
                      </td>
                      <td className="px-4 py-3.5 font-semibold">
                        {p.stock}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant={statusColors[p.status] || "outline"}>
                          {statusLabels[p.status] || p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center">
                          {p.configVisible ? (
                            <Eye className="h-4 w-4 text-[#879652]" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-[#705e4b]" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => router.push(`/superadmin/marketplace/${p.id}`)}
                          className="hover:bg-[#ECE4DA]/70 text-[#A36C35] p-1.5 rounded-lg border border-[rgba(130,92,55,0.16)] bg-[#FFF9F1]/72 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="hover:bg-[#a52c26]/10 text-[#a52c26] p-1.5 rounded-lg border border-[rgba(165,44,38,0.16)] bg-white transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
