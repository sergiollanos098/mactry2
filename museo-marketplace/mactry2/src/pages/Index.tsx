import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { useFirestoreProducts } from '../../hooks/FirestoreProduct';

const Index = () => {
  const { products, loading } = useFirestoreProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Bienvenido a <span className="text-blue-400">la tienda del MAC</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Descubre productos increíbles basados en arte y cultura.
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 text-white">
            Ver productos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Productos destacados */}
      <section>
        {loading ? (
          <div>Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;