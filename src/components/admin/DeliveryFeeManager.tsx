import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Search, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { NeighborhoodFee } from '../../types/restaurant';
import { formatCurrency } from '../../utils/whatsapp';

export const DeliveryFeeManager: React.FC = () => {
  const { settings, updateSettings, saveNeighborhood, deleteNeighborhood } = useRestaurant();
  const primaryColor = settings.visual.primaryColor || '#E11D48';

  const [defaultFee, setDefaultFee] = useState(settings.delivery.defaultFee.toString());
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New / Edit neighborhood state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [neighborhoodName, setNeighborhoodName] = useState('');
  const [neighborhoodFee, setNeighborhoodFee] = useState('');

  const neighborhoods = settings.delivery.neighborhoods || [];

  const filteredNeighborhoods = neighborhoods.filter(n =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveDefaultFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeNum = parseFloat(defaultFee.replace(',', '.'));
    if (isNaN(feeNum) || feeNum < 0) {
      alert('Informe uma taxa válida');
      return;
    }

    await updateSettings({
      ...settings,
      delivery: {
        ...settings.delivery,
        defaultFee: feeNum,
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveNeighborhood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!neighborhoodName.trim() || !neighborhoodFee.trim()) return;

    const feeNum = parseFloat(neighborhoodFee.replace(',', '.'));
    if (isNaN(feeNum) || feeNum < 0) {
      alert('Informe um valor de taxa válido');
      return;
    }

    const item: NeighborhoodFee = {
      id: editingId || `nb-${Date.now()}`,
      name: neighborhoodName.trim(),
      fee: feeNum,
    };

    await saveNeighborhood(item);
    setEditingId(null);
    setNeighborhoodName('');
    setNeighborhoodFee('');
  };

  const handleStartEdit = (n: NeighborhoodFee) => {
    setEditingId(n.id);
    setNeighborhoodName(n.name);
    setNeighborhoodFee(n.fee.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNeighborhoodName('');
    setNeighborhoodFee('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-neutral-700" />
          <span>Taxas de Entrega por Bairro</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Defina a taxa padrão e cadastre valores individuais para cada região de entrega do restaurante.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Default Fee & Add/Edit Form */}
        <div className="space-y-5">
          {/* Card: Default Delivery Fee */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Taxa Padrão (Bairros não cadastrados)
            </h3>
            <p className="text-xs text-neutral-500">
              Caso o cliente selecione ou digite um bairro não listado na tabela, esta taxa será aplicada automaticamente.
            </p>

            <form onSubmit={handleSaveDefaultFee} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Valor da Taxa Padrão (R$)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-neutral-400">
                    R$
                  </span>
                  <input
                    id="input-default-delivery-fee"
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  id="btn-save-default-fee"
                  className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  Atualizar Taxa Padrão
                </button>

                {savedSuccess && (
                  <span className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                    ✓ Salvo!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Card: Add or Edit Neighborhood */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              {editingId ? 'Editar Bairro' : 'Cadastrar Novo Bairro'}
            </h3>

            <form onSubmit={handleSaveNeighborhood} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Nome do Bairro *
                </label>
                <input
                  id="input-neighborhood-name"
                  type="text"
                  required
                  value={neighborhoodName}
                  onChange={(e) => setNeighborhoodName(e.target.value)}
                  placeholder="Ex: Jardim Paulista"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Taxa de Entrega (R$) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-neutral-400">
                    R$
                  </span>
                  <input
                    id="input-neighborhood-fee"
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={neighborhoodFee}
                    onChange={(e) => setNeighborhoodFee(e.target.value)}
                    placeholder="8.50"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  id="btn-submit-neighborhood"
                  className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Salvar Bairro' : 'Adicionar Bairro'}</span>
                </button>

                {editingId && (
                  <button
                    type="button"
                    id="btn-cancel-edit-neighborhood"
                    onClick={handleCancelEdit}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Table of Neighborhoods */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Bairros Cadastrados ({neighborhoods.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Valores aplicados quando o cliente seleciona seu bairro na sacola
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  id="input-search-neighborhoods"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar bairro..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>
            </div>

            {/* Neighborhoods List */}
            <div className="border border-neutral-200/80 rounded-2xl overflow-hidden divide-y divide-neutral-200/60">
              {filteredNeighborhoods.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Nenhum bairro cadastrado com este filtro.
                </div>
              ) : (
                filteredNeighborhoods.map((n) => (
                  <div
                    key={n.id}
                    id={`neighborhood-row-${n.id}`}
                    className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-neutral-900 text-sm">{n.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-neutral-900 bg-neutral-100 px-3 py-1 rounded-xl">
                        {formatCurrency(n.fee)}
                      </span>

                      <button
                        id={`btn-edit-neighborhood-${n.id}`}
                        onClick={() => handleStartEdit(n)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-delete-neighborhood-${n.id}`}
                        onClick={() => {
                          if (confirm(`Deseja remover o bairro "${n.name}"?`)) {
                            deleteNeighborhood(n.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-200"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
