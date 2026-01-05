import { motion } from 'framer-motion';
import { Flame, Leaf, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, MenuItem } from '@/stores/cartStore';
import { toast } from 'sonner';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const { addItem, setCartOpen } = useCartStore();

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart`, {
      action: {
        label: 'View Cart',
        onClick: () => setCartOpen(true),
      },
    });
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'spicy':
        return <Flame className="h-3 w-3" />;
      case 'vegetarian':
      case 'vegan':
        return <Leaf className="h-3 w-3" />;
      case 'bestseller':
      case 'signature':
      case 'chef-special':
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'spicy':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'vegetarian':
      case 'vegan':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'bestseller':
      case 'signature':
      case 'chef-special':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'premium':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'gluten-free':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 card-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Tags overlay */}
        {item.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
              >
                {getTagIcon(tag)}
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Quick add button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Button
            variant="gold"
            size="sm"
            onClick={handleAddToCart}
            className="shadow-lg"
          >
            Add to Cart
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
            {item.name}
          </h3>
          <span className="text-secondary font-bold text-lg">
            ${item.price}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {item.prepTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {item.prepTime} min
            </span>
          )}
          {item.calories && (
            <span>{item.calories} cal</span>
          )}
        </div>
      </div>

      {/* Availability overlay */}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <span className="px-4 py-2 rounded-full bg-muted text-muted-foreground font-medium">
            Currently Unavailable
          </span>
        </div>
      )}
    </motion.article>
  );
}
