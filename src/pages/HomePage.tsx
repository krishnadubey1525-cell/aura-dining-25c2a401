import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Clock, Star, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems } from '@/data/menuData';

// Lazy load the 3D scene
const HeroScene = lazy(() => import('@/components/3d/HeroScene'));

// Loading fallback for 3D scene
function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-secondary/10 animate-pulse" />
        <div className="absolute inset-8 rounded-full bg-secondary/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-16 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const featuredItems = menuItems.filter(item => 
    item.tags.includes('bestseller') || item.tags.includes('signature')
  ).slice(0, 3);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={<HeroFallback />}>
          <HeroScene />
        </Suspense>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background z-10" />

        {/* Content */}
        <div className="relative z-20 section-container text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Fine Dining Experience
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
          >
            <span className="text-foreground">Taste the</span>
            <br />
            <span className="text-gradient-gold">Extraordinary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Where culinary artistry meets timeless elegance. Experience a symphony 
            of flavors crafted with passion and precision by our world-class chefs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/menu">
                Order Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/reservations">Reserve a Table</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-secondary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Info Bar */}
      <section className="relative z-30 -mt-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border/50 shadow-card p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">123 Gourmet Avenue, NYC</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hours</p>
                  <p className="font-medium">Mon-Sun: 5PM - 11PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reservations</p>
                  <p className="font-medium">+1 (234) 567-890</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Chef's Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Signature Dishes
            </h2>
            <div className="divider-gold mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most celebrated creations, each dish a masterpiece 
              of flavor, texture, and presentation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 card-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-semibold group-hover:text-secondary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-secondary font-bold">${item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="gold" size="lg" asChild>
              <Link to="/menu">
                View Full Menu
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
                <ChefHat className="h-4 w-4" />
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                A Legacy of <br />
                <span className="text-gradient-gold">Culinary Excellence</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Founded in 2010, Lumière has been a beacon of fine dining in the heart 
                of New York City. Our philosophy is simple: source the finest ingredients, 
                respect tradition while embracing innovation, and create memorable 
                experiences that touch the soul.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Under the guidance of Executive Chef Marcus Laurent, our kitchen team 
                transforms every plate into a work of art, blending classic French 
                techniques with contemporary global influences.
              </p>
              <Button variant="outline" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800"
                  alt="Chef preparing dish"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl border border-border shadow-card">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-display font-bold text-gradient-gold">15+</div>
                  <div className="text-sm text-muted-foreground">
                    Years of<br />Excellence
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            </div>
            
            <div className="relative text-center py-20 px-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Ready for an <span className="text-gradient-gold">Unforgettable</span> Experience?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">
                Whether it's an intimate dinner for two or a grand celebration, 
                we're here to make your evening extraordinary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/reservations">
                    Reserve Your Table
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/menu">Explore Menu</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
