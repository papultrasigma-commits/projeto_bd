import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Menu, X, Star, User, Heart, 
  Trash2, PlusCircle, LogOut, Settings, MapPin, 
  HelpCircle, Truck, Wrench, Percent, Droplets, 
  Hammer, TreePine, Bath, PackageOpen, ChevronRight,
  Image as ImageIcon, ArrowLeft, Edit
} from 'lucide-react';

// ==========================================
// --- COMPONENTES REUTILIZÁVEIS ---
// ==========================================

const SectionTitle = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6 mt-8 border-b-2 border-slate-100 pb-3">
    {Icon && <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Icon size={20} /></div>}
    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
  </div>
);

const ProductCard = ({ product, onAddToCart, onViewProduct }) => (
  <div className="bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group flex flex-col h-full relative p-5">
    <div 
      className="relative flex justify-center items-center bg-slate-50 rounded-lg h-48 mb-5 overflow-hidden p-4 cursor-pointer"
      onClick={() => onViewProduct(product)}
    >
      <img 
        src={product.image || `https://placehold.co/400x400/f8fafc/0f172a?text=${product.name.split(' ')[0]}`} 
        alt={product.name} 
        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
        onError={(e) => { e.target.src = 'https://placehold.co/400?text=Sem+Imagem'; }}
      />
    </div>
    <div className="flex flex-col flex-1">
      <div className="flex text-amber-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-slate-200"} />
        ))}
        <span className="text-slate-400 text-xs ml-2 font-medium">({product.reviews || 12})</span>
      </div>
      <h3 
        onClick={() => onViewProduct(product)}
        className="text-sm text-slate-700 leading-snug mb-4 hover:text-orange-600 cursor-pointer line-clamp-2"
      >
        <span className="font-bold text-slate-900">{product.brand}</span> <br/> {product.name}
      </h3>
      <div className="mt-auto flex justify-between items-end">
        <div>
          <div className="flex items-start text-slate-900">
            <span className="text-3xl font-black">{Math.floor(product.price)}</span>
            <span className="text-sm font-bold mt-1">
              ,{((product.price % 1) * 100).toFixed(0).padStart(2, '0')} €
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="bg-slate-900 text-white p-3 rounded-lg hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
          title="Adicionar ao Carrinho"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  </div>
);

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onUpdateQty }) => {
  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-orange-500" size={24}/>
            <h2 className="text-xl font-bold text-slate-900">O seu carrinho</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ShoppingCart size={48} className="mx-auto mb-4 text-slate-200"/>
              <p className="font-medium">Não tem artigos no carrinho.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center p-2 shrink-0">
                  <img src={item.image || `https://placehold.co/400?text=${item.name.split(' ')[0]}`} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h4 className="text-sm text-slate-800 font-medium line-clamp-2">{item.name}</h4>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-lg font-black text-slate-900">{Number(item.price).toFixed(2)} €</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 h-8">
                        <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center hover:bg-white rounded-l-lg font-bold text-slate-600">-</button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-white rounded-r-lg font-bold text-slate-600">+</button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-slate-600 font-medium">Total a pagar</span>
            <span className="text-3xl font-black text-slate-900">{total.toFixed(2)} €</span>
          </div>
          <button disabled={cartItems.length === 0} className="w-full bg-orange-500 disabled:bg-slate-300 disabled:shadow-none text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">
            FINALIZAR COMPRA
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/login' : '/api/register';
      const body = activeTab === 'login' ? { email, password } : { name, email, password };
      
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (data.success) {
        onLogin(data.user);
        onClose();
        setEmail(''); setPassword(''); setName('');
      } else {
        alert(data.message || 'Erro ao processar o pedido.');
      }
    } catch (err) {
      alert('Erro ao ligar ao servidor. Verifica se o Node.js está a correr na porta 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Área de Cliente</h2>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
            <button onClick={() => setActiveTab('login')} className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Entrar</button>
            <button onClick={() => setActiveTab('register')} className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-all ${activeTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Registar</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome Completo</label>
                <input type="text" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">E-mail</label>
              <input type="email" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Palavra-passe</label>
              <input type="password" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:bg-white outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors mt-6 shadow-lg shadow-slate-200 disabled:opacity-70">
              {loading ? 'A PROCESSAR...' : (activeTab === 'register' ? 'CRIAR CONTA' : 'INICIAR SESSÃO')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// --- PÁGINAS (VIEWS) ---
// ==========================================

// 1. PÁGINA DE DETALHES DO PRODUTO (NOVA)
const ProductDetailView = ({ product, onAddToCart, onBack }) => {
  if (!product) return null;

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-orange-500 font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar aos produtos
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Imagem do Produto */}
        <div className="md:w-1/2 p-8 bg-slate-50 flex items-center justify-center min-h-[400px]">
          <img 
            src={product.image || `https://placehold.co/800?text=${product.name.split(' ')[0]}`} 
            alt={product.name}
            className="max-w-full max-h-[500px] object-contain mix-blend-multiply"
            onError={(e) => { e.target.src = 'https://placehold.co/800?text=Sem+Imagem'; }}
          />
        </div>

        {/* Informações do Produto */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-2 text-orange-500 font-bold uppercase tracking-wider text-sm">
            {product.brand}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-slate-200"} />
              ))}
            </div>
            <span className="text-slate-500 text-sm">({product.reviews || 12} avaliações)</span>
          </div>

          <div className="text-4xl font-black text-slate-900 mb-8">
            {Number(product.price).toFixed(2)} €
          </div>

          <p className="text-slate-600 leading-relaxed mb-8">
            {product.description || "Sem descrição adicional detalhada para este produto de momento. Consulte as especificações técnicas para mais informações do fabricante."}
          </p>

          <div className="mt-auto pt-8 border-t border-slate-100 flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={24} /> Adicionar ao Carrinho
            </button>
            <button className="p-4 border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 rounded-xl transition-colors">
              <Heart size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. PÁGINA INICIAL (HOME)
const HomeView = ({ products, onAddToCart, onViewProduct }) => (
  <div className="animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[340px] shadow-lg group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 opacity-20 blur-[100px] rounded-full mix-blend-screen group-hover:opacity-40 transition-opacity duration-700"></div>
        <div className="relative z-10 max-w-lg">
          <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Nova Estação</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Tudo para renovar <br/>o seu espaço exterior.
          </h2>
          <p className="text-slate-300 mb-8 text-lg">Mobiliário de jardim, churrasqueiras e ferramentas para aproveitar os dias de sol.</p>
          <button className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-colors shadow-lg">
            Ver Coleção de Jardim
          </button>
        </div>
      </div>
      <div className="bg-orange-50 rounded-2xl border border-orange-100 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-300 rounded-full opacity-30 blur-2xl"></div>
        <div className="relative z-10">
          <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-orange-500">
            <Heart size={32} />
          </div>
          <h3 className="text-orange-800 font-bold text-lg mb-1">Clube Brico+</h3>
          <div className="text-4xl font-black text-slate-900 mb-2">15% OFF</div>
          <h4 className="text-slate-800 font-bold mb-4">em todas as tintas de interior</h4>
          <p className="text-xs text-slate-500 mb-6">Exclusivo para clientes com cartão. Válido até fim do mês.</p>
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Aderir Grátis
          </button>
        </div>
      </div>
    </div>
    <SectionTitle title="Mais procurados esta semana" icon={Star} />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map(p => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
      ))}
      {products.length === 0 && (
         <p className="col-span-full text-slate-400">Nenhum produto cadastrado na Base de Dados ainda.</p>
      )}
    </div>
  </div>
);

