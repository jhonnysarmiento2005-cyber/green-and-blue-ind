import { useState, useEffect, lazy, Suspense } from 'react';
const AdminPanel = lazy(() => import('./Admin.jsx'));

// Datos de productos
const getProducts = () => {
  const saved = localStorage.getItem('green_blue_products');
  if (saved) {
    return JSON.parse(saved);
  }
  // Productos por defecto si no hay nada guardado
  return [
    { id: 1, name: "Cámara IP 4MP", category: "CCTV", price: 250000, image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400" },
    { id: 2, name: "Grabador NVR 8ch", category: "CCTV", price: 400000, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400" },
    { id: 3, name: "Lector Biométrico", category: "Control de Acceso", price: 320000, image: "https://images.unsplash.com/photo-1614064548392-d21f89090b7b?w=400" },
    { id: 4, name: "Panel de Control", category: "Seguridad Electrónica", price: 450000, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400" },
    { id: 5, name: "Cámara Domo PTZ", category: "CCTV", price: 550000, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400" },
    { id: 6, name: "Control de Acceso Facial", category: "Control de Acceso", price: 680000, image: "https://images.unsplash.com/photo-1560732488-6b0df240254a?w=400" },
  ];
};
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(getProducts());
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Detectar si estamos en la ruta de administración
   // Ruta de administración
if (window.location.hash === '#admin') {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          ⏳ Cargando panel de administración...
        </div>
      </div>
    }>
      <AdminPanel />
    </Suspense>
  );
}
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Actualizar productos cuando cambien en localStorage
  useEffect(() => {
    const updateProducts = () => {
      const newProducts = getProducts();
      setProducts(newProducts);
    };
    
    // Revisar cada segundo si hay cambios
    const interval = setInterval(updateProducts, 1000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMobileMenuOpen(false);
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const total = cart.reduce((acc, p) => acc + p.price, 0);

  const sendToWhatsApp = () => {
    const msg = encodeURIComponent(
      "🛒 *Hola, deseo cotizar los siguientes productos:*\n\n" +
        cart.map(p => `• ${p.name} - $${p.price.toLocaleString('es-CO')}`).join("\n") +
        `\n\n💰 *Total: $${total.toLocaleString('es-CO')} COP*`
    );
    window.open(`https://wa.me/573134809376?text=${msg}`, "_blank");
  };

  const filtered = products.filter(
    (p) =>
      (filter === 'Todos' || p.category === filter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const goToTienda = (category = 'Todos') => {
    setFilter(category);
    setCurrentPage('tienda');
    window.scrollTo(0, 0);
  };

  const goToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={goToHome} className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                GB
              </div>
              <h1 className="text-xl font-bold text-gray-900">Green And Blue Ind</h1>
            </button>
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={goToHome}
                className={`${currentPage === 'home' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'} transition`}
              >
                Inicio
              </button>
              <button 
                onClick={() => goToTienda()}
                className={`${currentPage === 'tienda' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'} transition`}
              >
                Tienda
              </button>
              <a href="https://wa.me/573134809376" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 transition">
                WhatsApp
              </a>
              <a href="mailto:greenandblue@gmail.com" className="text-gray-600 hover:text-blue-600 transition">
                Correo
              </a>
            </nav>
            {currentPage === 'tienda' && (
              <button 
                onClick={() => setShowCart(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
              >
                🛒 <span className="hidden sm:inline">Carrito</span> ({cart.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="pt-16">
        {currentPage === 'home' ? (
          <div>
            {/* Hero Mejorado */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-32 px-6 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="mb-8 flex justify-center">
                  <img 
                    src="logo.png" 
                    alt="Green And Blue Ind" 
                    className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div style={{display: 'none'}} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">GB</span>
                      </div>
                      <div className="text-left">
                        <div className="text-3xl font-bold text-white" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                          <span className="text-green-400">Green</span> <span className="text-blue-300">And Blue</span> <span className="text-gray-200">Ind.</span>
                        </div>
                        <div className="text-sm text-blue-200 font-medium">INNOVACIÓN • TECNOLOGÍA • SOSTENABILIDAD</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{fontFamily: "'Space Grotesk', 'Inter', sans-serif"}}>
                  Tecnología, seguridad y liderazgo para un futuro más inteligente
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Soluciones integrales en seguridad electrónica, gestión de proyectos y desarrollo de liderazgo para empresas innovadoras.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button 
                    onClick={() => goToTienda()}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition transform hover:scale-105"
                  >
                    Explorar Tienda →
                  </button>
                  <a 
                    href="https://wa.me/573134809376"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-600 transition transform hover:scale-105"
                  >
                    📱 Contáctanos
                  </a>
                </div>
              </div>
            </section>

            {/* Estadísticas - Banner Único */}
            <section className="relative -mt-16 px-6 z-10">
              <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-3xl shadow-2xl p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                  {[
                    { number: "500+", label: "Proyectos Completados", icon: "✅" },
                    { number: "200+", label: "Clientes Satisfechos", icon: "😊" },
                    { number: "10+", label: "Años de Experiencia", icon: "🏆" },
                    { number: "24/7", label: "Soporte Técnico", icon: "🛠️" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <div className="text-4xl md:text-5xl font-bold mb-1" style={{fontFamily: "'Space Grotesk', sans-serif"}}>{stat.number}</div>
                      <div className="text-blue-100 font-medium text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Servicios Mejorados */}
            <section className="py-24 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="text-5xl font-bold mb-4 text-gray-900" style={{fontFamily: "'Space Grotesk', 'Inter', sans-serif"}}>Nuestros Servicios</h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Ofrecemos soluciones completas y personalizadas para cada necesidad de tu empresa
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 mx-auto">
                  {[
                    { 
                      icon: "📹", 
                      title: "Seguridad Electrónica", 
                      desc: "Sistemas avanzados de seguridad con tecnología de última generación.",
                      hasProducts: true,
                      category: "Seguridad Electrónica",
                      color: "blue"
                    },
                    { 
                      icon: "🔐", 
                      title: "Control de Acceso", 
                      desc: "Soluciones biométricas y RFID para gestión eficiente de accesos.",
                      hasProducts: true,
                      category: "Control de Acceso",
                      color: "green"
                    },
                    { 
                      icon: "📡", 
                      title: "CCTV", 
                      desc: "Monitoreo inteligente 24/7 con cámaras IP de alta definición.",
                      hasProducts: true,
                      category: "CCTV",
                      color: "purple"
                    },
                    { 
                      icon: "📊", 
                      title: "Gestión de Proyectos", 
                      desc: "Planificación y optimización técnica de proyectos complejos.",
                      hasProducts: false,
                      color: "orange"
                    },
                    { 
                      icon: "🎓", 
                      title: "Capacitaciones", 
                      desc: "Formación en liderazgo y sistemas electrónicos avanzados.",
                      hasProducts: false,
                      color: "pink"
                    },
                    { 
                      icon: "💼", 
                      title: "Consultoría", 
                      desc: "Asesoría técnica para proyectos de innovación tecnológica.",
                      hasProducts: false,
                      color: "cyan"
                    },
                  ].map((s, i) => (
                    <div key={i} className="service-card group relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-transparent overflow-hidden cursor-pointer">
                      {/* Fondo animado */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        s.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        s.color === 'green' ? 'from-green-500 to-green-600' :
                        s.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        s.color === 'orange' ? 'from-orange-500 to-orange-600' :
                        s.color === 'pink' ? 'from-pink-500 to-pink-600' :
                        'from-cyan-500 to-cyan-600'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Contenido */}
                      <div className="relative z-10">
                        <div className="flex justify-center mb-3">
                          <div className="text-5xl transform transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 group-hover:drop-shadow-lg">
                            {s.icon}
                          </div>
                        </div>
                        <h4 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-white transition-colors duration-300 text-center" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                          {s.title}
                        </h4>
                        <p className="text-gray-600 group-hover:text-white/90 mb-4 text-sm leading-relaxed text-center transition-colors duration-300">
                          {s.desc}
                        </p>
                      </div>
                      
                      {/* Botón */}
                      {s.hasProducts ? (
                        <button
                          onClick={() => goToTienda(s.category)}
                          className="relative z-10 w-full bg-gray-800 group-hover:bg-white text-white group-hover:text-gray-900 py-2.5 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 text-sm shadow-lg"
                        >
                          Ver productos →
                        </button>
                      ) : (
                        <a
                          href="https://wa.me/573134809376"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 block w-full bg-gray-800 group-hover:bg-white text-white group-hover:text-gray-900 py-2.5 rounded-xl font-semibold text-center transition-all duration-300 transform group-hover:scale-105 text-sm shadow-lg"
                        >
                          Contactar →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sección Por qué elegirnos */}
            <section className="py-20 px-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="text-5xl font-bold mb-4 text-gray-900" style={{fontFamily: "'Space Grotesk', 'Inter', sans-serif"}}>¿Por qué elegirnos?</h3>
                  <p className="text-gray-600 text-lg">Somos líderes en soluciones tecnológicas de seguridad</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    {[
                      { icon: "⚡", title: "Implementación Rápida", desc: "Instalamos y configuramos en tiempo récord sin afectar tus operaciones." },
                      { icon: "🎯", title: "Soluciones Personalizadas", desc: "Cada proyecto se adapta a tus necesidades específicas." },
                      { icon: "🔒", title: "Máxima Seguridad", desc: "Utilizamos equipos certificados y protocolos de encriptación avanzados." },
                      { icon: "💡", title: "Innovación Constante", desc: "Actualizamos nuestras soluciones con la última tecnología." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-start p-4 bg-white rounded-2xl hover:bg-blue-50 transition shadow-md hover:shadow-lg">
                        <div className="text-4xl">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-lg mb-1" style={{fontFamily: "'Space Grotesk', sans-serif"}}>{item.title}</h4>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-12 text-white text-center shadow-2xl">
                    <h4 className="text-4xl font-bold mb-6" style={{fontFamily: "'Space Grotesk', sans-serif"}}>¿Listo para comenzar?</h4>
                    <p className="text-blue-100 mb-8 text-lg">
                      Cotiza tu proyecto sin compromiso y recibe una propuesta personalizada en 24 horas.
                    </p>
                    <a
                      href="https://wa.me/573134809376"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105"
                    >
                      📱 Solicitar Cotización
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          // Tienda
          <div className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold mb-2 text-gray-900" style={{fontFamily: "'Space Grotesk', 'Inter', sans-serif"}}>Nuestra Tienda</h2>
                <p className="text-gray-600 text-lg">Encuentra los mejores equipos de seguridad electrónica</p>
              </div>

              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                  type="text"
                  placeholder="🔍 Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <div className="flex gap-2 flex-wrap">
                  {['Todos', 'CCTV', 'Control de Acceso', 'Seguridad Electrónica'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-6 py-3 rounded-xl border-2 transition font-semibold ${
                        filter === cat 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-600 hover:shadow'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Productos */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((p) => (
                  <div key={p.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-56 object-cover transition-transform hover:scale-110" />
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Nuevo
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 bg-gray-100 inline-block px-3 py-1 rounded-full">{p.category}</p>
                      <p className="text-blue-600 font-bold text-2xl mb-4">${p.price.toLocaleString('es-CO')}</p>
                      <button
                        onClick={() => addToCart(p)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-bold transform hover:scale-105"
                      >
                        🛒 Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-xl">No se encontraron productos</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  GB
                </div>
                <span className="text-xl font-bold text-white">Green And Blue Ind</span>
              </div>
              <p className="text-gray-400">Soluciones tecnológicas de seguridad para un futuro más inteligente.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <button onClick={goToHome} className="block hover:text-blue-400 transition">Inicio</button>
                <button onClick={() => goToTienda()} className="block hover:text-blue-400 transition">Tienda</button>
                <a href="https://wa.me/573134809376" target="_blank" rel="noopener noreferrer" className="block hover:text-green-400 transition">WhatsApp</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <div className="space-y-3">
                <a href="https://wa.me/573134809376" className="flex items-center gap-2 hover:text-green-400 transition">
                  <span>📱</span> +57 313 480 9376
                </a>
                <a href="mailto:greenandblue@gmail.com" className="flex items-center gap-2 hover:text-blue-400 transition">
                  <span>✉️</span> greenandblue@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p>© {new Date().getFullYear()} Green And Blue Ind. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {showCart && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">🛒 Tu carrito</h2>
              <button onClick={() => setShowCart(false)} className="text-white hover:text-gray-200 text-3xl font-bold">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 items-center border-b pb-4 hover:bg-gray-50 p-2 rounded-lg transition">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-blue-600 font-bold">${item.price.toLocaleString('es-CO')}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="mb-6 bg-white p-4 rounded-xl shadow">
                  <p className="text-lg font-bold flex justify-between items-center">
                    <span className="text-gray-700">Total:</span>
                    <span className="text-blue-600 text-2xl">${total.toLocaleString('es-CO')}</span>
                  </p>
                </div>
                <button 
                  onClick={sendToWhatsApp}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition font-bold text-lg flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
                >
                  📱 Enviar por WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;