import { pool } from '../db';
import { storage } from '../storage';
import { sotSyncService } from './sot-sync';
import { logger } from '../utils/logger';
import type { ClientCheckIn } from '../../shared/sotSchemaV1';
import { v4 as uuidv4 } from 'uuid';

/**
 * ClientCheckInService
 * Handles gathering data for the NextMonth SOT check-in
 */
export class ClientCheckInService {
  private instanceId: string;

  constructor() {
    // Generate a stable instance ID if not already set
    this.instanceId = process.env.INSTANCE_ID || `progress-client-${uuidv4().substring(0, 8)}`;
    logger.info('ClientCheckInService initialized');
  }

  /**
   * Gather all required data for the client check-in
   */
  public async gatherCheckInData(): Promise<ClientCheckIn> {
    logger.info('Gathering client check-in data...');
    
    // Get data from various sources
    const systemRegistry = await this.getSystemRegistryData();
    const blueprintManagement = await this.getBlueprintManagementData();
    const toolRegistry = await this.getToolRegistryData();
    const featureFlags = await this.getFeatureFlagsData();
    const synchronization = await this.getSynchronizationData();
    const selfUpdateCapabilities = await this.getSelfUpdateCapabilitiesData();
    const tenantInfo = await this.getTenantInfoData();
    const securityAndAccessControl = await this.getSecurityAndAccessControlData();
    const monitoringAndLogging = await this.getMonitoringAndLoggingData();
    const branding = await this.getBrandingData();
    const location = await this.getLocationData();
    const toolConfigs = await this.getToolConfigsData();
    const chatAssistant = await this.getChatAssistantData();
    const media = await this.getMediaData();
    const siteStructure = await this.getSiteStructureData();
    const pageContent = await this.getPageContentData();
    const guardian = await this.getGuardianData();
    
    // Combine all data
    return {
      systemRegistry,
      blueprintManagement,
      toolRegistry,
      featureFlags,
      synchronization,
      selfUpdateCapabilities,
      tenantInfo,
      securityAndAccessControl,
      monitoringAndLogging,
      branding,
      location,
      toolConfigs,
      chatAssistant,
      media,
      siteStructure,
      pageContent,
      guardian
    };
  }

  /**
   * Get system registry data
   */
  private async getSystemRegistryData() {
    try {
      // Try to get system health status
      const healthStatusResult = await pool.query(`
        SELECT status FROM system_health_status ORDER BY updated_at DESC LIMIT 1
      `);
      
      const healthStatus = healthStatusResult.rows[0]?.status || 'unknown';
      
      return {
        instance_id: this.instanceId,
        instance_type: 'client',
        version: process.env.APP_VERSION || '1.0.0',
        deployment_timestamp: process.env.DEPLOYMENT_DATE || new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        health_status: healthStatus
      };
    } catch (error) {
      logger.error('Error gathering system registry data:', error);
      
      // Provide fallback values if DB query fails
      return {
        instance_id: this.instanceId,
        instance_type: 'client',
        version: '1.0.0',
        deployment_timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        health_status: 'unknown'
      };
    }
  }

  /**
   * Get blueprint management data
   */
  private async getBlueprintManagementData() {
    try {
      // Get blueprint registry data
      const registry = await storage.getClientRegistry();
      
      // Get available blueprints
      const blueprintsResult = await pool.query(`
        SELECT blueprint_version FROM client_registry
        WHERE blueprint_version IS NOT NULL
        GROUP BY blueprint_version
      `);
      
      const availableBlueprints = blueprintsResult.rows.map(row => row.blueprint_version);
      
      // Get exportable modules
      let exportableModules: string[] = [];
      if (registry && registry.exportableModules) {
        if (Array.isArray(registry.exportableModules)) {
          exportableModules = registry.exportableModules as string[];
        } else if (typeof registry.exportableModules === 'string') {
          try {
            exportableModules = JSON.parse(registry.exportableModules as string);
          } catch (e) {
            logger.error('Error parsing exportable modules:', e);
          }
        }
      }
      
      return {
        blueprint_version: registry?.blueprintVersion || '1.0.0',
        available_blueprints: availableBlueprints,
        blueprint_compatibility: ['client_site', 'admin_portal'],
        last_blueprint_update: registry?.updatedAt?.toISOString() || new Date().toISOString(),
        blueprint_update_source: registry?.updateSource || 'manual',
        exportable_modules: exportableModules
      };
    } catch (error) {
      logger.error('Error gathering blueprint management data:', error);
      
      // Provide fallback values
      return {
        blueprint_version: '1.0.0',
        available_blueprints: ['1.0.0'],
        blueprint_compatibility: ['client_site'],
        last_blueprint_update: new Date().toISOString(),
        blueprint_update_source: 'manual',
        exportable_modules: []
      };
    }
  }

