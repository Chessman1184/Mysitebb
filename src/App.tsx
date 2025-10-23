import { useState, useEffect } from 'react';
import { ShoppingBag, Package, FileText, CheckCircle } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CheckoutModal from './components/CheckoutModal';
import CustomOrderModal from './components/CustomOrderModal';
import OrderHistory from './components/OrderHistory';
import { supabase } from './lib/supabase';
import type { Product } from './lib/supabase';

type Page = 'products' | 'orders' | 'custom';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCustomOrder, setShowCustomOrder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">DesignHub</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === 'products'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setCurrentPage('orders')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  currentPage === 'orders'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package size={18} />
                Track Orders
              </button>
              <button
                onClick={() => setShowCustomOrder(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FileText size={18} />
                Custom Order
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in">
          <CheckCircle size={24} />
          <span className="font-medium">Order placed successfully!</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'products' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h2>
              <p className="text-gray-600">
                Professional design and development services for your business needs
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyClick={handleBuyClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'orders' && <OrderHistory />}
      </main>

      {showCheckout && selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {showCustomOrder && (
        <CustomOrderModal
          onClose={() => setShowCustomOrder(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

export default App;
