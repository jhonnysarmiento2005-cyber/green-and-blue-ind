import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// Contraseña de acceso (cámbiala por la que quieras)
const ADMIN_PASSWORD = "GreenBlue2024";

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
  // Escuchar cambios en tiempo real desde Firebase
  const unsubscribe = onSnapshot(collection(db, 'products'), async (snapshot) => {
    const productsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    if (productsData.length === 0) {
      // Si no hay productos, crear los productos por defecto
      const defaultProducts = [
        { name: "Cámara IP 4MP", category: "CCTV", price: 250000, image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400" },
        { name: "Grabador NVR 8ch", category: "CCTV", price: 400000, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400" },
        { name: "Lector Biométrico", category: "Control de Acceso", price: 320000, image: "https://images.unsplash.com/photo-1614064548392-d21f89090b7b?w=400" },
        { name: "Panel de Control", category: "Seguridad Electrónica", price: 450000, image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400" },
        { name: "Cámara Domo PTZ", category: "CCTV", price: 550000, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400" },
        { name: "Control de Acceso Facial", category: "Control de Acceso", price: 680000, image: "https://images.unsplash.com/photo-1560732488-6b0df240254a?w=400" },
      ];
      
      // Agregar productos por defecto a Firebase
      for (const product of defaultProducts) {
        await addDoc(collection(db, 'products'), product);
      }
    } else {
      setProducts(productsData);
    }
  });

  return () => unsubscribe();
}, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('❌ Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };



 const handleAddProduct = () => {
  setEditingProduct({
    id: null,
    name: '',
    category: 'CCTV',
    price: 0,
    image: ''
  });
  setShowForm(true);
};
  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
  if (!editingProduct.name || !editingProduct.price || !editingProduct.image) {
    alert('⚠️ Por favor completa todos los campos');
    return;
  }

  try {
    if (editingProduct.id && products.some(p => p.id === editingProduct.id)) {
      // Actualizar producto existente
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        image: editingProduct.image
      });
    } else {
      // Agregar nuevo producto
      await addDoc(collection(db, 'products'), {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        image: editingProduct.image
      });
    }
    
    setShowForm(false);
    setEditingProduct(null);
  } catch (error) {
    console.error("Error guardando producto:", error);
    alert('❌ Error al guardar el producto');
  }
};
  const handleDeleteProduct = async (id) => {
  if (window.confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert('❌ Error al eliminar el producto');
    }
  }
};
  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_green_blue.json';
    link.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              GB
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
              Panel de Administración
            </h1>
            <p className="text-gray-600">Green And Blue Ind</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña de acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              🔐 Iniciar Sesión
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              🔒 Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              GB
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">Gestión de productos</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-3xl font-bold mb-1">{products.length}</div>
            <div className="text-blue-100">Productos totales</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-4xl mb-2">📹</div>
            <div className="text-3xl font-bold mb-1">{products.filter(p => p.category === 'CCTV').length}</div>
            <div className="text-green-100">Productos CCTV</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-4xl mb-2">🔐</div>
            <div className="text-3xl font-bold mb-1">{products.filter(p => p.category === 'Control de Acceso').length}</div>
            <div className="text-purple-100">Control de Acceso</div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold flex items-center gap-2 shadow-lg"
          >
            ➕ Agregar Producto
          </button>
          <button
            onClick={handleExportData}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold flex items-center gap-2 shadow-lg"
          >
            💾 Exportar Datos
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
            Productos ({products.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 bg-gray-100 inline-block px-3 py-1 rounded-full">{product.category}</p>
                  <p className="text-blue-600 font-bold text-xl mb-4">${product.price.toLocaleString('es-CO')}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Edición */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold" style={{fontFamily: "'Space Grotesk', sans-serif"}}>
                  {editingProduct.name ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Cámara IP 4MP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CCTV">CCTV</option>
                    <option value="Control de Acceso">Control de Acceso</option>
                    <option value="Seguridad Electrónica">Seguridad Electrónica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (COP)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen</label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-2">💡 Puedes usar Unsplash, Imgur o cualquier URL de imagen</p>
                </div>

                {editingProduct.image && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vista previa</label>
                    <img src={editingProduct.image} alt="Preview" className="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveProduct}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition"
                  >
                    💾 Guardar Producto
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;