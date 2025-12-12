# Interlinking System Implementation Roadmap

## 1. Phase 1: Foundation Setup (Week 1-2)

### 1.1 Database Schema Implementation

#### 1.1.1 Create Tool Relationships Table
```sql
-- Create tool_relationships table
CREATE TABLE tool_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  related_tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('semantic', 'categorical', 'behavioral', 'contextual')),
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, related_tool_id, relationship_type)
);

-- Create indexes for performance
CREATE INDEX idx_tool_relationships_tool_id ON tool_relationships(tool_id);
CREATE INDEX idx_tool_relationships_related_tool_id ON tool_relationships(related_tool_id);
CREATE INDEX idx_tool_relationships_type ON tool_relationships(relationship_type);
CREATE INDEX idx_tool_relationships_strength ON tool_relationships(strength DESC);
```

#### 1.1.2 Create User Behavior Analytics Table
```sql
-- Create user_behavior table
CREATE TABLE user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('view', 'use', 'share', 'download', 'copy', 'bookmark')),
  duration INTEGER DEFAULT 0, -- time spent in seconds
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX idx_user_behavior_session_id ON user_behavior(session_id);
CREATE INDEX idx_user_behavior_tool_id ON user_behavior(tool_id);
CREATE INDEX idx_user_behavior_action ON user_behavior(action);
CREATE INDEX idx_user_behavior_timestamp ON user_behavior(timestamp DESC);
```

#### 1.1.3 Create Content Expansion Tables
```sql
-- Create tool_content table for expanded content
CREATE TABLE tool_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('introduction', 'how_it_works', 'use_cases', 'benefits', 'best_practices', 'comparison')),
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  seo_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, content_type)
);

-- Create faqs table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('general', 'technical', 'use_cases', 'troubleshooting', 'comparison')),
  priority INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  keywords TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tool_content_tool_id ON tool_content(tool_id);
CREATE INDEX idx_tool_content_type ON tool_content(content_type);
CREATE INDEX idx_faqs_tool_id ON faqs(tool_id);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_priority ON faqs(priority DESC);
```

### 1.2 Core Service Implementation

#### 1.2.1 Recommendation Engine Service
```javascript
// lib/services/RecommendationEngine.js
import { supabase } from '@/lib/supabase';
import { ToolSimilarityAnalyzer } from './ToolSimilarityAnalyzer';
import { UserBehaviorAnalyzer } from './UserBehaviorAnalyzer';

export class RecommendationEngine {
  constructor() {
    this.similarityAnalyzer = new ToolSimilarityAnalyzer();
    this.behaviorAnalyzer = new UserBehaviorAnalyzer();
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

  async getRelatedTools(toolId, options = {}) {
    const cacheKey = `related_${toolId}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const [semanticTools, behavioralTools, categoricalTools] = await Promise.all([
        this.getSemanticRelationships(toolId, options.limit),
        this.getBehavioralRecommendations(toolId, options.limit),
        this.getCategoricalTools(toolId, options.limit)
      ]);

      // Combine and rank tools
      const combinedTools = this.combineAndRank([
        ...semanticTools,
        ...behavioralTools,
        ...categoricalTools
      ], options.limit || 5);

      // Cache the results
      this.cache.set(cacheKey, {
        data: combinedTools,
        timestamp: Date.now()
      });

      return combinedTools;
    } catch (error) {
      console.error('Error getting related tools:', error);
      return this.getFallbackTools(toolId);
    }
  }

  async getSemanticRelationships(toolId, limit = 5) {
    const { data, error } = await supabase
      .from('tool_relationships')
      .select(`
        related_tool_id,
        strength,
        tools!related_tool_id(id, name, slug, description, category)
      `)
      .eq('tool_id', toolId)
      .eq('relationship_type', 'semantic')
      .order('strength', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data.map(rel => ({
      ...rel.tools,
      relationshipStrength: rel.strength,
      relationshipType: 'semantic'
    }));
  }

  async getBehavioralRecommendations(toolId, limit = 5) {
    // Get tools frequently used together
    const { data, error } = await supabase
      .rpc('get_behavioral_recommendations', {
        p_tool_id: toolId,
        p_limit: limit
      });

    if (error) throw error;
    
    return data || [];
  }

  async getCategoricalTools(toolId, limit = 5) {
    // Get tool category first
    const { data: toolData } = await supabase
      .from('tools')
      .select('category')
      .eq('id', toolId)
      .single();

    if (!toolData) return [];

    // Get other tools in same category
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, slug, description, category')
      .eq('category', toolData.category)
      .neq('id', toolId)
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data.map(tool => ({
      ...tool,
      relationshipStrength: 0.6,
      relationshipType: 'categorical'
    }));
  }

  combineAndRank(tools, limit) {
    // Remove duplicates and combine scores
    const toolMap = new Map();
    
    tools.forEach(tool => {
      if (toolMap.has(tool.id)) {
        // Combine scores from different sources
        const existing = toolMap.get(tool.id);
        existing.relationshipStrength = Math.max(
          existing.relationshipStrength,
          tool.relationshipStrength
        );
      } else {
        toolMap.set(tool.id, tool);
      }
    });

    // Sort by combined strength and return top results
    return Array.from(toolMap.values())
      .sort((a, b) => b.relationshipStrength - a.relationshipStrength)
      .slice(0, limit);
  }

  async getFallbackTools(toolId) {
    // Return popular tools as fallback
    const { data, error } = await supabase
      .from('tools')
      .select('id, name, slug, description, category')
      .order('popularity', { ascending: false })
      .limit(5);

    if (error) return [];
    return data;
  }
}
```

#### 1.2.2 Content Generation Service
```javascript
// lib/services/ContentGenerator.js
import { supabase } from '@/lib/supabase';
import { OpenAI } from 'openai';

