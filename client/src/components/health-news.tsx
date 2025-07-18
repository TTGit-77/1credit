import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Clock } from "lucide-react";

// Local type for NewsArticle
interface NewsArticle {
  id: string;
  title: string;
  category: string;
  [key: string]: any;
}

interface HealthNewsProps {
  showFilters?: boolean;
  limit?: number;
}

export default function HealthNews({ showFilters = false, limit = 6 }: HealthNewsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: displayNews = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/health-news', { category: selectedCategory !== 'all' ? selectedCategory : undefined, limit }],
    retry: false,
  });

  const categories = [
    { id: 'all', label: 'All', color: 'bg-primary text-white' },
    { id: 'nutrition', label: 'Nutrition', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { id: 'fitness', label: 'Fitness', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { id: 'wellness', label: 'Wellness', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    { id: 'research', label: 'Research', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      nutrition: 'bg-primary-100 text-primary-700',
      fitness: 'bg-secondary-100 text-secondary-700', 
      wellness: 'bg-indigo-100 text-indigo-700',
      research: 'bg-amber-100 text-amber-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Sample news data for demonstration when no backend data is available
  const sampleNews = [
    {
      id: "1",
      title: "10 Superfoods That Boost Your Immune System",
      description: "Discover the power of nutrient-dense foods that can naturally strengthen your body's defenses and improve overall health.",
      category: "nutrition",
      imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    },
    {
      id: "2",
      title: "Morning Exercise: The Key to Better Metabolism",
      description: "New research shows how morning workouts can significantly impact your metabolic rate throughout the day.",
      category: "fitness",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    },
    {
      id: "3",
      title: "Mindful Eating: Transform Your Relationship with Food",
      description: "Learn how mindfulness practices can help you make better food choices and improve digestion.",
      category: "wellness",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    },
    {
      id: "4",
      title: "Breakthrough Study on Plant-Based Proteins",
      description: "Scientists discover new benefits of plant proteins for muscle building and recovery.",
      category: "research",
      imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    },
    {
      id: "5",
      title: "Seasonal Eating: Why It Matters for Your Health",
      description: "Exploring the benefits of eating fruits and vegetables that are in season for optimal nutrition.",
      category: "nutrition",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    },
    {
      id: "6",
      title: "Hydration Myths: What Science Really Says",
      description: "Debunking common hydration myths and understanding your body's actual water needs.",
      category: "wellness",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      sourceUrl: "#"
    }
  ];

  const filteredNews = showFilters && selectedCategory !== 'all'
    ? displayNews.filter((article: NewsArticle) => article.category === selectedCategory)
    : displayNews;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Skeleton key={category.id} className="h-12 w-24 rounded-full" />
            ))}
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category filters */}
      {showFilters && (
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </motion.div>
      )}

      {/* News grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article: NewsArticle, index: number) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="news-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full">
              <div className="relative">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryColor(article.category)} font-medium`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-primary hover:text-primary-600 font-medium"
                  >
                    Read more
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}
