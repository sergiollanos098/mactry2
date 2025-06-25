import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import ProductCard from '../components/ProductCard';
import { useFirestoreProducts } from '../../hooks/FirestoreProduct';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { products, loading } = useFirestoreProducts();

  // Extrae categorías únicas de los productos de Firestore
  const categories = ['All', ...Array.from(new Set(products.map(p => p.categoria || 'Sin categoría')))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      (product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesCategory = selectedCategory === 'All' || (product.categoria || 'Sin categoría') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Todos los productos</h1>
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div>Cargando productos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No se encontraron productos.</p>
        </div>
      )}
    </div>
  );
};

export default Products;