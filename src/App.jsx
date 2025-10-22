import { useState, useEffect, lazy, Suspense } from 'react';
const AdminPanel = lazy(() => import('./Admin'));
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
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
  // Cargar productos desde Firebase en tiempo real
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
    const productsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(productsData);
  });

  return () => unsubscribe();
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
    // Validar que haya stock disponible
    if (!product.stock || product.stock === 0) {
      alert('⚠️ Este producto está agotado');
      return;
    }

    setCart([...cart, { ...product, cartId: Date.now() }]);
    setShowCart(true);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
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
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src="logo.png"
                  alt="GB"
                  className="w-full h-full object-contain p-1"
                />
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
              <a href="https://api.whatsapp.com/send?phone=573134809376" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 transition">
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
            {/* Hero Moderno con Glassmorphism */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
              {/* Fondo animado con formas sutiles */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Círculos animados de fondo - muy sutiles */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

                {/* Grid de fondo */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              </div>

              {/* Contenido principal */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                {/* Logo transparente con resplandor */}
                <div className="mb-8 flex justify-center">
                  <div className="glass-card p-8 rounded-3xl backdrop-blur-xl bg-white/70 border border-blue-200/50 shadow-xl transform hover:scale-105 transition-all duration-500 hover:bg-white/90 hover:shadow-2xl">
                    <img
                      src="logo.png"
                      alt="Green And Blue Ind"
                      className="h-40 md:h-48 w-auto object-contain filter drop-shadow-2xl hover:drop-shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-500"
                    />
                  </div>
                </div>
                    
                  
              
                {/* Título principal con efecto gradient */}
                <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 animate-gradient">
                    Tecnología, seguridad y liderazgo
                  </span>
                  <br />
                  <span className="text-gray-800">
                    para un futuro más inteligente
                  </span>
                </h2>

                {/* Subtítulo con glass effect */}
                <div className="glass-card backdrop-blur-md bg-white/60 border border-blue-200/50 rounded-2xl p-6 max-w-3xl mx-auto mb-10 shadow-xl">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Soluciones integrales en seguridad electrónica, gestión de proyectos y desarrollo de liderazgo para empresas innovadoras.
                  </p>
                </div>

                {/* Botones con efectos modernos */}
                <div className="flex gap-4 justify-center flex-wrap mb-12">
                  <button
                    onClick={() => goToTienda()}
                    className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-bold overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Explorar Tienda
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </button>

                  <a
                    href="https://api.whatsapp.com/send?phone=573134809376"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-bold overflow-hidden shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      📱 Contáctanos
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </a>
                </div>

                {/* Estadísticas con glass cards en una fila */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {[
                    { number: "500+", label: "Proyectos", icon: "✅" },
                    { number: "200+", label: "Clientes", icon: "😊" },
                    { number: "10+", label: "Años", icon: "🏆" },
                    { number: "24/7", label: "Soporte", icon: "🛠️" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="glass-card backdrop-blur-md bg-white/70 border border-blue-200/50 rounded-2xl p-6 hover:bg-white/90 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl"
                    >
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <div className="text-4xl md:text-5xl font-bold mb-2 text-blue-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
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
                          href="https://api.whatsapp.com/send?phone=573134809376"
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
                      href="https://api.whatsapp.com/send?phone=573134809376"
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

                      <div className="mb-4">
                        {p.stock !== undefined && p.stock !== null ? (
                          p.stock > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                <span className="font-semibold text-green-600">✓ Disponible:</span>
                              </span>
                              <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                                {p.stock} unidades
                              </span>
                            </div>
                          ) : (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg px-4 py-3">
                              <p className="text-sm font-semibold text-red-600 text-center">
                                ⚠️ Producto agotado
                              </p>
                            </div>
                          )
                        ) : (
                          <p className="text-sm text-gray-400 italic">Stock no disponible</p>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {p.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <button
                          onClick={() => openProductDetails(p)}
                          className="w-full bg-gray-100 text-gray-800 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
                        >
                          👁️ Ver detalles
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          disabled={!p.stock || p.stock === 0}
                          className={`w-full py-3 rounded-xl font-bold transform ${p.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                            }`}
                        >
                          {p.stock > 0 ? '🛒 Agregar al carrito' : '❌ Sin stock disponible'}
                        </button>
                      </div>
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
                <a href="https://api.whatsapp.com/send?phone=573134809376" target="_blank" rel="noopener noreferrer" className="block hover:text-green-400 transition">WhatsApp</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <div className="space-y-3">
                <a href="https://api.whatsapp.com/send?phone=573134809376" className="flex items-center gap-2 hover:text-green-400 transition">
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
      {/* Modal de detalles del producto */}
      {showProductModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            onClick={() => setShowProductModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
              {/* Header del modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Producto</h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-6">
                {/* Imagen del producto */}
                <div className="mb-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Información principal */}
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-3">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-4xl font-bold text-blue-600 mb-4">
                    ${selectedProduct.price.toLocaleString('es-CO')}
                  </p>
                </div>

                {/* Stock */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  {selectedProduct.stock !== undefined && selectedProduct.stock !== null ? (
                    selectedProduct.stock > 0 ? (
                      <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-xl">
                        <span className="text-green-600 text-2xl">✓</span>
                        <div>
                          <p className="font-semibold text-green-800">Disponible en stock</p>
                          <p className="text-sm text-green-600">{selectedProduct.stock} unidades disponibles</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 bg-red-50 p-4 rounded-xl">
                        <span className="text-red-600 text-2xl">⚠️</span>
                        <div>
                          <p className="font-semibold text-red-800">Producto agotado</p>
                          <p className="text-sm text-red-600">No disponible en este momento</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-gray-500 italic">Stock no disponible</p>
                  )}
                </div>

                {/* Descripción completa */}
                {selectedProduct.description && (
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      📝 <span className="ml-2">Descripción</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* Características */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    ⭐ <span className="ml-2">Características</span>
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">Garantía de 1 año</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">Soporte técnico incluido</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">Instalación profesional disponible</span>
                    </li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setShowProductModal(false);
                    }}
                    disabled={!selectedProduct.stock || selectedProduct.stock === 0}
                    className={`flex-1 py-4 rounded-xl font-bold transition ${selectedProduct.stock > 0
                        ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                      }`}
                  >
                    {selectedProduct.stock > 0 ? '🛒 Agregar al carrito' : '❌ Sin stock'}
                  </button>
                </div>
              </div>
            </div>
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
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Animación de blob para el fondo */
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -50px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(50px, 50px) scale(1.05);
    }
  }
  
  .animate-blob {
    animation: blob 20s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }

  /* Efecto glass (cristal esmerilado) */
  .glass-card {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }

  /* Grid pattern de fondo */
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* Animación de gradiente */
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }
`}</style>
    </div>
  );
}

export default App;