export class ContentGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateToolContent(toolId, contentType) {
    // Get tool data
    const { data: tool } = await supabase
      .from('tools')
      .select('*')
      .eq('id', toolId)
      .single();

    if (!tool) throw new Error('Tool not found');

    // Generate content based on type
    const contentPrompts = {
      introduction: this.generateIntroductionPrompt(tool),
      how_it_works: this.generateHowItWorksPrompt(tool),
      use_cases: this.generateUseCasesPrompt(tool),
      benefits: this.generateBenefitsPrompt(tool),
      best_practices: this.generateBestPracticesPrompt(tool),
      comparison: this.generateComparisonPrompt(tool)
    };

    const prompt = contentPrompts[contentType];
    if (!prompt) throw new Error('Invalid content type');

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert and technical writer. Create comprehensive, engaging content that is both user-friendly and optimized for search engines. Include relevant keywords naturally and provide actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      
      // Save to database
      await this.saveContent(toolId, contentType, content);
      
      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  generateIntroductionPrompt(tool) {
    return `
    Write a comprehensive introduction for the "${tool.name}" SEO tool.
    
    Tool Description: ${tool.description}
    Tool Category: ${tool.category}
    Target Audience: ${tool.targetAudience || 'SEO professionals and website owners'}
    
    Requirements:
    - Minimum 200 words
    - Include the primary keyword "${tool.name}" naturally
    - Explain what the tool does and why it's useful
    - Address the user's pain points
    - Include a clear value proposition
    - Make it engaging and actionable
    - Include 2-3 secondary keywords related to ${tool.category}
    
    Format: Write in a conversational, expert tone that builds trust and encourages users to try the tool.
    `;
  }

  generateHowItWorksPrompt(tool) {
    return `
    Write a detailed "How It Works" section for the "${tool.name}" SEO tool.
    
    Tool Description: ${tool.description}
    Tool Features: ${JSON.stringify(tool.features || [])}
    
    Requirements:
    - Minimum 300 words
    - Step-by-step explanation of the tool's functionality
    - Include specific examples and use cases
    - Explain the technology or methodology behind the tool
    - Address common user questions about functionality
    - Include tips for getting the best results
    - Use clear, technical but accessible language
    
    Format: Use numbered steps or bullet points where appropriate. Include practical examples.
    `;
  }

