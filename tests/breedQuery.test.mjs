import assert from 'node:assert/strict'
import test from 'node:test'
import { filterAndSortBreeds, readCollectionFilters } from '../src/lib/breedQuery.ts'

function breed(id, name, lifeSpan = null) {
  return { id, name, lifeSpan, origin: null, temperament: [], description: '', image: null }
}

const ids = (breeds) => breeds.map((item) => item.id)

test('name search trims the query and matches substrings without case sensitivity', () => {
  const breeds = [breed('bs', 'British Shorthair'), breed('bl', 'British Longhair'), breed('si', 'Siamese')]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '  SHORTHAIR  ', 'name', 'asc')), ['bs'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, 'british', 'name', 'asc')), ['bl', 'bs'])
  assert.deepEqual(filterAndSortBreeds(breeds, 'no such breed', 'name', 'asc'), [])
  assert.equal(filterAndSortBreeds(breeds, '   ', 'name', 'asc').length, breeds.length)
})

test('name ordering is natural and case insensitive in either direction', () => {
  const breeds = [breed('10', 'cat 10'), breed('a', 'Alpha'), breed('2', 'Cat 2')]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'asc')), ['a', '2', '10'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'desc')), ['10', '2', 'a'])
})

test('life spans sort numerically by the lower bound across supported range separators', () => {
  const breeds = [breed('12', 'Twelve', '12 – 15'), breed('14', 'Fourteen', '14—16'), breed('8', 'Eight', '8 - 10'), breed('9', 'Nine', '9')]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'lifeSpan', 'asc')), ['8', '9', '12', '14'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'lifeSpan', 'desc')), ['14', '12', '9', '8'])
})

test('missing and invalid life spans remain last for ascending and descending ordering', () => {
  const breeds = [breed('null', 'Zebra'), breed('long', 'Long', '15 - 18'), breed('empty', 'Apple', ' '), breed('short', 'Short', '8 - 10'), breed('unknown', 'Moon', 'Unknown')]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'lifeSpan', 'asc')), ['short', 'long', 'empty', 'unknown', 'null'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'lifeSpan', 'desc')), ['long', 'short', 'empty', 'unknown', 'null'])
})

test('equal life spans have deterministic name and ID tiebreakers', () => {
  const breeds = [breed('z', 'alpha', '12 - 16'), breed('b', 'Beta', '12 - 15'), breed('a', 'Alpha', '12–20')]
  for (const direction of ['asc', 'desc']) {
    assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'lifeSpan', direction)), ['a', 'z', 'b'])
    assert.deepEqual(ids(filterAndSortBreeds([...breeds].reverse(), '', 'lifeSpan', direction)), ['a', 'z', 'b'])
  }
})

test('equal names use ID order consistently', () => {
  const breeds = [breed('z', 'Persian'), breed('a', 'persian')]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'asc')), ['a', 'z'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'desc')), ['a', 'z'])
})

test('filtering and sorting do not mutate the input collection or its records', () => {
  const breeds = Object.freeze([Object.freeze(breed('b', 'Beta', '12 - 15')), Object.freeze(breed('a', 'Alpha', '8 - 10'))])
  const before = structuredClone(breeds)
  const result = filterAndSortBreeds(breeds, '', 'lifeSpan', 'asc')
  assert.notEqual(result, breeds)
  assert.deepEqual(breeds, before)
  assert.deepEqual(ids(result), ['a', 'b'])
  assert.equal(result[0], breeds[1])
})

test('origin matching is exact and case insensitive, with absent values excluded', () => {
  const breeds = [
    { ...breed('us', 'American Shorthair'), origin: 'United States' },
    { ...breed('short', 'Other'), origin: 'United' },
    breed('missing', 'Unknown Origin'),
  ]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'asc', { origin: '  UNITED STATES  ' })), ['us'])
  assert.deepEqual(filterAndSortBreeds(breeds, '', 'name', 'asc', { origin: 'States' }), [])
  assert.deepEqual(filterAndSortBreeds(breeds, '', 'name', 'asc', { origin: 'Atlantis' }), [])
})