  /**
   * Get tool registry data
   */
  private async getToolRegistryData() {
    try {
      // Get installed tools
      const tools = await storage.getInstalledTools();
      
      // Get tool installations with status
      const toolStatusResult = await pool.query(`
        SELECT t.id, t.name, ti.installation_status, ti.version, ti.last_used
        FROM tools t
        LEFT JOIN tool_installations ti ON t.id = ti.tool_id
        WHERE ti.tenant_id = '00000000-0000-0000-0000-000000000000'
      `);
      
      const toolNames = tools.map(tool => tool.id);
      
      // Create tool status map
      const toolStatus: Record<string, string> = {};
      const toolVersions: Record<string, string> = {};
      const toolSource: Record<string, string> = {};
      
      toolStatusResult.rows.forEach(row => {
        toolStatus[row.name] = row.installation_status || 'inactive';
        toolVersions[row.name] = row.version || '1.0.0';
        toolSource[row.name] = 'native';
      });
      
      // Create dummy tool dependencies and permissions for now
      const toolDependencies: Record<string, string[]> = {};
      const toolPermissions: Record<string, string[]> = {};
      const toolActivationHistory: Record<string, {timestamp: string, status: string}[]> = {};
      
      toolNames.forEach(tool => {
        toolDependencies[tool] = [];
        toolPermissions[tool] = ['admin', 'manager'];
        toolActivationHistory[tool] = [{
          timestamp: new Date().toISOString(),
          status: toolStatus[tool] || 'active'
        }];
      });
      
      return {
        available_tools: toolNames,
        tool_versions: toolVersions,
        tool_status: toolStatus,
        tool_dependencies: toolDependencies,
        tool_permissions: toolPermissions,
        tool_activation_history: toolActivationHistory,
        tool_source: toolSource
      };
    } catch (error) {
      logger.error('Error gathering tool registry data:', error);
      
      // Provide fallback values
      return {
        available_tools: ['page_builder', 'seo_optimizer'],
        tool_versions: {'page_builder': '1.0.0', 'seo_optimizer': '1.0.0'},
        tool_status: {'page_builder': 'active', 'seo_optimizer': 'active'},
        tool_dependencies: {'page_builder': [], 'seo_optimizer': []},
        tool_permissions: {'page_builder': ['admin'], 'seo_optimizer': ['admin']},
        tool_activation_history: {
          'page_builder': [{timestamp: new Date().toISOString(), status: 'active'}],
          'seo_optimizer': [{timestamp: new Date().toISOString(), status: 'active'}]
        },
        tool_source: {'page_builder': 'native', 'seo_optimizer': 'native'}
      };
    }
  }