  generateUseCasesPrompt(tool) {
    return `
    Write comprehensive use cases for the "${tool.name}" SEO tool.
    
    Tool Description: ${tool.description}
    Tool Category: ${tool.category}
    
    Requirements:
    - Minimum 400 words
    - Include 5-7 specific, real-world use cases
    - Each use case should include:
      - The problem or situation
      - How the tool solves it
      - Expected results or benefits
      - Tips for implementation
    - Address different user types (beginners, experts, agencies)
    - Include industry-specific examples where relevant
    
    Format: Use clear headings for each use case. Make them actionable and specific.
    `;
  }

  async saveContent(toolId, contentType, content) {
    const wordCount = content.split(/\s+/).length;
    
    const { error } = await supabase
      .from('tool_content')
      .upsert({
        tool_id: toolId,
        content_type: contentType,
        content: content,
        word_count: wordCount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'tool_id, content_type'
      });

    if (error) throw error;
  }

  async generateFAQs(toolId, count = 15) {
    const { data: tool } = await supabase
      .from('tools')
      .select('*')
      .eq('id', toolId)
      .single();

    const categories = ['general', 'technical', 'use_cases', 'troubleshooting'];
    const faqs = [];

    for (const category of categories) {
      const categoryFAQs = await this.generateCategoryFAQs(tool, category, Math.ceil(count / categories.length));
      faqs.push(...categoryFAQs);
    }

    // Save FAQs to database
    for (const faq of faqs) {
      await this.saveFAQ(toolId, faq);
    }

    return faqs;
  }

