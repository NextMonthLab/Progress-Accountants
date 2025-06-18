import { z } from 'zod';

/**
 * Full SOT Schema v1.0.0 for Client Apps
 * This schema follows the requirements from Mission Control
 */
export const clientCheckInSchema = z.object({
  systemRegistry: z.object({
    instance_id: z.string(),
    instance_type: z.string(),
    version: z.string(),
    deployment_timestamp: z.string(),
    environment: z.string(),
    health_status: z.string()
  }),
  blueprintManagement: z.object({
    blueprint_version: z.string(),
    available_blueprints: z.array(z.string()),
    blueprint_compatibility: z.array(z.string()),
    last_blueprint_update: z.string(),
    blueprint_update_source: z.string(),
    exportable_modules: z.array(z.string())
  }),
  toolRegistry: z.object({
    available_tools: z.array(z.string()),
    tool_versions: z.record(z.string()),
    tool_status: z.record(z.string()),
    tool_dependencies: z.record(z.array(z.string())),
    tool_permissions: z.record(z.array(z.string())),
    tool_activation_history: z.record(z.array(z.object({
      timestamp: z.string(),
      status: z.string()
    }))),
    tool_source: z.record(z.string())
  }),
  featureFlags: z.object({
    feature_flag_registry: z.array(z.string()),
    flag_states: z.record(z.boolean()),
    flag_override_history: z.record(z.array(z.object({
      timestamp: z.string(),
      value: z.boolean(),
      reason: z.string()
    }))),
    flag_relationships: z.record(z.array(z.string())),
    tenant_specific_flags: z.array(z.string()),
    flag_activation_conditions: z.record(z.string())
  }),
  synchronization: z.object({
    sync_history: z.array(z.object({
      timestamp: z.string(),
      status: z.string(),
      details: z.string().optional()
    })),
    last_sync_timestamp: z.string(),
    sync_sources: z.array(z.string()),
    sync_success_rate: z.number(),
    pending_sync_operations: z.array(z.string()),
    sync_conflict_resolution: z.string()
  }),
  selfUpdateCapabilities: z.object({
    update_detection_mechanism: z.string(),
    auto_update_eligibility: z.array(z.string()),
    update_authorization_level: z.string(),
    update_protocols: z.array(z.string()),
    rollback_capability: z.boolean(),
    update_history: z.array(z.object({
      timestamp: z.string(),
      version: z.string(),
      source: z.string(),
      status: z.string()
    }))
  }),
  tenantInfo: z.object({
    active_tenants: z.array(z.string()),
    tenant_permissions: z.record(z.array(z.string())),
    tenant_feature_configuration: z.record(z.record(z.boolean())),
    tenant_blueprint_versions: z.record(z.string()),
    tenant_isolation_status: z.boolean()
  }),
  securityAndAccessControl: z.object({
    authentication_mechanisms: z.array(z.string()),
    authorization_levels: z.array(z.string()),
    active_roles: z.array(z.string()),
    role_capabilities: z.record(z.array(z.string())),
    admin_registry: z.array(z.string()),
    super_admin_capabilities: z.array(z.string())
  }),
  monitoringAndLogging: z.object({
    health_metrics: z.record(z.any()),
    error_logs: z.array(z.object({
      timestamp: z.string(),
      level: z.string(),
      message: z.string()
    })),
    activity_logs: z.array(z.object({
      timestamp: z.string(),
      user: z.string(),
      action: z.string()
    })),
    audit_trail: z.array(z.object({
      timestamp: z.string(),
      user: z.string(),
      action: z.string(),
      resource: z.string()
    })),
    performance_benchmarks: z.record(z.number()),
    anomaly_detection_rules: z.array(z.string())
  }),
  branding: z.object({
    brandName: z.string(),
    primaryColor: z.string(),
    logoPath: z.string(),
    voiceStyle: z.string(),
    tagline: z.string()
  }),
  location: z.object({
    officeAddress: z.string(),
    gps_coordinates: z.string(),
    regionsServed: z.array(z.string()),
    defaultTransportAdvice: z.string(),
    localSEOKeywords: z.array(z.string())
  }),
  toolConfigs: z.object({
    "Autopilot Mode": z.object({
      enabled: z.boolean(),
      scheduledPosts: z.array(z.string()),
      chatFallback: z.string()
    }),
    "Lead Radar": z.object({
      emailParserEnabled: z.boolean(),
      outreachStrategy: z.string(),
      prospectRadius: z.string()
    })
  }),
  chatAssistant: z.object({
    persona: z.string(),
    tone: z.string(),
    hours: z.string(),
    awayMessage: z.string()
  }),
  media: z.object({
    logo: z.string(),
    teamPhotos: z.array(z.string()),
    testimonials: z.array(z.object({
      quote: z.string(),
      clientName: z.string(),
      business: z.string()
    }))
  }),
  siteStructure: z.object({
    pages: z.array(z.string()),
    navigationOrder: z.array(z.string()),
    primaryCTA: z.string()
  }),
  pageContent: z.object({
    About: z.object({
      summary: z.string(),
      keywords: z.array(z.string())
    }),
    Home: z.object({
      headline: z.string(),
      subtext: z.string(),
      imageHero: z.string()
    })
  }),
  guardian: z.object({
    lastCheckIn: z.string(),
    schemaConformity: z.string(),
    fieldsMissing: z.array(z.string())
  })
});

export type ClientCheckIn = z.infer<typeof clientCheckInSchema>;