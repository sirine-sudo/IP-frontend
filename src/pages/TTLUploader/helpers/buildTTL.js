// Génère un TTL strictement compatible avec le parser officiel ISO.
// - Types utilisés: mco-core:Contract, mco-core:Party
// - Predicat parties: mco-core:hasParty
// - Aucun blank node [], aucune liste RDF (), aucun _:bnode
// - Valeurs littérales pour les champs simples

const esc = (s) => String(s || "").replace(/"/g, '\\"');

// Construit une IRI entre <...>
const toIri = (id) => {
  const v = String(id || "").trim();
  if (!v) return "<urn:mpeg:mpeg21:mco:contract:auto>";
  if (/^https?:\/\//i.test(v) || /^urn:/i.test(v)) return `<${v}>`;
  // fallback: transforme en urn claire
  return `<urn:mpeg:mpeg21:mco:contract:${encodeURIComponent(v)}>`;
};

// Split et nettoyage d'adresses
const splitAddresses = (csv) =>
  (csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Validation grossière EVM (non bloquante)
const isEthLike = (s) => /^0x[a-fA-F0-9]{40}$/.test(s);

export default function buildTTL(form) {
  // Sujet principal (= contrat)
  const subjectIri = toIri(form?.identifier);
  const identifierLiteral = String(form?.identifier || "urn:mpeg:mpeg21:mco:contract:auto");

  // Champs simples
  const tokenName   = esc(form?.tokenName || "MCO-NFT");
  const tokenSymbol = esc(form?.tokenSymbol || "MCO");
  const contentUri  = esc(form?.contentUri || "");
  const contentHash = esc(form?.contentHash || "0x");

  // Parties
  let parties = splitAddresses(form?.parties);
  if (parties.length === 0) {
    // Le parser officiel ne tombe pas si pas de parties, mais ton pipeline de déploiement en a besoin;
    // on garantit au moins 1 partie typée.
    parties = ["0x0000000000000000000000000000000000000000"];
  }
  parties = parties.map((p) => (isEthLike(p) ? p : "0x0000000000000000000000000000000000000000"));

  // Ligne des parties (valeurs-ressources nommées)
  const hasPartyLine =
    "  mco-core:hasParty " + parties.map((_, i) => `ex:party${i + 1}`).join(", ") + " .";

  // Bloc Parties : chaque sujet est explicitement typé mco-core:Party
  const partiesBlock = parties
    .map(
      (addr, i) => `ex:party${i + 1} a mco-core:Party ;
  rdfs:label "Party ${i + 1}" ;
  mvco:actedBy <${addr}> .`
    )
    .join("\n\n");

  // NB: on expose aussi les champs "Web3" (tokenName, tokenSymbol, contentUri, contentHash)
  // via des prédicats mco-core:* ; s'ils ne sont pas consommés par l'ISO,
  // ils ne cassent rien et restent lisibles dans ton pipeline.
  return `@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix mvco:  <http://purl.oclc.org/NET/mvco.owl#> .
@prefix mco-core: <urn:mpeg:mpeg21:mco:core:2012#> .
@prefix ex:  <http://example.org/> .

${subjectIri} a mco-core:Contract ;
  rdfs:label "${esc(form?.label || "Contract")}" ;
  mco-core:identifier "${esc(identifierLiteral)}" ;
  mco-core:tokenName "${tokenName}" ;
  mco-core:tokenSymbol "${tokenSymbol}" ;
  mco-core:contentUri "${contentUri}" ;
  mco-core:contentHash "${contentHash}" ;
${hasPartyLine}

${partiesBlock}
`;
}
