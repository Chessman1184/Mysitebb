import { useState } from 'react';
import { Search, Package, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order, CustomOrder } from '../lib/supabase';

export default function OrderHistory() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      const { data: customOrdersData, error: customOrdersError } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      if (customOrdersError) throw customOrdersError;

      setOrders(ordersData || []);
      setCustomOrders(customOrdersData || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Your Orders</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:bg-gray-400"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searched && (
        <div className="space-y-6">
          {orders.length === 0 && customOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No orders found for this email address.</p>
            </div>
          ) : (
            <>
              {orders.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={24} />
                    Product Orders ({orders.length})
                  </h3>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {order.product_name}
                            </h4>
                            <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Customer</p>
                            <p className="font-medium text-gray-800">{order.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium text-gray-800">{order.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price per item</p>
                            <p className="font-medium text-gray-800">${order.product_price}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Amount</p>
                            <p className="font-medium text-blue-600">${order.total_amount}</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">Notes:</p>
                            <p className="text-sm text-gray-800">{order.notes}</p>
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customOrders.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={24} />
                    Custom Orders ({customOrders.length})
                  </h3>
                  <div className="space-y-4">
                    {customOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Custom Order Request
                            </h4>
                            <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Description:</p>
                          <p className="text-gray-800">{order.description}</p>
                        </div>
                        {order.estimated_price && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Estimated Price:</p>
                            <p className="font-medium text-blue-600 text-lg">${order.estimated_price}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
