import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card,CardContent } from '../../components/ui/card';
import { products } from '../../data/product';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner';

const Product4 = () => {
  const product = products[3];
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full aspect-square object-cover rounded-xl shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-600">(92 reviews)</span>
          </div>
          
          <p className="text-3xl font-bold text-blue-600 mb-6">${product.price}</p>
          
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          
        </div>
      </div>
    </div>
  );
};

export default Product4;
