import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = async name => JSON.parse(await readFile(new URL(`../docs/foundation/${name}.json`, import.meta.url), 'utf8'));
try {
  const [record, registry, risks, baseline] = await Promise.all(['decisions','curriculum-sources','risks','baseline'].map(read));
  for (const value of [record,registry,risks,baseline]) assert.equal(value.schema_version,1);
  const decisions = new Map(record.decisions.map(d=>[d.id,d]));
  assert.equal(decisions.size,5,'D-01 through D-05 must be present once.');
  for(const id of ['D-01','D-02','D-03','D-04','D-05']) assert.ok(decisions.has(id),id);
  const sources = new Map(registry.sources.map(s=>[s.id,s]));
  assert.equal(sources.size,registry.sources.length,'Duplicate official source IDs.');
  const profiles = new Map(registry.profiles.map(p=>[p.id,p]));
  for(const source of sources.values()) {
    for(const field of ['overview_url','syllabus_url','update_url']) if(source[field]) {
      const url=new URL(source[field]);assert.equal(url.protocol,'https:');assert.equal(url.hostname,'www.cambridgeinternational.org');
    }
    assert.ok(source.valid_exam_years.length>0);
    if(source.version_status==='cover_version_observed') assert.ok(Number.isInteger(source.document_version));
    assert.equal(source.adoption,'candidate','Source discovery alone does not adopt a curriculum.');
  }
  for(const profile of profiles.values()) {
    if(profile.exam_year===null){assert.equal(profile.source_ids.length,0);continue;}
    const subjects=new Set();
    for(const id of profile.source_ids){const source=sources.get(id);assert.ok(source,`Unknown source ${id}`);assert.ok(source.valid_exam_years.includes(profile.exam_year),`Wrong syllabus year in ${profile.id}`);subjects.add(source.subject);}
    assert.deepEqual([...subjects].sort(),['biology','chemistry','mathematics','physics']);
    for(const id of profile.source_ids){const source=sources.get(id);assert.equal(profile.grading_by_subject[source.subject],source.grading_scale,`Wrong grade scale in ${profile.id}/${source.subject}`);}
  }
  const exam=decisions.get('D-01');
  if(exam.status==='confirmed') { assert.ok(profiles.has(exam.selected_profile),'Confirmed examination profile must resolve.');assert.ok(exam.selection_evidence,'A confirmed profile needs a recorded user choice.'); }
  else assert.equal(exam.selected_profile,null,'An unanswered examination choice cannot be silently selected.');
  const language=decisions.get('D-02');
  if(language.status==='confirmed'){assert.ok(language.candidate_languages.includes(language.content_language));assert.ok(language.selection_evidence);}
  else assert.equal(language.content_language,null,'An unanswered language choice cannot be silently selected.');
  const review=decisions.get('D-03');
  if(review.status==='confirmed') for(const id of review.required_roles){const role=record.roles.find(r=>r.id===id);assert.ok(role?.assignment&&role.status==='assigned'&&role.assignment_evidence,`${id} needs a real recorded assignment.`);}
  const pending=record.decisions.filter(d=>d.status!=='confirmed').map(d=>d.id).sort();
  assert.deepEqual([...record.gate.pending_decisions].sort(),pending,'Gate and decision records disagree.');
  const ready=pending.length===0;
  assert.equal(record.gate.status,ready?'ready':'not_ready','G0 cannot pass with unanswered decisions.');
  assert.equal(record.status,ready?'ready':'awaiting_user_input');
  assert.equal(record.scope.counts_are,'planned_release_scope_not_completed_content');
  assert.equal(baseline.inventory.content_status,'Draft');
  assert.ok(/^[a-f0-9]{40}$/.test(baseline.source_commit));
  for(const file of baseline.runtime_files) assert.ok(/^[a-f0-9]{64}$/.test(file.sha256));
  assert.equal(new Set(risks.risks.map(r=>r.id)).size,risks.risks.length);
  console.log(`Foundation records: valid. G0: ${record.gate.status}. Pending: ${pending.join(', ')||'none'}.`);
  if(process.argv.includes('--require-ready')&&!ready){console.error('Readiness intentionally withheld until the recorded choices and review assignments exist.');process.exitCode=1;}
} catch(error) { console.error(`Foundation validation failed: ${error.message}`);process.exitCode=1; }