test('selected temperaments use OR, while the name and origin remain AND conditions', () => {
  const breeds = [
    { ...breed('play', 'British Shorthair'), origin: 'United Kingdom', temperament: ['Playful'] },
    { ...breed('calm', 'British Longhair'), origin: 'United Kingdom', temperament: ['Calm'] },
    { ...breed('us', 'American Shorthair'), origin: 'United States', temperament: ['Playful', 'Calm'] },
    { ...breed('active', 'British Active'), origin: 'United Kingdom', temperament: ['Active'] },
  ]
  const attributes = { origin: 'united kingdom', temperaments: [' PLAYFUL ', 'calm', 'playful'] }
  assert.deepEqual(ids(filterAndSortBreeds(breeds, ' british ', 'name', 'asc', attributes)), ['calm', 'play'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, 'shorthair', 'name', 'asc', attributes)), ['play'])
  assert.deepEqual(ids(filterAndSortBreeds(breeds, 'british', 'name', 'asc', { temperaments: ['Unknown', 'Playful'] })), ['play'])
})

test('empty attributes do not restrict results and unknown traits produce no matches', () => {
  const breeds = [breed('missing', 'No Traits'), { ...breed('gentle', 'Gentle Cat'), temperament: ['Gentle'] }]
  assert.deepEqual(ids(filterAndSortBreeds(breeds, '', 'name', 'asc', { origin: ' ', temperaments: ['', '  '] })), ['gentle', 'missing'])
  assert.deepEqual(filterAndSortBreeds(breeds, '', 'name', 'asc', { temperaments: ['Unknown'] }), [])
  assert.deepEqual(filterAndSortBreeds([], '', 'name', 'asc', { origin: 'United States', temperaments: ['Gentle'] }), [])
})

test('gallery URL filters parse shared controls and normalize repeated traits without changing parameters', () => {
  const params = new URLSearchParams({ q: '  british ', sort: 'lifeSpan', order: 'desc', origin: ' United Kingdom ' })
  for (const trait of [' Playful ', 'playful', '', '  ', 'CALM', 'calm']) params.append('trait', trait)
  const original = params.toString()
  assert.deepEqual(readCollectionFilters(params, 'gallery'), {
    query: '  british ', sortField: 'lifeSpan', direction: 'desc', origin: 'United Kingdom', temperaments: ['Playful', 'CALM'],
  })
  assert.equal(params.toString(), original)
})

test('list URL filters ignore gallery attributes but preserve search and ordering', () => {
  const params = new URLSearchParams('q=British&sort=lifeSpan&order=desc&origin=United+Kingdom&trait=Playful&trait=Gentle')
  assert.deepEqual(readCollectionFilters(params, 'list'), {
    query: 'British', sortField: 'lifeSpan', direction: 'desc', origin: '', temperaments: [],
  })
})

test('missing or invalid sort controls use defaults while unknown attributes remain active filters', () => {
  const defaults = { query: '', sortField: 'name', direction: 'asc', origin: '', temperaments: [] }
  assert.deepEqual(readCollectionFilters(new URLSearchParams(), 'gallery'), defaults)
  assert.deepEqual(readCollectionFilters(new URLSearchParams('sort=unknown&order=unknown&origin=+&trait=+'), 'gallery'), defaults)
  const filters = readCollectionFilters(new URLSearchParams('origin=Atlantis&trait=Flying'), 'gallery')
  assert.equal(filters.origin, 'Atlantis')
  assert.deepEqual(filters.temperaments, ['Flying'])
  assert.deepEqual(filterAndSortBreeds([breed('cat', 'Cat')], filters.query, filters.sortField, filters.direction, filters), [])
})

test('attribute filtering sorts only matching records without mutating records, traits, or filter options', () => {
  const records = [
    { ...breed('young', 'Young Cat', '8 - 10'), origin: 'United Kingdom', temperament: Object.freeze(['Gentle']) },
    { ...breed('excluded', 'Excluded Cat', '20 - 25'), origin: 'United States', temperament: Object.freeze(['Gentle']) },
    { ...breed('old', 'Old Cat', '12 - 15'), origin: 'United Kingdom', temperament: Object.freeze(['Playful']) },
  ]
  const breeds = Object.freeze(records.map((record) => Object.freeze(record)))
  const attributes = Object.freeze({ origin: 'united kingdom', temperaments: Object.freeze(['gentle', 'playful']) })
  const snapshot = structuredClone({ breeds, attributes })
  const result = filterAndSortBreeds(breeds, 'cat', 'lifeSpan', 'desc', attributes)
  assert.deepEqual(ids(result), ['old', 'young'])
  assert.equal(result[0], breeds[2])
  assert.notEqual(result, breeds)
  assert.deepEqual({ breeds, attributes }, snapshot)
})
