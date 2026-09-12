import React, { useState } from 'react';
import { 
  Palette, 
  Upload, 
  Sparkles, 
  Check, 
  Store, 
  Phone, 
  FileText, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { extractColorsFromImage } from '../../utils/colorExtractor';

export const VisualIdentityManager: React.FC = () => {
  const { settings, updateSettings } = useRestaurant();
  const { visual } = settings;

  const [restaurantName, setRestaurantName] = useState(visual.restaurantName);
  const [phone, setPhone] = useState(visual.phone);
  const [slogan, setSlogan] = useState(visual.slogan || '');
  const [addressSummary, setAddressSummary] = useState(visual.addressSummary || '');
  const [logoUrl, setLogoUrl] = useState(visual.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(visual.primaryColor || '#E11D48');
  const [secondaryColor, setSecondaryColor] = useState(visual.secondaryColor || '#0F172A');

  const [isExtracting, setIsExtracting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File upload handler (converts to base64 DataURL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setLogoUrl(dataUrl);
      // Automatically extract colors on logo upload!
      await handleExtractColors(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Color extraction handler
  const handleExtractColors = async (targetLogoSrc?: string) => {
    const src = targetLogoSrc || logoUrl;
    if (!src) {
      alert('Informe ou envie uma logo primeiro!');
      return;
    }

    setIsExtracting(true);
    try {
      const colors = await extractColorsFromImage(src);
      setPrimaryColor(colors.primary);
      setSecondaryColor(colors.secondary);
    } catch (err) {
      console.warn('Erro ao extrair cores:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      visual: {
        ...settings.visual,
        restaurantName: restaurantName.trim(),
        phone: phone.replace(/\D/g, ''),
        slogan: slogan.trim(),
        addressSummary: addressSummary.trim(),
        logoUrl: logoUrl.trim(),
        primaryColor,
        secondaryColor,
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h2 className="text-lg font-extrabold text-neutral-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-neutral-700" />
          <span>Identidade Visual & Marca</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Personalize a logo, extraia cores automaticamente e defina o nome exibido no app do cliente.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Configs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card: Basic Brand Info */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-500" />
              Nome e Informações do Restaurante
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Nome do Restaurante * (visível no app do cliente)
                </label>
                <input
                  id="admin-visual-restaurant-name"
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Ex: Bassa Burger & Grill"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  WhatsApp do Restaurante * (receber pedidos)
                </label>
                <input
                  id="admin-visual-phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 5511999998888 (com DDI e DDD)"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Número para onde o cliente enviará a mensagem do pedido.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Slogan ou Frase de Destaque
                </label>
                <input
                  id="admin-visual-slogan"
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Ex: O melhor hambúrguer artesanal da cidade"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Endereço Resumido (cabeçalho)
                </label>
                <input
                  id="admin-visual-address"
                  type="text"
                  value={addressSummary}
                  onChange={(e) => setAddressSummary(e.target.value)}
                  placeholder="Ex: Av. Paulista, 1500 - São Paulo"
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                />
              </div>
            </div>
          </div>

          {/* Card: Logo & Automatic Color Extraction */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Logo & Extração Automática de Cores
            </h3>

            <div className="space-y-4 text-xs">
              {/* Logo Upload / URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Fazer Upload da Imagem da Logo
                  </label>
                  <label className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100">
                    <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                    <span className="font-bold text-neutral-700 text-xs">
                      Clique para escolher imagem
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">
                      PNG, JPG ou WEBP (até 2MB)
                    </span>
                    <input
                      id="input-upload-logo-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Ou digite a URL da Logo
                  </label>
                  <input
                    id="admin-visual-logo-url"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400/20"
                  />

                  <button
                    type="button"
                    id="btn-auto-extract-colors"
                    onClick={() => handleExtractColors()}
                    disabled={isExtracting || !logoUrl}
                    className="mt-3 w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isExtracting ? 'animate-spin' : ''}`} />
                    <span>{isExtracting ? 'Analisando Pixels da Logo...' : 'Extrair Cores Automaticamente da Logo'}</span>
                  </button>
                </div>
              </div>

              {/* Color Pickers (Primary & Secondary) */}
              <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-800 block text-xs">
                      Cor Primária (Destaques & Botões)
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="admin-color-primary-picker"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-neutral-300 cursor-pointer p-0.5"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-800 block text-xs">
                      Cor Secundária (Fundo & Contraste)
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      {secondaryColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="admin-color-secondary-picker"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-neutral-300 cursor-pointer p-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              id="btn-save-visual-identity"
              className="py-3 px-6 rounded-xl text-white font-extrabold text-sm shadow-md transition-all active:scale-98 flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="w-4 h-4" />
              <span>Salvar Identidade Visual</span>
            </button>

            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                ✓ Alterações salvas e aplicadas ao app do cliente!
              </span>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live Interactive Visual Identity Preview */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-neutral-500" />
              Prévia em Tempo Real no App
            </h3>
            <p className="text-[11px] text-neutral-500">
              Veja exatamente como o cabeçalho, logo e botões aparecem para o cliente final.
            </p>

            {/* Simulated Smartphone Screen */}
            <div className="border border-neutral-200 rounded-3xl p-3 bg-neutral-100/60 shadow-inner space-y-3">
              {/* Header preview */}
              <div className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: `${primaryColor}40` }}
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-neutral-600 text-sm">
                        {restaurantName.slice(0, 1)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-neutral-900 line-clamp-1">
                      {restaurantName || 'Nome do Restaurante'}
                    </h4>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ● Aberto agora
                    </span>
                  </div>
                </div>

                <div 
                  className="px-2.5 py-1 rounded-lg text-white font-bold text-[10px]"
                  style={{ backgroundColor: primaryColor }}
                >
                  Sacola
                </div>
              </div>

              {/* Sample Product Card preview */}
              <div className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-xs space-y-2">
                <div className="h-24 bg-neutral-100 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80"
                    alt="Burger"
                    className="w-full h-full object-cover"
                  />
                  <span 
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Destaque
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-bold text-xs block text-neutral-900">Smash Burger</span>
                    <span className="text-xs font-extrabold" style={{ color: primaryColor }}>
                      R$ 38,90
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
