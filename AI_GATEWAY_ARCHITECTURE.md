# AI Gateway Architecture Documentation

## Overview
The SmartSite AI Gateway provides a unified interface for all AI-powered features in the admin panel. It intelligently routes requests between different AI services based on user tier and availability.

## Architecture Components

### Backend Components

#### 1. AI Gateway Service (`server/services/ai-gateway.ts`)
- **Purpose**: Core service handling AI model routing and request processing
- **Models Supported**:
  - OpenAI GPT-4o (Pro users)
  - Anthropic Claude Sonnet 4 (Fallback)
  - Mistral 7B via Ollama (Default/Free tier)

#### 2. AI Gateway Routes (`server/routes/ai-gateway.ts`)
- **Endpoints**:
  - `POST /api/ai/gateway` - Main AI processing endpoint
  - `GET /api/ai/health` - Service health check
  - `GET /api/ai/tasks` - Available task types

### Frontend Components

#### 3. AI Gateway Client (`client/src/services/ai-gateway.ts`)
- **Purpose**: Frontend service for unified AI feature access
- **Features**: Type-safe request/response handling, error management, service abstraction

## Configuration

### Environment Variables
```bash
# Pro AI User Flag
IS_PRO_AI_USER=false

# API Keys (Optional - will fallback gracefully)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Local Mistral/Ollama URL
MISTRAL_API_URL=http://localhost:11434
```

### Model Selection Logic
```
IF IS_PRO_AI_USER = true AND OPENAI_API_KEY exists
  → Use OpenAI GPT-4o
ELSE IF ANTHROPIC_API_KEY exists
  → Use Anthropic Claude Sonnet 4
ELSE
  → Use Mistral 7B (Local Ollama)
```

## Task Types and Use Cases

### 1. Assistant (`assistant`)
- **Purpose**: General SmartSite admin help and guidance
- **Temperature**: 0.7
- **Max Tokens**: 500
- **Use Case**: Panel chatbot, feature explanations

### 2. Insight Trends (`insight-trends`)
- **Purpose**: Analyze insights data for patterns and recommendations
- **Temperature**: 0.3 (Low for analytical accuracy)
- **Max Tokens**: 800
- **Use Case**: Business intelligence, trend identification

### 3. Social Post (`social-post`)
- **Purpose**: Generate engaging social media content
- **Temperature**: 0.8 (High for creativity)
- **Max Tokens**: 300
- **Use Case**: Social media automation

### 4. Blog Post (`blog-post`)
- **Purpose**: Write comprehensive blog articles
- **Temperature**: 0.7
- **Max Tokens**: 1500
- **Use Case**: Content marketing automation

### 5. Theme to Blog (`theme-to-blog`)
- **Purpose**: Convert insight themes into blog articles
- **Temperature**: 0.7
- **Max Tokens**: 1500
- **Use Case**: Insight-driven content creation

### 6. Theme to Agenda (`theme-to-agenda`)
- **Purpose**: Transform themes into meeting agendas
- **Temperature**: 0.5 (Structured output)
- **Max Tokens**: 800
- **Use Case**: Meeting planning automation

## API Request Format

### Request Payload
```json
{
  "prompt": "Your request text",
  "context": {
    "optional": "contextual data"
  },
  "taskType": "assistant",
  "temperature": 0.7,
  "maxTokens": 500
}
```

### Response Format
```json
{
  "status": "success",
  "data": "AI generated response",
  "taskType": "assistant"
}
```

### Error Response Format
```json
{
  "status": "error", 
  "data": "",
  "taskType": "assistant",
  "error": "Error description"
}
```

## Usage Examples

### Frontend Usage
```typescript
import { aiGateway, aiAssistant, aiContent } from '@/services/ai-gateway';

// Admin Assistant
const response = await aiAssistant.ask("How do I configure SEO settings?");

// Social Media Generation
const socialPost = await aiContent.generateSocialPost(
  "Create a post about our new feature",
  { feature: "AI Gateway", audience: "business owners" }
);

// Blog Generation
const blogPost = await aiContent.generateBlogPost(
  "Write about AI integration benefits",
  { industry: "professional services" }
);
```

### Direct API Usage
```bash
# Test Assistant
curl -X POST http://localhost:5000/api/ai/gateway \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How do I set up social media automation?",
    "taskType": "assistant"
  }'

# Check Health
curl -X GET http://localhost:5000/api/ai/health
```

## Features Integrated

### Current Integrations
1. **Internal Admin Assistant** - Panel chatbot functionality
2. **Insight Trend Analyzer** - Business intelligence features
3. **Social Media Generator** - Content automation
4. **Blog Post Generator** - Article creation
5. **Theme-to-Blog Generator** - Insight-driven content
6. **Theme-to-Agenda Generator** - Meeting automation

### Frontend Requirements
- All AI features must use the AI Gateway exclusively
- No direct model API calls from frontend components
- Consistent error handling across all features
- Type-safe request/response interfaces

## Performance Features

### Intelligent Routing
- Automatic model selection based on user tier
- Graceful fallback between services
- Service health monitoring

### Error Handling
- Network error recovery
- API timeout handling
- Model-specific error messages
- Comprehensive logging

### Monitoring
- Request/response logging
- Service health tracking
- Usage analytics ready
- Performance metrics collection

## Future Expansions

### Planned Enhancements
- Streaming response support
- Custom model fine-tuning
- Multi-language support
- Advanced context management
- Response caching
- Rate limiting
- Usage quotas

### Integration Points
- Authentication middleware
- Tenant-specific configurations
- Custom prompt templates
- Response post-processing
- Analytics integration

## Security Considerations

### API Key Management
- Environment variable storage
- No key exposure in frontend
- Secure fallback mechanisms
- Key rotation support

### Request Validation
- Input sanitization
- Parameter validation
- Rate limiting ready
- Access control integration

## Deployment Notes

### Local Development
- Ollama required for Mistral 7B
- OpenAI/Anthropic keys optional
- Environment configuration flexible

### Production Deployment
- Configure IS_PRO_AI_USER based on subscription
- Set appropriate API keys
- Monitor service health
- Scale Mistral/Ollama as needed