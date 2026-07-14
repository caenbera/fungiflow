"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Building2,
  ChevronRight,
  Filter,
  Heart,
  Grid,
  List,
  Loader2,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Trash2,
  TrendingUp,
  Truck,
  X,
  Minus,
  Plus,
  CheckCircle,
  HelpCircle,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  seedMarketplace,
  listMarketplaceProducts,
  listProviders,
  createMarketplaceOrder,
  type MarketplaceProduct,
  type Provider,
  type CartItem,
} from "@/lib/services/marketplace";
import { useAuthStore } from "@/store/auth";

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

const CATEGORIES = [
  { id: "Todas", label: "Todas", icon: Store },
  { id: "Variedades", label: "Variedades", icon: Tag },
  { id: "Sustratos", label: "Sustratos", icon: Grid },
  { id: "Equipos", label: "Equipos", icon: SlidersHorizontal },
  { id: "Insumos", label: "Insumos", icon: ShoppingCart },
  { id: "Empaques", label: "Empaques", icon: Grid },
  { id: "Servicios", label: "Servicios", icon: TrendingUp },
];

export default function MarketplacePage() {
  const { orgId } = useAuthStore();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedDept, setSelectedDept] = useState("Antioquia");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtros Avanzados
  const [selectedProviderId, setSelectedProviderId] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Carrito de compras
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpenMobile, setCartOpenMobile] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Favoritos
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Carga inicial y sembrado
  useEffect(() => {
    async function init() {
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
        toast.error("Error al conectar con el catálogo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void init();

    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem("fungiflow_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch (e) {
        // Ignorar error
      }
    }
  }, []);

  // Guardar carrito en localStorage al cambiar
  function saveCart(newCart: CartItem[]) {
    setCart(newCart);
    localStorage.setItem("fungiflow_cart", JSON.stringify(newCart));
  }

  function handleAddToCart(product: MarketplaceProduct, provider: Provider) {
    const existingIdx = cart.findIndex((item) => item.product.id === product.id);
    if (existingIdx > -1) {
      const nextCart = [...cart];
      nextCart[existingIdx].quantity += 1;
      saveCart(nextCart);
    } else {
      saveCart([...cart, { product, provider, quantity: 1 }]);
    }
    toast.success(`${product.name} agregado al carrito.`);
  }

  function handleUpdateQty(productId: string, qty: number) {
    if (qty <= 0) {
      saveCart(cart.filter((item) => item.product.id !== productId));
    } else {
      saveCart(
        cart.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item)),
      );
    }
  }

  function handleRemoveFromCart(productId: string) {
    saveCart(cart.filter((item) => item.product.id !== productId));
    toast.info("Producto eliminado del carrito.");
  }

  function toggleFavorite(productId: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast.info("Quitado de favoritos.");
      } else {
        next.add(productId);
        toast.success("Añadido a favoritos.");
      }
      return next;
    });
  }

  // Filtrado y ordenamiento de productos
  const filteredProducts = products.filter((p) => {
    // 1. Filtrar por estado activo
    if (p.status !== "active") return false;

    // 2. Filtrar por categoría
    if (selectedCategory !== "Todas" && p.category !== selectedCategory) return false;

    // 3. Filtrar por departamento de despacho del proveedor
    const provider = providers.find((prov) => prov.id === p.providerId);
    if (!provider) return false;
    if (selectedDept && !provider.coverage.includes(selectedDept)) return false;

    // 4. Búsqueda por texto (nombre, marca, sku, descripción)
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(queryLower);
      const matchBrand = p.brand.toLowerCase().includes(queryLower);
      const matchSku = p.sku.toLowerCase().includes(queryLower);
      const matchDesc = p.shortDescription.toLowerCase().includes(queryLower);
      const matchProv = provider.name.toLowerCase().includes(queryLower);
      if (!matchName && !matchBrand && !matchSku && !matchDesc && !matchProv) return false;
    }

    // 5. Filtros avanzados
    if (selectedProviderId !== "all" && p.providerId !== selectedProviderId) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (onlyInStock && p.stock <= 0) return false;

    return true;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "precio_asc") return a.price - b.price;
    if (sortOption === "precio_desc") return b.price - a.price;
    // Por defecto relevancia / más vendidos
    return b.stock - a.stock;
  });

  // Finanzas del carrito
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartShipping = cart.length > 0 ? 25000 : 0; // Costo fijo simulado de envío
  const cartTotal = cartSubtotal + cartShipping;

  // Confirmar compra simulada y crear orden en base
  async function handleConfirmCheckout() {
    if (!orgId || cart.length === 0) return;
    setPlacingOrder(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        price: item.product.price,
        providerId: item.provider.id,
        providerName: item.provider.name,
      }));

      const orderId = await createMarketplaceOrder({
        orgId,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingCost: cartShipping,
        total: cartTotal,
        department: selectedDept,
        status: "pending",
      });

      setConfirmedOrderId(orderId);
      setOrderConfirmed(true);
      saveCart([]); // Limpiar carrito
      toast.success("¡Orden de compra generada con éxito!");
    } catch (err) {
      toast.error("Error al procesar la orden.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="text-[#CA9318] h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER BREADCRUMB */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <nav className="text-xs flex items-center gap-1.5 text-[#705e4b] font-medium mb-1">
            <button onClick={() => window.location.href = "/dashboard"} className="hover:text-[#2b1b10]">
              Inicio
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#2b1b10] font-bold">Marketplace</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-[#2a1408] tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            Marketplace
          </h1>
          <p className="text-xs text-[#705e4b] mt-0.5">
            Compra insumos, sustratos y equipos de proveedores especializados en la industria de la fungicultura.
          </p>
        </div>

        {/* Filters and Cart in header */}
        <div className="flex items-center gap-2">
          {/* Departamentos */}
          <div className="flex items-center gap-1.5 bg-[#FFF9F1]/80 border border-[rgba(130,92,55,0.16)] px-2.5 py-1.5 rounded-xl shadow-sm">
            <Truck className="h-4 w-4 text-[#CA9318]" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#2b1b10] border-none focus:outline-none cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Carrito Mobile Trigger */}
          <Button
            size="sm"
            variant="outline"
            className="lg:hidden relative"
            onClick={() => setCartOpenMobile(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#879652] text-white text-[9px] font-bold flex h-4.5 w-4.5 items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* HORIZONTAL CATEGORIES BAR */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isActive
                  ? "bg-[#879652] text-white border-[#879652] shadow-md scale-[1.02]"
                  : "bg-[#FFF9F1]/60 text-[#705e4b] border-[rgba(130,92,55,0.12)] hover:bg-[#FAF7F2]"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="surface-raised rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#705e4b]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por producto, marca, SKU o palabra clave..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`gap-1.5 ${filtersOpen ? "bg-[#FAF7F2] border-[#CA9318] text-[#CA9318]" : ""}`}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>

          <Select value={sortOption} onValueChange={(val) => setSortOption(val || "relevancia")}>
            <SelectTrigger className="w-[170px] h-9 text-xs">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevancia</SelectItem>
              <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* COLLAPSIBLE FILTERS PANEL */}
      {filtersOpen && (
        <div className="surface-raised rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#705e4b]">Proveedor</Label>
            <Select value={selectedProviderId} onValueChange={(val) => setSelectedProviderId(val || "all")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Todos los proveedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#705e4b]">Precio Mínimo (COP)</Label>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-[#705e4b]">Precio Máximo (COP)</Label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Ej: 500000"
              className="h-9"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="stock-only"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="h-4 w-4 rounded border-[#84582a]/40 bg-transparent text-[#879652] focus:ring-0 cursor-pointer"
            />
            <Label htmlFor="stock-only" className="text-xs font-bold text-[#705e4b] cursor-pointer">
              Solo productos en stock
            </Label>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER: PRODUCT GRID & SIDEBAR CART */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 items-start">
        {/* Products Grid */}
        <div className="space-y-6">
          {sortedProducts.length === 0 ? (
            <div className="surface-raised rounded-2xl p-16 text-center space-y-3 flex flex-col items-center">
              <div className="h-12 w-12 bg-[#84582a]/10 rounded-full flex items-center justify-center text-xl">
                🔎
              </div>
              <h3 className="font-bold text-[#2a1408]">No se encontraron productos</h3>
              <p className="text-xs text-[#705e4b] max-w-sm">
                No hay productos en esta categoría que despachen a **{selectedDept}** con los criterios de búsqueda actuales.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sortedProducts.map((p) => {
                const provider = providers.find((prov) => prov.id === p.providerId);
                const isFav = favorites.has(p.id);

                return (
                  <div
                    key={p.id}
                    className="surface-raised rounded-2xl overflow-hidden border border-[rgba(132,88,42,0.12)] hover:shadow-lg transition-all flex flex-col group"
                  >
                    {/* Image and badges */}
                    <div className="relative aspect-[4/3] bg-stone-100 shrink-0">
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-[#5A3519]/72 backdrop-blur-sm text-white">
                        {p.category}
                      </Badge>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center bg-white/90 shadow-md backdrop-blur-sm transition-colors ${
                          isFav ? "text-[#a52c26]" : "text-[#705e4b] hover:text-[#a52c26]"
                        }`}
                      >
                        <Heart className="h-4.5 w-4.5" fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col space-y-3 justify-between">
                      <div className="space-y-1.5">
                        {/* Provider line */}
                        {provider && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={provider.logoUrl}
                              alt={provider.name}
                              className="h-4 w-4 rounded-full object-cover border border-[#84582a]/20"
                            />
                            <span className="text-[10px] font-bold text-[#A56F40]">{provider.name}</span>
                          </div>
                        )}
                        {/* Title */}
                        <h3 className="font-bold text-sm text-[#2a1408] line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-[#705e4b] line-clamp-2 leading-relaxed">
                          {p.shortDescription}
                        </p>
                      </div>

                      {/* Pricing and Location */}
                      <div className="space-y-2 border-t border-[#84582a]/8 pt-2.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-base font-extrabold text-[#2b1b10]">
                            ${p.price.toLocaleString("es-CO")}
                          </span>
                          <span className="text-[10px] text-[#705e4b] font-medium">
                            / {p.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#705e4b] font-semibold">
                          <span className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-[#879652]" /> Despacha desde:
                          </span>
                          <span className="text-[#2b1b10]">{provider?.state}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleAddToCart(p, provider!)}
                        disabled={p.stock <= 0}
                      >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        {p.stock <= 0 ? "Agotado" : "Agregar al carrito"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled>
                Anterior
              </Button>
              <Button size="sm" className="bg-[#879652] text-white">
                1
              </Button>
              <Button size="sm" variant="outline" disabled>
                2
              </Button>
              <Button size="sm" variant="outline" disabled>
                3
              </Button>
              <Button size="sm" variant="outline" disabled>
                Siguiente
              </Button>
            </div>
          )}
        </div>

        {/* SIDEBAR CART (FIXED ON DESKTOP) */}
        <aside className="hidden lg:block">
          <div className="surface-raised rounded-2xl p-5 space-y-4 border border-[rgba(132,88,42,0.12)] sticky top-6">
            <div className="flex items-center justify-between border-b border-[#84582a]/12 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4.5 w-4.5 text-[#879652]" />
                <h3 className="font-bold text-sm text-[#2a1408]" style={{ fontFamily: "var(--font-serif)" }}>
                  Carrito de compra
                </h3>
              </div>
              <Badge variant="secondary" className="bg-[#879652]/10 text-[#879652] border-none font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#705e4b] italic space-y-1.5">
                  <span>Tu carrito está vacío.</span>
                  <p className="text-[10px]">Agrega insumos desde la tienda.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-2.5 bg-[#FAF7F2]/50 p-2.5 rounded-xl border border-[rgba(132,88,42,0.06)] relative group">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="font-bold text-xs text-[#2b1b10] truncate">{item.product.name}</h4>
                      <p className="text-[9px] text-[#705e4b] uppercase font-bold">{item.provider.name}</p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 bg-white border border-[rgba(130,92,55,0.16)] rounded-lg px-1.5 py-0.5">
                          <button
                            onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                            className="text-[#705e4b] hover:text-[#2b1b10]"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="text-xs font-bold text-[#2b1b10]">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                            className="text-[#705e4b] hover:text-[#2b1b10]"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-[#2b1b10]">
                          ${(item.product.price * item.quantity).toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="absolute top-2 right-2 text-[#a52c26] hover:bg-[#a52c26]/10 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Price Calculations */}
            {cart.length > 0 && (
              <div className="border-t border-[#84582a]/12 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-[#705e4b]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2b1b10]">${cartSubtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-[#705e4b]">
                  <span>Costo de envío estimado</span>
                  <span className="font-bold text-[#2b1b10]">${cartShipping.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm pt-1.5 border-t border-[#84582a]/8 text-[#2b1b10] font-extrabold">
                  <span>Total</span>
                  <span>${cartTotal.toLocaleString("es-CO")}</span>
                </div>

                <div className="space-y-2 pt-3">
                  <Button className="w-full" onClick={() => setIsCheckoutOpen(true)}>
                    Ir al Checkout
                  </Button>
                </div>
              </div>
            )}

            {/* Coverage delivery banner */}
            <div className="bg-[#879652]/8 border border-[rgba(135,150,82,0.22)] rounded-xl p-3 flex gap-2 text-[10px] text-[#705e4b] leading-relaxed">
              <Truck className="h-4 w-4 text-[#879652] shrink-0" />
              <div>
                <p className="font-bold text-[#2b1b10]">Despacho disponible para {selectedDept}</p>
                <span>Entrega estimada: 48 a 72 horas hábiles.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MOBILE DRAWER CART */}
      {cartOpenMobile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-200 lg:hidden">
          <div className="bg-[#FFF9F1] w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between border-b border-[#84582a]/12 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4.5 w-4.5 text-[#879652]" />
                  <h3 className="font-bold text-sm text-[#2a1408]">Carrito de compra</h3>
                </div>
                <button onClick={() => setCartOpenMobile(false)}>
                  <X className="h-5 w-5 text-[#705e4b]" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {cart.length === 0 ? (
                  <p className="text-center py-8 text-xs text-[#705e4b] italic">El carrito está vacío.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-2.5 bg-[#FAF7F2]/50 p-2.5 rounded-xl border border-[rgba(132,88,42,0.06)] relative">
                      <img
                        src={item.product.mainImage}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-bold text-xs text-[#2b1b10] truncate">{item.product.name}</h4>
                        <p className="text-[9px] text-[#705e4b] uppercase font-bold">{item.provider.name}</p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5 bg-white border border-[rgba(130,92,55,0.16)] rounded-lg px-1.5 py-0.5">
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                              className="text-[#705e4b]"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="text-xs font-bold text-[#2b1b10]">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                              className="text-[#705e4b]"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-[#2b1b10]">
                            ${(item.product.price * item.quantity).toLocaleString("es-CO")}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="absolute top-2 right-2 text-[#a52c26] p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Calculations */}
            {cart.length > 0 && (
              <div className="border-t border-[#84582a]/12 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#705e4b]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#2b1b10]">${cartSubtotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-[#705e4b]">
                    <span>Envío estimado</span>
                    <span className="font-bold text-[#2b1b10]">${cartShipping.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1.5 border-t border-[#84582a]/8 text-[#2b1b10] font-extrabold">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString("es-CO")}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setCartOpenMobile(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  Ir al Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT / SUMMARY DIALOG MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFF9F1] border border-[rgba(132,88,42,0.18)] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#84582a]/12 flex justify-between items-center bg-[#FAF7F2]">
              <h3 className="font-bold text-base text-[#2a1408]" style={{ fontFamily: "var(--font-serif)" }}>
                {orderConfirmed ? "Confirmación de Compra" : "Confirmar tu Pedido"}
              </h3>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setOrderConfirmed(false);
                }}
              >
                <X className="h-5 w-5 text-[#705e4b]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {orderConfirmed ? (
                <div className="text-center py-6 space-y-4 flex flex-col items-center">
                  <div className="h-14 w-14 bg-[#879652]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-[#879652]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#2a1408]" style={{ fontFamily: "var(--font-serif)" }}>
                      ¡Pedido Generado Exitosamente!
                    </h4>
                    <p className="text-xs text-[#705e4b] mt-1">
                      Código de referencia: **{confirmedOrderId}**
                    </p>
                    <p className="text-xs text-[#705e4b] mt-2 max-w-sm mx-auto leading-relaxed">
                      El proveedor ha recibido tu orden y se contactará para coordinar el pago y envío a **{selectedDept}**.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderConfirmed(false);
                    }}
                    className="w-full max-w-xs"
                  >
                    Entendido
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#705e4b] leading-relaxed">
                    Tu pedido será procesado y despachado por los proveedores correspondientes a **{selectedDept}**:
                  </p>

                  {/* Grouped items by provider */}
                  <div className="space-y-3.5">
                    {Array.from(new Set(cart.map((item) => item.provider.id))).map((provId) => {
                      const providerItems = cart.filter((item) => item.provider.id === provId);
                      const provider = providerItems[0].provider;

                      return (
                        <div key={provId} className="border border-[#84582a]/12 rounded-xl overflow-hidden bg-white shadow-sm">
                          <div className="bg-[#FAF7F2] px-3.5 py-2 flex items-center gap-2 border-b border-[#84582a]/12">
                            <Building2 className="h-4 w-4 text-[#A56F40]" />
                            <span className="text-xs font-bold text-[#2a1408]">{provider.name}</span>
                          </div>
                          <div className="divide-y divide-[#84582a]/6 px-3.5 py-1">
                            {providerItems.map((item) => (
                              <div key={item.product.id} className="py-2.5 flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-bold text-[#2b1b10]">{item.product.name}</p>
                                  <span className="text-[10px] text-[#705e4b]">Cantidad: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-[#2b1b10]">
                                  ${(item.product.price * item.quantity).toLocaleString("es-CO")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calculations */}
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#84582a]/12 space-y-2 text-xs">
                    <div className="flex justify-between text-[#705e4b]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#2b1b10]">${cartSubtotal.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-[#705e4b]">
                      <span>Envío a {selectedDept}</span>
                      <span className="font-bold text-[#2b1b10]">${cartShipping.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-[#84582a]/12 text-[#2b1b10] font-extrabold">
                      <span>Total Neto</span>
                      <span>${cartTotal.toLocaleString("es-CO")}</span>
                    </div>
                  </div>

                  {/* Payment notice */}
                  <div className="bg-[#FFF9F1] border border-[rgba(202,147,24,0.18)] p-3 rounded-xl flex gap-2 text-[10px] text-[#705e4b] leading-relaxed">
                    <HelpCircle className="h-4.5 w-4.5 text-[#CA9318] shrink-0" />
                    <div>
                      <p className="font-bold text-[#2b1b10]">¿Cómo realizo el pago?</p>
                      <span>
                        FungiFlow gestiona el envío de la cotización directamente al proveedor. Éste te contactará por email o teléfono para enviarte la cuenta bancaria o link de pago.
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCheckoutOpen(false)}
                      disabled={placingOrder}
                    >
                      Volver
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirmCheckout}
                      disabled={placingOrder}
                    >
                      {placingOrder && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                      Confirmar Compra
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
