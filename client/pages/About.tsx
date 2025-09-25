export default function About() {
  return (
    <div className="prose prose-neutral max-w-none">
      <h1>About this project</h1>
      <p>
        OceanOS is an AI-driven unified data platform for oceanographic, fisheries, and molecular biodiversity insights. Built to support the Centre for Marine Living Resources and Ecology (CMLRE), Kochi, under the Ministry of Earth Sciences (MoES).
      </p>
      <h2>About CMLRE</h2>
      <p>
        CMLRE organizes and promotes ocean development activities in India, focusing on mapping, assessing, and managing marine living resources in the Indian EEZ. The Marine Living Resources Programme supports ecosystem-based research and monitoring.
      </p>
      <h2>Modules</h2>
      <ul>
        <li>Taxonomy Assistant — curator-in-the-loop classification</li>
        <li>Otolith Morphometrics — interactive shape analysis</li>
        <li>eDNA Browser — molecular hits and species matching</li>
      </ul>
      <h2>Data sources</h2>
      <ul>
        <li>Oceanography (physical, chemical, biological)</li>
        <li>Fisheries (abundance, diversity, life history, ecomorphology)</li>
        <li>Taxonomy, morphology, otoliths</li>
        <li>Molecular biology and eDNA</li>
      </ul>
    </div>
  );
}