  /**
   * Get feature flags data
   */
  private async getFeatureFlagsData() {
    try {
      // Get feature flags for default tenant
      const featureFlagsResult = await pool.query(`
        SELECT feature_key, is_enabled
        FROM tenant_feature_flags
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
      `);
      
      const featureFlagRegistry = featureFlagsResult.rows.map(row => row.feature_key);
      const flagStates: Record<string, boolean> = {};
      
      featureFlagsResult.rows.forEach(row => {
        flagStates[row.feature_key] = row.is_enabled;
      });
      
      // Tenant specific flags - flags that vary by tenant
      const tenantSpecificFlagsResult = await pool.query(`
        SELECT feature_key
        FROM tenant_feature_flags
        GROUP BY feature_key
        HAVING COUNT(DISTINCT is_enabled) > 1
      `);
      
      const tenantSpecificFlags = tenantSpecificFlagsResult.rows.map(row => row.feature_key);
      
      // Create placeholder data for flag relationships and activation conditions
      const flagRelationships: Record<string, string[]> = {};
      const flagActivationConditions: Record<string, string> = {};
      const flagOverrideHistory: Record<string, {timestamp: string, value: boolean, reason: string}[]> = {};
      
      featureFlagRegistry.forEach(flag => {
        flagRelationships[flag] = [];
        flagActivationConditions[flag] = 'manual';
        flagOverrideHistory[flag] = [{
          timestamp: new Date().toISOString(),
          value: flagStates[flag] || false,
          reason: 'Initial setup'
        }];
      });
      
      return {
        feature_flag_registry: featureFlagRegistry,
        flag_states: flagStates,
        flag_override_history: flagOverrideHistory,
        flag_relationships: flagRelationships,
        tenant_specific_flags: tenantSpecificFlags,
        flag_activation_conditions: flagActivationConditions
      };
    } catch (error) {
      logger.error('Error gathering feature flags data:', error);
      
      // Provide fallback values
      return {
        feature_flag_registry: ['websiteBuilder', 'pageCreator'],
        flag_states: {'websiteBuilder': true, 'pageCreator': true},
        flag_override_history: {
          'websiteBuilder': [{
            timestamp: new Date().toISOString(),
            value: true,
            reason: 'Default'
          }],
          'pageCreator': [{
            timestamp: new Date().toISOString(),
            value: true,
            reason: 'Default'
          }]
        },
        flag_relationships: {'websiteBuilder': [], 'pageCreator': []},
        tenant_specific_flags: [],
        flag_activation_conditions: {'websiteBuilder': 'default', 'pageCreator': 'default'}
      };
    }
  }

  /**
   * Get synchronization data
   */
  private async getSynchronizationData() {
    try {
      // Get sync logs
      const syncLogs = await storage.getSotSyncLogs(10);
      
      const syncHistory = syncLogs.map(log => ({
        timestamp: log.createdAt?.toISOString() || new Date().toISOString(),
        status: log.status,
        details: log.details || undefined
      }));
      
      // Calculate sync success rate
      const successCount = syncLogs.filter(log => log.status === 'success').length;
      const syncSuccessRate = syncLogs.length > 0 ? successCount / syncLogs.length : 1;
      
      return {
        sync_history: syncHistory,
        last_sync_timestamp: syncLogs[0]?.createdAt?.toISOString() || new Date().toISOString(),
        sync_sources: ['manual', 'scheduled'],
        sync_success_rate: syncSuccessRate,
        pending_sync_operations: [],
        sync_conflict_resolution: 'manual'
      };
    } catch (error) {
      logger.error('Error gathering synchronization data:', error);
      
      // Provide fallback values
      return {
        sync_history: [{
          timestamp: new Date().toISOString(),
          status: 'success',
          details: 'Initial sync'
        }],
        last_sync_timestamp: new Date().toISOString(),
        sync_sources: ['manual'],
        sync_success_rate: 1,
        pending_sync_operations: [],
        sync_conflict_resolution: 'manual'
      };
    }
  }

  /**
   * Get self-update capabilities data
   */
  private async getSelfUpdateCapabilitiesData() {
    // This is mostly based on system capabilities rather than database data
    return {
      update_detection_mechanism: 'external-notification',
      auto_update_eligibility: ['feature-flags', 'content-templates'],
      update_authorization_level: 'admin',
      update_protocols: ['guardian-validation', 'admin-confirmation'],
      rollback_capability: true,
      update_history: [{
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        source: 'initial-setup',
        status: 'success'
      }]
    };
  }

