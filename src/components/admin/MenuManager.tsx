import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  X, 
  FolderPlus, 
  Utensils, 
  Layers, 
  Search 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Product, Category } from '../../types/restaurant';
import { formatCurrency } from '../../utils/whatsapp';

export const MenuManager: React.FC = () => {
  const { 
    categories, 
    products, 
    saveProduct, 
    deleteProduct, 
    saveCategory, 
    deleteCategory, 
    settings 
  } = useRestaurant();

  const primaryColor = settings.visual.primaryColor || '#E11D48';

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Category Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodAvailable, setProdAvailable] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);

  // Form states for Category
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('🍔');
  const [catOrder, setCatOrder] = useState('1');

  // Open Product Modal
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdPrice(product.price.toString());
      setProdDesc(product.description);
      setProdImage(product.imageUrl);
      setProdCategory(product.categoryId);
      setProdAvailable(product.available);
      setProdFeatured(!!product.featured);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdPrice('');
      setProdDesc('');
      setProdImage('');
      setProdCategory(categories[0]?.id || '');
      setProdAvailable(true);
      setProdFeatured(false);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim()) return;

    const priceNum = parseFloat(prodPrice.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Informe um preço válido');
      return;
    }

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName.trim(),
      price: priceNum,
      description: prodDesc.trim(),
      imageUrl: prodImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      categoryId: prodCategory || categories[0]?.id || 'cat-general',
      available: prodAvailable,
      featured: prodFeatured,
    };

    await saveProduct(newProd);
    setIsProductModalOpen(false);
  };

  // Open Category Modal
  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.name);
      setCatIcon(category.icon || '🍔');
      setCatOrder(category.order.toString());
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatIcon('🍔');
      setCatOrder((categories.length + 1).toString());
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: catName.trim(),
      icon: catIcon.trim(),
      order: parseInt(catOrder) || categories.length + 1,
    };

    await saveCategory(newCat);
    setIsCategoryModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const matchesSearch = !searchFilter.trim() || p.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Sub-tabs */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-900">Gestão do Cardápio</h2>
          <p className="text-xs text-neutral-500">
            Cadastre, edite e remova produtos e categorias exibidos no app do cliente
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2">
          <button
            id="tab-btn-products"
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Produtos ({products.length})</span>
          </button>

          <button
            id="tab-btn-categories"
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Categorias ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-add-new-product"
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto</span>
              </button>

              <select
                id="select-admin-product-category-filter"
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 font-medium"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                id="input-admin-filter-products"
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar por nome..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl"
              />
            </div>
          </div>

          {/* Products List Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((product) => {
              const cat = categories.find(c => c.id === product.categoryId);

              return (
                <div
                  key={product.id}
                  id={`admin-product-row-${product.id}`}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 flex gap-3.5 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 relative">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-edit-prod-${product.id}`}
                            onClick={() => handleOpenProductModal(product)}
                            className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-prod-${product.id}`}
                            onClick={() => {
                              if (confirm(`Deseja excluir "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 inline-block mt-0.5">
                        {cat?.name || 'Sem Categoria'}
                      </span>

                      <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                      <span className="font-extrabold text-sm text-neutral-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.featured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-neutral-200/80">
            <button
              id="btn-add-new-category"
              onClick={() => handleOpenCategoryModal()}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Nova Categoria</span>
            </button>
            <span className="text-xs text-neutral-500">
              Total: {categories.length} categorias
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  id={`admin-cat-card-${cat.id}`}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-4 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-neutral-100 rounded-xl">
                      {cat.icon || '📁'}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{cat.name}</h4>
                      <span className="text-xs text-neutral-500">
                        {count} {count === 1 ? 'produto vinculado' : 'produtos vinculados'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      id={`btn-edit-cat-${cat.id}`}
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-cat-${cat.id}`}
                      onClick={() => {
                        if (confirm(`Deseja remover a categoria "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="modal-product-form"
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col"
          >
            <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-neutral-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                id="btn-close-product-editor"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Nome do Prato / Produto *
                </label>
                <input
                  id="form-product-name"
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex: Hambúrguer Especial Duplo"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    id="form-product-price"
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="35.90"
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    id="form-product-category"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Descrição e Ingredientes
                </label>
                <textarea
                  id="form-product-desc"
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Descreva o prato, acompanhamentos e ingredientes..."
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Imagem do Produto (URL)
                </label>
                <input
                  id="form-product-image"
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />

                {/* Image Preview */}
                {prodImage && (
                  <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img 
                      src={prodImage} 
                      alt="Prévia" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.target as any).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="form-product-available"
                    type="checkbox"
                    checked={prodAvailable}
                    onChange={(e) => setProdAvailable(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="font-semibold text-neutral-700">Disponível no cardápio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="form-product-featured"
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="font-semibold text-neutral-700">Item em Destaque</span>
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  id="btn-cancel-product"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-product-submit"
                  className="px-5 py-2 rounded-xl text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="modal-category-form"
            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-neutral-100 p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-extrabold text-base text-neutral-900">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                id="btn-close-category-editor"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  id="form-cat-name"
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ex: Porções & Petiscos"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Emoji / Ícone
                  </label>
                  <input
                    id="form-cat-icon"
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="🍔"
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    id="form-cat-order"
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(e.target.value)}
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  id="btn-cancel-cat"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-save-category-submit"
                  className="px-5 py-2 rounded-xl text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