// 3. PÁGINA DE DESTAQUES
const DestaquesView = ({ products, onAddToCart, onViewProduct }) => {
  const featured = products.slice(0, 2).map(p => ({ ...p, oldPrice: (p.price * 1.3).toFixed(2) })); 
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 md:p-12 mb-10 text-white flex justify-between items-center shadow-lg shadow-orange-200/50">
        <div>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Saldos de Primavera</span>
          <h2 className="text-3xl md:text-4xl font-black mb-3 flex items-center gap-3">
            <Percent size={36} className="text-orange-200" /> Super Oportunidades
          </h2>
          <p className="opacity-90 text-lg max-w-xl">As melhores marcas aos preços mais baixos do ano. Aproveite antes que esgote o stock.</p>
        </div>
        <Star size={100} className="opacity-10 hidden md:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featured.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border-2 border-orange-100 flex flex-col sm:flex-row gap-6 items-center hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer" onClick={() => onViewProduct(p)}>
            <div className="bg-slate-50 rounded-xl p-4 shrink-0 w-40 h-40 flex items-center justify-center">
               <img src={p.image || `https://placehold.co/400?text=${p.name.split(' ')[0]}`} className="max-h-full max-w-full object-contain mix-blend-multiply" alt={p.name} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-red-500 font-bold text-xs uppercase italic tracking-wider">Promoção Limitada</span>
              <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2 leading-tight hover:text-orange-600">{p.name}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 mb-4">
                <span className="text-3xl font-black text-orange-600">{p.price}€</span>
                <span className="text-slate-400 line-through text-sm">{p.oldPrice}€</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-md"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <SectionTitle title="Todos os Produtos em Promoção" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
           <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
        ))}
      </div>
    </div>
  );
};

