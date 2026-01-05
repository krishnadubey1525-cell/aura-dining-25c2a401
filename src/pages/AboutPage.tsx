import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, Award, Heart, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Marcus Laurent',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    bio: '20+ years of Michelin-starred experience',
  },
  {
    name: 'Sofia Chen',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    bio: 'Award-winning dessert artist',
  },
  {
    name: 'Antoine Dubois',
    role: 'Sommelier',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    bio: 'Master of wine pairing',
  },
];

const values = [
  {
    icon: ChefHat,
    title: 'Culinary Excellence',
    description: 'Every dish is a masterpiece, crafted with precision and passion.',
  },
  {
    icon: Heart,
    title: 'Genuine Hospitality',
    description: 'We treat every guest like family, creating lasting memories.',
  },
  {
    icon: Award,
    title: 'Uncompromising Quality',
    description: 'Only the finest ingredients make it to your plate.',
  },
];

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920"
            alt="Restaurant ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Since 2010
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              A Story of <span className="text-gradient-gold">Passion</span> & 
              <span className="text-gradient-gold"> Flavor</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Lumière was born from a simple dream: to create a place where exceptional 
              cuisine meets heartfelt hospitality. What began as a small bistro has 
              evolved into one of the city's most celebrated dining destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Philosophy
            </h2>
            <div className="divider-gold" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
              <ChefHat className="h-4 w-4" />
              The Artisans
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Meet Our Team
            </h2>
            <div className="divider-gold" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>
                <h3 className="text-xl font-display font-semibold">{member.name}</h3>
                <p className="text-secondary font-medium text-sm mb-1">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-4">
                <MapPin className="h-4 w-4" />
                Visit Us
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Find Us in the Heart of <span className="text-gradient-gold">NYC</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Located in the vibrant Gourmet Avenue, Lumière is just steps away from 
                the city's cultural landmarks. Whether you're arriving by subway or car, 
                we're easy to find and eager to welcome you.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <p className="font-medium">123 Gourmet Avenue</p>
                    <p className="text-muted-foreground">New York, NY 10001</p>
                  </div>
                </div>
              </div>
              <Button variant="gold" asChild>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Directions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden aspect-video bg-muted"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902584366!2d-73.98776668459418!3d40.75797794255927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1645564756836!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant location"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-card rounded-2xl border border-border/50 p-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Experience <span className="text-gradient-gold">Lumière</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Book your table today and discover why our guests keep coming back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/reservations">
                  Reserve a Table
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/menu">View Menu</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
