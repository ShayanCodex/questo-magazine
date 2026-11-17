import fs from 'node:fs';

const renderApiKey = process.env.RENDER_API_KEY;
const renderServiceId = process.env.RENDER_SERVICE_ID;
const renderDeployHook = process.env.RENDER_DEPLOY_HOOK;
const cfDeployHook = process.env.CLOUDFLARE_DEPLOY_HOOK;
const target = process.env.DEPLOY_TARGET || 'all';

console.log('--- Triggering External Cloud Deployments ---');
console.log(`Target: ${target}`);

const results = [];

// 1. Cloudflare Pages Deployment
if (target === 'all' || target === 'cloudflare-pages') {
  if (cfDeployHook) {
    console.log('\n[Cloudflare Pages] Triggering Deploy Hook...');
    try {
      const res = await fetch(cfDeployHook, { method: 'POST' });
      const text = await res.text();
      console.log(`[Cloudflare Pages] Response (${res.status}):`, text.slice(0, 200));
      results.push({ platform: 'Cloudflare Pages', status: res.ok ? 'Triggered' : 'Failed', code: res.status });
    } catch (e) {
      console.error('[Cloudflare Pages] Error triggering deploy hook:', e.message);
      results.push({ platform: 'Cloudflare Pages', status: 'Error', error: e.message });
    }
  } else {
    console.log('\n[Cloudflare Pages] Note: CLOUDFLARE_DEPLOY_HOOK secret is not set.');
    results.push({ platform: 'Cloudflare Pages', status: 'Skipped (No Hook)', note: 'Set CLOUDFLARE_DEPLOY_HOOK secret in repo' });
  }
}

// 2. Render Deployment
if (target === 'all' || target === 'render') {
  if (renderDeployHook) {
    console.log('\n[Render] Triggering Deploy Hook...');
    try {
      const res = await fetch(renderDeployHook, { method: 'POST' });
      const text = await res.text();
      console.log(`[Render] Response (${res.status}):`, text.slice(0, 200));
      results.push({ platform: 'Render', status: res.ok ? 'Triggered' : 'Failed', code: res.status });
    } catch (e) {
      console.error('[Render] Error triggering deploy hook:', e.message);
      results.push({ platform: 'Render', status: 'Error', error: e.message });
    }
  } else if (renderApiKey) {
    console.log('\n[Render] Using Render API with RENDER_API_KEY...');
    try {
      let serviceId = renderServiceId;

      // If no service ID explicitly configured, discover services from Render API
      if (!serviceId) {
        console.log('[Render] Querying Render API for active services...');
        const sRes = await fetch('https://api.render.com/v1/services?limit=20', {
          headers: {
            'Authorization': `Bearer ${renderApiKey}`,
            'Accept': 'application/json'
          }
        });
        if (sRes.ok) {
          const services = await sRes.json();
          if (Array.isArray(services) && services.length > 0) {
            const match = services.find(s => s.service?.name?.toLowerCase().includes('questo')) || services[0];
            serviceId = match.service?.id;
            console.log(`[Render] Auto-discovered service: ${match.service?.name} (${serviceId})`);
          }
        }
      }

      if (serviceId) {
        console.log(`[Render] Triggering deployment for service ID: ${serviceId}...`);
        const dRes = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${renderApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ clearCache: 'do_not_clear' })
        });
        const dData = await dRes.json();
        console.log(`[Render] Deployment API Response (${dRes.status}):`, dData);
        results.push({ platform: 'Render', status: dRes.ok ? 'Triggered' : 'Failed', code: dRes.status, deployId: dData.id });
      } else {
        console.log('[Render] No active Render service found to trigger. Create static site on Render dashboard first.');
        results.push({ platform: 'Render', status: 'Pending Service Creation', note: 'Create static site on dashboard' });
      }
    } catch (e) {
      console.error('[Render] Error calling Render API:', e.message);
      results.push({ platform: 'Render', status: 'Error', error: e.message });
    }
  } else {
    console.log('\n[Render] Note: Neither RENDER_DEPLOY_HOOK nor RENDER_API_KEY is set.');
    results.push({ platform: 'Render', status: 'Skipped (No Key)', note: 'Set RENDER_API_KEY or RENDER_DEPLOY_HOOK' });
  }
}

// Write to GitHub Step Summary if available
const stepSummary = process.env.GITHUB_STEP_SUMMARY;
if (stepSummary) {
  let table = `
### 🌐 External Deployments Dispatched
| Platform | Status | Details |
|---|---|---|
`;
  for (const r of results) {
    const detail = r.code ? `HTTP ${r.code}` : (r.note || r.error || r.deployId || '-');
    table += `| **${r.platform}** | ${r.status} | ${detail} |\n`;
  }
  fs.appendFileSync(stepSummary, table, 'utf8');
}