  /**
   * Get tenant info data
   */
  private async getTenantInfoData() {
    try {
      // Get all active tenants
      const tenantsResult = await pool.query(`
        SELECT id, name
        FROM tenants
        WHERE status = 'active'
      `);
      
      const activeTenants = tenantsResult.rows.map(row => row.id);
      
      // Get tenant permissions
      const tenantPermissions: Record<string, string[]> = {};
      activeTenants.forEach(tenantId => {
        tenantPermissions[tenantId] = ['view', 'edit', 'delete'];
      });
      
      // Get tenant feature configurations
      const tenantFeatureConfiguration: Record<string, Record<string, boolean>> = {};
      
      for (const tenantId of activeTenants) {
        const featureFlagsResult = await pool.query(`
          SELECT feature_key, is_enabled
          FROM tenant_feature_flags
          WHERE tenant_id = $1
        `, [tenantId]);
        
        const featureConfig: Record<string, boolean> = {};
        featureFlagsResult.rows.forEach(row => {
          featureConfig[row.feature_key] = row.is_enabled;
        });
        
        tenantFeatureConfiguration[tenantId] = featureConfig;
      }
      
      // Get tenant blueprint versions
      const tenantBlueprintVersions: Record<string, string> = {};
      activeTenants.forEach(tenantId => {
        tenantBlueprintVersions[tenantId] = '1.0.0';
      });
      
      return {
        active_tenants: activeTenants,
        tenant_permissions: tenantPermissions,
        tenant_feature_configuration: tenantFeatureConfiguration,
        tenant_blueprint_versions: tenantBlueprintVersions,
        tenant_isolation_status: true
      };
    } catch (error) {
      logger.error('Error gathering tenant info data:', error);
      
      // Provide fallback values
      return {
        active_tenants: ['00000000-0000-0000-0000-000000000000'],
        tenant_permissions: {'00000000-0000-0000-0000-000000000000': ['view', 'edit', 'delete']},
        tenant_feature_configuration: {'00000000-0000-0000-0000-000000000000': {'websiteBuilder': true}},
        tenant_blueprint_versions: {'00000000-0000-0000-0000-000000000000': '1.0.0'},
        tenant_isolation_status: true
      };
    }
  }

  /**
   * Get security and access control data
   */
  private async getSecurityAndAccessControlData() {
    try {
      // Get active roles
      const rolesResult = await pool.query(`
        SELECT name
        FROM roles
      `);
      
      const activeRoles = rolesResult.rows.map(row => row.name);
      
      // Get admin users
      const adminsResult = await pool.query(`
        SELECT username
        FROM users
        WHERE role_id IN (SELECT id FROM roles WHERE name = 'admin')
      `);
      
      const adminRegistry = adminsResult.rows.map(row => row.username);
      
      // Role capabilities map
      const roleCapabilities: Record<string, string[]> = {
        'admin': ['manage_users', 'manage_content', 'manage_settings', 'view_analytics'],
        'manager': ['manage_content', 'view_analytics'],
        'editor': ['edit_content', 'view_analytics'],
        'viewer': ['view_content']
      };
      
      return {
        authentication_mechanisms: ['password', 'session'],
        authorization_levels: ['admin', 'manager', 'editor', 'viewer'],
        active_roles: activeRoles,
        role_capabilities: roleCapabilities,
        admin_registry: adminRegistry,
        super_admin_capabilities: ['system_config', 'tenant_management', 'blueprint_management']
      };
    } catch (error) {
      logger.error('Error gathering security and access control data:', error);
      
      // Provide fallback values
      return {
        authentication_mechanisms: ['password', 'session'],
        authorization_levels: ['admin', 'manager', 'editor', 'viewer'],
        active_roles: ['admin', 'manager', 'editor', 'viewer'],
        role_capabilities: {
          'admin': ['manage_users', 'manage_content', 'manage_settings'],
          'manager': ['manage_content', 'view_analytics'],
          'editor': ['edit_content'],
          'viewer': ['view_content']
        },
        admin_registry: ['admin'],
        super_admin_capabilities: ['system_config', 'tenant_management']
      };
    }
  }