// 4. PÁGINA DE CATEGORIA GENÉRICA
const CategoriaView = ({ title, icon: Icon, categoryKey, products, onAddToCart, onViewProduct }) => {
  const filteredProducts = products.filter(p => p.category_name === categoryKey);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 bg-slate-100 text-slate-700 rounded-xl">
          <Icon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">{title}</h2>
          <p className="text-slate-500">Explore a nossa gama completa de {title.toLowerCase()}.</p>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Sem produtos nesta categoria</h3>
          <p className="text-slate-500">Estamos a atualizar o nosso stock. Volte em breve!</p>
        </div>
      )}
    </div>
  );
};

// 5. PÁGINA DE INVENTÁRIO (ADMIN - TABELA)
const AdminInventoryView = ({ products, onAddClick, onEditClick, onDeleteProduct }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <Settings size={32} className="text-orange-500" />
          <div>
            <h2 className="text-2xl font-black">Painel de Gestão BricoLoja</h2>
            <p className="text-slate-400 text-sm">Gestão de inventário ligada diretamente ao PostgreSQL.</p>
          </div>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} /> Adicionar Produto
        </button>
      </div>

      {/* Tabela de Inventário */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-900">Inventário Atual ({products.length} artigos na BD)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Produto</th>
                <th className="p-4 font-bold">Categoria (DB)</th>
                <th className="p-4 font-bold">Preço</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-slate-400 font-mono">#{p.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center p-1 shrink-0">
                        <img src={p.image || `https://placehold.co/400?text=${p.name.split(' ')[0]}`} className="max-h-full max-w-full mix-blend-multiply" alt=""/>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium capitalize">
                      {p.category_name || `Cat ID: ${p.category_id}`}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{Number(p.price).toFixed(2)} €</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEditClick(p)}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center gap-1 font-medium"
                        title="Editar Produto"
                      >
                        <Edit size={16} /> Editar
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center gap-1 font-medium"
                        title="Apagar Produto da Base de Dados"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                 <tr>
                   <td colSpan="5" className="p-8 text-center text-slate-400">A Base de Dados não devolveu nenhum produto.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. PÁGINA DE FORMULÁRIO (ADMIN - ADICIONAR/EDITAR)
