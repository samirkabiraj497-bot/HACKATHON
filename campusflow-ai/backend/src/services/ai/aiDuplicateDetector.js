const db = require('../../database/db');

/**
 * AI Duplicate & Cluster Detection Engine
 * Uses token Jaccard similarity, entity overlap, and location co-occurrence
 * to detect concurrent reports of the same physical campus defect.
 */

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);
}

function calculateSimilarity(textA, textB) {
  const setA = new Set(tokenize(textA));
  const setB = new Set(tokenize(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

async function findDuplicateIncidents({ title, description, location, categoryId, departmentId, currentRequestId = null }) {
  const allRequests = await db.requests.find();
  const candidates = [];

  const targetLocation = (location || '').toLowerCase().trim();
  const targetText = `${title || ''} ${description || ''}`.toLowerCase();

  for (const req of allRequests) {
    if (req.id === currentRequestId) continue;
    if (req.status === 'RESOLVED' || req.status === 'CLOSED') continue;

    const reqLoc = (req.location || '').toLowerCase().trim();
    let locationMatch = false;

    if (targetLocation && reqLoc) {
      if (targetLocation.includes(reqLoc) || reqLoc.includes(targetLocation) || targetLocation.replace(/\s+/g, '') === reqLoc.replace(/\s+/g, '')) {
        locationMatch = true;
      }
    }

    const similarity = calculateSimilarity(
      targetText,
      `${req.title || ''} ${req.description || ''}`
    );

    // Asset keywords
    const keywords = ['ac', 'hvac', 'leak', 'water', 'cooling', 'projector', 'wifi', 'wi-fi', 'lamp', 'power'];
    const hasCommonKeyword = keywords.some(k => targetText.includes(k) && (`${req.title || ''} ${req.description || ''}`.toLowerCase()).includes(k));

    let matchConfidence = similarity;
    if (locationMatch && hasCommonKeyword) {
      matchConfidence = Math.max(0.78, similarity + 0.50);
    } else if (locationMatch) {
      matchConfidence = Math.min(0.98, similarity + 0.35);
    }

    if (matchConfidence >= 0.50 || (locationMatch && similarity >= 0.15)) {
      candidates.push({
        request: req,
        similarity: parseFloat(matchConfidence.toFixed(2)),
        isSameLocation: locationMatch,
        summary: req.title
      });
    }
  }

  candidates.sort((a, b) => b.similarity - a.similarity);

  const isDuplicate = candidates.length > 0;
  const masterCandidate = candidates.length > 0 ? candidates[0].request : null;

  return {
    isDuplicate,
    clusterSize: candidates.length + 1,
    duplicateCount: candidates.length,
    matches: candidates,
    primaryIncidentRecommendation: masterCandidate
      ? {
          masterRequestId: masterCandidate.id,
          masterRequestNumber: masterCandidate.request_number,
          title: masterCandidate.title,
          location: masterCandidate.location,
          suggestedAction: 'MERGE_INTO_MASTER_INCIDENT'
        }
      : null
  };
}

/**
 * Merge duplicate requests into a Master Incident
 */
async function mergeRequestsIntoMasterIncident({ masterRequestId, duplicateRequestIds, mergedBy = 'AI_AGENT' }) {
  const masterReq = await db.requests.findById(masterRequestId);
  if (!masterReq) throw new Error('Master request not found');

  // Create or retrieve master incident
  let incident = null;
  if (masterReq.master_incident_id) {
    incident = await db.incidents.findById(masterReq.master_incident_id);
  }

  if (!incident) {
    incident = await db.incidents.create({
      title: `Master Incident: ${masterReq.title}`,
      category: masterReq.category_name,
      location: masterReq.location,
      status: 'INVESTIGATING',
      root_cause: `Consolidated incident cluster for ${masterReq.location}`,
      merged_request_count: 1 + duplicateRequestIds.length,
      primary_request_id: masterReq.id
    });

    await db.requests.update(masterReq.id, {
      master_incident_id: incident.id,
      is_duplicate: false
    });
  } else {
    await db.incidents.update(incident.id, {
      merged_request_count: (incident.merged_request_count || 1) + duplicateRequestIds.length
    });
  }

  // Update duplicate requests
  for (const dupId of duplicateRequestIds) {
    await db.requests.update(dupId, {
      master_incident_id: incident.id,
      is_duplicate: true,
      status: 'MERGED'
    });

    // Notify original submitters
    const dup = await db.requests.findById(dupId);
    if (dup && dup.submitted_by) {
      await db.notifications.create({
        user_id: dup.submitted_by,
        title: 'Request Consolidated into Master Incident',
        message: `Your request (${dup.request_number}) regarding "${dup.title}" has been merged with Master Incident #${incident.id.slice(0, 8)} to expedite resolution. You will receive real-time updates as technicians work on the central resolution.`,
        type: 'duplicate_merge',
        reference_id: dup.id,
        reference_type: 'request'
      });
    }
  }

  // Log audit
  await db.auditLogs.create({
    actor_name: mergedBy,
    actor_type: mergedBy === 'AI_AGENT' ? 'AI_AGENT' : 'ADMIN',
    action: 'MERGE_DUPLICATE_INCIDENT',
    entity_type: 'incident',
    entity_id: incident.id,
    details: `Merged ${duplicateRequestIds.length} requests into master incident #${incident.id.slice(0, 8)} at ${masterReq.location}`
  });

  return {
    success: true,
    incidentId: incident.id,
    mergedCount: duplicateRequestIds.length + 1
  };
}

module.exports = {
  findDuplicateIncidents,
  mergeRequestsIntoMasterIncident,
  calculateSimilarity
};
