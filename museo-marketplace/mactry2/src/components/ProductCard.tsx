import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: Number(product.id),
      name: product.nombre,
      price: product.precio,
      image: product.imagen
    });
    toast.success(`${product.nombre} añadido al carrito!`);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 bg-card border-border h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img 
            src={product.imagen} 
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-foreground transition-colors text-card-foreground line-clamp-2">
            {product.nombre}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm mb-2 line-clamp-2 flex-1">
            {product.descripcion}
          </p>
          <p className="text-xl md:text-2xl font-bold text-foreground">
            S./{product.precio}
          </p>
        </CardContent>
      </Link>
      <CardFooter>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            // onClick={} // Implementar reserva después
          >
            Reserva
          </button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;