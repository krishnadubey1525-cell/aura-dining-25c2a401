import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, Plus, Pencil, Trash2, Eye, EyeOff, 
  Check, X, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  useMenuItems, useCategories, useCreateMenuItem, 
  useUpdateMenuItem, useDeleteMenuItem, MenuItem 
} from '@/hooks/useMenuItems';
import { toast } from 'sonner';

type MenuItemForm = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;

const defaultFormValues: MenuItemForm = {
  name: '',
  description: '',
  price: 0,
  category_id: undefined,
  image_url: '',
  is_available: true,
  is_visible: true,
  prep_time: 15,
  tags: [],
  calories: undefined,
  allergens: [],
};

export default function AdminMenuPage() {
  const { data: menuItems = [], isLoading } = useMenuItems();
  const { data: categories = [] } = useCategories();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MenuItem | null>(null);
  const [formValues, setFormValues] = useState<MenuItemForm>(defaultFormValues);
  const [tagsInput, setTagsInput] = useState('');
  const [allergensInput, setAllergensInput] = useState('');

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormValues(defaultFormValues);
    setTagsInput('');
    setAllergensInput('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormValues({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category_id: item.category_id || undefined,
      image_url: item.image_url || '',
      is_available: item.is_available ?? true,
      is_visible: item.is_visible ?? true,
      prep_time: item.prep_time ?? 15,
      tags: item.tags || [],
      calories: item.calories || undefined,
      allergens: item.allergens || [],
    });
    setTagsInput((item.tags || []).join(', '));
    setAllergensInput((item.allergens || []).join(', '));
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formValues.name || formValues.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const itemData = {
      ...formValues,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      allergens: allergensInput.split(',').map(a => a.trim()).filter(Boolean),
    };

    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, ...itemData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createItem.mutate(itemData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmItem) {
      deleteItem.mutate(deleteConfirmItem.id, {
        onSuccess: () => setDeleteConfirmItem(null)
      });
    }
  };

  const toggleVisibility = (item: MenuItem) => {
    updateItem.mutate({ id: item.id, is_visible: !item.is_visible });
  };

  const toggleAvailability = (item: MenuItem) => {
    updateItem.mutate({ id: item.id, is_available: !item.is_available });
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-secondary" />
          Menu Management
        </h1>
        <Button variant="gold" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading menu items...</div>
      ) : menuItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No menu items yet.</p>
          <Button variant="gold" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border border-border/50 rounded-xl p-4 flex gap-4 ${
                !item.is_visible ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryName(item.category_id)}
                    </p>
                  </div>
                  <p className="font-bold text-lg">${Number(item.price).toFixed(2)}</p>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.is_available 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.is_available ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1">
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toggleVisibility(item)}
                  title={item.is_visible ? 'Hide from menu' : 'Show on menu'}
                >
                  {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleOpenEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirmItem(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  placeholder="Dish name"
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formValues.price}
                  onChange={(e) => setFormValues({ ...formValues, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formValues.category_id || ''} 
                  onValueChange={(v) => setFormValues({ ...formValues, category_id: v || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formValues.description || ''}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                placeholder="Brief description of the dish"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formValues.image_url || ''}
                onChange={(e) => setFormValues({ ...formValues, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prep_time">Prep Time (mins)</Label>
                <Input
                  id="prep_time"
                  type="number"
                  min="0"
                  value={formValues.prep_time}
                  onChange={(e) => setFormValues({ ...formValues, prep_time: parseInt(e.target.value) || 15 })}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formValues.calories || ''}
                  onChange={(e) => setFormValues({ ...formValues, calories: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="spicy, vegan, bestseller"
              />
            </div>

            <div>
              <Label htmlFor="allergens">Allergens (comma separated)</Label>
              <Input
                id="allergens"
                value={allergensInput}
                onChange={(e) => setAllergensInput(e.target.value)}
                placeholder="nuts, dairy, gluten"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_available"
                  checked={formValues.is_available}
                  onCheckedChange={(checked) => setFormValues({ ...formValues, is_available: checked })}
                />
                <Label htmlFor="is_available">Available (In Stock)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_visible"
                  checked={formValues.is_visible}
                  onCheckedChange={(checked) => setFormValues({ ...formValues, is_visible: checked })}
                />
                <Label htmlFor="is_visible">Visible on Menu</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="gold" 
              onClick={handleSubmit}
              disabled={createItem.isPending || updateItem.isPending}
            >
              {(createItem.isPending || updateItem.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmItem} onOpenChange={() => setDeleteConfirmItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