const AdminFormView = ({ productToEdit, onSave, onCancel }) => {
  const isEditing = !!productToEdit;
  
  const [formData, setFormData] = useState(
    productToEdit || { name: '', brand: '', price: '', category_id: 1, image: '', description: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      category_id: parseInt(formData.category_id)
    });
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Voltar ao Inventário
      </button>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
          {isEditing ? <Edit size={24} className="text-blue-500"/> : <PlusCircle size={24} className="text-orange-500"/>}
          {isEditing ? `Editar Produto: ${formData.name}` : 'Registar Novo Produto'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome do Produto</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Ex: Berbequim 700W" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Marca</label>
            <input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Ex: BOSCH" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Categoria</label>
            <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all">
              <option value={1}>Ferramentas</option>
              <option value={2}>Pintura / Tintas</option>
              <option value={3}>Casa de Banho</option>
              <option value={4}>Jardim e Exterior</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Preço (€)</label>
            <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Link da Imagem (URL)</label>
            <div className="relative">
              <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="http://..." />
            </div>
          </div>
          <div className="md:col-span-2">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descrição (Opcional)</label>
             <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Detalhes técnicos do produto..."></textarea>
          </div>
          
          <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-slate-100 pt-6">
             <button type="button" onClick={onCancel} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
               Cancelar
             </button>
             <button type="submit" className="bg-slate-900 hover:bg-orange-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-slate-200">
               {isEditing ? 'Guardar Alterações' : 'Criar Produto'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// --- APLICAÇÃO PRINCIPAL (APP) ---
// ==========================================

export default function App() {
  // Estados da Aplicação
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  
  // Controlo de Navegação
  const [view, setView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null); // Para ver detalhes
  const [editingProduct, setEditingProduct] = useState(null);   // Para formulário admin
  
  // Estados de UI
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSimaoAdmin = user?.is_admin === true;

  useEffect(() => {
    if ((view === 'admin' || view === 'admin-form') && !isSimaoAdmin) {
      setView('home');
    }
  }, [view, isSimaoAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/products');
      if (!res.ok) throw new Error('Falha a conectar ao backend');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro a carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Lógica do Carrinho ---
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Lógica de Admin ---
  const handleSaveProduct = async (productData) => {
    try {
      const url = productData.id ? `http://localhost:3000/api/products/${productData.id}` : 'http://localhost:3000/api/products';
      const method = productData.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'user-email': user.email
        },
        body: JSON.stringify(productData)
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      fetchProducts();
      setView('admin'); // Voltar à tabela após guardar
    } catch (error) {
      console.error(error);
      alert('Erro ao gravar na Base de Dados.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Tem a certeza que deseja apagar este produto?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'user-email': user.email }
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao eliminar na Base de Dados.');
    }
  };

  // Funções Auxiliares para Navegação
  const changeView = (newView) => { 
    setView(newView); 
    setMobileMenuOpen(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    changeView('product-detail');
  };

  const navItemClass = (targetView) => `text-sm font-medium transition-colors whitespace-nowrap px-3 py-2 rounded-lg ${view === targetView ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`;

  // --- Renderização Dinâmica das Páginas ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl"></div>)}
        </div>
      );
    }

    switch(view) {
      case 'product-detail':
        return <ProductDetailView product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => changeView('home')} />;
      case 'destaques':
        return <DestaquesView products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
      // Aqui foi corrigido para 'ferramentas' para bater certo com os botões
      case 'ferramentas':
        return <CategoriaView title="Ferramentas" icon={Hammer} categoryKey="ferramentas" products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
      case 'jardim':
        return <CategoriaView title="Jardim e Exterior" icon={TreePine} categoryKey="jardim" products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
      case 'tintas':
        return <CategoriaView title="Tintas e Drogaria" icon={Droplets} categoryKey="pintura" products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
      case 'banho':
        return <CategoriaView title="Casa de Banho" icon={Bath} categoryKey="banho" products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
      
      // Novas Views de Admin Separadas
      case 'admin':
        return isSimaoAdmin ? <AdminInventoryView products={products} onAddClick={() => { setEditingProduct(null); changeView('admin-form'); }} onEditClick={(p) => { setEditingProduct(p); changeView('admin-form'); }} onDeleteProduct={handleDeleteProduct} /> : null;
      case 'admin-form':
        return isSimaoAdmin ? <AdminFormView productToEdit={editingProduct} onSave={handleSaveProduct} onCancel={() => changeView('admin')} /> : null;
      
      case 'home':
      default:
        return <HomeView products={products} onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />;
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      <div className="bg-slate-900 text-slate-300 text-xs md:text-sm py-2 px-4 flex justify-center items-center gap-2 font-medium">
        <Truck size={16} className="text-orange-500 shrink-0" />
        <span className="text-center">Campanha de Primavera: <strong className="text-white">Portes Grátis</strong> em encomendas superiores a 50€.</span>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 lg:py-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-8">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
            <div onClick={() => changeView('home')} className="flex items-center gap-3 cursor-pointer shrink-0 group">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-6 transition-transform">
                <Wrench size={20} className="text-white" />
              </div>
              <div className="leading-none">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Brico<span className="text-orange-500">Loja</span></h1>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3 text-sm text-slate-500 cursor-pointer hover:text-orange-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="bg-white p-1.5 rounded-md shadow-sm">
               <MapPin size={18} className="text-slate-700" />
            </div>
            <div className="flex flex-col leading-tight pr-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">A sua loja</span>
              <span className="font-medium text-slate-700">Leiria - Zona Ind.</span>
            </div>
          </div>

          <div className="order-last lg:order-none w-full lg:flex-1 relative group">
            <input 
              type="text" 
              placeholder="Pesquisar ferramentas, materiais, decoração..." 
              className="w-full border-2 border-slate-100 rounded-xl py-3.5 pl-5 pr-14 focus:outline-none focus:border-orange-500 bg-slate-50 focus:bg-white text-sm transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2 rounded-lg hover:bg-orange-500 transition-colors">
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <button className="hidden md:flex flex-col items-center justify-center w-16 h-14 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors gap-1">
              <HelpCircle size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-bold">Ajuda</span>
            </button>
            
            {user ? (
               <div className="relative group">
                 <button className="flex flex-col items-center justify-center w-14 md:w-16 h-14 rounded-lg text-orange-600 bg-orange-50 transition-colors gap-1">
                    <User size={22} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold hidden md:block w-full truncate px-1">{user.name.split(' ')[0]}</span>
                 </button>
                 <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                    <div className="p-3 border-b border-slate-100 mb-2">
                      <p className="text-xs text-slate-500">Sessão iniciada como</p>
                      <p className="font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    {isSimaoAdmin && (
                      <button onClick={() => changeView('admin')} className="w-full text-left p-3 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center gap-2 text-slate-700">
                        <Settings size={18} className="text-orange-500"/> Painel de Gestão
                      </button>
                    )}
                    <button onClick={() => {setUser(null); changeView('home');}} className="w-full text-left p-3 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600 flex items-center gap-2 mt-1"><LogOut size={18}/> Terminar Sessão</button>
                 </div>
               </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="flex flex-col items-center justify-center w-14 md:w-16 h-14 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors gap-1">
                <User size={22} strokeWidth={1.5} />
                <span className="text-[10px] font-bold hidden md:block">Conta</span>
              </button>
            )}

            <button className="hidden md:flex flex-col items-center justify-center w-16 h-14 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors gap-1">
              <Heart size={22} strokeWidth={1.5} />
              <span className="text-[10px] font-bold">Favoritos</span>
            </button>
            
            <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center w-14 md:w-16 h-14 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors gap-1 relative">
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} className={cartCount > 0 ? "text-slate-900" : ""} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold hidden md:block mt-1">Carrinho</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Categorias (Desktop) - Atualizado para "ferramentas" */}
      <nav className="bg-white border-b border-slate-200 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-3 scrollbar-hide">
          <button onClick={() => changeView('home')} className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${view === 'home' ? 'bg-slate-900 text-white' : 'text-slate-900 bg-slate-100 hover:bg-slate-200'}`}>
            <Menu size={18} /> Início
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <button onClick={() => changeView('destaques')} className={`text-sm font-bold flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${view === 'destaques' ? 'bg-orange-50 text-orange-600' : 'text-orange-600 hover:bg-orange-50'}`}>
            <Star size={14} className="fill-orange-600"/> Destaques
          </button>
          <button onClick={() => changeView('ferramentas')} className={navItemClass('ferramentas')}>Ferramentas</button>
          <button onClick={() => changeView('jardim')} className={navItemClass('jardim')}>Jardim e Exterior</button>
          <button onClick={() => changeView('tintas')} className={navItemClass('tintas')}>Tintas e Drogaria</button>
          <button onClick={() => changeView('banho')} className={navItemClass('banho')}>Casa de Banho</button>
          <div className="flex-1"></div>
          <button className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 transition-colors">Outlet -50%</button>
        </div>
      </nav>

      {/* Menu Categorias (Mobile) - Atualizado para "ferramentas" */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top-4">
          <button onClick={() => changeView('home')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left font-bold text-slate-900">Início <ChevronRight size={16} className="text-slate-400"/></button>
          <button onClick={() => changeView('destaques')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-orange-50 text-left font-bold text-orange-600">Destaques Promo <ChevronRight size={16} className="text-orange-400"/></button>
          <button onClick={() => changeView('ferramentas')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left text-slate-700">Ferramentas <ChevronRight size={16} className="text-slate-400"/></button>
          <button onClick={() => changeView('jardim')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left text-slate-700">Jardim e Exterior <ChevronRight size={16} className="text-slate-400"/></button>
          <button onClick={() => changeView('tintas')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left text-slate-700">Tintas e Drogaria <ChevronRight size={16} className="text-slate-400"/></button>
          <button onClick={() => changeView('banho')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 text-left text-slate-700">Casa de Banho <ChevronRight size={16} className="text-slate-400"/></button>
        </div>
      )}

      {/* Área de Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {renderContent()}
      </main>

      {/* Footer (Mantém-se igual) */}
      <footer className="bg-white border-t border-slate-200 mt-auto pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
           <div>
             <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => changeView('home')}>
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                 <Wrench size={16} className="text-white" />
               </div>
               <span className="text-xl font-black text-slate-900">BricoLoja</span>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed mb-6">
               A sua loja de confiança para projetos de construção, renovação e decoração. Ferramentas profissionais para resultados perfeitos.
             </p>
           </div>
           
           <div>
             <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Empresa</h4>
             <ul className="space-y-3 text-sm text-slate-600">
               <li><a href="#" className="hover:text-orange-500 transition-colors">Sobre Nós</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Sustentabilidade ambiental</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Trabalhar na BricoLoja</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Lojas Físicas</a></li>
             </ul>
           </div>
           
           <div>
             <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Serviços e Apoio</h4>
             <ul className="space-y-3 text-sm text-slate-600">
               <li><a href="#" className="hover:text-orange-500 transition-colors">Condições de Entrega</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Devoluções e Reembolsos</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Serviço de Montagem</a></li>
               <li><a href="#" className="hover:text-orange-500 transition-colors">Perguntas Frequentes</a></li>
             </ul>
           </div>

           <div>
             <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Pagamento Seguro</h4>
             <div className="flex gap-2 flex-wrap mb-6">
               <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-bold text-slate-600">MULTIBANCO</div>
               <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-bold text-slate-600">MBWAY</div>
               <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-bold text-slate-600">VISA</div>
             </div>
             <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm">
                <p className="font-bold text-orange-800 mb-1">Precisa de ajuda?</p>
                <p className="text-orange-600">Ligue 800 123 456<br/><span className="text-xs opacity-80">(Chamada gratuita)</span></p>
             </div>
           </div>
        </div>
        <div className="container mx-auto px-4 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 BricoLoja Portugal. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600">Termos e Condições</a>
            <a href="#" className="hover:text-slate-600">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* Modais e Overlays */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemove={handleRemoveFromCart} onUpdateQty={handleUpdateQty} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={setUser} />
      
    </div>
  );
}