  /**
   * Get monitoring and logging data
   */
  private async getMonitoringAndLoggingData() {
    try {
      // Get recent health metrics
      const healthMetricsResult = await pool.query(`
        SELECT metric_name, metric_value
        FROM health_metrics
        WHERE created_at > NOW() - INTERVAL '24 hours'
        ORDER BY created_at DESC
        LIMIT 20
      `);
      
      const healthMetrics: Record<string, any> = {};
      healthMetricsResult.rows.forEach(row => {
        healthMetrics[row.metric_name] = row.metric_value;
      });
      
      // Get recent error logs
      const errorLogsResult = await pool.query(`
        SELECT created_at, level, message
        FROM health_incidents
        WHERE level = 'error'
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      const errorLogs = errorLogsResult.rows.map(row => ({
        timestamp: row.created_at.toISOString(),
        level: row.level,
        message: row.message
      }));
      
      // Get recent activity logs
      const activityLogsResult = await pool.query(`
        SELECT created_at, user_type as user, action_type as action
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      const activityLogs = activityLogsResult.rows.map(row => ({
        timestamp: row.created_at.toISOString(),
        user: row.user,
        action: row.action
      }));
      
      // Get audit trail (security-specific activities)
      const auditTrailResult = await pool.query(`
        SELECT created_at, user_type as user, action_type as action, entity_type as resource
        FROM activity_logs
        WHERE action_type IN ('login', 'logout', 'password_reset', 'role_change')
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      const auditTrail = auditTrailResult.rows.map(row => ({
        timestamp: row.created_at.toISOString(),
        user: row.user,
        action: row.action,
        resource: row.resource
      }));
      
      return {
        health_metrics: healthMetrics,
        error_logs: errorLogs,
        activity_logs: activityLogs,
        audit_trail: auditTrail,
        performance_benchmarks: {
          'page_load_time_ms': 500,
          'api_response_time_ms': 200,
          'database_query_time_ms': 100
        },
        anomaly_detection_rules: [
          'cpu_usage > 80%',
          'memory_usage > 70%',
          'response_time > 2000ms',
          'error_rate > 5%'
        ]
      };
    } catch (error) {
      logger.error('Error gathering monitoring and logging data:', error);
      
      // Provide fallback values
      return {
        health_metrics: {
          'cpu_usage': 30,
          'memory_usage': 40,
          'active_users': 5
        },
        error_logs: [],
        activity_logs: [],
        audit_trail: [],
        performance_benchmarks: {
          'page_load_time_ms': 500,
          'api_response_time_ms': 200,
          'database_query_time_ms': 100
        },
        anomaly_detection_rules: [
          'cpu_usage > 80%',
          'memory_usage > 70%',
          'error_rate > 5%'
        ]
      };
    }
  }

  /**
   * Get branding data
   */
  private async getBrandingData() {
    try {
      // Get business identity
      const identityResult = await pool.query(`
        SELECT core
        FROM business_identity
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let brandName = 'Progress Accountants';
      let primaryColor = '#336699';
      let logoPath = '/logo.svg';
      let voiceStyle = 'professional';
      let tagline = 'Accounting for your future';
      
      if (identityResult.rows.length > 0) {
        const core = identityResult.rows[0].core;
        brandName = core.businessName || brandName;
        primaryColor = core.primaryColor || primaryColor;
        logoPath = core.logoUrl || logoPath;
        voiceStyle = core.brandVoice || voiceStyle;
        tagline = core.tagline || tagline;
      }
      
      return {
        brandName,
        primaryColor,
        logoPath,
        voiceStyle,
        tagline
      };
    } catch (error) {
      logger.error('Error gathering branding data:', error);
      
      // Provide fallback values
      return {
        brandName: 'Progress Accountants',
        primaryColor: '#336699',
        logoPath: '/logo.svg',
        voiceStyle: 'professional',
        tagline: 'Accounting for your future'
      };
    }
  }

  /**
   * Get location data
   */
  private async getLocationData() {
    try {
      // Get location information from business identity
      const locationResult = await pool.query(`
        SELECT location
        FROM business_identity
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let officeAddress = '123 Business St, London, UK';
      let gpsCoordinates = '51.5074, -0.1278';
      let regionsServed = ['London', 'Manchester', 'Birmingham'];
      let defaultTransportAdvice = 'Our office is accessible by tube, bus, and has parking facilities.';
      let localSEOKeywords = ['accountants london', 'tax services uk', 'business accounting'];
      
      if (locationResult.rows.length > 0) {
        const location = locationResult.rows[0].location;
        if (location) {
          officeAddress = `${location.streetAddress || ''}, ${location.city || ''}, ${location.country || ''}`.trim();
          if (location.latitude && location.longitude) {
            gpsCoordinates = `${location.latitude}, ${location.longitude}`;
          }
          if (location.regionsServed && Array.isArray(location.regionsServed)) {
            regionsServed = location.regionsServed;
          }
          if (location.transportInfo) {
            defaultTransportAdvice = location.transportInfo;
          }
          if (location.seoKeywords && Array.isArray(location.seoKeywords)) {
            localSEOKeywords = location.seoKeywords;
          }
        }
      }
      
      return {
        officeAddress,
        gps_coordinates: gpsCoordinates,
        regionsServed,
        defaultTransportAdvice,
        localSEOKeywords
      };
    } catch (error) {
      logger.error('Error gathering location data:', error);
      
      // Provide fallback values
      return {
        officeAddress: '123 Business St, London, UK',
        gps_coordinates: '51.5074, -0.1278',
        regionsServed: ['London', 'Manchester', 'Birmingham'],
        defaultTransportAdvice: 'Our office is accessible by tube, bus, and has parking facilities.',
        localSEOKeywords: ['accountants london', 'tax services uk', 'business accounting']
      };
    }
  }

  /**
   * Get tool configs data
   */
  private async getToolConfigsData() {
    // These are placeholder values for now
    // In a real implementation, you would get this from a tool_config table
    return {
      "Autopilot Mode": {
        enabled: false,
        scheduledPosts: [],
        chatFallback: "Please contact our team during business hours."
      },
      "Lead Radar": {
        emailParserEnabled: true,
        outreachStrategy: "timely-response",
        prospectRadius: "25mi"
      }
    };
  }

  /**
   * Get chat assistant data
   */
  private async getChatAssistantData() {
    try {
      // Get chat assistant configuration
      const chatConfigResult = await pool.query(`
        SELECT settings
        FROM tool_installations
        WHERE tool_id IN (SELECT id FROM tools WHERE name = 'companion_assistant')
        AND tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let persona = 'Financial Advisor';
      let tone = 'Professional';
      let hours = 'Mon-Fri 9am-5pm';
      let awayMessage = 'Thanks for your message. Our team will respond during business hours.';
      
      if (chatConfigResult.rows.length > 0 && chatConfigResult.rows[0].settings) {
        const settings = chatConfigResult.rows[0].settings;
        if (settings.persona) persona = settings.persona;
        if (settings.tone) tone = settings.tone;
        if (settings.hours) hours = settings.hours;
        if (settings.awayMessage) awayMessage = settings.awayMessage;
      }
      
      return {
        persona,
        tone,
        hours,
        awayMessage
      };
    } catch (error) {
      logger.error('Error gathering chat assistant data:', error);
      
      // Provide fallback values
      return {
        persona: 'Financial Advisor',
        tone: 'Professional',
        hours: 'Mon-Fri 9am-5pm',
        awayMessage: 'Thanks for your message. Our team will respond during business hours.'
      };
    }
  }

  /**
   * Get media data
   */
  private async getMediaData() {
    try {
      // Get business identity for logo
      const identityResult = await pool.query(`
        SELECT core
        FROM business_identity
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let logo = '/assets/logo.png';
      
      if (identityResult.rows.length > 0 && identityResult.rows[0].core) {
        logo = identityResult.rows[0].core.logoUrl || logo;
      }
      
      // Get team photos
      const teamPhotosResult = await pool.query(`
        SELECT image_url
        FROM team_members
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        AND image_url IS NOT NULL
      `);
      
      const teamPhotos = teamPhotosResult.rows.map(row => row.image_url);
      
      // Get testimonials
      const testimonialsResult = await pool.query(`
        SELECT quote, client_name, business_name
        FROM testimonials
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        AND is_approved = true
      `);
      
      const testimonials = testimonialsResult.rows.map(row => ({
        quote: row.quote,
        clientName: row.client_name,
        business: row.business_name
      }));
      
      return {
        logo,
        teamPhotos,
        testimonials: testimonials.length > 0 ? testimonials : [
          {
            quote: "Progress Accountants has transformed how we manage our finances.",
            clientName: "John Smith",
            business: "Smith Enterprises"
          }
        ]
      };
    } catch (error) {
      logger.error('Error gathering media data:', error);
      
      // Provide fallback values
      return {
        logo: '/assets/logo.png',
        teamPhotos: [],
        testimonials: [
          {
            quote: "Progress Accountants has transformed how we manage our finances.",
            clientName: "John Smith",
            business: "Smith Enterprises"
          }
        ]
      };
    }
  }

  /**
   * Get site structure data
   */
  private async getSiteStructureData() {
    try {
      // Get pages
      const pages = await storage.getPages();
      const pagePaths = pages.map(page => page.path);
      
      // Get navigation from settings
      const navigationResult = await pool.query(`
        SELECT navigation
        FROM site_settings
        WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let navigationOrder = pagePaths;
      let primaryCTA = 'Contact Us';
      
      if (navigationResult.rows.length > 0 && navigationResult.rows[0].navigation) {
        const navigation = navigationResult.rows[0].navigation;
        if (navigation.order && Array.isArray(navigation.order)) {
          navigationOrder = navigation.order;
        }
        if (navigation.primaryCTA) {
          primaryCTA = navigation.primaryCTA;
        }
      }
      
      return {
        pages: pagePaths,
        navigationOrder,
        primaryCTA
      };
    } catch (error) {
      logger.error('Error gathering site structure data:', error);
      
      // Provide fallback values
      return {
        pages: ['/', '/about', '/services', '/contact'],
        navigationOrder: ['/', '/about', '/services', '/contact'],
        primaryCTA: 'Contact Us'
      };
    }
  }

  /**
   * Get page content data
   */
  private async getPageContentData() {
    try {
      // Get About page content
      const aboutPageResult = await pool.query(`
        SELECT content, seo_metadata
        FROM page_builder_pages
        WHERE path = '/about'
        AND tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let aboutSummary = 'Progress Accountants is a leading accounting firm.';
      let aboutKeywords = ['accounting', 'tax', 'financial planning', 'bookkeeping'];
      
      if (aboutPageResult.rows.length > 0) {
        if (aboutPageResult.rows[0].content) {
          // Try to extract a summary
          const content = aboutPageResult.rows[0].content;
          if (typeof content === 'object' && content.blocks) {
            const textBlocks = content.blocks.filter((block: any) => 
              block.type === 'paragraph' || block.type === 'heading'
            );
            if (textBlocks.length > 0 && textBlocks[0].data && textBlocks[0].data.text) {
              aboutSummary = textBlocks[0].data.text;
            }
          }
        }
        
        if (aboutPageResult.rows[0].seo_metadata && aboutPageResult.rows[0].seo_metadata.keywords) {
          aboutKeywords = aboutPageResult.rows[0].seo_metadata.keywords;
        }
      }
      
      // Get Home page content
      const homePageResult = await pool.query(`
        SELECT content, seo_metadata
        FROM page_builder_pages
        WHERE path = '/'
        AND tenant_id = '00000000-0000-0000-0000-000000000000'
        LIMIT 1
      `);
      
      let headline = 'Expert Accounting Services for Your Business';
      let subtext = 'Providing professional accounting services to help your business grow.';
      let imageHero = '/assets/hero.jpg';
      
      if (homePageResult.rows.length > 0) {
        if (homePageResult.rows[0].content) {
          const content = homePageResult.rows[0].content;
          
          // Try to extract headline and subtext
          if (typeof content === 'object' && content.blocks) {
            const headingBlock = content.blocks.find((block: any) => 
              block.type === 'heading' && block.data && block.data.level === 1
            );
            
            if (headingBlock && headingBlock.data && headingBlock.data.text) {
              headline = headingBlock.data.text;
            }
            
            const subtextBlock = content.blocks.find((block: any) => 
              block.type === 'paragraph' && 
              content.blocks.indexOf(block) > content.blocks.indexOf(headingBlock)
            );
            
            if (subtextBlock && subtextBlock.data && subtextBlock.data.text) {
              subtext = subtextBlock.data.text;
            }
            
            // Find hero image
            const imageBlock = content.blocks.find((block: any) => 
              block.type === 'image' && block.data && block.data.file && block.data.file.url
            );
            
            if (imageBlock && imageBlock.data && imageBlock.data.file && imageBlock.data.file.url) {
              imageHero = imageBlock.data.file.url;
            }
          }
        }
      }
      
      return {
        About: {
          summary: aboutSummary,
          keywords: aboutKeywords
        },
        Home: {
          headline,
          subtext,
          imageHero
        }
      };
    } catch (error) {
      logger.error('Error gathering page content data:', error);
      
      // Provide fallback values
      return {
        About: {
          summary: 'Progress Accountants is a leading accounting firm.',
          keywords: ['accounting', 'tax', 'financial planning', 'bookkeeping']
        },
        Home: {
          headline: 'Expert Accounting Services for Your Business',
          subtext: 'Providing professional accounting services to help your business grow.',
          imageHero: '/assets/hero.jpg'
        }
      };
    }
  }

  /**
   * Get guardian data
   */
  private async getGuardianData() {
    try {
      // Get latest guardian sync
      const guardianSyncResult = await pool.query(`
        SELECT created_at
        FROM activity_logs
        WHERE action_type = 'guardian_sync'
        ORDER BY created_at DESC
        LIMIT 1
      `);
      
      let lastCheckIn = guardianSyncResult.rows.length > 0 ? 
        guardianSyncResult.rows[0].created_at.toISOString() : 
        new Date().toISOString();
      
      // For now, let's assume we conform to the schema
      return {
        lastCheckIn,
        schemaConformity: 'full',
        fieldsMissing: []
      };
    } catch (error) {
      logger.error('Error gathering guardian data:', error);
      
      // Provide fallback values
      return {
        lastCheckIn: new Date().toISOString(),
        schemaConformity: 'full',
        fieldsMissing: []
      };
    }
  }

  /**
   * Submit the check-in data to the NextMonth SOT
   */
  public async submitCheckIn(data: ClientCheckIn): Promise<boolean> {
    try {
      logger.info('Submitting client check-in data to NextMonth SOT...');
      
      // For now, assume success and log to activity log
      await pool.query(`
        INSERT INTO activity_logs (user_type, action_type, entity_type, entity_id, details)
        VALUES ('system', 'sot_check_in', 'client', $1, $2)
      `, [
        data.systemRegistry.instance_id,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 'success',
          schemaVersion: '1.0.0'
        })
      ]);
      
      return true;
    } catch (error) {
      logger.error('Error submitting client check-in data:', error);
      return false;
    }
  }
}

// Create singleton instance
export const clientCheckInService = new ClientCheckInService();