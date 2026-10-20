import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ANCHORS } from '@/constants/anchors';
import { fixtureMismatches, getListedAnchorByDomain } from '@/lib/stellar/listed-anchors';

describe('listed operator: NUGPay', () => {
  const entry = getListedAnchorByDomain('nugpay.app');

  it('is an issuer-only entry, found by every domain', () => {
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('nugpay');
    expect(entry?.kind).toBe('issuer');
    for (const domain of entry?.domains ?? []) {
      expect(getListedAnchorByDomain(domain)).toBe(entry);
    }
  });

  it('lists exactly the DMMK and nUSDT assets', () => {
    expect(entry?.assets).toHaveLength(2);
    expect(entry?.assets).toContainEqual(
      expect.objectContaining({
        code: 'DMMK',
        issuer: 'GDMMKKNI5KTQWFEI57ZTCAPFUJFGQSW5YUN5AJ4O2I25JXEU3IL2DZXD',
      })
    );
    expect(entry?.assets).toContainEqual(
      expect.objectContaining({
        code: 'nUSDT',
        issuer: 'GDNFHWGIGH4PAPBDOWKNHAZIK2M5CM3EVJ6ZR7A3DRQGWOVGJYLNUSDT',
      })
    );
  });

  it('matches its stellar.toml fixture', () => {
    const toml = readFileSync('tests/fixtures/listed/nugpay.toml', 'utf8');
    expect(entry && fixtureMismatches(entry, toml)).toEqual([]);
  });

  it('is not a routable anchor', () => {
    const domains = entry?.domains ?? [];
    for (const a of ANCHORS) {
      expect(domains).not.toContain(a.homeDomain);
      if (a.serviceDomain) expect(domains).not.toContain(a.serviceDomain);
    }
  });
});