  async generateCategoryFAQs(tool, category, count) {
    const categoryPrompts = {
      general: `Generate general questions about ${tool.name} - what it is, why use it, basic functionality`,
      technical: `Generate technical questions about ${tool.name} - how it works, requirements, compatibility`,
      use_cases: `Generate use case questions about ${tool.name} - when to use it, examples, scenarios`,
      troubleshooting: `Generate troubleshooting questions about ${tool.name} - common issues, errors, solutions`
    };

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate realistic FAQs that users would actually ask. Make them specific and actionable."
        },
        {
          role: "user",
          content: `${categoryPrompts[category]}. Generate ${count} FAQs with detailed answers.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.5,
    });

    return this.parseFAQs(completion.choices[0].message.content);
  }

  parseFAQs(content) {
    // Parse the generated content into FAQ objects
    const faqs = [];
    const lines = content.split('\n');
    
    let currentQuestion = '';
    let currentAnswer = '';
    let inAnswer = false;

    for (const line of lines) {
      if (line.includes('?') && !inAnswer) {
        if (currentQuestion && currentAnswer) {
          faqs.push({
            question: currentQuestion.trim(),
            answer: currentAnswer.trim(),
            category: 'general',
            priority: 0
          });
        }
        currentQuestion = line;
        currentAnswer = '';
        inAnswer = false;
      } else if (line.trim() && (inAnswer || !line.includes('?'))) {
        currentAnswer += line + ' ';
        inAnswer = true;
      }
    }

    // Add the last FAQ
    if (currentQuestion && currentAnswer) {
      faqs.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.trim(),
        category: 'general',
        priority: 0
      });
    }

    return faqs;
  }

  async saveFAQ(toolId, faq) {
    const { error } = await supabase
      .from('faqs')
      .insert({
        tool_id: toolId,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        priority: faq.priority
      });

    if (error) throw error;
  }
}
```

## 2. Phase 2: Frontend Components (Week 3-4)

### 2.1 Related Tools Component

#### 2.1.1 Main Component
```javascript
// components/RelatedTools.jsx
import { useState, useEffect } from 'react';
import { getRelatedTools } from '@/lib/api/recommendations';
import { ToolCardSkeleton } from './ToolCardSkeleton';
import { ToolCard } from './ToolCard';
import { ErrorBoundary } from './ErrorBoundary';

export default function RelatedTools({ 
  currentTool, 
  limit = 5, 
  className = '',
  showDescriptions = true 
}) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatedTools() {
      try {
        setLoading(true);
        setError(null);
        
        const relatedTools = await getRelatedTools(currentTool.id, { limit });
        setTools(relatedTools);
      } catch (err) {
        console.error('Failed to fetch related tools:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (currentTool?.id) {
      fetchRelatedTools();
    }
  }, [currentTool?.id, limit]);

  if (loading) {
    return (
      <section className={className} aria-labelledby="related-tools-loading">
        <h2 id="related-tools-loading" className="text-lg font-semibold mb-4">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={className} aria-labelledby="related-tools-error">
        <h2 id="related-tools-error" className="text-lg font-semibold mb-4">
          Related Tools
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Unable to load related tools at the moment. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (tools.length === 0) {
    return null; // Don't show section if no related tools
  }

  return (
    <ErrorBoundary fallback={<RelatedToolsError />}>
      <section className={className} aria-labelledby="related-tools">
        <h2 id="related-tools" className="text-lg font-semibold mb-4">
          Related Tools You Might Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              showDescription={showDescriptions}
              relationshipType={tool.relationshipType}
              relationshipStrength={tool.relationshipStrength}
            />
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
}

function RelatedToolsError() {
  return (
    <section className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Related Tools
      </h2>
      <p className="text-red-700">
        Something went wrong while loading related tools. Please refresh the page to try again.
      </p>
    </section>
  );
}
```

#### 2.1.2 Tool Card Component
```javascript
// components/ToolCard.jsx
import Link from 'next/link';
import { ToolIcon } from './ToolIcon';
import { Badge } from './Badge';
import { StarRating } from './StarRating';

export default function ToolCard({ 
  tool, 
  showDescription = true,
  relationshipType,
  relationshipStrength 
}) {
  const getRelationshipBadge = () => {
    const badges = {
      semantic: { label: 'Similar', color: 'blue' },
      behavioral: { label: 'Popular Together', color: 'green' },
      categorical: { label: 'Same Category', color: 'purple' },
      contextual: { label: 'Related', color: 'orange' }
    };

    const badge = badges[relationshipType];
    if (!badge) return null;

    return (
      <Badge 
        variant={badge.color} 
        size="sm" 
        className="ml-2"
        title={`${Math.round(relationshipStrength * 100)}% match`}
      >
        {badge.label}
      </Badge>
    );
  };

  return (
    <article 
      className="tool-card bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200"
      role="article"
      aria-labelledby={`tool-title-${tool.id}`}
    >
      <header className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <ToolIcon tool={tool} size="md" />
          <div>
            <h3 id={`tool-title-${tool.id}`} className="font-semibold text-gray-900">
              <Link href={`/tools/${tool.slug}`}>
                <a className="hover:text-blue-600 transition-colors">
                  {tool.name}
                </a>
              </Link>
            </h3>
            {tool.rating && (
              <div className="flex items-center mt-1">
                <StarRating rating={tool.rating} size="sm" />
                <span className="text-sm text-gray-600 ml-1">
                  ({tool.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>
        {getRelationshipBadge()}
      </header>

      {showDescription && tool.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tool.description}
        </p>
      )}

      <footer className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {tool.category && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {tool.category}
            </span>
          )}
          {tool.popularity && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {tool.popularity}
            </span>
          )}
        </div>
        
        <Link href={`/tools/${tool.slug}`}>
          <a className="btn btn-primary btn-sm">
            Try Tool
          </a>
        </Link>
      </footer>
    </article>
  );
}
```

### 2.2 FAQ Section Component

#### 2.2.1 FAQ Component
```javascript
// components/FAQSection.jsx
import { useState, useEffect } from 'react';
import { getToolFAQs } from '@/lib/api/faqs';
import { FAQItem } from './FAQItem';
import { FAQSearch } from './FAQSearch';
import { FAQCategories } from './FAQCategories';

export default function FAQSection({ tool, className = '' }) {
  const [faqs, setFaqs] = useState([]);
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        const toolFAQs = await getToolFAQs(tool.id);
        setFaqs(toolFAQs);
        setFilteredFAQs(toolFAQs);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    }

    if (tool?.id) {
      fetchFAQs();
    }
  }, [tool?.id]);

  useEffect(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
      );
    }

    setFilteredFAQs(filtered);
  }, [faqs, searchTerm, selectedCategory]);

  const toggleItem = (id) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (loading) {
    return (
      <section className={className} aria-labelledby="faqs-loading">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredFAQs.length === 0) {
    return (
      <section className={className} aria-labelledby="faqs-empty">
        <h2 id="faqs-empty" className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            No FAQs found. Try adjusting your search or category filter.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={className} aria-labelledby="faqs">
      <div className="flex items-center justify-between mb-6">
        <h2 id="faqs" className="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Expand All
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <FAQSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search FAQs..."
        />
        
        <FAQCategories
          faqs={faqs}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="space-y-3">
        {filteredFAQs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isExpanded={expandedItems.has(faq.id)}
            onToggle={() => toggleItem(faq.id)}
            index={index}
          />
        ))}
      </div>

      {/* Schema.org markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": filteredFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}
```

### 2.3 Enhanced Tool Layout

#### 2.3.1 ToolLayout Component
```javascript
// components/ToolLayout.jsx
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Breadcrumb } from './Breadcrumb';
import { ShareActions } from './ShareActions';
import { StructuredData } from './StructuredData';

// Lazy load heavy components
const RelatedTools = dynamic(() => import('./RelatedTools'), {
  loading: () => <RelatedToolsSkeleton />,
  ssr: true
});

const FAQSection = dynamic(() => import('./FAQSection'), {
  loading: () => <FAQSectionSkeleton />,
  ssr: true
});

const ContentExpansion = dynamic(() => import('./ContentExpansion'), {
  loading: () => <ContentExpansionSkeleton />,
  ssr: true
});

const ContextualLinks = dynamic(() => import('./ContextualLinks'), {
  loading: () => <ContextualLinksSkeleton />,
  ssr: false
});

export default function ToolLayout({ 
  tool, 
  children, 
  relatedTools = [],
  showContentExpansion = true,
  showFAQs = true,
  showRelatedTools = true,
  className = ''
}) {
  const [contentText, setContentText] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Extract text content for contextual linking
    const extractText = () => {
      const textContent = document.querySelector('.tool-main-content')?.textContent || '';
      setContentText(textContent.slice(0, 2000)); // Limit for API calls
    };

    // Monitor scroll progress
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    extractText();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "SoftwareApplication"],
    "name": tool.name,
    "description": tool.description,
    "url": `https://100seotools.com/tools/${tool.slug}`,
    "applicationCategory": "SEOApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className={`tool-layout ${className}`}>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Breadcrumb Navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <Breadcrumb tool={tool} />
      </nav>

      {/* Tool Header */}
      <header className="tool-header mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {tool.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {tool.category && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  {tool.category}
                </span>
              )}
              {tool.popularity && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {tool.popularity} uses
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <ShareActions 
              url={`https://100seotools.com/tools/${tool.slug}`}
              title={tool.name}
              description={tool.description}
            />
          </div>
        </div>
      </header>

      {/* Main Tool Content */}
      <main className="tool-main-content mb-12" role="main">
        {children}
      </main>

      {/* Quick Navigation */}
      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Quick Navigation</h3>
        <div className="flex flex-wrap gap-2">
          {showRelatedTools && (
            <a href="#related-tools" className="text-blue-600 hover:text-blue-700 text-sm">
              Related Tools
            </a>
          )}
          {showFAQs && (
            <a href="#faqs" className="text-blue-600 hover:text-blue-700 text-sm">
              FAQs
            </a>
          )}
          {showContentExpansion && (
            <a href="#more-info" className="text-blue-600 hover:text-blue-700 text-sm">
              More Information
            </a>
          )}
        </div>
      </nav>

      {/* Contextual Links */}
      <ContextualLinks content={contentText} className="mb-12" />

      {/* Related Tools */}
      {showRelatedTools && (
        <section id="related-tools" className="mb-12">
          <RelatedTools 
            currentTool={tool} 
            limit={5}
            showDescriptions={true}
          />
        </section>
      )}

      {/* FAQ Section */}
      {showFAQs && (
        <section id="faqs" className="mb-12">
          <FAQSection tool={tool} />
        </section>
      )}

      {/* Content Expansion */}
      {showContentExpansion && (
        <section id="more-info" className="mb-12">
          <ContentExpansion tool={tool} />
        </section>
      )}

      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />
    </div>
  );
}
```

This implementation roadmap provides a comprehensive foundation for building the interlinking system and content enhancements. The modular approach ensures scalability and maintainability while delivering significant improvements to user experience and SEO performance.