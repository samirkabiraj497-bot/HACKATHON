const { supabase } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory memory-store for ultra-fast response and zero-network failure safety
const localStore = {};

function getStoreFilePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function loadLocalTable(table) {
  if (localStore[table]) return localStore[table];
  const file = getStoreFilePath(table);
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      localStore[table] = data;
      return data;
    } catch (err) {
      localStore[table] = [];
      return [];
    }
  }
  localStore[table] = [];
  return [];
}

function saveLocalTable(table, records) {
  localStore[table] = records;
  try {
    fs.writeFileSync(getStoreFilePath(table), JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to write local cache for ${table}:`, err.message);
  }
}

class DBTable {
  constructor(tableName) {
    this.tableName = tableName;
    loadLocalTable(tableName);
  }

  async find(filter = {}) {
    const localRecords = loadLocalTable(this.tableName);
    try {
      let query = supabase.from(this.tableName).select('*');
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
      const { data, error } = await query;
      if (!error && data && data.length >= localRecords.length && data.length > 0) {
        saveLocalTable(this.tableName, data);
        return data;
      }
      if (!error && data && data.length > 0 && localRecords.length === 0) {
        saveLocalTable(this.tableName, data);
        return data;
      }
    } catch (err) {
      // Fall through to resilient local cache
    }

    // Local fallback filter
    return localRecords.filter((item) => {
      for (const [key, val] of Object.entries(filter)) {
        if (val !== undefined && val !== null && item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list.length > 0 ? list[0] : null;
  }

  async findById(id) {
    return this.findOne({ id });
  }

  async create(record) {
    const item = {
      id: record.id || (await import('crypto')).randomUUID(),
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...record,
    };

    // Try Supabase first
    try {
      const { data, error } = await supabase.from(this.tableName).insert([item]).select().single();
      if (!error && data) {
        const current = loadLocalTable(this.tableName);
        current.unshift(data);
        saveLocalTable(this.tableName, current);
        return data;
      }
    } catch (err) {
      console.warn(`Supabase insert fallback for ${this.tableName}:`, err.message);
    }

    // Resilient local store
    const current = loadLocalTable(this.tableName);
    current.unshift(item);
    saveLocalTable(this.tableName, current);
    return item;
  }

  async update(id, updates) {
    const patch = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const current = loadLocalTable(this.tableName);
        const index = current.findIndex((r) => r.id === id);
        if (index >= 0) current[index] = data;
        saveLocalTable(this.tableName, current);
        return data;
      }
    } catch (err) {
      console.warn(`Supabase update fallback for ${this.tableName}:`, err.message);
    }

    // Resilient local store
    const current = loadLocalTable(this.tableName);
    const index = current.findIndex((r) => r.id === id);
    if (index >= 0) {
      current[index] = { ...current[index], ...patch };
      saveLocalTable(this.tableName, current);
      return current[index];
    }
    return null;
  }

  async delete(id) {
    try {
      await supabase.from(this.tableName).delete().eq('id', id);
    } catch (err) {
      console.warn(`Supabase delete fallback for ${this.tableName}:`, err.message);
    }

    const current = loadLocalTable(this.tableName);
    const filtered = current.filter((r) => r.id !== id);
    saveLocalTable(this.tableName, filtered);
    return true;
  }

  async count(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }

  async setAll(records) {
    saveLocalTable(this.tableName, records);
    try {
      // Upsert to Supabase
      if (records && records.length > 0) {
        await supabase.from(this.tableName).upsert(records);
      }
    } catch (err) {
      // Local is primary source
    }
  }
}

const db = {
  users: new DBTable('users'),
  roles: new DBTable('roles'),
  departments: new DBTable('departments'),
  employees: new DBTable('employees'),
  students: new DBTable('students'),
  requests: new DBTable('requests'),
  requestCategories: new DBTable('request_categories'),
  requestComments: new DBTable('request_comments'),
  requestAttachments: new DBTable('request_attachments'),
  tasks: new DBTable('tasks'),
  taskAssignments: new DBTable('task_assignments'),
  workflows: new DBTable('workflows'),
  workflowNodes: new DBTable('workflow_nodes'),
  workflowRuns: new DBTable('workflow_runs'),
  approvals: new DBTable('approvals'),
  notifications: new DBTable('notifications'),
  slaRules: new DBTable('sla_rules'),
  escalationRules: new DBTable('escalation_rules'),
  automationRules: new DBTable('automation_rules'),
  aiDecisions: new DBTable('ai_decisions'),
  incidents: new DBTable('incidents'),
  auditLogs: new DBTable('audit_logs'),
  analytics: new DBTable('analytics'),
};

module.exports = db;
